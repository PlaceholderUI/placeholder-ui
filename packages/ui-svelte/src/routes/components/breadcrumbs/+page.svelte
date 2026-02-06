<script lang="ts">
	import { Breadcrumbs, Paper, iconHome } from '$lib/index.js';

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
</script>

<h1>Breadcrumbs</h1>
<p>Breadcrumbs show the current page location within a navigational hierarchy.</p>

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
				<td><code>items</code></td>
				<td><code>BreadcrumbItem[]</code></td>
				<td><code>[]</code></td>
				<td>Array of breadcrumb items with label and optional href</td>
			</tr>
			<tr>
				<td><code>separator</code></td>
				<td><code>string | Snippet</code></td>
				<td>Chevron icon</td>
				<td>Custom separator between items</td>
			</tr>
			<tr>
				<td><code>separatorMargin</code></td>
				<td><code>string</code></td>
				<td><code>'0.5rem'</code></td>
				<td>Horizontal margin around separators</td>
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
				<td>Custom content instead of items array</td>
			</tr>
		</tbody>
	</table>
</Paper>

<style>
	h1 { margin-bottom: 0.5rem; }
	p { color: var(--pui-color-text-secondary); margin-bottom: 1.5rem; }
	.props-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
	.props-table th, .props-table td { text-align: left; padding: 0.75rem; border-bottom: 1px solid var(--pui-color-border); }
	.props-table th { font-weight: 600; background: var(--pui-color-bg-secondary); }
	.props-table code { background: var(--pui-color-bg-tertiary); padding: 0.125rem 0.375rem; border-radius: 4px; font-size: 0.8125rem; }
</style>
