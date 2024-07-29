import { InstanceStatus } from '@companion-module/base'
import { choices } from './consts.js'

export function parseResponse(msg) {
	const data = JSON.parse(msg)
	try {
		if (data.osc.xid === this.id) {
			if (this.config.verbose) {
				this.log('debug', `Returned message XID match`)
			}
		} else {
			this.log(
				'warn',
				`Message recieved with unexpected xid. Expected ${this.id} Recieved ${data.osc.xid}/nFrom ${msg.toString()}`
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
	if (
		this.d6000.device.identity.product == choices.devices[0].id ||
		this.d6000.device.identity.product == choices.devices[1].id
	) {
		this.handleEM6000_data(data)
	} else if (this.d6000.device.identity.product == choices.devices[2].id) {
		this.handleL6000_data(data)
	} else {
		this.log('warn', `Unrecognised device! ${this.d6000.device.identity.product}`)
		this.updateStatus(InstanceStatus.UnknownError, `Unrecognised device`)
		return
	}
}

export function handleEM6000_data(data) {
	try {
		this.d6000.audio = { ...this.d6000.audio, ...data.audio }
	} catch {
		/* do nothing */
	}
	try {
		this.d6000.rx1 = { ...this.d6000.rx1, ...data.rx1 }
	} catch {
		/* do nothing */
	}
	try {
		this.d6000.rx2 = { ...this.d6000.rx2, ...data.rx2 }
	} catch {
		/* do nothing */
	}
	try {
		this.d6000.sys = { ...this.d6000.sys, ...data.sys }
	} catch {
		/* do nothing */
	}
	try {
		this.d6000.device = { ...this.d6000.device, ...data.device }
	} catch {
		/* do nothing */
	}
	try {
		this.d6000.osc = { ...this.d6000.osc, ...data.osc }
	} catch {
		/* do nothing */
	}
}

export function handleL6000_data(data) {}
