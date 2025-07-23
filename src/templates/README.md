# BMPLC Configuration Templates

This directory contains JSON templates for various BMPLC (BareMetal PLC) configurations.

## Template Types

### 1. Ready-to-use configurations (Compact Templates)
- **Principle:** Contains only enabled fields (`true`)
- **Purpose:** Ready-to-use configurations
- **Files:** `bmplc_xl.json`, `bmplc_l.json`, `bmplc_m.json`

### 2. Full template for customization (Full Template)
- **Principle:** Contains all possible fields with their values
- **Purpose:** Base for creating custom configurations
- **Files:** `bmplc_template.json`

## File Structure

- `bmplc_xl.json` - Ready BMPLC XL configuration (2048 KB) - only active components
- `bmplc_l.json` - Ready BMPLC L configuration (1024 KB) - only active components  
- `bmplc_m.json` - Ready BMPLC M configuration (512 KB) - only active components
- `bmplc_template.json` - **Full template** with all possible fields for customization
- `index.ts` - TypeScript module for working with templates
- `bmplc-config.schema.json` - JSON Schema for validation

## Usage

### TypeScript Import

```typescript
import { 
    templates, 
    getTemplate, 
    createConfigFromTemplate, 
    createFullConfig,
    mergeConfigWithTemplate 
} from './templates';

// 1. Get ready-to-use configuration (compact)
const xlConfig = getTemplate('BMPLC_XL'); 

// 2. Get full template for customization
const fullTemplate = getTemplate('BMPLC_TEMPLATE'); 

// 3. Create copy of ready configuration with new name
const myXLConfig = createConfigFromTemplate('BMPLC_XL', 'MY_CUSTOM_XL');

// 4. Create new config with full set of functions for customization
const customConfig = createFullConfig('MY_CUSTOM_BMPLC', 1024);
// After this user manually edits JSON

// 5. Modify existing template
const modifiedConfig = mergeConfigWithTemplate('BMPLC_L', {
    memory: 1536,
    hal: {
        network: true  // Add network to base BMPLC_L
    }
});
```

## Workflow for creating new configurations

### 1. Create base with full set of functions
```typescript
// Create config with all possible functions (all false)
const newConfig = createFullConfig('MY_CUSTOM_BMPLC', 1024);
// Result contains ALL fields for customization
```

### 2. Manual JSON configuration
```json
{
    "name": "MY_CUSTOM_BMPLC",
    "memory": 1024,
    "hal": {
        "flash_ex": false,    // ← Keep and change to true if needed
        "io": false,          // ← Keep and change to true if needed  
        "rtc": true,          // ← Enabled
        "serial": true,       // ← Enabled
        "speaker": false,     // ← Remove this field if not needed
        "can": true,          // ← Enabled
        "random": false,      // ← Remove this field if not needed
        "usb": false,         // ← Remove this field if not needed
        "network": false      // ← Remove this field if not needed
    }
    // ... similar for services and tests
}
```

### 3. Final compact result
```json
{
    "name": "MY_CUSTOM_BMPLC", 
    "memory": 1024,
    "hal": {
        "rtc": true,
        "serial": true,
        "can": true
    }
    // Only needed fields!
}
```

### Direct JSON usage

JSON files can be used directly in any build systems or applications.

## Configuration Structure

Each template contains:

- `name` - Configuration name
- `memory` - Memory size in KB
- `hal` - HAL (Hardware Abstraction Layer) settings - **only enabled components**
- `services` - Enabled services - **only active services**
- `tests` - Test settings - **only enabled tests**
- `compileDefinition` - Compilation definition

### JSON template features

- Fields in `hal`, `services`, `tests` sections are included only if they are active (`true`)
- Missing fields are automatically interpreted as disabled (`false`)
- This makes templates compact and readable
- Follows "Convention over Configuration" principle

### Examples of differences between configurations

**BMPLC_XL:** Full configuration with lwIP, flash_ex, io, rtc
**BMPLC_L:** Without lwIP, but with other components  
**BMPLC_M:** Minimal configuration only with USB, serial, speaker, CAN

## Creating new templates

1. Copy `bmplc_template.json`
2. Change values according to requirements
3. Add new template to `index.ts`
4. Update this README
