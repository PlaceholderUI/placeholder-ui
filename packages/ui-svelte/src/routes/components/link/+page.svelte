<script lang="ts">
	import { Table, Link, Paper } from '$lib/index.js';
	import type { Column } from '$lib/index.js';

	let clickCount = $state(0);
	let lastClicked = $state('');

	function handleClick(event: MouseEvent) {
		clickCount++;
		lastClicked = new Date().toLocaleTimeString();
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
		{ prop: 'href', type: 'string', default: 'undefined', description: 'URL to navigate to' },
		{ prop: 'rel', type: 'string', default: '\'\'', description: 'Link relationship attribute' },
		{ prop: 'target', type: '\'_self\' | \'_blank\'', default: 'undefined', description: 'Where to open the linked URL' },
		{ prop: 'class', type: 'string', default: '\'\'', description: 'Additional CSS classes' },
		{ prop: 'children', type: 'Snippet', default: 'undefined', description: 'Link content' },
		{ prop: 'onclick', type: '(event: MouseEvent) => void', default: 'undefined', description: 'Click event handler (runs before navigation)' },
	];
</script>

<h1>Link</h1>
<p>A navigation link component that integrates with SvelteKit's client-side routing for internal links.</p>

<div class="vstack">
	<Paper title="Basic Usage">
		<div class="demo-row">
			<Link href="/">Home</Link>
			<Link href="/components/button">Button Component</Link>
			<Link href="/components/dialog">Dialog Component</Link>
		</div>
	</Paper>

	<Paper title="External Link">
		<div class="demo-row">
			<Link href="https://svelte.dev" target="_blank">Svelte (opens in new tab)</Link>
			<Link href="https://github.com" target="_blank">GitHub (opens in new tab)</Link>
		</div>
	</Paper>

	<Paper title="With Click Handler">
		<div class="demo-row">
			<Link href="#" onclick={handleClick}>Click me (tracked)</Link>
		</div>
		<div class="value-display">Click count: {clickCount}{lastClicked ? ` | Last click: ${lastClicked}` : ''}</div>
	</Paper>

	<Paper title="Props">
		<Table columns={propsColumns} rows={propsRows} striped hover={false} />
	</Paper>
</div>

<style>
	h1 { margin-bottom: 0.5rem; }
	p { color: var(--pui-color-text-secondary); margin-bottom: 1.5rem; }
	.demo-row { display: flex; flex-wrap: wrap; gap: 0.75rem; align-items: center; }
	.value-display { font-size: 0.875rem; color: var(--pui-color-text-muted); font-family: monospace; margin-top: 0.5rem; }</style>
