<script lang="ts">
	import { Table, Paper, Button, type Column } from '$lib/index.js';

	interface Person {
		name: string;
		email: string;
		role: string;
		status: string;
	}

	const columns: Column<Person>[] = [
		{ key: 'name', label: 'Name', sortable: true },
		{ key: 'email', label: 'Email', sortable: true },
		{ key: 'role', label: 'Role', sortable: true },
		{ key: 'status', label: 'Status' }
	];

	const rows: Person[] = [
		{ name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'Active' },
		{ name: 'Bob Smith', email: 'bob@example.com', role: 'Editor', status: 'Active' },
		{ name: 'Carol Williams', email: 'carol@example.com', role: 'Viewer', status: 'Inactive' },
		{ name: 'David Brown', email: 'david@example.com', role: 'Editor', status: 'Active' },
		{ name: 'Eva Martinez', email: 'eva@example.com', role: 'Admin', status: 'Active' },
		{ name: 'Frank Davis', email: 'frank@example.com', role: 'Viewer', status: 'Inactive' }
	];

	let clickedRow = $state('');

	function handleRowClick(row: Person, index: number) {
		clickedRow = `${row.name} (row ${index})`;
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
		{ prop: 'columns', type: 'Column[]', default: '[]', description: 'Column definitions with key, label, sortable, width, align, render' },
		{ prop: 'rows', type: 'any[]', default: '[]', description: 'Array of row data objects' },
		{ prop: 'searchable', type: 'boolean', default: 'false', description: 'Show search input above table' },
		{ prop: 'searchPlaceholder', type: 'string', default: '\'Search...\'', description: 'Placeholder text for search input' },
		{ prop: 'striped', type: 'boolean', default: 'false', description: 'Apply striped row styling' },
		{ prop: 'hover', type: 'boolean', default: 'true', description: 'Highlight rows on hover' },
		{ prop: 'emptyMessage', type: 'string', default: '\'No data available\'', description: 'Message shown when rows is empty' },
		{ prop: 'loading', type: 'boolean', default: 'false', description: 'Show loading indicator' },
		{ prop: 'onrowclick', type: '(row, index) => void', default: 'undefined', description: 'Callback when a row is clicked' },
		{ prop: 'buttons', type: 'Snippet<[T, number]>', default: 'undefined', description: 'Action buttons snippet per row' },
	];
</script>

<h1>Table</h1>
<p>A data table component with sorting, searching, and customizable columns.</p>

<div class="vstack">
	<Paper title="Basic Usage">
		<Table {columns} {rows} />
	</Paper>

	<Paper title="Searchable">
		<Table {columns} {rows} searchable searchPlaceholder="Search people..." />
	</Paper>

	<Paper title="Striped">
		<Table {columns} {rows} striped />
	</Paper>

	<Paper title="Loading State">
		<Table {columns} rows={[]} loading />
	</Paper>

	<Paper title="Empty State">
		<Table {columns} rows={[]} emptyMessage="No users found matching your criteria." />
	</Paper>

	<Paper title="Row Click">
		<Table {columns} {rows} onrowclick={handleRowClick} />
		<div class="value-display">Clicked: {clickedRow || 'none'}</div>
	</Paper>

	<Paper title="With Action Buttons">
		<Table {columns} {rows}>
			{#snippet buttons(row: Person, index: number)}
				<Button size="xs" variant="primary-subtle" onclick={() => (clickedRow = `Edit: ${row.name}`)}>Edit</Button>
				<Button size="xs" variant="danger-subtle" onclick={() => (clickedRow = `Delete: ${row.name}`)}>Delete</Button>
			{/snippet}
		</Table>
		<div class="value-display">Action: {clickedRow || 'none'}</div>
	</Paper>

	<Paper title="Props">
		<Table columns={propsColumns} rows={propsRows} striped hover={false} />
	</Paper>
</div>

<style>
	h1 { margin-bottom: 0.5rem; }
	p { color: var(--pui-color-text-secondary); margin-bottom: 1.5rem; }
	.value-display { font-size: 0.875rem; color: var(--pui-color-text-muted); font-family: monospace; margin-top: 0.5rem; }</style>
