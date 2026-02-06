<script lang="ts">
	import { TextArea, Paper } from '$lib/index.js';

	let basicValue = $state('');
	let requiredValue = $state('');
	let disabledValue = $state('This content cannot be edited.');
	let tooltipValue = $state('');
</script>

<h1>TextArea</h1>
<p>Multi-line text input for longer content such as descriptions, comments, and notes.</p>

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
				<td><code>value</code></td>
				<td><code>string</code></td>
				<td><code>''</code></td>
				<td>Bindable text value</td>
			</tr>
			<tr>
				<td><code>label</code></td>
				<td><code>string</code></td>
				<td><code>''</code></td>
				<td>Label text above textarea</td>
			</tr>
			<tr>
				<td><code>placeholder</code></td>
				<td><code>string</code></td>
				<td><code>undefined</code></td>
				<td>Placeholder text</td>
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
				<td>Disables the textarea</td>
			</tr>
			<tr>
				<td><code>tooltipText</code></td>
				<td><code>string</code></td>
				<td><code>undefined</code></td>
				<td>Tooltip hint text</td>
			</tr>
			<tr>
				<td><code>noAutocomplete</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Disables browser autocomplete</td>
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
