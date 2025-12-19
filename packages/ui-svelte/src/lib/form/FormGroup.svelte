<script lang="ts">
	import { Icon, iconInfoCircle } from '../icon/index.js';
	import Tooltip from '../ui/Tooltip.svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		label: string;
		required?: boolean;
		id?: string;
		class?: string;
		showError?: boolean;
		errorText?: string;
		tooltipContent?: Snippet;
		tooltipText?: string;
		tooltipLocation?: 'top' | 'bottom' | 'left' | 'right';
		children: Snippet;
	}

	let {
		label,
		required = false,
		id = undefined,
		class: classes = '',
		showError = false,
		errorText = '',
		tooltipContent,
		tooltipText,
		tooltipLocation = 'top',
		children
	}: Props = $props();

	const computedId = $derived(id ?? `form-${label}`);
</script>

<div class="form-group {classes}">
	{#if label}
		<label class="label" for={computedId}>
			{label}
			{#if required}
				<span class="text-required">*</span>
			{/if}
			{#if tooltipContent || tooltipText}
				<Tooltip {tooltipContent} location={tooltipLocation} text={tooltipText}>
					<Icon svg={iconInfoCircle} size="1em" stroke="var(--accent-color)" />
				</Tooltip>
			{/if}
		</label>
	{/if}

	{@render children?.()}

	{#if showError && errorText}
		<div class="error-text">{errorText}</div>
	{/if}
</div>

<style>
	.label {
		font-size: var(--pui-font-size-md);
		line-height: var(--pui-line-height-normal);
	}

	.error-text {
		color: var(--pui-text-danger);
		font-size: var(--pui-font-size-sm);
		margin-top: var(--pui-spacing-1);
	}
</style>
