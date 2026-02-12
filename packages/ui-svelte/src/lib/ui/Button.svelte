<script lang="ts">
	import type { Snippet } from 'svelte';
	import Icon from '../icon/Icon.svelte';
	import type { ButtonVariant } from './ButtonVariant.js';
	import type { ButtonSize } from './ButtonSize.js';
	import Loader from './Loader.svelte';

	interface Props {
		variant?: ButtonVariant;
		size?: ButtonSize;
		href?: string;
		loading?: boolean;
		disabled?: boolean;
		effectsDisabled?: boolean;
		svg?: string;
		rightSvg?: string;
		iconSize?: string;
		target?: undefined | '_self' | '_blank';
		class?: string;
		children: Snippet;
		onclick?: (event: MouseEvent) => void;
	}

	let {
		variant = 'primary',
		size = 'md',
		href = undefined,
		loading = false,
		disabled = false,
		effectsDisabled = false,
		svg = undefined,
		rightSvg = undefined,
		iconSize = '18px',
		target = undefined,
		class: buttonClass = '',
		children,
		onclick = () => {}
	}: Props = $props();

	let isDisabled = $derived(loading || disabled);
	let isLink = $derived(!!href);

	let elClass = $derived(`pui-button ${buttonClass} ${variant} size-${size}${effectsDisabled ? ' effects-disabled' : ''}`);
</script>

{#snippet buttonContent()}
	<div class="button">
		{#if loading}
			<div class="button-loader" style="height: {iconSize}">
				<Loader
					class={variant === 'secondary' ? 'text-primary' : 'text-secondary'}
					sizeOverride={iconSize}
				/>
			</div>
		{:else if svg}
			<div class="button-icon">
				<Icon {svg} size={iconSize} />
			</div>
		{/if}
		{@render children?.()}
		{#if rightSvg}
			<div class="button-icon">
				<Icon svg={rightSvg} size={iconSize} />
			</div>
		{/if}
	</div>
{/snippet}

{#if isLink && href && !disabled}
	<a {target} class={elClass} {href} {onclick}>
		{@render buttonContent?.()}
	</a>
{:else}
	<button class={elClass} disabled={isDisabled} {onclick}>
		{@render buttonContent()}
	</button>
{/if}

<style>
	.pui-button {
		padding: var(--pui-spacing-2) var(--pui-spacing-4);
		border-radius: var(--pui-radius-lg);
		cursor: pointer;
		transition: all var(--pui-transition-fast) var(--pui-ease-in-out);
	}

	.size-xs {
		padding: var(--pui-spacing-1) var(--pui-spacing-2);
		font-size: var(--pui-font-size-xs);
		line-height: var(--pui-line-height-none);
	}

	.size-sm {
		padding: var(--pui-spacing-1_5) var(--pui-spacing-3);
		font-size: var(--pui-font-size-sm);
		line-height: var(--pui-line-height-none);
	}

	.size-md {
		padding: var(--pui-spacing-2) var(--pui-spacing-4);
		font-size: var(--pui-font-size-base);
		line-height: var(--pui-line-height-tight);
	}

	.size-lg {
		padding: var(--pui-spacing-2_5) var(--pui-spacing-5);
		font-size: var(--pui-font-size-md);
		line-height: var(--pui-line-height-tight);
	}

	.size-xl {
		padding: var(--pui-spacing-3) var(--pui-spacing-6);
		font-size: var(--pui-font-size-lg);
		line-height: var(--pui-line-height-snug);
	}

	:global(.paper-title) .pui-button {
		padding: var(--pui-spacing-1_5) var(--pui-spacing-2);
	}

	.white {
		--button-text-color: var(--pui-color-primary);
		--button-bg-color: var(--pui-color-white);
		--button-border: 0;
		--button-hover-bg-color: var(--pui-color-accent);
		--button-active-bg-color: var(--pui-color-accent-light);
		--button-outline-color: var(--pui-color-accent);
	}

	.muted {
		font-weight: var(--pui-font-weight-normal);
		box-sizing: border-box;
		--button-bg-color: var(--pui-input-bg);
		--button-border: 1px solid var(--pui-border-default);
		--button-hover-bg-color: var(--pui-color-primary-light);
		--button-active-bg-color: var(--pui-color-gray-500);
		--button-outline-color: var(--pui-text-primary);
	}

	.muted-subtle {
		font-weight: var(--pui-font-weight-normal);
		box-sizing: border-box;
		--button-bg-color: transparent;
		--button-hover-bg-color: var(--pui-color-primary-light);
		--button-active-bg-color: var(--pui-color-gray-500);
		--button-outline-color: var(--pui-text-primary);
	}

	.muted-selected {
		--button-bg-color: var(--pui-accent-color);
		--button-border: 1px solid var(--pui-accent-color);
		--button-text-color: var(--pui-color-white);
		font-weight: var(--pui-font-weight-normal);
	}

	.auto-subtle {
		--button-text-color: var(--pui-color-primary);
		--button-bg-color: initial;
		--button-hover-bg-color: var(--pui-color-primary-light);
		--button-hover-text-color: var(--pui-color-primary);
		--button-active-bg-color: var(--pui-color-primary);
		--button-active-text-color: var(--pui-color-secondary);
		--button-outline-color: var(--pui-color-accent);
	}

	.danger {
		--button-text-color: var(--pui-color-white);
		--button-bg-color: var(--pui-color-danger);
		--button-hover-bg-color: var(--pui-color-danger-hover);
		--button-active-bg-color: var(--pui-color-danger-active);
		--button-outline-color: var(--pui-color-accent);

		:global(.loader) {
			color: var(--pui-color-white);
		}
	}

	.danger-subtle {
		background-color: initial;
		color: var(--pui-text-danger);

		&:hover:not(:disabled) {
			background-color: var(--pui-color-danger-subtle);
		}

		:global(.loader) {
			color: var(--pui-text-danger);
		}
	}

	.secondary {
		--button-text-color: var(--pui-color-primary);
		--button-bg-color: var(--pui-color-secondary);
		--button-hover-bg-color: var(--pui-color-accent);
		--button-active-bg-color: var(--pui-color-accent-light);
		--button-outline-color: var(--pui-color-accent);
	}

	.secondary-outline {
		--button-text-color: var(--pui-color-secondary);
		--button-bg-color: initial;
		--button-border: 1px solid var(--pui-color-secondary);
		--button-hover-text-color: var(--pui-color-accent);
		--button-hover-border: 1px solid var(--pui-color-accent);
		--button-active-text-color: var(--pui-color-accent-light);
		--button-active-border: 1px solid var(--pui-color-accent-light);
		--button-outline-color: var(--pui-color-accent);
	}

	.secondary-subtle {
		--button-text-color: var(--pui-color-secondary);
		--button-bg-color: initial;
		--button-hover-text-color: var(--pui-color-primary);
		--button-hover-bg-color: var(--pui-color-primary-light);
		--button-active-text-color: var(--pui-color-white);
		--button-active-bg-color: var(--pui-color-secondary-dark);
		--button-outline-color: var(--pui-color-accent);
	}

	.primary {
		--button-bg-color: var(--pui-color-primary);
		--button-text-color: var(--pui-color-white);
		--button-hover-bg-color: var(--pui-color-primary-light);
		--button-active-bg-color: var(--pui-color-primary-dark);
	}

	.primary-outline {
		--button-text-color: var(--pui-color-primary);
		--button-bg-color: initial;
		--button-border: 1px solid var(--pui-color-primary);
		--button-hover-text-color: var(--pui-color-primary-light);
		--button-hover-border: 1px solid var(--pui-color-primary-light);
		--button-active-text-color: var(--pui-color-primary-dark);
		--button-active-border: 1px solid var(--pui-color-primary-dark);
	}

	.primary-subtle {
		--button-text-color: var(--pui-color-primary);
		--button-bg-color: initial;
		--button-hover-text-color: var(--pui-color-white);
		--button-hover-bg-color: var(--pui-color-primary);
		--button-active-text-color: var(--pui-color-white);
		--button-active-bg-color: var(--pui-color-primary-dark);
	}

	.accent {
		--button-text-color: var(--pui-color-black);
		--button-bg-color: var(--pui-color-accent);
		--button-hover-bg-color: var(--pui-color-accent-dark);
		--button-active-bg-color: var(--pui-color-accent-light);
		--button-outline-color: var(--pui-color-accent);
	}

	.accent-subtle {
		background-color: initial;
		color: var(--pui-color-accent-dark);

		&:hover:not(:disabled) {
			background-color: rgba(var(--pui-color-accent-rgb), 0.25);
		}

		&:focus-visible {
			outline-color: var(--pui-color-accent);
		}

		:global(.loader) {
			color: var(--pui-color-accent-dark);
		}
	}

	button,
	a {
		border-color: var(--pui-color-primary);
		font-size: var(--pui-font-size-base);
		font-weight: var(--pui-font-weight-semibold);
		line-height: var(--pui-line-height-tight);
		letter-spacing: var(--pui-letter-spacing-wide);
		transition:
			color var(--pui-transition-fast) var(--pui-ease-in-out),
			background-color var(--pui-transition-fast) var(--pui-ease-in-out),
			border-color var(--pui-transition-fast) var(--pui-ease-in-out),
			box-shadow var(--pui-transition-fast) var(--pui-ease-in-out);

		color: var(--button-text-color);
		background-color: var(--button-bg-color);
		border: var(--button-border, 0);

		&:hover:not(:disabled, .effects-disabled) {
			color: var(--button-hover-text-color, var(--button-text-color));
			background-color: var(--button-hover-bg-color, var(--button-bg-color));
			border: var(--button-hover-border, var(--button-border, 0));
		}

		&:active:not(:disabled, .effects-disabled) {
			color: var(--button-active-text-color, var(--button-text-color));
			background-color: var(--button-active-bg-color, var(--button-bg-color));
			border: var(--button-active-border, var(--button-border, 0));
		}

		&:focus-visible {
			outline: solid var(--pui-focus-ring-width) var(--button-outline-color, var(--pui-color-secondary-dark));
			outline-offset: var(--pui-focus-ring-offset);
		}

		&:disabled {
			opacity: 50%;
		}
	}

	:global(.dark) {
		.muted {
			--button-text-color: var(--pui-color-white);
			--button-active-bg-color: var(--pui-color-dark-300);
		}

		.muted-subtle {
			--button-active-bg-color: var(--pui-color-dark-300);
		}

		.muted-selected {
			--button-text-color: var(--pui-color-white);
		}

		.auto-subtle {
			--button-text-color: var(--pui-color-white);
			--button-hover-text-color: var(--pui-color-white);
			--button-hover-bg-color: var(--pui-color-primary-light);
			--button-active-text-color: var(--pui-color-secondary);
			--button-active-bg-color: var(--pui-color-primary);
			--button-outline-color: var(--pui-color-secondary);
		}
	}

	.action-icon {
		padding: var(--pui-spacing-1);
	}

	.action-icon > div {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.input-button {
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
		padding: 0 var(--pui-spacing-2);
		height: 100%;
	}

	.button-icon {
		display: inline-flex;
		align-items: center;
		height: 100%;
	}

	.button {
		display: flex;
		align-items: center;
		gap: var(--pui-spacing-2);
		width: auto;
		justify-content: center;
		user-select: none;
	}

	a.pui-button {
		text-decoration: none;
		display: inline-flex;
	}
</style>
