<script module lang="ts">
	import type { Snippet } from 'svelte';

	export interface FormGroupProps {
		/** Label text displayed above the form field */
		label: string;
		/** Mark field as required (shows asterisk) */
		required?: boolean;
		/** Custom ID for the form field */
		id?: string;
		/** Additional CSS classes */
		class?: string;
		/** Show error state styling */
		showError?: boolean;
		/** Error message to display */
		errorText?: string;
		/** Rich tooltip content using a Svelte snippet */
		tooltipContent?: Snippet;
		/** Simple tooltip text */
		tooltipText?: string;
		/** Position of the tooltip */
		tooltipLocation?: 'top' | 'bottom' | 'left' | 'right';
		/** Form field content */
		children: Snippet;
	}
</script>

<script lang="ts">
	import { Icon, iconInfoCircle } from '$lib/icon/index.js';
	import Tooltip from '$lib/ui/Tooltip.svelte';

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
	}: FormGroupProps = $props();

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
		display: flex;
		align-items: center;
		gap: 0.25rem;
		font-size: 0.875rem;
		line-height: 1.25rem;
		font-weight: 500;
		margin-bottom: 0.25rem;
		color: var(--label-color, var(--bs-secondary, #6c757d));
	}

	.text-required {
		color: var(--danger-text);
	}

	.error-text {
		color: var(--danger-text);
		font-size: 0.875rem;
		margin-top: 0.25rem;
	}
</style>
