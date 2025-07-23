# RHS SDK Tools Quick Start

## 🎯 For Developers (F5)

```bash
# 1. Clone and setup
git clone https://github.com/RoboticsHardwareSolutions/vscode-rhs-sdk-extension.git
cd vscode-rhs-sdk-extension
npm install

# 2. Build project
npm run package

# 3. Open in VS Code and press F5
code .
```

## 📦 For Users (extension installation)

```bash
# 1. Create VSIX package
npm install -g vsce
vsce package

# 2. Install in VS Code
# Extensions: Install from VSIX... → select rhs-sdk-0.0.1.vsix
```

## ✨ Usage

1. **Find RHS SDK icon** in VS Code sidebar
2. **Creator** - create new BMPLC configurations
3. **Editor** - edit existing `bmplc_config.json` files

## 🔧 Development Commands

- `npm run package` - full build
- `npm run watch` - development with auto-rebuild  
- `npm run compile` - quick build for F5
- `F5` - launch Extension Development Host
