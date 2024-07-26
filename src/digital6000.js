import { choices } from './consts.js'
export function initDigital6000(device) {
    //initalise the memory structure of the device
    if (self.d6000) {
        delete self.d6000
    }
    if (device === choices.devices[0].id) {
        //define EM6000 object
        self.d6000 = {
            audio: {
                out1: {
                    level_db: null,
                },
                 out2: {
                    level_db: null,
                }
            },
            rx1: {
                audio_mute: null,
                freq: {
                    b1: [],
                    b2: [],
                    b3: [],
                    b4: [],
                    b5: [],
                    b6: [],
                    u1: [],
                    u2: [],
                    u3: [],
                    u4: [],
                    u5: [],
                    u6: [],
                },
            active_bank_channel: null,
            carrier: null,
            scan: {
                config: null,
                result: null,
            },
            skx: {
                type: null,
                name: null,
                lowcut: null,
                gain: null,
                display: null,
                capsule: null,
                cable_emulation: null,
                battery: null,
                autolock: null,
            },
            sync_settings: {
                low_cut_frequency: null,
                ignore_low_cut_frequency: null,
                gain: null,
                ignore_gain: null,
                display: null,
                ignore_display: null,
                cable_emulation: null,
                ignore_cable_emulation: null,
                auto_lock: null,
                ignore_auto_lock: null,
            },
            walktest: {
                start: null,
                info: null,
            },
            identify: null,
            wsm_master_cnt: null,
            testtone: null,
            name: null,
            ecryption: null,
            active_warnings: null,
            active_status: null,
            },
            rx2: {
                audio_mute: null,
                freq: {
                    b1: [],
                    b2: [],
                    b3: [],
                    b4: [],
                    b5: [],
                    b6: [],
                    u1: [],
                    u2: [],
                    u3: [],
                    u4: [],
                    u5: [],
                    u6: [],
                },
            active_bank_channel: null,
            carrier: null,
            scan: {
                config: null,
                result: null,
            },
            skx: {
                type: null,
                name: null,
                lowcut: null,
                gain: null,
                display: null,
                capsule: null,
                cable_emulation: null,
                battery: null,
                autolock: null,
            },
            sync_settings: {
                low_cut_frequency: null,
                ignore_low_cut_frequency: null,
                gain: null,
                ignore_gain: null,
                display: null,
                ignore_display: null,
                cable_emulation: null,
                ignore_cable_emulation: null,
                auto_lock: null,
                ignore_auto_lock: null,
            },
            walktest: {
                start: null,
                info: null,
            },
            identify: null,
            wsm_master_cnt: null,
            testtone: null,
            name: null,
            ecryption: null,
            active_warnings: null,
            active_status: null,
            },
            sys: {
                dante: {
                    version: null,
                    name: null,
                },
                wsm_master_cnt: null,
                clock_frequency_measured: null,
                clock: null,
                brightness: null,
                booster: null,
            },
            mm: null,
            device: {
                identity: {
                    version: null,
                    vendor: null,
                    product: null,
                },
                network: {
                    ether: {
                        macs: null,
                        interfaces: null,
                    },
                    ipv4: {
                        auto: null,
                        mdns: null,
                        interfaces: null,
                        static_ipaddr: null,
                        static_netmask: null,
                        static_gateway: null,
                        ipaddr: null,
                        netmask: null,
                    },
                    ipv4_dante: {
                        auto: null,
                        ipaddr: null,
                        netmask: null,
                        gateway: null,
                        settomgs: null,
                    }
                },
                name: null,
                language: null,
                
            },
            osc: {
                state: {
                    prettyprint: null,
                    subscribe: null,
                },
                feature: {
                    timetag: null,
                    baseaddr: null,
                    subscription: null,
                    pattern: null,
                },
                limits: null,
                schema: null,
                version: null,
                xid: null,
                ping: null,
                error: null,
            }
        }
	} else if (device === choices.devices[1].id) {
        //define L6000 object
        self.d6000 = {
            slot1: {
                subslot1: {
                    led: null,
                    identify: null,
                    accu_parameter: null,
                    accu_detection: null,
                },
                subslot2: {
                    led: null,
                    identify: null,
                    accu_parameter: null,
                    accu_detection: null,
                },
                type: null,
            },
            slot2: {
                subslot1: {
                    led: null,
                    identify: null,
                    accu_parameter: null,
                    accu_detection: null,
                },
                subslot2: {
                    led: null,
                    identify: null,
                    accu_parameter: null,
                    accu_detection: null,
                },
                type: null,
            },
            slot3: {
                subslot1: {
                    led: null,
                    identify: null,
                    accu_parameter: null,
                    accu_detection: null,
                },
                subslot2: {
                    led: null,
                    identify: null,
                    accu_parameter: null,
                    accu_detection: null,
                },
                type: null,
            },
            slot4: {
                subslot1: {
                    led: null,
                    identify: null,
                    accu_parameter: null,
                    accu_detection: null,
                },
                subslot2: {
                    led: null,
                    identify: null,
                    accu_parameter: null,
                    accu_detection: null,
                },
                type: null,
            },
            device: {
                identity: {
                    version: null,
                    vendor: null,
                    product: null,
                },
                network: {
                    ether: {
                        macs: null,
                        interfaces: null,
                    },
                    ipv4: {
                        auto: null,
                        mdns: null,
                        interfaces: null,
                        static_ipaddr: null,
                        static_netmask: null,
                        static_gateway: null,
                        ipaddr: null,
                        netmask: null,
                    },
                },
                name: null,
                language: null,
                warnings: [],
                storage_mode: null,
                identify: null,
                
            },
            osc: {
                state: {
                    prettyprint: null,
                    subscribe: null,
                },
                feature: {
                    timetag: null,
                    baseaddr: null,
                    subscription: null,
                    pattern: null,
                },
                limits: null,
                schema: null,
                version: null,
                xid: null,
                ping: null,
                error: null,
            }
        }    
	}
}