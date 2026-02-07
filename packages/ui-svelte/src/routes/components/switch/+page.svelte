<script lang="ts">
	import { Table, Switch, Paper } from '$lib/index.js';
	import type { Column } from '$lib/index.js';

	let basicChecked = $state(false);
	let notificationsChecked = $state(true);
	let darkModeChecked = $state(false);
	let autoSaveChecked = $state(true);
	let errorChecked = $state(false);

	interface PropRow {
		prop: string;
		type: string;
		default: string;
		description: string;
	}

	const propsColumns: Column<PropRow>[] = [
		{ key: 'prop', label: 'Prop' },
		{ key: 'type', label: 'Type' },
		{ key: 'default', label: 'Default' },
		{ key: 'description', label: 'Description' },
	];

	const propsRows: PropRow[] = [
		{ prop: 'label', type: 'string', default: '-', description: 'Label text for the switch (required)' },
		{ prop: 'checked', type: 'boolean', default: '-', description: 'Bindable checked state (required)' },
		{ prop: 'disabled', type: 'boolean', default: 'false', description: 'Disables the switch' },
		{ prop: 'description', type: 'string', default: 'undefined', description: 'Description text below the label' },
		{ prop: 'showError', type: 'boolean', default: 'false', description: 'Shows error styling' },
		{ prop: 'onchange', type: '(value: boolean) => void', default: 'undefined', description: 'Called when switch is toggled' },
	];
</script>

<h1>Switch</h1>
<p>Toggle switch for boolean on/off states.</p>

<div class="vstack">
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
		<Table columns={propsColumns} rows={propsRows} striped hover={false} />
	</Paper>
</div>

<style>
	h1 { margin-bottom: 0.5rem; }
	p { color: var(--pui-color-text-secondary); margin-bottom: 1.5rem; }
	.form-grid { display: flex; flex-direction: column; gap: 1rem; max-width: 400px; }
	.value-display { font-size: 0.875rem; color: var(--pui-color-text-muted); font-family: monospace; margin-top: 0.5rem; }</style>
