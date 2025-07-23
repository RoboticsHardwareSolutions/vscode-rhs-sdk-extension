import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import { templates, getTemplate, createFullConfig } from './templates';

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
    panel.webview.postMessage({
        command: 'initialize',
        presets: Object.values(templates).filter(template => template.name !== 'BMPLC_TEMPLATE')
    });

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
						const fullConfig = createFullConfig(message.name || 'MY_CUSTOM_BMPLC', message.memory || 512);
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
                    // Handle configuration saving
                    // saveConfiguration(message.config);
                    break;
            }
        },
        undefined,
        context.subscriptions
    );

    const htmlPath = path.join(context.extensionPath, 'src', 'webviews', `${pageName}.html`);

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

        content = content.replace(/(src|href)="([^"]*)"/g, (match, p1, p2) => {
            return `${p1}="${panel.webview.asWebviewUri(vscode.Uri.file(path.join(context.extensionPath, 'src', 'webviews'
                , p2)))}"`;
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
