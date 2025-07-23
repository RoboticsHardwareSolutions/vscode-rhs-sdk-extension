# Change Log

All notable changes to the "RHS SDK Tools" extension will be documented in this file.

## [0.0.1] - 2025-07-23

### Added
- Initial release of RHS SDK Tools extension
- BMPLC Configuration Creator with templates (XL, L, M sizes)
- BMPLC Configuration Editor with auto-detection
- Support for `bmplc_config.json` files
- Automatic workspace scanning for configuration files
- Template-based configuration creation
- Real-time configuration editing interface
- Integration with BMPLC Quick Project repository

### Features
- **Creator Tool**: Create new BMPLC configurations from predefined templates
- **Editor Tool**: Edit existing BMPLC configuration files
- **Auto-detection**: Automatically find and load `bmplc_config.json` files
- **Templates**: Pre-built configurations for different project sizes
- **Repository Integration**: Clone template projects with configurations

### Templates Included
- `BMPLC_XL` - Extended configuration for large projects
- `BMPLC_L` - Large configuration 
- `BMPLC_M` - Medium configuration
- `BMPLC_TEMPLATE` - Base template with all available options

### Technical
- Built with TypeScript and esbuild
- VS Code webview-based interface
- Automatic build and watch modes
- Comprehensive documentation in English