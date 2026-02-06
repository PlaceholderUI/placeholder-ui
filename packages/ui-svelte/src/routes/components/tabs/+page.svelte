<script lang="ts">
	import { Tabs, Paper, type ComboBoxItem } from '$lib/index.js';

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
</script>

<h1>Tabs</h1>
<p>Tabs organize content into separate views where only one view is visible at a time.</p>

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
				<td><code>tabOptions</code></td>
				<td><code>ComboBoxItem[]</code></td>
				<td>required</td>
				<td>Array of tab options with value and label</td>
			</tr>
			<tr>
				<td><code>activeTab</code></td>
				<td><code>string</code></td>
				<td><code>''</code></td>
				<td>Bindable active tab value</td>
			</tr>
			<tr>
				<td><code>solidBg</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Use solid background style for tabs</td>
			</tr>
			<tr>
				<td><code>onchange</code></td>
				<td><code>(newValue: string) => void</code></td>
				<td><code>undefined</code></td>
				<td>Callback when the active tab changes</td>
			</tr>
		</tbody>
	</table>
</Paper>

<style>
	h1 { margin-bottom: 0.5rem; }
	p { color: var(--pui-color-text-secondary); margin-bottom: 1.5rem; }
	.value-display { font-size: 0.875rem; color: var(--pui-color-text-muted); font-family: monospace; margin-top: 0.5rem; }
	.props-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
	.props-table th, .props-table td { text-align: left; padding: 0.75rem; border-bottom: 1px solid var(--pui-color-border); }
	.props-table th { font-weight: 600; background: var(--pui-color-bg-secondary); }
	.props-table code { background: var(--pui-color-bg-tertiary); padding: 0.125rem 0.375rem; border-radius: 4px; font-size: 0.8125rem; }

	.tab-content {
		margin-top: 1rem;
	}

	.tab-panel {
		padding: 1rem;
		border: 1px solid var(--pui-color-border);
		border-radius: 0.5rem;
		margin: 0;
	}
</style>
