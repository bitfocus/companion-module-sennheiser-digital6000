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
