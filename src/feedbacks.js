import { choices } from './consts.js'
import { feedbackOptions, styles } from './feedbackOptions.js'
import { warningsL6000 } from './errors.js'

export default async function (self) {
	let feedbackDefinitions = []
	if (self.config.device === choices.devices[0].id || self.config.device === choices.devices[1].id) {
		//set EM6000 feedbacks
	} else if (self.config.device === choices.devices[2].id) {
		//set L6000 feedbacks
		feedbackDefinitions['slotWarning'] = {
			name: 'Slot Warning',
			type: 'boolean',
			label: 'Slot Warning State',
			defaultStyle: styles.red,
			options: [feedbackOptions.slot, feedbackOptions.subslot, feedbackOptions.warning],
			callback: ({ options }) => {
				for (const warning of warningsL6000) {
					if (self.d6000.device.warnings.includes(warning.id)) {
						if (
							warning.slot === options.slot &&
							warning.subslot === options.subslot &&
							warning.warn === options.warning
						) {
							return true
						}
					}
				}
				return false
			},
		}
		feedbackDefinitions['fanWarning'] = {
			name: 'Fan Defect',
			type: 'boolean',
			label: 'Fan Defect',
			defaultStyle: styles.red,
			options: [feedbackOptions.fan],
			callback: ({ options }) => {
				for (const warning of warningsL6000) {
					if (self.d6000.device.warnings.includes(warning.id)) {
						if (warning.fan === options.fan) {
							return true
						}
					}
				}
				return false
			},
		}
		feedbackDefinitions['deviceHot'] = {
			name: 'Device Hot',
			type: 'boolean',
			label: 'Device Hot',
			defaultStyle: styles.red,
			options: [],
			callback: () => {
				return self.d6000.device.warnings.includes(25)
			},
		}
	}
	self.setFeedbackDefinitions(feedbackDefinitions)
}
