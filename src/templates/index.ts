import { RPLCConfig } from '../webviews/config_presets';
import * as fs from 'fs';
import * as path from 'path';

// In runtime __dirname points to dist/, and files are in dist/templates/
const templatesDir = path.join(__dirname, 'templates');

function loadTemplate(filename: string): RPLCConfig {
    const filePath = path.join(templatesDir, filename);
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as RPLCConfig;
}

export const templates: Record<string, RPLCConfig> = {
    RPLC_XL: loadTemplate('rplc_xl.json'),
    RPLC_L: loadTemplate('rplc_l.json'),
    RPLC_M: loadTemplate('rplc_m.json'),
    RPLC_TEMPLATE: loadTemplate('rplc_template.json')
};

export const templateNames = Object.keys(templates);

export function getTemplate(name: string): RPLCConfig | undefined {
    return templates[name];
}

export function getAllTemplates(): Record<string, RPLCConfig> {
    return templates;
}

export function createConfigFromTemplate(templateName: string, customName?: string): RPLCConfig {
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

export function createFullConfig(name: string, memory: number = 512): RPLCConfig {
    // Creates full configuration based on general template with all possible functions
    // User can enable needed ones (true) and remove unnecessary fields from JSON
    const template = getTemplate('RPLC_TEMPLATE');
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

export function mergeConfigWithTemplate(baseTemplate: string, overrides: Partial<RPLCConfig>): RPLCConfig {
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
