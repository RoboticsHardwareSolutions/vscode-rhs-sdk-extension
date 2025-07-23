import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { templates, getTemplate, createFullConfig } from './templates';

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
        presets: Object.values(templates).filter(template => template.name !== 'RPLC_TEMPLATE')
    });

    openPanels[pageName] = panel;

    panel.onDidDispose(() => {
        openPanels[pageName] = undefined;
    });

    panel.webview.onDidReceiveMessage(
        message => {
            switch (message.command) {
                case 'rplcListChanged':
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
                    vscode.window.showInformationMessage(`Creating new config: ${message.name}`);
                    try {
                        const newConfig = createFullConfig(message.name, message.memory);
                        panel.webview.postMessage({
                            command: 'updatePresetView',
                            preset: newConfig
                        });
                    } catch (error) {
                        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                        vscode.window.showErrorMessage(`Error creating config: ${errorMessage}`);
                    }
                    break;
                case 'saveConfig':
                    // Обработка сохранения конфигурации
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
