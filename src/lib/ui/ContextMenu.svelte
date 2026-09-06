<script lang="ts" module>
	export interface ContextMenuItem {
		/** Text label. Omit when `separator` is set. */
		label?: string;
		/** Optional leading icon (raw SVG string, e.g. `iconEdit`). */
		icon?: string;
		/** Invoked when the item is clicked. Ignored for separators/parents. */
		action?: () => void;
		/** Non-interactive, dimmed. */
		disabled?: boolean;
		/** Render in the destructive/danger colour. */
		danger?: boolean;
		/** Render a divider instead of a clickable row. */
		separator?: boolean;
		/** Right-aligned shortcut hint (e.g. `⌘C`, `Del`). Purely visual. */
		shortcut?: string;
		/** Nested submenu items — opens on hover. */
		children?: ContextMenuItem[];
	}

	export interface ContextMenuProps {
		/** Whether the menu is open (bindable). */
		open?: boolean;
		/** Viewport X coordinate to anchor at (usually `event.clientX`). */
		x?: number;
		/** Viewport Y coordinate to anchor at (usually `event.clientY`). */
		y?: number;
		/** The items to display. */
		items?: ContextMenuItem[];
		/** Minimum width of the (top-level) menu. */
		minWidth?: string;
		/** Additional CSS classes on the menu container. */
		class?: string;
		/** Fires whenever the menu closes (dismissed or item chosen). */
		onClose?: () => void;
	}
</script>

<script lang="ts">
	import ContextMenuList from './ContextMenuList.svelte';
	import { topLayer } from '$lib/util/Floating.js';

	let {
		open = $bindable(false),
		x = 0,
		y = 0,
		items = [],
		minWidth = '180px',
		class: classes = '',
		onClose
	}: ContextMenuProps = $props();

	let menuEl = $state<HTMLElement | null>(null);
	let posX = $state(0);
	let posY = $state(0);
	let placed = $state(false);

	function close() {
		if (!open) return;
		open = false;
		onClose?.();
	}

	function handleSelect(item: ContextMenuItem) {
		item.action?.();
		close();
	}

	// Clamp the menu into the viewport once it's measured. Hidden until placed to avoid a flash.
	$effect(() => {
		if (!open) {
			placed = false;
			return;
		}
		if (!menuEl) return;
		const anchorX = x;
		const anchorY = y;
		const rect = menuEl.getBoundingClientRect();
		const vw = window.innerWidth;
		const vh = window.innerHeight;
		let nx = anchorX;
		let ny = anchorY;
		if (nx + rect.width > vw - 8) nx = Math.max(8, vw - rect.width - 8);
		if (ny + rect.height > vh - 8) ny = Math.max(8, vh - rect.height - 8);
		posX = nx;
		posY = ny;
		placed = true;
	});

	// Dismiss the menu on outside interaction while it's open.
	$effect(() => {
		if (!open) return;
		const onDown = (e: MouseEvent) => {
			if (menuEl && !menuEl.contains(e.target as Node)) close();
		};
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				e.preventDefault();
				close();
			}
		};
		const onScroll = (e: Event) => {
			if (!menuEl || !menuEl.contains(e.target as Node)) close();
		};
		const onResize = () => close();
		document.addEventListener('mousedown', onDown, true);
		document.addEventListener('keydown', onKey, true);
		window.addEventListener('scroll', onScroll, true);
		window.addEventListener('resize', onResize);
		return () => {
			document.removeEventListener('mousedown', onDown, true);
			document.removeEventListener('keydown', onKey, true);
			window.removeEventListener('scroll', onScroll, true);
			window.removeEventListener('resize', onResize);
		};
	});
</script>

{#if open}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<!-- Promoted to the top layer so overflow/transform ancestors cannot clip it. Unlike a
	     body portal, the menu stays inside its subtree, so it remains usable inside a
	     modal Dialog (everything outside an open modal is inert). -->
	<div
		use:topLayer
		bind:this={menuEl}
		class="pui-ctxmenu {classes}"
		style="left: {posX}px; top: {posY}px; visibility: {placed ? 'visible' : 'hidden'};"
		oncontextmenu={(e) => e.preventDefault()}
	>
		<ContextMenuList {items} onSelect={handleSelect} {minWidth} depth={0} />
	</div>
{/if}

<style>
	.pui-ctxmenu {
		position: fixed;
		z-index: 2000;
	}
</style>
