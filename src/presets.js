import { choices } from './consts.js'
import { iconsL6000 } from './icons-l6000.js'
import { colours, feedbackChoices } from './feedbackOptions.js'

export default async function (self) {
	let presetsDefinitions = {}
	if (self.config.device === choices.devices[0].id || self.config.device === choices.devices[1].id) {
		//set EM6000 presets
		for (let i = 1; i <= 2; i++) {
			presetsDefinitions[`Reciever_${i}_Status`] = {
				type: 'button',
				category: 'Reciever Status',
				name: `Reciever ${i} Status`,
				style: {
					png64: null,
					pngalignment: 'center:center',
					alignment: 'left:top',
					text: `Reciever ${i} Status`,
					textExpression: false,
					color: colours.white,
					bgcolor: colours.black,
					size: '8',
					show_topbar: false,
				},
				steps: [
					{
						down: [
							{
								actionId: 'rxIdentify',
								options: {
									reciever: i,
								},
								delay: 0,
							},
						],
						up: [],
					},
				],
				feedbacks: [
					{
						feedbackId: 'recieverStatus',
						options: {
							reciever: i,
							labels: feedbackChoices.labelDefault,
							icons: feedbackChoices.iconDefault,
							meters: feedbackChoices.metersDefault,
							orientation: feedbackChoices.orientation[1].id,
						},
					},
					{
						feedbackId: 'activeStatus',
						options: {
							reciever: i,
							status: 'Identified',
						},
						style: {
							bgcolor: colours.darkblue,
						},
					},
				],
			}
		}
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
		presetsDefinitions[`deviceStatus`] = {
			type: 'button',
			category: 'Device Status',
			name: `Device Status`,
			style: {
				png64: iconsL6000.ok,
				pngalignment: 'center:center',
				alignment: 'center:top',
				text: `L 6000\\nOK`,
				textExpression: false,
				color: colours.white,
				bgcolor: colours.black,
				size: 14,
				show_topbar: false,
			},
			steps: [],
			feedbacks: [
				{
					feedbackId: 'fanWarning',
					options: {
						fan: 1,
					},
					style: {
						png64: iconsL6000.fanWarning,
						pngalignment: 'center:center',
						alignment: 'center:top',
						text: `Fan 1 Defect`,
						size: 14,
					},
				},
				{
					feedbackId: 'fanWarning',
					options: {
						fan: 2,
					},
					style: {
						png64: iconsL6000.fanWarning,
						pngalignment: 'center:center',
						alignment: 'center:top',
						text: `Fan 2 Defect`,
						size: 14,
					},
				},
				{
					feedbackId: 'fanWarning',
					options: {
						fan: 3,
					},
					style: {
						png64: iconsL6000.fanWarning,
						pngalignment: 'center:center',
						alignment: 'center:top',
						text: `Fan 3 Defect`,
						size: 14,
					},
				},
				{
					feedbackId: 'fanWarning',
					options: {
						fan: 4,
					},
					style: {
						png64: iconsL6000.fanWarning,
						pngalignment: 'center:center',
						alignment: 'center:top',
						text: `Fan 4 Defect`,
						size: 14,
					},
				},
				{
					feedbackId: 'deviceHot',
					options: {},
					style: {
						png64: iconsL6000.deviceHot,
						pngalignment: 'center:center',
						alignment: 'center:top',
						text: `Device Hot`,
						size: 14,
					},
				},
			],
		}
	}
	self.setPresetDefinitions(presetsDefinitions)
}
