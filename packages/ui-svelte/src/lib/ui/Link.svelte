<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		href?: string;
		rel?: string;
		target?: '_self' | '_blank' | undefined;
		class?: string;
		children?: Snippet;
		onclick?: (event: MouseEvent) => void;
	}

	let {
		href,
		rel = '',
		target = undefined,
		class: classes = '',
		children,
		onclick
	}: Props = $props();
</script>

<a
	{target}
	class={classes}
	{href}
	{rel}
	{onclick}
	data-sveltekit-preload-data="hover"
>
	{@render children?.()}
</a>
