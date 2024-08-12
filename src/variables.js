import { choices } from './consts.js'

export default async function (self) {
	let variableDefinitions = []
	if (self.config.device === choices.devices[0].id || self.config.device === choices.devices[1].id) {
		//set EM6000 variables
		for (let i = 1; i <= 2; i++) {
			variableDefinitions.push(
				{ variableId: `out${i}_level`, name: `Output ${i} Level (dB)` },
				{ variableId: `rx${i}_active_bank`, name: `RX${i} Active Bank` },
				{ variableId: `rx${i}_active_channel`, name: `RX${i} Active Channel` },
				{ variableId: `rx${i}_carrier`, name: `RX${i} Carrier (KHz)` },
				{ variableId: `rx${i}_name`, name: `RX${i} Name` },
				{ variableId: `rx${i}_rf1`, name: `RX${i} RF1 (dBm)` },
				{ variableId: `rx${i}_rf2`, name: `RX${i} RF2 (dBm)` },
				{ variableId: `rx${i}_lqi`, name: `RX${i} LQI (%)` },
				{ variableId: `rx${i}_af`, name: `RX${i} AF (dBFS)` },
				{ variableId: `rx${i}_testtone`, name: `RX${i} Test Tone (dBFS)` },
				{ variableId: `skx${i}_name`, name: `SKX${i} Name` },
				{ variableId: `skx${i}_lowcut`, name: `SKX${i} Lowcut (Hz)` },
				{ variableId: `skx${i}_gain`, name: `SKX${i} Gain (dB)` },
				{ variableId: `skx${i}_capsule`, name: `SKX${i} Capsule` },
				{ variableId: `skx${i}_battery_percent`, name: `SKX${i} Battery (%)` },
				{ variableId: `skx${i}_battery_time`, name: `SKX${i} Battery Time` }
			)
		}
		variableDefinitions.push(
			{ variableId: 'device_version', name: 'Device Version' },
			{ variableId: 'device_name', name: 'Device Name' },
			{ variableId: 'sys_brightness', name: 'System Brightness' },
			{ variableId: 'sys_clock', name: 'System Clock' },
			{ variableId: 'sys_clock_frequency', name: 'System Clock Frequency' }
		)
	} else if (self.config.device === choices.devices[2].id) {
		//set L6000 variables
		for (let i = 1; i <= 4; i++) {
			variableDefinitions.push({ variableId: `slot${i}_type`, name: `Slot ${i} Type` })
			for (let j = 1; j <= 2; j++) {
				variableDefinitions.push(
					{ variableId: `slot${i}_${j}_led`, name: `Slot ${i}/${j} LED` },
					{ variableId: `slot${i}_${j}_led_meaning`, name: `Slot ${i}/${j} LED - Meaning` },
					{ variableId: `slot${i}_${j}_battery_temp`, name: `Slot ${i}/${j} Battery Temperature (C)` },
					{ variableId: `slot${i}_${j}_battery_voltage`, name: `Slot ${i}/${j} Battery Voltage (mV)` },
					{ variableId: `slot${i}_${j}_battery_capacity`, name: `Slot ${i}/${j} Battery Capacity (mAh)` },
					{ variableId: `slot${i}_${j}_battery_current`, name: `Slot ${i}/${j} Battery Current (mA)` },
					{ variableId: `slot${i}_${j}_battery_energy`, name: `Slot ${i}/${j} Battery Energy (mWh)` },
					{ variableId: `slot${i}_${j}_battery_operating_time_h`, name: `Slot ${i}/${j} Battery Operating Time (H)` },
					{
						variableId: `slot${i}_${j}_battery_operating_time_min`,
						name: `Slot ${i}/${j} Battery Operating Time (Min)`,
					},
					{ variableId: `slot${i}_${j}_battery_state_of_charge`, name: `Slot ${i}/${j} State Of Charge (%)` },
					{ variableId: `slot${i}_${j}_battery_cycle_count`, name: `Slot ${i}/${j} Battery Cycle Count` },
					{ variableId: `slot${i}_${j}_battery_state_of_health`, name: `Slot ${i}/${j} State Of Health (%)` },
					{ variableId: `slot${i}_${j}_battery_time_to_full_h`, name: `Slot ${i}/${j} Time to Full (H)` },
					{ variableId: `slot${i}_${j}_battery_time_to_full_min`, name: `Slot ${i}/${j} Time to Full (Min)` }
				)
			}
		}
		variableDefinitions.push(
			{ variableId: 'device_version', name: 'Device Version' },
			{ variableId: 'device_name', name: 'Device Name' }
		)
	}

	self.setVariableDefinitions(variableDefinitions)
}
