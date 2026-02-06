<script lang="ts">
	import { Paper, Button } from '$lib/index.js';

	let titleClickCount = $state(0);
</script>

<h1>Paper</h1>
<p>Paper is a container component with an optional title bar and content area. It provides consistent visual structure throughout the application.</p>

<Paper title="Basic Paper">
	<p style="margin: 0;">This is a basic Paper component with a title. It provides a bordered container with a header and body section.</p>
</Paper>

<Paper>
	<p style="margin: 0;">This Paper has no title, just body content. It acts as a simple card-like container.</p>
</Paper>

<Paper title="With Title Buttons">
	{#snippet buttons()}
		<Button size="xs" variant="primary-subtle">Action</Button>
		<Button size="xs" variant="secondary-subtle">Edit</Button>
	{/snippet}
	<p style="margin: 0;">This Paper has action buttons in the title bar. Use the <code>buttons</code> snippet to add controls.</p>
</Paper>

<Paper title="No Padding" noPadding>
	<div style="background: var(--pui-bg-hover); padding: 1rem;">
		<p style="margin: 0;">This Paper uses <code>noPadding</code> so the content extends to the edges. Useful for tables or full-width content.</p>
	</div>
</Paper>

<Paper title="Clickable Title" onTitleClick={() => titleClickCount++}>
	<p style="margin: 0;">Click the title bar above. It has an <code>onTitleClick</code> handler.</p>
	<div class="value-display">Title clicks: {titleClickCount}</div>
</Paper>

<Paper title="Custom Min Height" minBodyHeight="150px">
	<p style="margin: 0;">This Paper has a minimum body height of 150px set via the <code>minBodyHeight</code> prop.</p>
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
				<td><code>title</code></td>
				<td><code>string</code></td>
				<td><code>''</code></td>
				<td>Title text displayed in the header</td>
			</tr>
			<tr>
				<td><code>class</code></td>
				<td><code>string</code></td>
				<td><code>''</code></td>
				<td>Additional CSS classes on the outer container</td>
			</tr>
			<tr>
				<td><code>containerClass</code></td>
				<td><code>string</code></td>
				<td><code>''</code></td>
				<td>CSS classes on the container wrapper</td>
			</tr>
			<tr>
				<td><code>bodyClass</code></td>
				<td><code>string</code></td>
				<td><code>''</code></td>
				<td>CSS classes on the body section</td>
			</tr>
			<tr>
				<td><code>titleClass</code></td>
				<td><code>string</code></td>
				<td><code>''</code></td>
				<td>CSS classes on the title bar</td>
			</tr>
			<tr>
				<td><code>noPadding</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Remove padding from the body</td>
			</tr>
			<tr>
				<td><code>noGap</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Remove gap between child elements</td>
			</tr>
			<tr>
				<td><code>minBodyHeight</code></td>
				<td><code>string</code></td>
				<td><code>undefined</code></td>
				<td>Minimum height for the body section</td>
			</tr>
			<tr>
				<td><code>onTitleClick</code></td>
				<td><code>() => void</code></td>
				<td><code>undefined</code></td>
				<td>Click handler for the title bar</td>
			</tr>
			<tr>
				<td><code>buttons</code></td>
				<td><code>Snippet</code></td>
				<td><code>undefined</code></td>
				<td>Action buttons in the title bar</td>
			</tr>
			<tr>
				<td><code>children</code></td>
				<td><code>Snippet</code></td>
				<td><code>undefined</code></td>
				<td>Main body content</td>
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
</style>
