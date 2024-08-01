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
}

export const actionOptions = {
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
