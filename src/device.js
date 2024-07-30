import { query } from './consts.js'

export function checkDeviceIdentity() {
	this.addCmdtoQueue({
		device: { identity: { product: query, vendor: query, version: query }, name: null },
	})
}
