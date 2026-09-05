<script lang="ts">
	import type { Snippet } from 'svelte';
	
	export interface CustomNavbarProps {
		/** Header text for the mobile drawer */
		drawerHeader?: string | undefined;
		/** Navbar content */
		children: Snippet;
	}

	let { drawerHeader = undefined, children }: CustomNavbarProps = $props();

	// export let drawerHeader: string | undefined = undefined;
	// export let items: NavbarItem[] = [];

	let showDrawer: boolean = $state(false);

	function toggleDrawer() {
		showDrawer = !showDrawer;
	}
</script>

<header>
	<div class="inner-navbar container">
		{@render children?.()}
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
		z-index: 40;
		height: var(--header-height);

		display: flex;

		background: var(--ui-primary);

		align-items: center;
		padding: 0 1rem;
	}

	:global(.dark) header {
		background: black;
	}
</style>
