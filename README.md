# File Tree Generator

A VS Code extension that allows you to generate, visualize, and export file trees from folders in your workspace.

## Features

- **Generate File Trees**: Right-click on any folder in the Explorer view to generate a visual representation of its file structure.
- **Multiple Output Formats**: View file trees in plain text (similar to Unix `tree` command), Markdown, or JSON format.
- **Customizable Exclusions**: Configure patterns to exclude from the file tree, with built-in support for `.gitignore` files.
- **Save to File**: Save the generated file tree to a text file in various formats.
- **Copy to Clipboard**: Copy the file tree to the clipboard for easy sharing.
- **Interactive View**: View the file tree in an interactive panel within VS Code.

## Usage

### Generating a File Tree

1. Right-click on a folder in the Explorer view.
2. Select one of the following options:
   - **Generate File Tree**: Opens the file tree in a VS Code panel.
   - **Save File Tree**: Generates the file tree and prompts you to save it to a file.
   - **Copy File Tree to Clipboard**: Generates the file tree and copies it to the clipboard.

### Configuration Options

This extension provides several configuration options:

- **Exclude Patterns**: Specify patterns to exclude from the file tree (e.g., `node_modules`, `.git`).
- **Maximum Depth**: Limit the depth of the file tree (-1 for unlimited).
- **Use .gitignore**: Enable or disable the use of `.gitignore` files to exclude files and folders.
- **Default Format**: Choose the default format for the file tree (text, markdown, or JSON).

To access these settings, go to **File > Preferences > Settings** and search for "File Tree Generator".

## Examples

### Plain Text Format (Default)

```
project/
├── src/
│   ├── components/
│   │   ├── Button.tsx
│   │   └── Header.tsx
│   ├── utils/
│   │   └── helpers.ts
│   └── index.ts
├── package.json
└── README.md
```

### Markdown Format

```markdown
# File Tree: project

- 📁 src
  - 📁 components
    - 📄 Button.tsx
    - 📄 Header.tsx
  - 📁 utils
    - 📄 helpers.ts
  - 📄 index.ts
- 📄 package.json
- 📄 README.md
```

### JSON Format

```json
{
  "name": "project",
  "type": "directory",
  "children": [
    {
      "name": "src",
      "type": "directory",
      "children": [
        {
          "name": "components",
          "type": "directory",
          "children": [
            {
              "name": "Button.tsx",
              "type": "file"
            },
            {
              "name": "Header.tsx",
              "type": "file"
            }
          ]
        },
        {
          "name": "utils",
          "type": "directory",
          "children": [
            {
              "name": "helpers.ts",
              "type": "file"
            }
          ]
        },
        {
          "name": "index.ts",
          "type": "file"
        }
      ]
    },
    {
      "name": "package.json",
      "type": "file"
    },
    {
      "name": "README.md",
      "type": "file"
    }
  ]
}
```

## Requirements

- VS Code 1.98.0 or higher

## Extension Settings

This extension contributes the following settings:

* `fileTreeGen.excludePatterns`: Array of patterns to exclude from the file tree.
* `fileTreeGen.maxDepth`: Maximum depth of the file tree (-1 for unlimited).
* `fileTreeGen.useGitignore`: Whether to use .gitignore files to exclude files and folders.
* `fileTreeGen.defaultFormat`: Default format for the file tree (text, markdown, or JSON).

## Known Issues

None at this time.

## Release Notes

### 0.0.1

Initial release of File Tree Generator.

---

## Following extension guidelines

Ensure that you've read through the extensions guidelines and follow the best practices for creating your extension.

* [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

## Working with Markdown

You can author your README using Visual Studio Code. Here are some useful editor keyboard shortcuts:

* Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux).
* Toggle preview (`Shift+Cmd+V` on macOS or `Shift+Ctrl+V` on Windows and Linux).
* Press `Ctrl+Space` (Windows, Linux, macOS) to see a list of Markdown snippets.

## For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**
