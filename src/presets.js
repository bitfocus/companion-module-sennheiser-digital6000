import { choices } from './consts.js'
import { iconsL6000 } from './icons-l6000.js'
import { colours } from './feedbackOptions.js'

export default async function (self) {
	let presetsDefinitions = {}
	if (self.config.device === choices.devices[0].id || self.config.device === choices.devices[1].id) {
		//set EM6000 presets
	} else if (self.config.device === choices.devices[2].id) {
		//set L6000 presets
		for (let j = 1; j <= 2; j++) {
			for (let i = 1; i <= 4; i++) {
				presetsDefinitions[`Slot${i}_Subslot${j}_battStatus`] = {
					type: 'button',
					category: 'Battery Status',
					name: `Battery ${i}/${j} Status`,
					style: {
						png64: iconsL6000.led.FLASHING,
						pngalignment: 'center:center',
						alignment: 'center:center',
						text: `Slot ${i}/${j}\\n\\n\\nBattery Status`,
						textExpression: false,
						color: colours.white,
						bgcolor: colours.black,
						size: 14,
						show_topbar: false,
					},
					steps: [
						{
							down: [
								{
									actionId: 'battIdentify',
									options: {
										slot: i,
										subslot: j,
									},
									delay: 0,
								},
							],
							up: [],
						},
					],
					feedbacks: [
						{
							feedbackId: 'batteryStatus',
							options: {
								slot: i,
								subslot: j,
							},
						},
					],
				}
			}
			presetsDefinitions[`subslot-div_${j}`] = {
				category: 'Battery Status',
				type: 'text',
				name: ``,
				text: '',
			}
		}
	}
	self.setPresetDefinitions(presetsDefinitions)
}
