<script lang="ts">
	import Table from '$lib/ui/Table.svelte';
	import type { Column } from '$lib/ui/Table.svelte';
	import Paper from '$lib/display/Paper.svelte';
	import Badge from '$lib/ui/Badge.svelte';
	import Loader from '$lib/ui/Loader.svelte';
	import type { ButtonVariant } from '$lib/ui/ButtonVariant.js';
	import {
		sampleUsers,
		manyUsers,
		basicColumns,
		customColumns,
		products,
		productColumns,
		type User
	} from './sampleData.js';
	import Checkbox from '$lib/form/Checkbox.svelte';

	// State for demo
	let showSearchable = $state(true);
	let showStriped = $state(false);
	let showHover = $state(true);

	// State for checkbox selection demo
	let selectedUsers = $state<User[]>([]);

	// State for pagination demo
	let currentPage = $state(1);

	// Server-side sorting demo — the "server" owns the row order, the table only reports intent
	let serverRows = $state<User[]>([...sampleUsers]);
	let serverLoading = $state(false);
	let serverSortKey = $state<string | null>(null);
	let serverSortDirection = $state<'asc' | 'desc'>('asc');
	let lastRequest = $state('GET /api/users');
	let requestTimer: ReturnType<typeof setTimeout>;

	function fetchSortedUsers(key: string, direction: 'asc' | 'desc') {
		lastRequest = `GET /api/users?sort=${key}&order=${direction}`;
		serverLoading = true;
		clearTimeout(requestTimer);
		// Stand-in for a round trip — a real app would await fetch() here
		requestTimer = setTimeout(() => {
			serverRows = [...sampleUsers].sort((a, b) => {
				const comparison = String(a[key as keyof User]).localeCompare(
					String(b[key as keyof User]),
					undefined,
					{ numeric: true }
				);
				return direction === 'asc' ? comparison : -comparison;
			});
			serverLoading = false;
		}, 800);
	}

	// Example with snippet cells rendering real components
	interface ProjectRow {
		id: number;
		name: string;
		status: string;
		statusVariant: ButtonVariant;
		description: string;
	}

	const projectRows: ProjectRow[] = [
		{
			id: 1,
			name: 'Project Alpha',
			status: 'Active',
			statusVariant: 'accent',
			description: 'Main development project'
		},
		{
			id: 2,
			name: 'Project Beta',
			status: 'Pending',
			statusVariant: 'secondary',
			description: 'Awaiting approval'
		},
		{
			id: 3,
			name: 'Project Gamma',
			status: 'Completed',
			statusVariant: 'tertiary',
			description: 'Successfully delivered'
		}
	];

	const projectColumns: Column<ProjectRow>[] = [
		{ key: 'id', label: 'ID', sortable: true, width: '80px' },
		{ key: 'name', label: 'Project Name', sortable: true },
		{ key: 'status', label: 'Status', align: 'center', cell: statusCell },
		{ key: 'description', label: 'Description' }
	];

	// Expandable rows demo: ACL-style entries where groups lazy-load their members
	interface AclEntry {
		id: string;
		name: string;
		type: 'group' | 'user';
		access: 'Full Access' | 'Read/Write' | 'Read Only';
	}

	const aclEntries: AclEntry[] = [
		{ id: 'g-litigation', name: 'Litigation Team', type: 'group', access: 'Full Access' },
		{ id: 'g-partners', name: 'Partners', type: 'group', access: 'Read/Write' },
		{ id: 'u-jdoe', name: 'John Doe', type: 'user', access: 'Full Access' },
		{ id: 'g-support', name: 'Document Support', type: 'group', access: 'Read Only' },
		{ id: 'u-asmith', name: 'Alice Smith', type: 'user', access: 'Read Only' }
	];

	const groupMembers: Record<string, string[]> = {
		'g-litigation': ['John Doe', 'Alice Smith', 'Bob Johnson', 'Carol White'],
		'g-partners': ['Diana Martinez', 'Edward Lee'],
		'g-support': ['Fiona Taylor', 'George Harris', 'Helen Clark']
	};

	const accessVariants: Record<AclEntry['access'], ButtonVariant> = {
		'Full Access': 'accent',
		'Read/Write': 'tertiary',
		'Read Only': 'secondary'
	};

	let memberCache = $state<Record<string, { loading: boolean; members: string[] }>>({});
	let expandedAcl = $state<string[]>([]);

	function handleAclExpand(row: AclEntry, _index: number, expanded: boolean) {
		if (!expanded || memberCache[row.id]) return;
		memberCache[row.id] = { loading: true, members: [] };
		// Simulate an on-demand API fetch
		setTimeout(() => {
			memberCache[row.id] = { loading: false, members: groupMembers[row.id] ?? [] };
		}, 1200);
	}

	const aclColumns: Column<AclEntry>[] = [
		{ key: 'name', label: 'Name', sortable: true },
		{ key: 'type', label: 'Type', width: '120px', cell: typeCell },
		{ key: 'access', label: 'Access', align: 'center', width: '140px', cell: accessCell }
	];
</script>

{#snippet statusCell({ value, row }: { value: any; row: ProjectRow; index: number })}
	<Badge variant={row.statusVariant} size="sm">{value}</Badge>
{/snippet}

{#snippet typeCell({ value }: { value: any; row: AclEntry; index: number })}
	<Badge variant={value === 'group' ? 'primary-subtle' : 'auto-subtle'} size="sm">
		{value === 'group' ? 'Group' : 'User'}
	</Badge>
{/snippet}

{#snippet accessCell({ value }: { value: any; row: AclEntry; index: number })}
	<Badge variant={accessVariants[value as AclEntry['access']]} size="sm">{value}</Badge>
{/snippet}

{#snippet aclDetail(entry: AclEntry)}
	{@const cache = memberCache[entry.id]}
	<div class="member-panel">
		{#if !cache || cache.loading}
			<div class="member-loading">
				<Loader sizeOverride="20px" />
				<span>Loading members…</span>
			</div>
		{:else if cache.members.length === 0}
			<em>No members found.</em>
		{:else}
			<ul class="member-list">
				{#each cache.members as member}
					<li>{member}</li>
				{/each}
			</ul>
		{/if}
	</div>
{/snippet}

<h1>Table Component Examples</h1>

<div class="vstack">
	<Paper title="Basic Table">
		<Table columns={basicColumns} rows={sampleUsers} class="basic-table" />
	</Paper>

	<Paper title="Checkbox Selection">
		<p class="description">
			Click on any row to toggle its selection. The header checkbox selects/deselects all visible
			rows.
		</p>
		<p class="selection-count">
			<strong>{selectedUsers.length} of {sampleUsers.length} selected</strong>
		</p>
		<Table
			columns={basicColumns}
			rows={sampleUsers}
			selectable={true}
			rowKey="id"
			bind:selectedRows={selectedUsers}
			searchable={true}
			striped={true}
			hover={true}
		/>
	</Paper>

	<Paper title="Table with Search">
		<Table
			columns={basicColumns}
			rows={sampleUsers}
			searchable={true}
			searchPlaceholder="Search users..."
		/>
	</Paper>

	<Paper title="Table with Buttons Snippet">
		<Table columns={basicColumns} rows={sampleUsers} searchable={true} striped={true} hover={true}>
			{#snippet buttons(row, index)}
				<div class="action-buttons">
					<button class="btn-edit" onclick={() => alert(`Edit ${row.name}`)}> Edit </button>
					<button class="btn-delete" onclick={() => alert(`Delete ${row.name}`)}> Delete </button>
				</div>
			{/snippet}
		</Table>
	</Paper>

	<Paper title="Table with Custom Rendering">
		<Table
			columns={customColumns}
			rows={sampleUsers}
			searchable={true}
			striped={true}
			hover={true}
		/>
	</Paper>

	<Paper title="Snippet Cells (Advanced Rendering)">
		<p class="description">
			Set <code>cell</code> in a column definition to render cell content with a snippet — real
			components, event handlers and full row access, with values escaped by Svelte. This supersedes
			the deprecated <code>render</code> function, which injects raw HTML via
			<code>{'{@html}'}</code> and is unsafe for untrusted data.
		</p>
		<Table columns={projectColumns} rows={projectRows} hover={true} striped={true} />
	</Paper>

	<Paper title="Expandable Rows">
		<p class="description">
			Provide an <code>expandedContent</code> snippet (plus <code>rowKey</code>) to enable row
			expansion — click anywhere on the row (or its chevron) to toggle.
			<code>canExpand</code> limits which rows are expandable, and <code>onexpand</code> fires on toggle
			— use it to lazy-load detail data. Here, group members are fetched on first expand; user rows are
			not expandable.
		</p>
		<p class="selection-count">
			<strong>{expandedAcl.length} row{expandedAcl.length === 1 ? '' : 's'} expanded</strong>
		</p>
		<Table
			columns={aclColumns}
			rows={aclEntries}
			rowKey="id"
			striped={true}
			expandedContent={aclDetail}
			canExpand={(row) => row.type === 'group'}
			onexpand={handleAclExpand}
			bind:expandedKeys={expandedAcl}
		/>
	</Paper>

	<Paper title="Paginated Table">
		<p class="description">
			Set <code>pageSize</code> to enable built-in pagination. Paging applies after search filtering
			and sorting, and searching jumps back to the first page. Bind
			<code>page</code> or use <code>onpagechange</code> to react to page changes.
		</p>
		<p class="selection-count">
			<strong>Current page: {currentPage}</strong>
		</p>
		<Table
			columns={basicColumns}
			rows={manyUsers}
			pageSize={8}
			bind:page={currentPage}
			searchable={true}
			searchPlaceholder="Search users..."
			striped={true}
		/>
	</Paper>

	<Paper title="Server-Side Sorting">
		<p class="description">
			Set <code>manualSort</code> to turn off the built-in sort — rows render in the order given —
			and use <code>onsort</code> to fetch a freshly sorted page from the server. Bind
			<code>sortKey</code> and <code>sortDirection</code> to keep the header indicator in sync (and
			to seed it from a URL or saved preference). Paginated tables reset to page 1 before
			<code>onsort</code> fires.
		</p>
		<p class="selection-count">
			<strong>Last request:</strong> <code>{lastRequest}</code>
		</p>
		<Table
			columns={basicColumns}
			rows={serverRows}
			manualSort={true}
			bind:sortKey={serverSortKey}
			bind:sortDirection={serverSortDirection}
			onsort={fetchSortedUsers}
			loading={serverLoading}
			striped={true}
		/>
	</Paper>

	<Paper title="Product Table with Formatting">
		<Table
			columns={productColumns}
			rows={products}
			searchable={true}
			searchPlaceholder="Search products..."
			striped={true}
		/>
	</Paper>

	<Paper title="Clickable Rows">
		<p class="description">
			Click on any row to see the row data. The cursor changes to pointer when hovering over rows.
		</p>
		<Table
			columns={basicColumns}
			rows={sampleUsers.slice(0, 5)}
			hover={true}
			onrowclick={(row, index) => {
				alert(`Clicked on row ${index + 1}: ${row.name} (${row.email})`);
			}}
		/>
	</Paper>

	<Paper title="Linked Rows">
		<p class="description">
			Provide <code>rowHref</code> to turn rows into links. A plain click navigates, while middle-click
			or ctrl/cmd/shift-click opens the row's URL in a new tab.
		</p>
		<Table
			columns={basicColumns}
			rows={sampleUsers.slice(0, 5)}
			hover={true}
			rowHref={(row) => `/components/table#user-${row.id}`}
		/>
	</Paper>

	<Paper title="Configurable Table">
		<div class="controls">
			<Checkbox label="Searchable" bind:checked={showSearchable} />
			<Checkbox label="Striped" bind:checked={showStriped} />
			<Checkbox label="Hover Effect" bind:checked={showHover} />
		</div>

		<Table
			columns={basicColumns}
			rows={sampleUsers}
			searchable={showSearchable}
			striped={showStriped}
			hover={showHover}
		/>
	</Paper>

	<Paper title="Empty Table">
		<Table
			columns={basicColumns}
			rows={[]}
			searchable={true}
			emptyMessage="No users found. Add some users to see them here."
		/>
	</Paper>

	<Paper title="Loading State">
		<Table columns={basicColumns} rows={[]} loading={true} />
	</Paper>
</div>

<style>
	h1 {
		margin-bottom: 2rem;
		color: var(--text-color);
	}

	:global(.badge) {
		padding: 0.25rem 0.5rem;
		border-radius: 0.25rem;
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
	}

	:global(.badge.success) {
		background-color: #10b981;
		color: white;
	}

	:global(.badge.danger) {
		background-color: #ef4444;
		color: white;
	}

	:global(.badge.warning) {
		background-color: #f59e0b;
		color: white;
	}

	:global(.badge.info) {
		background-color: #3b82f6;
		color: white;
	}

	.description {
		margin-bottom: 1rem;
		color: var(--text-muted);
		font-size: 0.875rem;
	}

	.selection-count {
		margin-bottom: 1rem;
		font-size: 0.875rem;
	}

	:global(.action-btn) {
		padding: 0.25rem 0.75rem;
		background-color: var(--accent-color);
		color: white;
		border: none;
		border-radius: 0.25rem;
		cursor: pointer;
		font-size: 0.75rem;
	}

	:global(.action-btn:hover) {
		opacity: 0.9;
	}

	.controls {
		display: flex;
		gap: 1.5rem;
		margin-bottom: 1rem;
		flex-wrap: wrap;
	}

	.member-loading {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--text-muted);
		font-size: 0.875rem;
	}

	.member-list {
		margin: 0;
		padding-left: 1.25rem;
	}

	.member-list li {
		padding: 0.125rem 0;
	}

	.action-buttons {
		display: flex;
		gap: 0.5rem;
		justify-content: center;
	}

	.btn-edit,
	.btn-delete {
		padding: 0.25rem 0.75rem;
		border: none;
		border-radius: 0.25rem;
		cursor: pointer;
		font-size: 0.75rem;
		font-weight: 500;
		transition: all 0.2s;
	}

	.btn-edit {
		background-color: var(--accent-color);
		color: white;
	}

	.btn-edit:hover {
		opacity: 0.9;
	}

	.btn-delete {
		background-color: var(--danger-bg);
		color: white;
	}

	.btn-delete:hover {
		opacity: 0.9;
	}
</style>
