const { combineRgb } = require('@companion-module/base')
import { choices } from './consts.js'

module.exports = async function (self) {
	let feedbackDefinitions = []
	if (self.config.device === choices.devices[0].id) {
		//set EM6000 feedbacks
	} else if (self.config.device === choices.devices[1].id) {
		//set L6000 feedbacks
	}
	feedbackDefinitions['example'] = {
			name: 'Example Feedback',
			type: 'boolean',
			label: 'Channel State',
			defaultStyle: {
				bgcolor: combineRgb(255, 0, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [
				{
					id: 'num',
					type: 'number',
					label: 'Test',
					default: 5,
					min: 0,
					max: 10,
				},
			],
			callback: (feedback) => {
				console.log('Hello world!', feedback.options.num)
				if (feedback.options.num > 5) {
					return true
				} else {
					return false
				}
			},
		}
	self.setFeedbackDefinitions(feedbackDefinitions)
}
