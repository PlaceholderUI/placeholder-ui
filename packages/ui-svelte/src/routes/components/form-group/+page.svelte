<script lang="ts">
	import { FormGroup, Textbox, Paper } from '$lib/index.js';

	let basicValue = $state('');
	let tooltipValue = $state('');
	let errorValue = $state('');
	let requiredValue = $state('');
</script>

<h1>FormGroup</h1>
<p>Wrapper component that provides a label, required indicator, tooltip, and error display for form elements.</p>

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
				<td><code>required</code></td>
				<td>Label text displayed above the form element</td>
			</tr>
			<tr>
				<td><code>required</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Shows a required asterisk next to the label</td>
			</tr>
			<tr>
				<td><code>id</code></td>
				<td><code>string</code></td>
				<td><code>undefined</code></td>
				<td>HTML id for the label's <code>for</code> attribute</td>
			</tr>
			<tr>
				<td><code>class</code></td>
				<td><code>string</code></td>
				<td><code>''</code></td>
				<td>Additional CSS classes</td>
			</tr>
			<tr>
				<td><code>showError</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Shows error text below the form element</td>
			</tr>
			<tr>
				<td><code>errorText</code></td>
				<td><code>string</code></td>
				<td><code>''</code></td>
				<td>Error message text</td>
			</tr>
			<tr>
				<td><code>tooltipText</code></td>
				<td><code>string</code></td>
				<td><code>undefined</code></td>
				<td>Simple text tooltip shown on info icon hover</td>
			</tr>
			<tr>
				<td><code>tooltipContent</code></td>
				<td><code>Snippet</code></td>
				<td><code>undefined</code></td>
				<td>Custom tooltip content as a Svelte snippet</td>
			</tr>
			<tr>
				<td><code>children</code></td>
				<td><code>Snippet</code></td>
				<td><code>required</code></td>
				<td>The form element(s) to wrap</td>
			</tr>
		</tbody>
	</table>
</Paper>

<style>
	h1 { margin-bottom: 0.5rem; }
	p { color: var(--pui-color-text-secondary); margin-bottom: 1.5rem; }
	.form-grid { display: flex; flex-direction: column; gap: 1rem; max-width: 400px; }
	.value-display { font-size: 0.875rem; color: var(--pui-color-text-muted); font-family: monospace; margin-top: 0.5rem; }
	.props-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
	.props-table th, .props-table td { text-align: left; padding: 0.75rem; border-bottom: 1px solid var(--pui-color-border); }
	.props-table th { font-weight: 600; background: var(--pui-color-bg-secondary); }
	.props-table code { background: var(--pui-color-bg-tertiary); padding: 0.125rem 0.375rem; border-radius: 4px; font-size: 0.8125rem; }
</style>
