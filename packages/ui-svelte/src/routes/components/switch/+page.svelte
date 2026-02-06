<script lang="ts">
	import { Switch, Paper } from '$lib/index.js';

	let basicChecked = $state(false);
	let notificationsChecked = $state(true);
	let darkModeChecked = $state(false);
	let autoSaveChecked = $state(true);
	let errorChecked = $state(false);
</script>

<h1>Switch</h1>
<p>Toggle switch for boolean on/off states.</p>

<Paper title="Basic Usage">
	<div class="form-grid">
		<Switch label="Enable feature" bind:checked={basicChecked} />
		<div class="value-display">Checked: {basicChecked}</div>
	</div>
</Paper>

<Paper title="With Description">
	<div class="form-grid">
		<Switch
			label="Notifications"
			bind:checked={notificationsChecked}
		/>
		<div class="value-display">Notifications: {notificationsChecked ? 'enabled' : 'disabled'}</div>
	</div>
</Paper>

<Paper title="Multiple Switches">
	<div class="form-grid">
		<Switch label="Dark Mode" bind:checked={darkModeChecked} />
		<Switch label="Auto Save" bind:checked={autoSaveChecked} />
		<Switch label="Notifications" bind:checked={notificationsChecked} />
		<div class="value-display">
			Dark Mode: {darkModeChecked}, Auto Save: {autoSaveChecked}, Notifications: {notificationsChecked}
		</div>
	</div>
</Paper>

<Paper title="Disabled">
	<div class="form-grid">
		<Switch label="Disabled off" checked={false} disabled />
		<Switch label="Disabled on" checked={true} disabled />
	</div>
</Paper>

<Paper title="With Error">
	<div class="form-grid">
		<Switch
			label="Accept terms"
			bind:checked={errorChecked}
			showError
		/>
		<div class="value-display">Accepted: {errorChecked}</div>
	</div>
</Paper>

<Paper title="With Change Handler">
	<div class="form-grid">
		<Switch
			label="Click to trigger handler"
			checked={false}
			onchange={(value) => {
				alert(`Switch is now: ${value ? 'on' : 'off'}`);
			}}
		/>
	</div>
</Paper>

<Paper title="Props">
	<table class="props-table">
		<thead>
			<tr>
				<th>Prop</th>
				<th>Type</th>
				<th>Default</th>
				<th>Description</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>label</code></td>
				<td><code>string</code></td>
				<td>-</td>
				<td>Label text for the switch (required)</td>
			</tr>
			<tr>
				<td><code>checked</code></td>
				<td><code>boolean</code></td>
				<td>-</td>
				<td>Bindable checked state (required)</td>
			</tr>
			<tr>
				<td><code>disabled</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Disables the switch</td>
			</tr>
			<tr>
				<td><code>description</code></td>
				<td><code>string</code></td>
				<td><code>undefined</code></td>
				<td>Description text below the label</td>
			</tr>
			<tr>
				<td><code>showError</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Shows error styling</td>
			</tr>
			<tr>
				<td><code>onchange</code></td>
				<td><code>(value: boolean) => void</code></td>
				<td><code>undefined</code></td>
				<td>Called when switch is toggled</td>
			</tr>
		</tbody>
	</table>
</Paper>

<style>
	h1 { margin-bottom: 0.5rem; }
	p { color: var(--pui-color-text-secondary); margin-bottom: 1.5rem; }
	.form-grid { display: flex; flex-direction: column; gap: 1rem; max-width: 400px; }
	.value-display { font-size: 0.875rem; color: var(--pui-color-text-muted); font-family: monospace; margin-top: 0.5rem; }
	.props-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
	.props-table th, .props-table td { text-align: left; padding: 0.75rem; border-bottom: 1px solid var(--pui-color-border); }
	.props-table th { font-weight: 600; background: var(--pui-color-bg-secondary); }
	.props-table code { background: var(--pui-color-bg-tertiary); padding: 0.125rem 0.375rem; border-radius: 4px; font-size: 0.8125rem; }
</style>
