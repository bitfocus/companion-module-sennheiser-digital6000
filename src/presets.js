import { combineRgb } from '@companion-module/base'
import { choices } from './consts.js'

export default async function (self) {
    let presetsDefinitions = {}
    if (self.config.device === choices.devices[0].id) {
		//set EM6000 presets
	} else if (self.config.device === choices.devices[1].id) {
		//set L6000 presets
	}
    self.setPresetDefinitions(presetsDefinitions)
}
