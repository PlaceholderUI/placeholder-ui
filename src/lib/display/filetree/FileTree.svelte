<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { FileTreeNode } from './FileTreeNode.js';
	import type { ContextMenuItem } from '$lib/ui/ContextMenu.svelte';

	export interface FileTreeDropEvent {
		/** Id of the node that was dragged */
		sourceId: string;
		/** Id of the destination container (folder). Null when dropped at the tree root. */
		targetContainerId: string | null;
		/** Insertion position within the destination container */
		index: number;
	}

	export interface FileTreeProps {
		/** Tree data — bindable so drag/drop reorders write back */
		nodes: FileTreeNode[];
		/**
		 * Currently selected node id (bindable). Setting it programmatically expands
		 * every ancestor folder so the selected row is visible.
		 */
		selectedId?: string;
		/** Custom drag group — distinct trees with different groups won't move items between each other */
		group?: string;
		/** Enable drag-and-drop reordering. Default true. */
		isDraggable?: boolean;
		/** Renders the label portion of a row. Receives the node. */
		nodeContent?: Snippet<[FileTreeNode]>;
		/**
		 * Renders a trailing action bar for a row (e.g. View / Edit / Add buttons).
		 * Called with the node so actions can vary per node/type.
		 * Rendered as a real sibling of the row button — so it may safely contain
		 * interactive elements (links, buttons) and clicks won't select the row.
		 */
		nodeActions?: Snippet<[FileTreeNode]>;
		/**
		 * When the action bar appears: `'selected'` (default), `'hover'`, or `'always'`.
		 * The bar is hidden automatically while a drag is in progress.
		 */
		nodeActionsTrigger?: 'selected' | 'hover' | 'always';
		/**
		 * Where the action bar sits within the row:
		 * `'end'` (default) pins it to the row's right edge;
		 * `'beside'` places it immediately after the label — useful for
		 * full-width trees where the right edge is far from the name.
		 */
		nodeActionsPlacement?: 'end' | 'beside';
		/**
		 * When `false`, folders cannot be collapsed — they always render expanded
		 * and clicking a folder row selects it without toggling. Default `true`.
		 */
		collapsible?: boolean;
		/**
		 * When `true`, each row's label gets a `title` attribute with the node name,
		 * so truncated names show a native tooltip on hover. Default `false`.
		 */
		showTitles?: boolean;
		/**
		 * Returns the context-menu items shown when a node is right-clicked.
		 * Return `[]` (or omit the prop) to leave the native browser menu in place.
		 * Called with the right-clicked node, so items can vary per node/type.
		 */
		menuItems?: (node: FileTreeNode) => ContextMenuItem[];
		/** Minimum width of the context menu. */
		menuMinWidth?: string;
		onSelect?: (node: FileTreeNode) => void;
		/** Fires when a node is double-clicked (e.g. to open a file). A double-click also fires `onSelect` first. */
		onDoubleClick?: (node: FileTreeNode) => void;
		/** Fires when a node is right-clicked, before the menu opens. Call `preventDefault()` yourself only if you also omit `menuItems`. */
		onContextMenu?: (node: FileTreeNode, event: MouseEvent) => void;
		/** Fires after a successful drag/drop. Receives the moved id and the destination container id. */
		onDrop?: (event: FileTreeDropEvent) => void;
		/** Fires after any change to the tree (currently only drag/drop). Receives the new tree. */
		onChange?: (nodes: FileTreeNode[]) => void;
		class?: string;
	}
</script>

<script lang="ts">
	import { untrack } from 'svelte';
	import FileTreeItem from './FileTreeItem.svelte';
	import { expandTo, findNode, isAncestor, moveNode } from './FileTreeNode.js';
	import { droppable, type DragContext } from '$lib/util/DragDrop.js';
	import ContextMenu from '$lib/ui/ContextMenu.svelte';

	let {
		nodes = $bindable(),
		selectedId = $bindable(undefined),
		group = 'default',
		isDraggable = true,
		nodeContent,
		nodeActions,
		nodeActionsTrigger = 'selected',
		nodeActionsPlacement = 'end',
		collapsible = true,
		showTitles = false,
		menuItems,
		menuMinWidth = '180px',
		onSelect,
		onDoubleClick,
		onContextMenu,
		onDrop,
		onChange,
		class: classes = ''
	}: FileTreeProps = $props();

	let menuOpen = $state(false);
	/** True while any row is being dragged — used to hide inline node actions. */
	let dragging = $state(false);
	let menuX = $state(0);
	let menuY = $state(0);
	let menuList = $state<ContextMenuItem[]>([]);

	function handleContextMenu(node: FileTreeNode, event: MouseEvent) {
		onContextMenu?.(node, event);
		if (!menuItems) return;
		const list = menuItems(node);
		if (!list || list.length === 0) return;
		event.preventDefault();
		// Highlight the row that owns the menu.
		selectedId = node.id;
		menuList = list;
		menuX = event.clientX;
		menuY = event.clientY;
		menuOpen = true;
	}

	// Reveal the selection: whenever selectedId changes (e.g. set programmatically by
	// the caller), expand every ancestor folder so the selected row is visible.
	// Only selectedId is tracked — collapsing a parent of the current selection
	// afterwards is respected until the selection changes again.
	$effect(() => {
		const id = selectedId;
		if (id === undefined) return;
		untrack(() => {
			if (expandTo(nodes, id)) nodes = nodes;
		});
	});

	const dragType = $derived(`pui-filetree:${group}`);

	function handleSelect(node: FileTreeNode) {
		selectedId = node.id;
		onSelect?.(node);
	}

	function handleToggle(node: FileTreeNode) {
		// Mutate in place — caller's binding sees the change because we reassign the array.
		const found = findNode(nodes, node.id);
		if (!found) return;
		found.node.expanded = !found.node.expanded;
		nodes = nodes;
	}

	function handleMove(sourceId: string, targetId: string, position: 'before' | 'inside' | 'after') {
		if (!isDraggable) return;
		if (sourceId === targetId) return;
		if (isAncestor(nodes, sourceId, targetId)) return;

		const targetFound = findNode(nodes, targetId);
		if (!targetFound) return;

		let parentId: string | null;
		let index: number;

		if (position === 'inside') {
			if (targetFound.node.type !== 'folder') return;
			parentId = targetId;
			index = -1;
			if (!targetFound.node.expanded) targetFound.node.expanded = true;
		} else {
			// before / after: insert as sibling of the target
			const targetParent = findParentOf(nodes, targetId);
			parentId = targetParent ? targetParent.id : null;
			index = targetFound.index + (position === 'after' ? 1 : 0);
		}

		const next = moveNode(nodes, sourceId, { parentId, index });
		if (next !== nodes) {
			nodes = next;
			onDrop?.({ sourceId, targetContainerId: parentId, index });
			onChange?.(next);
		}
	}

	function findParentOf(tree: FileTreeNode[], id: string): FileTreeNode | null {
		for (const n of tree) {
			if (n.children?.some((c) => c.id === id)) return n;
			if (n.children) {
				const found = findParentOf(n.children, id);
				if (found) return found;
			}
		}
		return null;
	}

	function handleRootDrop(ctx: DragContext<{ sourceId: string }>) {
		if (!isDraggable) return;
		const sourceId = ctx.payload.sourceId;
		const next = moveNode(nodes, sourceId, { parentId: null, index: -1 });
		if (next !== nodes) {
			nodes = next;
			onDrop?.({ sourceId, targetContainerId: null, index: next.length - 1 });
			onChange?.(next);
		}
	}
</script>

<div
	class="pui-filetree {classes}"
	use:droppable={{
		accepts: isDraggable ? dragType : '__never__',
		onDrop: (ctx) => handleRootDrop(ctx as DragContext<{ sourceId: string }>)
	}}
>
	{#each nodes as node (node.id)}
		<FileTreeItem
			{node}
			depth={0}
			{dragType}
			{selectedId}
			{isDraggable}
			onSelect={handleSelect}
			{onDoubleClick}
			onToggle={handleToggle}
			onMove={handleMove}
			onContextMenu={handleContextMenu}
			{nodeContent}
			{nodeActions}
			{nodeActionsTrigger}
			{nodeActionsPlacement}
			{collapsible}
			{showTitles}
			{dragging}
			onDragState={(d) => (dragging = d)}
		/>
	{/each}
	{#if nodes.length === 0}
		<div class="ft-empty">Empty</div>
	{/if}
</div>

<ContextMenu bind:open={menuOpen} x={menuX} y={menuY} items={menuList} minWidth={menuMinWidth} />

<style>
	.pui-filetree {
		display: flex;
		flex-direction: column;
		min-height: 80px;
	}

	.ft-empty {
		padding: 1rem;
		text-align: center;
		color: var(--text-muted, #888);
		font-size: 0.875rem;
		font-style: italic;
	}
</style>
