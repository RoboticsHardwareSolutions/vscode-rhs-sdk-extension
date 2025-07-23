import { BMPLCConfig } from '../webviews/config_presets';
import * as fs from 'fs';
import * as path from 'path';

// In runtime __dirname points to dist/, and files are in dist/templates/
const templatesDir = path.join(__dirname, 'templates');

function loadTemplate(filename: string): BMPLCConfig {
    const filePath = path.join(templatesDir, filename);
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as BMPLCConfig;
}

export const templates: Record<string, BMPLCConfig> = {
    BMPLC_XL: loadTemplate('bmplc_xl.json'),
    BMPLC_L: loadTemplate('bmplc_l.json'),
    BMPLC_M: loadTemplate('bmplc_m.json'),
    BMPLC_TEMPLATE: loadTemplate('bmplc_template.json')
};

export const templateNames = Object.keys(templates);

export function getTemplate(name: string): BMPLCConfig | undefined {
    return templates[name];
}

export function getAllTemplates(): Record<string, BMPLCConfig> {
    return templates;
}

export function createConfigFromTemplate(templateName: string, customName?: string): BMPLCConfig {
    const template = getTemplate(templateName);
    if (!template) {
        throw new Error(`Template ${templateName} not found`);
    }
    
    return {
        ...template,
        name: customName || template.name,
        compileDefinition: customName || template.compileDefinition
    };
}

export function createFullConfig(name: string, memory: number = 512): BMPLCConfig {
    // Creates full configuration based on general template with all possible functions
    // User can enable needed ones (true) and remove unnecessary fields from JSON
    const template = getTemplate('BMPLC_TEMPLATE');
    if (!template) {
        throw new Error('Base template not found');
    }
    
    return {
        ...template,
        name,
        memory,
        compileDefinition: name
    };
}

export function mergeConfigWithTemplate(baseTemplate: string, overrides: Partial<BMPLCConfig>): BMPLCConfig {
    const template = getTemplate(baseTemplate);
    if (!template) {
        throw new Error(`Template ${baseTemplate} not found`);
    }
    
    return {
        ...template,
        ...overrides,
        hal: {
            ...template.hal,
            ...overrides.hal
        },
        services: {
            ...template.services,
            ...overrides.services
        },
        tests: {
            ...template.tests,
            ...overrides.tests
        }
    };
}
