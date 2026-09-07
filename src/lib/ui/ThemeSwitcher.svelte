<script lang="ts">
	import { onMount } from 'svelte';
	import { setTheme, themeState } from '$lib/theme.svelte.js';

	import sunSvg from '$lib/icon/sun.svg?raw';
	import moonSvg from '$lib/icon/moon.svg?raw';
	import sunMoonSvg from '$lib/icon/sun-moon.svg?raw';
	import ActionIcon from './ActionIcon.svelte';
	import type { ButtonVariant } from './ButtonVariant.js';

	export interface ThemeSwitcherProps {
		/** Button variant to use in light mode */
		lightVariant?: ButtonVariant;
		/** Button variant to use in dark mode */
		darkVariant?: ButtonVariant;
	}

	let { lightVariant = 'primary-subtle', darkVariant = 'accent-subtle' }: ThemeSwitcherProps =
		$props();

	const themeCycle = ['light', 'dark', 'system'] as const;

	const icons = {
		light: sunSvg,
		dark: moonSvg,
		system: sunMoonSvg
	};

	const tooltips = {
		light: 'Light theme',
		dark: 'Dark theme',
		system: 'System theme'
	};

	// The server always renders the 'system' theme (no localStorage), but the client loads the
	// saved theme at module load. Rendering the server values until mounted keeps the hydrated
	// markup identical and avoids a hydration_html_changed warning from the {@html} icon.
	let mounted = $state(false);
	onMount(() => {
		mounted = true;
	});

	const theme = $derived(mounted ? themeState.theme : 'system');
	const isDarkMode = $derived(mounted ? themeState.isDarkMode : false);

	function cycleTheme() {
		const index = themeCycle.indexOf(themeState.theme);
		setTheme(themeCycle[(index + 1) % themeCycle.length]);
	}
</script>

<div class="theme-switcher">
	{#key theme}
		<ActionIcon
			variant={isDarkMode ? darkVariant : lightVariant}
			svg={icons[theme]}
			class="action-icon"
			size="1.6em"
			onclick={cycleTheme}
			tooltip={tooltips[theme]}
		/>
	{/key}
</div>

<style>
	.theme-switcher {
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}
</style>
