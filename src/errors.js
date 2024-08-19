//SSC Errors
export const errors = [
	{ id: 100, label: 'Continue' },
	{ id: 102, label: 'Processing' },
	{ id: 200, label: 'OK' },
	{ id: 201, label: 'Created' },
	{ id: 202, label: 'Adapted' },
	{ id: 210, label: 'Partial success' },
	{ id: 310, label: 'Subscription terminates' },
	{ id: 400, label: 'Message not understood' },
	{ id: 401, label: 'Authorisation needed' },
	{ id: 403, label: 'Forbidden' },
	{ id: 404, label: 'Address not found' },
	{ id: 406, label: 'Not acceptable' },
	{ id: 408, label: 'Request time out' },
	{ id: 409, label: 'Conflict' },
	{ id: 410, label: 'Gone' },
	{ id: 413, label: 'Request too long' },
	{ id: 414, label: 'Request too complex' },
	{ id: 422, label: 'Unprocessable entity' },
	{ id: 423, label: 'Locked' },
	{ id: 424, label: 'Failed dependency' },
	{ id: 450, label: 'Answer too long' },
	{ id: 454, label: 'Parameter address not found' },
	{ id: 500, label: 'Internal server error' },
	{ id: 501, label: 'Not implemented' },
	{ id: 503, label: 'Service unavailable' },
]

export const warningsEM6000 = [
	{ id: 'RFPeak', label: 'RF Peak' },
	{ id: 'AFPeak', label: 'AF Peak' },
	{ id: 'LowSignal', label: 'Low Signal' },
	{ id: 'NoLink', label: 'No Link' },
	{ id: 'LowBattery', label: 'Low Battery' },
	{ id: 'BadClock', label: 'Bad Clock' },
	{ id: 'NoClock', label: 'No Clock' },
	{ id: 'Aes256Error', label: 'AES 256 Error' },
	{ id: 'AnTxYBNCShorted}.', label: 'Antenna BNC Shorted' },
]

export const activeStatusEM6000 = [
	{ id: 'SyncOK', label: 'Sync OK' },
	{ id: 'SyncFail', label: 'Sync Fail' },
	{ id: 'Identified', label: 'Identified' },
	{ id: 'SwUpdatePass,', label: 'Software Update Pass' },
	{ id: 'SwUpdateFail', label: 'Software Update Fail' },
]
export const activeStatusSubStateEM6000 = [
	{ id: 'SyncResultACK', label: 'Sync Result ACK' },
	{ id: 'SyncResultAdapted', label: 'Sync Result Adapted' },
	{ id: 'SyncResultNACK', label: 'Sync Result NACK' },
	{ id: 'SyncResultFreqRejected', label: 'Sync Result Freq Rejected' },
	{ id: 'SyncResultIncompatibleTx', label: 'Sync Result Incompatible Tx' },
	{ id: 'SyncResultCancelled', label: 'Sync Result Cancelled' },
	{ id: 'SyncResultTimeout', label: 'Sync Result Timeout' },
]
//L 6000 Warnings
export const warningsL6000 = [
	{ id: 0, label: 'Battery too hot slot/subslot 1/1', slot: 1, subslot: 1, warn: 'hot' },
	{ id: 1, label: 'Battery too hot slot/subslot 1/2', slot: 1, subslot: 2, warn: 'hot' },
	{ id: 2, label: 'Battery too hot slot/subslot 2/1', slot: 2, subslot: 1, warn: 'hot' },
	{ id: 3, label: 'Battery too hot slot/subslot 2/2', slot: 2, subslot: 2, warn: 'hot' },
	{ id: 4, label: 'Battery too hot slot/subslot 3/1', slot: 3, subslot: 1, warn: 'hot' },
	{ id: 5, label: 'Battery too hot slot/subslot 3/2', slot: 3, subslot: 2, warn: 'hot' },
	{ id: 6, label: 'Battery too hot slot/subslot 4/1', slot: 4, subslot: 1, warn: 'hot' },
	{ id: 7, label: 'Battery too hot slot/subslot 4/2', slot: 4, subslot: 2, warn: 'hot' },
	{ id: 8, label: 'Battery in regeneration slot/subslot 1/1', slot: 1, subslot: 1, warn: 'regen' },
	{ id: 9, label: 'Battery in regeneration slot/subslot 1/2', slot: 1, subslot: 2, warn: 'regen' },
	{ id: 10, label: 'Battery in regeneration slot/subslot 2/1', slot: 2, subslot: 1, warn: 'regen' },
	{ id: 11, label: 'Battery in regeneration slot/subslot 2/2', slot: 2, subslot: 2, warn: 'regen' },
	{ id: 12, label: 'Battery in regeneration slot/subslot 3/1', slot: 3, subslot: 1, warn: 'regen' },
	{ id: 13, label: 'Battery in regeneration slot/subslot 3/2', slot: 3, subslot: 2, warn: 'regen' },
	{ id: 14, label: 'Battery in regeneration slot/subslot 4/1', slot: 4, subslot: 1, warn: 'regen' },
	{ id: 15, label: 'Battery in regeneration slot/subslot 4/2', slot: 4, subslot: 2, warn: 'regen' },
	{ id: 16, label: 'Battery defect slot/subslot 1/1', slot: 1, subslot: 1, warn: 'defect' },
	{ id: 17, label: 'Battery defect slot/subslot 1/2', slot: 1, subslot: 2, warn: 'defect' },
	{ id: 18, label: 'Battery defect slot/subslot 2/1', slot: 2, subslot: 1, warn: 'defect' },
	{ id: 19, label: 'Battery defect slot/subslot 2/2', slot: 2, subslot: 2, warn: 'defect' },
	{ id: 20, label: 'Battery defect slot/subslot 3/1', slot: 3, subslot: 1, warn: 'defect' },
	{ id: 21, label: 'Battery defect slot/subslot 3/2', slot: 3, subslot: 2, warn: 'defect' },
	{ id: 22, label: 'Battery defect slot/subslot 4/1', slot: 4, subslot: 1, warn: 'defect' },
	{ id: 23, label: 'Battery defect slot/subslot 4/2', slot: 4, subslot: 2, warn: 'defect' },
	{ id: 24, label: 'Fan 1 defect', fan: 1 },
	{ id: 25, label: 'Fan 2 defect', fan: 2 },
	{ id: 26, label: 'Fan 3 defect', fan: 3 },
	{ id: 27, label: 'Fan 4 defect', fan: 4 },
	{ id: 28, label: 'Device too hot' },
	{ id: 29, label: 'Battery too cold slot/subslot 1/1', slot: 1, subslot: 1, warn: 'cold' },
	{ id: 30, label: 'Battery too cold slot/subslot 1/2', slot: 1, subslot: 2, warn: 'cold' },
	{ id: 31, label: 'Battery too cold slot/subslot 2/1', slot: 2, subslot: 1, warn: 'cold' },
	{ id: 32, label: 'Battery too cold slot/subslot 2/2', slot: 2, subslot: 2, warn: 'cold' },
	{ id: 33, label: 'Battery too cold slot/subslot 3/1', slot: 3, subslot: 1, warn: 'cold' },
	{ id: 34, label: 'Battery too cold slot/subslot 3/2', slot: 3, subslot: 2, warn: 'cold' },
	{ id: 35, label: 'Battery too cold slot/subslot 4/1', slot: 4, subslot: 1, warn: 'cold' },
	{ id: 36, label: 'Battery too cold slot/subslot 4/2', slot: 4, subslot: 2, warn: 'cold' },
]