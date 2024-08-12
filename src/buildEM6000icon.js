import { combineRgb } from '@companion-module/base'
import { graphics } from 'companion-module-utils'

const bar = {
	width: 3,
	space: 1, //between bars
	offsetBase: 6, //from 'base' of the bar meter to the drawing edge (bottom or left). Must be <= bar.length
	offsetSide: 4, //from 'side' of the bar meter to the drawing edge (top, bottom, left or right)
	length: 12, //bar length is image height or width minus this value
}

const clipLED = graphics.circle({
	radius: bar.width / 2,
	color: combineRgb(255, 0, 0),
	opacity: 255,
})

const diversityLED = graphics.circle({
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
	lqi: [{ size: 100, color: combineRgb(0, 0, 255), background: combineRgb(0, 0, 255), backgroundOpacity: 0 }],
}

function returnLed(type, x, y, image) {
	return graphics.icon({
		width: image.width,
		height: image.height,
		custom: type === 'clip' ? clipLED : diversityLED,
		type: 'custom',
		customHeight: bar.width,
		customWidth: bar.width,
		offsetX: x,
		offsetY: y,
	})
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
			offset.x.positionPeak = image.width + bar.offsetBase - bar.length
			offset.x.positionDiv = bar.offsetBase / 2 - bar.width / 2
			offset.x.step = 0
			offset.y.position = bar.offsetSide
			offset.y.positionPeak = bar.offsetSide
			offset.y.positionDiv = bar.offsetSide
			offset.y.step = bar.width + bar.space
			break
		case 'bottom':
			offset.x.position = bar.offsetBase
			offset.x.positionPeak = image.width + bar.offsetBase - bar.length
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
			offset.y.positionDiv = bar.offsetBase + image.height - bar.length
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
			offset.y.positionDiv = bar.offsetBase + image.height - bar.length
			offset.y.step = 0
	}
	return offset
}

function calcBarMeterDefaults(orientation, image) {
	return {
		width: image.width,
		height: image.height,
		barLength: orientation === 'top' || orientation === 'bottom' ? image.width - bar.length : image.height - bar.length,
		barWidth: bar.width,
		type: orientation === 'top' || orientation === 'bottom' ? 'horizontal' : 'vertical',
		opacity: 255,
		reverse: false,
	}
}

export function buildEM6000icon(channel, metering, image, meteringOptions, graphicOptions, orientation) {
	let elements = []
	if (meteringOptions.length < 1 && graphicOptions < 1) {
		//nothing selected
		return null
	}
	orientation = orientation || 'right'
	const meterDefault = calcBarMeterDefaults(orientation, image)
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
		if (metering.AF > -100) {
			//signal presence LED
			elements.push(returnLed('diversity', offset.x.positionDiv, offset.y.positionDiv, image))
		}
		offset = offsetStep(offset)
	}
	if (graphicOptions.includes('mute')) {
		/* let mute = {
			width: image.width,
			height: image.height,
			offsetX: offset.x.position + offset.x.step,
			offsetY: offset.y.position + offset.y.step,
			type: 'mic5', // green mic
		}
		if (channel.audio_mute) {s
			mute.type = 'mic3' //grey mic with red dash
		} else if (channel.active_warnings.includes('NoLink')) {
			mute.type = 'mic1' //grey mic
		} */
		if (channel.audio_mute) {
			elements.push(
				graphics.border({
					width: image.width,
					height: image.height,
					color: combineRgb(255, 0, 0),
					size: 2,
					opacity: 255,
					type: 'border',
				})
			)
		} else if (channel.active_warnings.includes('NoLink')) {
			elements.push(
				graphics.border({
					width: image.width,
					height: image.height,
					color: combineRgb(110, 110, 110),
					size: 2,
					opacity: 255,
					type: 'border',
				})
			)
		}
		//elements.push(graphics.icon(mute))
		offset = offsetStep(offset)
	}
	return elements.length > 0 ? graphics.stackImage(elements) : null
}
