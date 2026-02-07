<script lang="ts">
	import { afterNavigate } from "$app/navigation";
	import { page } from "$app/state";
	import { Sidenav, type SidenavSection } from "$lib/index.js";
	import "../lib/styles/index.css";
	import "./themes.css";
	import Header from "./Header.svelte";
	import { getPagesByCategory } from "./pages";

	interface Props {
		children?: any;
	}

	let { children }: Props = $props();
	let sidebarOpen = $state(false);

	let currentRoute = $derived(page.route.id ?? '');

	function isActive(href: string): boolean {
		if (href === '/') return currentRoute === '/';
		return currentRoute === href;
	}

	let sections: SidenavSection[] = $derived([
		{
			title: "Getting Started",
			items: getPagesByCategory("getting-started").map((p) => ({
				label: p.label,
				href: p.href,
				active: isActive(p.href),
			})),
		},
		{
			title: "UI Components",
			items: getPagesByCategory("components").map((p) => ({
				label: p.label,
				href: p.href,
				active: isActive(p.href),
			})),
		},
		{
			title: "Form Components",
			items: getPagesByCategory("form").map((p) => ({
				label: p.label,
				href: p.href,
				active: isActive(p.href),
			})),
		},
		{
			title: "Display Components",
			items: getPagesByCategory("display").map((p) => ({
				label: p.label,
				href: p.href,
				active: isActive(p.href),
			})),
		},
		{
			title: "Layout Components",
			items: getPagesByCategory("layout").map((p) => ({
				label: p.label,
				href: p.href,
				active: isActive(p.href),
			})),
		},
	]);

	afterNavigate(() => {
		const el = document.getElementById("page-content");
		if (el) el.scrollTop = 0;
	});
</script>

<svelte:head>
	<title>Placeholder UI - Component Library</title>
	<meta name="description" content="A modern Svelte 5 component library with theme support" />
</svelte:head>

<div class="navbar-wrapper">
	<Header bind:sidebarOpen />
</div>

<div class="layout-container">
	<Sidenav
		{sections}
		width="260px"
		class="app-sidenav"
		searchable
		responsive
		bind:mobileOpen={sidebarOpen}
		mobileTitle="Navigation"
		mobileDrawerPosition="right"
	/>
	<div id="page-content">
		<div class="page-inner">
			{@render children?.()}
		</div>
	</div>
</div>

<style>
	.navbar-wrapper {
		display: flex;
		align-items: center;
	}

	.navbar-wrapper :global(header) {
		flex: 1;
	}

	.layout-container {
		display: flex;
	}

	.layout-container :global(.app-sidenav) {
		height: calc(100vh - 46px);
	}

	#page-content {
		flex: 1;
		max-height: calc(100vh - 46px);
		overflow-y: auto;
		padding: 0 var(--pui-spacing-4, 1rem);
		padding-bottom: var(--pui-spacing-12, 3rem);
	}

	.page-inner {
		margin-top: var(--pui-spacing-4, 1rem);
		margin-bottom: var(--pui-spacing-4, 1rem);
		max-width: 1200px;
	}
</style>
