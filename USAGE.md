# RHS SDK Tools - Installation and Usage Guide

VS Code extension for BMPLC (BareMetal PLC) configuration management.

## 🚀 Installation and Launch

### Option 1: Run from Source Code (for development)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/RoboticsHardwareSolutions/vscode-rhs-sdk-extension.git
   cd vscode-rhs-sdk-extension
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Build the project:**
   ```bash
   npm run package
   ```

4. **Open project in VS Code:**
   ```bash
   code .
   ```

5. **Launch Extension Development Host:**
   - Press `F5` in VS Code
   - Or use menu `Run > Start Debugging`
   - A new VS Code window will open with title `[Extension Development Host]`

### Option 2: Install from VSIX file

1. **Create VSIX package:**
   ```bash
   npm install -g vsce
   npm run package
   vsce package
   ```

2. **Install extension:**
   - In VS Code: `Ctrl+Shift+P` → `Extensions: Install from VSIX...`
   - Select the created file `rhs-sdk-0.0.1.vsix`

## 🎯 Using the Extension

### Extension Activation

After launch/installation, the **RHS SDK** icon will appear in the VS Code sidebar.

![RHS SDK Icon](src/media/RHS.svg)

### Tools Panel

Click on the RHS SDK icon → opens **"BMPLC Tools"** panel with two tools:

#### 1. 📝 Creator - Configuration Creation
- **Purpose:** Create new BMPLC configurations
- **Features:**
  - Select ready-made templates (BMPLC_XL, BMPLC_L, BMPLC_M)
  - Create custom configuration
  - Configure parameters (name, memory, options)
  - Save to local project or clone repository

#### 2. ✏️ Editor - Configuration Editing
- **Purpose:** Edit existing BMPLC configurations
- **Features:**
  - Automatic detection of `bmplc_config.json` files
  - Edit configuration parameters
  - Save changes to file

## 📋 Detailed Usage

### Creator (Configuration Creation)

1. **Select a ready template:**
   - `BMPLC_XL` - extended configuration
   - `BMPLC_L` - large configuration  
   - `BMPLC_M` - medium configuration

2. **Or create a new configuration:**
   - Enter configuration name
   - Specify memory size (256-4096 KB)
   - Click "Create New Configuration"

3. **Configure parameters:**
   - Change name and memory
   - Configure HAL options
   - Enable/disable services
   - Configure testing

4. **Save configuration:**
   - **"Save Configuration to File"** - save to current folder
   - **"Save Configuration to Repository"** - clone template project

### Editor (Configuration Editing)

1. **Automatic detection:**
   - Extension automatically finds all `bmplc_config.json` files in project
   - Displays path to found file

2. **Editing:**
   - Configuration loads automatically
   - Change parameters in interface
   - All changes apply in real time

3. **Saving:**
   - Click "Save Configuration to File"
   - Changes will be saved to original `bmplc_config.json` file

## 📁 File Structure

### Configuration Templates
Extension includes ready templates:

- `bmplc_xl.json` - maximum configuration
- `bmplc_l.json` - large configuration
- `bmplc_m.json` - medium configuration
- `bmplc_template.json` - base template with all options

### Created Files
- `bmplc_config.json` - main BMPLC configuration file

## ⚡ Quick Start

1. **Launch extension** (F5 or install from VSIX)
2. **Open RHS SDK panel** in sidebar
3. **Create configuration:**
   - Select Creator → BMPLC_M → Save Configuration to File
4. **Edit configuration:**
   - Select Editor → change parameters → Save

## 🔧 Development

### Available Commands

```bash
# Install dependencies
npm install

# Build project
npm run compile

# Build for production
npm run package

# Run in development mode
npm run watch

# Type checking
npm run check-types

# Linting
npm run lint

# Testing
npm test
```

### Project Structure

```
vscode-rhs-sdk-extension/
├── src/
│   ├── extension.ts          # Main extension file
│   ├── templates/            # BMPLC templates
│   └── webviews/            # HTML interfaces
├── dist/                    # Built files
├── .vscode/                 # VS Code configuration
└── package.json            # Extension metadata
```

## 🐛 Troubleshooting

### Extension doesn't start
- Make sure project is built: `npm run package`
- Check for TypeScript errors: `npm run check-types`
- Restart VS Code

### F5 doesn't work
- Check `.vscode/launch.json` and `.vscode/tasks.json` files
- Make sure dependencies are installed: `npm install`
- Try `Ctrl+Shift+P` → "Developer: Reload Window"

### No configurations found in Editor
- Make sure file is named exactly `bmplc_config.json`
- Check that file is in VS Code workspace
- File must contain valid JSON with `name`, `memory`, `hal` fields

## 📞 Support

- **GitHub:** https://github.com/RoboticsHardwareSolutions/vscode-rhs-sdk-extension
- **Issues:** Create issues for bugs and suggestions
- **Publisher:** RoboticsHardwareSolutions

---

*RHS SDK Tools v0.0.1 - VS Code extension for BMPLC configuration management*
