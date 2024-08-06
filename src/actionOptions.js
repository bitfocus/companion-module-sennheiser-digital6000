import { choices, limits } from './consts.js'
const actionChoices = {
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
		useVariables: true,
		tooltip: 'AF Output level range -10 to + 18',
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
		useVariables: true,
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
		useVariables: true,
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
		useVariables: true,
	},
	carrier: {
		id: 'carrier',
		type: 'textinput',
		label: `Carrier (${limits.carrier.units})`,
		default: `${limits.carrier.min}`,
		useVariables: true,
		tooltip: `Range: ${limits.carrier.min} to ${limits.carrier.max}. Step: ${limits.carrier.step}${limits.carrier.units}`,
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
