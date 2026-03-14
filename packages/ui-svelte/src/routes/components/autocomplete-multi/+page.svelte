<script lang="ts">
	import { Table, AutocompleteMulti, Paper, type ComboBoxItem } from '$lib/index.js';
	import type { Column } from '$lib/index.js';

	let multiValues = $state<string[]>([]);
	let multiCreateValues = $state<string[]>([]);

	const fruitOptions: ComboBoxItem[] = [
		{ value: 'apple', label: 'Apple' },
		{ value: 'banana', label: 'Banana' },
		{ value: 'cherry', label: 'Cherry' },
		{ value: 'date', label: 'Date' },
		{ value: 'elderberry', label: 'Elderberry' },
		{ value: 'fig', label: 'Fig' },
		{ value: 'grape', label: 'Grape' },
		{ value: 'honeydew', label: 'Honeydew' }
	];

	const cityOptions: ComboBoxItem[] = [
		{ value: 'new-york', label: 'New York' },
		{ value: 'los-angeles', label: 'Los Angeles' },
		{ value: 'chicago', label: 'Chicago' },
		{ value: 'houston', label: 'Houston' },
		{ value: 'phoenix', label: 'Phoenix' },
		{ value: 'san-francisco', label: 'San Francisco' },
		{ value: 'seattle', label: 'Seattle' },
		{ value: 'boston', label: 'Boston' }
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
		{ prop: 'rawValues', type: 'ComboBoxItem[]', default: '[]', description: 'Bindable array of selected items' },
		{ prop: 'label', type: 'string', default: 'undefined', description: 'Label text above input' },
		{ prop: 'placeholder', type: 'string', default: '\'Start typing to search...\'', description: 'Placeholder text' },
		{ prop: 'options', type: 'ComboBoxItem[]', default: '[]', description: 'Array of autocomplete options' },
		{ prop: 'allowCreate', type: 'boolean', default: 'false', description: 'Allows creating new options not in the list' },
		{ prop: 'showNoResultsMessage', type: 'boolean', default: 'false', description: 'Shows a "no results" message when no options match' },
		{ prop: 'disabled', type: 'boolean', default: 'false', description: 'Disables the input' },
		{ prop: 'onchange', type: '(e: string[]) => void', default: 'undefined', description: 'Called when selected values change' },
		{ prop: 'onchangeRaw', type: '(e: ComboBoxItem[]) => void', default: 'undefined', description: 'Called with full ComboBoxItem objects on change' },
		{ prop: 'onCreate', type: '(value: string) => void', default: 'undefined', description: 'Called when a new option is created (allowCreate)' },
	];
</script>

<h1>AutocompleteMulti</h1>
<p>Multi-select text input with autocomplete suggestions. Selected values appear as badges.</p>

<div class="vstack">
	<Paper title="Basic Usage">
		<div class="form-grid">
			<AutocompleteMulti
				label="Favorite Fruits"
				bind:values={multiValues}
				options={fruitOptions}
				placeholder="Start typing to add fruits..."
			/>
			<div class="value-display">Values: {JSON.stringify(multiValues)}</div>
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
	.value-display { font-size: 0.875rem; color: var(--pui-color-text-muted); font-family: monospace; margin-top: 0.5rem; }
</style>
