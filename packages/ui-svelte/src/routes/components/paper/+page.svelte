<script lang="ts">
	import { Table, Paper, Button } from '$lib/index.js';
	import type { Column } from '$lib/index.js';

	let titleClickCount = $state(0);

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
		{ prop: 'title', type: 'string', default: '\'\'', description: 'Title text displayed in the header' },
		{ prop: 'class', type: 'string', default: '\'\'', description: 'Additional CSS classes on the outer container' },
		{ prop: 'containerClass', type: 'string', default: '\'\'', description: 'CSS classes on the container wrapper' },
		{ prop: 'bodyClass', type: 'string', default: '\'\'', description: 'CSS classes on the body section' },
		{ prop: 'titleClass', type: 'string', default: '\'\'', description: 'CSS classes on the title bar' },
		{ prop: 'noPadding', type: 'boolean', default: 'false', description: 'Remove padding from the body' },
		{ prop: 'noGap', type: 'boolean', default: 'false', description: 'Remove gap between child elements' },
		{ prop: 'minBodyHeight', type: 'string', default: 'undefined', description: 'Minimum height for the body section' },
		{ prop: 'onTitleClick', type: '() => void', default: 'undefined', description: 'Click handler for the title bar' },
		{ prop: 'buttons', type: 'Snippet', default: 'undefined', description: 'Action buttons in the title bar' },
		{ prop: 'children', type: 'Snippet', default: 'undefined', description: 'Main body content' },
	];
</script>

<h1>Paper</h1>
<p>Paper is a container component with an optional title bar and content area. It provides consistent visual structure throughout the application.</p>

<div class="vstack">
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
		<Table columns={propsColumns} rows={propsRows} striped hover={false} />
	</Paper>
</div>

<style>
	h1 { margin-bottom: 0.5rem; }
	p { color: var(--pui-color-text-secondary); margin-bottom: 1.5rem; }
	.value-display { font-size: 0.875rem; color: var(--pui-color-text-muted); font-family: monospace; margin-top: 0.5rem; }</style>
