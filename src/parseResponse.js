import { InstanceStatus } from '@companion-module/base'
import { choices } from './consts.js'
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
			this.updateStatus(InstanceStatus.BadConfig, 'Device mismatch')
			this.config.device = this.d6000.device.identity.product
			this.saveConfig(this.config)
			this.configUpdated(this.config)
		}
	} catch {
		/* do nothing if not present */
	}
	if (this.d6000.device.identity.product == choices.devices[0].id || this.config.device == choices.devices[1].id) {
		this.handleEM6000_data(data)
	} else if (this.d6000.device.identity.product == choices.devices[2].id) {
		this.handleL6000_data(data)
	} else {
		this.log('warn', `Unrecognised device! ${this.d6000.device.identity.product}`)
		this.updateStatus(InstanceStatus.UnknownError, `Unrecognised device`)
		return
	}
	this.updateVariableValues()
}

export function handleEM6000_data(data) {
	const responseKeys = Object.keys(data)
	if (responseKeys.includes('device')) {
		this.updateStatus(InstanceStatus.Ok)
		this.d6000.device.name = data.device?.name ?? this.d6000.device.name
		this.d6000.device.language = data.device?.language ?? this.d6000.device.language
		this.d6000.device.identity = { ...this.d6000.device.identity, ...data.device?.identity }
		this.d6000.device.network.ether = { ...this.d6000.device.network.ether, ...data.device?.network?.ether }
		this.d6000.device.network.ipv4 = { ...this.d6000.device.network.ipv4, ...data.device?.network?.ipv4 }
		this.d6000.device.network.ipv4_dante = {
			...this.d6000.device.network.ipv4_dante,
			...data.device?.network?.ipv4_dante,
		}
	}
	if (responseKeys.includes('sys')) {
		this.updateStatus(InstanceStatus.Ok)
		this.d6000.sys.dante = { ...this.d6000.sys.dante, ...data.sys?.dante }
		this.d6000.sys.wsm_master_cnt = data.sys?.wsm_master_cnt ?? this.d6000.sys.wsm_master_cnt
		this.d6000.sys.clock_frequency_measured =
			data.sys?.clock_frequency_measured ?? this.d6000.sys.clock_frequency_measured
		this.d6000.sys.clock = data.sys?.clock ?? this.d6000.sys.clock
		this.d6000.sys.brightness = data.sys?.brightness ?? this.d6000.sys.brightness
		this.d6000.sys.booster = data.sys?.booster ?? this.d6000.sys.booster
	}
	if (responseKeys.includes('osc')) {
		this.updateStatus(InstanceStatus.Ok)
		this.d6000.osc.feature = { ...this.d6000.osc.feature, ...data.osc?.feature }
		this.d6000.osc.state = { ...this.d6000.osc.state, ...data.osc?.state }
		this.d6000.osc.limits = data.osc?.limits ?? this.d6000.osc.limits
		this.d6000.osc.schema = data.osc?.schema ?? this.d6000.osc.schema
		this.d6000.osc.version = data.osc?.version ?? this.d6000.osc.version
		this.d6000.osc.ping = data.osc?.ping ?? this.d6000.osc.ping
		this.d6000.osc.error = data.osc?.error ?? this.d6000.osc.error
	}
	if (responseKeys.includes('audio')) {
		this.updateStatus(InstanceStatus.Ok)
		this.d6000.audio.out1 = { ...this.d6000.audio.out1, ...data.audio?.out1 }
		this.d6000.audio.out2 = { ...this.d6000.audio.out2, ...data.audio?.out2 }
	}
	if (responseKeys.includes('rx1')) {
		this.updateStatus(InstanceStatus.Ok)
		this.d6000.rx1.scan = { ...this.d6000.rx1.scan, ...data.rx1?.scan }

		this.d6000.rx1.walktest = { ...this.d6000.rx1.walktest, ...data.rx1?.walktest }
		this.d6000.rx1.sync_settings = { ...this.d6000.rx1.sync_settings, ...data.rx1?.sync_settings }
		try {
			this.d6000.rx1.skx.type.type = data.rx1?.skx?.type[0] ?? this.d6000.rx1.skx.type.type
			this.d6000.rx1.skx.type.low = data.rx1?.skx?.type[1] ?? this.d6000.rx1.skx.type.low
			this.d6000.rx1.skx.type.high = data.rx1?.skx?.type[2] ?? this.d6000.rx1.skx.type.high
		} catch {
			/* do nothing */
		}
		this.d6000.rx1.skx.name = data.rx1?.skx?.name ?? this.d6000.rx1.skx.name
		this.d6000.rx1.skx.lowcut = data.rx1?.skx?.lowcut ?? this.d6000.rx1.skx.lowcut
		this.d6000.rx1.skx.gain = data.rx1?.skx?.gain ?? this.d6000.rx1.skx.gain
		this.d6000.rx1.skx.display = data.rx1?.skx?.display ?? this.d6000.rx1.skx.display
		this.d6000.rx1.skx.capsule = data.rx1?.skx?.capsule ?? this.d6000.rx1.skx.capsule
		this.d6000.rx1.skx.cable_emulation = data.rx1?.skx?.cable_emulation ?? this.d6000.rx1.skx.cable_emulation
		this.d6000.rx1.skx.autolock = data.rx1?.skx?.autolock ?? this.d6000.rx1.skx.autolock
		if (data.rx1?.skx?.battery !== undefined) {
			this.d6000.rx1.skx.battery.percent = data.rx1?.skx?.battery[0] ?? this.d6000.rx1.skx.battery.percent
			this.d6000.rx1.skx.battery.time = data.rx1?.skx?.battery[1] ?? this.d6000.rx1.skx.battery.time
		}
		this.d6000.rx1.freq.b1 = { ...this.d6000.rx1.freq.b1, ...data.rx1?.freq?.b1 }
		this.d6000.rx1.freq.b2 = { ...this.d6000.rx1.freq.b2, ...data.rx1?.freq?.b2 }
		this.d6000.rx1.freq.b3 = { ...this.d6000.rx1.freq.b3, ...data.rx1?.freq?.b3 }
		this.d6000.rx1.freq.b4 = { ...this.d6000.rx1.freq.b4, ...data.rx1?.freq?.b4 }
		this.d6000.rx1.freq.b5 = { ...this.d6000.rx1.freq.b5, ...data.rx1?.freq?.b5 }
		this.d6000.rx1.freq.b6 = { ...this.d6000.rx1.freq.b6, ...data.rx1?.freq?.b6 }
		this.d6000.rx1.freq.u1 = { ...this.d6000.rx1.freq.u1, ...data.rx1?.freq?.u1 }
		this.d6000.rx1.freq.u2 = { ...this.d6000.rx1.freq.u2, ...data.rx1?.freq?.u2 }
		this.d6000.rx1.freq.u3 = { ...this.d6000.rx1.freq.u3, ...data.rx1?.freq?.u3 }
		this.d6000.rx1.freq.u4 = { ...this.d6000.rx1.freq.u4, ...data.rx1?.freq?.u4 }
		this.d6000.rx1.freq.u5 = { ...this.d6000.rx1.freq.u5, ...data.rx1?.freq?.u5 }
		this.d6000.rx1.freq.u6 = { ...this.d6000.rx1.freq.u6, ...data.rx1?.freq?.u6 }
		if (data.rx1?.active_bank_channel !== undefined) {
			this.d6000.rx1.active_bank_channel.bank =
				data.rx1?.active_bank_channel[0] ?? this.d6000.rx1.active_bank_channel.bank
			this.d6000.rx1.active_bank_channel.channel =
				data.rx1?.active_bank_channel[1] ?? this.d6000.rx1.active_bank_channel.channel
		}
		this.d6000.rx1.audio_mute = data.rx1?.audio_mute ?? this.d6000.rx1.audio_mute
		this.d6000.rx1.carrier = data.rx1?.carrier ?? this.d6000.rx1.carrier
		this.d6000.rx1.identify = data.rx1?.identify ?? this.d6000.rx1.identify
		this.d6000.rx1.wsm_master_cnt = data.rx1?.wsm_master_cnt ?? this.d6000.rx1.wsm_master_cnt
		this.d6000.rx1.testtone = data.rx1?.testtone ?? this.d6000.rx1.testtone
		this.d6000.rx1.name = data.rx1?.name ?? this.d6000.rx1.name
		this.d6000.rx1.encryption = data.rx1?.encryption ?? this.d6000.rx1.encryption
		this.d6000.rx1.active_warnings = data.rx1?.active_warnings ?? this.d6000.rx1.active_warnings
		this.d6000.rx1.active_status = data.rx1?.active_status ?? this.d6000.rx1.active_status
	}
	if (responseKeys.includes('rx2')) {
		this.updateStatus(InstanceStatus.Ok)
		this.d6000.rx2.scan = { ...this.d6000.rx2.scan, ...data.rx2?.scan }
		this.d6000.rx2.sync_settings = { ...this.d6000.rx2.sync_settings, ...data.rx2?.sync_settings }
		this.d6000.rx2.walktest = { ...this.d6000.rx2.walktest, ...data.rx2?.walktest }
		try {
			this.d6000.rx2.skx.type.type = data.rx2?.skx?.type[0] ?? this.d6000.rx2.skx.type.type
			this.d6000.rx2.skx.type.low = data.rx2?.skx?.type[1] ?? this.d6000.rx2.skx.type.low
			this.d6000.rx2.skx.type.high = data.rx2?.skx?.type[2] ?? this.d6000.rx2.skx.type.high
		} catch {
			/* do nothing */
		}
		this.d6000.rx2.skx.name = data.rx2?.skx?.name ?? this.d6000.rx2.skx.name
		this.d6000.rx2.skx.lowcut = data.rx2?.skx?.lowcut ?? this.d6000.rx2.skx.lowcut
		this.d6000.rx2.skx.gain = data.rx2?.skx?.gain ?? this.d6000.rx2.skx.gain
		this.d6000.rx2.skx.display = data.rx2?.skx?.display ?? this.d6000.rx2.skx.display
		this.d6000.rx2.skx.capsule = data.rx2?.skx?.capsule ?? this.d6000.rx2.skx.capsule
		this.d6000.rx2.skx.cable_emulation = data.rx2?.skx?.cable_emulation ?? this.d6000.rx2.skx.cable_emulation
		this.d6000.rx2.skx.autolock = data.rx2?.skx?.autolock ?? this.d6000.rx2.skx.autolock
		if (data.rx2?.skx?.battery !== undefined) {
			this.d6000.rx2.skx.battery.percent = data.rx2?.skx?.battery[0] ?? this.d6000.rx2.skx.battery.percent
			this.d6000.rx2.skx.battery.time = data.rx2?.skx?.battery[1] ?? this.d6000.rx2.skx.battery.time
		}

		this.d6000.rx2.freq.b1 = { ...this.d6000.rx2.freq.b1, ...data.rx2?.freq?.b1 }
		this.d6000.rx2.freq.b2 = { ...this.d6000.rx2.freq.b2, ...data.rx2?.freq?.b2 }
		this.d6000.rx2.freq.b3 = { ...this.d6000.rx2.freq.b3, ...data.rx2?.freq?.b3 }
		this.d6000.rx2.freq.b4 = { ...this.d6000.rx2.freq.b4, ...data.rx2?.freq?.b4 }
		this.d6000.rx2.freq.b5 = { ...this.d6000.rx2.freq.b5, ...data.rx2?.freq?.b5 }
		this.d6000.rx2.freq.b6 = { ...this.d6000.rx2.freq.b6, ...data.rx2?.freq?.b6 }
		this.d6000.rx2.freq.u1 = { ...this.d6000.rx2.freq.u1, ...data.rx2?.freq?.u1 }
		this.d6000.rx2.freq.u2 = { ...this.d6000.rx2.freq.u2, ...data.rx2?.freq?.u2 }
		this.d6000.rx2.freq.u3 = { ...this.d6000.rx2.freq.u3, ...data.rx2?.freq?.u3 }
		this.d6000.rx2.freq.u4 = { ...this.d6000.rx2.freq.u4, ...data.rx2?.freq?.u4 }
		this.d6000.rx2.freq.u5 = { ...this.d6000.rx2.freq.u5, ...data.rx2?.freq?.u5 }
		this.d6000.rx2.freq.u6 = { ...this.d6000.rx2.freq.u6, ...data.rx2?.freq?.u6 }
		if (data.rx2?.active_bank_channel !== undefined) {
			this.d6000.rx2.active_bank_channel.bank =
				data.rx2?.active_bank_channel[0] ?? this.d6000.rx2.active_bank_channel.bank
			this.d6000.rx2.active_bank_channel.channel =
				data.rx2?.active_bank_channel[1] ?? this.d6000.rx2.active_bank_channel.channel
		}
		this.d6000.rx2.audio_mute = data.rx2?.audio_mute ?? this.d6000.rx2.audio_mute
		this.d6000.rx2.carrier = data.rx2?.carrier ?? this.d6000.rx2.carrier
		this.d6000.rx2.identify = data.rx2?.identify ?? this.d6000.rx2.identify
		this.d6000.rx2.wsm_master_cnt = data.rx2?.wsm_master_cnt ?? this.d6000.rx2.wsm_master_cnt
		this.d6000.rx2.testtone = data.rx2?.testtone ?? this.d6000.rx2.testtone
		this.d6000.rx2.name = data.rx2?.name ?? this.d6000.rx2.name
		this.d6000.rx2.encryption = data.rx2?.encryption ?? this.d6000.rx2.encryption
		this.d6000.rx2.active_warnings = data.rx2?.active_warnings ?? this.d6000.rx2.active_warnings
		this.d6000.rx2.active_status = data.rx2?.active_status ?? this.d6000.rx2.active_status
	}
	if (responseKeys.includes('mm')) {
		this.updateStatus(InstanceStatus.Ok)
		this.d6000.mm.ch1.RF1 =
			convert_RF_to_dBm(data.mm[0][0]) !== null ? convert_RF_to_dBm(data.mm[0][0]) : this.d6000.mm.ch1.RF1
		this.d6000.mm.ch1.RF1_PEAK = !!data.mm[0][1]
		this.d6000.mm.ch1.RF2 =
			convert_RF_to_dBm(data.mm[0][2]) !== null ? convert_RF_to_dBm(data.mm[0][2]) : this.d6000.mm.ch1.RF2
		this.d6000.mm.ch1.RF2_PEAK = !!data.mm[0][3]
		this.d6000.mm.ch1.DIV1 = !!data.mm[0][4]
		this.d6000.mm.ch1.DIV2 = !!data.mm[0][5]
		this.d6000.mm.ch1.LQI =
			convert_LQI_to_percent(data.mm[0][6]) !== null ? convert_LQI_to_percent(data.mm[0][6]) : this.d6000.mm.ch1.LQI
		this.d6000.mm.ch1.AF =
			convert_AF_to_dBFS(data.mm[0][7]) !== null ? convert_AF_to_dBFS(data.mm[0][7]) : this.d6000.mm.ch1.AF
		this.d6000.mm.ch1.PEAK = !!data.mm[0][8]
		this.d6000.mm.ch2.RF1 =
			convert_RF_to_dBm(data.mm[1][0]) !== null ? convert_RF_to_dBm(data.mm[1][0]) : this.d6000.mm.ch2.RF1
		this.d6000.mm.ch2.RF1_PEAK = !!data.mm[1][1]
		this.d6000.mm.ch2.RF2 =
			convert_RF_to_dBm(data.mm[1][2]) !== null ? convert_RF_to_dBm(data.mm[1][2]) : this.d6000.mm.ch2.RF2
		this.d6000.mm.ch2.RF2_PEAK = !!data.mm[1][3]
		this.d6000.mm.ch2.DIV1 = !!data.mm[1][4]
		this.d6000.mm.ch2.DIV2 = !!data.mm[1][5]
		this.d6000.mm.ch2.LQI =
			convert_LQI_to_percent(data.mm[1][6]) !== null ? convert_LQI_to_percent(data.mm[1][6]) : this.d6000.mm.ch2.LQI
		this.d6000.mm.ch2.AF =
			convert_AF_to_dBFS(data.mm[1][7]) !== null ? convert_AF_to_dBFS(data.mm[1][7]) : this.d6000.mm.ch2.AF
		this.d6000.mm.ch2.PEAK = !!data.mm[1][8]
	}
}

export function handleL6000_data(data) {
	const responseKeys = Object.keys(data)
	if (responseKeys.includes('device')) {
		this.updateStatus(InstanceStatus.Ok)
		this.d6000.device.name = data.device?.name ?? this.d6000.device.name
		this.d6000.device.language = data.device?.language ?? this.d6000.device.language
		this.d6000.device.warnings = data.device?.warnings ?? this.d6000.device.warnings
		this.d6000.device.storage_mode = data.device?.storage_mode ?? this.d6000.device.storage_mode
		this.d6000.device.identity = { ...this.d6000.device.identity, ...data.device?.identity }
		this.d6000.device.network.ether = { ...this.d6000.device.network.ether, ...data.device?.network?.ether }
		this.d6000.device.network.ipv4 = { ...this.d6000.device.network.ipv4, ...data.device?.network?.ipv4 }
	}
	if (responseKeys.includes('osc')) {
		this.updateStatus(InstanceStatus.Ok)
		this.d6000.osc.feature = { ...this.d6000.osc.feature, ...data.osc?.feature }
		this.d6000.osc.state = { ...this.d6000.osc.state, ...data.osc?.state }
		this.d6000.osc.limits = data.osc?.limits ?? this.d6000.osc.limits
		this.d6000.osc.schema = data.osc?.schema ?? this.d6000.osc.schema
		this.d6000.osc.version = data.osc?.version ?? this.d6000.osc.version
		this.d6000.osc.ping = data.osc?.ping ?? this.d6000.osc.ping
		this.d6000.osc.error = data.osc?.error ?? this.d6000.osc.error
	}
	if (responseKeys.includes('slot1')) {
		this.updateStatus(InstanceStatus.Ok)
		if (data.slot1?.subslot1?.accu_parameter !== undefined) {
			this.d6000.slot1.subslot1.accu_parameter.temperature =
				data.slot1?.subslot1?.accu_parameter[0] ?? this.d6000.slot1.subslot1.accu_parameter.temperature
			this.d6000.slot1.subslot1.accu_parameter.voltage =
				data.slot1?.subslot1?.accu_parameter[1] ?? this.d6000.slot1.subslot1.accu_parameter.voltage
			this.d6000.slot1.subslot1.accu_parameter.capacity =
				data.slot1?.subslot1?.accu_parameter[2] ?? this.d6000.slot1.subslot1.accu_parameter.capacity
			this.d6000.slot1.subslot1.accu_parameter.current =
				data.slot1?.subslot1?.accu_parameter[3] ?? this.d6000.slot1.subslot1.accu_parameter.current
			this.d6000.slot1.subslot1.accu_parameter.energy =
				data.slot1?.subslot1?.accu_parameter[4] ?? this.d6000.slot1.subslot1.accu_parameter.energy
			this.d6000.slot1.subslot1.accu_parameter.operating_time =
				data.slot1?.subslot1?.accu_parameter[5] ?? this.d6000.slot1.subslot1.accu_parameter.operating_time
			this.d6000.slot1.subslot1.accu_parameter.state_of_charge =
				data.slot1?.subslot1?.accu_parameter[6] ?? this.d6000.slot1.subslot1.accu_parameter.state_of_charge
			this.d6000.slot1.subslot1.accu_parameter.cycle_count =
				data.slot1?.subslot1?.accu_parameter[7] ?? this.d6000.slot1.subslot1.accu_parameter.cycle_count
			this.d6000.slot1.subslot1.accu_parameter.state_of_health =
				data.slot1?.subslot1?.accu_parameter[8] ?? this.d6000.slot1.subslot1.accu_parameter.state_of_health
			this.d6000.slot1.subslot1.accu_parameter.time_to_full_h =
				data.slot1?.subslot1?.accu_parameter[9] ?? this.d6000.slot1.subslot1.accu_parameter.time_to_full_h
			this.d6000.slot1.subslot1.accu_parameter.time_to_full_m =
				data.slot1?.subslot1?.accu_parameter[10] ?? this.d6000.slot1.subslot1.accu_parameter.time_to_full_m
		}
		if (data.slot1?.subslot2?.accu_parameter !== undefined) {
			this.d6000.slot1.subslot2.accu_parameter.temperature =
				data.slot1?.subslot2?.accu_parameter[0] ?? this.d6000.slot1.subslot2.accu_parameter.temperature
			this.d6000.slot1.subslot2.accu_parameter.voltage =
				data.slot1?.subslot2?.accu_parameter[1] ?? this.d6000.slot1.subslot2.accu_parameter.voltage
			this.d6000.slot1.subslot2.accu_parameter.capacity =
				data.slot1?.subslot2?.accu_parameter[2] ?? this.d6000.slot1.subslot2.accu_parameter.capacity
			this.d6000.slot1.subslot2.accu_parameter.current =
				data.slot1?.subslot2?.accu_parameter[3] ?? this.d6000.slot1.subslot2.accu_parameter.current
			this.d6000.slot1.subslot2.accu_parameter.energy =
				data.slot1?.subslot2?.accu_parameter[4] ?? this.d6000.slot1.subslot2.accu_parameter.energy
			this.d6000.slot1.subslot2.accu_parameter.operating_time =
				data.slot1?.subslot2?.accu_parameter[5] ?? this.d6000.slot1.subslot2.accu_parameter.operating_time
			this.d6000.slot1.subslot2.accu_parameter.state_of_charge =
				data.slot1?.subslot2?.accu_parameter[6] ?? this.d6000.slot1.subslot2.accu_parameter.state_of_charge
			this.d6000.slot1.subslot2.accu_parameter.cycle_count =
				data.slot1?.subslot2?.accu_parameter[7] ?? this.d6000.slot1.subslot2.accu_parameter.cycle_count
			this.d6000.slot1.subslot2.accu_parameter.state_of_health =
				data.slot1?.subslot2?.accu_parameter[8] ?? this.d6000.slot1.subslot2.accu_parameter.state_of_health
			this.d6000.slot1.subslot2.accu_parameter.time_to_full_h =
				data.slot1?.subslot2?.accu_parameter[9] ?? this.d6000.slot1.subslot2.accu_parameter.time_to_full_h
			this.d6000.slot1.subslot2.accu_parameter.time_to_full_m =
				data.slot1?.subslot2?.accu_parameter[10] ?? this.d6000.slot1.subslot2.accu_parameter.time_to_full_m
		}
		this.d6000.slot1.subslot2.accu_parameter = {
			...this.d6000.slot1.subslot2.accu_parameter,
			...data.slot1?.subslot2?.accu_parameter,
		}

		this.d6000.slot1.subslot1.led = data.slot1?.subslot1?.led ?? this.d6000.slot1.subslot1.led
		this.d6000.slot1.subslot1.identify = data.slot1?.subslot1?.identify ?? this.d6000.slot1.subslot1.identify
		this.d6000.slot1.subslot1.accu_detection =
			data.slot1?.subslot1?.accu_detection ?? this.d6000.slot1.subslot1.accu_detection

		this.d6000.slot1.subslot2.led = data.slot1?.subslot2?.led ?? this.d6000.slot1.subslot2.led
		this.d6000.slot1.subslot2.identify = data.slot1?.subslot2?.identify ?? this.d6000.slot1.subslot2.identify
		this.d6000.slot1.subslot2.accu_detection =
			data.slot1?.subslot2?.accu_detection ?? this.d6000.slot1.subslot2.accu_detection

		this.d6000.slot1.type = data.slot1?.type ?? this.d6000.slot1.type
	}
	if (responseKeys.includes('slot2')) {
		this.updateStatus(InstanceStatus.Ok)
		if (data.slot1?.subslot1?.accu_parameter !== undefined) {
			this.d6000.slot2.subslot1.accu_parameter.temperature =
				data.slot2?.subslot1?.accu_parameter[0] ?? this.d6000.slot2.subslot1.accu_parameter.temperature
			this.d6000.slot2.subslot1.accu_parameter.voltage =
				data.slot2?.subslot1?.accu_parameter[1] ?? this.d6000.slot2.subslot1.accu_parameter.voltage
			this.d6000.slot2.subslot1.accu_parameter.capacity =
				data.slot2?.subslot1?.accu_parameter[2] ?? this.d6000.slot2.subslot1.accu_parameter.capacity
			this.d6000.slot2.subslot1.accu_parameter.current =
				data.slot2?.subslot1?.accu_parameter[3] ?? this.d6000.slot2.subslot1.accu_parameter.current
			this.d6000.slot2.subslot1.accu_parameter.energy =
				data.slot2?.subslot1?.accu_parameter[4] ?? this.d6000.slot2.subslot1.accu_parameter.energy
			this.d6000.slot2.subslot1.accu_parameter.operating_time =
				data.slot2?.subslot1?.accu_parameter[5] ?? this.d6000.slot2.subslot1.accu_parameter.operating_time
			this.d6000.slot2.subslot1.accu_parameter.state_of_charge =
				data.slot2?.subslot1?.accu_parameter[6] ?? this.d6000.slot2.subslot1.accu_parameter.state_of_charge
			this.d6000.slot2.subslot1.accu_parameter.cycle_count =
				data.slot2?.subslot1?.accu_parameter[7] ?? this.d6000.slot2.subslot1.accu_parameter.cycle_count
			this.d6000.slot2.subslot1.accu_parameter.state_of_health =
				data.slot2?.subslot1?.accu_parameter[8] ?? this.d6000.slot2.subslot1.accu_parameter.state_of_health
			this.d6000.slot2.subslot1.accu_parameter.time_to_full_h =
				data.slot2?.subslot1?.accu_parameter[9] ?? this.d6000.slot2.subslot1.accu_parameter.time_to_full_h
			this.d6000.slot2.subslot1.accu_parameter.time_to_full_m =
				data.slot2?.subslot1?.accu_parameter[10] ?? this.d6000.slot2.subslot1.accu_parameter.time_to_full_m
		}
		if (data.slot1?.subslot2?.accu_parameter !== undefined) {
			this.d6000.slot2.subslot2.accu_parameter.temperature =
				data.slot2?.subslot2?.accu_parameter[0] ?? this.d6000.slot2.subslot2.accu_parameter.temperature
			this.d6000.slot2.subslot2.accu_parameter.voltage =
				data.slot2?.subslot2?.accu_parameter[1] ?? this.d6000.slot2.subslot2.accu_parameter.voltage
			this.d6000.slot2.subslot2.accu_parameter.capacity =
				data.slot2?.subslot2?.accu_parameter[2] ?? this.d6000.slot2.subslot2.accu_parameter.capacity
			this.d6000.slot2.subslot2.accu_parameter.current =
				data.slot2?.subslot2?.accu_parameter[3] ?? this.d6000.slot2.subslot2.accu_parameter.current
			this.d6000.slot2.subslot2.accu_parameter.energy =
				data.slot2?.subslot2?.accu_parameter[4] ?? this.d6000.slot2.subslot2.accu_parameter.energy
			this.d6000.slot2.subslot2.accu_parameter.operating_time =
				data.slot2?.subslot2?.accu_parameter[5] ?? this.d6000.slot2.subslot2.accu_parameter.operating_time
			this.d6000.slot2.subslot2.accu_parameter.state_of_charge =
				data.slot2?.subslot2?.accu_parameter[6] ?? this.d6000.slot2.subslot2.accu_parameter.state_of_charge
			this.d6000.slot2.subslot2.accu_parameter.cycle_count =
				data.slot2?.subslot2?.accu_parameter[7] ?? this.d6000.slot2.subslot2.accu_parameter.cycle_count
			this.d6000.slot2.subslot2.accu_parameter.state_of_health =
				data.slot2?.subslot2?.accu_parameter[8] ?? this.d6000.slot2.subslot2.accu_parameter.state_of_health
			this.d6000.slot2.subslot2.accu_parameter.time_to_full_h =
				data.slot2?.subslot2?.accu_parameter[9] ?? this.d6000.slot2.subslot2.accu_parameter.time_to_full_h
			this.d6000.slot2.subslot2.accu_parameter.time_to_full_m =
				data.slot2?.subslot2?.accu_parameter[10] ?? this.d6000.slot2.subslot2.accu_parameter.time_to_full_m
		}

		this.d6000.slot2.subslot1.led = data.slot2?.subslot1?.led ?? this.d6000.slot2.subslot1.led
		this.d6000.slot2.subslot1.identify = data.slot2?.subslot1?.identify ?? this.d6000.slot2.subslot1.identify
		this.d6000.slot2.subslot1.accu_detection =
			data.slot2?.subslot1?.accu_detection ?? this.d6000.slot2.subslot1.accu_detection

		this.d6000.slot2.subslot2.led = data.slot2?.subslot2?.led ?? this.d6000.slot2.subslot2.led
		this.d6000.slot2.subslot2.identify = data.slot2?.subslot2?.identify ?? this.d6000.slot2.subslot2.identify
		this.d6000.slot2.subslot2.accu_detection =
			data.slot2?.subslot2?.accu_detection ?? this.d6000.slot2.subslot2.accu_detection

		this.d6000.slot2.type = data.slot2?.type ?? this.d6000.slot2.type
	}
	if (responseKeys.includes('slot3')) {
		this.updateStatus(InstanceStatus.Ok)
		if (data.slot3?.subslot1?.accu_parameter !== undefined) {
			this.d6000.slot3.subslot1.accu_parameter.temperature =
				data.slot3?.subslot1?.accu_parameter[0] ?? this.d6000.slot2.subslot1.accu_parameter.temperature
			this.d6000.slot3.subslot1.accu_parameter.voltage =
				data.slot3?.subslot1?.accu_parameter[1] ?? this.d6000.slot2.subslot1.accu_parameter.voltage
			this.d6000.slot3.subslot1.accu_parameter.capacity =
				data.slot3?.subslot1?.accu_parameter[2] ?? this.d6000.slot2.subslot1.accu_parameter.capacity
			this.d6000.slot3.subslot1.accu_parameter.current =
				data.slot3?.subslot1?.accu_parameter[3] ?? this.d6000.slot2.subslot1.accu_parameter.current
			this.d6000.slot3.subslot1.accu_parameter.energy =
				data.slot3?.subslot1?.accu_parameter[4] ?? this.d6000.slot2.subslot1.accu_parameter.energy
			this.d6000.slot3.subslot1.accu_parameter.operating_time =
				data.slot3?.subslot1?.accu_parameter[5] ?? this.d6000.slot2.subslot1.accu_parameter.operating_time
			this.d6000.slot3.subslot1.accu_parameter.state_of_charge =
				data.slot3?.subslot1?.accu_parameter[6] ?? this.d6000.slot2.subslot1.accu_parameter.state_of_charge
			this.d6000.slot3.subslot1.accu_parameter.cycle_count =
				data.slot3?.subslot1?.accu_parameter[7] ?? this.d6000.slot2.subslot1.accu_parameter.cycle_count
			this.d6000.slot3.subslot1.accu_parameter.state_of_health =
				data.slot3?.subslot1?.accu_parameter[8] ?? this.d6000.slot2.subslot1.accu_parameter.state_of_health
			this.d6000.slot3.subslot1.accu_parameter.time_to_full_h =
				data.slot3?.subslot1?.accu_parameter[9] ?? this.d6000.slot2.subslot1.accu_parameter.time_to_full_h
			this.d6000.slot3.subslot1.accu_parameter.time_to_full_m =
				data.slot3?.subslot1?.accu_parameter[10] ?? this.d6000.slot2.subslot1.accu_parameter.time_to_full_m
		}
		if (data.slot3?.subslot2?.accu_parameter !== undefined) {
			this.d6000.slot3.subslot2.accu_parameter.temperature =
				data.slot3?.subslot2?.accu_parameter[0] ?? this.d6000.slot3.subslot2.accu_parameter.temperature
			this.d6000.slot3.subslot2.accu_parameter.voltage =
				data.slot3?.subslot2?.accu_parameter[1] ?? this.d6000.slot3.subslot2.accu_parameter.voltage
			this.d6000.slot3.subslot2.accu_parameter.capacity =
				data.slot3?.subslot2?.accu_parameter[2] ?? this.d6000.slot3.subslot2.accu_parameter.capacity
			this.d6000.slot3.subslot2.accu_parameter.current =
				data.slot3?.subslot2?.accu_parameter[3] ?? this.d6000.slot3.subslot2.accu_parameter.current
			this.d6000.slot3.subslot2.accu_parameter.energy =
				data.slot3?.subslot2?.accu_parameter[4] ?? this.d6000.slot3.subslot2.accu_parameter.energy
			this.d6000.slot3.subslot2.accu_parameter.operating_time =
				data.slot3?.subslot2?.accu_parameter[5] ?? this.d6000.slot3.subslot2.accu_parameter.operating_time
			this.d6000.slot3.subslot2.accu_parameter.state_of_charge =
				data.slot3?.subslot2?.accu_parameter[6] ?? this.d6000.slot3.subslot2.accu_parameter.state_of_charge
			this.d6000.slot3.subslot2.accu_parameter.cycle_count =
				data.slot3?.subslot2?.accu_parameter[7] ?? this.d6000.slot3.subslot2.accu_parameter.cycle_count
			this.d6000.slot3.subslot2.accu_parameter.state_of_health =
				data.slot3?.subslot2?.accu_parameter[8] ?? this.d6000.slot3.subslot2.accu_parameter.state_of_health
			this.d6000.slot3.subslot2.accu_parameter.time_to_full_h =
				data.slot3?.subslot2?.accu_parameter[9] ?? this.d6000.slot3.subslot2.accu_parameter.time_to_full_h
			this.d6000.slot3.subslot2.accu_parameter.time_to_full_m =
				data.slot3?.subslot2?.accu_parameter[10] ?? this.d6000.slot3.subslot2.accu_parameter.time_to_full_m
		}

		this.d6000.slot3.subslot1.led = data.slot3?.subslot1?.led ?? this.d6000.slot3.subslot1.led
		this.d6000.slot3.subslot1.identify = data.slot3?.subslot1?.identify ?? this.d6000.slot3.subslot1.identify
		this.d6000.slot3.subslot1.accu_detection =
			data.slot3?.subslot1?.accu_detection ?? this.d6000.slot3.subslot1.accu_detection

		this.d6000.slot3.subslot2.led = data.slot3?.subslot2?.led ?? this.d6000.slot3.subslot2.led
		this.d6000.slot3.subslot2.identify = data.slot3?.subslot2?.identify ?? this.d6000.slot3.subslot2.identify
		this.d6000.slot3.subslot2.accu_detection =
			data.slot3?.subslot2?.accu_detection ?? this.d6000.slot3.subslot2.accu_detection

		this.d6000.slot3.type = data.slot3?.type ?? this.d6000.slot3.type
	}
	if (responseKeys.includes('slot4')) {
		this.updateStatus(InstanceStatus.Ok)
		if (data.slot4?.subslot1?.accu_parameter !== undefined) {
			this.d6000.slot4.subslot1.accu_parameter.temperature =
				data.slot4?.subslot1?.accu_parameter[0] ?? this.d6000.slot4.subslot1.accu_parameter.temperature
			this.d6000.slot4.subslot1.accu_parameter.voltage =
				data.slot4?.subslot1?.accu_parameter[1] ?? this.d6000.slot4.subslot1.accu_parameter.voltage
			this.d6000.slot4.subslot1.accu_parameter.capacity =
				data.slot4?.subslot1?.accu_parameter[2] ?? this.d6000.slot4.subslot1.accu_parameter.capacity
			this.d6000.slot4.subslot1.accu_parameter.current =
				data.slot4?.subslot1?.accu_parameter[3] ?? this.d6000.slot4.subslot1.accu_parameter.current
			this.d6000.slot4.subslot1.accu_parameter.energy =
				data.slot4?.subslot1?.accu_parameter[4] ?? this.d6000.slot4.subslot1.accu_parameter.energy
			this.d6000.slot4.subslot1.accu_parameter.operating_time =
				data.slot4?.subslot1?.accu_parameter[5] ?? this.d6000.slot4.subslot1.accu_parameter.operating_time
			this.d6000.slot4.subslot1.accu_parameter.state_of_charge =
				data.slot4?.subslot1?.accu_parameter[6] ?? this.d6000.slot4.subslot1.accu_parameter.state_of_charge
			this.d6000.slot4.subslot1.accu_parameter.cycle_count =
				data.slot4?.subslot1?.accu_parameter[7] ?? this.d6000.slot4.subslot1.accu_parameter.cycle_count
			this.d6000.slot4.subslot1.accu_parameter.state_of_health =
				data.slot4?.subslot1?.accu_parameter[8] ?? this.d6000.slot4.subslot1.accu_parameter.state_of_health
			this.d6000.slot4.subslot1.accu_parameter.time_to_full_h =
				data.slot4?.subslot1?.accu_parameter[9] ?? this.d6000.slot4.subslot1.accu_parameter.time_to_full_h
			this.d6000.slot4.subslot1.accu_parameter.time_to_full_m =
				data.slot4?.subslot1?.accu_parameter[10] ?? this.d6000.slot4.subslot1.accu_parameter.time_to_full_m
		}
		if (data.slot4?.subslot2?.accu_parameter !== undefined) {
			this.d6000.slot4.subslot2.accu_parameter.temperature =
				data.slot4?.subslot2?.accu_parameter[0] ?? this.d6000.slot4.subslot2.accu_parameter.temperature
			this.d6000.slot4.subslot2.accu_parameter.voltage =
				data.slot4?.subslot2?.accu_parameter[1] ?? this.d6000.slot4.subslot2.accu_parameter.voltage
			this.d6000.slot4.subslot2.accu_parameter.capacity =
				data.slot4?.subslot2?.accu_parameter[2] ?? this.d6000.slot4.subslot2.accu_parameter.capacity
			this.d6000.slot4.subslot2.accu_parameter.current =
				data.slot4?.subslot2?.accu_parameter[3] ?? this.d6000.slot4.subslot2.accu_parameter.current
			this.d6000.slot4.subslot2.accu_parameter.energy =
				data.slot4?.subslot2?.accu_parameter[4] ?? this.d6000.slot4.subslot2.accu_parameter.energy
			this.d6000.slot4.subslot2.accu_parameter.operating_time =
				data.slot4?.subslot2?.accu_parameter[5] ?? this.d6000.slot4.subslot2.accu_parameter.operating_time
			this.d6000.slot4.subslot2.accu_parameter.state_of_charge =
				data.slot4?.subslot2?.accu_parameter[6] ?? this.d6000.slot4.subslot2.accu_parameter.state_of_charge
			this.d6000.slot4.subslot2.accu_parameter.cycle_count =
				data.slot4?.subslot2?.accu_parameter[7] ?? this.d6000.slot4.subslot2.accu_parameter.cycle_count
			this.d6000.slot4.subslot2.accu_parameter.state_of_health =
				data.slot4?.subslot2?.accu_parameter[8] ?? this.d6000.slot4.subslot2.accu_parameter.state_of_health
			this.d6000.slot4.subslot2.accu_parameter.time_to_full_h =
				data.slot4?.subslot2?.accu_parameter[9] ?? this.d6000.slot4.subslot2.accu_parameter.time_to_full_h
			this.d6000.slot4.subslot2.accu_parameter.time_to_full_m =
				data.slot4?.subslot2?.accu_parameter[10] ?? this.d6000.slot4.subslot2.accu_parameter.time_to_full_m
		}

		this.d6000.slot4.subslot1.led = data.slot4?.subslot1?.led ?? this.d6000.slot4.subslot1.led
		this.d6000.slot4.subslot1.identify = data.slot4?.subslot1?.identify ?? this.d6000.slot4.subslot1.identify
		this.d6000.slot4.subslot1.accu_detection =
			data.slot4?.subslot1?.accu_detection ?? this.d6000.slot4.subslot1.accu_detection

		this.d6000.slot4.subslot2.led = data.slot4?.subslot2?.led ?? this.d6000.slot4.subslot2.led
		this.d6000.slot4.subslot2.identify = data.slot4?.subslot2?.identify ?? this.d6000.slot4.subslot2.identify
		this.d6000.slot4.subslot2.accu_detection =
			data.slot4?.subslot2?.accu_detection ?? this.d6000.slot4.subslot2.accu_detection

		this.d6000.slot4.type = data.slot4?.type ?? this.d6000.slot4.type
	}
}
