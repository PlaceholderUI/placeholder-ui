<script lang="ts">
	import type { LinkNavbarItem } from '../models/NavbarItem.js';
	import { Link, ThemeSwitcher, ActionIcon, iconHamburger, type Hyperlink } from '../index.js';
	import Logo from '../ui/Logo.svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		drawerHeader?: string | undefined;
		appNav?: Hyperlink;
		items?: LinkNavbarItem[];
		secondaryItems?: LinkNavbarItem[];
		noLogo?: boolean;
		logoHref?: string;
		class?: string;
		inContainer?: boolean;
		middleSection?: Snippet;
		rightSection?: Snippet;
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
		noLogo = false,
		logoHref = undefined,
		class: className = '',
		inContainer = false,
		middleSection = undefined,
		rightSection = undefined,
		// Drawer button options
		showDrawerButton = false,
		drawerButtonPosition = 'right',
		drawerButtonIcon = iconHamburger,
		onDrawerButtonClick = undefined
	}: Props = $props();
</script>

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
		<!-- {#each items.filter((x) => !x.showInOnly || x.showInOnly === 'Navbar') as item}
			{#if 'subItems' in item && item.subItems && item.subItems.length > 0}
				<div class:hidden-when-small={!item.alwaysShow} class={item.class}>
					<Dropdown let:toggleShow>
						<button onclick={toggleShow} class="cursor-pointer"
							>{item.label}
							<Icon svg={iconChevronRight} size="0.35em" class="ml-1 rotate-90" /></button
						>
						<div slot="dropdown">
							{#each item.subItems as subItem}
								<NavbarItemDisplay item={subItem} isInDrawer={false} />
							{/each}
						</div>
					</Dropdown>
				</div>
			{:else}
				<NavbarItemDisplay {item} isInDrawer={false} />
			{/if}
		{/each} -->

		<div class="primary links-container">
			{#each items as item}
				<Link href={item.href}>{item.label}</Link>
			{/each}
		</div>

		<div class="middle">
			{@render middleSection?.()}
		</div>
		<!-- <ActionIcon
			class="hamburger"
			variant={$isDarkMode ? 'auto-subtle' : 'primary'}
			onclick={toggleDrawer}
			svg={iconHamburger}
		/> -->
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
		<ThemeSwitcher darkVariant="secondary-subtle" lightVariant="primary-subtle" />
		{#if !noLogo}
			{#if logoHref}
				<Logo href={logoHref} />
			{:else}
				<Logo />
			{/if}
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

<!-- <Drawer bind:open={showDrawer}>
	<div class="header top-header">{drawerHeader ?? ''}</div>
	{#each items.filter((x) => !x.showInOnly || x.showInOnly === 'Drawer') as item}
		{#if 'subItems' in item && item.subItems && item.subItems.length > 0}
			<div class="header">{item.label}</div>
			<div class="collection">
				{#each item.subItems as subItem}
					<NavbarItemDisplay item={subItem} isInDrawer={true} />
				{/each}
			</div>
		{:else}
			<div class="collection"><NavbarItemDisplay {item} isInDrawer={true} /></div>
		{/if}
	{/each}
</Drawer> -->

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
		border-color: var(--pui-border-default);
		height: var(--pui-spacing-6);
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
</style>
