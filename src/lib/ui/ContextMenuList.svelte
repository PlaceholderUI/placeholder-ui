<script lang="ts" module>
	import type { ContextMenuItem } from './ContextMenu.svelte';
</script>

<script lang="ts">
	import Icon from '$lib/icon/Icon.svelte';
	import { iconChevronRight } from '$lib/icon/index.js';
	import Self from './ContextMenuList.svelte';

	interface Props {
		items: ContextMenuItem[];
		/** Bubbles a chosen (leaf) item up to the root ContextMenu. */
		onSelect: (item: ContextMenuItem) => void;
		/** Nesting level — only the top level applies `minWidth`. */
		depth?: number;
		minWidth?: string;
	}

	let { items, onSelect, depth = 0, minWidth = '' }: Props = $props();

	// Only one submenu per list can be open at a time (the hovered item).
	let hoverIndex = $state<number | null>(null);
	let submenuEl = $state<HTMLElement | null>(null);
	let flipLeft = $state(false);

	function onItemEnter(i: number, item: ContextMenuItem) {
		hoverIndex = item.children?.length ? i : null;
	}

	function handleClick(item: ContextMenuItem) {
		if (item.disabled || item.separator || item.children?.length) return;
		onSelect(item);
	}

	// Decide whether the open submenu should flip to the left edge of its parent.
	// Measured from the parent <li> right edge so the result is stable once flipped.
	$effect(() => {
		if (hoverIndex === null || !submenuEl) return;
		const parent = submenuEl.parentElement;
		if (!parent) return;
		const parentRect = parent.getBoundingClientRect();
		const width = submenuEl.offsetWidth;
		flipLeft = parentRect.right + width > window.innerWidth - 4;
	});
</script>

<ul
	class="pui-ctxmenu-list"
	role="menu"
	style={depth === 0 && minWidth ? `min-width: ${minWidth};` : ''}
>
	{#each items as item, i (i)}
		{#if item.separator}
			<li class="pui-ctxmenu-sep" role="separator"></li>
		{:else}
			<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
			<li class="pui-ctxmenu-li" role="none" onmouseenter={() => onItemEnter(i, item)}>
				<button
					type="button"
					role="menuitem"
					class="pui-ctxmenu-item"
					class:danger={item.danger}
					disabled={item.disabled}
					onclick={() => handleClick(item)}
				>
					<span class="pui-ctxmenu-ico">
						{#if item.icon}<Icon svg={item.icon} size="16px" />{/if}
					</span>
					<span class="pui-ctxmenu-label">{item.label}</span>
					{#if item.shortcut}
						<span class="pui-ctxmenu-shortcut">{item.shortcut}</span>
					{/if}
					{#if item.children?.length}
						<span class="pui-ctxmenu-caret"><Icon svg={iconChevronRight} size="14px" /></span>
					{/if}
				</button>

				{#if item.children?.length && hoverIndex === i}
					<div class="pui-ctxmenu-submenu" class:flip-left={flipLeft} bind:this={submenuEl}>
						<Self items={item.children} {onSelect} depth={depth + 1} />
					</div>
				{/if}
			</li>
		{/if}
	{/each}
</ul>

<style>
	.pui-ctxmenu-list {
		list-style: none;
		margin: 0;
		padding: 0.25rem;
		background: var(--paper-body-bg, #fff);
		border: 1px solid var(--border-color);
		border-radius: 6px;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
		color: var(--text-color);
		font-size: 0.875rem;
		user-select: none;
	}

	.pui-ctxmenu-li {
		position: relative;
	}

	.pui-ctxmenu-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		width: 100%;
		padding: 0.375rem 0.6rem;
		background: none;
		border: 0;
		border-radius: 4px;
		color: inherit;
		font: inherit;
		text-align: left;
		white-space: nowrap;
		cursor: pointer;
	}

	.pui-ctxmenu-item:hover:not(:disabled),
	.pui-ctxmenu-item:focus-visible {
		background: rgba(var(--ui-primary-rgbc), 0.1);
		outline: none;
	}

	:global(.dark) .pui-ctxmenu-item:hover:not(:disabled),
	:global(.dark) .pui-ctxmenu-item:focus-visible {
		background: rgba(var(--ui-primary-rgbc), 0.28);
	}

	.pui-ctxmenu-item:disabled {
		opacity: 0.45;
		cursor: default;
	}

	.pui-ctxmenu-item.danger {
		color: var(--danger-text, #e03131);
	}

	.pui-ctxmenu-item.danger:hover:not(:disabled) {
		background: var(--danger-bg-subtle, rgba(224, 49, 49, 0.12));
	}

	.pui-ctxmenu-ico {
		display: inline-flex;
		width: 16px;
		flex-shrink: 0;
	}

	.pui-ctxmenu-label {
		flex: 1;
	}

	.pui-ctxmenu-shortcut {
		padding-left: 1.25rem;
		font-size: 0.75rem;
		color: var(--label-color, #888);
	}

	.pui-ctxmenu-caret {
		display: inline-flex;
		margin-left: auto;
		opacity: 0.7;
	}

	.pui-ctxmenu-sep {
		height: 1px;
		margin: 0.25rem 0.3rem;
		background: var(--border-color);
	}

	.pui-ctxmenu-submenu {
		position: absolute;
		top: -0.25rem;
		left: 100%;
		z-index: 1;
		padding-left: 2px;
	}

	.pui-ctxmenu-submenu.flip-left {
		left: auto;
		right: 100%;
		padding-left: 0;
		padding-right: 2px;
	}
</style>
