<script lang="ts">
	import { Table, Select, Paper, type ComboBoxItem } from '$lib/index.js';
	import type { Column } from '$lib/index.js';

	let selectedValue = $state<string | undefined>(undefined);
	let searchableValue = $state<string | undefined>(undefined);

	const fruitOptions: ComboBoxItem[] = [
		{ value: 'apple', label: 'Apple' },
		{ value: 'banana', label: 'Banana' },
		{ value: 'cherry', label: 'Cherry' },
		{ value: 'date', label: 'Date' },
		{ value: 'elderberry', label: 'Elderberry' }
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

	const groupedOptions = [
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
		{ prop: 'value', type: 'string', default: 'undefined', description: 'Bindable selected value' },
		{ prop: 'label', type: 'string', default: '\'\'', description: 'Label text above select' },
		{ prop: 'placeholder', type: 'string', default: '\'\\u00a0\'', description: 'Placeholder text when empty' },
		{ prop: 'options', type: 'ComboBoxItem[]', default: '[]', description: 'Array of options' },
		{ prop: 'groupedOptions', type: 'ComboBoxGroup[]', default: '[]', description: 'Grouped options array' },
		{ prop: 'allowSearch', type: 'boolean', default: 'false', description: 'Enable search filtering' },
		{ prop: 'required', type: 'boolean', default: 'false', description: 'Shows required indicator' },
		{ prop: 'disabled', type: 'boolean', default: 'false', description: 'Disables the select' },
		{ prop: 'showError', type: 'boolean', default: 'false', description: 'Shows error styling' },
		{ prop: 'errorText', type: 'string', default: '\'\'', description: 'Error message text' },
		{ prop: 'onchange', type: '(value: string) => void', default: 'undefined', description: 'Called when selection changes' },
	];
</script>

<h1>Select</h1>
<p>Dropdown select component for choosing from a list of options.</p>

<div class="vstack">
	<Paper title="Basic Usage">
		<div class="form-grid">
			<Select
				label="Favorite Fruit"
				options={fruitOptions}
				bind:value={selectedValue}
				placeholder="Select a fruit..."
			/>
			<p class="value-display">Selected: {selectedValue ?? 'none'}</p>
		</div>
	</Paper>

	<Paper title="Searchable">
		<div class="form-grid">
			<Select
				label="Country"
				options={countryOptions}
				bind:value={searchableValue}
				placeholder="Search countries..."
				allowSearch
			/>
		</div>
	</Paper>

	<Paper title="Grouped Options">
		<div class="form-grid">
			<Select
				label="Food Category"
				{groupedOptions}
				placeholder="Select food..."
			/>
		</div>
	</Paper>

	<Paper title="Required">
		<div class="form-grid">
			<Select label="Required Field" options={fruitOptions} placeholder="Select..." required />
		</div>
	</Paper>

	<Paper title="With Error">
		<div class="form-grid">
			<Select
				label="With Error"
				options={fruitOptions}
				placeholder="Select..."
				showError
				errorText="This field is required"
			/>
		</div>
	</Paper>

	<Paper title="Disabled">
		<div class="form-grid">
			<Select label="Disabled" options={fruitOptions} placeholder="Cannot select" disabled />
		</div>
	</Paper>

	<Paper title="With Tooltip">
		<div class="form-grid">
			<Select
				label="With Tooltip"
				options={fruitOptions}
				placeholder="Select..."
				tooltipText="Choose your preferred option from the list"
			/>
		</div>
	</Paper>

	<Paper title="Props">
		<Table columns={propsColumns} rows={propsRows} striped hover={false} />
	</Paper>
</div>

<style>
	h1 {
		margin-bottom: 0.5rem;
	}

	p {
		color: var(--pui-color-text-secondary);
		margin-bottom: 1.5rem;
	}

	.form-grid {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		max-width: 400px;
	}

	.value-display {
		font-size: 0.875rem;
		color: var(--pui-color-text-muted);
		font-family: monospace;
	}</style>
