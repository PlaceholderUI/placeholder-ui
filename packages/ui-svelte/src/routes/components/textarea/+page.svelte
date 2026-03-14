<script lang="ts">
	import { Table, TextArea, Paper } from '$lib/index.js';
	import type { Column } from '$lib/index.js';

	let basicValue = $state('');
	let requiredValue = $state('');
	let disabledValue = $state('This content cannot be edited.');
	let tooltipValue = $state('');

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
		{ prop: 'value', type: 'string', default: '\'\'', description: 'Bindable text value' },
		{ prop: 'label', type: 'string', default: '\'\'', description: 'Label text above textarea' },
		{ prop: 'placeholder', type: 'string', default: 'undefined', description: 'Placeholder text' },
		{ prop: 'required', type: 'boolean', default: 'false', description: 'Shows required indicator' },
		{ prop: 'disabled', type: 'boolean', default: 'false', description: 'Disables the textarea' },
		{ prop: 'tooltipText', type: 'string', default: 'undefined', description: 'Tooltip hint text' },
		{ prop: 'noAutocomplete', type: 'boolean', default: 'false', description: 'Disables browser autocomplete' },
	];
</script>

<h1>TextArea</h1>
<p>Multi-line text input for longer content such as descriptions, comments, and notes.</p>

<div class="vstack">
	<Paper title="Basic Usage">
		<div class="form-grid">
			<TextArea label="Description" bind:value={basicValue} placeholder="Enter a description..." />
			<div class="value-display">Value: "{basicValue}"</div>
			<div class="value-display">Length: {basicValue.length} characters</div>
		</div>
	</Paper>

	<Paper title="Required">
		<div class="form-grid">
			<TextArea label="Feedback" bind:value={requiredValue} placeholder="Please provide your feedback" required />
		</div>
	</Paper>

	<Paper title="Disabled">
		<div class="form-grid">
			<TextArea label="Read Only Notes" bind:value={disabledValue} disabled />
		</div>
	</Paper>

	<Paper title="With Tooltip">
		<div class="form-grid">
			<TextArea
				label="Bio"
				bind:value={tooltipValue}
				placeholder="Tell us about yourself..."
				tooltipText="Write a short bio that will appear on your public profile"
			/>
		</div>
	</Paper>

	<Paper title="No Autocomplete">
		<div class="form-grid">
			<TextArea
				label="Sensitive Notes"
				placeholder="Enter private notes..."
				noAutocomplete
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
