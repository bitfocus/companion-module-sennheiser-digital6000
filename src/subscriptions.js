import { choices, query, subscriptions } from './consts.js'

const subSlotSubFields = { led: query, accu_detection: query }
const SlotFields = {
	subslot1: subSlotSubFields,
	subslot2: subSlotSubFields,
}

const slotAccuParamFields = {
	subslot1: {
		accu_parameter: query,
	},
	subslot2: {
		accu_parameter: query,
	},
}

const skxFields = {
	type: query,
	name: query,
	lowcut: query,
	gain: query,
	display: query,
	capsule: query,
	cable_emulation: query,
	battery: query,
	autolock: query,
}

const sync_settingsFields = {
	low_cut_frequency: query,
	ignore_low_cut_frequency: query,
	gain: query,
	ignore_gain: query,
	display: query,
	ignore_display: query,
	cable_emulation: query,
	ignore_cable_emulation: query,
	auto_lock: query,
	ignore_auto_lock: query,
}

export function setupInitialSubscriptions(device, interval) {
	const generalSubParams = {
		min: interval,
		max: subscriptions.lifetime * 500,
		lifetime: subscriptions.lifetime,
		count: subscriptions.count,
	}
	if (device === choices.devices[0].id || device === choices.devices[1].id) {
		//set EM6000 subscriptions
		const meteringSubParams = {
			min: interval,
			max: interval,
			lifetime: subscriptions.lifetime,
			count: subscriptions.count,
		}
		let sub = {
			osc: {
				state: {
					subscribe: [
						{
							'#': meteringSubParams,
							mm: query,
						},
					],
				},
			},
		}
		this.addCmdtoQueue(sub)
		sub = {
			osc: {
				state: {
					subscribe: [
						{
							'#': generalSubParams,
							audio: {
								out1: { level_db: query },
								out2: { level_db: query },
							},
						},
					],
				},
			},
		}
		this.addCmdtoQueue(sub)
		for (let i = 1; i <= 2; i++) {
			let sub = {
				osc: {
					state: {
						subscribe: [
							{
								'#': generalSubParams,
								[`rx${i}`]: {
									audio_mute: query,
									name: query,
									encryption: query,
									active_warnings: query,
									active_status: query,
								},
							},
						],
					},
				},
			}
			this.addCmdtoQueue(sub)
			sub = {
				osc: {
					state: {
						subscribe: [
							{
								'#': generalSubParams,
								[`rx${i}`]: {
									skx: skxFields,
								},
							},
						],
					},
				},
			}
			this.addCmdtoQueue(sub)
			sub = {
				[`rx${i}`]: {
					sync_settings: sync_settingsFields,
				},
			}
			this.addCmdtoQueue(sub)
			const msg = { [`rx${i}`]: { carrier: query, active_bank_channel: query } }
			this.addCmdtoQueue(msg)
		}
	} else if (device === choices.devices[2].id) {
		//set L6000 subscriptions
		for (let i = 1; i <= 4; i++) {
			let sub = {
				osc: {
					state: {
						subscribe: [
							{
								'#': generalSubParams,
								[`slot${i}`]: SlotFields,
							},
						],
					},
				},
			}
			this.addCmdtoQueue(sub)
			sub = {
				osc: {
					state: {
						subscribe: [
							{
								'#': generalSubParams,
								[`slot${i}`]: slotAccuParamFields,
							},
						],
					},
				},
			}
			this.addCmdtoQueue(sub)
		}
	}
	let sub = {
		osc: {
			state: {
				subscribe: [
					{
						'#': generalSubParams,
						device: { warnings: query },
					},
				],
			},
		},
	}
	this.addCmdtoQueue(sub)
	this.subscriptionTimer = setTimeout(() => {
		this.setupInitialSubscriptions(device, interval)
	}, (subscriptions.lifetime - 1) * 1000)
}

export async function cancelSubscriptions(device) {
	//attempt to cleanly close subscriptions when disabling module or on config change
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
			for (let i = 1; i <= 4; i++) {
				let sub = {
					osc: {
						state: {
							subscribe: [
								{
									'#': { cancel: true },
									[`slot${i}`]: SlotFields,
								},
							],
						},
					},
				}
				await this.sendCommand(sub)
				sub = {
					osc: {
						state: {
							subscribe: [
								{
									'#': { cancel: true },
									[`slot${i}`]: slotAccuParamFields,
								},
							],
						},
					},
				}
				await this.sendCommand(sub)
			}
		}
	}
}
