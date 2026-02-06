<script lang="ts">
	import { SegmentedControl, Paper, type ComboBoxItem } from '$lib/index.js';

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
</script>

<h1>SegmentedControl</h1>
<p>A segmented control for toggling between a small set of options, displayed as connected buttons.</p>

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
				<td><code>options</code></td>
				<td><code>ComboBoxItem[]</code></td>
				<td>-</td>
				<td>Array of segmented options (required)</td>
			</tr>
			<tr>
				<td><code>value</code></td>
				<td><code>any</code></td>
				<td><code>undefined</code></td>
				<td>Bindable selected value (defaults to first option)</td>
			</tr>
			<tr>
				<td><code>onchange</code></td>
				<td><code>(value: string) => void</code></td>
				<td><code>undefined</code></td>
				<td>Called when selection changes</td>
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
