<script lang="ts" module>
	export interface SortableProps<T> {
		/** Items to render — bindable so reorders write back */
		items: T[];
		/** Renders each item. Receives (item, index, dragging). */
		children: import('svelte').Snippet<[T, number, boolean]>;
		/** Stable key per item — defaults to index (not safe for reordered lists with snippets that need identity) */
		getKey?: (item: T, index: number) => string | number;
		/** Layout direction */
		direction?: 'vertical' | 'horizontal';
		/** When true, dragging is disabled */
		disabled?: boolean;
		/** CSS selector for drag handle within each item. When set, drag starts only from this element. */
		handle?: string;
		/** Group name — scopes this list's drag type. Note: Sortable is single-list reorder only; to move
		 * items between containers use MultiSortable, whose grouped lists exchange items. */
		group?: string;
		/** FLIP animation duration in ms as items shift during a drag. 0 disables. Requires a stable
		 * getKey — with the default index key, reordering swaps content in place and nothing moves. */
		animation?: number;
		/** Fires when the order changes */
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
		onChange,
		class: classes = ''
	}: SortableProps<T> = $props();

	const SORTABLE_ID = Math.random().toString(36).slice(2);
	const TYPE = $derived(`pui-sortable:${group}`);

	const reducedMotion =
		typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	const flipDuration = $derived(reducedMotion ? 0 : animation);

	interface SortablePayload {
		sortableId: string;
		index: number;
	}

	let draggingIndex = $state<number | null>(null);
	let container = $state<HTMLElement>();
	/** Order at drag start — restored if the drag is cancelled (Esc or dropped outside the list). */
	let dragSnapshot: T[] | null = null;
	let dropped = false;

	function isOwnDrag(ctx: DragContext<SortablePayload>) {
		return ctx.payload.sortableId === SORTABLE_ID;
	}

	/**
	 * Live reorder: instead of showing a drop marker, the dragged item moves in the array
	 * as the pointer crosses item midpoints and FLIP animates everything into place. The
	 * target slot is the number of midpoints (dragged item excluded) the pointer has
	 * passed — comparing that against the current index is what keeps this stable while
	 * displaced items are still animating under the pointer.
	 */
	function handleDragOver(e: DragEvent, ctx: DragContext<SortablePayload>) {
		if (!isOwnDrag(ctx) || draggingIndex === null || !container) return;
		const els = container.querySelectorAll<HTMLElement>(':scope > .pui-sortable-item');
		const pointer = direction === 'vertical' ? e.clientY : e.clientX;
		let target = 0;
		for (let idx = 0; idx < els.length; idx++) {
			if (idx === draggingIndex) continue;
			const rect = els[idx].getBoundingClientRect();
			const mid =
				direction === 'vertical' ? rect.top + rect.height / 2 : rect.left + rect.width / 2;
			if (pointer > mid) target++;
		}
		if (target === draggingIndex) return;
		const next = items.slice();
		const [moved] = next.splice(draggingIndex, 1);
		next.splice(target, 0, moved);
		items = next;
		draggingIndex = target;
	}

	function handleDrop(ctx: DragContext<SortablePayload>) {
		if (!isOwnDrag(ctx)) return;
		dropped = true;
		const snapshot = dragSnapshot;
		if (snapshot && items.some((item, idx) => item !== snapshot[idx])) {
			onChange?.(items);
		}
	}
</script>

<div
	bind:this={container}
	class="pui-sortable {direction} {classes}"
	use:droppable={{
		accepts: TYPE,
		canDrop: (ctx) => isOwnDrag(ctx as DragContext<SortablePayload>),
		onDragOver: (ctx, e) => handleDragOver(e, ctx as DragContext<SortablePayload>),
		onDrop: (ctx) => handleDrop(ctx as DragContext<SortablePayload>)
	}}
>
	{#each items as item, i (getKey(item, i))}
		<div
			class="pui-sortable-item"
			class:is-dragging={draggingIndex === i}
			animate:flip={{ duration: flipDuration }}
			use:draggable={{
				payload: { sortableId: SORTABLE_ID, index: i } satisfies SortablePayload,
				type: TYPE,
				source: SORTABLE_ID,
				disabled,
				handle,
				onDragStart: () => {
					draggingIndex = i;
					dragSnapshot = items.slice();
					dropped = false;
				},
				onDragEnd: () => {
					if (!dropped && dragSnapshot) items = dragSnapshot;
					draggingIndex = null;
					dragSnapshot = null;
				}
			}}
		>
			{@render children(item, i, draggingIndex === i)}
		</div>
	{/each}
</div>

<style>
	.pui-sortable {
		display: flex;
		gap: 0.25rem;
	}

	.pui-sortable.vertical {
		flex-direction: column;
	}

	.pui-sortable.horizontal {
		flex-direction: row;
	}

	.pui-sortable-item {
		position: relative;
		transition: opacity 0.15s ease;
	}

	.pui-sortable-item.is-dragging {
		opacity: 0.35;
	}
</style>
