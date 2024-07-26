import { InstanceBase, Regex, runEntrypoint, UDPHelper } from '@companion-module/base'

export function sendCommand(msg) {
	if (msg !== undefined && msg instanceof String) {
		if (this.udp !== undefined && !this.udp.isDestoryed) {
			this.udp.send(msg)
		} else {
			this.log('warn', `Not connected, tried to send: ${msg}`)
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