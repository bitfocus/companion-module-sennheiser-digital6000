import { Regex } from '@companion-module/base'
import { choices, default_port } from './consts.js'

// Return config fields for web config
export function getConfigFields() {
	return [
		{
			type: 'bonjour-device',
			id: 'bonjour_host',
			label: 'Bonjour Host',
			width: 8,
			regex: Regex.HOSTNAME,
		},
		{
			type: 'textinput',
			id: 'host',
			label: 'Host',
			width: 8,
			regex: Regex.HOSTNAME,
			isVisible: (options) => !options['bonjour_host'],
		},
		{
			type: 'static-text',
			id: 'host-filler',
			width: 6,
			label: '',
			isVisible: (options) => !!options['bonjour_host'],
			value: '',
		},
		{
			type: 'textinput',
			id: 'port',
			label: 'Port',
			width: 4,
			regex: Regex.PORT,
			default: default_port,
			isVisible: (options) => !options['bonjour_host'],
		},
		{
			type: 'static-text',
			id: 'port-filler',
			width: 4,
			label: '',
			isVisible: (options) => !!options['bonjour_host'],
			value: '',
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
			type: 'number',
			id: 'interval',
			label: 'Metering Interval (ms)',
			width: 6,
			default: 250,
			min: 50,
			max: 5000,
			step: 50,
			range: true,
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
