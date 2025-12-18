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
		border-radius: 6px;
		border: var(--badge-border, 0);
	}

	.badge {
		font-size: 0.875rem;
		line-height: 1.125rem;
		letter-spacing: 0.05rem;
		display: flex;
		justify-content: center;
		align-items: center;
		text-decoration: none;
		padding: 0.25rem;
		border-radius: 6px;
	}

	button.badge,
	a.badge {
		cursor: pointer;
	}

	.badge-with-button .badge {
		padding-right: 6px;
		border-top-right-radius: 0;
		border-bottom-right-radius: 0;
	}

	.badge-button {
		border-radius: 6px;
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
		border-left: 1px solid var(--badge-border-color, black);
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		border-right: var(--badge-border, 0);
		padding: 4px;
	}

	button {
		border: none;
	}

	button.badge-button:active,
	button.badge:active:not(:disabled),
	a.badge:active:not(:disabled) {
		transform: translateY(calc(0.0625rem * 1));
	}

	a {
		color: var(--badge-text-color) !important;
	}

	.pistachio {
		--badge-bg-color: var(--pistachio);
		--badge-text-color: var(--midnight);
		--badge-hover-bg-color: var(--turquoise);
		--badge-border-color: var(--pistachio-dark);
		--badge-outline-color: var(--turquoise);
	}

	.pistachio :global(.loader) {
		color: var(--midnight);
	}

	.midnight {
		--badge-bg-color: var(--midnight);
		--badge-text-color: #fff;
		--badge-hover-bg-color: var(--pistachio-dark);
		--badge-border-color: rgb(24, 103, 99);
		--badge-outline-color: var(--pistachio-dark);
	}

	.midnight :global(.loader) {
		color: var(--pistachio);
	}

	.white {
		--badge-bg-color: white;
		--badge-text-color: var(--midnight);
		--badge-hover-bg-color: var(--turquoise);
		--badge-border-color: #eee;
		--badge-outline-color: var(--turquoise);
	}

	.secondary {
		--badge-bg-color: var(--input-bg);
		--badge-border: 1px solid var(--border-color);
		--badge-border-color: var(--border-color);
		--badge-hover-bg-color: var(--border-color);
		--badge-outline-color: var(--text-color);
	}

	.secondary-selected {
		--badge-bg-color: var(--accent-color);
		--badge-border: 1px solid var(--accent-color);
		--badge-border-color: var(--accent-color);
		--badge-text-color: white;
	}

	.danger {
		--badge-text-color: white;
		--badge-bg-color: var(--danger-bg);
		--badge-hover-bg-color: var(--danger-bg-hover);
		--badge-outline-color: var(--turquoise);
		--badge-border-color: var(--danger-bg-hover);
	}

	.danger :global(.loader) {
		color: white;
	}

	.auto-outline {
		--badge-text-color: var(--midnight);
		--badge-bg-color: initial;
		--badge-border: 1px solid var(--midnight);
		--badge-border-color: var(--midnight);
		--badge-hover-bg-color: #697f1a;
		--badge-hover-border: 1px solid #697f1a;
		--badge-outline-color: var(--pistachio-dark);
	}

	:global(.dark) .auto-outline {
		--badge-text-color: var(--pistachio);
		--badge-bg-color: initial;
		--badge-border: 1px solid var(--pistachio);
		--badge-border-color: var(--pistachio);
		--badge-hover-bg-color: var(--turquoise);
		--badge-hover-border: 1px solid var(--turquoise);
		--badge-outline-color: var(--turquoise);
	}

	.pistachio-outline {
		--badge-text-color: var(--pistachio);
		--badge-bg-color: initial;
		--badge-border: 1px solid var(--pistachio);
		--badge-border-color: var(--pistachio);
		--badge-hover-bg-color: var(--turquoise);
		--badge-hover-border: 1px solid var(--turquoise);
		--badge-outline-color: var(--turquoise);
	}

	.midnight-outline {
		--badge-text-color: var(--midnight);
		--badge-bg-color: initial;
		--badge-border: 1px solid var(--midnight);
		--badge-border-color: var(--midnight);
		--badge-hover-bg-color: #697f1a;
		--badge-hover-border: 1px solid #697f1a;
		--badge-outline-color: var(--pistachio-dark);
	}

	.turquoise {
		--badge-text-color: black;
		--badge-bg-color: var(--turquoise);
		--badge-hover-bg-color: rgb(49, 129, 128);
		--badge-outline-color: var(--turquoise);
		--badge-border-color: var(--turquoise-dark);
	}

	button,
	a,
	div {
		border-color: var(--badge-border-color, var(--midnight));
		transition:
			color 0.15s ease-in-out,
			background-color 0.15s ease-in-out,
			border-color 0.15s ease-in-out,
			box-shadow 0.15s ease-in-out;

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
		outline: solid 0.125rem var(--badge-outline-color, var(--pistachio-dark));
		outline-offset: 0.125rem;
	}

	:global(.dark) {
		.secondary {
			--badge-hover-bg-color: #333333;
		}

		.secondary-subtle {
			--badge-hover-bg-color: #333333;
		}

		.secondary-selected {
			--badge-text-color: var(--midnight);
		}

		.auto-subtle {
			--badge-text-color: white;
			--badge-hover-bg-color: var(--midnight);
			--badge-outline-color: var(--pistachio);
		}
	}

	.disabled {
		opacity: 0.5;
	}

	.shape-pill {
		border-radius: 9999px;
		padding: 0.25rem 0.5rem;
	}

	.shape-pill .badge {
		border: none;
		padding: 0;
		padding-right: 0.25rem;
	}

</style>
