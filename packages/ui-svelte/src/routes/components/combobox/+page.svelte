<script lang="ts">
	import { Table, Paper, ComboBoxItemBuilder, type ComboBoxItem } from '$lib/index.js';
	import type { Column } from '$lib/index.js';

	let items = $state<ComboBoxItem[]>([
		{ value: 'apple', label: 'Apple' },
		{ value: 'banana', label: 'Banana' }
	]);
	let defaultValues = $state<string[]>(['apple']);

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
		{ prop: 'label', type: 'string', default: '\'\'', description: 'Label for the builder form' },
		{ prop: 'items', type: 'ComboBoxItem[]', default: '[]', description: 'Bindable array of items to build' },
		{ prop: 'defaultValues', type: 'string[]', default: '[]', description: 'Bindable array of default selected values' },
		{ prop: 'labelPlaceholder', type: 'string', default: '\'Label\'', description: 'Placeholder for the label input' },
		{ prop: 'valuePlaceholder', type: 'string', default: '\'Value\'', description: 'Placeholder for the value input' },
		{ prop: 'onchange', type: '(items, defaults) => void', default: 'undefined', description: 'Called when items or defaults change' },
	];
</script>

<h1>ComboBox</h1>
<p>ComboBox is the internal dropdown engine that powers the Select, Autocomplete, SelectMulti, and ComboBoxMulti components. It is not exported directly — use Select or Autocomplete for single-select, and SelectMulti for multi-select.</p>

<div class="vstack">
	<Paper title="Overview">
		<p class="info-text">
			The ComboBox component handles the dropdown panel, keyboard navigation, filtering, and option rendering logic shared across all select-style components. You do not use ComboBox directly.
		</p>
		<p class="info-text">
			The <strong>ComboBoxItemBuilder</strong> component is exported and provides a form UI for building and editing arrays of label/value pairs (ComboBoxItem[]).
		</p>
	</Paper>

	<Paper title="ComboBoxItemBuilder">
		<p class="info-text">Use ComboBoxItemBuilder to let users create and manage a list of options:</p>
		<div class="form-grid">
			<ComboBoxItemBuilder label="Options" bind:items bind:defaultValues />
			<div class="value-display">Items: {JSON.stringify(items.map(i => i.label))}</div>
			<div class="value-display">Defaults: {JSON.stringify(defaultValues)}</div>
		</div>
	</Paper>

	<Paper title="Related Components">
		<ul class="related-list">
			<li><strong>Select</strong> — Single-value dropdown using ComboBox internally</li>
			<li><strong>Autocomplete</strong> — Searchable single-value using ComboBox internally</li>
			<li><strong>SelectMulti</strong> — Multi-value dropdown using ComboBoxMulti internally</li>
		</ul>
	</Paper>

	<Paper title="Props (ComboBoxItemBuilder)">
		<Table columns={propsColumns} rows={propsRows} striped hover={false} />
	</Paper>
</div>

<style>
	h1 { margin-bottom: 0.5rem; }
	p { color: var(--pui-color-text-secondary); margin-bottom: 1.5rem; }
	.form-grid { display: flex; flex-direction: column; gap: 1rem; max-width: 500px; }
	.value-display { font-size: 0.875rem; color: var(--pui-color-text-muted); font-family: monospace; margin-top: 0.5rem; }.info-text { color: var(--pui-color-text-secondary); line-height: 1.6; margin-bottom: 0.75rem; }
	.related-list { padding-left: 1.5rem; color: var(--pui-color-text-secondary); line-height: 2; }
</style>
