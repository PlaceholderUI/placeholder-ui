<script lang="ts">
	import type { NavbarItem } from '../models/NavbarItem.js';
	import {
		ThemeSwitcher,
		ActionIcon,
		iconHamburger,
		type Hyperlink,
		viewportState
	} from '$lib/index.js';
	import NavbarItemView from './NavbarItemView.svelte';
	import Link from '$lib/ui/Link.svelte';
	import Logo from '$lib/ui/Logo.svelte';
	import type { Snippet } from 'svelte';

	export type NavbarVariant = 'default' | 'primary';

	export interface NavbarProps {
		/** Visual variant. `primary` uses the primary brand colour as the background across all themes */
		variant?: NavbarVariant;
		/** App navigation link displayed as a header */
		appNav?: Hyperlink;
		/** Primary navigation items. Items with `subItems` fold out a vertical sub-list; items with `iconSvg` show a leading icon */
		items?: NavbarItem[];
		/** Secondary navigation items (right side) */
		secondaryItems?: NavbarItem[];
		/** Hide the logo */
		noLogo?: boolean;
		/** Custom URL for the logo link */
		logoHref?: string;
		/** Additional CSS classes */
		class?: string;
		/** Constrain navbar width to container */
		inContainer?: boolean;
		/** Custom content for the left section */
		leftSection?: Snippet;
		/** Custom content for the middle section */
		middleSection?: Snippet;
		/** Custom content for the right section */
		rightSection?: Snippet;
		/** Show mobile drawer toggle button */
		showDrawerButton?: boolean;
		/** Position of the drawer toggle button */
		drawerButtonPosition?: 'left' | 'right';
		/** Custom icon for the drawer toggle button */
		drawerButtonIcon?: string;
		/** Callback when drawer toggle is clicked */
		onDrawerButtonClick?: () => void;
	}

	let {
		variant = 'default',
		appNav = undefined,
		items = [],
		secondaryItems = [],
		noLogo = false,
		logoHref = undefined,
		class: className = '',
		inContainer = false,
		leftSection = undefined,
		middleSection = undefined,
		rightSection = undefined,
		// Drawer button options
		showDrawerButton = false,
		drawerButtonPosition = 'right',
		drawerButtonIcon = iconHamburger,
		onDrawerButtonClick = undefined
	}: NavbarProps = $props();

	const isPrimary = $derived(variant === 'primary');
</script>

<header class={isPrimary ? 'primary' : ''}>
	<div class="inner-navbar {className} {inContainer ? 'container' : ''}">
		{@render leftSection?.()}
		{#if showDrawerButton && drawerButtonPosition === 'left'}
			<ActionIcon
				svg={drawerButtonIcon}
				variant={isPrimary ? 'accent-subtle' : 'secondary-subtle'}
				size="1.25rem"
				onclick={onDrawerButtonClick}
				class="drawer-btn drawer-btn-left"
			/>
		{/if}
		{#if appNav}
			<div class="header-hero">
				<Link class="text-xl" href={appNav.href}>{appNav.text}</Link>
			</div>
		{/if}

		{#if items.length > 0}
			<div class="primary links-container">
				{#each items as item}
					<NavbarItemView {item} />
				{/each}
			</div>
		{/if}

		{#if middleSection}
			<div class="middle">
				{@render middleSection()}
			</div>
		{/if}
		<!-- <ActionIcon
			class="hamburger"
			variant={$isDarkMode ? 'auto-subtle' : 'primary'}
			onclick={toggleDrawer}
			svg={iconHamburger}
		/> -->
		{#if secondaryItems.length > 0}
			<div class="secondary links-container">
				{#each secondaryItems as item}
					<NavbarItemView {item} />
				{/each}
			</div>
		{/if}
		{#if rightSection}
			<div class="right">
				{@render rightSection()}
			</div>
		{/if}
		<ThemeSwitcher
			darkVariant="accent-subtle"
			lightVariant={isPrimary ? 'accent-subtle' : 'primary-subtle'}
		/>
		{#if !viewportState.isMobile && !noLogo}
			{#if logoHref}
				<Logo href={logoHref} fill={isPrimary ? 'white' : undefined} />
			{:else}
				<Logo fill={isPrimary ? 'white' : undefined} />
			{/if}
		{/if}
		{#if showDrawerButton && drawerButtonPosition === 'right'}
			<ActionIcon
				svg={drawerButtonIcon}
				variant={isPrimary ? 'accent-subtle' : 'secondary-subtle'}
				size="1.25rem"
				onclick={onDrawerButtonClick}
				class="drawer-btn drawer-btn-right"
			/>
		{/if}
	</div>
</header>

<style>
	header {
		position: sticky;
		top: 0;
		z-index: 40;
		height: var(--header-height);
		display: flex;
		background: white;
		border-bottom: 0.666667px solid rgb(222, 226, 230);
	}

	.links-container {
		display: flex;
		gap: 1rem;
	}

	:global(.dark) header {
		background: black;
		border: none;
	}

	/* Primary variant: primary brand background regardless of theme */
	header.primary,
	:global(.dark) header.primary {
		background: var(--ui-primary);
		border: none;
	}

	header.primary .inner-navbar {
		color: white;
	}

	/* Top-level links/triggers: white, turning accent on hover (matches dark navbar).
	   Use `>` so these rules don't leak into the fold-out sub-list panels, which keep
	   their own (paper) colour scheme regardless of the primary variant. */
	header.primary .inner-navbar .links-container > :global(a),
	header.primary
		.inner-navbar
		.links-container
		> :global(.navbar-parent)
		> :global(.navbar-parent-trigger),
	header.primary .inner-navbar .header-hero :global(a) {
		color: white;
		transition: color 200ms;
	}

	header.primary .inner-navbar .links-container > :global(a:hover),
	header.primary
		.inner-navbar
		.links-container
		> :global(.navbar-parent)
		> :global(.navbar-parent-trigger:hover),
	header.primary .inner-navbar .header-hero :global(a:hover) {
		color: var(--ui-accent);
	}

	.inner-navbar {
		display: flex;
		align-items: center;
		gap: 1rem;

		margin: 0 auto;
		padding: 0 1em;
		height: 100%;
		width: 100%;
		color: var(--ui-primary);
	}

	.middle {
		flex-grow: 1;
	}

	/* Without a growing .middle, the first right-side element pushes the group to the
	   edge via auto margin. When .middle is present its flex-grow consumes the free
	   space first, so these margins resolve to 0 and have no effect. */
	.secondary,
	.right,
	.inner-navbar > :global(.theme-switcher) {
		margin-left: auto;
	}

	.secondary ~ .right,
	.secondary ~ :global(.theme-switcher),
	.right ~ :global(.theme-switcher) {
		margin-left: 0;
	}

	.hidden-when-small {
		display: none;
	}

	.inner-navbar :global(.hamburger) {
		margin-left: auto;
	}

	@media (max-width: 640px) {
		.hidden-when-small {
			display: block;
		}

		.inner-navbar :global(.hamburger) {
			display: none;
		}
	}

	.top-header {
		border-bottom-width: 1px;
		border-bottom-style: solid;
		border-color: var(--border-color);
		height: 1.5rem;
	}

	.inner-navbar :global(.pui-icon) {
		display: flex;
	}

	.inner-navbar :global(.drawer-btn) {
		flex-shrink: 0;
	}

	.inner-navbar :global(.drawer-btn-left) {
		margin-right: 0.25rem;
	}

	.inner-navbar :global(.drawer-btn-right) {
		margin-left: 0.5rem;
	}
</style>
