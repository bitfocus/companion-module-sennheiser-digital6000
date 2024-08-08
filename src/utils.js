import { regexpName } from './consts.js'

export function convert_RF_to_dBm(level) {
	if (isNaN(level)) {
		console.log(`convert_RF_to_dBm has been passed a NaN ${level}`)
		return null
	}
	return (level - 255) / 2
}
export function convert_AF_to_dBFS(level) {
	if (isNaN(level)) {
		console.log(`convert_AF_to_dBFS has been passed a NaN ${level}`)
		return null
	}
	return (level + 1) / 2 - 128
}

export function convert_LQI_to_percent(lqi) {
	if (isNaN(lqi)) {
		console.log(`convert_LQI_to_percent has been passed a NaN ${lqi}`)
		return null
	}
	return Math.round(lqi / 255)
}

export function safeName(dirtyName) {
	const regexpName = new RegExp(/[()[\]{}~`!@%&_\\\^:'".?]/g)
	return dirtyName.trim().replaceAll(regexpName, '').slice(0, 8)
}
