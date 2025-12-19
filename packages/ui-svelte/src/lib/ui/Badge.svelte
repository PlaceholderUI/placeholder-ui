<script lang="ts">
	import Icon from '../icon/Icon.svelte';
	import { iconX } from '../icon/index.js';
	import type { Snippet } from 'svelte';
	import type { ButtonVariant } from './ButtonVariant.js';

	interface Props {
		variant?: ButtonVariant;
		shape?: 'pill' | 'default';
		href?: string;
		loading?: boolean;
		disabled?: boolean;
		onDelete?: () => void;
		onClick?: () => void;
		children: Snippet;
	}

	let {
		variant = 'midnight',
		shape = 'default',
		href = undefined,
		loading = false,
		disabled = false,
		onDelete = undefined,
		onClick = undefined,
		children
	}: Props = $props();

	let isDisabled: boolean = $derived(loading || disabled);
	let type: 'a' | 'button' | 'div' = $derived(onClick ? 'button' : href ? 'a' : 'div');

	const elClass = $derived(
		`badge ${isDisabled ? 'disabled' : ''}`
	);
</script>

<div class="badge-container {variant} shape-{shape} {onDelete ? 'badge-with-button' : ''} ">
	{#if type == 'a' && !disabled}
		<a class={elClass} {href}> {@render children?.()}</a>
	{:else if type == 'button'}
		<button class={elClass} disabled={isDisabled}> {@render children?.()}</button>
	{:else}
		<div class={elClass}>
			{@render children?.()}
		</div>
	{/if}
	{#if onDelete}
		<button class="badge-button {variant}" disabled={isDisabled} onclick={onDelete}>
			<Icon size="14px" svg={iconX} />
		</button>
	{/if}
</div>

<style>
	.badge-container {
		display: flex;
		border-radius: var(--pui-radius-lg);
		border: var(--badge-border, 0);
	}

	.badge {
		font-size: var(--pui-font-size-base);
		line-height: var(--pui-line-height-tight);
		letter-spacing: var(--pui-letter-spacing-wide);
		display: flex;
		justify-content: center;
		align-items: center;
		text-decoration: none;
		padding: var(--pui-spacing-1);
		border-radius: var(--pui-radius-lg);
	}

	button.badge,
	a.badge {
		cursor: pointer;
	}

	.badge-with-button .badge {
		padding-right: var(--pui-spacing-1_5);
		border-top-right-radius: 0;
		border-bottom-right-radius: 0;
	}

	.badge-button {
		border-radius: var(--pui-radius-lg);
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
		border-left: 1px solid var(--badge-border-color, var(--pui-color-black));
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		border-right: var(--badge-border, 0);
		padding: var(--pui-spacing-1);
	}

	button {
		border: none;
	}

	button.badge-button:active,
	button.badge:active:not(:disabled),
	a.badge:active:not(:disabled) {
		transform: translateY(1px);
	}

	a {
		color: var(--badge-text-color) !important;
	}

	.pistachio {
		--badge-bg-color: var(--pui-color-secondary);
		--badge-text-color: var(--pui-color-primary);
		--badge-hover-bg-color: var(--pui-color-accent);
		--badge-border-color: var(--pui-color-secondary-dark);
		--badge-outline-color: var(--pui-color-accent);
	}

	.pistachio :global(.loader) {
		color: var(--pui-color-primary);
	}

	.midnight {
		--badge-bg-color: var(--pui-color-primary);
		--badge-text-color: var(--pui-color-white);
		--badge-hover-bg-color: var(--pui-color-secondary-dark);
		--badge-border-color: var(--pui-color-accent-dark);
		--badge-outline-color: var(--pui-color-secondary-dark);
	}

	.midnight :global(.loader) {
		color: var(--pui-color-secondary);
	}

	.white {
		--badge-bg-color: var(--pui-color-white);
		--badge-text-color: var(--pui-color-primary);
		--badge-hover-bg-color: var(--pui-color-accent);
		--badge-border-color: var(--pui-color-gray-200);
		--badge-outline-color: var(--pui-color-accent);
	}

	.secondary {
		--badge-bg-color: var(--pui-input-bg);
		--badge-border: 1px solid var(--pui-border-default);
		--badge-border-color: var(--pui-border-default);
		--badge-hover-bg-color: var(--pui-border-default);
		--badge-outline-color: var(--pui-text-primary);
	}

	.secondary-selected {
		--badge-bg-color: var(--pui-accent-color);
		--badge-border: 1px solid var(--pui-accent-color);
		--badge-border-color: var(--pui-accent-color);
		--badge-text-color: var(--pui-color-white);
	}

	.danger {
		--badge-text-color: var(--pui-color-white);
		--badge-bg-color: var(--pui-color-danger);
		--badge-hover-bg-color: var(--pui-color-danger-hover);
		--badge-outline-color: var(--pui-color-accent);
		--badge-border-color: var(--pui-color-danger-hover);
	}

	.danger :global(.loader) {
		color: var(--pui-color-white);
	}

	.auto-outline {
		--badge-text-color: var(--pui-color-primary);
		--badge-bg-color: initial;
		--badge-border: 1px solid var(--pui-color-primary);
		--badge-border-color: var(--pui-color-primary);
		--badge-hover-bg-color: var(--pui-color-secondary-dark);
		--badge-hover-border: 1px solid var(--pui-color-secondary-dark);
		--badge-outline-color: var(--pui-color-secondary-dark);
	}

	:global(.dark) .auto-outline {
		--badge-text-color: var(--pui-color-secondary);
		--badge-bg-color: initial;
		--badge-border: 1px solid var(--pui-color-secondary);
		--badge-border-color: var(--pui-color-secondary);
		--badge-hover-bg-color: var(--pui-color-accent);
		--badge-hover-border: 1px solid var(--pui-color-accent);
		--badge-outline-color: var(--pui-color-accent);
	}

	.pistachio-outline {
		--badge-text-color: var(--pui-color-secondary);
		--badge-bg-color: initial;
		--badge-border: 1px solid var(--pui-color-secondary);
		--badge-border-color: var(--pui-color-secondary);
		--badge-hover-bg-color: var(--pui-color-accent);
		--badge-hover-border: 1px solid var(--pui-color-accent);
		--badge-outline-color: var(--pui-color-accent);
	}

	.midnight-outline {
		--badge-text-color: var(--pui-color-primary);
		--badge-bg-color: initial;
		--badge-border: 1px solid var(--pui-color-primary);
		--badge-border-color: var(--pui-color-primary);
		--badge-hover-bg-color: var(--pui-color-secondary-dark);
		--badge-hover-border: 1px solid var(--pui-color-secondary-dark);
		--badge-outline-color: var(--pui-color-secondary-dark);
	}

	.turquoise {
		--badge-text-color: var(--pui-color-black);
		--badge-bg-color: var(--pui-color-accent);
		--badge-hover-bg-color: var(--pui-color-accent-dark);
		--badge-outline-color: var(--pui-color-accent);
		--badge-border-color: var(--pui-color-accent-dark);
	}

	button,
	a,
	div {
		border-color: var(--badge-border-color, var(--pui-color-primary));
		transition:
			color var(--pui-transition-fast) var(--pui-ease-in-out),
			background-color var(--pui-transition-fast) var(--pui-ease-in-out),
			border-color var(--pui-transition-fast) var(--pui-ease-in-out),
			box-shadow var(--pui-transition-fast) var(--pui-ease-in-out);

		color: var(--badge-text-color);
		background-color: var(--badge-bg-color);
	}

	button:hover:not(:disabled),
	a:hover:not(:disabled, div) {
		background-color: var(--badge-hover-bg-color, var(--badge-bg-color));
		border: var(--badge-hover-border, var(--badge-border, 0));
	}

	button:focus-visible,
	a:focus-visible {
		outline: solid var(--pui-focus-ring-width) var(--badge-outline-color, var(--pui-color-secondary-dark));
		outline-offset: var(--pui-focus-ring-offset);
	}

	:global(.dark) {
		.secondary {
			--badge-hover-bg-color: var(--pui-color-dark-300);
		}

		.secondary-subtle {
			--badge-hover-bg-color: var(--pui-color-dark-300);
		}

		.secondary-selected {
			--badge-text-color: var(--pui-color-primary);
		}

		.auto-subtle {
			--badge-text-color: var(--pui-color-white);
			--badge-hover-bg-color: var(--pui-color-primary);
			--badge-outline-color: var(--pui-color-secondary);
		}
	}

	.disabled {
		opacity: 0.5;
	}

	.shape-pill {
		border-radius: var(--pui-radius-full);
		padding: var(--pui-spacing-1) var(--pui-spacing-2);
	}

	.shape-pill .badge {
		border: none;
		padding: 0;
		padding-right: var(--pui-spacing-1);
	}

</style>
