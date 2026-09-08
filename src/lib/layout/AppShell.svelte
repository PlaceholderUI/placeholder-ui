<script lang="ts">
	import type { Snippet } from 'svelte';
	import '../styles.css';
	import '../app.css';

	export interface AppShellProps {
		/** Application content (includes global styles) */
		children: Snippet;
	}

	let { children }: AppShellProps = $props();
</script>

{@render children?.()}
