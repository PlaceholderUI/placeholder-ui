<script lang="ts">
	import { Table, Rating, Paper } from '$lib/index.js';
	import type { Column } from '$lib/index.js';

	let basicValue = $state(0);
	let sizeXs = $state(2);
	let sizeSm = $state(3);
	let sizeMd = $state(4);
	let sizeLg = $state(3);
	let sizeXl = $state(5);
	let colorPrimary = $state(3);
	let colorSecondary = $state(3);
	let colorAccent = $state(3);
	let colorWarning = $state(3);
	let readOnlyValue = $state(3.5);
	let halfValue = $state(0);
	let customCountValue = $state(0);

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
		{ prop: 'value', type: 'number', default: '0', description: 'Bindable rating value' },
		{ prop: 'label', type: 'string', default: '\'\'', description: 'Label text' },
		{ prop: 'count', type: 'number', default: '5', description: 'Number of rating symbols' },
		{ prop: 'size', type: '\'xs\' | \'sm\' | \'md\' | \'lg\' | \'xl\'', default: '\'md\'', description: 'Size of the star icons' },
		{ prop: 'color', type: '\'primary\' | \'secondary\' | \'accent\' | \'warning\'', default: '\'warning\'', description: 'Color of filled stars' },
		{ prop: 'readOnly', type: 'boolean', default: 'false', description: 'Makes the rating non-interactive' },
		{ prop: 'fractions', type: '1 | 2 | 4', default: '1', description: 'Fractional precision (1 = whole, 2 = half, 4 = quarter)' },
		{ prop: 'highlightSelectedOnly', type: 'boolean', default: 'false', description: 'Only highlight the selected star, not all preceding ones' },
		{ prop: 'required', type: 'boolean', default: 'false', description: 'Shows required indicator' },
		{ prop: 'showError', type: 'boolean', default: 'false', description: 'Shows error styling' },
		{ prop: 'errorText', type: 'string', default: '\'\'', description: 'Error message text' },
		{ prop: 'onchange', type: '(value: number) => void', default: 'undefined', description: 'Called when rating changes' },
		{ prop: 'onhover', type: '(value: number) => void', default: 'undefined', description: 'Called when hovering over a star' },
	];
</script>

<h1>Rating</h1>
<p>Star rating component for collecting user feedback with fractional precision support.</p>

<div class="vstack">
	<Paper title="Basic Usage">
		<div class="form-grid">
			<Rating label="Rating" bind:value={basicValue} />
			<div class="value-display">Value: {basicValue}</div>
		</div>
	</Paper>

	<Paper title="Sizes">
		<div class="form-grid">
			<Rating label="Extra Small" bind:value={sizeXs} size="xs" />
			<Rating label="Small" bind:value={sizeSm} size="sm" />
			<Rating label="Medium" bind:value={sizeMd} size="md" />
			<Rating label="Large" bind:value={sizeLg} size="lg" />
			<Rating label="Extra Large" bind:value={sizeXl} size="xl" />
		</div>
	</Paper>

	<Paper title="Colors">
		<div class="form-grid">
			<Rating label="Primary" bind:value={colorPrimary} color="primary" />
			<Rating label="Secondary" bind:value={colorSecondary} color="secondary" />
			<Rating label="Accent" bind:value={colorAccent} color="accent" />
			<Rating label="Warning (default)" bind:value={colorWarning} color="warning" />
		</div>
	</Paper>

	<Paper title="Read Only">
		<div class="form-grid">
			<Rating label="Average Score" value={readOnlyValue} readOnly />
			<div class="value-display">Value: {readOnlyValue} (read-only)</div>
		</div>
	</Paper>

	<Paper title="Half Stars (fractions=2)">
		<div class="form-grid">
			<Rating label="Precise Rating" bind:value={halfValue} fractions={2} />
			<div class="value-display">Value: {halfValue}</div>
		</div>
	</Paper>

	<Paper title="Custom Count (count=10)">
		<div class="form-grid">
			<Rating label="Rate out of 10" bind:value={customCountValue} count={10} size="sm" />
			<div class="value-display">Value: {customCountValue} / 10</div>
		</div>
	</Paper>

	<Paper title="Highlight Selected Only">
		<div class="form-grid">
			<Rating label="Select One" value={3} highlightSelectedOnly readOnly />
		</div>
	</Paper>

	<Paper title="Required with Error">
		<div class="form-grid">
			<Rating
				label="Your Rating"
				bind:value={basicValue}
				required
				showError={basicValue === 0}
				errorText="Please provide a rating"
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
	.form-grid { display: flex; flex-direction: column; gap: 1rem; max-width: 400px; }
	.value-display { font-size: 0.875rem; color: var(--pui-color-text-muted); font-family: monospace; margin-top: 0.5rem; }</style>
