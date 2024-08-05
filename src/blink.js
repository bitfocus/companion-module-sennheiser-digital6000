const blink_rate = 500
const frame_rate = 200
export function startBlink() {
	if (this.blinkTimer) {
		clearTimeout(this.blinkTimer)
	}
	this.blink = !this.blink
	this.checkFeedbacks('batteryStatus')
	this.blinkTimer = setTimeout(() => {
		this.startBlink()
	}, blink_rate)
}

export function stopBlink() {
	if (this.blinkTimer) {
		clearTimeout(this.blinkTimer)
		delete this.blinkTimer
	}
	if (this.blink) {
		delete this.blink
	}
}

export function startFrame() {
	if (this.frameTimer) {
		clearTimeout(this.frameTimer)
	}
	this.frame = this.frame === undefined || this.frame === 4 ? 0 : this.frame + 1
	this.checkFeedbacks('batteryStatus')
	this.frameTimer = setTimeout(() => {
		this.startFrame()
	}, frame_rate)
}

export function stopFrame() {
	if (this.frameTimer) {
		clearTimeout(this.frameTimer)
		delete this.frameTimer
	}
	if (this.blink) {
		delete this.frame
	}
}
