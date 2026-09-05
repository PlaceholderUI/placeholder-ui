<script lang="ts">
	import Paper from '$lib/display/Paper.svelte';
	import MultiSortable from '$lib/ui/MultiSortable.svelte';
	import Icon from '$lib/icon/Icon.svelte';
	import Button from '$lib/ui/Button.svelte';
	import { iconGripVertical } from '$lib/icon/index.js';

	interface Card {
		id: string;
		title: string;
	}

	interface Column {
		id: string;
		title: string;
		cards: Card[];
	}

	const initialBoard: Column[] = [
		{
			id: 'todo',
			title: 'To Do',
			cards: [
				{ id: 'c1', title: 'Design drag/drop API' },
				{ id: 'c2', title: 'Sketch board layout' },
				{ id: 'c3', title: 'Write showcase copy' }
			]
		},
		{
			id: 'doing',
			title: 'In Progress',
			cards: [{ id: 'c4', title: 'Build MultiSortable' }]
		},
		{
			id: 'done',
			title: 'Done',
			cards: [{ id: 'c5', title: 'Audit Sortable' }]
		}
	];

	let board = $state<Column[]>(structuredClone(initialBoard));
	let lastChange = $state('');

	function resetBoard() {
		board = structuredClone(initialBoard);
		lastChange = '';
	}

	// Two-list transfer with a receive filter.
	let available = $state<string[]>(['Read', 'Write', 'Delete', 'Publish', 'Admin']);
	let granted = $state<string[]>(['Comment']);
</script>

<div class="page-header">
	<h1>MultiSortable</h1>
	<p>
		Cross-container drag-and-drop. Lists that share a <code>group</code> name exchange items with
		each other — drag a card into another column and it's removed from the source and inserted at the
		drop marker. Reordering within a list still works. Empty lists remain valid drop targets.
	</p>
</div>

<div class="vstack">
	<Paper title="Kanban board — move cards between columns">
		<p class="muted">Drag by the grip. Drop into any column, including an empty one.</p>
		<div class="board">
			{#each board as column (column.id)}
				<div class="column">
					<div class="column-head">
						<span>{column.title}</span>
						<span class="count">{column.cards.length}</span>
					</div>
					<MultiSortable
						bind:items={column.cards}
						group="kanban"
						getKey={(c) => c.id}
						handle=".grip"
						class="column-body"
						onChange={() => (lastChange = `${column.title}: ${column.cards.map((c) => c.title).join(', ') || '(empty)'}`)}
					>
						{#snippet children(card, _i, dragging)}
							<div class="card" class:dragging>
								<span class="grip">
									<Icon svg={iconGripVertical} size="16px" />
								</span>
								<span class="card-title">{card.title}</span>
							</div>
						{/snippet}
						{#snippet placeholder()}
							<span class="empty-hint">Drop here</span>
						{/snippet}
					</MultiSortable>
				</div>
			{/each}
		</div>
		<div class="actions">
			<Button variant="secondary-subtle" onclick={resetBoard}>Reset board</Button>
		</div>
		{#if lastChange}
			<p class="muted">Last change → {lastChange}</p>
		{/if}
	</Paper>

	<Paper title="Two-list transfer with a receive filter">
		<p class="muted">
			The <strong>Granted</strong> list rejects <code>Admin</code> via <code>canReceive</code>. Everything
			else moves freely both ways.
		</p>
		<div class="transfer">
			<div class="transfer-col">
				<div class="column-head"><span>Available</span></div>
				<MultiSortable bind:items={available} group="perms" getKey={(p) => p} class="perm-body">
					{#snippet children(perm)}
						<span class="perm">{perm}</span>
					{/snippet}
					{#snippet placeholder()}
						<span class="empty-hint">Drop here</span>
					{/snippet}
				</MultiSortable>
			</div>
			<div class="transfer-col">
				<div class="column-head"><span>Granted</span></div>
				<MultiSortable
					bind:items={granted}
					group="perms"
					getKey={(p) => p}
					canReceive={(p) => p !== 'Admin'}
					class="perm-body"
				>
					{#snippet children(perm)}
						<span class="perm granted">{perm}</span>
					{/snippet}
					{#snippet placeholder()}
						<span class="empty-hint">Drop here</span>
					{/snippet}
				</MultiSortable>
			</div>
		</div>
	</Paper>

	<Paper title="Notes">
		<ul>
			<li>Each list keeps its own <code>bind:items</code> — transfers write back to both.</li>
			<li>
				Lists exchange items only with others sharing the same <code>group</code> name.
			</li>
			<li>
				Positioning is computed on the container, so empty lists and the space after the last item
				are valid drop targets.
			</li>
			<li>
				<code>canReceive(item)</code> gates incoming items per list; local reordering is always allowed.
			</li>
			<li>
				Use the <code>placeholder</code> snippet to show a hint / drop affordance when a list is empty.
			</li>
			<li>
				Items animate into place when a list changes (FLIP). Tune with <code>animation</code> (ms)
				or set <code>animation={'{0}'}</code> to disable. Requires a stable <code>getKey</code>.
			</li>
			<li>
				For single-list reordering only, use <code>Sortable</code> instead.
			</li>
		</ul>
	</Paper>
</div>

<style>
	.page-header {
		margin-bottom: 1.5rem;
	}

	.page-header h1 {
		font-size: 2rem;
		font-weight: 700;
		margin: 0 0 0.5rem 0;
	}

	.muted {
		color: var(--text-muted, #888);
		font-size: 0.875rem;
	}

	.board {
		display: flex;
		gap: 1rem;
		align-items: flex-start;
		flex-wrap: wrap;
	}

	.column {
		flex: 1;
		min-width: 200px;
		background: var(--paper-title-bg);
		border: 1px solid var(--border-color);
		border-radius: 8px;
		overflow: hidden;
	}

	.column-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.5rem 0.75rem;
		font-weight: 600;
		color: var(--text-color);
		border-bottom: 1px solid var(--border-color);
	}

	.count {
		font-size: 0.75rem;
		font-weight: 500;
		color: var(--text-muted, #888);
		background: var(--paper-body-bg);
		border-radius: 999px;
		padding: 0.05rem 0.5rem;
	}

	:global(.column-body) {
		padding: 0.5rem;
		min-height: 3rem;
	}

	.card {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 0.625rem;
		background: var(--paper-body-bg);
		border: 1px solid var(--border-color);
		border-radius: 6px;
	}

	.card.dragging {
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
	}

	.grip {
		display: inline-flex;
		cursor: grab;
		color: var(--text-muted, #888);
	}

	.grip:active {
		cursor: grabbing;
	}

	.card-title {
		flex: 1;
		color: var(--text-color);
		font-size: 0.875rem;
	}

	.transfer {
		display: flex;
		gap: 1rem;
		align-items: flex-start;
		flex-wrap: wrap;
	}

	.transfer-col {
		flex: 1;
		min-width: 180px;
		background: var(--paper-title-bg);
		border: 1px solid var(--border-color);
		border-radius: 8px;
		overflow: hidden;
	}

	:global(.perm-body) {
		padding: 0.5rem;
		min-height: 3rem;
	}

	.perm {
		display: block;
		padding: 0.375rem 0.625rem;
		background: var(--paper-body-bg);
		border: 1px solid var(--border-color);
		border-radius: 6px;
		color: var(--text-color);
		font-size: 0.875rem;
		cursor: grab;
		user-select: none;
	}

	.perm:active {
		cursor: grabbing;
	}

	.perm.granted {
		background: var(--ui-accent);
		color: var(--ui-primary);
		border-color: transparent;
	}

	.empty-hint {
		color: var(--text-muted, #888);
		font-size: 0.8125rem;
		font-style: italic;
	}

	.actions {
		margin-top: 0.75rem;
	}

	code {
		font-size: 0.85em;
		padding: 0.1em 0.3em;
		background: rgba(0, 0, 0, 0.06);
		border-radius: 3px;
	}

	:global(.dark) code {
		background: rgba(255, 255, 255, 0.08);
	}
</style>
