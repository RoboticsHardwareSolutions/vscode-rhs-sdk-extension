# RHS SDK Tools

[![Visual Studio Marketplace](https://img.shields.io/badge/Visual%20Studio-Marketplace-blue)](https://marketplace.visualstudio.com/items?itemName=RoboticsHardwareSolutions.rhs-sdk)
[![Version](https://img.shields.io/badge/version-1.0.0-green)](https://github.com/RoboticsHardwareSolutions/vscode-rhs-sdk-extension)
[![License](https://img.shields.io/badge/license-MIT-orange)](LICENSE)

VS Code extension for **BMPLC (BareMetal PLC)** configuration management. Streamline your embedded hardware development with intuitive configuration tools.

## 🚀 Features

### 📝 Configuration Creator
- **Pre-built Templates**: Ready-to-use configurations (XL, L, M sizes)
- **Custom Configurations**: Create tailored setups for your project
- **Memory Management**: Configurable memory allocation (256KB - 4GB)
- **Repository Integration**: Clone template projects automatically

### ✏️ Configuration Editor
- **Auto-Detection**: Automatically finds `bmplc_config.json` files
- **Real-time Editing**: Live parameter modification
- **HAL Configuration**: Hardware Abstraction Layer setup
- **Service Management**: Enable/disable embedded services

### 🎯 Smart Workflow
- **Template-based Creation**: Start from proven configurations
- **Validation**: Built-in configuration validation
- **One-click Save**: Direct save to project or repository clone
- **VS Code Integration**: Native sidebar panel

## 📦 Installation

### From Marketplace (Recommended)
1. Open VS Code
2. Go to Extensions (`Ctrl+Shift+X`)
3. Search for "RHS SDK Tools"
4. Click Install

### From VSIX (Development)
```bash
# Download and install locally
code --install-extension rhs-sdk-1.0.0.vsix
```

## 🎯 Quick Start

1. **Open the RHS SDK panel** in VS Code sidebar
2. **Create a configuration**:
   - Click "Creator" → Select template → Configure → Save
3. **Edit existing configuration**:
   - Click "Editor" → Modify parameters → Save

## 📋 Supported Configurations

| Template | Memory | Use Case |
|----------|--------|----------|
| BMPLC_XL | 2048KB | Large industrial applications |
| BMPLC_L  | 1024KB | Medium-scale automation |
| BMPLC_M  | 512KB  | Small embedded projects |

## 🛠️ Development

### Setup
```bash
git clone https://github.com/RoboticsHardwareSolutions/vscode-rhs-sdk-extension.git
cd vscode-rhs-sdk-extension
npm install
npm run package
```

### Debug
```bash
code .
# Press F5 to launch Extension Development Host
```

### Build & Package
```bash
npm run package        # Production build
vsce package          # Create VSIX
```

## 📖 Documentation

- **[Usage Guide](USAGE.md)** - Detailed instructions
- **[Quick Start](QUICKSTART.md)** - Get started in 5 minutes
- **[Publishing Guide](PUBLISHING.md)** - For contributors
- **[Changelog](CHANGELOG.md)** - Release history

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/RoboticsHardwareSolutions/vscode-rhs-sdk-extension/issues)
- **Discussions**: [GitHub Discussions](https://github.com/RoboticsHardwareSolutions/vscode-rhs-sdk-extension/discussions)
- **Email**: [Contact Us](mailto:support@roboticshardwaresolutions.com)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Made with ❤️ by [Robotics Hardware Solutions](https://github.com/RoboticsHardwareSolutions)**
