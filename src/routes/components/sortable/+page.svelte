<script lang="ts">
	import Paper from '$lib/display/Paper.svelte';
	import Sortable from '$lib/ui/Sortable.svelte';
	import Icon from '$lib/icon/Icon.svelte';
	import Button from '$lib/ui/Button.svelte';
	import { iconGripVertical, iconGripHorizontal, iconTrash } from '$lib/icon/index.js';

	interface Task {
		id: string;
		title: string;
		done: boolean;
	}

	let tasks = $state<Task[]>([
		{ id: '1', title: 'Design drag/drop API', done: true },
		{ id: '2', title: 'Build Sortable component', done: true },
		{ id: '3', title: 'Build FileTree component', done: false },
		{ id: '4', title: 'Write showcase pages', done: false },
		{ id: '5', title: 'Run type check', done: false }
	]);

	let tags = $state<string[]>(['svelte', 'typescript', 'drag-drop', 'sortable', 'tree']);

	let lastChange = $state('');

	function removeTask(id: string) {
		tasks = tasks.filter((t) => t.id !== id);
	}

	function reset() {
		tasks = [
			{ id: '1', title: 'Design drag/drop API', done: true },
			{ id: '2', title: 'Build Sortable component', done: true },
			{ id: '3', title: 'Build FileTree component', done: false },
			{ id: '4', title: 'Write showcase pages', done: false },
			{ id: '5', title: 'Run type check', done: false }
		];
	}
</script>

<div class="page-header">
	<h1>Sortable</h1>
	<p>
		Drag-and-drop reorderable list. Works with any data via a snippet — the component handles drag
		mechanics, animates items out of the way as you drag, and writes the reordered array back to the
		bound prop.
	</p>
</div>

<div class="vstack">
	<Paper title="Vertical list with drag handle">
		<p class="muted">Drag the grip handle to reorder. Click trash to delete.</p>
		<div class="task-list">
			<Sortable
				bind:items={tasks}
				getKey={(t) => t.id}
				handle=".grip"
				onChange={() => (lastChange = `Reordered: ${tasks.map((t) => t.title).join(', ')}`)}
			>
				{#snippet children(task, _i, dragging)}
					<div class="task" class:dragging>
						<span class="grip">
							<Icon svg={iconGripVertical} size="18px" />
						</span>
						<input type="checkbox" bind:checked={task.done} />
						<span class="title" class:done={task.done}>{task.title}</span>
						<button class="trash" onclick={() => removeTask(task.id)} aria-label="Remove">
							<Icon svg={iconTrash} size="16px" />
						</button>
					</div>
				{/snippet}
			</Sortable>
		</div>
		<div class="actions">
			<Button variant="secondary-subtle" onclick={reset}>Reset</Button>
		</div>
		{#if lastChange}
			<p class="muted">{lastChange}</p>
		{/if}
	</Paper>

	<Paper title="Horizontal — entire item draggable">
		<p class="muted">No handle — pick up anywhere on the chip.</p>
		<Sortable bind:items={tags} direction="horizontal" getKey={(t) => t}>
			{#snippet children(tag)}
				<span class="tag">{tag}</span>
			{/snippet}
		</Sortable>
	</Paper>

	<Paper title="Notes">
		<ul>
			<li>Bind <code>items</code> — reorders write back automatically.</li>
			<li>
				The <code>children</code> snippet receives <code>(item, index, isDragging)</code>.
			</li>
			<li>
				Use <code>handle</code> to restrict the drag region (e.g. <code>".grip"</code>).
			</li>
			<li>
				<code>direction="horizontal"</code> for chip/tag-style rows.
			</li>
			<li>
				Items reorder live as you drag, animating out of the way (FLIP). Tune with
				<code>animation</code> (ms) or set <code>animation={'{0}'}</code> to disable. Requires a
				stable <code>getKey</code>.
			</li>
			<li>Press Esc or drop outside the list to cancel — the original order is restored.</li>
			<li>
				This component is single-list reorder only. To move items between containers, use
				<code>MultiSortable</code>.
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

	.task-list {
		max-width: 480px;
	}

	.task {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.5rem 0.75rem;
		background: var(--paper-body-bg);
		border: 1px solid var(--border-color);
		border-radius: 6px;
	}

	.task.dragging {
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

	.title {
		flex: 1;
		color: var(--text-color);
	}

	.title.done {
		text-decoration: line-through;
		opacity: 0.6;
	}

	.trash {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		background: transparent;
		border: 0;
		padding: 4px;
		border-radius: 4px;
		color: var(--danger-text, #c62828);
		cursor: pointer;
	}

	.trash:hover {
		background: var(--danger-bg-subtle, rgba(198, 40, 40, 0.1));
	}

	.actions {
		margin-top: 0.75rem;
	}

	.tag {
		display: inline-block;
		padding: 0.25rem 0.75rem;
		background: var(--ui-accent);
		color: var(--ui-primary);
		border-radius: 999px;
		font-size: 0.8125rem;
		cursor: grab;
		user-select: none;
	}

	.tag:active {
		cursor: grabbing;
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
