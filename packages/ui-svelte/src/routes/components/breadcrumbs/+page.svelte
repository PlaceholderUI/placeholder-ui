<script lang="ts">
	import { Table, Breadcrumbs, Paper, iconHome } from '$lib/index.js';
	import type { Column } from '$lib/index.js';

	const basicItems = [
		{ label: 'Home', href: '/' },
		{ label: 'Products', href: '#' },
		{ label: 'Electronics', href: '#' },
		{ label: 'Laptops' }
	];

	const iconItems = [
		{ label: 'Home', href: '/', icon: iconHome },
		{ label: 'Components', href: '#' },
		{ label: 'Breadcrumbs' }
	];

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
		{ prop: 'items', type: 'BreadcrumbItem[]', default: '[]', description: 'Array of breadcrumb items with label and optional href' },
		{ prop: 'separator', type: 'string | Snippet', default: 'Chevron icon', description: 'Custom separator between items' },
		{ prop: 'separatorMargin', type: 'string', default: '\'0.5rem\'', description: 'Horizontal margin around separators' },
		{ prop: 'class', type: 'string', default: '\'\'', description: 'Additional CSS classes' },
		{ prop: 'children', type: 'Snippet', default: 'undefined', description: 'Custom content instead of items array' },
	];
</script>

<h1>Breadcrumbs</h1>
<p>Breadcrumbs show the current page location within a navigational hierarchy.</p>

<div class="vstack">
	<Paper title="Basic Usage">
		<Breadcrumbs items={basicItems} />
	</Paper>

	<Paper title="Custom Separator">
		<Breadcrumbs items={basicItems} separator="/" />
	</Paper>

	<Paper title="With Icon">
		<Breadcrumbs items={iconItems} />
	</Paper>

	<Paper title="Two Items">
		<Breadcrumbs items={[{ label: 'Dashboard', href: '#' }, { label: 'Settings' }]} />
	</Paper>

	<Paper title="Props">
		<Table columns={propsColumns} rows={propsRows} striped hover={false} />
	</Paper>
</div>

<style>
	h1 { margin-bottom: 0.5rem; }
	p { color: var(--pui-color-text-secondary); margin-bottom: 1.5rem; }</style>
