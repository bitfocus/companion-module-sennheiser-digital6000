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
		// dont worry if XID is absent as its not reported for subscriptions
	}
	try {
		this.d6000.device.identity = { ...this.d6000.device.identity, ...data.device.identity }
		if (this.config.device !== this.d6000.device.identity.product) {
			this.log('warn', 'Config doesnt match device, updating config')
			this.updateStatus(InstanceStatus.BadConfig, 'Device mismatch')
			this.config.device = this.d6000.device.identity.product
			this.saveConfig(this.config)
			this.configUpdated(this.config)
			return
		}
	} catch {
		this.updateStatus(InstanceStatus.Ok)
		//
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
	this.d6000.device.name = data.device?.name ?? this.d6000.device.name
	this.d6000.device.language = data.device?.language ?? this.d6000.device.language
	this.d6000.sys.dante = { ...this.d6000.sys.dante, ...data.sys?.dante }
	this.d6000.device.identity = { ...this.d6000.device.identity, ...data.device?.identity }
	this.d6000.device.network.ether = { ...this.d6000.device.network.ether, ...data.device?.network?.ether }
	this.d6000.device.network.ipv4 = { ...this.d6000.device.network.ipv4, ...data.device?.network?.ipv4 }
	this.d6000.device.network.ipv4_dante = {
		...this.d6000.device.network.ipv4_dante,
		...data.device?.network?.ipv4_dante,
	}
	this.d6000.osc.feature = { ...this.d6000.osc.feature, ...data.osc?.feature }
	this.d6000.audio.out1 = { ...this.d6000.audio.out1, ...data.audio?.out1 }
	this.d6000.audio.out2 = { ...this.d6000.audio.out2, ...data.audio?.out2 }
	this.d6000.rx1.scan = { ...this.d6000.rx1.scan, ...data.rx1?.scan }
	this.d6000.rx1.skx = { ...this.d6000.rx1.skx, ...data.rx1?.skx }
	this.d6000.rx1.walktest = { ...this.d6000.rx1.walktest, ...data.rx1?.walktest }
	this.d6000.rx1.sync_settings = { ...this.d6000.rx1.sync_settings, ...data.rx1?.sync_settings }

	this.d6000.rx1.active_bank_channel.bank = data.rx1?.active_bank_channel[0] ?? this.d6000.rx1.active_bank_channel.bank
	this.d6000.rx1.active_bank_channel.channel =
		data.rx1?.active_bank_channel[1] ?? this.d6000.rx1.active_bank_channel.channel
	this.d6000.rx1.audio_mute = data.rx1?.audio_mute ?? this.d6000.rx1.audio_mute
	this.d6000.rx1.carrier = data.rx1?.carrier ?? this.d6000.rx1.carrier
	this.d6000.rx1.identify = data.rx1?.identify ?? this.d6000.rx1.identify
	this.d6000.rx1.wsm_master_cnt = data.rx1?.wsm_master_cnt ?? this.d6000.rx1.wsm_master_cnt
	this.d6000.rx1.testtone = data.rx1?.testtone ?? this.d6000.rx1.testtone
	this.d6000.rx1.name = data.rx1?.name ?? this.d6000.rx1.name
	this.d6000.rx1.ecryption = data.rx1?.ecryption ?? this.d6000.rx1.ecryption
	this.d6000.rx1.active_warnings = data.rx1?.active_warnings ?? this.d6000.rx1.active_warnings
	this.d6000.rx1.active_status = data.rx1?.active_status ?? this.d6000.rx1.active_status

	this.d6000.rx2.scan = { ...this.d6000.rx2.scan, ...data.rx2?.scan }
	this.d6000.rx2.skx = { ...this.d6000.rx2.skx, ...data.rx2?.skx }
	this.d6000.rx2.sync_settings = { ...this.d6000.rx2.sync_settings, ...data.rx2?.sync_settings }
	this.d6000.rx2.walktest = { ...this.d6000.rx2.walktest, ...data.rx2?.walktest }
	try {
		this.d6000.rx1 = { ...this.d6000.rx1, ...data.rx1 }
		this.updateStatus(InstanceStatus.Ok)
	} catch {
		/* do nothing */
	}
	try {
		this.d6000.rx2 = { ...this.d6000.rx2, ...data.rx2 }
		this.updateStatus(InstanceStatus.Ok)
	} catch {
		/* do nothing */
	}
	try {
		this.d6000.sys = { ...this.d6000.sys, ...data.sys }
		this.updateStatus(InstanceStatus.Ok)
	} catch {
		/* do nothing */
	}
	try {
		this.d6000.device.identity = { ...this.d6000.device.identity, ...data.device.identity }
		this.updateStatus(InstanceStatus.Ok)
	} catch {
		/* do nothing */
	}
	try {
		this.d6000.osc = { ...this.d6000.osc, ...data.osc }
		this.updateStatus(InstanceStatus.Ok)
	} catch {
		/* do nothing */
	}
	try {
		this.d6000.mm.ch1.RF1 = convert_RF_to_dBm(data.mm[0][0])
		this.d6000.mm.ch1.RF1_PEAK = !!data.mm[0][1]
		this.d6000.mm.ch1.RF2 = convert_RF_to_dBm(data.mm[0][2])
		this.d6000.mm.ch1.RF2_PEAK = !!data.mm[0][3]
		this.d6000.mm.ch1.DIV1 = !!data.mm[0][4]
		this.d6000.mm.ch1.DIV2 = !!data.mm[0][5]
		this.d6000.mm.ch1.LQI = convert_LQI_to_percent(data.mm[0][6])
		this.d6000.mm.ch1.AF = convert_AF_to_dBFS(data.mm[0][7])
		this.d6000.mm.ch1.PEAK = !!data.mm[0][8]
		this.d6000.mm.ch2.RF1 = convert_RF_to_dBm(data.mm[1][0])
		this.d6000.mm.ch2.RF1_PEAK = !!data.mm[1][1]
		this.d6000.mm.ch2.RF2 = convert_RF_to_dBm(data.mm[1][2])
		this.d6000.mm.ch2.RF2_PEAK = !!data.mm[1][3]
		this.d6000.mm.ch2.DIV1 = !!data.mm[1][4]
		this.d6000.mm.ch2.DIV2 = !!data.mm[1][5]
		this.d6000.mm.ch2.LQI = convert_LQI_to_percent(data.mm[1][6])
		this.d6000.mm.ch2.AF = convert_AF_to_dBFS(data.mm[1][7])
		this.d6000.mm.ch2.PEAK = !!data.mm[1][8]
		this.updateStatus(InstanceStatus.Ok)
	} catch {
		/* do nothing */
	}
}

export function handleL6000_data(data) {}
