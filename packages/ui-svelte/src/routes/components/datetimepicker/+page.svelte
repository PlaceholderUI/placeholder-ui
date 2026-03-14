<script lang="ts">
	import { Table, DateTimePicker, Paper } from '$lib/index.js';
	import type { Column } from '$lib/index.js';

	let basicDateTime = $state<string | undefined>(undefined);
	let constrainedDateTime = $state<string | undefined>(undefined);
	let requiredDateTime = $state<string | undefined>(undefined);

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
		{ prop: 'value', type: 'string | undefined', default: 'undefined', description: 'Bindable datetime value in ISO format (YYYY-MM-DDTHH:mm:ssZ)' },
		{ prop: 'label', type: 'string', default: 'undefined', description: 'Label text above the input' },
		{ prop: 'disabled', type: 'boolean', default: 'false', description: 'Disables the datetime picker' },
		{ prop: 'required', type: 'boolean', default: 'false', description: 'Shows required indicator' },
		{ prop: 'minDate', type: 'string | undefined', default: 'undefined', description: 'Minimum selectable date and time' },
		{ prop: 'maxDate', type: 'string | undefined', default: 'undefined', description: 'Maximum selectable date and time' },
		{ prop: 'onchange', type: '(dateTime: string | undefined) => void', default: 'undefined', description: 'Called when date or time changes' },
	];
</script>

<h1>DateTimePicker</h1>
<p>Combined date and time selection component with a calendar dropdown and integrated time picker.</p>

<div class="vstack">
	<Paper title="Basic Usage">
		<div class="form-grid">
			<DateTimePicker
				label="Select Date & Time"
				bind:value={basicDateTime}
			/>
			<div class="value-display">Value: {basicDateTime ?? 'none'}</div>
		</div>
	</Paper>

	<Paper title="With Min/Max Date">
		<div class="form-grid">
			<DateTimePicker
				label="Appointment"
				bind:value={constrainedDateTime}
				minDate="2025-01-01T08:00:00"
				maxDate="2025-12-31T18:00:00"
			/>
			<div class="value-display">Value: {constrainedDateTime ?? 'none'}</div>
			<div class="value-display">Range: 2025-01-01 08:00 to 2025-12-31 18:00</div>
		</div>
	</Paper>

	<Paper title="Required">
		<div class="form-grid">
			<DateTimePicker
				label="Event Start"
				bind:value={requiredDateTime}
				required
			/>
			<div class="value-display">Value: {requiredDateTime ?? 'none'}</div>
		</div>
	</Paper>

	<Paper title="Disabled">
		<div class="form-grid">
			<DateTimePicker
				label="Locked DateTime"
				disabled
			/>
		</div>
	</Paper>

	<Paper title="With Change Handler">
		<div class="form-grid">
			<DateTimePicker
				label="Deadline"
				onchange={(dateTime) => {
					alert(`DateTime selected: ${dateTime ?? 'cleared'}`);
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
