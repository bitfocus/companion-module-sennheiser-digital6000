export const default_port = 45

export const query = null

export const choices = {
    devices: [
        { id: 'em6000', label: 'EM 6000' },
        { id: 'l6000', label: 'L 6000' },
    ],
    // EM 6000 Choices
    banks: [
        { id: 'b1', label: 'B1' },
        { id: 'b2', label: 'B2' },
        { id: 'b3', label: 'B3' },
        { id: 'b4', label: 'B4' },
        { id: 'b5', label: 'B5' },
        { id: 'b6', label: 'B6' },
        { id: 'u1', label: 'U1' },
        { id: 'u2', label: 'U2' },
        { id: 'u3', label: 'U3' },
        { id: 'u4', label: 'U4' },
        { id: 'u5', label: 'U5' },
        { id: 'u6', label: 'U6' },
        { id: '--', label: '--' },
    ],
    low_cut_frequency: [
        { id: 0, label: '30 Hz' },
        { id: 1, label: '60 Hz' },
        { id: 2, label: '80 Hz' },
        { id: 3, label: '100 Hz' },
        { id: 4, label: '120 Hz' },
    ],
    display: [
        { id: 0, label: 'Frequency' },
        { id: 1, label: 'Name' },
    ],
    cable_emulation: [
        { id: 0, label: 'Line' },
        { id: 1, label: 'Type 1' },
        { id: 2, label: 'Type 2' },
        { id: 3, label: 'Type 3' },
    ],
    auto_lock: [
        { id: 0, label: 'Off' },
        { id: 1, label: 'On' },
    ],
    clock: [
        { id: 1, label: 'Internal 48kHz' },
        { id: 2, label: 'Internal 96kHz' },
        { id: 3, label: 'External' },
        { id: 4, label: 'Internal MAN' },
    ],
    //L6000 Choices
    led: [
        { id: 1, label: 'Off', description: 'No battery detected' },
        { id: 2, label: 'GREEN', description:'State of charge in range 97% - 100%' },
        { id: 3, label: 'GREEN_FLASHING', description: 'State of charge in range 81% - 96%' },
        { id: 4, label: 'YELLOW', description: 'State of charge in range 0% - 80%' },
        { id: 5, label: 'YELLOW_FLASHING', description: 'Battery in regeneration' },
        { id: 6, label: 'RED', description: 'Battery defect' },
        { id: 7, label: 'RED_FLASHING', description: 'Temperature out of range (normal operating temp: 0°C - 50°C)' },
        { id: 8, label: 'GREEN_RED_FLASHING', description: 'Storage Mode: no battery detected' },
        { id: 9, label: 'YELLOW_RED_FLASHING', description: 'Storage Mode: when battery is out of storage capacity (69% - 71%)' },
        { id: 10, label: 'YELLOW_GREEN_FLASHING', description: 'Storage Mode: battery has storage capacity (69% - 71%)' },
        { id: 11, label: 'DEV_IDENTIFY', description:'Identify battery' },
    ],
    type: [
        { id: 0, label: 'Not Connected' },
        { id: 1, label: 'LM6060' },
        { id: 2, label: 'LM6061' },
        { id: 3, label: 'Unknown / Fault' },
    ]
}

export const limits = {
    level_db: {
        max: 18,
        min: -10,
        step: 1,
        units: 'dB',
    },
    active_bank_channel: {
        max: 99,
        min: 0,
        step: 1,
        units: '',
    },
    carrier: {
        max: 713900,
        min: 470100,
        step: 25,
        units: 'kHz',
    },
    gain: {
        max: 60,
        min: -6,
        step: 3,
        units: 'dB',
    },
    brightness: {
        max: 100,
        min: 0,
        step: 1,
        units: '%',
    },
}
