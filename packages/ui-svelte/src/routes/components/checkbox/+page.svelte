<script lang="ts">
	import { Table, Checkbox, Paper, Button } from '$lib/index.js';
	import type { Column } from '$lib/index.js';

	let checked1 = $state(false);
	let checked2 = $state(true);
	let termsAccepted = $state(false);
	let allSelected = $state(false);

	let items = $state([
		{ label: 'Option A', checked: false },
		{ label: 'Option B', checked: true },
		{ label: 'Option C', checked: false }
	]);

	function toggleAll() {
		allSelected = !allSelected;
		items = items.map((item) => ({ ...item, checked: allSelected }));
	}

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
		{ prop: 'checked', type: 'boolean', default: 'false', description: 'Bindable checked state' },
		{ prop: 'label', type: 'string', default: 'undefined', description: 'Label text next to checkbox' },
		{ prop: 'required', type: 'boolean', default: 'false', description: 'Shows required indicator' },
		{ prop: 'disabled', type: 'boolean', default: 'false', description: 'Disables the checkbox' },
		{ prop: 'showError', type: 'boolean', default: 'false', description: 'Shows error styling' },
		{ prop: 'errorText', type: 'string', default: '\'\'', description: 'Error message text' },
		{ prop: 'inputId', type: 'string', default: 'undefined', description: 'Custom ID for the input' },
		{ prop: 'onchange', type: '(checked: boolean) => void', default: 'undefined', description: 'Called when value changes' },
	];
</script>

<h1>Checkbox</h1>
<p>Checkbox input for boolean values or multiple selections.</p>

<div class="vstack">
	<Paper title="Basic Usage">
		<div class="checkbox-grid">
			<Checkbox label="Unchecked by default" bind:checked={checked1} />
			<Checkbox label="Checked by default" bind:checked={checked2} />
		</div>
		<p class="value-display">
			checked1: {checked1}, checked2: {checked2}
		</p>
	</Paper>

	<Paper title="Required">
		<Checkbox label="I accept the terms and conditions" bind:checked={termsAccepted} required />
		<Button variant="primary" disabled={!termsAccepted} class="mt-4">Submit</Button>
	</Paper>

	<Paper title="With Error State">
		<Checkbox
			label="This field has an error"
			showError
			errorText="You must check this box to continue"
		/>
	</Paper>

	<Paper title="Disabled States">
		<div class="checkbox-grid">
			<Checkbox label="Disabled unchecked" disabled />
			<Checkbox label="Disabled checked" checked disabled />
		</div>
	</Paper>

	<Paper title="Multiple Checkboxes">
		<div class="checkbox-grid">
			<Checkbox label="Select All" checked={allSelected} onchange={toggleAll} />
			<div class="divider"></div>
			{#each items as item}
				<Checkbox label={item.label} bind:checked={item.checked} />
			{/each}
		</div>
		<p class="value-display">
			Selected: {items
				.filter((i) => i.checked)
				.map((i) => i.label)
				.join(', ') || 'none'}
		</p>
	</Paper>

	<Paper title="With Change Handler">
		<Checkbox
			label="Click me to trigger handler"
			onchange={(checked) => {
				alert(`Checkbox is now: ${checked ? 'checked' : 'unchecked'}`);
			}}
		/>
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

	.checkbox-grid {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.divider {
		height: 1px;
		background: var(--pui-color-border);
		margin: 0.5rem 0;
	}

	.value-display {
		font-size: 0.875rem;
		color: var(--pui-color-text-muted);
		font-family: monospace;
		margin-top: 1rem;
	}

	:global(.mt-4) {
		margin-top: 1rem;
	}</style>
