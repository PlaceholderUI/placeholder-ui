<script lang="ts">
	import { Pagination, Paper } from '$lib/index.js';

	let currentPage = $state(1);
	let manyPagesPage = $state(1);
</script>

<h1>Pagination</h1>
<p>Pagination helps users navigate through large sets of data split across multiple pages.</p>

<Paper title="Basic Usage">
	<Pagination bind:selectedPage={currentPage} totalPages={10} />
	<div class="value-display">selectedPage: {currentPage}</div>
</Paper>

<Paper title="Many Pages">
	<Pagination bind:selectedPage={manyPagesPage} totalPages={50} />
	<div class="value-display">selectedPage: {manyPagesPage}</div>
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
				<td><code>selectedPage</code></td>
				<td><code>number</code></td>
				<td><code>1</code></td>
				<td>Bindable current page number</td>
			</tr>
			<tr>
				<td><code>totalPages</code></td>
				<td><code>number</code></td>
				<td><code>undefined</code></td>
				<td>Total number of pages</td>
			</tr>
			<tr>
				<td><code>onPageChange</code></td>
				<td><code>(page: number) => void</code></td>
				<td><code>undefined</code></td>
				<td>Callback when the page changes</td>
			</tr>
			<tr>
				<td><code>maxPageButtons</code></td>
				<td><code>number</code></td>
				<td><code>8</code></td>
				<td>Maximum number of page buttons to display</td>
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
