import { InstanceStatus } from '@companion-module/base'
//bulk check feedbacks & update variables once per polling invterval to reduce load on host
export function startFeedbackChecks(interval) {
	if (this.feedbackTimer) {
		clearTimeout(this.feedbackTimer)
	}
	if (this.feedbacksToUpdate === undefined) {
		this.feedbacksToUpdate = []
		this.variablesToUpdate = false
		this.quietPeriod = 0
	} else if (this.feedbacksToUpdate.length > 0) {
		this.checkFeedbacks(...this.feedbacksToUpdate)
		this.updateVariableValues()
		this.feedbacksToUpdate = []
		this.variablesToUpdate = false
		this.quietPeriod = 0
	} else if (this.variablesToUpdate === true) {
		this.variablesToUpdate = false
		this.updateVariableValues()
		this.quietPeriod = 0
	} else {
		this.quietPeriod += 1
		if (this.quietPeriod >= 4) {
			this.statusCheck(InstanceStatus.ConnectionFailure, `No data`)
			this.log(
				'warn',
				`UDP Socket listening. No data recieved for at least ${this.quietPeriod * this.config.interval} ms`,
			)
		}
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
	delete this.variablesToUpdate
}

export function addFeedbacksToQueue(feedbacks) {
	if (Array.isArray(feedbacks)) {
		for (const fback of feedbacks) {
			if (!this.feedbacksToUpdate.includes(fback)) {
				this.feedbacksToUpdate.push(fback)
			}
		}
	} else {
		if (!this.feedbacksToUpdate.includes(feedbacks)) {
			this.feedbacksToUpdate.push(feedbacks)
		}
	}
}
