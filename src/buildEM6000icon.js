import { combineRgb } from '@companion-module/base'
import { iconsEM6000, iconDims } from './icons-em6000.js'
import { graphics } from 'companion-module-utils'

const bar = {
	width: 3,
	space: 1, //between bars
	offsetBase: 6, //from 'base' of the bar meter to the drawing edge (bottom or left). Must be <= bar.lengthOffset
	offsetSide: 4, //from 'side' of the bar meter to the drawing edge (top, bottom, left or right)
	lengthOffset: 12, //bar length is image height or width minus this value
}

const clipLED = graphics.circle({
	radius: bar.width / 2,
	color: combineRgb(255, 0, 0),
	opacity: 255,
})

const diversityLED = graphics.circle({
	radius: bar.width / 2,
	color: combineRgb(255, 255, 0),
	opacity: 255,
})

const presenceLED = graphics.circle({
	radius: bar.width / 2,
	color: combineRgb(0, 255, 0),
	opacity: 255,
})

const meterColours = {
	af: [
		{ size: 52, color: combineRgb(0, 255, 0), background: combineRgb(0, 255, 0), backgroundOpacity: 48 },
		{ size: 32, color: combineRgb(255, 255, 0), background: combineRgb(255, 255, 0), backgroundOpacity: 48 },
		{ size: 16, color: combineRgb(255, 0, 0), background: combineRgb(255, 0, 0), backgroundOpacity: 48 },
	],
	rf: [{ size: 100, color: combineRgb(255, 255, 0), background: combineRgb(255, 255, 0), backgroundOpacity: 48 }],
	lqi: [{ size: 100, color: combineRgb(0, 0, 255), background: combineRgb(0, 0, 255), backgroundOpacity: 48 }],
}

function returnLed(type, x, y, image) {
	return graphics.icon({
		width: image.width,
		height: image.height,
		custom: type === 'clip' ? clipLED : type === 'diversity' ? diversityLED : presenceLED,
		type: 'custom',
		customHeight: bar.width,
		customWidth: bar.width,
		offsetX: x,
		offsetY: y,
	})
}

function returnBorder(colour, image) {
	return graphics.border({
		width: image.width,
		height: image.height,
		color: colour,
		size: 2,
		opacity: 255,
		type: 'border',
	})
}

async function buildIcons(orientation, image, meters, iconOptions) {
	const images = {
		battery: {
			full: await graphics.parseBase64(iconsEM6000.battery[100]),
			seventy: await graphics.parseBase64(iconsEM6000.battery[70]),
			thirty: await graphics.parseBase64(iconsEM6000.battery[30]),
			low: await graphics.parseBase64(iconsEM6000.battery.low),
		},
		muted: await graphics.parseBase64(iconsEM6000.muted),
		encrypt: await graphics.parseBase64(iconsEM6000.encrypt),
	}
	const mtrCount = meters.includes('rf') ? meters.length + 1 : meters.length
	const xOffsetBat =
		iconOptions.includes('mute') && iconOptions.includes('encryption')
			? iconDims.mute.x + iconDims.encrypt.x + 2 * bar.space
			: iconOptions.includes('mute')
			? iconDims.mute.x + bar.space
			: iconOptions.includes('encryption')
			? iconDims.encrypt.x + bar.space
			: 0
	const xOffsetEncrypt = iconOptions.includes('mute') ? iconDims.mute.x + bar.space : 0
	const iconOffset = {
		battery: {
			x:
				orientation === 'left'
					? mtrCount * (bar.width + bar.space) + bar.offsetSide + xOffsetBat
					: orientation === 'top' || orientation === 'bottom'
					? image.width - (bar.offsetSide + xOffsetBat + iconDims.battery.x)
					: image.width - (mtrCount * (bar.width + bar.space) + bar.offsetSide + xOffsetBat + iconDims.battery.x),
			y:
				orientation === 'top'
					? mtrCount * (bar.width + bar.space) + bar.offsetSide
					: orientation === 'bottom'
					? image.height - (mtrCount * (bar.width + bar.space) + bar.offsetSide + iconDims.battery.y)
					: image.height - (bar.offsetBase + iconDims.battery.y),
		},
		mute: {
			x:
				orientation === 'left'
					? mtrCount * (bar.width + bar.space) + bar.offsetSide
					: orientation === 'top' || orientation === 'bottom'
					? image.width - (bar.offsetSide + iconDims.mute.x)
					: image.width - (mtrCount * (bar.width + bar.space) + bar.offsetSide + iconDims.mute.x),
			y:
				orientation === 'top'
					? mtrCount * (bar.width + bar.space) + bar.offsetSide
					: orientation === 'bottom'
					? image.height - (mtrCount * (bar.width + bar.space) + bar.offsetSide + iconDims.mute.y)
					: image.height - (bar.offsetBase + iconDims.mute.y),
		},
		encrypt: {
			x:
				orientation === 'left'
					? mtrCount * (bar.width + bar.space) + bar.offsetSide + xOffsetEncrypt
					: orientation === 'top' || orientation === 'bottom'
					? image.width - (bar.offsetSide + xOffsetEncrypt + iconDims.encrypt.x)
					: image.width - (mtrCount * (bar.width + bar.space) + bar.offsetSide + xOffsetEncrypt + iconDims.encrypt.x),
			y:
				orientation === 'top'
					? mtrCount * (bar.width + bar.space) + bar.offsetSide
					: orientation === 'bottom'
					? image.height - (mtrCount * (bar.width + bar.space) + bar.offsetSide + iconDims.encrypt.y)
					: image.height - (bar.offsetBase + iconDims.encrypt.y),
		},
	}
	const commonIconProps = {
		width: image.width,
		height: image.height,
		type: 'custom',
	}
	const commonBatteryProps = {
		...commonIconProps,
		offsetX: iconOffset.battery.x,
		offsetY: iconOffset.battery.y,
		customWidth: iconDims.battery.x,
		customHeight: iconDims.battery.y,
	}
	return {
		battery: {
			100: graphics.icon({
				...commonBatteryProps,
				custom: images.battery.full,
			}),
			70: graphics.icon({
				...commonBatteryProps,
				custom: images.battery.seventy,
			}),
			30: graphics.icon({
				...commonBatteryProps,
				custom: images.battery.thirty,
			}),
			low: graphics.icon({
				...commonBatteryProps,
				custom: images.battery.low,
			}),
		},
		muted: graphics.icon({
			...commonIconProps,
			offsetX: iconOffset.mute.x,
			offsetY: iconOffset.mute.y,
			custom: images.muted,
			customWidth: iconDims.mute.x,
			customHeight: iconDims.mute.y,
		}),
		encrypt: graphics.icon({
			...commonIconProps,
			offsetX: iconOffset.encrypt.x,
			offsetY: iconOffset.encrypt.y,
			custom: images.encrypt,
			customWidth: iconDims.encrypt.x,
			customHeight: iconDims.encrypt.y,
		}),
	}
}

function offsetStep(offset) {
	offset.x.position = offset.x.position + offset.x.step
	offset.y.position = offset.y.position + offset.y.step
	offset.x.positionPeak = offset.x.positionPeak + offset.x.step
	offset.y.positionPeak = offset.y.positionPeak + offset.y.step
	offset.x.positionDiv = offset.x.positionDiv + offset.x.step
	offset.y.positionDiv = offset.y.positionDiv + offset.y.step
	return offset
}

function calcOffset(orientation, image) {
	let offset = {
		x: {
			position: 0,
			positionPeak: 0,
			positionDiv: 0,
			step: 0,
		},
		y: {
			position: 0,
			positionPeak: 0,
			positionDiv: 0,
			step: 0,
		},
	}
	switch (orientation) {
		case 'top':
			offset.x.position = bar.offsetBase
			offset.x.positionPeak = image.width + bar.offsetBase - bar.lengthOffset
			offset.x.positionDiv = bar.offsetBase / 2 - bar.width / 2
			offset.x.step = 0
			offset.y.position = bar.offsetSide
			offset.y.positionPeak = bar.offsetSide
			offset.y.positionDiv = bar.offsetSide
			offset.y.step = bar.width + bar.space
			break
		case 'bottom':
			offset.x.position = bar.offsetBase
			offset.x.positionPeak = image.width + bar.offsetBase - bar.lengthOffset
			offset.x.positionDiv = bar.offsetBase / 2 - bar.width / 2
			offset.x.step = 0
			offset.y.position = image.height - (bar.offsetSide + bar.width)
			offset.y.positionPeak = image.height - (bar.offsetSide + bar.width)
			offset.y.positionDiv = image.height - (bar.offsetSide + bar.width)
			offset.y.step = -(bar.width + bar.space)
			break
		case 'left':
			offset.x.position = bar.offsetSide
			offset.x.positionPeak = bar.offsetSide
			offset.x.positionDiv = bar.offsetSide
			offset.x.step = bar.width + bar.space
			offset.y.position = bar.offsetBase
			offset.y.positionPeak = bar.offsetBase / 3
			offset.y.positionDiv = bar.offsetBase + image.height - bar.lengthOffset
			offset.y.step = 0
			break
		case 'right':
		default:
			offset.x.position = image.width - (bar.offsetSide + bar.width)
			offset.x.positionPeak = image.width - (bar.offsetSide + bar.width)
			offset.x.positionDiv = image.width - (bar.offsetSide + bar.width)
			offset.x.step = -(bar.width + bar.space)
			offset.y.position = bar.offsetBase
			offset.y.positionPeak = bar.offsetBase / 3
			offset.y.positionDiv = bar.offsetBase + image.height - bar.lengthOffset
			offset.y.step = 0
	}
	return offset
}

function calcBarMeterDefaults(orientation, image) {
	return {
		width: image.width,
		height: image.height,
		barLength:
			orientation === 'top' || orientation === 'bottom'
				? image.width - bar.lengthOffset
				: image.height - bar.lengthOffset,
		barWidth: bar.width,
		type: orientation === 'top' || orientation === 'bottom' ? 'horizontal' : 'vertical',
		opacity: 255,
		reverse: false,
	}
}

export async function buildEM6000icon(channel, metering, image, meteringOptions, graphicOptions, orientation) {
	let elements = []
	const meterDefault = calcBarMeterDefaults(orientation, image)
	const icons = await buildIcons(orientation, image, meteringOptions, graphicOptions)
	let offset = calcOffset(orientation, image)

	if (meteringOptions.includes('rf')) {
		let rf = {
			...meterDefault,
			colors: meterColours.rf,
			offsetX: offset.x.position,
			offsetY: offset.y.position,
			value: 0,
		}
		if (orientation === 'top' || orientation === 'left') {
			rf.value = metering.RF1 === null ? 0 : (metering.RF1 + 50) * 2 + 100
			if (metering.RF1_PEAK) {
				elements.push(returnLed('clip', offset.x.positionPeak, offset.y.positionPeak, image))
			}
			if (metering.DIV1) {
				elements.push(returnLed('diversity', offset.x.positionDiv, offset.y.positionDiv, image))
			}
		} else {
			rf.value = metering.RF2 === null ? 0 : (metering.RF2 + 50) * 2 + 100
			if (metering.RF2_PEAK) {
				elements.push(returnLed('clip', offset.x.positionPeak, offset.y.positionPeak, image))
			}
			if (metering.DIV2) {
				elements.push(returnLed('diversity', offset.x.positionDiv, offset.y.positionDiv, image))
			}
		}
		elements.push(graphics.bar(rf))
		offset = offsetStep(offset)

		rf.offsetX = offset.x.position
		rf.offsetY = offset.y.position
		if (orientation === 'top' || orientation === 'left') {
			rf.value = metering.RF2 === null ? 0 : (metering.RF2 + 50) * 2 + 100
			if (metering.RF2_PEAK) {
				elements.push(returnLed('clip', offset.x.positionPeak, offset.y.positionPeak, image))
			}
			if (metering.DIV2) {
				elements.push(returnLed('diversity', offset.x.positionDiv, offset.y.positionDiv, image))
			}
		} else {
			rf.value = metering.RF1 === null ? 0 : (metering.RF1 + 50) * 2 + 100
			if (metering.RF1_PEAK) {
				elements.push(returnLed('clip', offset.x.positionPeak, offset.y.positionPeak, image))
			}
			if (metering.DIV1) {
				elements.push(returnLed('diversity', offset.x.positionDiv, offset.y.positionDiv, image))
			}
		}
		elements.push(graphics.bar(rf))
		offset = offsetStep(offset)
	}
	if (meteringOptions.includes('lqi')) {
		const lqi = {
			...meterDefault,
			colors: meterColours.lqi,
			offsetX: offset.x.position,
			offsetY: offset.y.position,
			value: metering.LQI === null ? 0 : metering.LQI,
		}
		elements.push(graphics.bar(lqi))
		offset = offsetStep(offset)
	}
	if (meteringOptions.includes('af')) {
		const af = {
			...meterDefault,
			colors: meterColours.af,
			offsetX: offset.x.position,
			offsetY: offset.y.position,
			value: metering.AF === null ? 0 : metering.AF * 2 + 100,
		}
		elements.push(graphics.bar(af))
		if (metering.PEAK) {
			elements.push(returnLed('clip', offset.x.positionPeak, offset.y.positionPeak, image))
		}
		if (metering.AF > -100 && metering.AF !== null) {
			//signal presence LED
			elements.push(returnLed('presence', offset.x.positionDiv, offset.y.positionDiv, image))
		}
		offset = offsetStep(offset)
	}
	if (graphicOptions.includes('mute') && (channel.audio_mute)) {
		elements.push(icons.muted)
	}
	if (graphicOptions.includes('encryption') && (channel.encryption)) {
		elements.push(icons.encrypt)
	}
	if (graphicOptions.includes('battery')) {
		if (channel.skx.battery.percent === '100%') {
			elements.push(icons.battery[100])
		} else if (channel.skx.battery.percent === '70%') {
			elements.push(icons.battery[70])
		} else if (channel.skx.battery.percent === '30%') {
			elements.push(icons.battery[30])
		} else if (channel.skx.battery.percent === 'low') {
			elements.push(icons.battery.low)
		}
	}

	if (graphicOptions.includes('warnings')) {
		if (channel.active_warnings.includes('LowBattery')) {
			elements.push(returnBorder(combineRgb(255, 0, 0), image))
		} else if (channel.active_warnings.includes('NoLink')) {
			elements.push(returnBorder(combineRgb(110, 110, 110), image))
		} else if (channel.active_warnings.includes('LowSignal')) {
			elements.push(returnBorder(combineRgb(255, 255, 0), image))
		} else if (channel.active_warnings.includes('BadClock') || channel.active_warnings.includes('NoClock')) {
			elements.push(returnBorder(combineRgb(204, 0, 204), image))
		} else if (channel.active_warnings.includes('Aes256Error')) {
			elements.push(returnBorder(combineRgb(0, 102, 0), image))
		} else if (channel.active_warnings.includes('AnTxYBNCShorted')) {
			elements.push(returnBorder(combineRgb(255, 223, 192), image))
		}
	}
	return elements.length > 0 ? graphics.stackImage(elements) : null
}
