# Git Integration for RHS SDK Extension

## Configuration saving to repository functionality

The extension now supports automatic cloning of RPLC Quick Project repository and saving created configuration.

### How it works:

1. **Configuration creation**: User creates or configures RPLC configuration through Creator interface
2. **Save to repository**: When clicking "Save to repository" button:
   - Select folder for project cloning
   - Clone repository `https://github.com/RoboticsHardwareSolutions/RPLC_Quick_Project.git` with recursive submodules
   - Clean configuration from empty objects (fields with false value are preserved)
   - Save `rplc_config.json` file to project root
   - Offer to open project folder in VS Code

### Technical implementation:

#### Frontend (creator.html)
- Function `cleanConfigForExport()` removes only empty objects (fields with false value are preserved)
- Send `saveConfigToRepo` command with cleaned configuration

#### Backend (extension.ts)
- Function `saveConfigToRepository()` handles:
  - Folder selection dialog
  - Git cloning with `--recursive` flag
  - JSON file saving
  - Operation progress display

### Dependencies:
- Git must be installed on the system
- Internet access for repository cloning

### Changed files:
- `src/extension.ts` - added `saveConfigToRepository` function
- `src/webviews/creator.html` - added `cleanConfigForExport` function and button handler
