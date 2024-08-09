//import { combineRgb } from '@companion-module/base'
//import { graphics } from 'companion-module-utils'
import { choices } from './consts.js'
import { colours, feedbackOptions, styles } from './feedbackOptions.js'
import { warningsL6000, warningsEM6000, activeStatusEM6000 } from './errors.js'
import { iconsL6000 } from './icons-l6000.js'
import { buildEM6000icon } from './buildEM6000icon.js'

export default async function (self) {
	let feedbackDefinitions = []
	if (self.config.device === choices.devices[0].id || self.config.device === choices.devices[1].id) {
		//set EM6000 feedbacks
		feedbackDefinitions['audioMute'] = {
			name: 'Audio Mute',
			type: 'boolean',
			label: 'Audio Mute',
			defaultStyle: styles.red,
			options: [feedbackOptions.reciever],
			callback: ({ options }) => {
				return self.d6000[`rx${options.reciever}`].audio_mute
			},
		}
		feedbackDefinitions['booster'] = {
			name: 'Booster',
			type: 'boolean',
			label: 'Booster',
			defaultStyle: styles.blue,
			options: [],
			callback: () => {
				return self.d6000.sys.booster
			},
		}
		feedbackDefinitions['clock'] = {
			name: 'Clock Source',
			type: 'boolean',
			label: 'Clock Source',
			defaultStyle: styles.green,
			options: [feedbackOptions.clock],
			callback: ({ options }) => {
				return self.d6000.sys.clock === options.clock
			},
		}
		feedbackDefinitions['encryption'] = {
			name: 'Active Encryption',
			type: 'boolean',
			label: 'Active Encryption',
			defaultStyle: styles.blue,
			options: [feedbackOptions.reciever],
			callback: ({ options }) => {
				return self.d6000[`rx${options.reciever}`].encryption
			},
		}
		feedbackDefinitions['activeWarning'] = {
			name: 'Active Warning',
			type: 'boolean',
			label: 'Active Warning',
			defaultStyle: styles.red,
			options: [feedbackOptions.reciever, feedbackOptions.EMwarning],
			callback: ({ options }) => {
				return self.d6000[`rx${options.reciever}`].active_warnings.includes(options.warning)
			},
		}
		feedbackDefinitions['activeStatus'] = {
			name: 'Active Status',
			type: 'boolean',
			label: 'Active Status',
			defaultStyle: styles.red,
			options: [feedbackOptions.reciever, feedbackOptions.status],
			callback: ({ options }) => {
				return self.d6000[`rx${options.reciever}`].active_status.includes(options.status)
			},
		}
		feedbackDefinitions['afPeak'] = {
			name: 'Audio Peak',
			type: 'boolean',
			label: 'Audio Peak',
			defaultStyle: styles.red,
			options: [feedbackOptions.reciever],
			callback: ({ options }) => {
				return self.d6000.mm[`ch${options.reciever}`].PEAK
			},
		}
		feedbackDefinitions['rfPeak'] = {
			name: 'RF Peak',
			type: 'boolean',
			label: 'RF Peak',
			defaultStyle: styles.red,
			options: [feedbackOptions.reciever, feedbackOptions.rf],
			callback: ({ options }) => {
				return self.d6000.mm[`ch${options.reciever}`][`RF${options.rf}_PEAK`]
			},
		}
		feedbackDefinitions['rfDiversity'] = {
			name: 'RF Diversity',
			type: 'boolean',
			label: 'RF Diverity',
			defaultStyle: styles.green,
			options: [feedbackOptions.reciever, feedbackOptions.rf],
			callback: ({ options }) => {
				return self.d6000.mm[`ch${options.reciever}`][`DIV${options.rf}`]
			},
		}
		feedbackDefinitions['recieverStatus'] = {
			//placeholder
			name: 'Reciever Status',
			type: 'advanced',
			label: 'Reciever Status',
			options: [
				feedbackOptions.reciever,
				feedbackOptions.recieverLabels,
				feedbackOptions.recieverMeters,
				feedbackOptions.recieverIcons,
				feedbackOptions.recieverOrientation,
			],
			callback: (feedback) => {
				const options = feedback.options
				const metering = self.d6000.mm[`ch${options.reciever}`]
				const reciever = self.d6000[`rx${options.reciever}`]
				const output = self.d6000.audio[`out${options.reciever}`]
				let out = {
					text: '',
				}
				const iBuffer = buildEM6000icon(
					reciever,
					metering,
					feedback.image,
					options.meters,
					options.icons,
					options.orientation
				)

				if (iBuffer !== null) {
					out.imageBuffer = iBuffer
				}

				options.labels.forEach((item) => {
					switch (item) {
						case 'name':
							out.text += reciever.name !== null ? reciever.name.trim() + '\\n' : 'Unknown\\n'
							break
						case 'bank':
							if (reciever.active_bank_channel.bank !== null) {
								out.text += reciever.active_bank_channel.bank.toUpperCase()
							}
							if (reciever.active_bank_channel.channel !== null) {
								out.text += ':' + reciever.active_bank_channel.channel
							}
							out.text += '\\n'
							break
						case 'carrier':
							var carrier = (Number(reciever.carrier) / 1000).toString()
							out.text += !isNaN(Number(reciever.carrier)) ? carrier.padEnd(7, '0') + ' MHz\\n' : '---.--- MHz\\n'
							break
						case 'outputLevel':
							out.text +=
								output.level_db !== null ? (output.level_db > 0 ? '+' : '') + output.level_db + ' dB\\n' : '-- dB\\n'
							break
						case 'txName':
							out.text += reciever.skx.name !== null ? reciever.skx.name.trim() + '\\n' : '\\n'
							break
						case 'txType':
							out.text += reciever.skx.type.type !== null ? reciever.skx.type.type + '\\n' : '\\n'
							break
						case 'txGain':
							out.text +=
								reciever.skx.gain !== null
									? (Number(reciever.skx.gain) > 0 ? '+' : '') + reciever.skx.gain + '\\n'
									: '-- dB\\n'
							break
						case 'txLowcut':
							out.text += reciever.skx.lowcut !== null ? reciever.skx.lowcut + '\\n' : '-- Hz\\n'
							break
						case 'batteryRuntime':
							out.text +=
								reciever.skx.battery.time !== null ? 'Batt: ' + reciever.skx.battery.time + '\\n' : 'Batt: -:--\\n'
							break
						case 'batteryPercent':
							out.text +=
								reciever.skx.battery.percent !== null ? 'Batt: ' + reciever.skx.battery.percent + '\\n' : 'Batt: --%\\n'
							break
						case 'warning':
							var warnMsg = ''
							warningsEM6000.forEach((warning) => {
								if (reciever.active_warnings.includes(warning.id)) {
									warnMsg += warnMsg.length > 0 ? ', ' + warning.label : warning.label
								}
							})
							out.text += warnMsg + '\\n'
							break
						case 'status':
							var statusMsg = ''
							activeStatusEM6000.forEach((status) => {
								if (reciever.active_status.includes(status.id)) {
									statusMsg += statusMsg.length > 0 ? ', ' + status.label : status.label
								}
							})
							out.text += statusMsg + '\\n'
							break
					}
				})
				return out
			},
		}
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
			defaultStyle: {
				png64: iconsL6000.fanWarning,
				pngalignment: 'center:center',
				alignment: 'center:top',
				text: `Fan Defect`,
				size: 14,
			},
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
			defaultStyle: {
				png64: iconsL6000.deviceHot,
				pngalignment: 'center:center',
				alignment: 'center:top',
				text: `Device Hot`,
				size: 14,
			},
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
				} else if (battSlot.led === 'DEV_IDENTIFY') {
					out.text = `Slot ${feedback.options.slot}/${feedback.options.subslot}\\nIdentify\\n\\n${battSlot.accu_parameter.state_of_charge}% ${battSlot.accu_parameter.temperature}C`
					out.bgcolor = colours.darkblue
				} else if (battSlot.led === 'OFF') {
					out.text = `Slot ${feedback.options.slot}/${feedback.options.subslot}\\n${
						self.d6000[`slot${feedback.options.slot}`].type
					}\\n\\nEmpty`
					out.png64 = iconsL6000.led.FLASHING
					return out
				} else if (battSlot.led === 'RED') {
					out.png64 = iconsL6000.defect
					out.text = `Slot ${feedback.options.slot}/${feedback.options.subslot}\\nDefect\\n\\n${battSlot.accu_parameter.state_of_charge}% ${battSlot.accu_parameter.temperature}C`
					return out
				} else if (battSlot.led === 'YELLOW_FLASHING') {
					out.png64 = iconsL6000.regen[self.frame]
					out.text = `Slot ${feedback.options.slot}/${feedback.options.subslot}\\nRegen\\n\\n${battSlot.accu_parameter.state_of_charge}% ${battSlot.accu_parameter.temperature}C`
					return out
				} else if (battSlot.led === 'RED_FLASHING') {
					if (battSlot.accu_parameter.temperature > 10) {
						out.png64 = iconsL6000.hot
						out.text = `Slot ${feedback.options.slot}/${feedback.options.subslot}\\nOverheat\\n\\n${battSlot.accu_parameter.state_of_charge}% ${battSlot.accu_parameter.temperature}C`
						return out
					} else {
						out.png64 = iconsL6000.cold
						out.text = `Slot ${feedback.options.slot}/${feedback.options.subslot}\\nToo Cold\\n\\n${battSlot.accu_parameter.state_of_charge}% ${battSlot.accu_parameter.temperature}C`
						return out
					}
				} else if (battSlot.led === 'GREEN_RED_FLASHING') {
					out.text = `Slot ${feedback.options.slot}/${feedback.options.subslot}\\nNo Batt\\n\\n${battSlot.accu_parameter.state_of_charge}% ${battSlot.accu_parameter.temperature}C`
				} else if (battSlot.led === 'YELLOW_RED_FLASHING') {
					out.text = `Slot ${feedback.options.slot}/${feedback.options.subslot}\\nOut of Cap\\n\\n${battSlot.accu_parameter.state_of_charge}% ${battSlot.accu_parameter.temperature}C`
				} else if (battSlot.led === 'YELLOW_GREEN_FLASHING') {
					out.text = `Slot ${feedback.options.slot}/${feedback.options.subslot}\\nCap 69%-71%\\n\\n${battSlot.accu_parameter.state_of_charge}% ${battSlot.accu_parameter.temperature}C`
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
				} else if (battSlot.accu_parameter.state_of_charge < 11 && battSlot.accu_parameter.state_of_charge > 0) {
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
