<script lang="ts">
	import { Table, SegmentedControl, Paper, type ComboBoxItem } from '$lib/index.js';
	import type { Column } from '$lib/index.js';

	let selectedView = $state('list');
	let selectedSize = $state('md');
	let selectedPlan = $state('monthly');

	const viewOptions: ComboBoxItem[] = [
		{ value: 'list', label: 'List' },
		{ value: 'grid', label: 'Grid' },
		{ value: 'table', label: 'Table' }
	];

	const sizeOptions: ComboBoxItem[] = [
		{ value: 'xs', label: 'XS' },
		{ value: 'sm', label: 'SM' },
		{ value: 'md', label: 'MD' },
		{ value: 'lg', label: 'LG' },
		{ value: 'xl', label: 'XL' }
	];

	const billingOptions: ComboBoxItem[] = [
		{ value: 'monthly', label: 'Monthly' },
		{ value: 'yearly', label: 'Yearly' }
	];

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
		{ prop: 'options', type: 'ComboBoxItem[]', default: '-', description: 'Array of segmented options (required)' },
		{ prop: 'value', type: 'any', default: 'undefined', description: 'Bindable selected value (defaults to first option)' },
		{ prop: 'onchange', type: '(value: string) => void', default: 'undefined', description: 'Called when selection changes' },
	];
</script>

<h1>SegmentedControl</h1>
<p>A segmented control for toggling between a small set of options, displayed as connected buttons.</p>

<div class="vstack">
	<Paper title="Basic Usage">
		<div class="form-grid">
			<SegmentedControl
				options={viewOptions}
				bind:value={selectedView}
			/>
			<div class="value-display">Selected: {selectedView}</div>
		</div>
	</Paper>

	<Paper title="With Many Options">
		<div class="form-grid">
			<SegmentedControl
				options={sizeOptions}
				bind:value={selectedSize}
			/>
			<div class="value-display">Selected: {selectedSize}</div>
		</div>
	</Paper>

	<Paper title="Two Options (Toggle Style)">
		<div class="form-grid">
			<SegmentedControl
				options={billingOptions}
				bind:value={selectedPlan}
			/>
			<div class="value-display">Selected: {selectedPlan}</div>
		</div>
	</Paper>

	<Paper title="With Change Handler">
		<div class="form-grid">
			<SegmentedControl
				options={viewOptions}
				value="list"
				onchange={(value) => {
					alert(`Changed to: ${value}`);
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
