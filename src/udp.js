import { InstanceStatus, UDPHelper } from '@companion-module/base'

export function sendCommand(msg) {
	if (msg !== undefined && msg instanceof Object) {
		msg.osc.xid = this.id
		if (this.udp !== undefined && !this.udp.isDestoryed) {
			if (this.config.verbose) {
				this.log('debug', `Sending message: ${JSON.stringify(msg)}`)
			}
			this.udp
				.send(JSON.stringify(msg))
				.then(() => {
					this.updateStatus(InstanceStatus.Ok)
				})
				.catch((error) => {
					this.log('error', `Message send failed!\nMessage: ${JSON.stringify(msg)}\nError: ${JSON.stringify(error)}`)
					this.updateStatus(InstanceStatus.UnknownError, error.code)
				})
		} else {
			this.log('warn', `Not connected, tried to send: ${JSON.stringify(msg)}`)
		}
	} else {
		this.log('warn', 'sendCommand: Invalid Command')
	}
	return undefined
}

export function init_udp(host, port) {
	if (this.udp) {
		this.udp.destroy()
		delete this.udp
	}

	this.updateStatus(InstanceStatus.Connecting)

	if (host && port) {
		this.udp = new UDPHelper(host, port)
		this.updateStatus(InstanceStatus.Ok)
		this.udp.on('error', (err) => {
			this.updateStatus(InstanceStatus.ConnectionFailure, err.message)
			this.log('error', 'Network error: ' + err.message)
		})

		this.udp.on('listening', () => {
			this.updateStatus(InstanceStatus.Ok)
		})

		this.udp.on('data', (msg) => {
			console.log(msg.toString())
		})

		this.udp.on('status_change', (status, message) => {
			this.updateStatus(status, message)
		})
	} else {
		this.updateStatus(InstanceStatus.BadConfig)
	}
}
