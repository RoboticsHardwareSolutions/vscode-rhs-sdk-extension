export interface RPLCConfig {
        name: string;
        memory: number;
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

// Конфигурации RPLC теперь доступны через JSON шаблоны в папке templates/
// Используйте: import { templates, getTemplate } from '../templates';