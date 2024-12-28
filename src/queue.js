import PQueue from 'p-queue'
const msg_delay = 5
const queue = new PQueue({ concurrency: 1, interval: msg_delay, intervalCap: 1 })

export async function addCmdtoQueue(cmd) {
	if (cmd !== undefined && cmd instanceof Object) {
		return await queue.add(async() => { 
			return await this.sendCommand(cmd)
		})
	}
	this.log('warn', `Invalid command: ${cmd}`)
	return false
}

export function startCmdQueue() {
	queue.clear()
	queue.start()
}

export function stopCmdQueue() {
	queue.clear()
	queue.pause()
}
