<script lang="ts">
	import { SelectMulti, Paper, type ComboBoxItem, type ComboBoxGroup } from '$lib/index.js';

	let selectedValues = $state<string[]>([]);
	let searchableValues = $state<string[]>([]);
	let groupedValues = $state<string[]>([]);
	let requiredValues = $state<string[]>([]);
	let errorValues = $state<string[]>([]);

	const fruitOptions: ComboBoxItem[] = [
		{ value: 'apple', label: 'Apple' },
		{ value: 'banana', label: 'Banana' },
		{ value: 'cherry', label: 'Cherry' },
		{ value: 'grape', label: 'Grape' },
		{ value: 'orange', label: 'Orange' }
	];

	const countryOptions: ComboBoxItem[] = [
		{ value: 'us', label: 'United States' },
		{ value: 'uk', label: 'United Kingdom' },
		{ value: 'ca', label: 'Canada' },
		{ value: 'au', label: 'Australia' },
		{ value: 'de', label: 'Germany' },
		{ value: 'fr', label: 'France' },
		{ value: 'jp', label: 'Japan' }
	];

	const groupedOptions: ComboBoxGroup[] = [
		{
			label: 'Fruits',
			items: [
				{ value: 'apple', label: 'Apple' },
				{ value: 'banana', label: 'Banana' },
				{ value: 'cherry', label: 'Cherry' }
			]
		},
		{
			label: 'Vegetables',
			items: [
				{ value: 'carrot', label: 'Carrot' },
				{ value: 'broccoli', label: 'Broccoli' },
				{ value: 'spinach', label: 'Spinach' }
			]
		}
	];
</script>

<h1>SelectMulti</h1>
<p>Multi-select dropdown component for choosing multiple options from a list.</p>

<Paper title="Basic Usage">
	<div class="form-grid">
		<SelectMulti
			label="Favorite Fruits"
			options={fruitOptions}
			bind:values={selectedValues}
			placeholder="Select fruits..."
		/>
		<div class="value-display">Selected: {selectedValues.length > 0 ? selectedValues.join(', ') : 'none'}</div>
	</div>
</Paper>

<Paper title="Searchable">
	<div class="form-grid">
		<SelectMulti
			label="Countries"
			options={countryOptions}
			bind:values={searchableValues}
			placeholder="Search countries..."
			allowSearch
		/>
		<div class="value-display">Selected: {searchableValues.length > 0 ? searchableValues.join(', ') : 'none'}</div>
	</div>
</Paper>

<Paper title="Grouped Options">
	<div class="form-grid">
		<SelectMulti
			label="Food Category"
			{groupedOptions}
			bind:values={groupedValues}
			placeholder="Select food items..."
		/>
		<div class="value-display">Selected: {groupedValues.length > 0 ? groupedValues.join(', ') : 'none'}</div>
	</div>
</Paper>

<Paper title="Required">
	<div class="form-grid">
		<SelectMulti
			label="Required Field"
			options={fruitOptions}
			bind:values={requiredValues}
			placeholder="Select at least one..."
			required
		/>
	</div>
</Paper>

<Paper title="Error State">
	<div class="form-grid">
		<SelectMulti
			label="With Error"
			options={fruitOptions}
			bind:values={errorValues}
			placeholder="Select..."
			showError
			errorText="Please select at least one option"
		/>
	</div>
</Paper>

<Paper title="Disabled">
	<div class="form-grid">
		<SelectMulti
			label="Disabled"
			options={fruitOptions}
			placeholder="Cannot select"
			disabled
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
				<td><code>values</code></td>
				<td><code>string[]</code></td>
				<td><code>[]</code></td>
				<td>Bindable array of selected values</td>
			</tr>
			<tr>
				<td><code>rawValues</code></td>
				<td><code>ComboBoxItem[]</code></td>
				<td><code>[]</code></td>
				<td>Bindable array of selected items with full data</td>
			</tr>
			<tr>
				<td><code>label</code></td>
				<td><code>string</code></td>
				<td><code>''</code></td>
				<td>Label text above the select</td>
			</tr>
			<tr>
				<td><code>placeholder</code></td>
				<td><code>string</code></td>
				<td><code>'\u00a0'</code></td>
				<td>Placeholder text when empty</td>
			</tr>
			<tr>
				<td><code>options</code></td>
				<td><code>ComboBoxItem[]</code></td>
				<td><code>[]</code></td>
				<td>Flat array of options</td>
			</tr>
			<tr>
				<td><code>groupedOptions</code></td>
				<td><code>ComboBoxGroup[]</code></td>
				<td><code>[]</code></td>
				<td>Grouped options array</td>
			</tr>
			<tr>
				<td><code>allowSearch</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Enable search/filter input</td>
			</tr>
			<tr>
				<td><code>closeOnSelection</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Close dropdown after each selection</td>
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
				<td>Disables the select</td>
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
				<td><code>(values: string[]) => void</code></td>
				<td><code>undefined</code></td>
				<td>Called when selection changes</td>
			</tr>
			<tr>
				<td><code>onchangeRaw</code></td>
				<td><code>(items: ComboBoxItem[]) => void</code></td>
				<td><code>undefined</code></td>
				<td>Called with full item objects on change</td>
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
