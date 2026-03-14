<script lang="ts">
	import { Table, Number, Paper, iconCreditCard } from '$lib/index.js';
	import type { Column } from '$lib/index.js';

	let basicValue = $state<number | undefined>(undefined);
	let rangeValue = $state<number | undefined>(25);
	let iconValue = $state<number | undefined>(undefined);
	let errorValue = $state<number | undefined>(undefined);
	let disabledValue = $state<number | undefined>(42);

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
		{ prop: 'value', type: 'number | undefined', default: 'undefined', description: 'Bindable numeric value' },
		{ prop: 'label', type: 'string', default: '\'\'', description: 'Label text above input' },
		{ prop: 'placeholder', type: 'string', default: 'undefined', description: 'Placeholder text' },
		{ prop: 'min', type: 'number', default: 'undefined', description: 'Minimum allowed value' },
		{ prop: 'max', type: 'number', default: 'undefined', description: 'Maximum allowed value' },
		{ prop: 'step', type: 'number', default: 'undefined', description: 'Step increment' },
		{ prop: 'required', type: 'boolean', default: 'false', description: 'Shows required indicator' },
		{ prop: 'disabled', type: 'boolean', default: 'false', description: 'Disables the input' },
		{ prop: 'loading', type: 'boolean', default: 'false', description: 'Shows loading spinner' },
		{ prop: 'leftIconSvg', type: 'string', default: 'undefined', description: 'SVG string for left icon' },
		{ prop: 'showError', type: 'boolean', default: 'false', description: 'Shows error styling' },
		{ prop: 'errorText', type: 'string', default: '\'\'', description: 'Error message text' },
		{ prop: 'tooltipText', type: 'string', default: 'undefined', description: 'Tooltip hint text' },
		{ prop: 'onenter', type: '(v: number) => void', default: 'undefined', description: 'Called when Enter is pressed' },
		{ prop: 'onchange', type: '(e: Event) => void', default: 'undefined', description: 'Change event handler' },
	];
</script>

<h1>Number</h1>
<p>Numeric input with optional min/max constraints, step control, and icon support.</p>

<div class="vstack">
	<Paper title="Basic Usage">
		<div class="form-grid">
			<Number label="Quantity" bind:value={basicValue} placeholder="Enter a number" />
			<div class="value-display">Value: {basicValue ?? 'undefined'}</div>
		</div>
	</Paper>

	<Paper title="Min / Max / Step">
		<div class="form-grid">
			<Number
				label="Quantity (0-100, step 5)"
				bind:value={rangeValue}
				min={0}
				max={100}
				step={5}
				placeholder="0 to 100"
			/>
			<div class="value-display">Value: {rangeValue ?? 'undefined'}</div>
		</div>
	</Paper>

	<Paper title="With Icon">
		<div class="form-grid">
			<Number
				label="Price"
				bind:value={iconValue}
				placeholder="0.00"
				leftIconSvg={iconCreditCard}
				step={0.01}
			/>
		</div>
	</Paper>

	<Paper title="Required">
		<div class="form-grid">
			<Number label="Age" placeholder="Enter your age" required />
		</div>
	</Paper>

	<Paper title="Error State">
		<div class="form-grid">
			<Number
				label="Score"
				bind:value={errorValue}
				placeholder="Enter score"
				showError={errorValue !== undefined && (errorValue < 0 || errorValue > 100)}
				errorText="Score must be between 0 and 100"
			/>
			<div class="value-display">Value: {errorValue ?? 'undefined'}</div>
		</div>
	</Paper>

	<Paper title="Disabled">
		<div class="form-grid">
			<Number label="Read Only Value" bind:value={disabledValue} disabled />
		</div>
	</Paper>

	<Paper title="Loading State">
		<div class="form-grid">
			<Number label="Loading" placeholder="Fetching..." loading />
		</div>
	</Paper>

	<Paper title="With Min/Max">
		<div class="form-grid">
			<Number
				label="Threads"
				placeholder="1-16"
				min={1}
				max={16}
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
