<script lang="ts">
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

	let { lightVariant = 'primary-subtle', darkVariant = 'accent-subtle' }: ThemeSwitcherProps = $props();

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

	function cycleTheme() {
		const index = themeCycle.indexOf(themeState.theme);
		setTheme(themeCycle[(index + 1) % themeCycle.length]);
	}
</script>

<div class="theme-switcher">
	{#key themeState.theme}
		<ActionIcon
			variant={themeState.isDarkMode ? darkVariant : lightVariant}
			svg={icons[themeState.theme]}
			class="action-icon"
			size="1.6em"
			onclick={cycleTheme}
			tooltip={tooltips[themeState.theme]}
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
