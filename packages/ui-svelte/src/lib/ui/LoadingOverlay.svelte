<script lang="ts">
	import Loader from './Loader.svelte';

	interface Props {
		visible?: boolean;
		loaderSize?: string;
		overlayOpacity?: number;
		blur?: number;
		zIndex?: number;
		class?: string;
	}

	let {
		visible = false,
		loaderSize = '40px',
		overlayOpacity = 0.75,
		blur = 0,
		zIndex = 30,
		class: classes = ''
	}: Props = $props();
</script>

{#if visible}
	<div
		class="loading-overlay {classes}"
		style="--overlay-opacity: {overlayOpacity}; --overlay-blur: {blur}px; --overlay-z-index: {zIndex};"
		aria-busy="true"
		aria-live="polite"
	>
		<Loader sizeOverride={loaderSize} />
	</div>
{/if}

<style>
	.loading-overlay {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: rgba(255, 255, 255, var(--overlay-opacity, 0.75));
		backdrop-filter: blur(var(--overlay-blur, 0));
		z-index: var(--overlay-z-index, 30);
		border-radius: inherit;
	}

	:global(.dark) .loading-overlay {
		background-color: rgba(0, 0, 0, var(--overlay-opacity, 0.75));
	}
</style>
