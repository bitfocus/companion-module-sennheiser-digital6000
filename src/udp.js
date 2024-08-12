import { InstanceStatus, UDPHelper } from '@companion-module/base'

export async function sendCommand(msg) {
	if (msg !== undefined && msg instanceof Object) {
		if (msg.osc === undefined) {
			msg.osc = { xid: this.id }
		}
		if (this.socket !== undefined && !this.socket.isDestoryed) {
			await this.socket
				.send(JSON.stringify(msg))
				.then(() => {
					if (this.config.verbose) {
						this.log('debug', `Sent message: ${JSON.stringify(msg)}`)
					}
				})
				.catch((error) => {
					this.log('error', `Message send failed!\nMessage: ${JSON.stringify(msg)}\nError: ${JSON.stringify(error)}`)
					this.statusCheck(InstanceStatus.ConnectionFailure, error.code)
				})
		} else {
			this.log('warn', `No socket, tried to send: ${JSON.stringify(msg)}`)
		}
	} else {
		this.log('warn', `sendCommand: Invalid Command, expected object recieved: ${msg}`)
	}
}

export function init_udp(host, port, interval) {
	if (this.socket) {
		this.socket.destroy()
		delete this.socket
	}
	if (host && port) {
		this.socket = new UDPHelper(host, port)
		this.socket.on('error', (err) => {
			this.statusCheck(InstanceStatus.ConnectionFailure, err.message)
			this.log('error', 'Network error: ' + err.message)
			this.stopFeedbackChecks()
		})

		this.socket.on('listening', () => {
			this.statusCheck(InstanceStatus.Connecting, 'Listening')
			if (this.config.verbose) {
				this.log('debug', `UDP Socket listening`)
			}
			this.startBlink()
			this.startFrame()
			this.startFeedbackChecks(interval)
		})

		this.socket.on('data', (msg) => {
			if (this.config.verbose) {
				this.log('debug', `Recieved message: ${msg.toString()}`)
			}
			this.parseResponse(msg)
		})

		this.socket.on('status_change', (status, message) => {
			this.statusCheck(status, message)
		})
	} else {
		this.statusCheck(InstanceStatus.BadConfig, 'No host')
	}
}
