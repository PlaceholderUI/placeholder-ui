<script lang="ts">
	import { Table, RadioGroup, Paper, type ComboBoxItem } from '$lib/index.js';
	import type { Column } from '$lib/index.js';

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
		{ prop: 'label', type: 'string', default: '-', description: 'Label text for the radio group (required)' },
		{ prop: 'options', type: 'ComboBoxItem[]', default: '-', description: 'Array of radio options (required)' },
		{ prop: 'value', type: 'string', default: 'undefined', description: 'Bindable selected value' },
		{ prop: 'required', type: 'boolean', default: 'false', description: 'Shows required indicator' },
		{ prop: 'disabled', type: 'boolean', default: 'false', description: 'Disables all radio buttons' },
		{ prop: 'showError', type: 'boolean', default: 'false', description: 'Shows error styling' },
		{ prop: 'errorText', type: 'string', default: '\'\'', description: 'Error message text' },
		{ prop: 'onchange', type: '(value: string | undefined) => void', default: 'undefined', description: 'Called when selection changes' },
	];
</script>

<h1>RadioGroup</h1>
<p>Radio button group for selecting a single option from a list of choices.</p>

<div class="vstack">
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
		<Table columns={propsColumns} rows={propsRows} striped hover={false} />
	</Paper>
</div>

<style>
	h1 { margin-bottom: 0.5rem; }
	p { color: var(--pui-color-text-secondary); margin-bottom: 1.5rem; }
	.form-grid { display: flex; flex-direction: column; gap: 1rem; max-width: 400px; }
	.value-display { font-size: 0.875rem; color: var(--pui-color-text-muted); font-family: monospace; margin-top: 0.5rem; }</style>
