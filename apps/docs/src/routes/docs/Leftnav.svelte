<script lang="ts">
    import { getPagesByCategory } from "$lib/pages";
    import { Sidenav, type SidenavSection } from "@placeholderco/placeholder-ui";

    interface Props {
        sidebarOpen: boolean;
    }

    let { sidebarOpen = $bindable() }: Props = $props();

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

<Sidenav
    sections={navSections}
    responsive={true}
    mobileBreakpoint={768}
    bind:mobileOpen={sidebarOpen}
    mobileTitle="Navigation"
/>

<style>
    :global(.sidenav) {
        box-shadow: var(--pui-shadow-md);
    }
</style>