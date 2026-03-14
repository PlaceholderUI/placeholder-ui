<script lang="ts">
	import { Table, SelectMulti, Paper, type ComboBoxItem, type ComboBoxGroup } from '$lib/index.js';
	import type { Column } from '$lib/index.js';

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
		{ prop: 'values', type: 'string[]', default: '[]', description: 'Bindable array of selected values' },
		{ prop: 'rawValues', type: 'ComboBoxItem[]', default: '[]', description: 'Bindable array of selected items with full data' },
		{ prop: 'label', type: 'string', default: '\'\'', description: 'Label text above the select' },
		{ prop: 'placeholder', type: 'string', default: '\'\\u00a0\'', description: 'Placeholder text when empty' },
		{ prop: 'options', type: 'ComboBoxItem[]', default: '[]', description: 'Flat array of options' },
		{ prop: 'groupedOptions', type: 'ComboBoxGroup[]', default: '[]', description: 'Grouped options array' },
		{ prop: 'allowSearch', type: 'boolean', default: 'false', description: 'Enable search/filter input' },
		{ prop: 'closeOnSelection', type: 'boolean', default: 'false', description: 'Close dropdown after each selection' },
		{ prop: 'required', type: 'boolean', default: 'false', description: 'Shows required indicator' },
		{ prop: 'disabled', type: 'boolean', default: 'false', description: 'Disables the select' },
		{ prop: 'showError', type: 'boolean', default: 'false', description: 'Shows error styling' },
		{ prop: 'errorText', type: 'string', default: '\'\'', description: 'Error message text' },
		{ prop: 'onchange', type: '(values: string[]) => void', default: 'undefined', description: 'Called when selection changes' },
		{ prop: 'onchangeRaw', type: '(items: ComboBoxItem[]) => void', default: 'undefined', description: 'Called with full item objects on change' },
	];
</script>

<h1>SelectMulti</h1>
<p>Multi-select dropdown component for choosing multiple options from a list.</p>

<div class="vstack">
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
		<Table columns={propsColumns} rows={propsRows} striped hover={false} />
	</Paper>
</div>

<style>
	h1 { margin-bottom: 0.5rem; }
	p { color: var(--pui-color-text-secondary); margin-bottom: 1.5rem; }
	.form-grid { display: flex; flex-direction: column; gap: 1rem; max-width: 400px; }
	.value-display { font-size: 0.875rem; color: var(--pui-color-text-muted); font-family: monospace; margin-top: 0.5rem; }</style>
