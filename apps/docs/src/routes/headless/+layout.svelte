<script lang="ts">
	import { untrack } from "svelte";
	import { goto } from "$app/navigation";
	import {
		loadTheme,
		Sidenav,
		Navbar,
		Select,
		type SidenavSection,
		type LinkNavbarItem,
		type ComboBoxItem,
		iconHamburger,
		iconX,
	} from "@placeholderco/placeholder-ui";
	import { getPagesByCategory, pages } from "$lib/pages";

	let { children } = $props();

	let sidebarOpen = $state(false);

	$effect(() => {
		untrack(() => loadTheme());
	});

	// Secondary navbar items (right side)
	const secondaryNavItems: LinkNavbarItem[] = [
		{ label: "GitHub", href: "https://github.com/anthropics/ui-svelte" },
	];

	// Search options from pages
	const searchOptions: ComboBoxItem[] = pages.map((p) => ({
		value: p.href,
		label: p.label,
	}));

	let searchValue = $state<string | undefined>(undefined);

	function handleSearchChange(href: string | undefined) {
		if (href) {
			goto(href);
			searchValue = undefined;
		}
	}

	// Build nav sections from pages.ts
	const navSections: SidenavSection[] = [
		{
			title: "Getting Started",
			items: getPagesByCategory("getting-started").map((p) => ({
				label: p.label,
				href: p.href,
			})),
		},
		{
			title: "Components",
			items: getPagesByCategory("components").map((p) => ({
				label: p.label,
				href: p.href,
			})),
		},
		{
			title: "Form",
			items: getPagesByCategory("form").map((p) => ({
				label: p.label,
				href: p.href,
			})),
		},
		{
			title: "Layout",
			items: getPagesByCategory("layout").map((p) => ({
				label: p.label,
				href: p.href,
			})),
		},
		{
			title: "Types",
			items: getPagesByCategory("types").map((p) => ({
				label: p.label,
				href: p.href,
			})),
		},
	];
</script>

<svelte:head>
	<title>Placeholder UI - Component Library</title>
	<meta
		name="description"
		content="A modernish Svelte 5 component library with theme support"
	/>
</svelte:head>

	<!-- Header using Navbar component -->
	<div class="docs-header">
		<Navbar
			appNav={{ text: "Placeholder UI", href: "/" }}
			secondaryItems={secondaryNavItems}
			noLogo={true}
			showDrawerButton={true}
			drawerButtonPosition="left"
			drawerButtonIcon={sidebarOpen ? iconX : iconHamburger}
			onDrawerButtonClick={() => (sidebarOpen = !sidebarOpen)}
			class="docs-navbar"
		>
			{#snippet middleSection()}
				<div class="navbar-search">
					<Select
						bind:value={searchValue}
						options={searchOptions}
						placeholder="Search pages..."
						allowSearch={true}
						onchange={handleSearchChange}
						containerClass="navbar-search-container"
					/>
				</div>
			{/snippet}
		</Navbar>
	</div>
	<div class="docs-layout flex">
		<!-- Sidebar using Sidenav component -->
		<aside class="docs-sidebar" class:open={sidebarOpen}>
			<Sidenav
				sections={navSections}
				responsive={true}
				mobileBreakpoint={768}
				bind:mobileOpen={sidebarOpen}
				mobileTitle="Navigation"
				searchable={true}
				searchPlaceholder="Search components..."
			/>
		</aside>

		<!-- Main content -->
		<main class="docs-content">
			<div class="content-inner">
				{@render children()}
			</div>
		</main>
	</div>

<style>
	.navbar-search {
		max-width: 280px;
		width: 100%;
	}

	.navbar-search :global(.navbar-search-container) {
		margin: 0;
	}

	.navbar-search :global(.select) {
		padding: var(--pui-spacing-1) var(--pui-spacing-2);
		font-size: var(--pui-font-size-sm);
		background: var(--pui-color-gray-50);
		border-color: var(--pui-color-gray-200);
	}

	:global(.dark) .navbar-search :global(.select) {
		background: var(--pui-color-dark-200);
		border-color: var(--pui-color-dark-border);
	}

	@media (max-width: 640px) {
		.navbar-search {
			display: none;
		}
	}
</style>
