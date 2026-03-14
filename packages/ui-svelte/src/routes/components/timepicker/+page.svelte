<script lang="ts">
	import { Table, TimePicker, Paper } from '$lib/index.js';
	import type { Column } from '$lib/index.js';

	let basicTime = $state<string | undefined>(undefined);
	let requiredTime = $state<string | undefined>(undefined);

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
		{ prop: 'value', type: 'string | undefined', default: 'undefined', description: 'Bindable time value in HH:mm:ss format' },
		{ prop: 'label', type: 'string', default: 'undefined', description: 'Label text above the time picker' },
		{ prop: 'disabled', type: 'boolean', default: 'false', description: 'Disables the time picker' },
		{ prop: 'required', type: 'boolean', default: 'false', description: 'Shows required indicator' },
		{ prop: 'rounded', type: 'boolean', default: 'false', description: 'Applies rounded styling to the container' },
		{ prop: 'minDate', type: 'string | undefined', default: 'undefined', description: 'Minimum time constraint (used with selectedDate)' },
		{ prop: 'maxDate', type: 'string | undefined', default: 'undefined', description: 'Maximum time constraint (used with selectedDate)' },
		{ prop: 'selectedDate', type: 'string | undefined', default: 'undefined', description: 'Current date for min/max time constraint checks' },
		{ prop: 'onchange', type: '(time: string | undefined) => void', default: 'undefined', description: 'Called when time value changes' },
	];
</script>

<h1>TimePicker</h1>
<p>Time selection component with hour and minute inputs and an AM/PM toggle.</p>

<div class="vstack">
	<Paper title="Basic Usage">
		<div class="form-grid">
			<TimePicker
				label="Select Time"
				bind:value={basicTime}
			/>
			<div class="value-display">Value: {basicTime ?? 'none'}</div>
		</div>
	</Paper>

	<Paper title="Required">
		<div class="form-grid">
			<TimePicker
				label="Meeting Time"
				bind:value={requiredTime}
				required
			/>
			<div class="value-display">Value: {requiredTime ?? 'none'}</div>
		</div>
	</Paper>

	<Paper title="Disabled">
		<div class="form-grid">
			<TimePicker
				label="Locked Time"
				disabled
			/>
		</div>
	</Paper>

	<Paper title="With Change Handler">
		<div class="form-grid">
			<TimePicker
				label="Alarm Time"
				onchange={(time) => {
					alert(`Time set to: ${time ?? 'cleared'}`);
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
