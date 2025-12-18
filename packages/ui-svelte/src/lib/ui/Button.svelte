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
		variant = 'midnight',
		size = 'md',
		href = undefined,
		loading = false,
		disabled = false,
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

	let elClass = $derived(`cui-button ${buttonClass} ${variant} size-${size}`);
</script>

{#snippet buttonContent()}
	<div class="button">
		{#if loading}
			<div class="button-loader" style="height: {iconSize}">
				<Loader
					class={variant === 'pistachio' ? 'text-midnight' : 'text-pistachio'}
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
	.cui-button {
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

	:global(.paper-title) .cui-button {
		padding: 0.35rem 0.5rem;
	}

	.white {
		--button-text-color: var(--midnight);
		--button-bg-color: white;
		--button-border: 0;
		--button-hover-bg-color: var(--turquoise);
		--button-active-bg-color: #c3e8e4;
		--button-outline-color: var(--turquoise);
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
		--button-text-color: var(--midnight);
		--button-bg-color: initial;
		--button-hover-bg-color: var(--pistachio);
		--button-hover-text-color: var(--midnight);
		--button-active-bg-color: var(--midnight);
		--button-active-text-color: var(--pistachio);
		--button-outline-color: var(--turquoise);
	}

	.danger {
		--button-text-color: white;
		--button-bg-color: var(--danger-bg);

		--button-hover-bg-color: var(--danger-bg-hover);

		--button-active-bg-color: #b02a37;

		--button-outline-color: var(--turquoise);

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

	.pistachio {
		--button-text-color: var(--midnight);
		--button-bg-color: var(--pistachio);
		--button-hover-bg-color: var(--turquoise);
		--button-active-bg-color: #c3e8e4;
		--button-outline-color: var(--turquoise);
	}

	.pistachio-outline {
		--button-text-color: var(--pistachio);
		--button-bg-color: initial;
		--button-border: 1px solid var(--pistachio);
		--button-hover-text-color: var(--turquoise);
		--button-hover-border: 1px solid var(--turquoise);
		--button-active-text-color: #c3e8e4;
		--button-active-border: 1px solid #c3e8e4;
		--button-outline-color: var(--turquoise);
	}

	.pistachio-subtle {
		--button-text-color: var(--pistachio);
		--button-bg-color: initial;
		--button-hover-text-color: var(--midnight);
		--button-hover-bg-color: var(--pistachio);
		--button-active-text-color: white;
		--button-active-bg-color: #697f1a;
		--button-outline-color: var(--turquoise);
	}

	.midnight {
		--button-bg-color: var(--midnight);
		--button-text-color: white;
		--button-hover-bg-color: #697f1a;
		--button-active-bg-color: #102828;
	}

	.midnight-outline {
		--button-text-color: var(--midnight);
		--button-bg-color: initial;
		--button-border: 1px solid var(--midnight);
		--button-hover-text-color: #697f1a;
		--button-hover-border: 1px solid #697f1a;
		--button-active-text-color: #102828;
		--button-active-border: 1px solid #102828;
	}

	.midnight-subtle {
		--button-text-color: var(--midnight);
		--button-bg-color: initial;
		--button-hover-text-color: white;
		--button-hover-bg-color: var(--midnight);
		--button-active-text-color: white;
		--button-active-bg-color: #102828;
	}

	.turquoise-subtle {
		background-color: initial;
		color: rgb(49, 129, 128);

		&:hover:not(:disabled) {
			background-color: rgba(49, 129, 128, 0.25);
		}

		&:focus-visible {
			outline-color: var(--turquoise);
		}

		:global(.loader) {
			color: rgb(49, 129, 128);
		}
	}

	button,
	a {
		border-color: var(--midnight);
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
			outline: solid 0.125rem var(--button-outline-color, var(--pistachio-dark));
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
			--button-active-bg-color: #333333;
		}

		.secondary-selected {
			--button-text-color: white;
		}

		.auto-subtle {
			--button-text-color: white;
			--button-hover-text-color: white;
			--button-hover-bg-color: var(--midnight);
			--button-active-text-color: var(--pistachio);
			--button-active-bg-color: var(--midnight);
			--button-outline-color: var(--pistachio);
		}
	}

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

	a.cui-button {
		text-decoration: none;
		display: inline-flex;
	}
</style>
