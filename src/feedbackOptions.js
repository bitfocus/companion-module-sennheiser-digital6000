import { combineRgb } from '@companion-module/base'
import { choices } from './consts.js'
import { warningsEM6000, activeStatusEM6000 } from './errors.js'

export const colours = {
	black: combineRgb(0, 0, 0),
	white: combineRgb(255, 255, 255),
	red: combineRgb(255, 0, 0),
	green: combineRgb(0, 204, 0),
	darkblue: combineRgb(0, 0, 102),
}

export const styles = {
	red: {
		bgcolor: colours.red,
		color: colours.black,
	},
	green: {
		bgcolor: colours.green,
		color: colours.black,
	},
	blue: {
		bgcolor: colours.darkblue,
		color: colours.white,
	},
}

export const feedbackChoices = {
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
	labels: [
		{ id: 'name', label: 'Reciever Name' },
		{ id: 'bank', label: 'Bank & Channel' },
		{ id: 'carrier', label: 'Carrier Frequency' },
		{ id: 'outputLevel', label: 'Output Level' },
		{ id: 'warning', label: 'Active Warnings' },
		{ id: 'status', label: 'Active Status' },
		{ id: 'txName', label: 'TX Name' },
		{ id: 'txType', label: 'TX Type' },
		{ id: 'txGain', label: 'TX Gain' },
		{ id: 'txLowcut', label: 'TX Low Cut Frequency' },
		{ id: 'batteryRuntime', label: 'Battery Runtime' },
		{ id: 'batteryPercent', label: 'Battery Percent' },
	],
	labelDefault: ['name', 'bank', 'carrier', 'txName', 'batteryRuntime'],
	meters: [
		{ id: 'af', label: 'Audio Level' },
		{ id: 'lqi', label: 'LQI' },
		{ id: 'rf', label: 'RF' },
	],
	metersDefault: ['rf', 'af', 'lqi'],
	icons: [
		{ id: 'battery', label: 'Battery' },
		{ id: 'encryption', label: 'Encryption' },
		{ id: 'mute', label: 'Mute' },
		{ id: 'warnings', label: 'Warnings (Borders)' },
	],
	iconDefault: ['battery', 'mute', 'warnings'],
	orientation: [
		{ id: 'left', label: 'Left' },
		{ id: 'right', label: 'Right' },
		{ id: 'top', label: 'Top' },
		{ id: 'bottom', label: 'Bottom' },
	],
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
	warning: [
		{ id: 'hot', label: 'Hot' },
		{ id: 'cold', label: 'Cold' },
		{ id: 'regen', label: 'Regeneration' },
		{ id: 'defect', label: 'Defect' },
	],
	fan: [
		{ id: 1, label: 'Fan 1' },
		{ id: 2, label: 'Fan 2' },
		{ id: 3, label: 'Fan 3' },
		{ id: 4, label: 'Fan 4' },
	],
}

export const feedbackOptions = {
	output: {
		id: 'out',
		type: 'dropdown',
		label: 'Slot',
		default: feedbackChoices.out[0].id,
		choices: feedbackChoices.out,
	},
	reciever: {
		id: 'reciever',
		type: 'dropdown',
		label: 'Reciever',
		default: feedbackChoices.rxchannel[0].id,
		choices: feedbackChoices.rxchannel,
	},
	rf: {
		id: 'rf',
		type: 'dropdown',
		label: 'RF',
		default: feedbackChoices.RF[0].id,
		choices: feedbackChoices.RF,
	},
	EMwarning: {
		id: 'warning',
		type: 'dropdown',
		label: 'Warning',
		default: warningsEM6000[0].id,
		choices: warningsEM6000,
	},
	status: {
		id: 'status',
		type: 'dropdown',
		label: 'Status',
		default: activeStatusEM6000[0].id,
		choices: activeStatusEM6000,
	},
	clock: {
		id: 'clock',
		type: 'dropdown',
		label: 'Clock',
		default: choices.clock[0].id,
		choices: choices.clock,
	},
	recieverLabels: {
		id: 'labels',
		type: 'multidropdown',
		label: `Labels`,
		default: feedbackChoices.labelDefault,
		choices: feedbackChoices.labels,
		minSelection: 0,
	},
	recieverMeters: {
		id: 'meters',
		type: 'multidropdown',
		label: `Meters`,
		default: feedbackChoices.metersDefault,
		choices: feedbackChoices.meters,
		minSelection: 0,
	},
	recieverIcons: {
		id: 'icons',
		type: 'multidropdown',
		label: `Icons`,
		default: feedbackChoices.iconDefaultDefault,
		choices: feedbackChoices.icons,
		minSelection: 0,
	},
	recieverOrientation: {
		id: 'orientation',
		type: 'dropdown',
		label: `Orientation`,
		default: feedbackChoices.orientation[1].id,
		choices: feedbackChoices.orientation,
	},
	slot: {
		id: 'slot',
		type: 'dropdown',
		label: 'Slot',
		default: feedbackChoices.slot[0].id,
		choices: feedbackChoices.slot,
	},
	subslot: {
		id: 'subslot',
		type: 'dropdown',
		label: 'Subslot',
		default: feedbackChoices.subslot[0].id,
		choices: feedbackChoices.subslot,
	},
	warning: {
		id: 'warning',
		type: 'dropdown',
		label: 'Warning',
		default: feedbackChoices.warning[0].id,
		choices: feedbackChoices.warning,
	},
	fan: {
		id: 'fan',
		type: 'dropdown',
		label: 'Fan',
		default: feedbackChoices.fan[0].id,
		choices: feedbackChoices.fan,
	},
}
