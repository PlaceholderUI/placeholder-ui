<script lang="ts">
	import { Chips, Paper, type ComboBoxItem } from '$lib/index.js';

	let singleValue = $state<string | undefined>(undefined);
	let multiValues = $state<string[]>([]);
	let noDeselectValue = $state<string | undefined>('react');
	let disabledValue = $state<string | undefined>('vue');
	let errorValue = $state<string | undefined>(undefined);

	const frameworkOptions: ComboBoxItem[] = [
		{ value: 'react', label: 'React' },
		{ value: 'vue', label: 'Vue' },
		{ value: 'svelte', label: 'Svelte' },
		{ value: 'angular', label: 'Angular' },
		{ value: 'solid', label: 'Solid' }
	];

	const sizeOptions: ComboBoxItem[] = [
		{ value: 'xs', label: 'XS' },
		{ value: 'sm', label: 'Small' },
		{ value: 'md', label: 'Medium' },
		{ value: 'lg', label: 'Large' },
		{ value: 'xl', label: 'XL' }
	];

	const colorOptions: ComboBoxItem[] = [
		{ value: 'red', label: 'Red' },
		{ value: 'green', label: 'Green' },
		{ value: 'blue', label: 'Blue' },
		{ value: 'yellow', label: 'Yellow' },
		{ value: 'purple', label: 'Purple' }
	];
</script>

<h1>Chips</h1>
<p>Chip-based selection for choosing one or multiple values from a set of options.</p>

<Paper title="Single Select">
	<div class="form-grid">
		<Chips label="Favorite Framework" options={frameworkOptions} bind:value={singleValue} />
		<div class="value-display">Selected: {singleValue ?? 'none'}</div>
	</div>
</Paper>

<Paper title="Multiple Select">
	<div class="form-grid">
		<Chips label="Preferred Sizes" options={sizeOptions} multiple bind:values={multiValues} />
		<div class="value-display">Selected: [{multiValues.join(', ')}]</div>
	</div>
</Paper>

<Paper title="Non-deselectable">
	<div class="form-grid">
		<Chips
			label="Pick One (cannot deselect)"
			options={frameworkOptions}
			bind:value={noDeselectValue}
			deselectable={false}
		/>
		<div class="value-display">Selected: {noDeselectValue ?? 'none'}</div>
	</div>
</Paper>

<Paper title="Disabled">
	<div class="form-grid">
		<Chips label="Locked Choice" options={frameworkOptions} bind:value={disabledValue} disabled />
	</div>
</Paper>

<Paper title="With Error">
	<div class="form-grid">
		<Chips
			label="Required Selection"
			options={colorOptions}
			bind:value={errorValue}
			required
			showError={errorValue === undefined}
			errorText="Please select at least one option"
		/>
		<div class="value-display">Selected: {errorValue ?? 'none'}</div>
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
				<td><code>required</code></td>
				<td>Label text above chips</td>
			</tr>
			<tr>
				<td><code>options</code></td>
				<td><code>ComboBoxItem[]</code></td>
				<td><code>required</code></td>
				<td>Array of chip options</td>
			</tr>
			<tr>
				<td><code>value</code></td>
				<td><code>string | undefined</code></td>
				<td><code>undefined</code></td>
				<td>Bindable selected value (single mode)</td>
			</tr>
			<tr>
				<td><code>values</code></td>
				<td><code>string[]</code></td>
				<td><code>[]</code></td>
				<td>Bindable selected values (multiple mode)</td>
			</tr>
			<tr>
				<td><code>multiple</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Allows multiple selections</td>
			</tr>
			<tr>
				<td><code>deselectable</code></td>
				<td><code>boolean</code></td>
				<td><code>true</code></td>
				<td>Allows deselecting a selected chip</td>
			</tr>
			<tr>
				<td><code>disabled</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Disables all chips</td>
			</tr>
			<tr>
				<td><code>required</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Shows required indicator</td>
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
				<td><code>(e: string | string[] | undefined) =&gt; void</code></td>
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
