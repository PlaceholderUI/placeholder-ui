<script lang="ts">
    import { loadTheme, Toaster } from "@placeholderco/placeholder-ui";
    import "../app.css";

    let { children } = $props();

    loadTheme();
</script>

{@render children()}

<Toaster />
