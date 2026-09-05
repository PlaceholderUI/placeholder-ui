<script lang="ts">
	import { themeState } from '$lib/theme.svelte.js';
	import { brandState } from '$lib/uiTheme.svelte.js';
	import Icon from '$lib/icon/Icon.svelte';
	import Link from './Link.svelte';
	import placeholderLogo from '$lib/icon/logo-placeholder.svg?raw';

	export interface LogoProps {
		/** Additional CSS classes */
		class?: string;
		/** URL to navigate to when logo is clicked */
		href?: string;
		/** Override the logo fill colour (defaults to theme-aware primary/white) */
		fill?: string;
		/**
		 * Raw SVG markup to render. Falls back to the logo registered via
		 * `applyTheme({ logo })` / `setLogo()`, then to a generic placeholder.
		 */
		svg?: string;
	}

	let {
		class: classes = '',
		href = '/',
		fill: fillOverride = undefined,
		svg = undefined
	}: LogoProps = $props();

	const fill = $derived(fillOverride ?? (themeState.isDarkMode ? 'white' : 'var(--ui-primary)'));
	const logoSvg = $derived(svg ?? brandState.logo ?? placeholderLogo);
</script>

<Link {href}>
	<span class="logo {classes}">
		<Icon svg={logoSvg} {fill} stroke="none" />
	</span>
</Link>
