# Publishing Guide for RHS SDK Tools

## Prerequisites for VS Code Marketplace Publication

### 1. Azure DevOps Account Setup
1. Create account at https://dev.azure.com
2. Create Personal Access Token (PAT):
   - Go to User Settings → Personal Access Tokens
   - Create new token with **Marketplace (manage)** scope
   - Save the token securely

### 2. Publisher Registration
1. Visit https://marketplace.visualstudio.com/manage
2. Sign in with Azure DevOps account
3. Create publisher with ID: `RoboticsHardwareSolutions`
4. Verify email and complete profile

## Publication Steps

### Step 1: Login to vsce
```bash
vsce login RoboticsHardwareSolutions
# Enter your Personal Access Token when prompted
```

### Step 2: Publish Extension
```bash
# Option A: Publish directly
vsce publish

# Option B: Publish with version bump
vsce publish patch  # 0.0.1 → 0.0.2
vsce publish minor  # 0.0.1 → 0.1.0
vsce publish major  # 0.0.1 → 1.0.0
```

### Step 3: Verify Publication
- Extension will appear at: https://marketplace.visualstudio.com/items?itemName=RoboticsHardwareSolutions.rhs-sdk
- Usually takes 5-10 minutes to be available

## Before Publishing Checklist

### Required Files ✅
- [x] `package.json` with all metadata
- [x] `README.md` with description
- [x] `CHANGELOG.md` with version history
- [x] `LICENSE` file (MIT)
- [x] `.vscodeignore` configured
- [x] Built extension in `dist/`

### Recommended Improvements 🔄
- [ ] Add PNG icon (128x128) for better marketplace display
- [ ] Add screenshots to README.md
- [ ] Add more detailed feature descriptions
- [ ] Add usage GIFs/videos
- [ ] Set up automated CI/CD pipeline

### Package.json Metadata ✅
- [x] Publisher ID matches Azure DevOps
- [x] Keywords for discoverability
- [x] Repository and homepage URLs
- [x] License specified
- [x] Categories appropriate
- [x] Gallery banner configuration

## Testing Before Publication

### Local Testing
```bash
# Install locally
code --install-extension rhs-sdk-0.0.1.vsix

# Test all features
# - Creator tool
# - Editor tool  
# - Auto-detection
# - Configuration saving
```

### Package Validation
```bash
# Verify package contents
vsce package --no-dependencies
# Check file list in output

# Validate manifest
vsce verify-pat [your-pat-token]
```

## Publication Command
```bash
# Final publication
vsce publish --no-dependencies
```

## Post-Publication

### Monitor
- Check marketplace page for correct display
- Monitor download statistics
- Watch for user feedback and issues

### Updates
```bash
# For updates
npm version patch
npm run package
vsce publish
```

## Troubleshooting

### Common Issues
1. **Publisher not found**: Register publisher in marketplace
2. **PAT expired**: Generate new Personal Access Token
3. **Build errors**: Run `npm run package` first
4. **Missing files**: Check `.vscodeignore` configuration

### Support
- VS Code Extension Documentation: https://code.visualstudio.com/api
- vsce CLI Documentation: https://github.com/microsoft/vscode-vsce
