<script lang="ts">
	import type { Snippet } from 'svelte';
	import Icon from '$lib/icon/Icon.svelte';
	import type { ButtonVariant } from './ButtonVariant.js';
	import type { ButtonSize } from './ButtonSize.js';
	import Loader from './Loader.svelte';
	import { resolve } from '$app/paths';
	import { interceptLinkClick } from '$lib/util/interceptLinkClick.js';

	export interface ButtonProps {
		/** Visual style variant of the button */
		variant?: ButtonVariant;
		/** Size of the button */
		size?: ButtonSize;
		/** URL to navigate to (renders as anchor tag) */
		href?: string;
		/** Show loading spinner and disable interactions */
		loading?: boolean;
		/** Disable the button */
		disabled?: boolean;
		/** Disable hover/click visual effects */
		effectsDisabled?: boolean;
		/** SVG icon to display on the left side */
		svg?: string;
		/** SVG icon to display on the right side */
		rightSvg?: string;
		/** Size of the icon(s) */
		iconSize?: string;
		/** Link target attribute (when href is provided) */
		target?: undefined | '_self' | '_blank';
		/** Button type attribute (when rendered as a button, not a link) */
		type?: 'button' | 'submit' | 'reset';
		/** Additional CSS classes */
		class?: string;
		/** Button content */
		children: Snippet;
		/** Click event handler */
		onclick?: (event: MouseEvent) => void;
		/** Accessible label (use when the button has no visible text) */
		ariaLabel?: string;
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
		type = 'button',
		class: buttonClass = '',
		children,
		onclick = undefined,
		ariaLabel = undefined
	}: ButtonProps = $props();

	let isDisabled = $derived(loading || disabled);
	let isLink = $derived(!!href);

	let elClass = $derived(
		`pui-button ${buttonClass} ${variant} size-${size}${effectsDisabled ? ' effects-disabled' : ''}`
	);
</script>

{#snippet buttonContent()}
	<div class="button">
		{#if loading}
			<div class="button-loader" style="height: {iconSize}">
				<Loader sizeOverride={iconSize} />
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
	<a {target} class={elClass} aria-label={ariaLabel} href={href?.startsWith('/') ? resolve(href as any) : href} onclick={(e) => interceptLinkClick(e, { href, target, onclick })}>
		{@render buttonContent?.()}
	</a>
{:else}
	<button {type} class={elClass} disabled={isDisabled} aria-label={ariaLabel} {onclick}>
		{@render buttonContent()}
	</button>
{/if}

<style>
	.pui-button {
		padding: 0.5rem 1rem;
		border-radius: 6px;
		cursor: pointer;
		transition: all 0.2s ease-in-out;
	}

	.size-xs {
		padding: 0.25rem 0.5rem;
		font-size: 0.75rem;
		line-height: 1rem;
	}

	.size-sm {
		padding: 0.375rem 0.75rem;
		font-size: 0.8125rem;
		line-height: 1.0625rem;
	}

	.size-md {
		padding: 0.5rem 1rem;
		font-size: 0.875rem;
		line-height: 1.125rem;
	}

	.size-lg {
		padding: 0.625rem 1.25rem;
		font-size: 1rem;
		line-height: 1.25rem;
	}

	.size-xl {
		padding: 0.75rem 1.5rem;
		font-size: 1.125rem;
		line-height: 1.375rem;
	}

	:global(.paper-title) .pui-button {
		padding: 0.35rem 0.5rem;
	}

	.white {
		--button-text-color: var(--ui-primary);
		--button-bg-color: white;
		--button-border: 0;
		--button-hover-bg-color: var(--ui-tertiary);
		--button-active-bg-color: var(--ui-tertiary-light);
		--button-outline-color: var(--ui-tertiary);
	}

	.secondary {
		font-weight: normal;
		box-sizing: border-box;
		--button-bg-color: var(--input-bg);
		--button-border: 1px solid var(--border-color);
		--button-hover-bg-color: var(--border-color);
		--button-active-bg-color: #aaaaaa;
		--button-outline-color: var(--text-color);
	}

	.secondary-subtle {
		font-weight: normal;
		box-sizing: border-box;
		--button-bg-color: transparent;
		--button-hover-bg-color: #aaaaaa66;
		--button-active-bg-color: #aaaaaa;
		--button-outline-color: var(--text-color);
	}

	.secondary-selected {
		--button-bg-color: var(--accent-color);
		--button-border: 1px solid var(--accent-color);
		--button-text-color: white;
		font-weight: normal;
	}

	.auto-subtle {
		--button-text-color: var(--ui-primary);
		--button-bg-color: initial;
		--button-hover-bg-color: var(--ui-accent);
		--button-hover-text-color: var(--ui-primary);
		--button-active-bg-color: var(--ui-primary);
		--button-active-text-color: var(--ui-accent);
		--button-outline-color: var(--ui-tertiary);
	}

	.danger {
		--button-text-color: white;
		--button-bg-color: var(--danger-bg);

		--button-hover-bg-color: var(--danger-bg-hover);

		--button-active-bg-color: #b02a37;

		--button-outline-color: var(--ui-tertiary);

		:global(.loader) {
			color: white;
		}
	}

	.danger-subtle {
		background-color: initial;
		color: var(--danger-text);

		&:hover:not(:disabled) {
			background-color: var(--danger-bg-subtle);
		}

		:global(.loader) {
			color: var(--danger-text);
		}
	}

	.accent,
	.pistachio {
		--button-text-color: var(--ui-primary);
		--button-bg-color: var(--ui-accent);
		--button-hover-bg-color: var(--ui-tertiary);
		--button-active-bg-color: var(--ui-tertiary-light);
		--button-outline-color: var(--ui-tertiary);
	}

	.accent-outline,
	.pistachio-outline {
		--button-text-color: var(--ui-accent);
		--button-bg-color: initial;
		--button-border: 1px solid var(--ui-accent);
		--button-hover-text-color: var(--ui-tertiary);
		--button-hover-border: 1px solid var(--ui-tertiary);
		--button-active-text-color: var(--ui-tertiary-light);
		--button-active-border: 1px solid var(--ui-tertiary-light);
		--button-outline-color: var(--ui-tertiary);
	}

	.accent-subtle,
	.pistachio-subtle {
		--button-text-color: var(--ui-accent);
		--button-bg-color: initial;
		--button-hover-text-color: var(--ui-primary);
		--button-hover-bg-color: var(--ui-accent);
		--button-active-text-color: white;
		--button-active-bg-color: var(--ui-accent-dark);
		--button-outline-color: var(--ui-tertiary);
	}

	.primary,
	.midnight {
		--button-bg-color: var(--ui-primary);
		--button-text-color: white;
		--button-hover-bg-color: var(--ui-accent-dark);
		--button-active-bg-color: var(--ui-primary-dark);
	}

	.primary-outline,
	.midnight-outline {
		--button-text-color: var(--ui-primary);
		--button-bg-color: initial;
		--button-border: 1px solid var(--ui-primary);
		--button-hover-text-color: var(--ui-accent-dark);
		--button-hover-border: 1px solid var(--ui-accent-dark);
		--button-active-text-color: var(--ui-primary-dark);
		--button-active-border: 1px solid var(--ui-primary-dark);
	}

	.primary-subtle,
	.midnight-subtle {
		--button-text-color: var(--ui-primary);
		--button-bg-color: initial;
		--button-hover-text-color: white;
		--button-hover-bg-color: var(--ui-primary);
		--button-active-text-color: white;
		--button-active-bg-color: var(--ui-primary-dark);
	}

	.tertiary,
	.turquoise {
		--button-text-color: var(--ui-primary);
		--button-bg-color: var(--ui-tertiary);
		--button-hover-bg-color: var(--ui-accent);
		--button-active-bg-color: var(--ui-tertiary-light);
		--button-outline-color: var(--ui-accent);
	}

	.tertiary-subtle,
	.turquoise-subtle {
		background-color: initial;
		color: var(--ui-tertiary-dark);

		&:hover:not(:disabled) {
			background-color: rgba(var(--ui-tertiary-dark-rgbc), 0.25);
		}

		&:focus-visible {
			outline-color: var(--ui-tertiary);
		}

		:global(.loader) {
			color: var(--ui-tertiary-dark);
		}
	}

	button,
	a {
		border-color: var(--ui-primary);
		font-size: 0.875rem;
		font-weight: 600;
		line-height: 1.125rem;
		letter-spacing: 0.05rem;
		transition:
			color 0.15s ease-in-out,
			background-color 0.15s ease-in-out,
			border-color 0.15s ease-in-out,
			box-shadow 0.15s ease-in-out;

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
			outline: solid 0.125rem var(--button-outline-color, var(--ui-accent-dark));
			outline-offset: 0.125rem;
		}

		&:disabled {
			opacity: 50%;
		}
	}

	:global(.dark) {
		.secondary {
			--button-text-color: white;
			--button-active-bg-color: #333333;
		}

		.secondary-subtle {
			--button-active-bg-color: background-color: #333333;
		}

		.secondary-selected {
			--button-text-color: black;
		}

		.auto-subtle {
			--button-text-color: white;
			--button-hover-text-color: white;
			--button-hover-bg-color: var(--ui-primary);
			--button-active-text-color: var(--ui-accent);
			--button-active-bg-color: var(--ui-primary);
			--button-outline-color: var(--ui-accent);
		}
	}

	/* .action-icon and .input-button are applied by ActionIcon.svelte via the class prop;
	   they must live here because the button element belongs to this component's scope */
	.action-icon {
		padding: 0.25rem;
	}

	.action-icon > div {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.input-button {
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
		padding: 0 0.5rem;
		height: 100%;
		/* rounded-l-none py-0 !px-2 min-h-[33.6px] h-full */
	}

	.button-icon {
		display: inline-flex;
		align-items: center;
		height: 100%;
	}

	.button {
		/* flex justify-center gap-x-2 */
		display: flex;
		align-items: center;
		gap: 0.5rem;
		width: auto;
		justify-content: center;
		user-select: none;
	}

	a.pui-button {
		text-decoration: none;
		display: inline-flex;
	}
</style>
