<script lang="ts">
	import Icon from '$lib/icon/Icon.svelte';
	import { iconChevronRight, iconFolder, iconFile } from '$lib/icon/index.js';
	import { draggable, droppable, type DragContext } from '$lib/util/DragDrop.js';
	import type { FileTreeNode } from './FileTreeNode.js';
	import type { Snippet } from 'svelte';
	import { fly } from 'svelte/transition';
	import Self from './FileTreeItem.svelte';

	export type DropZone = 'before' | 'inside' | 'after' | null;

	interface Props {
		node: FileTreeNode;
		depth: number;
		dragType: string;
		selectedId?: string;
		/** When false, the row cannot be dragged and won't accept drops */
		isDraggable?: boolean;
		/** Called when this row is clicked (selection) */
		onSelect?: (node: FileTreeNode) => void;
		/** Called when this row is double-clicked */
		onDoubleClick?: (node: FileTreeNode) => void;
		/** Called when the user wants to expand/collapse a folder */
		onToggle?: (node: FileTreeNode) => void;
		/** Called when a drag drops onto/around this row. Position 'inside' is only valid for folders. */
		onMove?: (sourceId: string, targetId: string, position: 'before' | 'inside' | 'after') => void;
		/** Called when this row is right-clicked */
		onContextMenu?: (node: FileTreeNode, event: MouseEvent) => void;
		/** Optional snippet to customize node label area */
		nodeContent?: Snippet<[FileTreeNode]>;
		/** Optional snippet rendering a trailing action bar for the row */
		nodeActions?: Snippet<[FileTreeNode]>;
		/** When the action bar appears */
		nodeActionsTrigger?: 'selected' | 'hover' | 'always';
		/** Where the action bar sits: pinned to the row end, or beside the label */
		nodeActionsPlacement?: 'end' | 'beside';
		/** When false, folders can't be collapsed and always render expanded */
		collapsible?: boolean;
		/** When true, the label gets a title attribute (native tooltip) with the node name */
		showTitles?: boolean;
		/** True while any row in the tree is being dragged */
		dragging?: boolean;
		/** Notifies the tree when this row starts/ends dragging */
		onDragState?: (dragging: boolean) => void;
	}

	let {
		node,
		depth,
		dragType,
		selectedId,
		isDraggable = true,
		onSelect,
		onDoubleClick,
		onToggle,
		onMove,
		onContextMenu,
		nodeContent,
		nodeActions,
		nodeActionsTrigger = 'selected',
		nodeActionsPlacement = 'end',
		collapsible = true,
		showTitles = false,
		dragging = false,
		onDragState
	}: Props = $props();

	let dropZone = $state<DropZone>(null);
	let hovered = $state(false);
	let hoverExpandTimer: ReturnType<typeof setTimeout> | null = null;

	const showActions = $derived(
		!!nodeActions &&
			!dragging &&
			(nodeActionsTrigger === 'always' ||
				(nodeActionsTrigger === 'selected' && selectedId === node.id) ||
				(nodeActionsTrigger === 'hover' && hovered))
	);

	const isFolder = $derived(node.type === 'folder');
	const hasChildren = $derived(isFolder && (node.children?.length ?? 0) > 0);
	const expanded = $derived(!collapsible || !!node.expanded);

	interface TreePayload {
		sourceId: string;
	}

	function computeZone(e: DragEvent, el: HTMLElement): DropZone {
		const rect = el.getBoundingClientRect();
		const y = e.clientY - rect.top;
		const h = rect.height;
		if (!isFolder) {
			return y < h / 2 ? 'before' : 'after';
		}
		// Folders have three zones: top quarter, middle (into), bottom quarter
		if (y < h * 0.25) return 'before';
		if (y > h * 0.75) return 'after';
		return 'inside';
	}

	function clearHoverExpand() {
		if (hoverExpandTimer) {
			clearTimeout(hoverExpandTimer);
			hoverExpandTimer = null;
		}
	}

	function scheduleHoverExpand() {
		if (!isFolder || expanded) return;
		clearHoverExpand();
		hoverExpandTimer = setTimeout(() => {
			onToggle?.(node);
			hoverExpandTimer = null;
		}, 600);
	}
</script>

<div class="ft-node-wrap" style="--depth: {depth}">
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="ft-row-wrap"
		class:selected={selectedId === node.id}
		class:actions-beside={nodeActionsPlacement === 'beside'}
		onmouseenter={() => (hovered = true)}
		onmouseleave={() => (hovered = false)}
	>
		<button
			type="button"
			class="ft-row"
			class:drop-before={dropZone === 'before'}
			class:drop-after={dropZone === 'after'}
			class:drop-inside={dropZone === 'inside'}
			onclick={() => {
				onSelect?.(node);
				// Expand on row click, but never collapse — collapsing is chevron-only.
				if (isFolder && collapsible && !expanded) onToggle?.(node);
			}}
			ondblclick={() => onDoubleClick?.(node)}
			oncontextmenu={(e) => onContextMenu?.(node, e)}
			use:draggable={{
				payload: { sourceId: node.id } satisfies TreePayload,
				type: dragType,
				source: node.id,
				disabled: !isDraggable,
				onDragStart: () => onDragState?.(true),
				onDragEnd: () => {
					dropZone = null;
					clearHoverExpand();
					onDragState?.(false);
				}
			}}
			use:droppable={{
				accepts: dragType,
				disabled: !isDraggable,
				canDrop: (ctx: DragContext<TreePayload>) => ctx.payload.sourceId !== node.id,
				onDragOver: (_, e) => {
					const zone = computeZone(e, e.currentTarget as HTMLElement);
					if (zone !== dropZone) {
						dropZone = zone;
						if (zone === 'inside') scheduleHoverExpand();
						else clearHoverExpand();
					}
				},
				onDragLeave: () => {
					dropZone = null;
					clearHoverExpand();
				},
				onDrop: (ctx: DragContext<TreePayload>) => {
					const zone = dropZone;
					dropZone = null;
					clearHoverExpand();
					if (!zone) return;
					onMove?.(ctx.payload.sourceId, node.id, zone);
				}
			}}
		>
			<span class="ft-indent">
				{#each Array(depth) as _, i (i)}
					<span class="ft-indent-line"></span>
				{/each}
			</span>
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<span
				class="ft-chevron"
				class:invisible={!isFolder || !collapsible}
				class:open={expanded}
				onclick={(e) => {
					if (!isFolder || !collapsible) return;
					e.stopPropagation();
					onToggle?.(node);
				}}
				ondblclick={(e) => {
					if (isFolder && collapsible) e.stopPropagation();
				}}
			>
				<Icon svg={iconChevronRight} size="14px" />
			</span>
			<span class="ft-icon">
				<Icon svg={node.icon ?? (isFolder ? iconFolder : iconFile)} size="16px" />
			</span>
			{#if nodeContent}
				{@render nodeContent(node)}
			{:else}
				<span class="ft-label" title={showTitles ? node.name : undefined}>{node.name}</span>
			{/if}
		</button>

		{#if showActions}
			<div class="ft-actions" transition:fly={{ x: 6, duration: 180 }}>
				{@render nodeActions?.(node)}
			</div>
		{/if}
	</div>

	{#if isFolder && expanded && node.children}
		<div class="ft-children">
			{#each node.children as child (child.id)}
				<Self
					node={child}
					depth={depth + 1}
					{dragType}
					{selectedId}
					{isDraggable}
					{onSelect}
					{onDoubleClick}
					{onToggle}
					{onMove}
					{onContextMenu}
					{nodeContent}
					{nodeActions}
					{nodeActionsTrigger}
					{nodeActionsPlacement}
					{collapsible}
					{showTitles}
					{dragging}
					{onDragState}
				/>
			{/each}
		</div>
	{/if}
</div>

<style>
	.ft-node-wrap {
		display: contents;
	}

	.ft-row-wrap {
		position: relative;
		display: flex;
		align-items: center;
		border-left: 3px solid transparent;
		border-radius: 0 3px 3px 0;
		transition: background-color 0.15s ease;
	}

	.ft-row-wrap:hover {
		background-color: rgba(var(--ui-primary-rgbc), 0.08);
	}

	:global(.dark) .ft-row-wrap:hover {
		background-color: rgba(var(--ui-primary-rgbc), 0.2);
	}

	.ft-row-wrap.selected {
		background-color: rgba(var(--ui-accent-rgbc), 0.2);
		border-left-color: var(--ui-accent);
	}

	:global(.dark) .ft-row-wrap.selected {
		background-color: rgba(var(--ui-primary-rgbc), 0.3);
		border-left-color: var(--ui-primary);
	}

	.ft-row {
		position: relative;
		display: flex;
		align-items: center;
		gap: 0.25rem;
		flex: 1 1 auto;
		min-width: 0;
		padding: 0.375rem 0.5rem;
		background: none;
		border: 0;
		color: var(--text-color);
		font-size: 0.875rem;
		font-weight: 500;
		text-align: left;
		cursor: pointer;
		user-select: none;
		transition: color 0.15s ease;
	}

	/* 'beside' placement: the row shrinks to its content so the actions sit
	   immediately after the label instead of at the far right of the row. */
	.ft-row-wrap.actions-beside .ft-row {
		flex: 0 1 auto;
	}

	.ft-row-wrap.actions-beside .ft-label {
		flex: 0 1 auto;
	}

	.ft-actions {
		display: flex;
		align-items: center;
		flex-shrink: 0;
		gap: 0.125rem;
		padding-right: 0.5rem;
		padding-left: 0.25rem;
	}

	.ft-indent {
		display: inline-flex;
		flex-shrink: 0;
	}

	.ft-indent-line {
		display: inline-block;
		width: 14px;
		height: 100%;
		border-left: 1px solid var(--border-color);
		margin-right: 2px;
	}

	.ft-chevron {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 16px;
		flex-shrink: 0;
		cursor: pointer;
		border-radius: 3px;
		transition: transform 0.12s ease;
	}

	.ft-chevron:not(.invisible):hover {
		background-color: rgba(var(--ui-primary-rgbc), 0.15);
	}

	.ft-chevron.open {
		transform: rotate(90deg);
	}

	.ft-chevron.invisible {
		visibility: hidden;
	}

	.ft-icon {
		display: inline-flex;
		flex-shrink: 0;
		color: var(--ui-primary);
	}

	:global(.dark) .ft-icon {
		color: var(--ui-accent);
	}

	.ft-label {
		flex: 1;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.ft-row.drop-before::before,
	.ft-row.drop-after::after {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		height: 2px;
		background: var(--ui-tertiary);
		pointer-events: none;
	}

	.ft-row.drop-before::before {
		top: -1px;
	}

	.ft-row.drop-after::after {
		bottom: -1px;
	}

	.ft-row.drop-inside {
		outline: 2px dashed var(--ui-tertiary);
		outline-offset: -2px;
	}

	.ft-children {
		display: flex;
		flex-direction: column;
	}
</style>
