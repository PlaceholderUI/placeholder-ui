<script lang="ts">
	interface Props {
		width?: string;
		height?: string;
		circle?: boolean;
		radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
		animate?: boolean;
		visible?: boolean;
		class?: string;
	}

	let {
		width = '100%',
		height = '1rem',
		circle = false,
		radius = 'md',
		animate = true,
		visible = true,
		class: classes = ''
	}: Props = $props();

	const computedRadius = $derived(circle ? 'full' : radius);
	const computedHeight = $derived(circle && !height ? width : height);
</script>

{#if visible}
	<div
		class="skeleton radius-{computedRadius} {classes}"
		class:animate
		class:circle
		style="width: {width}; height: {computedHeight};"
		aria-hidden="true"
	></div>
{/if}

<style>
	.skeleton {
		background-color: var(--cui-color-gray-200);
		display: block;
	}

	:global(.dark) .skeleton {
		background-color: var(--cui-color-dark-border);
	}

	.circle {
		aspect-ratio: 1;
	}

	/* Radius */
	.radius-none {
		border-radius: 0;
	}
	.radius-sm {
		border-radius: var(--cui-radius-sm);
	}
	.radius-md {
		border-radius: var(--cui-radius-md);
	}
	.radius-lg {
		border-radius: var(--cui-radius-lg);
	}
	.radius-xl {
		border-radius: var(--cui-radius-xl);
	}
	.radius-full {
		border-radius: var(--cui-radius-full);
	}

	.animate {
		animation: skeleton-pulse 1.5s ease-in-out infinite;
	}

	@keyframes skeleton-pulse {
		0% {
			opacity: 1;
		}
		50% {
			opacity: 0.4;
		}
		100% {
			opacity: 1;
		}
	}
</style>
