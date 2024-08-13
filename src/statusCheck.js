export function statusCheck(newStatus, newLabel) {
	if (this.currentStatus.status === newStatus && this.currentStatus.label === newLabel) {
		return
	}
	this.updateStatus(newStatus, newLabel)
	this.currentStatus.status = newStatus
	this.currentStatus.label = newLabel
}
