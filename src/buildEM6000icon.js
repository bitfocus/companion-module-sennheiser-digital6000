import { combineRgb } from '@companion-module/base'
import { graphics } from 'companion-module-utils'

const bar = {
	width: 3,
	space: 1, //between bars
	offset: 6, //from reference X-Y coordinates. 
    length: 12, //bar length is image height or width minus this value
}

const meterColours = {
	af: [
		{ size: 50, color: combineRgb(0, 255, 0), background: combineRgb(0, 255, 0), backgroundOpacity: 64 },
		{ size: 25, color: combineRgb(255, 255, 0), background: combineRgb(255, 255, 0), backgroundOpacity: 64 },
		{ size: 25, color: combineRgb(255, 0, 0), background: combineRgb(255, 0, 0), backgroundOpacity: 64 },
	],
	rf: [{ size: 100, color: combineRgb(255, 255, 0), background: combineRgb(255, 255, 0), backgroundOpacity: 64 }],
	lqi: [{ size: 100, color: combineRgb(0, 0, 255), background: combineRgb(0, 0, 255), backgroundOpacity: 64 }],
}

export function buildEM6000icon(channel, metering, image, meteringOptions, graphicOptions, orientation) {
	let elements = []
	if (meteringOptions.length < 1 && graphicOptions < 1) {
		//nothing selected
		return null
	}
	orientation = orientation || 'right'
    const meterDefault = {
		width: image.width,
		height: image.height,
		barLength: orientation === 'top' || orientation === 'bottom' ? image.width - bar.length : image.height - bar.length,
		barWidth: bar.width,
		type: orientation === 'top' || orientation === 'bottom' ? 'horizontal' : 'vertical',
		opacity: 255,
		reverse: false,
	}
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
            offset.x.position = bar.offset
			offset.x.positionPeak = bar.offset + (image.width - 2 * bar.offset) + 2
			offset.x.positionDiv = bar.offset - 4
			offset.x.step = 0
			offset.y.position = bar.offset
			offset.y.positionPeak = bar.offset
			offset.y.positionDiv = bar.offset
			offset.y.step = bar.width + bar.space
			break
		case 'bottom':
			offset.x.position = bar.offset
			offset.x.positionPeak = bar.offset + (image.width - 2 * bar.offset) + 2
			offset.x.positionDiv = bar.offset - 4
			offset.x.step = 0
			offset.y.position = image.height - (bar.offset + bar.width)
			offset.y.positionPeak = image.height - bar.offset
			offset.y.positionDiv = image.height - bar.offset
			offset.y.step = -(bar.width + bar.space)
			break
		case 'left':
			offset.x.position = bar.offset
			offset.x.positionPeak = bar.offset
			offset.x.positionDiv = bar.offset
			offset.x.step = bar.width + bar.space
			offset.y.position = bar.offset
			offset.y.positionPeak = bar.offset + (image.height - 2 * bar.offset) + 2
			offset.y.positionDiv = bar.offset - 4
			offset.y.step = 0
			break
		case 'right':
		default:
			offset.x.position = image.width - (bar.offset + bar.width)
			offset.x.positionPeak = image.width - bar.offset
			offset.x.positionDiv = image.width - bar.offset
			offset.x.step = -(bar.width + bar.space)
			offset.y.position = bar.offset
			offset.y.positionPeak = bar.offset + (image.height - 2 * bar.offset) + 2
			offset.y.positionDiv = bar.offset - 4
			offset.y.step = 0
	}
	
	if (meteringOptions.includes('rf')) {
        let rf = {
            ...meterDefault,
            colors: meterColours.rf,
            offsetX: offset.x.position,
            offsetY: offset.y.position,
            value: 0,
        }
        if (orientation === 'top' || orientation === 'left') {
            rf.value = metering.RF1 === null ? 0 : (metering.RF1 + 60) * 2 + 100
        } else {
            rf.value = metering.RF2 === null ? 0 : (metering.RF2 + 60) * 2 + 100
        }
		elements.push(graphics.bar(rf))
		offset.x.position = offset.x.position + offset.x.step
		offset.y.position = offset.y.position + offset.y.step
        rf.offsetX = offset.x.position
        rf.offsetY = offset.y.position
		if (orientation === 'top' || orientation === 'left') {
            rf.value = metering.RF2 === null ? 0 : (metering.RF2 + 60) * 2 + 100
        } else {
            rf.value = metering.RF1 === null ? 0 : (metering.RF1 + 60) * 2 + 100
        }
		elements.push(graphics.bar(rf))
		offset.x.position = offset.x.position + offset.x.step
		offset.y.position = offset.y.position + offset.y.step
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
		offset.x.position = offset.x.position + offset.x.step
		offset.y.position = offset.y.position + offset.y.step
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
		offset.x.position = offset.x.position + offset.x.step
		offset.y.position = offset.y.position + offset.y.step
	}
	return elements.length > 0 ? graphics.stackImage(elements) : null
}
