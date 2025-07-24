export interface BMPLCConfig {
        name: string;
        microcontroller: 'STM32F103RE' | 'STM32F765ZG' | 'STM32F407VG';
        hal: {
                flash_ex?: boolean;
                io?: boolean;
                rtc?: boolean;
                serial?: boolean;
                speaker?: boolean;
                can?: boolean;
                random?: boolean;
                usb?: boolean;
                network?: boolean;
        };
        services: {
                notification?: boolean;
                lwip?: boolean;
                can_open?: boolean;
                usb_serial_bridge?: boolean;
        };
        tests: {
                memmng?: boolean;
                flash_ex?: boolean;
        };
        compileDefinition: string;
}

// BMPLC configurations are now available through JSON templates in templates/ folder
// Use: import { templates, getTemplate } from '../templates';