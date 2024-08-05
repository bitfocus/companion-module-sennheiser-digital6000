import { choices } from './consts.js'

export default async function (self) {
	let variableValues = []
	if (self.config.device === choices.devices[0].id || self.config.device === choices.devices[1].id) {
		//set EM6000 variables
		for (let i = 1; i <= 2; i++) {
			variableValues[`out${i}_level`] = self.d6000.audio[`out${i}`].level_db
			variableValues[`rx${i}_active_bank`] = self.d6000[`rx${i}`].active_bank_channel.bank
			variableValues[`rx${i}_active_channel`] = self.d6000[`rx${i}`].active_bank_channel.channel
			variableValues[`rx${i}_carrier`] = self.d6000[`rx${i}`].carrier
			variableValues[`rx${i}_name`] = self.d6000[`rx${i}`].name
			variableValues[`rx${i}_rf1`] = self.d6000.mm[`ch${i}`].RF1
			variableValues[`rx${i}_rf2`] = self.d6000.mm[`ch${i}`].RF2
			variableValues[`rx${i}_lqi`] = self.d6000.mm[`ch${i}`].LQI
			variableValues[`rx${i}_af`] = self.d6000.mm[`ch${i}`].AF
			variableValues[`skx${i}_name`] = self.d6000[`rx${i}`].skx.name
			variableValues[`skx${i}_lowcut`] = self.d6000[`rx${i}`].skx.lowcut
			variableValues[`skx${i}_gain`] = self.d6000[`rx${i}`].skx.gain
			variableValues[`skx${i}_capsule`] = self.d6000[`rx${i}`].skx.capsule
			variableValues[`skx${i}_battery_percent`] = self.d6000[`rx${i}`].skx.battery.percent
			variableValues[`skx${i}_battery_time`] = self.d6000[`rx${i}`].skx.battery.time
		}
		variableValues['device_version'] = self.d6000.device.identity.version
		variableValues['device_name'] = self.d6000.device.name
	} else if (self.config.device === choices.devices[2].id) {
		//set L6000 variables
		for (let i = 1; i <= 4; i++) {
			variableValues[`slot${i}_type`] = self.d6000[`slot${i}`].type

			for (let j = 1; j <= 2; j++) {
				variableValues[`slot${i}_${j}_led`] = self.d6000[`slot${i}`][`subslot${j}`].led
				for (const led of choices.led) {
					if (led.id === self.d6000[`slot${i}`][`subslot${j}`].led) {
						variableValues[`slot${i}_${j}_led_meaning`] = led.label
						break
					}
				}
				if (self.d6000[`slot${i}`][`subslot${j}`].led === 'OFF') {
					variableValues[`slot${i}_${j}_battery_temp`] = 0
					variableValues[`slot${i}_${j}_battery_voltage`] = 0
					variableValues[`slot${i}_${j}_battery_capacity`] = 0
					variableValues[`slot${i}_${j}_battery_current`] = 0
					variableValues[`slot${i}_${j}_battery_energy`] = 0
					variableValues[`slot${i}_${j}_battery_operating_time_h`] = 0
					variableValues[`slot${i}_${j}_battery_operating_time_min`] = 0
					variableValues[`slot${i}_${j}_battery_state_of_charge`] = 0
					variableValues[`slot${i}_${j}_battery_cycle_count`] = 0
					variableValues[`slot${i}_${j}_battery_state_of_health`] = 0
					variableValues[`slot${i}_${j}_battery_time_to_full_h`] = 0
					variableValues[`slot${i}_${j}_battery_time_to_full_min`] = 0
				} else {
					variableValues[`slot${i}_${j}_battery_temp`] =
						self.d6000[`slot${i}`][`subslot${j}`].accu_parameter.temperature
					variableValues[`slot${i}_${j}_battery_voltage`] = self.d6000[`slot${i}`][`subslot${j}`].accu_parameter.voltage
					variableValues[`slot${i}_${j}_battery_capacity`] =
						self.d6000[`slot${i}`][`subslot${j}`].accu_parameter.capacity
					variableValues[`slot${i}_${j}_battery_current`] = self.d6000[`slot${i}`][`subslot${j}`].accu_parameter.current
					variableValues[`slot${i}_${j}_battery_energy`] = self.d6000[`slot${i}`][`subslot${j}`].accu_parameter.energy
					variableValues[`slot${i}_${j}_battery_operating_time_h`] =
						self.d6000[`slot${i}`][`subslot${j}`].accu_parameter.operating_time_h
					variableValues[`slot${i}_${j}_battery_operating_time_min`] =
						self.d6000[`slot${i}`][`subslot${j}`].accu_parameter.operating_time_m
					variableValues[`slot${i}_${j}_battery_state_of_charge`] =
						self.d6000[`slot${i}`][`subslot${j}`].accu_parameter.state_of_charge
					variableValues[`slot${i}_${j}_battery_cycle_count`] =
						self.d6000[`slot${i}`][`subslot${j}`].accu_parameter.cycle_count
					variableValues[`slot${i}_${j}_battery_state_of_health`] =
						self.d6000[`slot${i}`][`subslot${j}`].accu_parameter.state_of_health
					variableValues[`slot${i}_${j}_battery_time_to_full_h`] =
						self.d6000[`slot${i}`][`subslot${j}`].accu_parameter.time_to_full_h
					variableValues[`slot${i}_${j}_battery_time_to_full_min`] =
						self.d6000[`slot${i}`][`subslot${j}`].accu_parameter.time_to_full_m
				}
			}
		}
		variableValues['device_version'] = self.d6000.device.identity.version
		variableValues['device_name'] = self.d6000.device.name
	}

	self.setVariableValues(variableValues)
}
