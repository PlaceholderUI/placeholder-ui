<script lang="ts" module>
	export interface MultiSortableProps<T> {
		/** Items in this list — bindable so reorders and transfers write back */
		items: T[];
		/** Renders each item. Receives (item, index, dragging). */
		children: import('svelte').Snippet<[T, number, boolean]>;
		/** Stable key per item — defaults to index (not safe for reordered lists with snippets that need identity) */
		getKey?: (item: T, index: number) => string | number;
		/** Layout direction */
		direction?: 'vertical' | 'horizontal';
		/** When true, items can't be dragged out of this list (drops in are still allowed) */
		disabled?: boolean;
		/** CSS selector for drag handle within each item. When set, drag starts only from this element. */
		handle?: string;
		/** Group name — lists sharing a group can move items between each other */
		group?: string;
		/** FLIP animation duration in ms when items shift (reorder, receive, or transfer out).
		 * 0 disables. Requires a stable getKey — with the default index key nothing moves. */
		animation?: number;
		/** Gate incoming items from other lists. Return false to reject. Local reorders are always allowed. */
		canReceive?: (item: T) => boolean;
		/** Rendered when the list is empty — useful as a visible drop target for the first item. */
		placeholder?: import('svelte').Snippet;
		/** Fires when this list changes (reorder, item received, or item removed by transfer out) */
		onChange?: (items: T[]) => void;
		class?: string;
	}
</script>

<script lang="ts" generics="T">
	import { flip } from 'svelte/animate';
	import { draggable, droppable, type DragContext } from '$lib/util/DragDrop.js';

	let {
		items = $bindable(),
		children,
		getKey = (_: T, i: number) => i,
		direction = 'vertical',
		disabled = false,
		handle,
		group = 'default',
		animation = 150,
		canReceive,
		placeholder,
		onChange,
		class: classes = ''
	}: MultiSortableProps<T> = $props();

	const SORTABLE_ID = Math.random().toString(36).slice(2);
	const TYPE = $derived(`pui-multisortable:${group}`);

	const reducedMotion =
		typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	const flipDuration = $derived(reducedMotion ? 0 : animation);

	interface MultiSortablePayload {
		sortableId: string;
		index: number;
		item: T;
		/** Removes the item from its source list — called by the target after inserting. */
		onRemove: () => void;
	}

	let draggingIndex = $state<number | null>(null);
	let dropIndex = $state<number | null>(null);
	let dropPosition = $state<'before' | 'after'>('before');
	let container = $state<HTMLElement>();

	function removeAt(index: number) {
		const next = items.slice();
		next.splice(index, 1);
		items = next;
		// This runs when the item is transferred to another list, which detaches the dragged
		// element from the DOM. A detached element never fires `dragend`, so onDragEnd won't
		// reset our state — clear it here or the item shifting into this slot stays faded.
		draggingIndex = null;
		dropIndex = null;
		onChange?.(next);
	}

	/** Reorder within this list (drag originated here). */
	function applyMove(from: number, target: number, position: 'before' | 'after') {
		let to = target + (position === 'after' ? 1 : 0);
		if (to > from) to--;
		if (from === to) return;
		const next = items.slice();
		const [moved] = next.splice(from, 1);
		next.splice(to, 0, moved);
		items = next;
		onChange?.(next);
	}

	/** Insert an item received from another list at the current drop marker. */
	function applyInsert(item: T, target: number | null, position: 'before' | 'after') {
		const to = target === null ? items.length : target + (position === 'after' ? 1 : 0);
		const next = items.slice();
		next.splice(to, 0, item);
		items = next;
		onChange?.(next);
	}

	function accepts(ctx: DragContext<MultiSortablePayload>): boolean {
		// Reorders from this same list are always allowed.
		if (ctx.payload.sortableId === SORTABLE_ID) return true;
		return !canReceive || canReceive(ctx.payload.item);
	}

	/**
	 * Positioning lives on the container (not per item) so empty lists, gaps, and
	 * the space after the last item are all valid drop targets. Walks the rendered
	 * item rects and picks the insertion marker from the pointer position.
	 */
	function handleDragOver(e: DragEvent, ctx: DragContext<MultiSortablePayload>) {
		if (!accepts(ctx)) return;
		const host = container;
		if (!host) return;
		const itemEls = Array.from(
			host.querySelectorAll<HTMLElement>(':scope > .pui-msortable-item')
		);
		if (itemEls.length === 0) {
			dropIndex = null;
			return;
		}
		for (let idx = 0; idx < itemEls.length; idx++) {
			const rect = itemEls[idx].getBoundingClientRect();
			const mid =
				direction === 'vertical' ? rect.top + rect.height / 2 : rect.left + rect.width / 2;
			const pointer = direction === 'vertical' ? e.clientY : e.clientX;
			if (pointer < mid) {
				dropIndex = idx;
				dropPosition = 'before';
				return;
			}
		}
		dropIndex = itemEls.length - 1;
		dropPosition = 'after';
	}

	function handleDrop(ctx: DragContext<MultiSortablePayload>) {
		if (!accepts(ctx)) return;
		if (ctx.payload.sortableId === SORTABLE_ID) {
			// Local reorder — the dragged item is guaranteed to be in this list.
			if (dropIndex !== null) applyMove(ctx.payload.index, dropIndex, dropPosition);
		} else {
			// Cross-list transfer: insert here, then have the source drop it.
			applyInsert(ctx.payload.item, dropIndex, dropPosition);
			ctx.payload.onRemove();
		}
		dropIndex = null;
	}
</script>

<div
	bind:this={container}
	class="pui-msortable {direction} {classes}"
	class:is-empty={items.length === 0}
	use:droppable={{
		accepts: TYPE,
		canDrop: (ctx) => accepts(ctx as DragContext<MultiSortablePayload>),
		onDragOver: (ctx, e) => handleDragOver(e, ctx as DragContext<MultiSortablePayload>),
		onDragLeave: () => {
			dropIndex = null;
		},
		onDrop: (ctx) => handleDrop(ctx as DragContext<MultiSortablePayload>)
	}}
>
	{#each items as item, i (getKey(item, i))}
		<div
			class="pui-msortable-item"
			class:is-dragging={draggingIndex === i}
			class:drop-before={dropIndex === i && dropPosition === 'before' && draggingIndex !== i}
			class:drop-after={dropIndex === i && dropPosition === 'after' && draggingIndex !== i}
			animate:flip={{ duration: flipDuration }}
			use:draggable={{
				payload: {
					sortableId: SORTABLE_ID,
					index: i,
					item,
					onRemove: () => removeAt(i)
				} satisfies MultiSortablePayload,
				type: TYPE,
				source: SORTABLE_ID,
				disabled,
				handle,
				onDragStart: () => {
					draggingIndex = i;
				},
				onDragEnd: () => {
					draggingIndex = null;
					dropIndex = null;
				}
			}}
		>
			{@render children(item, i, draggingIndex === i)}
		</div>
	{/each}

	{#if items.length === 0 && placeholder}
		<div class="pui-msortable-placeholder">{@render placeholder()}</div>
	{/if}
</div>

<style>
	.pui-msortable {
		display: flex;
		gap: 0.25rem;
	}

	.pui-msortable.vertical {
		flex-direction: column;
	}

	.pui-msortable.horizontal {
		flex-direction: row;
	}

	/* Keep empty lists a valid, visible drop target. */
	.pui-msortable.is-empty {
		min-height: 2.5rem;
	}

	.pui-msortable-item {
		position: relative;
		transition: opacity 0.15s ease;
	}

	.pui-msortable-item.is-dragging {
		opacity: 0.35;
	}

	.pui-msortable-item::before,
	.pui-msortable-item::after {
		content: '';
		position: absolute;
		background: var(--ui-tertiary);
		border-radius: 2px;
		opacity: 0;
		pointer-events: none;
		transition: opacity 0.1s ease;
	}

	.pui-msortable.vertical > .pui-msortable-item::before,
	.pui-msortable.vertical > .pui-msortable-item::after {
		left: 0;
		right: 0;
		height: 2px;
	}

	.pui-msortable.vertical > .pui-msortable-item::before {
		top: -2px;
	}

	.pui-msortable.vertical > .pui-msortable-item::after {
		bottom: -2px;
	}

	.pui-msortable.horizontal > .pui-msortable-item::before,
	.pui-msortable.horizontal > .pui-msortable-item::after {
		top: 0;
		bottom: 0;
		width: 2px;
	}

	.pui-msortable.horizontal > .pui-msortable-item::before {
		left: -2px;
	}

	.pui-msortable.horizontal > .pui-msortable-item::after {
		right: -2px;
	}

	.pui-msortable-item.drop-before::before {
		opacity: 1;
	}

	.pui-msortable-item.drop-after::after {
		opacity: 1;
	}

	.pui-msortable-placeholder {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		pointer-events: none;
	}
</style>
