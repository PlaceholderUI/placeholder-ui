<script lang="ts">
    import { browser } from "$app/environment";
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
        { label: "GitHub", href: "https://github.com/PlaceholderUI/placeholder-ui" },
    ];

    // Theme options
    const themeOptions: ComboBoxItem[] = [
        { value: "", label: "Default" },
        { value: "svelte-prime", label: "Svelte Prime" },
        { value: "nordic-frost", label: "Nordic Frost" },
        { value: "matcha-clay", label: "Matcha Clay" },
        { value: "neon-synth", label: "Neon Synth" },
        { value: "brutalist-pop", label: "Brutalist Pop" },
    ];

    // Initialize theme from localStorage
    let selectedTheme = $state<string>("");

    if (browser) {
        selectedTheme = localStorage.getItem("pui-theme") || "";
        applyTheme(selectedTheme);
    }

    function applyTheme(theme: string) {
        if (!browser) return;
        if (theme) {
            document.documentElement.setAttribute("data-theme", theme);
        } else {
            document.documentElement.removeAttribute("data-theme");
        }
    }

    function handleThemeChange(theme: string | undefined) {
        const newTheme = theme ?? "";
        selectedTheme = newTheme;
        if (browser) {
            localStorage.setItem("pui-theme", newTheme);
            applyTheme(newTheme);
        }
    }

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
    {#snippet rightSection()}
        <Select
            value={selectedTheme}
            options={themeOptions}
            placeholder="Theme"
            onchange={handleThemeChange}
            containerClass="navbar-theme-container"
        />
    {/snippet}
</Navbar>
