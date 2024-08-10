//bulk check feedbacks once per polling invterval to reduce load on host
export function startFeedbackChecks(interval) {
	if (this.feedbackTimer) {
		clearTimeout(this.feedbackTimer)
	}
	if (this.feedbacksToUpdate) {
		this.checkFeedbacks(...this.feedbacksToUpdate)
		this.feedbacksToUpdate = []
	} else if (this.feedbacksToUpdate === undefined) {
		this.feedbacksToUpdate = []
	}
	if (interval > 0) {
		this.feedbackTimer = setTimeout(() => {
			this.startFeedbackChecks(interval)
		}, interval)
	}
}

export function stopFeedbackChecks() {
	if (this.feedbackTimer) {
		clearTimeout(this.feedbackTimer)
		delete this.feedbackTimer
	}
	delete this.feedbacksToUpdate
}

export function addFeedbacksToQueue(feedbacks) {
	if (!Array.isArray(feedbacks)) {
		this.log('warn', `addFeedbacksToQueue must be passed an array ${feedbacks}`)
		return
	}
	for (const fback of feedbacks) {
		if (!this.feedbacksToUpdate.includes(fback)) {
			this.feedbacksToUpdate.push(fback)
		}
	}
}
