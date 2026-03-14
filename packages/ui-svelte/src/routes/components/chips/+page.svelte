<script lang="ts">
	import { Table, Chips, Paper, type ComboBoxItem } from '$lib/index.js';
	import type { Column } from '$lib/index.js';

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
		{ prop: 'label', type: 'string', default: 'required', description: 'Label text above chips' },
		{ prop: 'options', type: 'ComboBoxItem[]', default: 'required', description: 'Array of chip options' },
		{ prop: 'value', type: 'string | undefined', default: 'undefined', description: 'Bindable selected value (single mode)' },
		{ prop: 'values', type: 'string[]', default: '[]', description: 'Bindable selected values (multiple mode)' },
		{ prop: 'multiple', type: 'boolean', default: 'false', description: 'Allows multiple selections' },
		{ prop: 'deselectable', type: 'boolean', default: 'true', description: 'Allows deselecting a selected chip' },
		{ prop: 'disabled', type: 'boolean', default: 'false', description: 'Disables all chips' },
		{ prop: 'required', type: 'boolean', default: 'false', description: 'Shows required indicator' },
		{ prop: 'showError', type: 'boolean', default: 'false', description: 'Shows error styling' },
		{ prop: 'errorText', type: 'string', default: '\'\'', description: 'Error message text' },
		{ prop: 'onchange', type: '(e: string | string[] | undefined) => void', default: 'undefined', description: 'Called when selection changes' },
	];
</script>

<h1>Chips</h1>
<p>Chip-based selection for choosing one or multiple values from a set of options.</p>

<div class="vstack">
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
		<Table columns={propsColumns} rows={propsRows} striped hover={false} />
	</Paper>
</div>

<style>
	h1 { margin-bottom: 0.5rem; }
	p { color: var(--pui-color-text-secondary); margin-bottom: 1.5rem; }
	.form-grid { display: flex; flex-direction: column; gap: 1rem; max-width: 400px; }
	.value-display { font-size: 0.875rem; color: var(--pui-color-text-muted); font-family: monospace; margin-top: 0.5rem; }</style>
