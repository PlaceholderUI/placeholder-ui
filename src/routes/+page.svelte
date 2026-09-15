<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	onMount(() => {
		// Route through resolve() so the base path (e.g. /placeholder-ui on GitHub Pages) is preserved.
		goto(resolve('/components/buttons'), { replaceState: true });
	});
</script>
