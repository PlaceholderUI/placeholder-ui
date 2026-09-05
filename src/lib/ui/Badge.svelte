<script lang="ts">
	import Icon from '../icon/Icon.svelte';
	import { iconX } from '$lib/icon/index.js';
	import type { Snippet } from 'svelte';
	import type { ButtonVariant } from './ButtonVariant.js';

	export interface BadgeProps {
		/** Visual style variant */
		variant?: ButtonVariant;
		/** Size of the badge */
		size?: 'sm' | 'md' | 'lg';
		/** Shape of the badge */
		shape?: 'pill' | 'default';
		/** URL to navigate to (renders as anchor) */
		href?: string;
		/** Link target (e.g. '_blank') */
		target?: string;
		/** Show loading state */
		loading?: boolean;
		/** Disable interactions */
		disabled?: boolean;
		/** Callback when delete button is clicked (shows X button) */
		ondelete?: () => void;
		/** Callback when badge is clicked */
		onclick?: () => void;
		/** Badge content */
		children: Snippet;
	}

	let {
		variant = 'primary',
		size = 'md',
		shape = 'default',
		href = undefined,
		target = undefined,
		loading = false,
		disabled = false,
		ondelete: onDelete = undefined,
		onclick: onClick = undefined,
		children
	}: BadgeProps = $props();

	let isDisabled: boolean = $derived(loading || disabled);
	let type: 'a' | 'button' | 'div' = $derived(onClick ? 'button' : href ? 'a' : 'div');

	const elClass = $derived(
		`badge ${isDisabled ? 'disabled' : ''}`
	);
</script>

<div class="badge-container {variant} shape-{shape} size-{size} {onDelete ? 'badge-with-button' : ''} ">
	{#if type == 'a' && !disabled}
		<a class={elClass} {href} {target}> {@render children?.()}</a>
	{:else if type == 'button'}
		<button class={elClass} disabled={isDisabled} onclick={onClick}> {@render children?.()}</button>
	{:else}
		<div class={elClass}>
			{@render children?.()}
		</div>
	{/if}
	{#if onDelete}
		<button class="badge-button {variant}" disabled={isDisabled} onclick={onDelete}>
			<Icon size={size === 'sm' ? '12px' : size === 'lg' ? '16px' : '14px'} svg={iconX} />
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

	.accent,
	.pistachio {
		--badge-bg-color: var(--ui-accent);
		--badge-text-color: var(--ui-primary);
		--badge-hover-bg-color: var(--ui-tertiary);
		--badge-border-color: var(--ui-accent-dark);
		--badge-outline-color: var(--ui-tertiary);
	}

	.accent :global(.loader),
	.pistachio :global(.loader) {
		color: var(--ui-primary);
	}

	.primary,
	.midnight {
		--badge-bg-color: var(--ui-primary);
		--badge-text-color: #fff;
		--badge-hover-bg-color: var(--ui-accent-dark);
		--badge-border-color: var(--ui-tertiary-dark);
		--badge-outline-color: var(--ui-accent-dark);
	}

	.primary :global(.loader),
	.midnight :global(.loader) {
		color: var(--ui-accent);
	}

	.white {
		--badge-bg-color: white;
		--badge-text-color: var(--ui-primary);
		--badge-hover-bg-color: var(--ui-tertiary);
		--badge-border-color: #eee;
		--badge-outline-color: var(--ui-tertiary);
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

	.shaded {
		--badge-bg-color: var(--border-color);
		--badge-border: 1px solid var(--border-color);
		--badge-border-color: var(--border-color);
		--badge-hover-bg-color: var(--input-bg);
		--badge-outline-color: var(--text-color);
	}

	.danger {
		--badge-text-color: white;
		--badge-bg-color: var(--danger-bg);
		--badge-hover-bg-color: var(--danger-bg-hover);
		--badge-outline-color: var(--ui-tertiary);
		--badge-border-color: var(--danger-bg-hover);
	}

	.danger :global(.loader) {
		color: white;
	}

	.auto-outline {
		--badge-text-color: var(--ui-primary);
		--badge-bg-color: initial;
		--badge-border: 1px solid var(--ui-primary);
		--badge-border-color: var(--ui-primary);
		--badge-hover-bg-color: var(--ui-accent-dark);
		--badge-hover-border: 1px solid var(--ui-accent-dark);
		--badge-outline-color: var(--ui-accent-dark);
	}

	:global(.dark) .auto-outline {
		--badge-text-color: var(--ui-accent);
		--badge-bg-color: initial;
		--badge-border: 1px solid var(--ui-accent);
		--badge-border-color: var(--ui-accent);
		--badge-hover-bg-color: var(--ui-tertiary);
		--badge-hover-border: 1px solid var(--ui-tertiary);
		--badge-outline-color: var(--ui-tertiary);
	}

	.accent-outline,
	.pistachio-outline {
		--badge-text-color: var(--ui-accent);
		--badge-bg-color: initial;
		--badge-border: 1px solid var(--ui-accent);
		--badge-border-color: var(--ui-accent);
		--badge-hover-bg-color: var(--ui-tertiary);
		--badge-hover-border: 1px solid var(--ui-tertiary);
		--badge-outline-color: var(--ui-tertiary);
	}

	.primary-outline,
	.midnight-outline {
		--badge-text-color: var(--ui-primary);
		--badge-bg-color: initial;
		--badge-border: 1px solid var(--ui-primary);
		--badge-border-color: var(--ui-primary);
		--badge-hover-bg-color: var(--ui-accent-dark);
		--badge-hover-border: 1px solid var(--ui-accent-dark);
		--badge-outline-color: var(--ui-accent-dark);
	}

	.tertiary,
	.turquoise {
		--badge-text-color: black;
		--badge-bg-color: var(--ui-tertiary);
		--badge-hover-bg-color: var(--ui-tertiary-dark);
		--badge-outline-color: var(--ui-tertiary);
		--badge-border-color: var(--ui-tertiary-dark);
	}

	button,
	a,
	div {
		border-color: var(--badge-border-color, var(--ui-primary));
		transition:
			color 0.15s ease-in-out,
			background-color 0.15s ease-in-out,
			border-color 0.15s ease-in-out,
			box-shadow 0.15s ease-in-out;

		color: var(--badge-text-color);
		background-color: var(--badge-bg-color);
	}

	button:hover:not(:disabled),
	a:hover:not(:disabled) {
		background-color: var(--badge-hover-bg-color, var(--badge-bg-color));
	}

	.badge-container:has(button, a):hover:not(:has(:disabled)) {
		border: var(--badge-hover-border, var(--badge-border, 0));
	}

	button:focus-visible,
	a:focus-visible {
		outline: solid 0.125rem var(--badge-outline-color, var(--ui-accent-dark));
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
			--badge-text-color: var(--ui-primary);
		}

		.shaded {
			--badge-hover-bg-color: #1a1a1a;
		}

		.auto-subtle {
			--badge-text-color: white;
			--badge-hover-bg-color: var(--ui-primary);
			--badge-outline-color: var(--ui-accent);
		}
	}

	.disabled {
		opacity: 0.5;
	}

	.shape-pill {
		border-radius: 9999px;
	}

	.shape-pill > .badge {
		border-radius: 9999px;
	}

	.shape-pill .badge {
		border: none;
		padding: 0.25rem 0.5rem;
	}

	.shape-pill.badge-with-button .badge {
		padding-right: 0.25rem;
	}

	.size-sm .badge {
		font-size: 0.75rem;
		line-height: 1rem;
	}

	.size-sm .badge-button {
		padding: 2px;
	}

	.size-lg .badge {
		font-size: 1rem;
	}

	.size-lg .badge-button {
		padding: 6px;
	}

</style>
