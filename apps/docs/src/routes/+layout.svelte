<script lang="ts">
    import {
        AppShell,
        loadTheme,
        Toaster,
    } from "@placeholderco/placeholder-ui";
    import "../app.css";
    import Header from "./docs/Header.svelte";
    import Leftnav from "./docs/Leftnav.svelte";

    let { children } = $props();

    loadTheme();

    let sidebarOpen = $state(false);
</script>

<svelte:head>
    <title>Placeholder UI - Component Library</title>
    <meta
        name="description"
        content="A modernish Svelte 5 component library with theme support"
    />
</svelte:head>

<AppShell>
    {#snippet header()}
        <Header bind:sidebarOpen />
    {/snippet}
    {#snippet aside()}
        <Leftnav bind:sidebarOpen />
    {/snippet}
    <div class="p-3">
        {@render children()}
    </div>
</AppShell>

<Toaster />
