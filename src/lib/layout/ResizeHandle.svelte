<script lang="ts" module>
	let panelCount = 0;
</script>

<script lang="ts">
	import { tick, untrack } from 'svelte';

	export type ResizeHandleOrientation = 'vertical' | 'horizontal';
	export type ResizeHandleSide = 'start' | 'end';

	export interface ResizeHandleProps {
		/** Panel size in px, or null to leave it to the layout (bindable) */
		size?: number | null;
		/** The element the handle resizes; measured, never styled (given an id if it has none) */
		panel: HTMLElement | undefined;
		/** Whether the panel is before ('start') or after ('end') the handle */
		side?: ResizeHandleSide;
		/** 'vertical' between columns (sets width) or 'horizontal' between rows (sets height) */
		orientation?: ResizeHandleOrientation;
		/** Minimum size (px) */
		min?: number;
		/** Maximum size (px); without one, the panel's container is the limit */
		max?: number;
		/** Size restored by double-click or Enter */
		defaultSize?: number | null;
		/** Distance per arrow key press (px); Shift moves four times as far */
		step?: number;
		/** Thickness of the grab area */
		thickness?: string;
		/** Accessible name for the handle */
		ariaLabel: string;
		/** Native tooltip text */
		title?: string;
		/** Disable dragging and keyboard resizing */
		disabled?: boolean;
		/** Callback on every size change, including each frame of a drag */
		onresize?: (size: number | null) => void;
		/** Callback once a drag, key press or reset settles the size */
		onresizeend?: (size: number | null) => void;
		/** Additional CSS classes */
		class?: string;
	}

	let {
		size = $bindable(null),
		panel,
		side = 'start',
		orientation = 'vertical',
		min = 0,
		max = Infinity,
		defaultSize = null,
		step = 16,
		thickness = '1rem',
		ariaLabel,
		title,
		disabled = false,
		onresize,
		onresizeend,
		class: className = ''
	}: ResizeHandleProps = $props();

	const vertical = $derived(orientation === 'vertical');

	let handle: HTMLDivElement;
	/** The panel's size as drawn, which a layout may hold below `size`. */
	let drawn = $state(0);
	/** The panel's container along the drag axis: the accessible maximum when `max` sets none. */
	let room = $state(0);
	let panelId = $state('');
	let dragging = $state(false);
	/** The one pointer driving the drag; any other (a second finger) is ignored. */
	let activePointer: number | null = null;
	let downAt = 0;
	let moved = false;
	/** The pointer's offset from the panel's edge when the drag began, so the edge doesn't jump. */
	let grab = 0;
	let pointer = 0;
	let startSize: number | null = null;
	let frame = 0;

	const limit = $derived(Number.isFinite(max) ? max : Math.max(min, room));

	$effect(() => {
		const element = panel;
		const alongX = vertical;
		if (!element) return;
		const container = element.parentElement;

		const observer = new ResizeObserver(() => {
			drawn = lengthOf(element, alongX);
			if (container) room = lengthOf(container, alongX);
		});
		observer.observe(element);
		if (container) observer.observe(container);
		return () => observer.disconnect();
	});

	// aria-controls needs the panel's id; give it one only if it has none.
	$effect(() => {
		const element = panel;
		if (!element) return;
		if (element.id) {
			panelId = element.id;
			return;
		}

		const id = `pui-resize-panel-${++panelCount}`;
		element.id = id;
		panelId = id;
		return () => {
			if (element.id === id) element.removeAttribute('id');
		};
	});

	// The page-wide cursor, and iframes made transparent to the pointer so they can't take the drag.
	$effect(() => {
		if (!dragging) return;
		const root = document.documentElement;
		const resizing = vertical ? 'pui-resizing-x' : 'pui-resizing-y';
		root.classList.add(resizing);
		return () => root.classList.remove(resizing);
	});

	$effect(() => {
		if (disabled && dragging) untrack(() => void endDrag(false));
	});

	$effect(() => () => cancelAnimationFrame(frame));

	function clamp(px: number): number {
		return Math.round(Math.min(max, Math.max(min, px)));
	}

	function lengthOf(element: Element, alongX: boolean): number {
		const rect = element.getBoundingClientRect();
		return alongX ? rect.width : rect.height;
	}

	function coordinate(event: PointerEvent): number {
		return vertical ? event.clientX : event.clientY;
	}

	/** Where the panel starts and ends along the drag axis. */
	function extent(element: HTMLElement): [number, number] {
		const rect = element.getBoundingClientRect();
		return vertical ? [rect.left, rect.right] : [rect.top, rect.bottom];
	}

	function sizeAt(element: HTMLElement, position: number): number {
		const [start, end] = extent(element);
		const edge = position - grab;
		return side === 'start' ? edge - start : end - edge;
	}

	function resetSize(): number | null {
		return defaultSize === null ? null : clamp(defaultSize);
	}

	function update(next: number | null) {
		if (next === size) return;
		size = next;
		onresize?.(next);
	}

	/** Applies a size, then reports the one drawn: a layout can hold the panel below what was asked. */
	async function commit(next: number | null) {
		update(next);
		if (next === null) {
			onresizeend?.(null);
			return;
		}

		await tick();
		const settled = panel ? clamp(lengthOf(panel, vertical)) : next;
		update(settled);
		onresizeend?.(settled);
	}

	function isActive(event: PointerEvent): boolean {
		return dragging && event.pointerId === activePointer;
	}

	function handlePointerDown(event: PointerEvent) {
		if (disabled || dragging || !panel || event.button !== 0) return;
		event.preventDefault();
		handle.focus();
		handle.setPointerCapture(event.pointerId);

		const [start, end] = extent(panel);
		activePointer = event.pointerId;
		pointer = downAt = coordinate(event);
		grab = pointer - (side === 'start' ? end : start);
		startSize = size;
		moved = false;
		dragging = true;
	}

	function handlePointerMove(event: PointerEvent) {
		if (!isActive(event)) return;
		pointer = coordinate(event);
		moved ||= pointer !== downAt;
		frame ||= requestAnimationFrame(() => {
			frame = 0;
			if (dragging && !disabled && panel) update(clamp(sizeAt(panel, pointer)));
		});
	}

	function handlePointerEnd(event: PointerEvent) {
		if (isActive(event)) void endDrag(true);
	}

	async function endDrag(keep: boolean) {
		if (!dragging) return;
		dragging = false;
		cancelAnimationFrame(frame);
		frame = 0;

		const id = activePointer;
		activePointer = null;
		if (id !== null && handle?.hasPointerCapture(id)) handle.releasePointerCapture(id);

		if (!keep) {
			update(startSize);
			return;
		}
		if (moved && panel) await commit(clamp(sizeAt(panel, pointer)));
	}

	function handleKeydown(event: KeyboardEvent) {
		if (disabled) return;

		if (event.key === 'Escape') {
			if (dragging) {
				event.preventDefault();
				void endDrag(false);
			}
			return;
		}
		if (dragging) return;

		// The keys move the handle, so a panel after it grows as the handle moves back.
		const grow = side === 'start' ? 1 : -1;
		const distance = (event.shiftKey ? step * 4 : step) * grow;
		const current = panel ? lengthOf(panel, vertical) : drawn;
		const back = vertical ? 'ArrowLeft' : 'ArrowUp';
		const forward = vertical ? 'ArrowRight' : 'ArrowDown';
		let next: number | null;

		if (event.key === back) next = clamp(current - distance);
		else if (event.key === forward) next = clamp(current + distance);
		else if (event.key === 'Home') next = clamp(min);
		else if (event.key === 'End') next = clamp(limit);
		else if (event.key === 'Enter') next = resetSize();
		else return;

		event.preventDefault();
		void commit(next);
	}

	function handleDoubleClick() {
		if (!disabled && !dragging) void commit(resetSize());
	}
</script>

<!-- A focusable separator is a widget (the WAI-ARIA window splitter); Svelte's rules see a static role. -->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div
	bind:this={handle}
	class="pui-resize-handle {className}"
	class:horizontal={!vertical}
	class:dragging
	class:disabled
	style="--resize-handle-thickness: {thickness};"
	role="separator"
	aria-orientation={orientation}
	aria-label={ariaLabel}
	aria-controls={panelId || undefined}
	aria-valuenow={Math.round(drawn)}
	aria-valuemin={Math.round(min)}
	aria-valuemax={Math.round(limit)}
	aria-disabled={disabled || undefined}
	tabindex={disabled ? -1 : 0}
	{title}
	onpointerdown={handlePointerDown}
	onpointermove={handlePointerMove}
	onpointerup={handlePointerEnd}
	onpointercancel={handlePointerEnd}
	onlostpointercapture={handlePointerEnd}
	ondblclick={handleDoubleClick}
	onkeydown={handleKeydown}
>
	<span class="grip"></span>
</div>

<style>
	/* A flex or grid item between the panels; it stretches to their length. */
	.pui-resize-handle {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		align-self: stretch;
		width: var(--resize-handle-thickness);
		cursor: col-resize;
		touch-action: none;
		border-radius: var(--ui-radius-sm);
	}

	.pui-resize-handle.horizontal {
		flex-direction: row;
		width: auto;
		height: var(--resize-handle-thickness);
		cursor: row-resize;
	}

	/* The line the panel's edge follows. */
	.pui-resize-handle::before {
		content: '';
		position: absolute;
		top: 0;
		bottom: 0;
		left: calc(50% - 1px);
		width: 2px;
		border-radius: 999px;
		transition: background-color 0.15s ease;
	}

	.pui-resize-handle.horizontal::before {
		top: calc(50% - 1px);
		bottom: auto;
		left: 0;
		right: 0;
		width: auto;
		height: 2px;
	}

	/* Sticky, so it stays in view beside a panel taller than the window. */
	.grip {
		position: sticky;
		top: 1rem;
		bottom: 1rem;
		width: 0.25rem;
		height: 2.5rem;
		border-radius: 999px;
		background-color: var(--placeholder-color);
		transition: background-color 0.15s ease;
	}

	.horizontal .grip {
		position: static;
		width: 2.5rem;
		height: 0.25rem;
	}

	.pui-resize-handle:not(.disabled):hover::before,
	.pui-resize-handle:focus-visible::before,
	.pui-resize-handle.dragging::before,
	.pui-resize-handle:not(.disabled):hover .grip,
	.pui-resize-handle:focus-visible .grip,
	.pui-resize-handle.dragging .grip {
		background-color: var(--ui-accent);
	}

	.pui-resize-handle:focus-visible {
		outline: 2px solid var(--ui-focus-color);
		outline-offset: -2px;
	}

	.pui-resize-handle.disabled {
		cursor: default;
		opacity: 0.5;
	}

	:global(html.pui-resizing-x),
	:global(html.pui-resizing-x *) {
		cursor: col-resize !important;
		user-select: none;
	}

	:global(html.pui-resizing-y),
	:global(html.pui-resizing-y *) {
		cursor: row-resize !important;
		user-select: none;
	}

	:global(html.pui-resizing-x iframe),
	:global(html.pui-resizing-y iframe) {
		pointer-events: none;
	}
</style>
