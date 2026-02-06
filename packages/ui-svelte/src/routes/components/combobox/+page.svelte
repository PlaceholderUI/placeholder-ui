<script lang="ts">
	import { Paper, ComboBoxItemBuilder, type ComboBoxItem } from '$lib/index.js';

	let items = $state<ComboBoxItem[]>([
		{ value: 'apple', label: 'Apple' },
		{ value: 'banana', label: 'Banana' }
	]);
	let defaultValues = $state<string[]>(['apple']);
</script>

<h1>ComboBox</h1>
<p>ComboBox is the internal dropdown engine that powers the Select, Autocomplete, SelectMulti, and ComboBoxMulti components. It is not exported directly — use Select or Autocomplete for single-select, and SelectMulti for multi-select.</p>

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
	<table class="props-table">
		<thead>
			<tr>
				<th>Prop</th>
				<th>Type</th>
				<th>Default</th>
				<th>Description</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>label</code></td>
				<td><code>string</code></td>
				<td><code>''</code></td>
				<td>Label for the builder form</td>
			</tr>
			<tr>
				<td><code>items</code></td>
				<td><code>ComboBoxItem[]</code></td>
				<td><code>[]</code></td>
				<td>Bindable array of items to build</td>
			</tr>
			<tr>
				<td><code>defaultValues</code></td>
				<td><code>string[]</code></td>
				<td><code>[]</code></td>
				<td>Bindable array of default selected values</td>
			</tr>
			<tr>
				<td><code>labelPlaceholder</code></td>
				<td><code>string</code></td>
				<td><code>'Label'</code></td>
				<td>Placeholder for the label input</td>
			</tr>
			<tr>
				<td><code>valuePlaceholder</code></td>
				<td><code>string</code></td>
				<td><code>'Value'</code></td>
				<td>Placeholder for the value input</td>
			</tr>
			<tr>
				<td><code>onchange</code></td>
				<td><code>(items, defaults) => void</code></td>
				<td><code>undefined</code></td>
				<td>Called when items or defaults change</td>
			</tr>
		</tbody>
	</table>
</Paper>

<style>
	h1 { margin-bottom: 0.5rem; }
	p { color: var(--pui-color-text-secondary); margin-bottom: 1.5rem; }
	.form-grid { display: flex; flex-direction: column; gap: 1rem; max-width: 500px; }
	.value-display { font-size: 0.875rem; color: var(--pui-color-text-muted); font-family: monospace; margin-top: 0.5rem; }
	.props-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
	.props-table th, .props-table td { text-align: left; padding: 0.75rem; border-bottom: 1px solid var(--pui-color-border); }
	.props-table th { font-weight: 600; background: var(--pui-color-bg-secondary); }
	.props-table code { background: var(--pui-color-bg-tertiary); padding: 0.125rem 0.375rem; border-radius: 4px; font-size: 0.8125rem; }
	.info-text { color: var(--pui-color-text-secondary); line-height: 1.6; margin-bottom: 0.75rem; }
	.related-list { padding-left: 1.5rem; color: var(--pui-color-text-secondary); line-height: 2; }
</style>
