<script lang="ts">
	import type { LinkNavbarItem } from '../models/NavbarItem.js';
	import type { SidenavSection } from './Sidenav.svelte';
	import { Link, ThemeSwitcher, ActionIcon, Drawer, iconHamburger, type Hyperlink } from '../index.js';
	import { themeState } from '../theme.svelte.js';
	import type { Snippet } from 'svelte';

	interface Props {
		drawerHeader?: string | undefined;
		appNav?: Hyperlink;
		items?: LinkNavbarItem[];
		secondaryItems?: LinkNavbarItem[];
		class?: string;
		inContainer?: boolean;
		middleSection?: Snippet;
		rightSection?: Snippet;
		/** Icons displayed to the left of the ThemeSwitcher, visible even when collapsed on mobile */
		iconSection?: Snippet;
		/** Enable responsive collapse to burger menu on small screens (default: true) */
		responsive?: boolean;
		/** Breakpoint in pixels at which the navbar collapses (default: 768) */
		responsiveBreakpoint?: number;
		// Drawer button options
		showDrawerButton?: boolean;
		drawerButtonPosition?: 'left' | 'right';
		drawerButtonIcon?: string;
		onDrawerButtonClick?: () => void;
	}

	let {
		drawerHeader = undefined,
		appNav = undefined,
		items = [],
		secondaryItems = [],
		class: className = '',
		inContainer = false,
		middleSection = undefined,
		rightSection = undefined,
		iconSection = undefined,
		responsive = true,
		responsiveBreakpoint = 768,
		// Drawer button options
		showDrawerButton = false,
		drawerButtonPosition = 'right',
		drawerButtonIcon = iconHamburger,
		onDrawerButtonClick = undefined
	}: Props = $props();

	let drawerOpen = $state(false);
	let windowWidth = $state(typeof window !== 'undefined' ? window.innerWidth : 1024);
	const isCollapsed = $derived(responsive && windowWidth <= responsiveBreakpoint);

	const drawerSections = $derived.by((): SidenavSection[] => {
		const sections: SidenavSection[] = [];
		if (items.length > 0) {
			sections.push({
				items: items.map((item) => ({
					label: item.label,
					href: item.href,
					iconSvg: item.iconSvg
				}))
			});
		}
		if (secondaryItems.length > 0) {
			sections.push({
				items: secondaryItems.map((item) => ({
					label: item.label,
					href: item.href,
					iconSvg: item.iconSvg
				}))
			});
		}
		return sections;
	});

	function handleBurgerClick() {
		drawerOpen = true;
	}
</script>

<svelte:window onresize={() => (windowWidth = window.innerWidth)} />

<header>
	<div class="inner-navbar {className} {inContainer ? 'container' : ''}">
		{#if showDrawerButton && drawerButtonPosition === 'left'}
			<ActionIcon
				svg={drawerButtonIcon}
				variant="secondary-subtle"
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

		{#if !isCollapsed}
			<div class="primary links-container">
				{#each items as item}
					<Link href={item.href}>{item.label}</Link>
				{/each}
			</div>
		{/if}

		<div class="middle">
			{@render middleSection?.()}
		</div>

		{#if !isCollapsed}
			<div class="secondary links-container">
				{#each secondaryItems as item}
					{#if item.href.indexOf('/') === 0}
						<Link href={item.href}>{item.label}</Link>
					{:else}
						<a href={item.href}>{item.label}</a>
					{/if}
				{/each}
			</div>
			{@render rightSection?.()}
		{/if}
		{#if iconSection}
			<div class="icon-section">
				{@render iconSection()}
			</div>
		{/if}
		<ThemeSwitcher darkVariant="secondary-subtle" lightVariant="primary-subtle" />
		{#if isCollapsed}
			<ActionIcon
				svg={iconHamburger}
				variant={themeState.isDarkMode ? 'secondary-subtle' : 'primary-subtle'}
				size="1.25rem"
				onclick={handleBurgerClick}
				class="responsive-burger"
			/>
		{/if}
		{#if showDrawerButton && drawerButtonPosition === 'right'}
			<ActionIcon
				svg={drawerButtonIcon}
				variant="secondary-subtle"
				size="1.25rem"
				onclick={onDrawerButtonClick}
				class="drawer-btn drawer-btn-right"
			/>
		{/if}
	</div>
</header>

{#if responsive}
	<Drawer
		bind:open={drawerOpen}
		title={drawerHeader ?? appNav?.text ?? ''}
		sections={drawerSections}
		closeForLargeScreens={true}
		largeScreenBreakpoint={responsiveBreakpoint}
	/>
{/if}

<style>
	header {
		position: sticky;
		top: 0;
		z-index: var(--pui-z-sticky);
		height: 46px;
		display: flex;
		background: var(--pui-color-white);
		border-bottom: 1px solid var(--pui-border-default);
	}

	.links-container {
		display: flex;
		gap: var(--pui-spacing-4);
	}

	:global(.dark) header {
		background: var(--pui-color-black);
		border: none;
	}

	.inner-navbar {
		display: flex;
		align-items: center;
		gap: var(--pui-spacing-4);

		margin: 0 auto;
		padding: 0 var(--pui-spacing-4);
		height: 100%;
		width: 100%;
		color: var(--pui-color-primary);
	}

	.middle {
		flex-grow: 1;
	}

	.inner-navbar :global(.responsive-burger) {
		flex-shrink: 0;
	}

	.inner-navbar :global(.cu-icon) {
		display: flex;
	}

	.inner-navbar :global(.drawer-btn) {
		flex-shrink: 0;
	}

	.inner-navbar :global(.drawer-btn-left) {
		margin-right: var(--pui-spacing-1);
	}

	.inner-navbar :global(.drawer-btn-right) {
		margin-left: var(--pui-spacing-2);
	}

	.icon-section {
		display: flex;
		align-items: center;
		gap: var(--pui-spacing-1);
		flex-shrink: 0;
	}
</style>
