<script lang="ts">
	import { setTheme, themeState } from '../theme.svelte.js';

	import sunSvg from '../icon/sun.svg?raw';
	import moonSvg from '../icon/moon.svg?raw';
	import ActionIcon from './ActionIcon.svelte';
	import type { ButtonVariant } from './ButtonVariant.js';

	interface Props {
		lightVariant?: ButtonVariant;
		darkVariant?: ButtonVariant;
	}

	let { lightVariant = 'midnight-subtle', darkVariant = 'pistachio-subtle' }: Props = $props();

	function toggleDarkMode() {
		setTheme(themeState.isDarkMode ? 'light' : 'dark');
	}
</script>

<div class="theme-switcher">
	{#key themeState.isDarkMode}
		<ActionIcon
			variant={themeState.isDarkMode ? darkVariant : lightVariant}
			svg={themeState.isDarkMode ? moonSvg : sunSvg}
			class="action-icon"
			size="1.6em"
			onclick={toggleDarkMode}
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
