import { Regex } from '@companion-module/base'
import { choices, default_port } from './consts.js'

// Return config fields for web config
export function getConfigFields() {
	return [
		{
			type: 'textinput',
			id: 'host',
			label: 'IP',
			width: 8,
			regex: Regex.IP,
		},
		{
			type: 'textinput',
			id: 'port',
			label: 'Port',
			width: 4,
			regex: Regex.PORT,
			default: default_port,
		},
		{
			type: 'dropdown',
			id: 'device',
			label: 'Device',
			width: 6,
			default: choices.devices[0].id,
			choices: choices.devices,
		},
		{
			type: 'checkbox',
			id: 'verbose',
			label: 'Verbose Logging',
			width: 4,
			default: false,
		},
	]
}