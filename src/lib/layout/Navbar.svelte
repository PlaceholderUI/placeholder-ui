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
	import { themeState } from '$lib/theme.svelte.js';

	export type NavbarVariant = 'default' | 'primary' | 'site';

	export interface NavbarProps {
		/**
		 * Visual variant.
		 * - `primary` uses the primary brand colour as the background across all themes.
		 * - `site` is a marketing-site header: logo on the left, links pushed to the right with an
		 *   accent underline on the `active` item. Below 768px the links collapse and the drawer
		 *   button (enable with `showDrawerButton`) is shown instead. While a site header is on the
		 *   page, `--header-height` is raised to 68px (see app.css), so `--page-content-height`
		 *   follows automatically.
		 */
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
	const isSite = $derived(variant === 'site');
	// Site variant: the drawer button is the only nav control on mobile, so keep it legible on dark
	const drawerButtonVariant = $derived(
		isPrimary || (isSite && themeState.isDarkMode) ? 'accent-subtle' : 'secondary-subtle'
	);
</script>

<header class="pui-navbar {isPrimary ? 'primary' : isSite ? 'site' : ''}">
	<div class="inner-navbar {className} {inContainer ? 'container' : ''}">
		{#if isSite && !noLogo}
			<span class="site-logo">
				<Logo href={logoHref} />
			</span>
		{/if}
		{@render leftSection?.()}
		{#if showDrawerButton && drawerButtonPosition === 'left'}
			<ActionIcon
				svg={drawerButtonIcon}
				variant={drawerButtonVariant}
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
		{#if !isSite && !viewportState.isMobile && !noLogo}
			{#if logoHref}
				<Logo href={logoHref} fill={isPrimary ? 'white' : undefined} />
			{:else}
				<Logo fill={isPrimary ? 'white' : undefined} />
			{/if}
		{/if}
		{#if showDrawerButton && drawerButtonPosition === 'right'}
			<ActionIcon
				svg={drawerButtonIcon}
				variant={drawerButtonVariant}
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

	/* Site variant: marketing-site header. Logo on the left, links on the right with a 2px
	   underline that lights up (accent) on the active item. */
	header.site .inner-navbar .links-container {
		gap: 1.5rem;
	}

	header.site .inner-navbar .links-container > :global(a),
	header.site
		.inner-navbar
		.links-container
		> :global(.navbar-parent)
		> :global(.navbar-parent-trigger) {
		font-weight: 500;
		padding: 0.35rem 0;
		border-bottom: 2px solid transparent;
		transition:
			color 200ms,
			border-color 200ms;
	}

	header.site .inner-navbar .links-container > :global(a:hover),
	header.site
		.inner-navbar
		.links-container
		> :global(.navbar-parent)
		> :global(.navbar-parent-trigger:hover) {
		color: var(--ui-tertiary-dark);
	}

	:global(.dark) header.site .inner-navbar .links-container > :global(a:hover),
	:global(.dark)
		header.site
		.inner-navbar
		.links-container
		> :global(.navbar-parent)
		> :global(.navbar-parent-trigger:hover) {
		color: var(--ui-accent);
	}

	header.site .inner-navbar .links-container > :global(a.active),
	header.site
		.inner-navbar
		.links-container
		> :global(.navbar-parent)
		> :global(.navbar-parent-trigger.active) {
		border-bottom-color: var(--ui-accent);
	}

	/* Brand logo sits on the left and is sized by height so any aspect ratio works */
	header.site .site-logo {
		display: inline-flex;
		align-items: center;
		flex-shrink: 0;
	}

	header.site .site-logo :global(.logo),
	header.site .site-logo :global(.pui-icon) {
		display: inline-flex;
		align-items: center;
	}

	header.site .site-logo :global(.pui-icon svg) {
		height: 40px;
		width: auto;
		display: block;
	}

	/* Primary links are right-aligned in the site variant (unless a growing .middle exists) */
	header.site .primary.links-container {
		margin-left: auto;
	}

	header.site .primary.links-container ~ .secondary,
	header.site .primary.links-container ~ .right,
	header.site .primary.links-container ~ :global(.theme-switcher) {
		margin-left: 0;
	}

	@media (max-width: 767px) {
		/* Links collapse into the drawer; the drawer button takes their place */
		header.site .inner-navbar .links-container {
			display: none;
		}

		header.site .site-logo :global(.pui-icon svg) {
			height: 34px;
		}

		/* The hidden links containers still count as siblings, so re-apply the auto margin
		   to the first visible right-hand element */
		header.site .inner-navbar > .right,
		header.site .inner-navbar > :global(.theme-switcher) {
			margin-left: auto;
		}

		header.site .inner-navbar > .right ~ :global(.theme-switcher) {
			margin-left: 0;
		}
	}

	@media (min-width: 768px) {
		header.site .inner-navbar :global(.drawer-btn) {
			display: none;
		}
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
