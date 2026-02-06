<script lang="ts">
	import { TimePicker, Paper } from '$lib/index.js';

	let basicTime = $state<string | undefined>(undefined);
	let requiredTime = $state<string | undefined>(undefined);
</script>

<h1>TimePicker</h1>
<p>Time selection component with hour and minute inputs and an AM/PM toggle.</p>

<Paper title="Basic Usage">
	<div class="form-grid">
		<TimePicker
			label="Select Time"
			bind:value={basicTime}
		/>
		<div class="value-display">Value: {basicTime ?? 'none'}</div>
	</div>
</Paper>

<Paper title="Required">
	<div class="form-grid">
		<TimePicker
			label="Meeting Time"
			bind:value={requiredTime}
			required
		/>
		<div class="value-display">Value: {requiredTime ?? 'none'}</div>
	</div>
</Paper>

<Paper title="Disabled">
	<div class="form-grid">
		<TimePicker
			label="Locked Time"
			disabled
		/>
	</div>
</Paper>

<Paper title="With Change Handler">
	<div class="form-grid">
		<TimePicker
			label="Alarm Time"
			onchange={(time) => {
				alert(`Time set to: ${time ?? 'cleared'}`);
			}}
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
				<td><code>string | undefined</code></td>
				<td><code>undefined</code></td>
				<td>Bindable time value in HH:mm:ss format</td>
			</tr>
			<tr>
				<td><code>label</code></td>
				<td><code>string</code></td>
				<td><code>undefined</code></td>
				<td>Label text above the time picker</td>
			</tr>
			<tr>
				<td><code>disabled</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Disables the time picker</td>
			</tr>
			<tr>
				<td><code>required</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Shows required indicator</td>
			</tr>
			<tr>
				<td><code>rounded</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Applies rounded styling to the container</td>
			</tr>
			<tr>
				<td><code>minDate</code></td>
				<td><code>string | undefined</code></td>
				<td><code>undefined</code></td>
				<td>Minimum time constraint (used with selectedDate)</td>
			</tr>
			<tr>
				<td><code>maxDate</code></td>
				<td><code>string | undefined</code></td>
				<td><code>undefined</code></td>
				<td>Maximum time constraint (used with selectedDate)</td>
			</tr>
			<tr>
				<td><code>selectedDate</code></td>
				<td><code>string | undefined</code></td>
				<td><code>undefined</code></td>
				<td>Current date for min/max time constraint checks</td>
			</tr>
			<tr>
				<td><code>onchange</code></td>
				<td><code>(time: string | undefined) => void</code></td>
				<td><code>undefined</code></td>
				<td>Called when time value changes</td>
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
