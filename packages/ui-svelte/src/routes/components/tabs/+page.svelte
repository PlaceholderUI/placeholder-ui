<script lang="ts">
	import { Table, Tabs, Paper, type ComboBoxItem } from '$lib/index.js';
	import type { Column } from '$lib/index.js';

	const tabOptions: ComboBoxItem[] = [
		{ value: 'overview', label: 'Overview' },
		{ value: 'features', label: 'Features' },
		{ value: 'pricing', label: 'Pricing' },
		{ value: 'support', label: 'Support' }
	];

	let activeTab = $state('overview');

	const solidTabOptions: ComboBoxItem[] = [
		{ value: 'tab1', label: 'First Tab' },
		{ value: 'tab2', label: 'Second Tab' },
		{ value: 'tab3', label: 'Third Tab' }
	];

	let solidActiveTab = $state('tab1');

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
		{ prop: 'tabOptions', type: 'ComboBoxItem[]', default: 'required', description: 'Array of tab options with value and label' },
		{ prop: 'activeTab', type: 'string', default: '\'\'', description: 'Bindable active tab value' },
		{ prop: 'solidBg', type: 'boolean', default: 'false', description: 'Use solid background style for tabs' },
		{ prop: 'onchange', type: '(newValue: string) => void', default: 'undefined', description: 'Callback when the active tab changes' },
	];
</script>

<h1>Tabs</h1>
<p>Tabs organize content into separate views where only one view is visible at a time.</p>

<div class="vstack">
	<Paper title="Basic Usage">
		<Tabs {tabOptions} bind:activeTab />
		<div class="value-display">activeTab: "{activeTab}"</div>
		<div class="tab-content">
			{#if activeTab === 'overview'}
				<p class="tab-panel">This is the Overview panel. It shows a summary of the product.</p>
			{:else if activeTab === 'features'}
				<p class="tab-panel">This is the Features panel. It lists all available features.</p>
			{:else if activeTab === 'pricing'}
				<p class="tab-panel">This is the Pricing panel. It shows subscription tiers and costs.</p>
			{:else if activeTab === 'support'}
				<p class="tab-panel">This is the Support panel. It provides help and contact information.</p>
			{/if}
		</div>
	</Paper>

	<Paper title="Solid Background">
		<Tabs tabOptions={solidTabOptions} bind:activeTab={solidActiveTab} solidBg />
		<div class="value-display">activeTab: "{solidActiveTab}"</div>
		<div class="tab-content">
			{#if solidActiveTab === 'tab1'}
				<p class="tab-panel">Content for the first tab with a solid background style.</p>
			{:else if solidActiveTab === 'tab2'}
				<p class="tab-panel">Content for the second tab.</p>
			{:else if solidActiveTab === 'tab3'}
				<p class="tab-panel">Content for the third tab.</p>
			{/if}
		</div>
	</Paper>

	<Paper title="Props">
		<Table columns={propsColumns} rows={propsRows} striped hover={false} />
	</Paper>
</div>

<style>
	h1 { margin-bottom: 0.5rem; }
	p { color: var(--pui-color-text-secondary); margin-bottom: 1.5rem; }
	.value-display { font-size: 0.875rem; color: var(--pui-color-text-muted); font-family: monospace; margin-top: 0.5rem; }.tab-content {
		margin-top: 1rem;
	}

	.tab-panel {
		padding: 1rem;
		border: 1px solid var(--pui-color-border);
		border-radius: 0.5rem;
		margin: 0;
	}
</style>
