<script lang="ts">
	import { resolve } from '$app/paths';
	import { interceptLinkClick } from '$lib/util/interceptLinkClick.js';
	import type { Snippet } from 'svelte';

	export interface LinkProps {
		/** URL to navigate to */
		href?: string;
		/** Relationship attribute for the link */
		rel?: string;
		/** Link target attribute */
		target?: '_self' | '_blank' | undefined;
		/** Additional CSS classes */
		class?: string;
		/** Link content */
		children?: Snippet;
		/** Click event handler */
		onclick?: (event: MouseEvent) => void;
	}

	let {
		href,
		rel = '',
		target = undefined,
		class: classes = '',
		children,
		onclick
	}: LinkProps = $props();
</script>

<a
	{target}
	class={classes}
	href={href?.startsWith('/') ? resolve(href as any) : href}
	{rel}
	onclick={(e) => interceptLinkClick(e, { href, target, onclick })}
	data-sveltekit-preload-data="hover"
>
	{@render children?.()}
</a>
