import { choices } from './consts.js'
import { bank, battery_parameter } from './bank.js'
export function initDigital6000(device) {
	//initalise the memory structure of the device
	if (this.d6000) {
		delete self.d6000
	}
	if (device === choices.devices[0].id || device === choices.devices[1].id) {
		//define EM6000 object
		this.d6000 = {
			audio: {
				out1: {
					level_db: null,
				},
				out2: {
					level_db: null,
				},
			},
			rx1: {
				audio_mute: null,
				freq: {
					b1: JSON.parse(JSON.stringify(bank)),
					b2: JSON.parse(JSON.stringify(bank)),
					b3: JSON.parse(JSON.stringify(bank)),
					b4: JSON.parse(JSON.stringify(bank)),
					b5: JSON.parse(JSON.stringify(bank)),
					b6: JSON.parse(JSON.stringify(bank)),
					u1: JSON.parse(JSON.stringify(bank)),
					u2: JSON.parse(JSON.stringify(bank)),
					u3: JSON.parse(JSON.stringify(bank)),
					u4: JSON.parse(JSON.stringify(bank)),
					u5: JSON.parse(JSON.stringify(bank)),
					u6: JSON.parse(JSON.stringify(bank)),
				},
				active_bank_channel: { bank: null, channel: null },
				carrier: null,
				scan: {
					config: null,
					result: null,
				},
				skx: {
					type: { type: null, low: null, high: null },
					name: null,
					lowcut: null,
					gain: null,
					display: null,
					capsule: null,
					cable_emulation: null,
					battery: { percent: null, time: null },
					autolock: null,
				},
				sync_settings: {
					low_cut_frequency: null,
					ignore_low_cut_frequency: null,
					gain: null,
					ignore_gain: null,
					display: null,
					ignore_display: null,
					cable_emulation: null,
					ignore_cable_emulation: null,
					auto_lock: null,
					ignore_auto_lock: null,
				},
				walktest: {
					start: null,
					info: null,
				},
				identify: null,
				wsm_master_cnt: null,
				testtone: null,
				name: null,
				encryption: null,
				active_warnings: [],
				active_status: [],
			},
			rx2: {
				audio_mute: null,
				freq: {
					b1: JSON.parse(JSON.stringify(bank)),
					b2: JSON.parse(JSON.stringify(bank)),
					b3: JSON.parse(JSON.stringify(bank)),
					b4: JSON.parse(JSON.stringify(bank)),
					b5: JSON.parse(JSON.stringify(bank)),
					b6: JSON.parse(JSON.stringify(bank)),
					u1: JSON.parse(JSON.stringify(bank)),
					u2: JSON.parse(JSON.stringify(bank)),
					u3: JSON.parse(JSON.stringify(bank)),
					u4: JSON.parse(JSON.stringify(bank)),
					u5: JSON.parse(JSON.stringify(bank)),
					u6: JSON.parse(JSON.stringify(bank)),
				},
				active_bank_channel: { bank: null, channel: null },
				carrier: null,
				scan: {
					config: null,
					result: null,
				},
				skx: {
					type: { type: null, low: null, high: null },
					name: null,
					lowcut: null,
					gain: null,
					display: null,
					capsule: null,
					cable_emulation: null,
					battery: { percent: null, time: null },
					autolock: null,
				},
				sync_settings: {
					low_cut_frequency: null,
					ignore_low_cut_frequency: null,
					gain: null,
					ignore_gain: null,
					display: null,
					ignore_display: null,
					cable_emulation: null,
					ignore_cable_emulation: null,
					auto_lock: null,
					ignore_auto_lock: null,
				},
				walktest: {
					start: null,
					info: null,
				},
				identify: null,
				wsm_master_cnt: null,
				testtone: null,
				name: null,
				encryption: null,
				active_warnings: null,
				active_status: null,
			},
			sys: {
				dante: {
					version: null,
					name: null,
				},
				wsm_master_cnt: null,
				clock_frequency_measured: null,
				clock: null,
				brightness: null,
				booster: null,
			},
			mm: {
				ch1: {
					RF1: null,
					RF1_PEAK: false,
					RF2: null,
					RF2_PEAK: false,
					DIV1: false,
					DIV2: false,
					LQI: null,
					AF: null,
					PEAK: false,
				},
				ch2: {
					RF1: null,
					RF1_PEAK: false,
					RF2: null,
					RF2_PEAK: false,
					DIV1: false,
					DIV2: false,
					LQI: null,
					AF: null,
					PEAK: false,
				},
			},
			device: {
				identity: {
					version: null,
					vendor: null,
					product: this.config.device,
				},
				network: {
					ether: {
						macs: null,
						interfaces: null,
					},
					ipv4: {
						auto: null,
						mdns: null,
						interfaces: null,
						static_ipaddr: null,
						static_netmask: null,
						static_gateway: null,
						ipaddr: null,
						netmask: null,
					},
					ipv4_dante: {
						auto: null,
						ipaddr: null,
						netmask: null,
						gateway: null,
						settomgs: null,
					},
				},
				name: null,
				language: null,
			},
			osc: {
				state: {
					prettyprint: null,
					subscribe: null,
				},
				feature: {
					timetag: null,
					baseaddr: null,
					subscription: null,
					pattern: null,
				},
				limits: null,
				schema: null,
				version: null,
				xid: null,
				ping: null,
				error: null,
			},
		}
	} else if (device === choices.devices[2].id) {
		//define L6000 object
		this.d6000 = {
			slot1: {
				subslot1: {
					led: null,
					identify: null,
					accu_parameter: JSON.parse(JSON.stringify(battery_parameter)),
					accu_detection: null,
				},
				subslot2: {
					led: null,
					identify: null,
					accu_parameter: JSON.parse(JSON.stringify(battery_parameter)),
					accu_detection: null,
				},
				type: null,
			},
			slot2: {
				subslot1: {
					led: null,
					identify: null,
					accu_parameter: JSON.parse(JSON.stringify(battery_parameter)),
					accu_detection: null,
				},
				subslot2: {
					led: null,
					identify: null,
					accu_parameter: JSON.parse(JSON.stringify(battery_parameter)),
					accu_detection: null,
				},
				type: null,
			},
			slot3: {
				subslot1: {
					led: null,
					identify: null,
					accu_parameter: JSON.parse(JSON.stringify(battery_parameter)),
					accu_detection: null,
				},
				subslot2: {
					led: null,
					identify: null,
					accu_parameter: JSON.parse(JSON.stringify(battery_parameter)),
					accu_detection: null,
				},
				type: null,
			},
			slot4: {
				subslot1: {
					led: null,
					identify: null,
					accu_parameter: JSON.parse(JSON.stringify(battery_parameter)),
					accu_detection: null,
				},
				subslot2: {
					led: null,
					identify: null,
					accu_parameter: JSON.parse(JSON.stringify(battery_parameter)),
					accu_detection: null,
				},
				type: null,
			},
			device: {
				identity: {
					version: null,
					vendor: null,
					product: this.config.device,
				},
				network: {
					ether: {
						macs: null,
						interfaces: null,
					},
					ipv4: {
						auto: null,
						mdns: null,
						interfaces: null,
						static_ipaddr: null,
						static_netmask: null,
						static_gateway: null,
						ipaddr: null,
						netmask: null,
					},
				},
				name: null,
				language: null,
				warnings: [],
				storage_mode: null,
				identify: null,
			},
			osc: {
				state: {
					prettyprint: null,
					subscribe: null,
				},
				feature: {
					timetag: null,
					baseaddr: null,
					subscription: null,
					pattern: null,
				},
				limits: null,
				schema: null,
				version: null,
				xid: null,
				ping: null,
				error: null,
			},
		}
	}
}
