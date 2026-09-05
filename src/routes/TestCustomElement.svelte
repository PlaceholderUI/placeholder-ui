<script lang="ts">
	import type { ComboBoxItem } from "$lib/index.js";

    export let option: ComboBoxItem;
</script>

<div>
    I'm an ugly custom component{option.componentProps ? ` with a property: ${option.componentProps}` : ""}
</div>

<style>
    div {
        background: linear-gradient(90deg, rgba(131,58,180,1) 0%, rgba(253,29,29,1) 50%, rgba(252,176,69,1) 100%);
    }
</style>