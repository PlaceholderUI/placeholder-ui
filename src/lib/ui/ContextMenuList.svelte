<script lang="ts" module>
	import type { ContextMenuItem } from './ContextMenu.svelte';
</script>

<script lang="ts">
	import { tick } from 'svelte';
	import Icon from '#lib/icon/Icon.svelte';
	import { iconChevronRight } from '#lib/icon/index.js';
	import Self from './ContextMenuList.svelte';

	interface Props {
		items: ContextMenuItem[];
		/** Bubbles a chosen (leaf) item up to the root ContextMenu. */
		onSelect: (item: ContextMenuItem) => void;
		/** Nesting level — only the top level applies `minWidth`. */
		depth?: number;
		minWidth?: string;
		/** Set on submenus: closes this level and returns focus to its parent item. */
		onBack?: () => void;
	}

	let { items, onSelect, depth = 0, minWidth = '', onBack }: Props = $props();
	let listEl = $state<HTMLUListElement | null>(null);

	// Only one submenu per list can be open at a time.
	let hoverIndex = $state<number | null>(null);
	let submenuEl = $state<HTMLElement | null>(null);
	let flipLeft = $state(false);

	const focusOpts = { preventScroll: true };

	function onItemEnter(i: number, item: ContextMenuItem, li: HTMLElement) {
		hoverIndex = item.children?.length ? i : null;
		// Keep focus with the pointer so a submenu closing under it never drops focus to <body>.
		// Disabled rows can't take focus, so park it on the list itself.
		const button = li.querySelector<HTMLButtonElement>(':scope > button');
		(button && !button.disabled ? button : listEl)?.focus(focusOpts);
	}

	async function openSubmenu(i: number) {
		hoverIndex = i;
		await tick();
		submenuEl?.querySelector<HTMLButtonElement>('button:not(:disabled)')?.focus(focusOpts);
	}

	function closeSubmenu(i: number) {
		hoverIndex = null;
		listEl?.children.item(i)?.querySelector<HTMLButtonElement>(':scope > button')?.focus(focusOpts);
	}

	function handleClick(item: ContextMenuItem, i: number) {
		if (item.disabled || item.separator) return;
		if (item.children?.length) {
			void openSubmenu(i);
			return;
		}
		onSelect(item);
	}

	function onKey(event: KeyboardEvent) {
		const target = event.target;
		// Only handle keys aimed at this level (the list itself or one of its own items);
		// nested lists handle their own.
		if (
			!listEl ||
			!(target instanceof HTMLElement) ||
			(target !== listEl && target.closest('[role="menu"]') !== listEl)
		)
			return;

		const handled = () => {
			event.preventDefault();
			event.stopPropagation();
		};

		if (event.key === 'ArrowRight') {
			const index = Array.from(listEl.children).indexOf(target.parentElement as Element);
			if (!items[index]?.children?.length) return;
			handled();
			void openSubmenu(index);
			return;
		}
		if ((event.key === 'ArrowLeft' || event.key === 'Escape') && onBack) {
			handled();
			onBack();
			return;
		}

		const buttons = Array.from(
			listEl.querySelectorAll<HTMLButtonElement>(':scope > li > button:not(:disabled)')
		);
		if (!buttons.length) return;
		const last = buttons.length - 1;
		const current = buttons.indexOf(target as HTMLButtonElement);
		let next: number;
		if (event.key === 'ArrowDown') next = current < 0 || current === last ? 0 : current + 1;
		else if (event.key === 'ArrowUp') next = current <= 0 ? last : current - 1;
		else if (event.key === 'Home') next = 0;
		else if (event.key === 'End') next = last;
		else return;
		handled();
		hoverIndex = null;
		buttons[next].focus(focusOpts);
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
	tabindex="-1"
	bind:this={listEl}
	onkeydown={onKey}
	style={depth === 0 && minWidth ? `min-width: ${minWidth};` : ''}
>
	{#each items as item, i (i)}
		{#if item.separator}
			<li class="pui-ctxmenu-sep" role="separator"></li>
		{:else}
			<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
			<li
				class="pui-ctxmenu-li"
				role="none"
				onmouseenter={(e) => onItemEnter(i, item, e.currentTarget)}
			>
				<button
					type="button"
					role="menuitem"
					class="pui-ctxmenu-item"
					class:danger={item.danger}
					tabindex="-1"
					aria-haspopup={item.children?.length ? 'menu' : undefined}
					aria-expanded={item.children?.length ? hoverIndex === i : undefined}
					disabled={item.disabled}
					onclick={() => handleClick(item, i)}
				>
					<span class="pui-ctxmenu-ico">
						{#if item.icon}<Icon svg={item.icon} size="1rem" />{/if}
					</span>
					<span class="pui-ctxmenu-label">{item.label}</span>
					{#if item.shortcut}
						<span class="pui-ctxmenu-shortcut">{item.shortcut}</span>
					{/if}
					{#if item.children?.length}
						<span class="pui-ctxmenu-caret"><Icon svg={iconChevronRight} size="0.875rem" /></span>
					{/if}
				</button>

				{#if item.children?.length && hoverIndex === i}
					<div class="pui-ctxmenu-submenu" class:flip-left={flipLeft} bind:this={submenuEl}>
						<Self
							items={item.children}
							{onSelect}
							depth={depth + 1}
							onBack={() => closeSubmenu(i)}
						/>
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
		border-radius: var(--ui-radius);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
		color: var(--text-color);
		font-size: 0.875rem;
		user-select: none;
	}

	.pui-ctxmenu-list:focus {
		outline: none;
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
		border-radius: var(--ui-radius-sm);
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
		width: 1rem;
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
