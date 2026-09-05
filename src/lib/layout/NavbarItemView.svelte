<script lang="ts">
	import type { NavbarItem } from '../models/NavbarItem.js';
	import Link from '../ui/Link.svelte';
	import Icon from '../icon/Icon.svelte';
	import { iconChevronDown, iconChevronRight } from '../icon/index.js';
	import { clickOutside } from '../util/ClickOutside.js';
	// Self-import enables recursive rendering of nested sub-lists (Svelte 5 replacement for svelte:self)
	import Self from './NavbarItemView.svelte';

	export interface NavbarItemViewProps {
		/** The navigation item to render */
		item: NavbarItem;
		/** Nesting depth. 0 = top level (sub-list folds down), >0 = nested (flies out to the side) */
		depth?: number;
	}

	let { item, depth = 0 }: NavbarItemViewProps = $props();

	let open = $state(false);

	const close = () => (open = false);
</script>

{#if 'component' in item}
	{@const Component = item.component}
	<Component {...item.componentProps} />
{:else if 'href' in item}
	<Link href={item.href} onclick={item.onclick} class="navbar-item {item.class ?? ''}">
		{#if item.iconSvg}
			<Icon svg={item.iconSvg} size="1.1em" class="navbar-item-icon" />
		{/if}
		<span>{item.label}</span>
	</Link>
{:else}
	<div class="navbar-parent" use:clickOutside={close}>
		<button
			type="button"
			class="navbar-item navbar-parent-trigger {item.class ?? ''}"
			aria-expanded={open}
			aria-haspopup="true"
			onclick={(e) => {
				item.onclick?.(e);
				open = !open;
			}}
		>
			{#if item.iconSvg}
				<Icon svg={item.iconSvg} size="1.1em" class="navbar-item-icon" />
			{/if}
			<span>{item.label}</span>
			{#if item.subItems?.length}
				<Icon
					svg={depth > 0 ? iconChevronRight : iconChevronDown}
					size="0.85em"
					class="navbar-chevron"
				/>
			{/if}
		</button>
		{#if open && item.subItems?.length}
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				class="navbar-submenu"
				class:flyout={depth > 0}
				style={item.submenuWidth ? `width: ${item.submenuWidth}; min-width: ${item.submenuWidth};` : ''}
				onclick={(e) => {
					// Close the fold-out once an actual link is chosen (but not when toggling a nested parent)
					if ((e.target as HTMLElement).closest('a')) close();
				}}
			>
				{#each item.subItems as subItem}
					<Self item={subItem} depth={depth + 1} />
				{/each}
			</div>
		{/if}
	</div>
{/if}

<style>
	.navbar-parent {
		position: relative;
		display: inline-flex;
	}

	/* Shared look for links and parent triggers so they line up in the navbar row */
	:global(.navbar-item) {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
	}

	/* Match the global `header a` link styling so triggers and links look identical.
	   A <button> doesn't inherit those rules, so set the colours explicitly. */
	.navbar-parent-trigger {
		background: none;
		border: none;
		padding: 0;
		margin: 0;
		font: inherit;
		color: var(--ui-primary);
		cursor: pointer;
		transition: color 200ms;
	}

	.navbar-parent-trigger:hover {
		color: var(--ui-accent-dark);
	}

	:global(.dark) .navbar-parent-trigger {
		color: white;
	}

	:global(.dark) .navbar-parent-trigger:hover {
		color: var(--ui-accent);
	}

	:global(.navbar-item-icon) {
		flex-shrink: 0;
	}

	:global(.navbar-chevron) {
		flex-shrink: 0;
		opacity: 0.7;
	}

	/* Fold-out vertical sub-list */
	.navbar-submenu {
		position: absolute;
		top: 100%;
		left: 0;
		margin-top: 0.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
		min-width: 12rem;
		background-color: var(--paper-body-bg);
		border: 1px solid var(--border-color);
		border-radius: 0.375rem;
		box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
		z-index: 1000;
	}

	/* Nested sub-lists fly out to the side instead of downward */
	.navbar-submenu.flyout {
		top: 0;
		left: 100%;
		margin-top: 0;
		margin-left: 0.25rem;
	}

	/* Items inside the panel always use the panel's own colour scheme,
	   regardless of the navbar variant (matches the Dropdown component). */
	.navbar-submenu :global(.navbar-item) {
		width: 100%;
		padding: 0.4rem 0.6rem;
		color: var(--ui-primary);
		text-decoration: none;
		transition: background-color 0.15s ease;
	}

	.navbar-submenu :global(.navbar-item:first-child) {
		border-top-left-radius: 0.25rem;
		border-top-right-radius: 0.25rem;
	}

	.navbar-submenu :global(.navbar-item:last-child) {
		border-bottom-left-radius: 0.25rem;
		border-bottom-right-radius: 0.25rem;
	}

	.navbar-submenu :global(.navbar-item:hover) {
		background-color: var(--border-color);
		color: var(--ui-primary);
	}

	:global(.dark) .navbar-submenu :global(.navbar-item) {
		color: var(--ui-accent);
	}

	:global(.dark) .navbar-submenu :global(.navbar-item:hover) {
		color: var(--ui-accent);
	}
</style>
