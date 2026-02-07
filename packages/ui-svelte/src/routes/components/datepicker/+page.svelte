<script lang="ts">
	import { Table, DatePicker, Paper } from '$lib/index.js';
	import type { Column } from '$lib/index.js';

	let basicDate = $state<string | undefined>(undefined);
	let constrainedDate = $state<string | undefined>(undefined);
	let requiredDate = $state<string | undefined>(undefined);

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
		{ prop: 'value', type: 'string | undefined', default: 'undefined', description: 'Bindable date value in YYYY-MM-DD format' },
		{ prop: 'label', type: 'string', default: 'undefined', description: 'Label text above the input' },
		{ prop: 'disabled', type: 'boolean', default: 'false', description: 'Disables the date picker' },
		{ prop: 'required', type: 'boolean', default: 'false', description: 'Shows required indicator' },
		{ prop: 'minDate', type: 'string | undefined', default: 'undefined', description: 'Minimum selectable date (YYYY-MM-DD format)' },
		{ prop: 'maxDate', type: 'string | undefined', default: 'undefined', description: 'Maximum selectable date (YYYY-MM-DD format)' },
		{ prop: 'onchange', type: '(date: string | undefined) => void', default: 'undefined', description: 'Called when date changes or is cleared' },
	];
</script>

<h1>DatePicker</h1>
<p>A date selection component with a calendar dropdown and text input support.</p>

<div class="vstack">
	<Paper title="Basic Usage">
		<div class="form-grid">
			<DatePicker
				label="Select Date"
				bind:value={basicDate}
			/>
			<div class="value-display">Value: {basicDate ?? 'none'}</div>
		</div>
	</Paper>

	<Paper title="With Min/Max Date">
		<div class="form-grid">
			<DatePicker
				label="Booking Date"
				bind:value={constrainedDate}
				minDate="2025-01-01"
				maxDate="2025-12-31"
			/>
			<div class="value-display">Value: {constrainedDate ?? 'none'}</div>
			<div class="value-display">Range: 2025-01-01 to 2025-12-31</div>
		</div>
	</Paper>

	<Paper title="Required">
		<div class="form-grid">
			<DatePicker
				label="Start Date"
				bind:value={requiredDate}
				required
			/>
			<div class="value-display">Value: {requiredDate ?? 'none'}</div>
		</div>
	</Paper>

	<Paper title="Disabled">
		<div class="form-grid">
			<DatePicker
				label="Locked Date"
				disabled
			/>
		</div>
	</Paper>

	<Paper title="With Change Handler">
		<div class="form-grid">
			<DatePicker
				label="Event Date"
				onchange={(date) => {
					alert(`Date selected: ${date ?? 'cleared'}`);
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
