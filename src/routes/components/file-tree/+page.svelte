<script lang="ts">
	import Paper from '$lib/display/Paper.svelte';
	import FileTree from '$lib/display/filetree/FileTree.svelte';
	import { findNode, type FileTreeNode } from '$lib/display/filetree/FileTreeNode.js';
	import type { ContextMenuItem } from '$lib/ui/ContextMenu.svelte';
	import Button from '$lib/ui/Button.svelte';
	import ActionIcon from '$lib/ui/ActionIcon.svelte';
	import Tooltip from '$lib/ui/Tooltip.svelte';
	import {
		iconEdit,
		iconCopy,
		iconTrash,
		iconPlus,
		iconFilePlus,
		iconFolderPlus,
		iconEye
	} from '$lib/icon/index.js';

	function makeInitial(): FileTreeNode[] {
		return [
			{
				id: 'src',
				name: 'src',
				type: 'folder',
				expanded: true,
				children: [
					{
						id: 'src/lib',
						name: 'lib',
						type: 'folder',
						expanded: true,
						children: [
							{ id: 'src/lib/index.ts', name: 'index.ts', type: 'file' },
							{
								id: 'src/lib/ui',
								name: 'ui',
								type: 'folder',
								children: [
									{ id: 'src/lib/ui/Button.svelte', name: 'Button.svelte', type: 'file' },
									{ id: 'src/lib/ui/Sortable.svelte', name: 'Sortable.svelte', type: 'file' }
								]
							},
							{
								id: 'src/lib/util',
								name: 'util',
								type: 'folder',
								children: [
									{ id: 'src/lib/util/DragDrop.ts', name: 'DragDrop.ts', type: 'file' },
									{ id: 'src/lib/util/ClickOutside.ts', name: 'ClickOutside.ts', type: 'file' }
								]
							}
						]
					},
					{
						id: 'src/routes',
						name: 'routes',
						type: 'folder',
						children: [
							{ id: 'src/routes/+layout.svelte', name: '+layout.svelte', type: 'file' },
							{ id: 'src/routes/+page.svelte', name: '+page.svelte', type: 'file' }
						]
					}
				]
			},
			{
				id: 'static',
				name: 'static',
				type: 'folder',
				children: [{ id: 'static/favicon.png', name: 'favicon.png', type: 'file' }]
			},
			{ id: 'package.json', name: 'package.json', type: 'file' },
			{ id: 'README.md', name: 'README.md', type: 'file' }
		];
	}

	let nodes = $state<FileTreeNode[]>(makeInitial());
	let selectedId = $state<string | undefined>(undefined);
	let log = $state<string[]>([]);
	let isDraggable = $state(true);
	let menuEnabled = $state(true);
	let actionsEnabled = $state(true);
	let actionsTrigger = $state<'selected' | 'hover' | 'always'>('selected');
	let actionsPlacement = $state<'end' | 'beside'>('end');
	let collapsible = $state(true);
	let idCounter = 0;

	function pushLog(line: string) {
		log = [`${new Date().toLocaleTimeString()}  ${line}`, ...log].slice(0, 12);
	}

	function reset() {
		nodes = makeInitial();
		selectedId = undefined;
		log = [];
	}

	// --- Context menu -------------------------------------------------------

	/** Build the menu for a given node — items differ for files vs folders. */
	function buildMenu(node: FileTreeNode): ContextMenuItem[] {
		const items: ContextMenuItem[] = [
			{ label: 'Rename', icon: iconEdit, shortcut: 'F2', action: () => renameNode(node) },
			{ label: 'Duplicate', icon: iconCopy, action: () => duplicateNode(node) }
		];

		if (node.type === 'folder') {
			items.push({
				label: 'New',
				icon: iconPlus,
				children: [
					{ label: 'File', icon: iconFilePlus, action: () => addChild(node, 'file') },
					{ label: 'Folder', icon: iconFolderPlus, action: () => addChild(node, 'folder') }
				]
			});
		}

		items.push({ separator: true });
		items.push({
			label: 'Delete',
			icon: iconTrash,
			danger: true,
			shortcut: 'Del',
			action: () => deleteNode(node)
		});
		return items;
	}

	function renameNode(node: FileTreeNode) {
		const name = window.prompt('Rename', node.name);
		if (name == null || name.trim() === '') return;
		const found = findNode(nodes, node.id);
		if (!found) return;
		found.node.name = name.trim();
		nodes = nodes;
		pushLog(`Renamed ${node.id} → ${name.trim()}`);
	}

	function duplicateNode(node: FileTreeNode) {
		const found = findNode(nodes, node.id);
		if (!found) return;
		found.parent.splice(found.index + 1, 0, cloneWithNewIds(found.node));
		nodes = nodes;
		pushLog(`Duplicated ${node.id}`);
	}

	function cloneWithNewIds(n: FileTreeNode): FileTreeNode {
		return {
			...n,
			id: `${n.id}-copy-${++idCounter}`,
			children: n.children?.map(cloneWithNewIds)
		};
	}

	function addChild(parent: FileTreeNode, type: 'file' | 'folder') {
		const found = findNode(nodes, parent.id);
		if (!found || found.node.type !== 'folder') return;
		if (!found.node.children) found.node.children = [];
		const id = `${parent.id}/new-${type}-${++idCounter}`;
		found.node.children.push({ id, name: type === 'folder' ? 'new-folder' : 'new-file', type });
		found.node.expanded = true;
		nodes = nodes;
		pushLog(`Added ${type} to ${parent.id}`);
	}

	function deleteNode(node: FileTreeNode) {
		const found = findNode(nodes, node.id);
		if (!found) return;
		found.parent.splice(found.index, 1);
		nodes = nodes;
		if (selectedId === node.id) selectedId = undefined;
		pushLog(`Deleted ${node.id}`);
	}
</script>

<div class="page-header">
	<h1>File Tree</h1>
	<p>
		Hierarchical file/folder tree with drag-and-drop. Drag a node near the top or bottom of a row to
		drop it BEFORE or AFTER as a sibling; drag onto the middle of a folder to drop it INTO. Folders
		expand automatically after hovering for a moment with a drag in progress. Right-click a row for
		a customisable context menu (Rename, Duplicate, New, Delete).
	</p>
</div>

<div class="vstack">
	<Paper title="Demo">
		<div class="grid">
			<div>
				{#snippet rowActions(node: FileTreeNode)}
					<Tooltip text="View">
						<ActionIcon
							size="16px"
							svg={iconEye}
							ariaLabel="View {node.name}"
							onclick={() => pushLog(`View: ${node.id}`)}
						/>
					</Tooltip>
					<Tooltip text="Edit">
						<ActionIcon
							size="16px"
							svg={iconEdit}
							ariaLabel="Edit {node.name}"
							onclick={() => renameNode(node)}
						/>
					</Tooltip>
					{#if node.type === 'folder'}
						<Tooltip text="New child">
							<ActionIcon
								size="16px"
								svg={iconPlus}
								ariaLabel="Add child to {node.name}"
								onclick={() => addChild(node, 'file')}
							/>
						</Tooltip>
					{/if}
				{/snippet}

				<div class="filetree-container">
					<FileTree
						bind:nodes
						bind:selectedId
						{isDraggable}
						menuItems={menuEnabled ? buildMenu : undefined}
						nodeActions={actionsEnabled ? rowActions : undefined}
						nodeActionsTrigger={actionsTrigger}
						nodeActionsPlacement={actionsPlacement}
						{collapsible}
						onSelect={(n) => pushLog(`Selected: ${n.name} (${n.id})`)}
						onDoubleClick={(n) => pushLog(`Double-clicked: ${n.name} (${n.id})`)}
						onDrop={(e) =>
							pushLog(
								`Dropped ${e.sourceId} into ${e.targetContainerId ?? '(root)'} at index ${e.index}`
							)}
					/>
				</div>

				<div class="actions">
					<label class="toggle">
						<input type="checkbox" bind:checked={isDraggable} />
						<span>Drag &amp; drop enabled</span>
					</label>
					<label class="toggle">
						<input type="checkbox" bind:checked={menuEnabled} />
						<span>Context menu enabled</span>
					</label>
					<label class="toggle">
						<input type="checkbox" bind:checked={actionsEnabled} />
						<span>Inline actions enabled</span>
					</label>
					<label class="toggle">
						<span>Show actions on</span>
						<select bind:value={actionsTrigger} disabled={!actionsEnabled}>
							<option value="selected">selected</option>
							<option value="hover">hover</option>
							<option value="always">always</option>
						</select>
					</label>
					<label class="toggle">
						<span>Actions placement</span>
						<select bind:value={actionsPlacement} disabled={!actionsEnabled}>
							<option value="end">end</option>
							<option value="beside">beside</option>
						</select>
					</label>
					<label class="toggle">
						<input type="checkbox" bind:checked={collapsible} />
						<span>Folders collapsible</span>
					</label>
					<Button
						variant="secondary-subtle"
						onclick={() => {
							selectedId = 'src/lib/util/ClickOutside.ts';
							pushLog('Programmatic select: src/lib/util/ClickOutside.ts');
						}}
					>
						Select nested file
					</Button>
					<Button variant="secondary-subtle" onclick={reset}>Reset tree</Button>
				</div>
				<p class="hint muted">Right-click any file or folder to open its context menu.</p>
			</div>
			<div class="info">
				<h4>Selected</h4>
				<p class="muted">{selectedId ?? '(none)'}</p>

				<h4>Activity</h4>
				<div class="log">
					{#each log as line, i (i)}
						<div class="log-line">{line}</div>
					{:else}
						<p class="muted">Drag a node or click a row…</p>
					{/each}
				</div>
			</div>
		</div>
	</Paper>

	<Paper title="API">
		<ul>
			<li>
				<code>nodes</code> — bindable <code>FileTreeNode[]</code>. Each node has
				<code>id</code>, <code>name</code>, <code>type</code> (<code>'file' | 'folder'</code>),
				optional <code>children</code>, <code>expanded</code>, <code>icon</code> (raw SVG), and
				<code>data</code>.
			</li>
			<li>
				<code>selectedId</code> — bindable string of the highlighted row. Setting it
				programmatically expands every ancestor folder so the selection is visible (try the "Select
				nested file" button above with the <code>util</code> folder collapsed).
			</li>
			<li>
				<code>isDraggable</code> — boolean (default <code>true</code>). When false, rows can't be
				dragged and the tree won't accept drops.
			</li>
			<li>
				<code>onSelect(node)</code> — fires on row click.
			</li>
			<li>
				<code>onDoubleClick(node)</code> — fires on row double-click (e.g. to open a file).
				<code>onSelect</code> fires first for each of the two clicks.
			</li>
			<li>
				<code>onDrop({'{'} sourceId, targetContainerId, index {'}'})</code> — fires after a drop.
				<code>sourceId</code> is the moved node's id; <code>targetContainerId</code> is the
				destination folder's id, or <code>null</code> when dropped at the root.
			</li>
			<li>
				<code>onChange(nodes)</code> — fires alongside <code>onDrop</code> with the new tree.
			</li>
			<li>
				<code>nodeContent</code> snippet — customize the label portion of each row.
			</li>
			<li>
				<code>nodeActions</code> snippet — render a trailing action bar (e.g. View / Edit / Add) for a
				row. Receives the node so actions vary per node/type. Rendered as a real sibling of the row button,
				so it can contain links and buttons and clicks won't select the row. The component positions it
				within the row — no consumer-side rect math, scroll/resize listeners, or fixed positioning — so
				it stays anchored during scroll automatically.
			</li>
			<li>
				<code>nodeActionsTrigger</code> — when the bar appears: <code>'selected'</code> (default),
				<code>'hover'</code>, or <code>'always'</code>. Hidden automatically while a drag is in
				progress.
			</li>
			<li>
				<code>nodeActionsPlacement</code> — where the bar sits: <code>'end'</code> (default) pins it
				to the row's right edge; <code>'beside'</code> places it immediately after the label, which reads
				better on full-width trees where the right edge is far from the name.
			</li>
			<li>
				<code>collapsible</code> — boolean (default <code>true</code>). When <code>false</code>,
				folders can't be collapsed: they always render expanded, the chevron is hidden, and clicking
				a folder row selects it without toggling.
			</li>
			<li>
				<code>group</code> — distinct group names prevent cross-tree drops.
			</li>
			<li>
				<code>menuItems(node)</code> — return a <code>ContextMenuItem[]</code> to show a
				customisable right-click menu for that node. Return <code>[]</code> (or omit) to keep the
				native browser menu. Each item takes <code>label</code>, optional <code>icon</code> (raw
				SVG),
				<code>action()</code>, <code>disabled</code>, <code>danger</code>, <code>shortcut</code>,
				<code>separator</code>, and <code>children</code> (nested submenu). The built-in
				<code>ContextMenu</code> handles cursor positioning, viewport clamping, and dismissal
				(click-away / <code>Esc</code> / scroll).
			</li>
			<li>
				<code>menuMinWidth</code> — minimum width of the context menu (default <code>180px</code>).
			</li>
			<li>
				<code>onContextMenu(node, event)</code> — fires on right-click before the menu opens.
			</li>
		</ul>
	</Paper>

	<Paper title="Behaviour notes">
		<ul>
			<li>Dropping a folder into one of its own descendants is blocked.</li>
			<li>Dropping in the empty space below the last node moves the item to the root.</li>
			<li>Folders auto-expand after ~600 ms of hover during a drag.</li>
			<li>The drag indicator shows a horizontal bar for before/after, dashed outline for INTO.</li>
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

	.grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1.5rem;
	}

	@media (min-width: 720px) {
		.grid {
			grid-template-columns: minmax(260px, 360px) 1fr;
		}
	}

	.info h4 {
		font-size: 0.875rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: var(--text-muted, #888);
		margin: 0 0 0.5rem 0;
	}

	.info h4 + p {
		margin-top: 0;
	}

	.actions {
		margin-top: 0.75rem;
		display: flex;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.toggle {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		font-size: 0.875rem;
		color: var(--text-color);
		cursor: pointer;
	}

	.log {
		font-family: 'Courier New', monospace;
		font-size: 0.75rem;
		padding: 0.5rem;
		background: rgba(0, 0, 0, 0.04);
		border-radius: 4px;
		max-height: 220px;
		overflow-y: auto;
	}

	:global(.dark) .log {
		background: rgba(255, 255, 255, 0.04);
	}

	.log-line {
		padding: 0.125rem 0;
	}

	.muted {
		color: var(--text-muted, #888);
		font-size: 0.875rem;
	}

	.hint {
		margin: 0.75rem 0 0 0;
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

	.filetree-container {
		border: 1px solid var(--border-color);
		border-radius: 6px;
		background: var(--paper-body-bg, transparent);
	}
</style>
