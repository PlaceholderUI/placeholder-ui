<script lang="ts">
	import type { Snippet } from 'svelte';
	import '../bootstrap.min.css';
	import '../app.css';

	export interface AppShellProps {
		/** Application content (includes global styles) */
		children: Snippet;
	}

	let { children }: AppShellProps = $props();
</script>

<!--
	AppShell loads the library's base stylesheet plus the bundled Bootstrap 5 build.
	To use the library without Bootstrap, skip AppShell and import
	`@placeholderco/placeholder-ui/app.css` directly in your root layout instead.
-->
{@render children?.()}
