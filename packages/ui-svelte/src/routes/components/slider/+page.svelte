<script lang="ts">
	import { Table, Slider, Paper } from '$lib/index.js';
	import type { Column } from '$lib/index.js';

	let basicValue = $state(50);
	let rangeValue = $state(20);
	let marksValue = $state(50);
	let sizeXs = $state(25);
	let sizeSm = $state(40);
	let sizeMd = $state(55);
	let sizeLg = $state(70);
	let sizeXl = $state(85);
	let colorPrimary = $state(50);
	let colorAccent = $state(50);
	let colorSuccess = $state(50);
	let colorWarning = $state(50);
	let colorDanger = $state(50);
	let disabledValue = $state(60);
	let labelValue = $state(30);

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
		{ prop: 'value', type: 'number', default: '0', description: 'Bindable slider value' },
		{ prop: 'label', type: 'string', default: '\'\'', description: 'Label text above slider' },
		{ prop: 'min', type: 'number', default: '0', description: 'Minimum value' },
		{ prop: 'max', type: 'number', default: '100', description: 'Maximum value' },
		{ prop: 'step', type: 'number', default: '1', description: 'Step increment' },
		{ prop: 'marks', type: 'Mark[] | boolean', default: 'false', description: 'true' },
		{ prop: 'showValue', type: 'boolean', default: 'false', description: 'Shows current value above the slider' },
		{ prop: 'labelAlwaysOn', type: 'boolean', default: 'false', description: 'Always show the thumb label' },
		{ prop: 'size', type: '\'xs\' | \'sm\' | \'md\' | \'lg\' | \'xl\'', default: '\'md\'', description: 'Slider track and thumb size' },
		{ prop: 'color', type: '\'primary\' | \'secondary\' | \'accent\' | \'success\' | \'warning\' | \'danger\'', default: '\'primary\'', description: 'Color of the filled track and thumb border' },
		{ prop: 'radius', type: '\'none\' | \'sm\' | \'md\' | \'lg\' | \'full\'', default: '\'full\'', description: 'Border radius of the track' },
		{ prop: 'disabled', type: 'boolean', default: 'false', description: 'Disables the slider' },
		{ prop: 'required', type: 'boolean', default: 'false', description: 'Shows required indicator' },
		{ prop: 'showError', type: 'boolean', default: 'false', description: 'Shows error styling' },
		{ prop: 'errorText', type: 'string', default: '\'\'', description: 'Error message text' },
		{ prop: 'onchange', type: '(value: number) => void', default: 'undefined', description: 'Called when value changes (on release)' },
		{ prop: 'oninput', type: '(value: number) => void', default: 'undefined', description: 'Called continuously while dragging' },
	];
</script>

<h1>Slider</h1>
<p>Range slider input for selecting numeric values within a defined range.</p>

<div class="vstack">
	<Paper title="Basic Usage">
		<div class="form-grid">
			<Slider label="Volume" bind:value={basicValue} showValue />
			<div class="value-display">Value: {basicValue}</div>
		</div>
	</Paper>

	<Paper title="Custom Range (min=0, max=50, step=5)">
		<div class="form-grid">
			<Slider label="Quantity" bind:value={rangeValue} min={0} max={50} step={5} showValue />
			<div class="value-display">Value: {rangeValue}</div>
		</div>
	</Paper>

	<Paper title="With Marks">
		<div class="form-grid">
			<Slider label="Progress" bind:value={marksValue} marks={true} showValue />
			<div class="value-display">Value: {marksValue}</div>
		</div>
	</Paper>

	<Paper title="Label Always On">
		<div class="form-grid">
			<Slider label="Brightness" bind:value={labelValue} labelAlwaysOn />
		</div>
	</Paper>

	<Paper title="Sizes">
		<div class="form-grid">
			<Slider label="Extra Small" bind:value={sizeXs} size="xs" showValue />
			<Slider label="Small" bind:value={sizeSm} size="sm" showValue />
			<Slider label="Medium" bind:value={sizeMd} size="md" showValue />
			<Slider label="Large" bind:value={sizeLg} size="lg" showValue />
			<Slider label="Extra Large" bind:value={sizeXl} size="xl" showValue />
		</div>
	</Paper>

	<Paper title="Colors">
		<div class="form-grid">
			<Slider label="Primary" bind:value={colorPrimary} color="primary" showValue />
			<Slider label="Accent" bind:value={colorAccent} color="accent" showValue />
			<Slider label="Success" bind:value={colorSuccess} color="success" showValue />
			<Slider label="Warning" bind:value={colorWarning} color="warning" showValue />
			<Slider label="Danger" bind:value={colorDanger} color="danger" showValue />
		</div>
	</Paper>

	<Paper title="Disabled">
		<div class="form-grid">
			<Slider label="Locked" bind:value={disabledValue} disabled showValue />
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
