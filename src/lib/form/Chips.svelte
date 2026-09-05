<script lang="ts">
	import type { ComboBoxItem } from '$lib/models/ComboBoxItem.js';
	import type { ButtonVariant } from '$lib/ui/ButtonVariant.js';
	import FormGroup from '$lib/form/FormGroup.svelte';
	import { iconCheck } from '$lib/icon/index.js';
	import Button from '$lib/ui/Button.svelte';

	export interface ChipsProps {
		/** Label text displayed above the chips */
		label?: string;
		/** Visual style variant for chips */
		variant?: ButtonVariant;
		/** Visual style variant for selected/checked chips */
		selectedVariant?: ButtonVariant;
		/** Visual style variant for deselected chips (overrides variant for unselected state) */
		deselectedVariant?: ButtonVariant;
		/** Available chip options */
		options: ComboBoxItem[];
		/** Mark field as required (shows asterisk) */
		required?: boolean;
		/** Show error state styling */
		showError?: boolean;
		/** Error message to display */
		errorText?: string;
		/** Additional CSS classes */
		class?: string;
		/** CSS classes for the container element */
		containerClass?: string;
		/** Disable all chips */
		disabled?: boolean;
		/** Selected value for single selection mode (bindable) */
		value?: string;
		/** Selected values for multiple selection mode (bindable) */
		values?: string[];
		/** Allow selecting multiple chips */
		multiple?: boolean;
		/** Allow deselecting the current selection */
		deselectable?: boolean;
		/** Position of the tooltip */
		tooltipLocation?: 'top' | 'bottom' | 'left' | 'right';
		/** Callback when selection changes */
		onchange?: (e: string | string[] | undefined) => void;
	}

	let {
		label = '',
		variant = undefined,
		selectedVariant = undefined,
		deselectedVariant = undefined,
		options,
		required = false,
		showError = false,
		errorText = '',
		class: classes = '',
		containerClass = '',
		disabled = false,
		tooltipLocation = 'top',
		value = $bindable(),
		values = $bindable([]),
		multiple = false,
		deselectable = true,
		onchange = undefined
	}: ChipsProps = $props();

	const nonce = Math.random().toString(36).substring(2, 15);
	const randomName = $derived(label + nonce);

	function handleChange(option: ComboBoxItem) {
		if (!multiple) {
			if (option.value === value) {
				if (!deselectable) return;
				value = undefined;
			} else {
				value = option.value;
			}
			onchange?.(value);
		} else {
			if (values.includes(option.value)) {
				if (!deselectable) return;
				values = values.filter((v) => v !== option.value);
			} else {
				values = [...values, option.value];
			}
			onchange?.(values.length > 0 ? values : undefined);
		}
	}


</script>

<div class="radio-container {containerClass}">
	<FormGroup {label} class={classes} {required} {tooltipLocation}>
		<div
			class="
        radio-options
        {required ? 'radio-required' : ''}
		{showError ? 'error' : ''}
        {disabled ? 'disabled' : ''}"
		>
			{#each options as option}
				{@const checked = multiple ? values.includes(option.value) : option.value === value}
				{@const hasSelection = multiple ? values.length > 0 : value !== undefined}
				{@const chipVariant = checked
					? (selectedVariant ?? variant)
					: (deselectedVariant && (multiple || hasSelection) ? deselectedVariant : variant)}
				<div class="flex">
					{#if checked}
						<Button class="chip checked" {disabled} onclick={() => handleChange(option)} svg={iconCheck} iconSize={'16px'} variant={chipVariant}
							>{option.label}</Button
						>
					{:else}
						<Button class="chip" {disabled} onclick={() => handleChange(option)} variant={chipVariant}
							>{option.label}</Button
						>
					{/if}
				</div>
			{/each}
		</div>
		{#if showError && errorText}
			<div class="error-text">{errorText}</div>
		{/if}
	</FormGroup>
</div>

<style>
	.radio-options {
		display: flex;
		gap: 0.5rem;
		border-radius: 6px;
	}

	.radio-required {
		padding: 0.25rem;
	}

	.error {
		border: 1px solid var(--danger-text);
	}

	.error-text {
		margin-top: 0.25rem;
		color: var(--danger-text);
	}

	:global(.chip) {
		padding: 0.25rem 1rem !important;
		border-radius: 5rem !important;
	}

	:global(.chip.checked) {
		padding-left: 0.3rem !important;
		padding-right: 0.5rem !important;
	}

	:global(.chip .button) {
		gap: 0.25rem;
	}
</style>
