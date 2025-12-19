<script lang="ts">
    import {
        iconHamburger,
        iconX,
        Navbar,
        Select,
        type ComboBoxItem,
        type LinkNavbarItem,
    } from "@placeholderco/placeholder-ui";
    import { pages } from "$lib/pages";
    import { goto } from "$app/navigation";

    interface Props {
        sidebarOpen: boolean;
    }

    let { sidebarOpen = $bindable() }: Props = $props();

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
</script>

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
