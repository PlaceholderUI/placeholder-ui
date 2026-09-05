<script lang="ts">
	import Button from './Button.svelte';
	import Tooltip from './Tooltip.svelte';
	import Icon from '$lib/icon/Icon.svelte';
	import type { ButtonVariant } from './ButtonVariant.js';

	export interface ActionIconProps {
		/** Visual style variant */
		variant?: ButtonVariant;
		/** URL to navigate to (renders as anchor) */
		href?: string;
		/** Show loading state */
		loading?: boolean;
		/** Disable the button */
		disabled?: boolean;
		/** Style as an input button (for form inputs) */
		inputButton?: boolean;
		/** Size of the icon */
		size?: string;
		/** Raw SVG HTML string. Do NOT use external/user input - it will be executed in the browser */
		svg: string;
		/** Link target attribute (when href is provided) */
		target?: undefined | '_self' | '_blank';
		/** Additional CSS classes */
		class?: string;
		/** Click event handler */
		onclick?: (event: MouseEvent) => void;
		/** Tooltip text on hover */
		tooltip?: string;
		/** Accessible label for the button (recommended — the icon has no text) */
		ariaLabel?: string;
	}

	let {
		variant = 'auto-subtle',
		href = undefined,
		loading = false,
		disabled = false,
		inputButton = false,
		size = '20px',
		svg,
		target = undefined,
		class: buttonClass = '',
		onclick = undefined,
		tooltip = undefined,
		ariaLabel = undefined
	}: ActionIconProps = $props();
</script>

{#snippet buttonContent()}
	<Button
		{variant}
		{href}
		{disabled}
		{loading}
		{target}
		iconSize={size}
		class="action-icon {inputButton ? 'input-button' : ''} {buttonClass}"
		{onclick}
		ariaLabel={ariaLabel ?? tooltip}
	>
		{#if !loading}
			<Icon {svg} {size} />
		{/if}
	</Button>
{/snippet}

{#if tooltip}
	<Tooltip text={tooltip}>
		{@render buttonContent()}
	</Tooltip>
{:else}
	{@render buttonContent()}
{/if}

<style>
	:global(.pui-button.action-icon:active:not(:disabled)) {
		transform: translateY(0.0625rem);
	}
</style>
