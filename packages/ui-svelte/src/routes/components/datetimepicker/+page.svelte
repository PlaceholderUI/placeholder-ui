<script lang="ts">
	import { DateTimePicker, Paper } from '$lib/index.js';

	let basicDateTime = $state<string | undefined>(undefined);
	let constrainedDateTime = $state<string | undefined>(undefined);
	let requiredDateTime = $state<string | undefined>(undefined);
</script>

<h1>DateTimePicker</h1>
<p>Combined date and time selection component with a calendar dropdown and integrated time picker.</p>

<Paper title="Basic Usage">
	<div class="form-grid">
		<DateTimePicker
			label="Select Date & Time"
			bind:value={basicDateTime}
		/>
		<div class="value-display">Value: {basicDateTime ?? 'none'}</div>
	</div>
</Paper>

<Paper title="With Min/Max Date">
	<div class="form-grid">
		<DateTimePicker
			label="Appointment"
			bind:value={constrainedDateTime}
			minDate="2025-01-01T08:00:00"
			maxDate="2025-12-31T18:00:00"
		/>
		<div class="value-display">Value: {constrainedDateTime ?? 'none'}</div>
		<div class="value-display">Range: 2025-01-01 08:00 to 2025-12-31 18:00</div>
	</div>
</Paper>

<Paper title="Required">
	<div class="form-grid">
		<DateTimePicker
			label="Event Start"
			bind:value={requiredDateTime}
			required
		/>
		<div class="value-display">Value: {requiredDateTime ?? 'none'}</div>
	</div>
</Paper>

<Paper title="Disabled">
	<div class="form-grid">
		<DateTimePicker
			label="Locked DateTime"
			disabled
		/>
	</div>
</Paper>

<Paper title="With Change Handler">
	<div class="form-grid">
		<DateTimePicker
			label="Deadline"
			onchange={(dateTime) => {
				alert(`DateTime selected: ${dateTime ?? 'cleared'}`);
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
				<td>Bindable datetime value in ISO format (YYYY-MM-DDTHH:mm:ssZ)</td>
			</tr>
			<tr>
				<td><code>label</code></td>
				<td><code>string</code></td>
				<td><code>undefined</code></td>
				<td>Label text above the input</td>
			</tr>
			<tr>
				<td><code>disabled</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Disables the datetime picker</td>
			</tr>
			<tr>
				<td><code>required</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Shows required indicator</td>
			</tr>
			<tr>
				<td><code>minDate</code></td>
				<td><code>string | undefined</code></td>
				<td><code>undefined</code></td>
				<td>Minimum selectable date and time</td>
			</tr>
			<tr>
				<td><code>maxDate</code></td>
				<td><code>string | undefined</code></td>
				<td><code>undefined</code></td>
				<td>Maximum selectable date and time</td>
			</tr>
			<tr>
				<td><code>onchange</code></td>
				<td><code>(dateTime: string | undefined) => void</code></td>
				<td><code>undefined</code></td>
				<td>Called when date or time changes</td>
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
