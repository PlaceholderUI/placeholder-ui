<script lang="ts">
	import { Table, FormGroup, Textbox, Paper } from '$lib/index.js';
	import type { Column } from '$lib/index.js';

	let basicValue = $state('');
	let tooltipValue = $state('');
	let errorValue = $state('');
	let requiredValue = $state('');

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
		{ prop: 'label', type: 'string', default: 'required', description: 'Label text displayed above the form element' },
		{ prop: 'required', type: 'boolean', default: 'false', description: 'Shows a required asterisk next to the label' },
		{ prop: 'id', type: 'string', default: 'undefined', description: 'for' },
		{ prop: 'class', type: 'string', default: '\'\'', description: 'Additional CSS classes' },
		{ prop: 'showError', type: 'boolean', default: 'false', description: 'Shows error text below the form element' },
		{ prop: 'errorText', type: 'string', default: '\'\'', description: 'Error message text' },
		{ prop: 'tooltipText', type: 'string', default: 'undefined', description: 'Simple text tooltip shown on info icon hover' },
		{ prop: 'tooltipContent', type: 'Snippet', default: 'undefined', description: 'Custom tooltip content as a Svelte snippet' },
		{ prop: 'children', type: 'Snippet', default: 'required', description: 'The form element(s) to wrap' },
	];
</script>

<h1>FormGroup</h1>
<p>Wrapper component that provides a label, required indicator, tooltip, and error display for form elements.</p>

<div class="vstack">
	<Paper title="Basic Usage">
		<div class="form-grid">
			<FormGroup label="Username">
				{#snippet children()}
					<Textbox bind:value={basicValue} placeholder="Enter username" />
				{/snippet}
			</FormGroup>
			<div class="value-display">Value: "{basicValue}"</div>
		</div>
	</Paper>

	<Paper title="With Tooltip">
		<div class="form-grid">
			<FormGroup label="API Key" tooltipText="Find your API key in the dashboard settings page">
				{#snippet children()}
					<Textbox bind:value={tooltipValue} placeholder="Enter your API key" />
				{/snippet}
			</FormGroup>
		</div>
	</Paper>

	<Paper title="With Error">
		<div class="form-grid">
			<FormGroup
				label="Email"
				showError={errorValue.length > 0 && !errorValue.includes('@')}
				errorText="Please enter a valid email address"
			>
				{#snippet children()}
					<Textbox bind:value={errorValue} placeholder="you@example.com" />
				{/snippet}
			</FormGroup>
			<div class="value-display">Value: "{errorValue}"</div>
		</div>
	</Paper>

	<Paper title="Required">
		<div class="form-grid">
			<FormGroup label="Full Name" required>
				{#snippet children()}
					<Textbox bind:value={requiredValue} placeholder="Enter your full name" />
				{/snippet}
			</FormGroup>
		</div>
	</Paper>

	<Paper title="With Custom Input">
		<div class="form-grid">
			<FormGroup label="Custom Range" tooltipText="Drag to adjust the value">
				{#snippet children()}
					<input type="range" min="0" max="100" style="width: 100%;" />
				{/snippet}
			</FormGroup>
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
