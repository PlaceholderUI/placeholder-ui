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
</script>

<h1>Table</h1>
<p>A data table component with sorting, searching, and customizable columns.</p>

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
				<td><code>columns</code></td>
				<td><code>Column[]</code></td>
				<td><code>[]</code></td>
				<td>Column definitions with key, label, sortable, width, align, render</td>
			</tr>
			<tr>
				<td><code>rows</code></td>
				<td><code>any[]</code></td>
				<td><code>[]</code></td>
				<td>Array of row data objects</td>
			</tr>
			<tr>
				<td><code>searchable</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Show search input above table</td>
			</tr>
			<tr>
				<td><code>searchPlaceholder</code></td>
				<td><code>string</code></td>
				<td><code>'Search...'</code></td>
				<td>Placeholder text for search input</td>
			</tr>
			<tr>
				<td><code>striped</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Apply striped row styling</td>
			</tr>
			<tr>
				<td><code>hover</code></td>
				<td><code>boolean</code></td>
				<td><code>true</code></td>
				<td>Highlight rows on hover</td>
			</tr>
			<tr>
				<td><code>emptyMessage</code></td>
				<td><code>string</code></td>
				<td><code>'No data available'</code></td>
				<td>Message shown when rows is empty</td>
			</tr>
			<tr>
				<td><code>loading</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Show loading indicator</td>
			</tr>
			<tr>
				<td><code>onrowclick</code></td>
				<td><code>(row, index) => void</code></td>
				<td><code>undefined</code></td>
				<td>Callback when a row is clicked</td>
			</tr>
			<tr>
				<td><code>buttons</code></td>
				<td><code>Snippet&lt;[T, number]&gt;</code></td>
				<td><code>undefined</code></td>
				<td>Action buttons snippet per row</td>
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
