import * as vscode from 'vscode';
import * as path from 'path';
import { FileTreeNode } from '../utils/fileTreeGenerator';

/**
 * Manages the WebView panel for displaying file trees
 */
export class FileTreeView {
    public static currentPanel: FileTreeView | undefined;
    private readonly _panel: vscode.WebviewPanel;
    private readonly _extensionUri: vscode.Uri;
    private _disposables: vscode.Disposable[] = [];

    /**
     * Create or show a FileTreeView panel
     * @param extensionUri The URI of the extension
     * @param folderPath The path of the folder being displayed
     * @param treeContent The formatted tree content to display
     */
    public static createOrShow(extensionUri: vscode.Uri, folderPath: string, treeContent: string): FileTreeView {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;

        // If we already have a panel, show it
        if (FileTreeView.currentPanel) {
            FileTreeView.currentPanel._panel.reveal(column);
            FileTreeView.currentPanel.update(folderPath, treeContent);
            return FileTreeView.currentPanel;
        }

        // Otherwise, create a new panel
        const panel = vscode.window.createWebviewPanel(
            'fileTreeView',
            `File Tree: ${path.basename(folderPath)}`,
            column || vscode.ViewColumn.One,
            {
                enableScripts: true,
                retainContextWhenHidden: true,
                localResourceRoots: [
                    vscode.Uri.joinPath(extensionUri, 'media')
                ]
            }
        );

        const fileTreeView = new FileTreeView(panel, extensionUri);
        fileTreeView.update(folderPath, treeContent);
        return fileTreeView;
    }

    private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
        this._panel = panel;
        this._extensionUri = extensionUri;

        // Set the WebView's initial html content
        this._update();

        // Listen for when the panel is disposed
        // This happens when the user closes the panel or when the panel is closed programmatically
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

        // Handle messages from the WebView
        this._panel.webview.onDidReceiveMessage(
            message => {
                switch (message.command) {
                    case 'copyToClipboard':
                        vscode.env.clipboard.writeText(message.text);
                        vscode.window.showInformationMessage('File tree copied to clipboard');
                        return;
                    case 'saveToFile':
                        this._saveToFile(message.text, message.folderPath);
                        return;
                }
            },
            null,
            this._disposables
        );

        // Update the current panel
        FileTreeView.currentPanel = this;
    }

    /**
     * Update the content of the WebView panel
     * @param folderPath The path of the folder being displayed
     * @param treeContent The formatted tree content to display
     */
    public update(folderPath: string, treeContent: string): void {
        this._panel.title = `File Tree: ${path.basename(folderPath)}`;
        this._panel.webview.postMessage({ 
            command: 'updateContent', 
            folderPath, 
            treeContent 
        });
    }

    /**
     * Save the tree content to a file
     * @param content The tree content to save
     * @param folderPath The folder path where to save the file
     */
    private async _saveToFile(content: string, folderPath: string): Promise<void> {
        try {
            // Ask the user for the file name
            const defaultFileName = 'tree.txt';
            const fileUri = await vscode.window.showSaveDialog({
                defaultUri: vscode.Uri.file(path.join(folderPath, defaultFileName)),
                filters: {
                    'Text files': ['txt', 'md', 'json'],
                    'All files': ['*']
                }
            });

            if (fileUri) {
                // Write the content to the file
                await vscode.workspace.fs.writeFile(fileUri, Buffer.from(content, 'utf8'));
                vscode.window.showInformationMessage(`File tree saved to ${fileUri.fsPath}`);
            }
        } catch (error) {
            vscode.window.showErrorMessage(`Error saving file tree: ${error}`);
        }
    }

    /**
     * Dispose of the WebView panel and resources
     */
    public dispose(): void {
        FileTreeView.currentPanel = undefined;

        // Clean up our resources
        this._panel.dispose();

        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }

    /**
     * Update the WebView's HTML content
     */
    private _update(): void {
        const webview = this._panel.webview;
        this._panel.webview.html = this._getHtmlForWebview(webview);
    }

    /**
     * Get the HTML content for the WebView
     * @param webview The WebView to get HTML for
     * @returns The HTML content
     */
    private _getHtmlForWebview(webview: vscode.Webview): string {
        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>File Tree</title>
            <style>
                body {
                    font-family: var(--vscode-editor-font-family);
                    font-size: var(--vscode-editor-font-size);
                    padding: 0;
                    margin: 0;
                    color: var(--vscode-editor-foreground);
                    background-color: var(--vscode-editor-background);
                }
                .container {
                    padding: 20px;
                }
                .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    padding-bottom: 10px;
                    border-bottom: 1px solid var(--vscode-panel-border);
                }
                .title {
                    font-size: 1.2em;
                    font-weight: bold;
                }
                .actions {
                    display: flex;
                    gap: 10px;
                }
                .button {
                    background-color: var(--vscode-button-background);
                    color: var(--vscode-button-foreground);
                    border: none;
                    padding: 6px 12px;
                    cursor: pointer;
                    border-radius: 2px;
                }
                .button:hover {
                    background-color: var(--vscode-button-hoverBackground);
                }
                pre {
                    white-space: pre;
                    overflow-x: auto;
                    margin: 0;
                    padding: 10px;
                    background-color: var(--vscode-editor-background);
                    border-radius: 3px;
                    font-family: 'Courier New', Courier, monospace;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="title" id="title">File Tree</div>
                    <div class="actions">
                        <button class="button" id="copyBtn">Copy to Clipboard</button>
                        <button class="button" id="saveBtn">Save to File</button>
                    </div>
                </div>
                <pre id="treeContent"></pre>
            </div>

            <script>
                (function() {
                    const vscode = acquireVsCodeApi();
                    let currentContent = '';
                    let currentFolderPath = '';

                    // Handle messages from the extension
                    window.addEventListener('message', event => {
                        const message = event.data;
                        switch (message.command) {
                            case 'updateContent':
                                currentContent = message.treeContent;
                                currentFolderPath = message.folderPath;
                                document.getElementById('title').textContent = 'File Tree: ' + message.folderPath.split('/').pop();
                                document.getElementById('treeContent').textContent = message.treeContent;
                                break;
                        }
                    });

                    // Copy button handler
                    document.getElementById('copyBtn').addEventListener('click', () => {
                        vscode.postMessage({
                            command: 'copyToClipboard',
                            text: currentContent
                        });
                    });

                    // Save button handler
                    document.getElementById('saveBtn').addEventListener('click', () => {
                        vscode.postMessage({
                            command: 'saveToFile',
                            text: currentContent,
                            folderPath: currentFolderPath
                        });
                    });
                }());
            </script>
        </body>
        </html>`;
    }
} 