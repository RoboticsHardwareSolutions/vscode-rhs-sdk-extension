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

export const RPLCs: RPLCConfig[] = [
        {
                name: "RPLC_XL",
                memory: 2048,
                hal: {
                        flash_ex: true,
                        io: true,
                        rtc: true,
                        serial: true,
                        speaker: true,
                        can: true,
                        random: true,
                        // network: true, // Uncomment if needed
                },
                services: {
                        notification: true,
                        lwip: true,
                        can_open: true,
                },
                tests: {
                        memmng: true,
                        flash_ex: true,
                },
                compileDefinition: "RPLC_XL"
        },
        {
                name: "RPLC_L",
                memory: 1024,
                hal: {
                        flash_ex: true,
                        io: true,
                        rtc: true,
                        serial: true,
                        speaker: true,
                        can: true,
                        random: true,
                },
                services: {
                        notification: true,
                        can_open: true,
                },
                tests: {
                        memmng: true,
                        flash_ex: true,
                },
                compileDefinition: "RPLC_L"
        },
        {
                name: "RPLC_M",
                memory: 512,
                hal: {
                        serial: true,
                        speaker: true,
                        can: true,
                        usb: true,
                },
                services: {
                        notification: true,
                        usb_serial_bridge: true,
                        can_open: true,
                },
                tests: {
                        memmng: true,
                },
                compileDefinition: "RPLC_M"
        }
];