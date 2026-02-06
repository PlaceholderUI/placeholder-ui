<script lang="ts">
	import { Link, Paper } from '$lib/index.js';

	let clickCount = $state(0);
	let lastClicked = $state('');

	function handleClick(event: MouseEvent) {
		clickCount++;
		lastClicked = new Date().toLocaleTimeString();
	}
</script>

<h1>Link</h1>
<p>A navigation link component that integrates with SvelteKit's client-side routing for internal links.</p>

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
				<td><code>href</code></td>
				<td><code>string</code></td>
				<td><code>undefined</code></td>
				<td>URL to navigate to</td>
			</tr>
			<tr>
				<td><code>rel</code></td>
				<td><code>string</code></td>
				<td><code>''</code></td>
				<td>Link relationship attribute</td>
			</tr>
			<tr>
				<td><code>target</code></td>
				<td><code>'_self' | '_blank'</code></td>
				<td><code>undefined</code></td>
				<td>Where to open the linked URL</td>
			</tr>
			<tr>
				<td><code>class</code></td>
				<td><code>string</code></td>
				<td><code>''</code></td>
				<td>Additional CSS classes</td>
			</tr>
			<tr>
				<td><code>children</code></td>
				<td><code>Snippet</code></td>
				<td><code>undefined</code></td>
				<td>Link content</td>
			</tr>
			<tr>
				<td><code>onclick</code></td>
				<td><code>(event: MouseEvent) => void</code></td>
				<td><code>undefined</code></td>
				<td>Click event handler (runs before navigation)</td>
			</tr>
		</tbody>
	</table>
</Paper>

<style>
	h1 { margin-bottom: 0.5rem; }
	p { color: var(--pui-color-text-secondary); margin-bottom: 1.5rem; }
	.demo-row { display: flex; flex-wrap: wrap; gap: 0.75rem; align-items: center; }
	.value-display { font-size: 0.875rem; color: var(--pui-color-text-muted); font-family: monospace; margin-top: 0.5rem; }
	.props-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
	.props-table th, .props-table td { text-align: left; padding: 0.75rem; border-bottom: 1px solid var(--pui-color-border); }
	.props-table th { font-weight: 600; background: var(--pui-color-bg-secondary); }
	.props-table code { background: var(--pui-color-bg-tertiary); padding: 0.125rem 0.375rem; border-radius: 4px; font-size: 0.8125rem; }
</style>
