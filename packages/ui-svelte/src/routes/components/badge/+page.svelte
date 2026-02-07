<script lang="ts">
	import { Table, Badge, Paper, Button } from '$lib/index.js';
	import type { Column } from '$lib/index.js';

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
		{ prop: 'variant', type: 'ButtonVariant', default: '\'primary\'', description: 'Visual style variant' },
		{ prop: 'shape', type: '\'pill\' | \'default\'', default: '\'default\'', description: 'Badge shape' },
		{ prop: 'href', type: 'string', default: 'undefined', description: 'Renders as anchor tag when set' },
		{ prop: 'loading', type: 'boolean', default: 'false', description: 'Shows loading state' },
		{ prop: 'disabled', type: 'boolean', default: 'false', description: 'Disables the badge' },
		{ prop: 'onDelete', type: '() => void', default: 'undefined', description: 'Shows delete button and calls handler' },
		{ prop: 'onClick', type: '() => void', default: 'undefined', description: 'Makes badge clickable' },
		{ prop: 'children', type: 'Snippet', default: 'required', description: 'Badge content' },
	];
</script>

<h1>Badge</h1>
<p>Small status or label indicators. Supports multiple variants, shapes, and interactive features.</p>

<div class="vstack">
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
		<Table columns={propsColumns} rows={propsRows} striped hover={false} />
	</Paper>
</div>

<style>
	h1 { margin-bottom: 0.5rem; }
	p { color: var(--pui-color-text-secondary); margin-bottom: 1.5rem; }
	.demo-row { display: flex; flex-wrap: wrap; gap: 0.75rem; align-items: center; }
	.demo-section { margin-bottom: 1rem; }
	.value-display { font-size: 0.875rem; color: var(--pui-color-text-muted); font-family: monospace; margin-top: 0.5rem; }</style>
