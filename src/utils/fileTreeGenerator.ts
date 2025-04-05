import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import * as ignore from 'ignore';

export interface FileTreeOptions {
    maxDepth: number;
    excludePatterns: string[];
    useGitignore: boolean;
    format: 'text' | 'markdown' | 'json';
}

export interface FileTreeNode {
    name: string;
    path: string;
    isDirectory: boolean;
    children?: FileTreeNode[];
}

/**
 * Generates a file tree structure from a given directory path
 */
export class FileTreeGenerator {
    private ignoreRules: ignore.Ignore | null = null;
    private options: FileTreeOptions;

    constructor(options: FileTreeOptions) {
        this.options = options;
    }

    /**
     * Generate a file tree structure from a given directory path
     * @param dirPath The directory path to generate the tree from
     * @returns A promise that resolves to the root node of the tree
     */
    public async generateTree(dirPath: string): Promise<FileTreeNode> {
        // Initialize ignore rules if using gitignore
        if (this.options.useGitignore) {
            this.ignoreRules = ignore.default();
            await this.loadGitignoreRules(dirPath);
        }

        // Add custom exclude patterns
        if (this.options.excludePatterns.length > 0 && this.ignoreRules) {
            this.ignoreRules.add(this.options.excludePatterns);
        } else if (this.options.excludePatterns.length > 0) {
            this.ignoreRules = ignore.default().add(this.options.excludePatterns);
        }

        // Generate the tree
        const rootNode: FileTreeNode = {
            name: path.basename(dirPath),
            path: dirPath,
            isDirectory: true,
            children: []
        };

        await this.processDirectory(rootNode, 0);
        return rootNode;
    }

    /**
     * Process a directory and its contents recursively
     * @param node The current node being processed
     * @param depth The current depth in the tree
     */
    private async processDirectory(node: FileTreeNode, depth: number): Promise<void> {
        // Check if we've reached the maximum depth
        if (this.options.maxDepth !== -1 && depth >= this.options.maxDepth) {
            return;
        }

        try {
            const entries = await fs.promises.readdir(node.path, { withFileTypes: true });
            
            // Sort entries: directories first, then files, both alphabetically
            entries.sort((a, b) => {
                if (a.isDirectory() && !b.isDirectory()) {
                    return -1;
                }
                if (!a.isDirectory() && b.isDirectory()) {
                    return 1;
                }
                return a.name.localeCompare(b.name);
            });

            for (const entry of entries) {
                const entryPath = path.join(node.path, entry.name);
                const relativePath = path.relative(vscode.workspace.rootPath || '', entryPath);
                
                // Skip if the entry matches ignore rules
                if (this.ignoreRules && this.ignoreRules.ignores(relativePath)) {
                    continue;
                }

                const childNode: FileTreeNode = {
                    name: entry.name,
                    path: entryPath,
                    isDirectory: entry.isDirectory()
                };

                if (entry.isDirectory()) {
                    childNode.children = [];
                    node.children!.push(childNode);
                    await this.processDirectory(childNode, depth + 1);
                    
                    // Remove empty directories if they have no children
                    if (childNode.children!.length === 0) {
                        node.children = node.children!.filter(child => child !== childNode);
                    }
                } else {
                    node.children!.push(childNode);
                }
            }
        } catch (error) {
            console.error(`Error processing directory ${node.path}:`, error);
            throw error;
        }
    }

    /**
     * Load .gitignore rules from the closest .gitignore file
     * @param dirPath The directory path to start looking for .gitignore files
     */
    private async loadGitignoreRules(dirPath: string): Promise<void> {
        if (!this.ignoreRules) {
            this.ignoreRules = ignore.default();
        }

        try {
            // Find the closest .gitignore file
            let currentDir = dirPath;
            let gitignorePath = '';
            
            while (currentDir !== path.parse(currentDir).root) {
                const potentialGitignorePath = path.join(currentDir, '.gitignore');
                
                try {
                    await fs.promises.access(potentialGitignorePath, fs.constants.R_OK);
                    gitignorePath = potentialGitignorePath;
                    break;
                } catch {
                    // .gitignore not found in this directory, move up
                    currentDir = path.dirname(currentDir);
                }
            }

            // If a .gitignore file was found, load its rules
            if (gitignorePath) {
                const gitignoreContent = await fs.promises.readFile(gitignorePath, 'utf8');
                const rules = gitignoreContent
                    .split('\n')
                    .filter(line => line.trim() !== '' && !line.startsWith('#'));
                
                this.ignoreRules.add(rules);
            }
        } catch (error) {
            console.error('Error loading .gitignore rules:', error);
            // Continue without gitignore rules if there's an error
        }
    }

    /**
     * Format the file tree as a string based on the specified format
     * @param rootNode The root node of the tree
     * @returns A formatted string representation of the tree
     */
    public formatTree(rootNode: FileTreeNode): string {
        switch (this.options.format) {
            case 'text':
                return this.formatAsText(rootNode);
            case 'markdown':
                return this.formatAsMarkdown(rootNode);
            case 'json':
                return this.formatAsJSON(rootNode);
            default:
                return this.formatAsText(rootNode);
        }
    }

    /**
     * Format the file tree as plain text (similar to the Unix 'tree' command)
     * @param node The current node being processed
     * @param prefix The prefix to use for the current line
     * @param isLast Whether the current node is the last child of its parent
     * @returns A formatted string representation of the tree
     */
    private formatAsText(node: FileTreeNode, prefix = '', isLast = true): string {
        let result = prefix;
        
        if (prefix !== '') {
            result += isLast ? '└── ' : '├── ';
        }
        
        result += node.name + '\n';
        
        if (node.children && node.children.length > 0) {
            const newPrefix = prefix + (isLast ? '    ' : '│   ');
            
            for (let i = 0; i < node.children.length; i++) {
                const child = node.children[i];
                const isLastChild = i === node.children.length - 1;
                result += this.formatAsText(child, newPrefix, isLastChild);
            }
        }
        
        return result;
    }

    /**
     * Format the file tree as Markdown
     * @param node The current node being processed
     * @param depth The current depth in the tree
     * @returns A formatted Markdown representation of the tree
     */
    private formatAsMarkdown(node: FileTreeNode, depth = 0): string {
        let result = '';
        
        if (depth === 0) {
            result += `# File Tree: ${node.name}\n\n`;
        } else {
            const indent = '  '.repeat(depth - 1);
            const icon = node.isDirectory ? '📁' : '📄';
            result += `${indent}- ${icon} ${node.name}\n`;
        }
        
        if (node.children && node.children.length > 0) {
            for (const child of node.children) {
                result += this.formatAsMarkdown(child, depth + 1);
            }
        }
        
        return result;
    }

    /**
     * Format the file tree as JSON
     * @param rootNode The root node of the tree
     * @returns A formatted JSON representation of the tree
     */
    private formatAsJSON(rootNode: FileTreeNode): string {
        // Create a simplified version of the tree for JSON output
        const simplifyNode = (node: FileTreeNode): any => {
            const result: any = {
                name: node.name,
                type: node.isDirectory ? 'directory' : 'file'
            };
            
            if (node.children && node.children.length > 0) {
                result.children = node.children.map(simplifyNode);
            }
            
            return result;
        };
        
        return JSON.stringify(simplifyNode(rootNode), null, 2);
    }
} 