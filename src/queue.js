import { InstanceStatus } from '@companion-module/base'

const msg_delay = 5

export function addCmdtoQueue(cmd) {
	if (cmd !== undefined && cmd instanceof Object) {
		this.cmdQueue.push(cmd)
		return true
	}
	this.log('warn', `Invalid command: ${cmd}`)
	return false
}

export function processCmdQueue() {
	if (this.cmdQueue.length > 0) {
		//dont send command if still waiting for response from last command
		this.sendCommand(this.cmdQueue.shift())
	}
	this.cmdTimer = setTimeout(() => {
		this.processCmdQueue()
	}, msg_delay)
}

export function startCmdQueue() {
	if (this.cmdTimer) {
		clearTimeout(this.cmdTimer)
	}
	this.cmdQueue = []
	this.cmdTimer = setTimeout(() => {
		this.processCmdQueue()
	}, msg_delay)
}

export function stopCmdQueue() {
	if (this.cmdTimer) {
		clearTimeout(this.cmdTimer)
		delete this.cmdTimer
	}
	if (this.cmdQueue) {
		delete this.cmdQueue
	}
}

export function startListeningTimer() {
	if (this.listenTimer) {
		clearTimeout(this.listenTimer)
	}
	this.listenTimer = setTimeout(() => {
		this.listening()
	}, 4 * this.config.interval)
}

export function listening() {
	if (this.listenTimer) {
		clearTimeout(this.listenTimer)
	}
	this.updateStatus(InstanceStatus.Connecting, 'Listening')
	if (this.config.verbose) {
		this.log('warn', `UDP Socket listening. No data recieved for at least ${4 * this.config.interval} ms`)
	}
}

export function stopListeningTimer() {
	if (this.listenTimer) {
		clearTimeout(this.listenTimer)
		delete this.listenTimer
	}
}
