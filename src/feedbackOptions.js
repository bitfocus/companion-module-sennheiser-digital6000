import { combineRgb } from '@companion-module/base'

export const styles = {
	red: {
		bgcolor: combineRgb(255, 0, 0),
		color: combineRgb(0, 0, 0),
	},
}

const feedbackChoices = {
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
