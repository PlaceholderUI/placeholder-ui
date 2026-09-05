<script lang="ts">
	import Paper from '$lib/display/Paper.svelte';
	import Switch from '$lib/form/Switch.svelte';

	// State variables
	let basicSwitch = false;
	let preEnabledSwitch = true;
	let requiredSwitch = false;
	let disabledOffSwitch = false;
	let disabledOnSwitch = true;
	let errorSwitch = false;

	// Settings example state
	let emailNotifications = true;
	let pushNotifications = false;
	let darkMode = false;
	let autoSave = true;
	let twoFactorAuth = false;
	let publicProfile = false;
	let analyticsTracking = true;

	// Feature toggles example
	let betaFeatures = false;
	let experimentalUI = false;
	let advancedMode = false;
	let debugMode = false;

	function handleBasicSwitchChange(value: boolean) {
		console.log('Basic switch changed:', value);
	}

	function handleNotificationChange(value: boolean) {
		console.log('Email notifications:', value);
		if (!value) {
			// If email notifications are disabled, also disable push notifications
			pushNotifications = false;
		}
	}

	function handleDarkModeChange(value: boolean) {
		console.log('Dark mode:', value);
		// In a real app, this might trigger a theme change
	}

	function handleTwoFactorChange(value: boolean) {
		console.log('Two-factor auth:', value);
		if (value) {
			// If enabling 2FA, we might want to trigger a setup flow
			console.log('Starting 2FA setup...');
		}
	}
</script>

<div class="page-header">
	<h1>Switch</h1>
	<p>Toggle switch component for binary on/off settings with smooth animations.</p>
</div>

<div class="vstack">
	<Paper title="Basic Usage">
		<div class="form-grid">
			<div class="switch-section">
				<Switch 
					label="Basic Switch" 
					bind:checked={basicSwitch} 
				/>
				<Switch 
					label="Pre-enabled Switch" 
					bind:checked={preEnabledSwitch} 
				/>
			</div>
			<div class="switch-info">
				<strong>Current Values:</strong>
				<p>Basic Switch: {basicSwitch ? 'ON' : 'OFF'}</p>
				<p>Pre-enabled Switch: {preEnabledSwitch ? 'ON' : 'OFF'}</p>
			</div>
		</div>
	</Paper>

	<Paper title="States">
		<div class="form-grid">
			<div class="switch-section">
				<Switch 
					label="Required Switch" 
					required={true} 
					bind:checked={requiredSwitch} 
				/>
				<Switch 
					label="Disabled (Off)" 
					disabled={true} 
					bind:checked={disabledOffSwitch} 
				/>
				<Switch 
					label="Disabled (On)" 
					disabled={true} 
					bind:checked={disabledOnSwitch} 
				/>
				<Switch 
					label="Switch with Error" 
					showError={true}
					bind:checked={errorSwitch} 
				/>
			</div>
			<div class="switch-info">
				<strong>State Values:</strong>
				<p>Required: {requiredSwitch ? 'ON' : 'OFF'}</p>
				<p>Error: {errorSwitch ? 'ON' : 'OFF'}</p>
				<p>Disabled (Off): {disabledOffSwitch ? 'ON' : 'OFF'}</p>
				<p>Disabled (On): {disabledOnSwitch ? 'ON' : 'OFF'}</p>
			</div>
		</div>
	</Paper>

	<Paper title="With Event Handlers">
		<div class="form-grid">
			<div class="switch-section">
				<Switch 
					label="Switch with Change Handler" 
					bind:checked={basicSwitch}
					onchange={handleBasicSwitchChange}
				/>
				<Switch 
					label="Dark Mode Toggle" 
					bind:checked={darkMode}
					onchange={handleDarkModeChange}
				/>
			</div>
			<div class="switch-info">
				<p>These switches log changes to the console.</p>
				<p>Open your browser's developer tools to see the output.</p>
				<p class="note">Dark mode switch could trigger theme changes in a real application.</p>
			</div>
		</div>
	</Paper>

	<Paper title="Settings Panel Example">
		<div class="settings-section">
			<h3>Notification Settings</h3>
			<div class="settings-group">
				<Switch 
					label="Email Notifications" 
					bind:checked={emailNotifications}
					onchange={handleNotificationChange}
				/>
				<Switch 
					label="Push Notifications" 
					bind:checked={pushNotifications}
					disabled={!emailNotifications}
				/>
			</div>

			<h3>Account Settings</h3>
			<div class="settings-group">
				<Switch 
					label="Public Profile" 
					bind:checked={publicProfile}
				/>
				<Switch 
					label="Two-Factor Authentication" 
					bind:checked={twoFactorAuth}
					onchange={handleTwoFactorChange}
				/>
				<Switch 
					label="Analytics Tracking" 
					bind:checked={analyticsTracking}
				/>
			</div>

			<h3>Application Settings</h3>
			<div class="settings-group">
				<Switch 
					label="Auto-save" 
					bind:checked={autoSave}
				/>
				<Switch 
					label="Dark Mode" 
					bind:checked={darkMode}
				/>
			</div>

			<div class="settings-summary">
				<strong>Current Configuration:</strong>
				<div class="summary-grid">
					<div class="summary-section">
						<h4>Notifications</h4>
						<ul>
							<li>Email: <span class="status {emailNotifications ? 'on' : 'off'}">{emailNotifications ? 'Enabled' : 'Disabled'}</span></li>
							<li>Push: <span class="status {pushNotifications ? 'on' : 'off'}">{pushNotifications ? 'Enabled' : 'Disabled'}</span></li>
						</ul>
					</div>
					<div class="summary-section">
						<h4>Account</h4>
						<ul>
							<li>Public Profile: <span class="status {publicProfile ? 'on' : 'off'}">{publicProfile ? 'Public' : 'Private'}</span></li>
							<li>2FA: <span class="status {twoFactorAuth ? 'on' : 'off'}">{twoFactorAuth ? 'Enabled' : 'Disabled'}</span></li>
							<li>Analytics: <span class="status {analyticsTracking ? 'on' : 'off'}">{analyticsTracking ? 'Enabled' : 'Disabled'}</span></li>
						</ul>
					</div>
					<div class="summary-section">
						<h4>Application</h4>
						<ul>
							<li>Auto-save: <span class="status {autoSave ? 'on' : 'off'}">{autoSave ? 'Enabled' : 'Disabled'}</span></li>
							<li>Dark Mode: <span class="status {darkMode ? 'on' : 'off'}">{darkMode ? 'Enabled' : 'Disabled'}</span></li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</Paper>

	<Paper title="Feature Toggles Example">
		<div class="feature-toggles-section">
			<h3>Developer Options</h3>
			<div class="switch-section">
				<Switch 
					label="Beta Features" 
					bind:checked={betaFeatures}
				/>
				<Switch 
					label="Experimental UI" 
					bind:checked={experimentalUI}
					disabled={!betaFeatures}
				/>
				<Switch 
					label="Advanced Mode" 
					bind:checked={advancedMode}
				/>
				<Switch 
					label="Debug Mode" 
					bind:checked={debugMode}
					disabled={!advancedMode}
				/>
			</div>
			<div class="feature-info">
				<strong>Feature Status:</strong>
				<p>Beta Features: {betaFeatures ? 'Enabled' : 'Disabled'}</p>
				<p>Experimental UI: {experimentalUI ? 'Enabled' : 'Disabled (requires Beta Features)'}</p>
				<p>Advanced Mode: {advancedMode ? 'Enabled' : 'Disabled'}</p>
				<p>Debug Mode: {debugMode ? 'Enabled' : 'Disabled (requires Advanced Mode)'}</p>
			</div>
		</div>
	</Paper>

	<Paper title="Features">
		<div class="feature-list">
			<ul>
				<li><strong>Smooth animations:</strong> Fluid toggle animation with CSS transitions</li>
				<li><strong>Theme support:</strong> Colors adapt to light/dark mode (primary/accent)</li>
				<li><strong>Accessibility:</strong> ARIA switch role with proper labeling</li>
				<li><strong>Keyboard navigation:</strong> Space bar and Enter key support</li>
				<li><strong>Required field support:</strong> Visual indicator for required switches</li>
				<li><strong>Error states:</strong> Display error styling when needed</li>
				<li><strong>Disabled states:</strong> Support for disabled switches</li>
				<li><strong>Event handling:</strong> onChange callback for custom logic</li>
				<li><strong>Custom styling:</strong> Support for custom CSS classes</li>
				<li><strong>Form integration:</strong> Works seamlessly with form validation</li>
				<li><strong>Touch friendly:</strong> Optimized for mobile and touch devices</li>
				<li><strong>Focus management:</strong> Clear focus indicators for accessibility</li>
			</ul>
		</div>
	</Paper>
</div>

<style>
	.page-header {
		margin-bottom: 2rem;
	}

	.page-header h1 {
		font-size: 2rem;
		font-weight: 700;
		margin: 0 0 0.5rem 0;
		color: var(--text-color);
	}

	.page-header p {
		color: var(--text-muted);
		margin: 0;
	}

	.form-grid {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.switch-section {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.switch-info {
		padding: 1rem;
		background-color: rgba(var(--ui-primary-rgbc), 0.05);
		border-radius: 0.375rem;
		border: 1px solid var(--border-color);
	}

	.switch-info strong {
		color: var(--text-color);
		font-weight: 600;
	}

	.switch-info p {
		margin: 0.25rem 0 0 0;
		color: var(--text-muted);
	}

	.settings-section h3 {
		color: var(--text-color);
		font-size: 1.125rem;
		font-weight: 600;
		margin: 2rem 0 1rem 0;
		padding-bottom: 0.5rem;
		border-bottom: 1px solid var(--border-color);
	}

	.settings-section h3:first-of-type {
		margin-top: 0;
	}

	.settings-group {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	.settings-summary {
		margin-top: 2rem;
		padding: 1.5rem;
		background-color: rgba(var(--ui-primary-rgbc), 0.05);
		border-radius: 0.375rem;
		border: 1px solid var(--border-color);
	}

	.settings-summary strong {
		color: var(--text-color);
		font-weight: 600;
		display: block;
		margin-bottom: 1rem;
	}

	.summary-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1rem;
	}

	.summary-section h4 {
		color: var(--text-color);
		font-size: 1rem;
		font-weight: 600;
		margin: 0 0 0.5rem 0;
	}

	.summary-section ul {
		margin: 0;
		padding-left: 1.5rem;
		color: var(--text-color);
	}

	.summary-section li {
		margin-bottom: 0.25rem;
	}

	.status.on {
		color: #10b981;
		font-weight: 500;
	}

	.status.off {
		color: #6b7280;
		font-weight: 500;
	}

	.feature-toggles-section h3 {
		color: var(--text-color);
		font-size: 1.25rem;
		font-weight: 600;
		margin: 0 0 1.5rem 0;
	}

	.feature-info {
		margin-top: 1.5rem;
		padding: 1rem;
		background-color: rgba(var(--ui-primary-rgbc), 0.05);
		border-radius: 0.375rem;
		border: 1px solid var(--border-color);
	}

	.feature-info strong {
		color: var(--text-color);
		font-weight: 600;
	}

	.feature-info p {
		margin: 0.25rem 0 0 0;
		color: var(--text-muted);
	}

	.feature-list ul {
		margin: 0;
		padding-left: 1.5rem;
		color: var(--text-color);
	}

	.feature-list li {
		margin-bottom: 0.5rem;
		line-height: 1.5;
	}

	.feature-list strong {
		color: var(--ui-primary);
		font-weight: 600;
	}

	.note {
		font-size: 0.875rem;
		color: var(--text-muted);
		font-style: italic;
	}

	:global(.dark) .switch-info,
	:global(.dark) .settings-summary,
	:global(.dark) .feature-info {
		background-color: rgba(var(--ui-accent-rgbc), 0.05);
	}

	:global(.dark) .feature-list strong {
		color: var(--ui-accent);
	}

	@media (min-width: 768px) {
		.form-grid {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: 1.5rem;
			align-items: start;
		}

		.summary-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}
</style>