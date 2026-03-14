<script lang="ts">
	import { Table, Textbox, Paper, Button, iconSearch, iconUser } from '$lib/index.js';
	import type { Column } from '$lib/index.js';

	let basicValue = $state('');
	let searchValue = $state('');
	let errorValue = $state('');
	let disabledValue = $state('Cannot edit this');

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
		{ prop: 'value', type: 'string', default: '\'\'', description: 'Bindable input value' },
		{ prop: 'label', type: 'string', default: '\'\'', description: 'Label text above input' },
		{ prop: 'placeholder', type: 'string', default: 'undefined', description: 'Placeholder text' },
		{ prop: 'required', type: 'boolean', default: 'false', description: 'Shows required indicator' },
		{ prop: 'disabled', type: 'boolean', default: 'false', description: 'Disables the input' },
		{ prop: 'loading', type: 'boolean', default: 'false', description: 'Shows loading spinner' },
		{ prop: 'leftIconSvg', type: 'string', default: 'undefined', description: 'SVG string for left icon' },
		{ prop: 'showError', type: 'boolean', default: 'false', description: 'Shows error styling' },
		{ prop: 'errorText', type: 'string', default: '\'\'', description: 'Error message text' },
		{ prop: 'tooltipText', type: 'string', default: 'undefined', description: 'Tooltip hint text' },
		{ prop: 'onenter', type: '(value: string) => void', default: 'undefined', description: 'Called when Enter is pressed' },
		{ prop: 'onchange', type: '(e: Event) => void', default: 'undefined', description: 'Change event handler' },
	];
</script>

<h1>Textbox</h1>
<p>Text input for collecting user data with labels, icons, validation, and more.</p>

<div class="vstack">
	<Paper title="Basic Usage">
		<div class="form-grid">
			<Textbox label="Name" bind:value={basicValue} placeholder="Enter your name" />
			<p class="value-display">Value: "{basicValue}"</p>
		</div>
	</Paper>

	<Paper title="With Left Icon">
		<div class="form-grid">
			<Textbox
				label="Search"
				bind:value={searchValue}
				placeholder="Search..."
				leftIconSvg={iconSearch}
			/>
			<Textbox label="Username" placeholder="Enter username" leftIconSvg={iconUser} />
		</div>
	</Paper>

	<Paper title="Required Field">
		<Textbox label="Email" placeholder="you@example.com" required />
	</Paper>

	<Paper title="With Error State">
		<Textbox
			label="Username"
			bind:value={errorValue}
			placeholder="Enter username"
			showError={errorValue.length > 0 && errorValue.length < 3}
			errorText="Username must be at least 3 characters"
		/>
	</Paper>

	<Paper title="Disabled">
		<Textbox label="Disabled Input" bind:value={disabledValue} disabled />
	</Paper>

	<Paper title="Loading State">
		<Textbox label="Loading" placeholder="Fetching data..." loading />
	</Paper>

	<Paper title="With Right Slot">
		<Textbox label="With Button" placeholder="Enter text...">
			{#snippet right()}
				<Button variant="primary" size="sm">Submit</Button>
			{/snippet}
		</Textbox>
	</Paper>

	<Paper title="With Tooltip">
		<Textbox
			label="API Key"
			placeholder="Enter your API key"
			tooltipText="Your API key can be found in the dashboard settings"
		/>
	</Paper>

	<Paper title="Props">
		<Table columns={propsColumns} rows={propsRows} striped hover={false} />
	</Paper>
</div>

<style>
	h1 {
		margin-bottom: 0.5rem;
	}

	p {
		color: var(--pui-color-text-secondary);
		margin-bottom: 1.5rem;
	}

	.form-grid {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		max-width: 400px;
	}

	.value-display {
		font-size: 0.875rem;
		color: var(--pui-color-text-muted);
		font-family: monospace;
	}</style>
