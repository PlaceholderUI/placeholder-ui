<script lang="ts">
	import { base } from '$app/paths';
	import { navigateTo } from '../util/NavigateTo.js';
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

	function handleClick(event: MouseEvent) {
		// Call user-provided onclick handler first
		if (onclick) {
			onclick(event);
		}

		// Don't intercept if event was prevented by user handler
		if (event.defaultPrevented) {
			return;
		}

		// Don't intercept external links
		if (!href?.startsWith('/')) {
			return;
		}

		// Don't intercept if target is _blank or modifier keys are pressed
		// This preserves standard browser behavior for opening in new tabs
		if (target === '_blank' || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) {
			return;
		}

		// Don't intercept middle mouse button clicks
		if (event.button !== 0) {
			return;
		}

		// if link starts with base, do not duplicate
		if (href?.startsWith(base)) {
			href = href.slice(base.length);
		}

		// Prevent default navigation and use SvelteKit's client-side navigation
		event.preventDefault();

		if(href) navigateTo(href);
	}
</script>

<a
	{target}
	class={classes}
	href={href?.startsWith('/') ? `${base}${href}` : href}
	{rel}
	onclick={handleClick}
	data-sveltekit-preload-data="hover"
>
	{@render children?.()}
</a>
