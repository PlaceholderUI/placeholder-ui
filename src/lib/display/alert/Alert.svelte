<script lang="ts">
	import Icon from '$lib/icon/Icon.svelte';

	import warningSvg from '$lib/icon/alert-triangle.svg?raw';
	import dangerSvg from '$lib/icon/alert-octagon.svg?raw';
	import type { AlertVariant } from './AlertVariant.js';
	import type { Snippet } from 'svelte';

	export interface AlertProps {
		/** Title text displayed in the alert header */
		title?: string;
		/** Visual style variant of the alert */
		variant?: AlertVariant;
		/** Additional CSS classes */
		class?: string;
		/** Alert content */
		children: Snippet;
	}

	let { title = '', variant = 'default', class: classes = '', children }: AlertProps = $props();

	let iconSvg: string | undefined = $state(undefined);

	$effect(() => {
		if (variant === 'warning') iconSvg = warningSvg;
		else if (variant === 'danger') iconSvg = dangerSvg;
	});
</script>

<div
	class="alert {classes}
	{variant === 'warning' && 'warning'}
	{variant === 'danger' && 'danger'}"
>
	{#if iconSvg}
		<div class="icon">
			<Icon svg={iconSvg} size="1.25rem" />
		</div>
	{/if}
	<div>
		{#if title}
			<div class="alert-title">{title}</div>
		{/if}
		{@render children?.()}
	</div>
</div>

<style>
	.alert {
		display: flex;
		border-radius: 0.25rem;
		padding: 0.5rem;
		background: rgba(var(--ui-accent-rgbc), 0.3);
		border: 1px solid var(--ui-accent);
		color: var(--text-color);

		.icon {
			width: 1.25rem;
			padding-top: 0.15rem;
			margin-right: 0.75rem;
		}

		.alert-title {
			margin-bottom: 0.25rem;
			font-weight: 700;
		}

		.alert-title,
		.icon {
			color: var(--ui-primary);
		}
	}

	.alert.danger {
		background: #f8d7da;
		color: #58151c;
		border: 1px solid #f1aeb5;

		.alert-title,
		.icon {
			color: #58151c;
		}
	}

	.alert.warning {
		background: #fff3cd;
		color: #664d03;
		border: 1px solid #ffe69c;

		.alert-title,
		.icon {
			color: #664d03;
		}
	}

	:global(.dark) {
		.alert {
			background: rgba(var(--ui-primary-rgbc), 0.3);
			border-color: var(--ui-primary);

			.alert-title,
			.icon {
				color: var(--white);
			}
		}

		.alert.danger {
			background: #2c0b0e;
			color: #ea868f;
			border-color: #842029;

			.alert-title,
			.icon {
				color: #ea868f;
			}
		}

		.alert.warning {
			background: #332701;
			color: #fff3cd;
			border-color: #997404;

			.alert-title,
			.icon {
				color: #fff3cd;
			}
		}
	}
</style>
