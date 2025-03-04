import { choices, limits, query } from './consts.js'
import { actionChoices, actionOptions } from './actionOptions.js'
import { safeName } from './utils.js'

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
				return await self.addCmdtoQueue(msg)
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
				return await self.addCmdtoQueue(msg)
			},
			subscribe: async () => {
				const msg = {
					sys: {
						booster: query,
					},
				}
				await self.addCmdtoQueue(msg)
			},
			learn: ({ options }) => {
				return {
					...options,
					booster: self.d6000.sys.booster,
				}
			},
		}
		ActionDefinitions['brightness'] = {
			name: 'Display Brightness',
			options: [actionOptions.brightness],
			callback: async ({ options }, context) => {
				let brightness = parseInt(await context.parseVariablesInString(options.brightness))
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
				return await self.addCmdtoQueue(msg)
			},
			subscribe: async () => {
				const msg = {
					sys: {
						brightness: query,
					},
				}
				await self.addCmdtoQueue(msg)
			},
			learn: ({ options }) => {
				return {
					...options,
					brightness: self.d6000.sys.brightness,
				}
			},
		}
		ActionDefinitions['audioOutLevel'] = {
			name: 'Audio Output Level',
			options: [actionOptions.output, actionOptions.level, actionOptions.relative],
			callback: async ({ options }, context) => {
				let level = parseInt(await context.parseVariablesInString(options.level))
				if (isNaN(level)) {
					self.log('warn', `audioOutLevel must be passed a numbed`)
					return undefined
				}
				level = options.relative ? level + self.d6000.audio[`out${options.out}`].level_db : level
				level = level < -10 ? -10 : level > 18 ? 18 : level
				const msg = {
					audio: {
						[`out${options.out}`]: {
							level_db: level,
						},
					},
				}
				return await self.addCmdtoQueue(msg)
			},
			subscribe: async ({ options }) => {
				const msg = {
					audio: {
						[`out${options.out}`]: {
							level_db: query,
						},
					},
				}
				await self.addCmdtoQueue(msg)
			},
			learn: ({ options }) => {
				return {
					...options,
					relative: false,
					level: self.d6000.audio[`out${options.out}`].level_db,
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
				return await self.addCmdtoQueue(msg)
			},
			subscribe: async ({ options }) => {
				const msg = {
					[`rx${options.reciever}`]: {
						audio_mute: query,
					},
				}
				await self.addCmdtoQueue(msg)
			},
			learn: ({ options }) => {
				return {
					...options,
					mute: self.d6000[`rx${options.reciever}`].audio_mute,
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
				return await self.addCmdtoQueue(msg)
			},
			subscribe: async ({ options }) => {
				const msg = {
					[`rx${options.reciever}`]: {
						encryption: query,
					},
				}
				await self.addCmdtoQueue(msg)
			},
			learn: ({ options }) => {
				return {
					...options,
					encrypt: self.d6000[`rx${options.reciever}`].encryption,
				}
			},
		}
		ActionDefinitions['rxName'] = {
			name: 'Reciever Name',
			options: [actionOptions.reciever, actionOptions.name],
			callback: async ({ options }, context) => {
				const name = safeName(await context.parseVariablesInString(options.name))
				if (name === null) {
					self.log('warn', `rxName has been passed an invalid name ${name}`)
					return undefined
				}
				const msg = {
					[`rx${options.reciever}`]: {
						name: name,
					},
				}
				return await self.addCmdtoQueue(msg)
			},
			subscribe: async ({ options }) => {
				const msg = {
					[`rx${options.reciever}`]: {
						name: query,
					},
				}
				await self.addCmdtoQueue(msg)
			},
			learn: ({ options }) => {
				return {
					...options,
					name: self.d6000[`rx${options.reciever}`].name,
				}
			},
		}
		ActionDefinitions['rxCarrier'] = {
			name: 'Reciever Carrier Frequency',
			options: [actionOptions.reciever, actionOptions.carrier],
			callback: async ({ options }, context) => {
				const carrier = parseInt(await context.parseVariablesInString(options.name))
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
				return await self.addCmdtoQueue(msg)
			},
			subscribe: async ({ options }) => {
				const msg = {
					[`rx${options.reciever}`]: {
						carrier: query,
					},
				}
				await self.addCmdtoQueue(msg)
			},
			learn: ({ options }) => {
				return {
					...options,
					carrier: self.d6000[`rx${options.reciever}`].carrier,
				}
			},
		}
		ActionDefinitions['rxActiveBankChannel'] = {
			name: 'Reciever Bank & Channel',
			options: [actionOptions.reciever, actionOptions.activeBank, actionOptions.activeChannel],
			callback: async ({ options }, context) => {
				const channel = parseInt(await context.parseVariablesInString(options.channel))
				if (isNaN(channel) || channel > limits.active_bank_channel.max || channel < limits.active_bank_channel.min) {
					self.log('warn', `rxActiveBankChannel passed an invalid variable ${options.channel}:${channel}. `)
					return undefined
				}
				const msg = {
					[`rx${options.reciever}`]: {
						active_bank_channel: [options.bank, channel],
					},
				}
				return await self.addCmdtoQueue(msg)
			},
			subscribe: async ({ options }) => {
				const msg = {
					[`rx${options.reciever}`]: {
						active_bank_channel: query,
					},
				}
				await self.addCmdtoQueue(msg)
			},
			learn: ({ options }) => {
				return {
					...options,
					bank: self.d6000[`rx${options.reciever}`].active_bank_channel.bank,
					channel: self.d6000[`rx${options.reciever}`].active_bank_channel.channel,
				}
			},
		}
		ActionDefinitions['txSyncSettings'] = {
			name: 'Transmitter Sync Settings',
			options: [
				actionOptions.reciever,
				actionOptions.syncSettings,
				actionOptions.auto_lock,
				actionOptions.auto_lock_ignore,
				actionOptions.cable_emulation,
				actionOptions.cable_emulation_ignore,
				actionOptions.display,
				actionOptions.display_ignore,
				actionOptions.gain,
				actionOptions.gain_ignore,
				actionOptions.low_cut_frequency,
				actionOptions.low_cut_frequency_ignore,
			],
			callback: async ({ options }, context) => {
				let msg = {
					[`rx${options.reciever}`]: {
						sync_settings: {
							auto_lock: query,
							ignore_auto_lock: query,
							cable_emulation: query,
							ignore_cable_emulation: query,
							display: query,
							ignore_display: query,
							gain: query,
							ignore_gain: query,
							low_cut_frequency: query,
							ignore_low_cut_frequency: query,
						},
					},
				}
				if (options.syncSettings.includes(actionChoices.syncSettings[0].id)) {
					msg[`rx${options.reciever}`].sync_settings.auto_lock = options.auto_lock
					msg[`rx${options.reciever}`].sync_settings.ignore_auto_lock = options.auto_lock_ignore
				}
				if (options.syncSettings.includes(actionChoices.syncSettings[1].id)) {
					msg[`rx${options.reciever}`].sync_settings.cable_emulation = options.cable_emulation
					msg[`rx${options.reciever}`].sync_settings.ignore_cable_emulation = options.cable_emulation_ignore
				}
				if (options.syncSettings.includes(actionChoices.syncSettings[2].id)) {
					msg[`rx${options.reciever}`].sync_settings.display = options.display
					msg[`rx${options.reciever}`].sync_settings.ignore_display = options.display_ignore
				}
				if (options.syncSettings.includes(actionChoices.syncSettings[3].id)) {
					const gain = parseInt(await context.parseVariablesInString(options.gain))
					if (isNaN(gain) || gain > limits.gain.max || gain < limits.gain.min || gain % limits.gain.step !== 0) {
						self.log('warm', `rxSyncSettings has been passed an invalid gain setting ${gain}`)
						return undefined
					}
					msg[`rx${options.reciever}`].sync_settings.gain = gain
					msg[`rx${options.reciever}`].sync_settings.ignore_gain = options.gain_ignore
				}
				if (options.syncSettings.includes(actionChoices.syncSettings[4].id)) {
					msg[`rx${options.reciever}`].sync_settings.low_cut_frequency = options.low_cut_frequency
					msg[`rx${options.reciever}`].sync_settings.ignore_low_cut_frequency = options.low_cut_frequency_ignore
				}
				return await self.addCmdtoQueue(msg)
			},
			subscribe: async ({ options }) => {
				const msg = {
					[`rx${options.reciever}`]: {
						sync_settings: {
							auto_lock: query,
							ignore_auto_lock: query,
							cable_emulation: query,
							ignore_cable_emulation: query,
							display: query,
							ignore_display: query,
							gain: query,
							ignore_gain: query,
							low_cut_frequency: query,
							ignore_low_cut_frequency: query,
						},
					},
				}
				await self.addCmdtoQueue(msg)
			},
			learn: ({ options }) => {
				return {
					...options,
					auto_lock: self.d6000[`rx${options.reciever}`].sync_settings.auto_lock,
					auto_lock_ignore: self.d6000[`rx${options.reciever}`].sync_settings.ignore_auto_lock,
					cable_emulation: self.d6000[`rx${options.reciever}`].sync_settings.cable_emulation,
					cable_emulation_ignore: self.d6000[`rx${options.reciever}`].sync_settings.ignore_cable_emulation,
					display: self.d6000[`rx${options.reciever}`].sync_settings.display,
					display_ignore: self.d6000[`rx${options.reciever}`].sync_settings.ignore_display,
					gain: self.d6000[`rx${options.reciever}`].sync_settings.gain,
					gain_ignore: self.d6000[`rx${options.reciever}`].sync_settings.ignore_gain,
					low_cut_frequency: self.d6000[`rx${options.reciever}`].sync_settings.low_cut_frequency,
					low_cut_frequency_ignore: self.d6000[`rx${options.reciever}`].sync_settings.ignore_low_cut_frequency,
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
				return await self.addCmdtoQueue(msg)
			},
		}
	}
	self.setActionDefinitions(ActionDefinitions)
}
