<script lang="ts">
	import { CronBuilder, Paper } from '$lib/index.js';

	let basicValue = $state('0 0 * * *');
	let disabledValue = $state('*/15 * * * *');
	let errorValue = $state('0 0 * * *');
</script>

<h1>CronBuilder</h1>
<p>Visual cron expression builder with frequency presets and a real-time expression preview.</p>

<Paper title="Basic Usage">
	<div class="form-grid-wide">
		<CronBuilder label="Schedule" bind:value={basicValue} />
		<div class="value-display">CRON Expression: "{basicValue}"</div>
	</div>
</Paper>

<Paper title="Custom Initial Value">
	<div class="form-grid-wide">
		<CronBuilder label="Backup Schedule" value="0 2 * * 0" />
	</div>
</Paper>

<Paper title="Disabled">
	<div class="form-grid-wide">
		<CronBuilder label="Locked Schedule" bind:value={disabledValue} disabled />
		<div class="value-display">Value: "{disabledValue}"</div>
	</div>
</Paper>

<Paper title="Required">
	<div class="form-grid-wide">
		<CronBuilder label="Deployment Schedule" value="0 0 * * *" required />
	</div>
</Paper>

<Paper title="With Error">
	<div class="form-grid-wide">
		<CronBuilder
			label="Job Schedule"
			bind:value={errorValue}
			showError
			errorText="Please configure a valid schedule"
		/>
	</div>
</Paper>

<Paper title="With Tooltip">
	<div class="form-grid-wide">
		<CronBuilder
			label="Report Schedule"
			value="0 9 * * 1-5"
			tooltipText="Configure when automated reports should be generated and sent"
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
				<td><code>'0 0 * * *'</code></td>
				<td>Bindable cron expression</td>
			</tr>
			<tr>
				<td><code>label</code></td>
				<td><code>string</code></td>
				<td><code>'Schedule'</code></td>
				<td>Label text above builder</td>
			</tr>
			<tr>
				<td><code>placeholder</code></td>
				<td><code>string</code></td>
				<td><code>''</code></td>
				<td>Placeholder text</td>
			</tr>
			<tr>
				<td><code>disabled</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Disables all inputs</td>
			</tr>
			<tr>
				<td><code>required</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Shows required indicator</td>
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
				<td><code>tooltipText</code></td>
				<td><code>string</code></td>
				<td><code>undefined</code></td>
				<td>Tooltip hint text</td>
			</tr>
			<tr>
				<td><code>onchange</code></td>
				<td><code>(expression: string) =&gt; void</code></td>
				<td><code>undefined</code></td>
				<td>Called when the cron expression changes</td>
			</tr>
		</tbody>
	</table>
</Paper>

<style>
	h1 { margin-bottom: 0.5rem; }
	p { color: var(--pui-color-text-secondary); margin-bottom: 1.5rem; }
	.form-grid-wide { display: flex; flex-direction: column; gap: 1rem; max-width: 700px; }
	.value-display { font-size: 0.875rem; color: var(--pui-color-text-muted); font-family: monospace; margin-top: 0.5rem; }
	.props-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
	.props-table th, .props-table td { text-align: left; padding: 0.75rem; border-bottom: 1px solid var(--pui-color-border); }
	.props-table th { font-weight: 600; background: var(--pui-color-bg-secondary); }
	.props-table code { background: var(--pui-color-bg-tertiary); padding: 0.125rem 0.375rem; border-radius: 4px; font-size: 0.8125rem; }
</style>
