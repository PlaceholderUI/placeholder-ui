<script lang="ts">
	import { Table, CronBuilder, Paper } from '$lib/index.js';
	import type { Column } from '$lib/index.js';

	let basicValue = $state('0 0 * * *');
	let disabledValue = $state('*/15 * * * *');
	let errorValue = $state('0 0 * * *');

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
		{ prop: 'value', type: 'string', default: '\'0 0 * * *\'', description: 'Bindable cron expression' },
		{ prop: 'label', type: 'string', default: '\'Schedule\'', description: 'Label text above builder' },
		{ prop: 'placeholder', type: 'string', default: '\'\'', description: 'Placeholder text' },
		{ prop: 'disabled', type: 'boolean', default: 'false', description: 'Disables all inputs' },
		{ prop: 'required', type: 'boolean', default: 'false', description: 'Shows required indicator' },
		{ prop: 'showError', type: 'boolean', default: 'false', description: 'Shows error styling' },
		{ prop: 'errorText', type: 'string', default: '\'\'', description: 'Error message text' },
		{ prop: 'tooltipText', type: 'string', default: 'undefined', description: 'Tooltip hint text' },
		{ prop: 'onchange', type: '(expression: string) => void', default: 'undefined', description: 'Called when the cron expression changes' },
	];
</script>

<h1>CronBuilder</h1>
<p>Visual cron expression builder with frequency presets and a real-time expression preview.</p>

<div class="vstack">
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
		<Table columns={propsColumns} rows={propsRows} striped hover={false} />
	</Paper>
</div>

<style>
	h1 { margin-bottom: 0.5rem; }
	p { color: var(--pui-color-text-secondary); margin-bottom: 1.5rem; }
	.form-grid-wide { display: flex; flex-direction: column; gap: 1rem; max-width: 700px; }
	.value-display { font-size: 0.875rem; color: var(--pui-color-text-muted); font-family: monospace; margin-top: 0.5rem; }</style>
