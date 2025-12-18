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
		color: var(--cui-loader-color, var(--midnight));
	}

	:global(.dark) .loader {
		color: var(--cui-loader-color, var(--pistachio));
	}

	@keyframes -global-ckw {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	/* loader
		text-accent
		absolute
		top-0
		z-30
		left-0
		w-full
		h-full
		flex
		items-center
		justify-center
		bg-neutral-200/75
		dark:bg-neutral-700/75 */
	.full-screen {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 30;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: rgba(255, 255, 255, 0.75);
		border-radius: 0.25rem;
		color: var(--midnight);
	}

	:global(.dark) .full-screen {
		background-color: rgba(0, 0, 0, 0.75);
		color: var(--pistachio);
	}

	:global(span.spin) {
		display: inline-block;
		transform-origin: 50% 50%;
		animation: ckw 2s linear infinite;
	}
</style>
