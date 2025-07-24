import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import { templates, getTemplate, createFullConfig } from './templates';
import { BMPLCConfig } from './webviews/config_presets';

const execAsync = promisify(exec);

export function activate(context: vscode.ExtensionContext) {
    const view = vscode.window.createTreeView('rhs-sdk.tools', {
        treeDataProvider: new ToolsProvider(context),
        showCollapseAll: true
    });

    context.subscriptions.push(
        vscode.commands.registerCommand('rhs-sdk.tools.open', (pageName: string) => {
            openHtmlPage(context, pageName);
        })
    );

    // Setup workspace watcher for auto-opening editor - DISABLED
    // setupWorkspaceWatcher(context);
}

const openPanels: Record<string, vscode.WebviewPanel | undefined> = {};

function openHtmlPage(context: vscode.ExtensionContext, pageName: string) {

    const existingPanel = openPanels[pageName];

    if (existingPanel) {
        existingPanel.reveal();
        return;
    }

    const panel = vscode.window.createWebviewPanel(
        `toolsPage.${pageName}`,
        pageName,
        vscode.ViewColumn.One,
        {
            enableScripts: true,
            retainContextWhenHidden: true
        }
    );

    // panel.webview.html = getWebviewContent(context, panel);
    
    // Initialize different pages with different data
    if (pageName === 'editor') {
        // For editor, find and send existing configurations
        const workspaceFolders = vscode.workspace.workspaceFolders;
        const foundConfigs: Array<{ path: string, config: BMPLCConfig }> = [];
        
        if (workspaceFolders) {
            for (const folder of workspaceFolders) {
                const configPaths = findBMPLCConfigs(folder.uri.fsPath);
                for (const configPath of configPaths) {
                    try {
                        const configContent = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
                        foundConfigs.push({
                            path: configPath,
                            config: configContent
                        });
                    } catch (error) {
                        // Skip invalid configs
                    }
                }
            }
        }
        
        panel.webview.postMessage({
            command: 'initialize',
            pageType: 'editor',
            configs: foundConfigs,
            workspacePath: workspaceFolders?.[0]?.uri.fsPath || ''
        });
    } else {
        // For creator, send templates
        panel.webview.postMessage({
            command: 'initialize',
            pageType: 'creator',
            presets: Object.values(templates).filter(template => template.name !== 'BMPLC_TEMPLATE')
        });
    }

    openPanels[pageName] = panel;

    panel.onDidDispose(() => {
        openPanels[pageName] = undefined;
    });

    panel.webview.onDidReceiveMessage(
        async message => {
            switch (message.command) {
                case 'bmplcListChanged':
                    vscode.window.showInformationMessage(`Selected value: ${message.value}`);
                    const preset = getTemplate(message.value);
                    if (preset) {
                        panel.webview.postMessage({
                            command: 'updatePresetView',
                            preset: preset
                        });
                    }
                    break;
                case 'createNewConfig':
					try {
						const fullConfig = createFullConfig(message.name || 'MY_CUSTOM_BMPLC', message.microcontroller || 'STM32F407VG');
						panel.webview.postMessage({
							command: 'updatePresetView',
							preset: fullConfig
						});
					} catch (error) {
						console.error('Error creating new config:', error);
						vscode.window.showErrorMessage('Error creating new config');
					}
					break;

				case 'saveConfigToRepo':
					try {
						await saveConfigToRepository(message.config);
					} catch (error) {
						console.error('Error saving config to repository:', error);
						vscode.window.showErrorMessage('Error saving config to repository');
					}
					break;
                case 'saveConfig':
                    // Handle configuration saving to existing file
                    try {
                        if (message.filePath && message.config) {
                            fs.writeFileSync(message.filePath, JSON.stringify(message.config, null, 2), 'utf-8');
                            vscode.window.showInformationMessage(`Configuration saved to ${path.basename(message.filePath)}`);
                            
                            // Refresh the editor to show updated config
                            if (panel.title === 'editor') {
                                const workspaceFolders = vscode.workspace.workspaceFolders;
                                if (workspaceFolders) {
                                    const foundConfigs: Array<{ path: string, config: BMPLCConfig }> = [];
                                    
                                    for (const folder of workspaceFolders) {
                                        const configPaths = findBMPLCConfigs(folder.uri.fsPath);
                                        for (const configPath of configPaths) {
                                            try {
                                                const configContent = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
                                                foundConfigs.push({
                                                    path: configPath,
                                                    config: configContent
                                                });
                                            } catch (error) {
                                                // Skip invalid configs
                                            }
                                        }
                                    }
                                    
                                    panel.webview.postMessage({
                                        command: 'refreshConfigs',
                                        configs: foundConfigs,
                                        workspacePath: workspaceFolders[0].uri.fsPath
                                    });
                                }
                            }
                        }
                    } catch (error) {
                        console.error('Error saving config:', error);
                        vscode.window.showErrorMessage('Error saving configuration');
                    }
                    break;
            }
        },
        undefined,
        context.subscriptions
    );

    // Try dist/webviews first (production), then src/webviews (development)
    let htmlPath = path.join(context.extensionPath, 'dist', 'webviews', `${pageName}.html`);
    if (!fs.existsSync(htmlPath)) {
        htmlPath = path.join(context.extensionPath, 'src', 'webviews', `${pageName}.html`);
    }

    fs.readFile(htmlPath, 'utf8', (err, content) => {
        if (err) {
            panel.webview.html = `<!DOCTYPE html>
                <html>
                <body>
                    <h1>Error loading page</h1>
                    <p>${err.message}</p>
                </body>
                </html>`;
            return;
        }

        // const resourcePath = vscode.Uri.file(path.join(context.extensionPath, 'src', 'webviews'));

        // Determine webviews path (dist or src)
        let webviewsPath = path.join(context.extensionPath, 'dist', 'webviews');
        if (!fs.existsSync(webviewsPath)) {
            webviewsPath = path.join(context.extensionPath, 'src', 'webviews');
        }

        content = content.replace(/(src|href)="([^"]*)"/g, (match, p1, p2) => {
            return `${p1}="${panel.webview.asWebviewUri(vscode.Uri.file(path.join(webviewsPath, p2)))}"`;
        });

        panel.webview.html = content;
    });
}

async function saveConfigToRepository(config: any) {
    const repoUrl = 'https://github.com/RoboticsHardwareSolutions/BMPLC_Quick_Project.git';
    
    // Show folder selection dialog
    const folderUri = await vscode.window.showOpenDialog({
        canSelectFiles: false,
        canSelectFolders: true,
        canSelectMany: false,
        openLabel: 'Select folder for project cloning'
    });

    if (!folderUri || folderUri.length === 0) {
        return;
    }

    const targetPath = folderUri[0].fsPath;
    const projectName = 'BMPLC_Quick_Project';
    const projectPath = path.join(targetPath, projectName);

    try {
        // Show progress
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "Cloning repository and saving configuration",
            cancellable: false
        }, async (progress) => {
            progress.report({ message: "Cloning repository..." });
            
            // Clone repository
            await execAsync(`git clone --recursive ${repoUrl}`, { cwd: targetPath });
            
            progress.report({ message: "Saving configuration..." });
            
            // Save configuration to file
            const configFilePath = path.join(projectPath, 'bmplc_config.json');
            fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2));
            
            progress.report({ message: "Done!" });
        });

        // Offer to open project folder
        const choice = await vscode.window.showInformationMessage(
            'Project created successfully! Open project folder?',
            'Open', 'Cancel'
        );

        if (choice === 'Open') {
            await vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(projectPath), true);
        }

    } catch (error) {
        console.error('Error cloning repository or saving config:', error);
        vscode.window.showErrorMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

class ToolsProvider implements vscode.TreeDataProvider<ToolItem> {
    constructor(private context: vscode.ExtensionContext) { }

    getTreeItem(element: ToolItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: ToolItem): Thenable<ToolItem[]> {
        if (element) {
            return Promise.resolve([]);
        } else {
            return Promise.resolve([
                new ToolItem('Creator', 'creator', {
                    command: 'rhs-sdk.tools.open',
                    title: '',
                    arguments: ['creator']
                }),
                new ToolItem('Editor', 'editor', {
                    command: 'rhs-sdk.tools.open',
                    title: '',
                    arguments: ['editor']
                })
            ]);
        }
    }
}

class ToolItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        private pageName: string,
        public readonly command: vscode.Command
    ) {
        super(label, vscode.TreeItemCollapsibleState.None);
        this.tooltip = `${this.label}`;
        this.description = '';
    }

    iconPath = {
        light: vscode.Uri.file(path.join(__dirname, '..', 'media', 'light', 'tool.svg')),
        dark: vscode.Uri.file(path.join(__dirname, '..', 'media', 'dark', 'tool.svg'))
    };
}

// Smart config file naming function
function getConfigFileName(config: BMPLCConfig): string {
    // Always use standard filename for consistency
    return 'bmplc_config.json';
}

// Function to check if file is BMPLC configuration by filename
function isBMPLCConfigFile(filename: string): boolean {
    // Only accept files named exactly "bmplc_config.json"
    return filename.toLowerCase() === 'bmplc_config.json';
}

// Function to validate if JSON content is actually a BMPLC config
function validateBMPLCConfig(filePath: string): boolean {
    try {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        // Check required BMPLC configuration fields
        return content.name && 
               content.microcontroller && 
               content.hal && 
               content.compileDefinition;
    } catch {
        return false;
    }
}

// Function to find BMPLC configuration files in project
function findBMPLCConfigs(workspacePath: string): string[] {
    const configs: string[] = [];
    
    function searchDirectory(dir: string, maxDepth: number = 3): void {
        if (maxDepth <= 0) {
            return;
        }
        
        try {
            const files = fs.readdirSync(dir);
            
            for (const file of files) {
                const fullPath = path.join(dir, file);
                const stat = fs.statSync(fullPath);
                
                if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
                    searchDirectory(fullPath, maxDepth - 1);
                } else if (isBMPLCConfigFile(file)) {
                    // First check by filename, then validate content
                    if (validateBMPLCConfig(fullPath)) {
                        configs.push(fullPath);
                    }
                }
            }
        } catch (error) {
            // Skip directories we can't read
        }
    }
    
    if (fs.existsSync(workspacePath)) {
        searchDirectory(workspacePath);
    }
    
    return configs;
}

// Function to watch for workspace changes and auto-open editor - DISABLED
// function setupWorkspaceWatcher(context: vscode.ExtensionContext) {
//     // Check on activation
//     checkAndOpenEditor(context);
    
//     // Watch for file changes
//     const watcher = vscode.workspace.createFileSystemWatcher('**/*.json');
    
//     watcher.onDidCreate(() => checkAndOpenEditor(context));
//     watcher.onDidChange(() => checkAndOpenEditor(context));
    
//     context.subscriptions.push(watcher);
// }

// Function to check workspace and open editor if configs found - DISABLED
// function checkAndOpenEditor(context: vscode.ExtensionContext) {
//     const workspaceFolders = vscode.workspace.workspaceFolders;
//     if (!workspaceFolders) {
//         return;
//     }
    
//     for (const folder of workspaceFolders) {
//         const configs = findBMPLCConfigs(folder.uri.fsPath);
//         if (configs.length > 0) {
//             // Auto-open editor if configs found
//             setTimeout(() => {
//                 openHtmlPage(context, 'editor');
//             }, 1000); // Delay to avoid rapid opening
//             break;
//         }
//     }
// }
