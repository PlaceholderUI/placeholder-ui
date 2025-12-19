<script lang="ts">
	import Icon from '../icon/Icon.svelte';
	import loaderSvg from '../icon/loader.svg?raw';

	interface Props {
		fullScreen?: boolean;
		sizeOverride?: string;
		class?: string;
	}

	let { fullScreen = false, sizeOverride = '50px', class: classes = '' }: Props = $props();

	// export let fullScreen: boolean = false;
	// export let sizeOverride: string = '50px';

	// let classes: string = "";
	// export { classes as class };
</script>

<span class="loader {classes} {fullScreen && 'full-screen'}">
	<Icon size={sizeOverride} class="spin" svg={loaderSvg} />
</span>

<style>
	.loader {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		color: var(--pui-loader-color, var(--pui-color-primary));
	}

	:global(.dark) .loader {
		color: var(--pui-loader-color, var(--pui-color-secondary));
	}

	@keyframes -global-ckw {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	.full-screen {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: var(--pui-z-sticky);
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: rgba(255, 255, 255, 0.75);
		border-radius: var(--pui-radius-base);
		color: var(--pui-color-primary);
	}

	:global(.dark) .full-screen {
		background-color: rgba(0, 0, 0, 0.75);
		color: var(--pui-color-secondary);
	}

	:global(span.spin) {
		display: inline-block;
		transform-origin: 50% 50%;
		animation: ckw 2s linear infinite;
	}
</style>
