import { choices } from './consts.js'

export default async function (self) {
	let variableDefinitions = []
	if (self.config.device === choices.devices[0].id || self.config.device === choices.devices[1].id) {
		//set EM6000 variables
	} else if (self.config.device === choices.devices[2].id) {
		//set L6000 variables
	}
	variableDefinitions.push(
		{ variableId: 'variable1', name: 'My first variable' },
		{ variableId: 'variable2', name: 'My second variable' },
		{ variableId: 'variable3', name: 'Another variable' }
	)
	self.setVariableDefinitions(variableDefinitions)
}
