import { InstanceBase, runEntrypoint, InstanceStatus } from '@companion-module/base'
import { UpgradeScripts } from './upgrades.js'
import UpdateActions from './actions.js'
import UpdateFeedbacks from './feedbacks.js'
import UpdatePresets from './presets.js'
import UpdateVariableDefinitions from './variables.js'
import * as config from './config.js'
import * as digital6000 from './digital6000.js'
import * as subscriptions from './subscriptions.js'
import * as udp from './udp.js'

class Digital6000 extends InstanceBase {
	constructor(internal) {
		super(internal)
		Object.assign(this, { ...config, ...digital6000, ...subscriptions, ...udp })
	}

	async init(config) {
		this.configUpdated(config)
	}
	// When module gets deleted
	async destroy() {
		this.log('debug', `destroy ${this.id}`)
		if (this.udp) {
			this.udp.destroy()
			delete this.udp
		}
	}

	async configUpdated(config) {
		this.config = config
		this.updateStatus(InstanceStatus.Connecting)
		this.initDigital6000(this.config.device)
		this.updateActions() // export actions
		this.updateFeedbacks() // export feedbacks
		this.updatePresets() // export presets
		this.updateVariableDefinitions() // export variable definitions
		this.init_udp(this.config.host, this.config.port)
		this.setupInitialSubscriptions(this.config.device, this.config.interval)
	}

	updateActions() {
		UpdateActions(this)
	}

	updateFeedbacks() {
		UpdateFeedbacks(this)
	}

	updatePresets() {
		UpdatePresets(this)
	}

	updateVariableDefinitions() {
		UpdateVariableDefinitions(this)
	}
}

runEntrypoint(Digital6000, UpgradeScripts)
