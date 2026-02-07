<script lang="ts">
	import { Table, Pagination, Paper } from '$lib/index.js';
	import type { Column } from '$lib/index.js';

	let currentPage = $state(1);
	let manyPagesPage = $state(1);

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
		{ prop: 'selectedPage', type: 'number', default: '1', description: 'Bindable current page number' },
		{ prop: 'totalPages', type: 'number', default: 'undefined', description: 'Total number of pages' },
		{ prop: 'onPageChange', type: '(page: number) => void', default: 'undefined', description: 'Callback when the page changes' },
		{ prop: 'maxPageButtons', type: 'number', default: '8', description: 'Maximum number of page buttons to display' },
	];
</script>

<h1>Pagination</h1>
<p>Pagination helps users navigate through large sets of data split across multiple pages.</p>

<div class="vstack">
	<Paper title="Basic Usage">
		<Pagination bind:selectedPage={currentPage} totalPages={10} />
		<div class="value-display">selectedPage: {currentPage}</div>
	</Paper>

	<Paper title="Many Pages">
		<Pagination bind:selectedPage={manyPagesPage} totalPages={50} />
		<div class="value-display">selectedPage: {manyPagesPage}</div>
	</Paper>

	<Paper title="Props">
		<Table columns={propsColumns} rows={propsRows} striped hover={false} />
	</Paper>
</div>

<style>
	h1 { margin-bottom: 0.5rem; }
	p { color: var(--pui-color-text-secondary); margin-bottom: 1.5rem; }
	.value-display { font-size: 0.875rem; color: var(--pui-color-text-muted); font-family: monospace; margin-top: 0.5rem; }</style>
