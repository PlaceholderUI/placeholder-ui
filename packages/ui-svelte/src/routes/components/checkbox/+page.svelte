<script lang="ts">
	import { Checkbox, Paper, Button } from '$lib/index.js';

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
</script>

<h1>Checkbox</h1>
<p>Checkbox input for boolean values or multiple selections.</p>

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
				<td><code>checked</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Bindable checked state</td>
			</tr>
			<tr>
				<td><code>label</code></td>
				<td><code>string</code></td>
				<td><code>undefined</code></td>
				<td>Label text next to checkbox</td>
			</tr>
			<tr>
				<td><code>required</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Shows required indicator</td>
			</tr>
			<tr>
				<td><code>disabled</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Disables the checkbox</td>
			</tr>
			<tr>
				<td><code>showError</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Shows error styling</td>
			</tr>
			<tr>
				<td><code>errorText</code></td>
				<td><code>string</code></td>
				<td><code>''</code></td>
				<td>Error message text</td>
			</tr>
			<tr>
				<td><code>inputId</code></td>
				<td><code>string</code></td>
				<td><code>undefined</code></td>
				<td>Custom ID for the input</td>
			</tr>
			<tr>
				<td><code>onchange</code></td>
				<td><code>(checked: boolean) => void</code></td>
				<td><code>undefined</code></td>
				<td>Called when value changes</td>
			</tr>
		</tbody>
	</table>
</Paper>

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
	}

	.props-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.875rem;
	}

	.props-table th,
	.props-table td {
		text-align: left;
		padding: 0.75rem;
		border-bottom: 1px solid var(--pui-color-border);
	}

	.props-table th {
		font-weight: 600;
		background: var(--pui-color-bg-secondary);
	}

	.props-table code {
		background: var(--pui-color-bg-tertiary);
		padding: 0.125rem 0.375rem;
		border-radius: 4px;
		font-size: 0.8125rem;
	}
</style>
