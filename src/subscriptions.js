import { choices, query, subscriptions } from './consts.js'

export function setupInitialSubscriptions(device, interval) {
	if (device === choices.devices[0].id || device === choices.devices[1].id) {
		//set EM6000 subscriptions
		const sub = {
			osc: {
				state: {
					subscribe: [
						{
							'#': { min: interval, max: interval, lifetime: subscriptions.lifetime, count: subscriptions.count },
							mm: query,
						},
					],
				},
			},
		}
		this.addCmdtoQueue(sub)
	} else if (device === choices.devices[2].id) {
		//set L6000 subscriptions
	}
	this.subscriptionTimer = setTimeout(() => {
		this.setupInitialSubscriptions(device, interval)
	}, subscriptions.lifetime * 1000)
}

export async function cancelSubscriptions(device) {
	if (this.subscriptionTimer) {
		clearTimeout(this.subscriptionTimer)
		delete this.subscriptionTimer
		if (device === choices.devices[0].id || device === choices.devices[1].id) {
			//clear EM6000 subscriptions
			const sub = {
				osc: {
					state: {
						susbcribe: [
							{
								'#': { cancel: true },
								mm: query,
							},
						],
					},
				},
			}
			//skip to the front of the queue
			await this.sendCommand(sub)
		} else if (device === choices.devices[2].id) {
			//clear L6000 subscriptions
		}
	}
}
