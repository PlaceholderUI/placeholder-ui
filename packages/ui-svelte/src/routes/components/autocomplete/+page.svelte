<script lang="ts">
	import { Table, Autocomplete, Paper, iconSearch, type ComboBoxItem } from '$lib/index.js';
	import type { Column } from '$lib/index.js';

	let basicValue = $state('');
	let iconValue = $state('');
	let customValue = $state('');

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
		{ prop: 'value', type: 'string', default: '\'\'', description: 'Bindable input value' },
		{ prop: 'label', type: 'string', default: 'undefined', description: 'Label text above input' },
		{ prop: 'placeholder', type: 'string', default: '\'Start typing to search...\'', description: 'Placeholder text' },
		{ prop: 'options', type: 'ComboBoxItem[]', default: 'undefined', description: 'Array of autocomplete options' },
		{ prop: 'hideNoResults', type: 'boolean', default: 'false', description: 'Hides the "no results" dropdown message' },
		{ prop: 'showRequired', type: 'boolean', default: 'false', description: 'Shows required indicator' },
		{ prop: 'leftIconSvg', type: 'string', default: 'undefined', description: 'SVG string for left icon' },
		{ prop: 'onchange', type: '(e: string) => void', default: 'undefined', description: 'Called when input value changes' },
		{ prop: 'onSelect', type: '(e: ComboBoxItem) => void', default: 'undefined', description: 'Called when an option is selected' },
	];
</script>

<h1>Autocomplete</h1>
<p>Text input with autocomplete suggestions from a list of options.</p>

<div class="vstack">
	<Paper title="Basic Usage">
		<div class="form-grid">
			<Autocomplete
				label="Favorite Fruit"
				bind:value={basicValue}
				options={fruitOptions}
				placeholder="Start typing a fruit..."
			/>
			<div class="value-display">Value: "{basicValue}"</div>
		</div>
	</Paper>

	<Paper title="With Icon">
		<div class="form-grid">
			<Autocomplete
				label="Search Cities"
				bind:value={iconValue}
				options={cityOptions}
				placeholder="Search cities..."
				leftIconSvg={iconSearch}
			/>
			<div class="value-display">Value: "{iconValue}"</div>
		</div>
	</Paper>

	<Paper title="Custom Placeholder">
		<div class="form-grid">
			<Autocomplete
				label="Food Item"
				bind:value={customValue}
				options={fruitOptions}
				placeholder="Type to find food..."
			/>
		</div>
	</Paper>

	<Paper title="Hide No Results">
		<div class="form-grid">
			<Autocomplete
				label="With Hidden No Results"
				options={fruitOptions}
				placeholder="Try typing something not in the list..."
				hideNoResults
			/>
		</div>
	</Paper>

	<Paper title="Required">
		<div class="form-grid">
			<Autocomplete
				label="Required Field"
				options={fruitOptions}
				placeholder="This is required..."
				showRequired
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
