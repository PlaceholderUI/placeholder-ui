<script lang="ts">
	import Button from './Button.svelte';
	import Tooltip from './Tooltip.svelte';
	import type { ButtonVariant } from './ButtonVariant.js';

	interface Props {
		variant?: ButtonVariant;
		href?: string;
		loading?: boolean;
		disabled?: boolean;
		inputButton?: boolean;
		size?: string;
		svg: string;
		target?: undefined | '_self' | '_blank';
		class?: string;
		onclick?: (event: MouseEvent) => void;
		tooltip?: string;
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
		onclick = () => {},
		tooltip = undefined
	}: Props = $props();
</script>

{#snippet buttonContent()}
	<Button
		{variant}
		{href}
		{disabled}
		{loading}
		{target}
		iconSize={size}
		effectsDisabled={false}
		class="action-icon {inputButton ? 'input-button' : ''} {buttonClass}"
		{onclick}
	>
		<span class="action-icon-svg" style="width:{size};height:{size};">
			{@html svg}
		</span>
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
	:global(button.action-icon):active:not(:disabled) {
		transform: translateY(calc(0.0625rem * 1));
	}

	.action-icon-svg {
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}

	.action-icon-svg :global(svg) {
		width: 100%;
		height: 100%;
	}
</style>
