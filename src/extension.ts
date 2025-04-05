// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { FileTreeGenerator, FileTreeOptions } from './utils/fileTreeGenerator';
import { FileTreeView } from './views/fileTreeView';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log('File Tree Generator extension is now active');

	// Register the commands
	const generateFileTreeCommand = vscode.commands.registerCommand('file-tree-gen.generateFileTree', async (resource: vscode.Uri) => {
		await handleGenerateFileTree(context, resource);
	});

	const saveFileTreeCommand = vscode.commands.registerCommand('file-tree-gen.saveFileTree', async (resource: vscode.Uri) => {
		await handleSaveFileTree(context, resource);
	});

	const copyFileTreeCommand = vscode.commands.registerCommand('file-tree-gen.copyFileTree', async (resource: vscode.Uri) => {
		await handleCopyFileTree(context, resource);
	});

	// Add commands to subscriptions
	context.subscriptions.push(generateFileTreeCommand);
	context.subscriptions.push(saveFileTreeCommand);
	context.subscriptions.push(copyFileTreeCommand);
}

// This method is called when your extension is deactivated
export function deactivate() {}

/**
 * Get the file tree options from the VS Code configuration
 * @returns The file tree options
 */
function getFileTreeOptions(): FileTreeOptions {
	const config = vscode.workspace.getConfiguration('fileTreeGen');
	
	return {
		maxDepth: config.get<number>('maxDepth') ?? -1,
		excludePatterns: config.get<string[]>('excludePatterns') ?? [],
		useGitignore: config.get<boolean>('useGitignore') ?? true,
		format: config.get<'text' | 'markdown' | 'json'>('defaultFormat') ?? 'text'
	};
}

/**
 * Handle the generate file tree command
 * @param context The extension context
 * @param resource The URI of the folder to generate the tree for
 */
async function handleGenerateFileTree(context: vscode.ExtensionContext, resource?: vscode.Uri): Promise<void> {
	try {
		// Validate the resource
		if (!resource) {
			const selectedResource = await promptForFolder();
			if (!selectedResource) {
				return;
			}
			resource = selectedResource;
		}

		// Check if the resource is a directory
		const stat = await vscode.workspace.fs.stat(resource);
		if (stat.type !== vscode.FileType.Directory) {
			vscode.window.showErrorMessage('Please select a folder to generate a file tree');
			return;
		}

		// Show progress indicator
		await vscode.window.withProgress({
			location: vscode.ProgressLocation.Notification,
			title: 'Generating file tree...',
			cancellable: false
		}, async (progress) => {
			// Get the file tree options
			const options = getFileTreeOptions();
			
			// Generate the file tree
			const generator = new FileTreeGenerator(options);
			const rootNode = await generator.generateTree(resource!.fsPath);
			const treeContent = generator.formatTree(rootNode);
			
			// Show the file tree in a WebView
			FileTreeView.createOrShow(context.extensionUri, resource!.fsPath, treeContent);
		});
	} catch (error) {
		vscode.window.showErrorMessage(`Error generating file tree: ${error}`);
	}
}

/**
 * Handle the save file tree command
 * @param context The extension context
 * @param resource The URI of the folder to generate the tree for
 */
async function handleSaveFileTree(context: vscode.ExtensionContext, resource?: vscode.Uri): Promise<void> {
	try {
		// Validate the resource
		if (!resource) {
			const selectedResource = await promptForFolder();
			if (!selectedResource) {
				return;
			}
			resource = selectedResource;
		}

		// Check if the resource is a directory
		const stat = await vscode.workspace.fs.stat(resource);
		if (stat.type !== vscode.FileType.Directory) {
			vscode.window.showErrorMessage('Please select a folder to generate a file tree');
			return;
		}

		// Show progress indicator
		await vscode.window.withProgress({
			location: vscode.ProgressLocation.Notification,
			title: 'Generating file tree...',
			cancellable: false
		}, async (progress) => {
			// Get the file tree options
			const options = getFileTreeOptions();
			
			// Generate the file tree
			const generator = new FileTreeGenerator(options);
			const rootNode = await generator.generateTree(resource!.fsPath);
			const treeContent = generator.formatTree(rootNode);
			
			// Ask the user for the file name
			const defaultFileName = 'tree.txt';
			const fileUri = await vscode.window.showSaveDialog({
				defaultUri: vscode.Uri.file(path.join(resource!.fsPath, defaultFileName)),
				filters: {
					'Text files': ['txt', 'md', 'json'],
					'All files': ['*']
				}
			});

			if (fileUri) {
				// Write the content to the file
				await vscode.workspace.fs.writeFile(fileUri, Buffer.from(treeContent, 'utf8'));
				vscode.window.showInformationMessage(`File tree saved to ${fileUri.fsPath}`);
				
				// Open the file in the editor
				const document = await vscode.workspace.openTextDocument(fileUri);
				await vscode.window.showTextDocument(document);
			}
		});
	} catch (error) {
		vscode.window.showErrorMessage(`Error saving file tree: ${error}`);
	}
}

/**
 * Handle the copy file tree command
 * @param context The extension context
 * @param resource The URI of the folder to generate the tree for
 */
async function handleCopyFileTree(context: vscode.ExtensionContext, resource?: vscode.Uri): Promise<void> {
	try {
		// Validate the resource
		if (!resource) {
			const selectedResource = await promptForFolder();
			if (!selectedResource) {
				return;
			}
			resource = selectedResource;
		}

		// Check if the resource is a directory
		const stat = await vscode.workspace.fs.stat(resource);
		if (stat.type !== vscode.FileType.Directory) {
			vscode.window.showErrorMessage('Please select a folder to generate a file tree');
			return;
		}

		// Show progress indicator
		await vscode.window.withProgress({
			location: vscode.ProgressLocation.Notification,
			title: 'Generating file tree...',
			cancellable: false
		}, async (progress) => {
			// Get the file tree options
			const options = getFileTreeOptions();
			
			// Generate the file tree
			const generator = new FileTreeGenerator(options);
			const rootNode = await generator.generateTree(resource!.fsPath);
			const treeContent = generator.formatTree(rootNode);
			
			// Copy the tree content to the clipboard
			await vscode.env.clipboard.writeText(treeContent);
			vscode.window.showInformationMessage('File tree copied to clipboard');
		});
	} catch (error) {
		vscode.window.showErrorMessage(`Error copying file tree: ${error}`);
	}
}

/**
 * Prompt the user to select a folder
 * @returns A promise that resolves to the selected folder URI or undefined if cancelled
 */
async function promptForFolder(): Promise<vscode.Uri | undefined> {
	const options: vscode.OpenDialogOptions = {
		canSelectFiles: false,
		canSelectFolders: true,
		canSelectMany: false,
		openLabel: 'Select Folder'
	};

	const folderUris = await vscode.window.showOpenDialog(options);
	return folderUris && folderUris.length > 0 ? folderUris[0] : undefined;
}
