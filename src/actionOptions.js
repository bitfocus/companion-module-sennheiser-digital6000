import { choices, limits } from './consts.js'
export const actionChoices = {
	slot: [
		{ id: 1, label: 'Slot 1' },
		{ id: 2, label: 'Slot 2' },
		{ id: 3, label: 'Slot 3' },
		{ id: 4, label: 'Slot 4' },
	],
	subslot: [
		{ id: 1, label: 'Subslot 1' },
		{ id: 2, label: 'Subslot 2' },
	],
	out: [
		{ id: 1, label: 'Output 1' },
		{ id: 2, label: 'Output 2' },
	],
	rxchannel: [
		{ id: 1, label: 'Rx Channel 1' },
		{ id: 2, label: 'Rx Channel 2' },
	],
	RF: [
		{ id: 1, label: 'RF 1' },
		{ id: 2, label: 'RF 2' },
	],
	syncSettings: [
		{ id: 'auto_lock', label: 'Auto Lock' },
		{ id: 'cable_emulation', label: 'Cable Emulation' },
		{ id: 'display', label: 'Display' },
		{ id: 'gain', label: 'Gain' },
		{ id: 'low_cut_frequency', label: 'Low Cut Frequency' },
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
}

export const actionOptions = {
	output: {
		id: 'out',
		type: 'dropdown',
		label: 'Output',
		default: actionChoices.out[0].id,
		choices: actionChoices.out,
	},
	level: {
		id: 'level',
		type: 'textinput',
		label: 'Level',
		default: '0',
		useVariables: { local: true },
		tooltip: 'AF Output level range -10 to + 18',
	},
	relative: {
		id: 'relative',
		type: 'checkbox',
		label: 'Relative',
		default: false,
	},
	reciever: {
		id: 'reciever',
		type: 'dropdown',
		label: 'Reciever',
		default: actionChoices.rxchannel[0].id,
		choices: actionChoices.rxchannel,
	},
	rf: {
		id: 'rf',
		type: 'dropdown',
		label: 'RF',
		default: actionChoices.RF[0].id,
		choices: actionChoices.RF,
	},
	booster: {
		id: 'booster',
		type: 'checkbox',
		label: 'Booster',
		default: false,
	},
	brightness: {
		id: 'brightness',
		type: 'textinput',
		label: `Brightness (${limits.brightness.units})`,
		default: `${limits.brightness.max}`,
		useVariables: { local: true },
		tooltip: `Min: ${limits.brightness.min} Max: ${limits.brightness.max} Step: ${limits.brightness.step}`,
	},
	activeBank: {
		id: 'bank',
		type: 'dropdown',
		label: 'Bank',
		default: choices.banks[0].id,
		choices: choices.banks,
	},
	activeChannel: {
		id: 'channel',
		type: 'textinput',
		label: `Channel (${limits.active_bank_channel.units})`,
		default: `${limits.active_bank_channel.min}`,
		useVariables: { local: true },
		tooltip: `Min: ${limits.active_bank_channel.min} Max: ${limits.active_bank_channel.max} Step: ${limits.active_bank_channel.step}`,
	},
	mute: {
		id: 'mute',
		type: 'checkbox',
		label: 'Mute',
		default: false,
	},
	encrypt: {
		id: 'encrypt',
		type: 'checkbox',
		label: 'Encryption',
		default: false,
	},
	name: {
		id: 'name',
		type: 'textinput',
		label: 'Name',
		default: '',
		useVariables: { local: true },
		tooltip: 'Max Length: 8 Chars. Forbidden Characters: {}[]()~`!@$%^&_\\:\'".?',
	},
	carrier: {
		id: 'carrier',
		type: 'textinput',
		label: `Carrier (${limits.carrier.units})`,
		default: `${limits.carrier.min}`,
		useVariables: { local: true },
		tooltip: `Range: ${limits.carrier.min} to ${limits.carrier.max}. Step: ${limits.carrier.step}${limits.carrier.units}`,
	},
	syncSettings: {
		id: 'syncSettings',
		type: 'multidropdown',
		label: `Sync Settings`,
		default: [actionChoices.syncSettings[3].id],
		choices: actionChoices.syncSettings,
		minSelection: 1,
	},
	auto_lock: {
		id: 'auto_lock',
		type: 'dropdown',
		label: 'Auto Lock',
		default: actionChoices.auto_lock[0].id,
		choices: actionChoices.auto_lock,
		isVisible: (options) => {
			return options.syncSettings.includes('auto_lock')
		},
	},
	auto_lock_ignore: {
		id: 'auto_lock_ignore',
		type: 'checkbox',
		label: 'Auto Lock - Ignore',
		default: false,
		isVisible: (options) => {
			return options.syncSettings.includes('auto_lock')
		},
	},
	cable_emulation: {
		id: 'cable_emulation',
		type: 'dropdown',
		label: 'Cable Emulation',
		default: actionChoices.cable_emulation[0].id,
		choices: actionChoices.cable_emulation,
		isVisible: (options) => {
			return options.syncSettings.includes('cable_emulation')
		},
	},
	cable_emulation_ignore: {
		id: 'cable_emulation_ignore',
		type: 'checkbox',
		label: 'Cable Emulation - Ignore',
		default: false,
		isVisible: (options) => {
			return options.syncSettings.includes('cable_emulation')
		},
	},
	display: {
		id: 'display',
		type: 'dropdown',
		label: 'Display',
		default: actionChoices.display[0].id,
		choices: actionChoices.display,
		isVisible: (options) => {
			return options.syncSettings.includes('display')
		},
	},
	display_ignore: {
		id: 'display_ignore',
		type: 'checkbox',
		label: 'Display - Ignore',
		default: false,
		isVisible: (options) => {
			return options.syncSettings.includes('display')
		},
	},
	gain: {
		id: 'gain',
		type: 'textinput',
		label: `Gain (${limits.gain.units})`,
		default: '0',
		useVariable: true,
		tooltip: `Min: ${limits.gain.min} Max: ${limits.gain.max} Step: ${limits.gain.step}${limits.gain.units}`,
		isVisible: (options) => {
			return options.syncSettings.includes('gain')
		},
	},
	gain_ignore: {
		id: 'gain_ignore',
		type: 'checkbox',
		label: 'Gain - Ignore',
		default: false,
		isVisible: (options) => {
			return options.syncSettings.includes('gain')
		},
	},
	low_cut_frequency: {
		id: 'low_cut_frequency',
		type: 'dropdown',
		label: 'Low Cut Frequency',
		default: actionChoices.low_cut_frequency[0].id,
		choices: actionChoices.low_cut_frequency,
		isVisible: (options) => {
			return options.syncSettings.includes('low_cut_frequency')
		},
	},
	low_cut_frequency_ignore: {
		id: 'low_cut_frequency_ignore',
		type: 'checkbox',
		label: 'Low Cut Frequency - Ignore',
		default: false,
		isVisible: (options) => {
			return options.syncSettings.includes('low_cut_frequency')
		},
	},
	slot: {
		id: 'slot',
		type: 'dropdown',
		label: 'Slot',
		default: actionChoices.slot[0].id,
		choices: actionChoices.slot,
	},
	subslot: {
		id: 'subslot',
		type: 'dropdown',
		label: 'Subslot',
		default: actionChoices.subslot[0].id,
		choices: actionChoices.subslot,
	},
}
