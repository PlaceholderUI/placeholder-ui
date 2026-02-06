<script lang="ts">
	import { Badge, Paper, Button } from '$lib/index.js';

	let deletedBadges = $state<string[]>([]);
	let allBadges = $state(['Alpha', 'Beta', 'Gamma', 'Delta']);

	let clickedBadge = $state('');

	function handleDelete(name: string) {
		deletedBadges = [...deletedBadges, name];
		allBadges = allBadges.filter((b) => b !== name);
	}

	function resetBadges() {
		allBadges = ['Alpha', 'Beta', 'Gamma', 'Delta'];
		deletedBadges = [];
	}
</script>

<h1>Badge</h1>
<p>Small status or label indicators. Supports multiple variants, shapes, and interactive features.</p>

<Paper title="Variants">
	<div class="demo-row">
		<Badge variant="primary">Primary</Badge>
		<Badge variant="secondary">Secondary</Badge>
		<Badge variant="accent">Accent</Badge>
		<Badge variant="danger">Danger</Badge>
		<Badge variant="muted">Muted</Badge>
		<Badge variant="white">White</Badge>
	</div>
	<div class="demo-section"></div>
	<div class="demo-row">
		<Badge variant="primary-outline">Primary Outline</Badge>
		<Badge variant="secondary-outline">Secondary Outline</Badge>
		<Badge variant="auto-outline">Auto Outline</Badge>
	</div>
	<div class="demo-section"></div>
	<div class="demo-row">
		<Badge variant="primary-subtle">Primary Subtle</Badge>
		<Badge variant="secondary-subtle">Secondary Subtle</Badge>
		<Badge variant="muted-subtle">Muted Subtle</Badge>
		<Badge variant="danger-subtle">Danger Subtle</Badge>
	</div>
	<div class="demo-section"></div>
	<div class="demo-row">
		<Badge variant="muted-selected">Muted Selected</Badge>
		<Badge variant="secondary-selected">Secondary Selected</Badge>
	</div>
</Paper>

<Paper title="Pill Shape">
	<div class="demo-row">
		<Badge shape="pill" variant="primary">Primary Pill</Badge>
		<Badge shape="pill" variant="secondary">Secondary Pill</Badge>
		<Badge shape="pill" variant="accent">Accent Pill</Badge>
		<Badge shape="pill" variant="danger">Danger Pill</Badge>
		<Badge shape="pill" variant="muted">Muted Pill</Badge>
	</div>
</Paper>

<Paper title="Clickable">
	<div class="demo-row">
		<Badge variant="primary" onClick={() => (clickedBadge = 'Primary')}>Click Me</Badge>
		<Badge variant="secondary" onClick={() => (clickedBadge = 'Secondary')}>Click Me</Badge>
		<Badge variant="accent" onClick={() => (clickedBadge = 'Accent')}>Click Me</Badge>
	</div>
	<div class="value-display">Last clicked: {clickedBadge || 'none'}</div>
</Paper>

<Paper title="With Delete">
	<div class="demo-row">
		{#each allBadges as badge}
			<Badge variant="primary" onDelete={() => handleDelete(badge)}>{badge}</Badge>
		{/each}
		{#if allBadges.length === 0}
			<span class="value-display">All badges deleted!</span>
		{/if}
	</div>
	<div class="value-display">Deleted: {deletedBadges.join(', ') || 'none'}</div>
	{#if deletedBadges.length > 0}
		<Button variant="muted" size="sm" onclick={resetBadges}>Reset</Button>
	{/if}
</Paper>

<Paper title="Disabled">
	<div class="demo-row">
		<Badge variant="primary" disabled>Primary Disabled</Badge>
		<Badge variant="secondary" disabled>Secondary Disabled</Badge>
		<Badge variant="danger" disabled>Danger Disabled</Badge>
		<Badge variant="muted" disabled>Muted Disabled</Badge>
	</div>
</Paper>

<Paper title="As Link">
	<div class="demo-row">
		<Badge variant="primary" href="/">Home Link</Badge>
		<Badge variant="secondary" href="https://svelte.dev">Svelte Link</Badge>
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
				<td><code>variant</code></td>
				<td><code>ButtonVariant</code></td>
				<td><code>'primary'</code></td>
				<td>Visual style variant</td>
			</tr>
			<tr>
				<td><code>shape</code></td>
				<td><code>'pill' | 'default'</code></td>
				<td><code>'default'</code></td>
				<td>Badge shape</td>
			</tr>
			<tr>
				<td><code>href</code></td>
				<td><code>string</code></td>
				<td><code>undefined</code></td>
				<td>Renders as anchor tag when set</td>
			</tr>
			<tr>
				<td><code>loading</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Shows loading state</td>
			</tr>
			<tr>
				<td><code>disabled</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Disables the badge</td>
			</tr>
			<tr>
				<td><code>onDelete</code></td>
				<td><code>() => void</code></td>
				<td><code>undefined</code></td>
				<td>Shows delete button and calls handler</td>
			</tr>
			<tr>
				<td><code>onClick</code></td>
				<td><code>() => void</code></td>
				<td><code>undefined</code></td>
				<td>Makes badge clickable</td>
			</tr>
			<tr>
				<td><code>children</code></td>
				<td><code>Snippet</code></td>
				<td>required</td>
				<td>Badge content</td>
			</tr>
		</tbody>
	</table>
</Paper>

<style>
	h1 { margin-bottom: 0.5rem; }
	p { color: var(--pui-color-text-secondary); margin-bottom: 1.5rem; }
	.demo-row { display: flex; flex-wrap: wrap; gap: 0.75rem; align-items: center; }
	.demo-section { margin-bottom: 1rem; }
	.value-display { font-size: 0.875rem; color: var(--pui-color-text-muted); font-family: monospace; margin-top: 0.5rem; }
	.props-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
	.props-table th, .props-table td { text-align: left; padding: 0.75rem; border-bottom: 1px solid var(--pui-color-border); }
	.props-table th { font-weight: 600; background: var(--pui-color-bg-secondary); }
	.props-table code { background: var(--pui-color-bg-tertiary); padding: 0.125rem 0.375rem; border-radius: 4px; font-size: 0.8125rem; }
</style>
