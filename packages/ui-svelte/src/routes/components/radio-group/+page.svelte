<script lang="ts">
	import { RadioGroup, Paper, type ComboBoxItem } from '$lib/index.js';

	let selectedFruit = $state<string | undefined>(undefined);
	let selectedSize = $state<string | undefined>('md');
	let requiredValue = $state<string | undefined>(undefined);
	let errorValue = $state<string | undefined>(undefined);

	const fruitOptions: ComboBoxItem[] = [
		{ value: 'apple', label: 'Apple' },
		{ value: 'banana', label: 'Banana' },
		{ value: 'cherry', label: 'Cherry' },
		{ value: 'grape', label: 'Grape' },
		{ value: 'orange', label: 'Orange' }
	];

	const sizeOptions: ComboBoxItem[] = [
		{ value: 'sm', label: 'Small' },
		{ value: 'md', label: 'Medium' },
		{ value: 'lg', label: 'Large' },
		{ value: 'xl', label: 'Extra Large' }
	];

	const planOptions: ComboBoxItem[] = [
		{ value: 'free', label: 'Free' },
		{ value: 'pro', label: 'Pro' },
		{ value: 'enterprise', label: 'Enterprise' }
	];
</script>

<h1>RadioGroup</h1>
<p>Radio button group for selecting a single option from a list of choices.</p>

<Paper title="Basic Usage">
	<div class="form-grid">
		<RadioGroup
			label="Favorite Fruit"
			options={fruitOptions}
			bind:value={selectedFruit}
		/>
		<div class="value-display">Selected: {selectedFruit ?? 'none'}</div>
	</div>
</Paper>

<Paper title="With Default Value">
	<div class="form-grid">
		<RadioGroup
			label="Size"
			options={sizeOptions}
			bind:value={selectedSize}
		/>
		<div class="value-display">Selected: {selectedSize ?? 'none'}</div>
	</div>
</Paper>

<Paper title="Required">
	<div class="form-grid">
		<RadioGroup
			label="Subscription Plan"
			options={planOptions}
			bind:value={requiredValue}
			required
		/>
		<div class="value-display">Selected: {requiredValue ?? 'none'}</div>
	</div>
</Paper>

<Paper title="Disabled">
	<div class="form-grid">
		<RadioGroup
			label="Disabled Group"
			options={fruitOptions}
			disabled
		/>
	</div>
</Paper>

<Paper title="Error State">
	<div class="form-grid">
		<RadioGroup
			label="With Error"
			options={planOptions}
			bind:value={errorValue}
			showError
			errorText="Please select a plan"
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
				<td>Label text for the radio group (required)</td>
			</tr>
			<tr>
				<td><code>options</code></td>
				<td><code>ComboBoxItem[]</code></td>
				<td>-</td>
				<td>Array of radio options (required)</td>
			</tr>
			<tr>
				<td><code>value</code></td>
				<td><code>string</code></td>
				<td><code>undefined</code></td>
				<td>Bindable selected value</td>
			</tr>
			<tr>
				<td><code>required</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Shows required indicator</td>
			</tr>
			<tr>
				<td><code>disabled</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Disables all radio buttons</td>
			</tr>
			<tr>
				<td><code>showError</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Shows error styling</td>
			</tr>
			<tr>
				<td><code>errorText</code></td>
				<td><code>string</code></td>
				<td><code>''</code></td>
				<td>Error message text</td>
			</tr>
			<tr>
				<td><code>onchange</code></td>
				<td><code>(value: string | undefined) => void</code></td>
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
