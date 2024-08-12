import { InstanceStatus } from '@companion-module/base'
import { choices } from './consts.js'
import { warningsL6000 } from './errors.js'
import { convert_RF_to_dBm, convert_AF_to_dBFS, convert_LQI_to_percent } from './utils.js'

export function parseResponse(msg) {
	const data = JSON.parse(msg)
	try {
		if (data.osc.xid === this.id) {
			if (this.config.verbose) {
				this.log('debug', `Returned message XID match`)
			}
		} else if (data.osc.xid !== undefined) {
			this.log(
				'warn',
				`Message recieved with unexpected xid. Expected ${this.id} Recieved ${data.osc.xid}\nFrom ${msg.toString()}`
			)
			return
		}
	} catch {
		/* do nothing if not present */
	}
	try {
		this.d6000.device.identity = { ...this.d6000.device.identity, ...data.device.identity }
		if (this.config.device !== this.d6000.device.identity.product) {
			/* if device identity data present check it matches config */
			this.log('warn', 'Config doesnt match device, updating config')
			this.statusCheck(InstanceStatus.BadConfig, 'Device mismatch')
			this.config.device = this.d6000.device.identity.product
			this.saveConfig(this.config)
			this.configUpdated(this.config)
		}
	} catch {
		/* do nothing if not present */
	}
	if (
		this.d6000.device.identity.product == choices.devices[0].id ||
		this.d6000.device.identity.product == choices.devices[1].id
	) {
		this.handleEM6000_data(data)
	} else if (this.d6000.device.identity.product == choices.devices[2].id) {
		this.handleL6000_data(data)
	} else {
		this.log('warn', `Unrecognised device! ${this.d6000.device.identity.product}`)
		this.statusCheck(InstanceStatus.UnknownError, `Unrecognised device`)
		return
	}
}

export function handleEM6000_data(data) {
	const responseKeys = Object.keys(data)
	if (responseKeys.includes('device')) {
		this.statusCheck(InstanceStatus.Ok, '')
		this.d6000.device.name = data.device?.name ?? this.d6000.device.name
		this.d6000.device.language = data.device?.language ?? this.d6000.device.language
		this.d6000.device.identity = { ...this.d6000.device.identity, ...data.device?.identity }
		this.d6000.device.network.ether = { ...this.d6000.device.network.ether, ...data.device?.network?.ether }
		this.d6000.device.network.ipv4 = { ...this.d6000.device.network.ipv4, ...data.device?.network?.ipv4 }
		this.d6000.device.network.ipv4_dante = {
			...this.d6000.device.network.ipv4_dante,
			...data.device?.network?.ipv4_dante,
		}
		this.variablesToUpdate = true
	}
	if (responseKeys.includes('sys')) {
		this.statusCheck(InstanceStatus.Ok, '')
		this.d6000.sys.dante = { ...this.d6000.sys.dante, ...data.sys?.dante }
		this.d6000.sys.wsm_master_cnt = data.sys?.wsm_master_cnt ?? this.d6000.sys.wsm_master_cnt
		this.d6000.sys.clock_frequency_measured =
			data.sys.clock_frequency_measured ?? this.d6000.sys.clock_frequency_measured
		if (data.sys.clock !== undefined) {
			for (const clock of choices.clock) {
				if (clock.id === data.sys.clock) {
					this.d6000.sys.clock = clock.label
					break
				}
			}
		}
		this.d6000.sys.brightness = data.sys?.brightness ?? this.d6000.sys.brightness
		this.d6000.sys.booster = data.sys?.booster ?? this.d6000.sys.booster
		this.addFeedbacksToQueue('booster')
		this.variablesToUpdate = true
	}
	if (responseKeys.includes('osc')) {
		this.statusCheck(InstanceStatus.Ok, '')
		this.d6000.osc.feature = { ...this.d6000.osc.feature, ...data.osc?.feature }
		this.d6000.osc.state = { ...this.d6000.osc.state, ...data.osc?.state }
		this.d6000.osc.limits = data.osc?.limits ?? this.d6000.osc.limits
		this.d6000.osc.schema = data.osc?.schema ?? this.d6000.osc.schema
		this.d6000.osc.version = data.osc?.version ?? this.d6000.osc.version
		this.d6000.osc.ping = data.osc?.ping ?? this.d6000.osc.ping
		this.d6000.osc.error = data.osc?.error ?? this.d6000.osc.error
	}
	if (responseKeys.includes('audio')) {
		this.statusCheck(InstanceStatus.Ok, '')
		this.d6000.audio.out1 = { ...this.d6000.audio.out1, ...data.audio?.out1 }
		this.d6000.audio.out2 = { ...this.d6000.audio.out2, ...data.audio?.out2 }
		this.addFeedbacksToQueue('recieverStatus')
		this.variablesToUpdate = true
	}
	for (let i = 1; i <= 2; i++) {
		if (responseKeys.includes(`rx${i}`)) {
			this.statusCheck(InstanceStatus.Ok, '')
			this.d6000[`rx${i}`].scan = { ...this.d6000[`rx${i}`].scan, ...data[`rx${i}`]?.scan }

			this.d6000[`rx${i}`].walktest = { ...this.d6000[`rx${i}`].walktest, ...data[`rx${i}`].walktest }
			this.d6000[`rx${i}`].sync_settings = { ...this.d6000[`rx${i}`].sync_settings, ...data[`rx${i}`].sync_settings }
			try {
				this.d6000[`rx${i}`].skx.type.type = data[`rx${i}`].skx?.type[0] ?? this.d6000[`rx${i}`].skx.type.type
				this.d6000[`rx${i}`].skx.type.low = data[`rx${i}`].skx?.type[1] ?? this.d6000[`rx${i}`].skx.type.low
				this.d6000[`rx${i}`].skx.type.high = data[`rx${i}`].skx?.type[2] ?? this.d6000[`rx${i}`].skx.type.high
			} catch {
				/* do nothing */
			}
			this.d6000[`rx${i}`].skx.name = data[`rx${i}`].skx?.name ?? this.d6000[`rx${i}`].skx.name
			this.d6000[`rx${i}`].skx.lowcut = data[`rx${i}`].skx?.lowcut ?? this.d6000[`rx${i}`].skx.lowcut
			this.d6000[`rx${i}`].skx.gain = data[`rx${i}`].skx?.gain ?? this.d6000[`rx${i}`].skx.gain
			this.d6000[`rx${i}`].skx.display = data[`rx${i}`].skx?.display ?? this.d6000[`rx${i}`].skx.display
			this.d6000[`rx${i}`].skx.capsule = data[`rx${i}`].skx?.capsule ?? this.d6000[`rx${i}`].skx.capsule
			this.d6000[`rx${i}`].skx.cable_emulation =
				data[`rx${i}`].skx?.cable_emulation ?? this.d6000[`rx${i}`].skx.cable_emulation
			this.d6000[`rx${i}`].skx.autolock = data[`rx${i}`].skx?.autolock ?? this.d6000[`rx${i}`].skx.autolock
			if (data[`rx${i}`].skx?.battery !== undefined) {
				if (data[`rx${i}`].skx?.battery.length === 2) {
					this.d6000[`rx${i}`].skx.battery.percent =
						data[`rx${i}`].skx?.battery[0] ?? this.d6000[`rx${i}`].skx.battery.percent
					this.d6000[`rx${i}`].skx.battery.time =
						data[`rx${i}`].skx?.battery[1] ?? this.d6000[`rx${i}`].skx.battery.time
				} else if (data[`rx${i}`].skx?.battery.length === 0) {
					this.d6000[`rx${i}`].skx.battery.percent = null
					this.d6000[`rx${i}`].skx.battery.time = null
				}
			}
			for (let j = 1; j <= 6; j++) {
				this.d6000[`rx${i}`].freq[`b${j}`] = { ...this.d6000[`rx${i}`].freq[`b${j}`], ...data.rx1?.freq?.[`b${j}`] }
				this.d6000[`rx${i}`].freq[`u${j}`] = { ...this.d6000[`rx${i}`].freq[`u${j}`], ...data.rx1?.freq?.[`u${j}`] }
			}

			if (data[`rx${i}`].active_bank_channel !== undefined) {
				this.d6000[`rx${i}`].active_bank_channel.bank =
					data[`rx${i}`].active_bank_channel[0] ?? this.d6000[`rx${i}`].active_bank_channel.bank
				this.d6000[`rx${i}`].active_bank_channel.channel =
					data[`rx${i}`].active_bank_channel[1] ?? this.d6000[`rx${i}`].active_bank_channel.channel
			}
			this.d6000[`rx${i}`].audio_mute = data[`rx${i}`].audio_mute ?? this.d6000[`rx${i}`].audio_mute
			this.d6000[`rx${i}`].carrier = data[`rx${i}`].carrier ?? this.d6000[`rx${i}`].carrier
			this.d6000[`rx${i}`].identify = data[`rx${i}`].identify ?? this.d6000[`rx${i}`].identify
			this.d6000[`rx${i}`].wsm_master_cnt = data[`rx${i}`].wsm_master_cnt ?? this.d6000[`rx${i}`].wsm_master_cnt
			this.d6000[`rx${i}`].testtone = data[`rx${i}`].testtone ?? this.d6000[`rx${i}`].testtone
			this.d6000[`rx${i}`].name = data[`rx${i}`].name ?? this.d6000[`rx${i}`].name
			this.d6000[`rx${i}`].encryption = data[`rx${i}`].encryption ?? this.d6000[`rx${i}`].encryption
			this.d6000[`rx${i}`].active_warnings =
				data[`rx${i}`].active_warnings === undefined
					? this.d6000[`rx${i}`].active_warnings
					: data[`rx${i}`].active_warnings
			this.d6000[`rx${i}`].active_status =
				data[`rx${i}`].active_status === undefined ? this.d6000[`rx${i}`].active_status : data[`rx${i}`].active_status
			this.addFeedbacksToQueue(['audioMute', 'encryption', 'activeWarning', 'activeStatus', 'recieverStatus'])
			this.variablesToUpdate = true
		}
		if (responseKeys.includes('mm')) {
			this.statusCheck(InstanceStatus.Ok, '')
			this.d6000.mm[`ch${i}`].RF1 =
				convert_RF_to_dBm(data.mm[i - 1][0]) !== null
					? convert_RF_to_dBm(data.mm[i - 1][0])
					: this.d6000.mm[`ch${i}`].RF1
			this.d6000.mm[`ch${i}`].RF1_PEAK = !!data.mm[i - 1][1]
			this.d6000.mm[`ch${i}`].RF2 =
				convert_RF_to_dBm(data.mm[i - 1][2]) !== null
					? convert_RF_to_dBm(data.mm[i - 1][2])
					: this.d6000.mm[`ch${i}`].RF2
			this.d6000.mm[`ch${i}`].RF2_PEAK = !!data.mm[i - 1][3]
			this.d6000.mm[`ch${i}`].DIV1 = !!data.mm[i - 1][4]
			this.d6000.mm[`ch${i}`].DIV2 = !!data.mm[i - 1][5]
			this.d6000.mm[`ch${i}`].LQI =
				convert_LQI_to_percent(data.mm[i - 1][6]) !== null
					? convert_LQI_to_percent(data.mm[i - 1][6])
					: this.d6000.mm[`ch${i}`].LQI
			this.d6000.mm[`ch${i}`].AF =
				convert_AF_to_dBFS(data.mm[i - 1][7]) !== null
					? convert_AF_to_dBFS(data.mm[i - 1][7])
					: this.d6000.mm[`ch${i}`].AF
			this.d6000.mm[`ch${i}`].PEAK = !!data.mm[i - 1][8]
			this.addFeedbacksToQueue(['afPeak', 'rfPeak', 'rfDiversity', 'recieverStatus'])
			this.variablesToUpdate = true
		}
	}
}

export function handleL6000_data(data) {
	const responseKeys = Object.keys(data)
	if (responseKeys.includes('device')) {
		this.statusCheck(InstanceStatus.Ok, '')
		this.d6000.device.name = data.device?.name ?? this.d6000.device.name
		this.d6000.device.language = data.device?.language ?? this.d6000.device.language

		this.d6000.device.storage_mode = data.device?.storage_mode ?? this.d6000.device.storage_mode
		this.d6000.device.identity = { ...this.d6000.device.identity, ...data.device?.identity }
		this.d6000.device.network.ether = { ...this.d6000.device.network.ether, ...data.device?.network?.ether }
		this.d6000.device.network.ipv4 = { ...this.d6000.device.network.ipv4, ...data.device?.network?.ipv4 }
		if (data.device?.warnings !== undefined) {
			this.d6000.device.warnings = data.device.warnings ?? this.d6000.device.warnings
			for (const warning of warningsL6000) {
				if (this.d6000.device.warnings.includes(warning.id)) {
					this.log('warn', warning.label)
					this.statusCheck(InstanceStatus.UnknownWarning, warning.label)
				}
			}
			this.addFeedbacksToQueue(['slotWarning', 'fanWarning', 'deviceHot', 'batteryStatus'])
		}
		this.variablesToUpdate = true
	}
	if (responseKeys.includes('osc')) {
		this.statusCheck(InstanceStatus.Ok, '')
		this.d6000.osc.feature = { ...this.d6000.osc.feature, ...data.osc?.feature }
		this.d6000.osc.state = { ...this.d6000.osc.state, ...data.osc?.state }
		this.d6000.osc.limits = data.osc.limits ?? this.d6000.osc.limits
		this.d6000.osc.schema = data.osc.schema ?? this.d6000.osc.schema
		this.d6000.osc.version = data.osc.version ?? this.d6000.osc.version
		this.d6000.osc.ping = data.osc.ping ?? this.d6000.osc.ping
		this.d6000.osc.error = data.osc.error ?? this.d6000.osc.error
	}
	for (let i = 1; i <= 4; i++) {
		if (responseKeys.includes(`slot${i}`)) {
			this.statusCheck(InstanceStatus.Ok, '')
			if (data[`slot${i}`].type !== undefined) {
				for (const type of choices.type) {
					if (data[`slot${i}`].type === type.id) {
						this.d6000[`slot${i}`].type = type.label
					}
				}
			}
			for (let j = 1; j <= 2; j++) {
				if (Array.isArray(data[`slot${i}`][`subslot${j}`]?.accu_parameter)) {
					try {
						this.d6000[`slot${i}`][`subslot${j}`].accu_parameter.temperature =
							data[`slot${i}`][`subslot${j}`].accu_parameter[0] < -50
								? '--'
								: data[`slot${i}`][`subslot${j}`].accu_parameter[0]

						this.d6000[`slot${i}`][`subslot${j}`].accu_parameter.voltage =
							data[`slot${i}`][`subslot${j}`].accu_parameter[1] === 65280
								? 0
								: data[`slot${i}`][`subslot${j}`].accu_parameter[1]

						this.d6000[`slot${i}`][`subslot${j}`].accu_parameter.capacity =
							data[`slot${i}`][`subslot${j}`].accu_parameter[2] === 65280
								? 0
								: data[`slot${i}`][`subslot${j}`].accu_parameter[2]

						this.d6000[`slot${i}`][`subslot${j}`].accu_parameter.current =
							data[`slot${i}`][`subslot${j}`].accu_parameter[3] < 0
								? 0
								: data[`slot${i}`][`subslot${j}`].accu_parameter[3]

						this.d6000[`slot${i}`][`subslot${j}`].accu_parameter.energy =
							data[`slot${i}`][`subslot${j}`].accu_parameter[4] === 65280
								? 0
								: data[`slot${i}`][`subslot${j}`].accu_parameter[4]

						this.d6000[`slot${i}`][`subslot${j}`].accu_parameter.operating_time_h =
							data[`slot${i}`][`subslot${j}`].accu_parameter[5]

						this.d6000[`slot${i}`][`subslot${j}`].accu_parameter.operating_time_m =
							data[`slot${i}`][`subslot${j}`].accu_parameter[6]

						this.d6000[`slot${i}`][`subslot${j}`].accu_parameter.state_of_charge =
							data[`slot${i}`][`subslot${j}`].accu_parameter[7] === 65280
								? 0
								: data[`slot${i}`][`subslot${j}`].accu_parameter[7]

						this.d6000[`slot${i}`][`subslot${j}`].accu_parameter.cycle_count =
							data[`slot${i}`][`subslot${j}`].accu_parameter[8] === 65280
								? 0
								: data[`slot${i}`][`subslot${j}`].accu_parameter[8]

						this.d6000[`slot${i}`][`subslot${j}`].accu_parameter.state_of_health =
							data[`slot${i}`][`subslot${j}`].accu_parameter[9]

						this.d6000[`slot${i}`][`subslot${j}`].accu_parameter.time_to_full_h =
							data[`slot${i}`][`subslot${j}`].accu_parameter[10]

						this.d6000[`slot${i}`][`subslot${j}`].accu_parameter.time_to_full_m =
							data[`slot${i}`][`subslot${j}`].accu_parameter[11]
					} catch {
						this.statusCheck(InstanceStatus.UnknownWarning, '')
					}
				}
				this.d6000[`slot${i}`][`subslot${j}`].led =
					data[`slot${i}`][`subslot${j}`]?.led ?? this.d6000[`slot${i}`][`subslot${j}`].led
				this.d6000[`slot${i}`][`subslot${j}`].identify =
					data[`slot${i}`][`subslot${j}`]?.identify ?? this.d6000[`slot${i}`][`subslot${j}`].identify
				this.d6000[`slot${i}`][`subslot${j}`].accu_detection =
					data[`slot${i}`][`subslot${j}`]?.accu_detection ?? this.d6000[`slot${i}`][`subslot${j}`].accu_detection
			}
			this.addFeedbacksToQueue('batteryStatus')
			this.variablesToUpdate = true
		}
	}
}
