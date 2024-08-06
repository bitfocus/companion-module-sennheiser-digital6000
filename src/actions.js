import { choices, limits, query } from './consts.js'
import { actionOptions } from './actionOptions.js'

export default function (self) {
	let ActionDefinitions = []
	if (self.config.device === choices.devices[0].id || self.config.device === choices.devices[1].id) {
		//set EM6000 actions
		ActionDefinitions['rxIdentify'] = {
			name: 'Identify',
			options: [actionOptions.reciever],
			callback: async ({ options }) => {
				const msg = {
					[`rx${options.reciever}`]: {
						identify: query,
					},
				}
				self.addCmdtoQueue(msg)
			},
		}
		ActionDefinitions['booster'] = {
			name: 'Antenna Booster',
			options: [actionOptions.booster],
			callback: async ({ options }) => {
				const msg = {
					sys: {
						booster: options.booster,
					},
				}
				self.addCmdtoQueue(msg)
			},
			learn: ({ options }) => {
				const booster = self.d6000.sys.booster
				return {
					...options,
					booster,
				}
			},
		}
		ActionDefinitions['brightness'] = {
			name: 'Display Brightness',
			options: [actionOptions.brightness],
			callback: async ({ options }) => {
				let brightness = parseInt(await self.parseVariablesInString(options.brightness))
				if (isNaN(brightness)) {
					this.log('warn', `Brightness passed a NaN ${brightness}`)
					return undefined
				}
				brightness = brightness > 100 ? 100 : brightness < 0 ? 0 : brightness
				const msg = {
					sys: {
						brightness: brightness,
					},
				}
				self.addCmdtoQueue(msg)
			},
			learn: ({ options }) => {
				const brightness = self.d6000.sys.brightness
				return {
					...options,
					brightness,
				}
			},
		}
		ActionDefinitions['audioOutLevel'] = {
			name: 'Audio Output Level',
			options: [actionOptions.output, actionOptions.level],
			callback: async ({ options }) => {
				let level = parseInt(await self.parseVariablesInString(options.level))
				if (isNaN(level)) {
					self.log('warn', `audioOutLevel must be passed a numbed`)
					return undefined
				}
				level = level < -10 ? -10 : level > 18 ? 18 : level
				const msg = {
					audio: {
						[`out${options.out}`]: {
							level_db: level,
						},
					},
				}
				self.addCmdtoQueue(msg)
			},
			learn: ({ options }) => {
				const level = self.d6000.audio[`out${options.out}`].level_db
				return {
					...options,
					level,
				}
			},
		}
		ActionDefinitions['rxMute'] = {
			name: 'Reciever Mute',
			options: [actionOptions.reciever, actionOptions.mute],
			callback: async ({ options }) => {
				const msg = {
					[`rx${options.reciever}`]: {
						audio_mute: options.mute,
					},
				}
				self.addCmdtoQueue(msg)
			},
			learn: ({ options }) => {
				const mute = self.d6000[`rx${options.reciever}`].audio_mute
				return {
					...options,
					mute,
				}
			},
		}
		ActionDefinitions['rxEncryption'] = {
			name: 'Reciever Encryption',
			options: [actionOptions.reciever, actionOptions.encrypt],
			callback: async ({ options }) => {
				const msg = {
					[`rx${options.reciever}`]: {
						encryption: options.encrypt,
					},
				}
				self.addCmdtoQueue(msg)
			},
			learn: ({ options }) => {
				const encrypt = self.d6000[`rx${options.reciever}`].encryption
				return {
					...options,
					encrypt,
				}
			},
		}
		ActionDefinitions['rxName'] = {
			name: 'Reciever Name',
			options: [actionOptions.reciever, actionOptions.name],
			callback: async ({ options }) => {
				const name = await self.parseVariablesInString(options.name)
				const msg = {
					[`rx${options.reciever}`]: {
						name: name,
					},
				}
				self.addCmdtoQueue(msg)
			},
			learn: ({ options }) => {
				const name = self.d6000[`rx${options.reciever}`].name
				return {
					...options,
					name,
				}
			},
		}
		ActionDefinitions['rxCarrier'] = {
			name: 'Reciever Carrier Frequency',
			options: [actionOptions.reciever, actionOptions.carrier],
			callback: async ({ options }) => {
				const carrier = parseInt(await self.parseVariablesInString(options.name))
				if (
					isNaN(carrier) ||
					carrier > limits.carrier.max ||
					carrier < limits.carrier.min ||
					carrier % limits.carrier.step !== 0
				) {
					self.log('warn', `rxCarrier passed an invalid variable ${carrier}. `)
					return undefined
				}
				const msg = {
					[`rx${options.reciever}`]: {
						carrier: carrier,
					},
				}
				self.addCmdtoQueue(msg)
			},
			learn: ({ options }) => {
				const carrier = self.d6000[`rx${options.reciever}`].carrier
				return {
					...options,
					carrier,
				}
			},
		}
		ActionDefinitions['rxActiveBankChannel'] = {
			name: 'Reciever Bank & Channel',
			options: [actionOptions.reciever, actionOptions.activeBank, actionOptions.activeChannel],
			callback: async ({ options }) => {
				const channel = parseInt(await self.parseVariablesInString(options.channel))
				if (isNaN(channel) || channel > limits.active_bank_channel.max || channel < limits.active_bank_channel.min) {
					const channel = parseInt(await self.parseVariablesInString(options.channel))
					self.log('warn', `rxActiveBankChannel passed an invalid variable ${carrier}. `)
					return undefined
				}
				const msg = {
					[`rx${options.reciever}`]: {
						active_bank_channel: [options.bank, channel],
					},
				}
				self.addCmdtoQueue(msg)
			},
			learn: ({ options }) => {
				const bank = self.d6000[`rx${options.reciever}`].active_bank_channel.bank
				const channel = self.d6000[`rx${options.reciever}`].active_bank_channel.channel
				return {
					...options,
					bank,
					channel,
				}
			},
		}
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
