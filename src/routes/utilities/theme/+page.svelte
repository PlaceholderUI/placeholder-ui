<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	onMount(() => {
		// Keep existing Theme links working, including deployments under a base path.
		goto(resolve('/'), { replaceState: true });
	});
</script>
