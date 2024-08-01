import { choices, query } from './consts.js'
import { actionOptions } from './actionOptions.js'

export default function (self) {
	let ActionDefinitions = []
	if (self.config.device === choices.devices[0].id || self.config.device === choices.devices[1].id) {
		//set EM6000 actions
	} else if (self.config.device === choices.devices[2].id) {
		//set L6000 actions
		ActionDefinitions['battIdentify'] = {
			name: 'Identify',
			options: [actionOptions.slot, actionOptions.subslot],
			callback: async ({ options }) => {
				const msg = {
					[`slot${options.slot}`]: {
						[`subslot${options.subslot}`]: {
							identify: query,
						},
					},
				}
				self.addCmdtoQueue(msg)
			},
		}
	}
	self.setActionDefinitions(ActionDefinitions)
}
