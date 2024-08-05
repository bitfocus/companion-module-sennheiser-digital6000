import { choices } from './consts.js'
import { colours, feedbackOptions, styles } from './feedbackOptions.js'
import { warningsL6000 } from './errors.js'
import { iconsL6000 } from './icons-l6000.js'

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
		feedbackDefinitions['batteryStatus'] = {
			name: 'Battery Status',
			type: 'advanced',
			label: 'Battery Status',
			defaultStyle: styles.red,
			options: [feedbackOptions.slot, feedbackOptions.subslot],
			callback: (feedback) => {
				const battSlot = self.d6000[`slot${feedback.options.slot}`][`subslot${feedback.options.subslot}`]
				let out = {
					png64: null,
					pngalignment: 'center:center',
					alignment: 'center:center',
					text: `Slot ${feedback.options.slot}/${feedback.options.subslot}\\n\\n\\n${battSlot.accu_parameter.state_of_charge}% ${battSlot.accu_parameter.temperature}C`,
					textExpression: false,
					color: colours.white,
					bgcolor: colours.black,
					size: 14,
					show_topbar: 'default',
				}
				for (const warning of warningsL6000) {
					if (self.d6000.device.warnings.includes(warning.id)) {
						if (warning.slot === feedback.options.slot && warning.subslot === feedback.options.subslot) {
							if (warning.warn === 'hot') {
								out.png64 = iconsL6000.hot
								out.text = `Slot ${feedback.options.slot}/${feedback.options.subslot}\\nOverheat\\n\\n${battSlot.accu_parameter.state_of_charge}% ${battSlot.accu_parameter.temperature}C`
								return out
							} else if (warning.warn === 'cold') {
								out.png64 = iconsL6000.cold
								out.text = `Slot ${feedback.options.slot}/${feedback.options.subslot}\\nToo Cold\\n\\n${battSlot.accu_parameter.state_of_charge}% ${battSlot.accu_parameter.temperature}C`
								return out
							} else if (warning.warn === 'regen') {
								out.png64 = iconsL6000.regen[self.frame]
								out.text = `Slot ${feedback.options.slot}/${feedback.options.subslot}\\nRegen\\n\\n${battSlot.accu_parameter.state_of_charge}% ${battSlot.accu_parameter.temperature}C`
								return out
							} else if (warning.warn === 'defect') {
								out.png64 = iconsL6000.defect
								out.text = `Slot ${feedback.options.slot}/${feedback.options.subslot}\\nDefect\\n\\n${battSlot.accu_parameter.state_of_charge}% ${battSlot.accu_parameter.temperature}C`
								return out
							}
						}
					}
				}
				if (battSlot.led === 'GREEN') {
					out.text = `Slot ${feedback.options.slot}/${feedback.options.subslot}\\nIdle\\n\\n${battSlot.accu_parameter.state_of_charge}% ${battSlot.accu_parameter.temperature}C`
				} else if (battSlot.led === 'GREEN_FLASHING' || battSlot.led === 'YELLOW') {
					out.text = `Slot ${feedback.options.slot}/${feedback.options.subslot}\\nCharging\\n\\n${battSlot.accu_parameter.state_of_charge}% ${battSlot.accu_parameter.temperature}C`
				} else if (battSlot.led === 'OFF') {
					out.text = `Slot ${feedback.options.slot}/${feedback.options.subslot}\\n\\n\\nEmpty`
					out.png64 = iconsL6000.led.FLASHING
					return out
				}

				if (battSlot.accu_parameter.state_of_charge >= 97) {
					out.png64 = iconsL6000.level.over97
				} else if (battSlot.accu_parameter.state_of_charge < 97 && battSlot.accu_parameter.state_of_charge >= 76) {
					out.png64 = self.blink ? iconsL6000.led.FLASHING : iconsL6000.level.lessthen96
				} else if (battSlot.accu_parameter.state_of_charge < 76 && battSlot.accu_parameter.state_of_charge >= 51) {
					out.png64 = self.blink ? iconsL6000.led.FLASHING : iconsL6000.level.lessthan76
				} else if (battSlot.accu_parameter.state_of_charge < 51 && battSlot.accu_parameter.state_of_charge >= 26) {
					out.png64 = self.blink ? iconsL6000.led.FLASHING : iconsL6000.level.lessthan51
				} else if (battSlot.accu_parameter.state_of_charge < 26 && battSlot.accu_parameter.state_of_charge >= 11) {
					out.png64 = self.blink ? iconsL6000.led.FLASHING : iconsL6000.level.lessthan26
				} else if (battSlot.accu_parameter.state_of_charge < 11) {
					out.png64 = self.blink ? iconsL6000.led.FLASHING : iconsL6000.level.lessthan11
				} else {
					out.png64 = iconsL6000.led.FLASHING
				}
				return out
			},
		}
	}
	self.setFeedbackDefinitions(feedbackDefinitions)
}
