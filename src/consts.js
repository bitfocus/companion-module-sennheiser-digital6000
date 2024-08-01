export const default_port = 6970

export const query = null

export const subscriptions = {
	min: 50,
	max: 10000,
	lifetime: 20,
	count: 1000,
}

export const choices = {
	devices: [
		{ id: 'EM6000', label: 'EM 6000' },
		{ id: 'EM6000-Dante', label: 'EM 6000 Dante' },
		{ id: 'L6000', label: 'L 6000' },
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
		{ id: 'OFF', label: 'No battery detected' },
		{ id: 'GREEN', label: 'State of charge in range 97% - 100%' },
		{ id: 'GREEN_FLASHING', label: 'State of charge in range 81% - 96%' },
		{ id: 'YELLOW', label: 'State of charge in range 0% - 80%' },
		{ id: 'YELLOW_FLASHING', label: 'Battery in regeneration' },
		{ id: 'RED', label: 'Battery defect' },
		{ id: 'RED_FLASHING', label: 'Temperature out of range (normal operating temp: 0°C - 50°C)' },
		{ id: 'GREEN_RED_FLASHING', label: 'Storage Mode: no battery detected' },
		{
			id: 'YELLOW_RED_FLASHING',
			label: 'Storage Mode: when battery is out of storage capacity (69% - 71%)',
		},
		{ id: 'YELLOW_GREEN_FLASHING', label: 'Storage Mode: battery has storage capacity (69% - 71%)' },
		{ id: 'DEV_IDENTIFY', label: 'Identify battery' },
	],
	type: [
		{ id: 0, label: 'Not Connected' },
		{ id: 1, label: 'LM6060' },
		{ id: 2, label: 'LM6061' },
		{ id: 3, label: 'Unknown / Fault' },
	],
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
