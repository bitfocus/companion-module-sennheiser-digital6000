import { choices, query, subscriptions } from './consts.js'

export function setupInitialSubscriptions(device, interval) {
	if (device === choices.devices[0].id) {
		//set EM6000 subscriptions
		const sub = {
			osc: {
				state: {
					susbcribe: [
						{
							'#': { min: interval, max: interval, lifetime: subscriptions.lifetime, count: subscriptions.count },
							mm: query,
						},
					],
				},
			},
		}
		this.sendCommand(sub)
	} else if (device === choices.devices[1].id) {
		//set L6000 subscriptions
	}
}
