import { choices } from './consts.js'

export default function (self) {
	let ActionDefinitions = []
	if (self.config.device === choices.devices[0].id) {
		//set EM6000 actions
	} else if (self.config.device === choices.devices[1].id) {
		//set L6000 actions
	}
	ActionDefinitions['sample'] = {
		name: 'My First Action',
		options: [
			{
				id: 'num',
				type: 'number',
				label: 'Test',
				default: 5,
				min: 0,
				max: 100,
			},
		],
		callback: async (event) => {
			console.log('Hello world!', event.options.num)
		},
	}
	self.setActionDefinitions(ActionDefinitions)
}
