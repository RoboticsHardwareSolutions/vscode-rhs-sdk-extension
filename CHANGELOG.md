# Change Log

All notable changes to the "RHS SDK Tools" extension will be documented in this file.

## [0.0.4] - 2025-07-24

### Breaking Changes
- **Replaced `memory` field with `microcontroller` field** in BMPLC configurations
  - BMPLC_M now uses STM32F103RE
  - BMPLC_XL and BMPLC_L now use STM32F765ZG
  - New configurations default to STM32F407VG

### Changed
- Configuration interface now uses microcontroller selection instead of memory size input  
- Updated JSON schema validation for microcontroller field
- Improved configuration templates with microcontroller-specific settings
- Enhanced creator and editor interfaces with microcontroller dropdown
- Fixed duplicate microcontroller fields in configuration forms

### Added
- Support for three microcontroller types: STM32F103RE, STM32F765ZG, STM32F407VG
- New industrial BMPLC configuration template
- Better configuration validation and error handling

## [0.0.3] - 2025-07-24

### Added
- Added extension icon for Visual Studio Marketplace

## [0.0.2] - 2025-07-24

### Fixed
- Fixed webviews not loading after extension publication
- Added proper webviews files (HTML/CSS) to extension package
- Improved file path resolution for production builds
- Fixed "ENOENT: no such file or directory" error for webview resources

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