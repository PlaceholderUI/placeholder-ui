<script lang="ts">
	import type { ComboBoxItem } from '$lib/models/ComboBoxItem.js';
	import FormGroup from '$lib/form/FormGroup.svelte';
	import Radio from '$lib/form/Radio.svelte';

	export interface RadioGroupProps {
		/** HTML name attribute for the radio group (falls back to label, then auto-generated) */
		name?: string;
		/** Label text displayed above the radio group */
		label: string;
		/** Available radio options */
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
		/** Disable all radio options */
		disabled?: boolean;
		/** When true, the radio state is controlled externally only. Clicking will call onchange but won't change the value. */
		controlled?: boolean;
		/** Display options vertically instead of horizontally */
		vertical?: boolean;
		/** Currently selected value (bindable) */
		value?: string;
		/** Position of the tooltip */
		tooltipLocation?: 'top' | 'bottom' | 'left' | 'right';
		/** Callback when selection changes */
		onchange?: (e: string | undefined) => void;
	}

	let {
		name,
		label,
		options,
		required = false,
		showError = false,
		errorText = '',
		class: classes = '',
		containerClass = '',
		vertical = false,
		disabled = false,
		controlled = false,
		tooltipLocation = 'top',
		value = $bindable(),
		onchange = undefined
	}: RadioGroupProps = $props();

	const autoName = `radio-${crypto.randomUUID()}`;
	const resolvedName = $derived((name || label || autoName).replace(/[^a-zA-Z0-9_\-:.]/g, '_'));

	function handleChange(option: ComboBoxItem) {
		if (option.value === value) return;

		if (!controlled) {
			value = option.value;
		}
		onchange?.(option.value);
	}
</script>

<div class="radio-container {containerClass}">
	<FormGroup {label} class={classes} {required} {tooltipLocation}>
		<div
			class="
        radio-options
		{vertical ? 'radio-vertical' : ''}
        {required ? 'radio-required' : ''}
		{showError ? 'error' : ''}
        {disabled ? 'disabled' : ''}"
		>
			{#each options as option, i}
				<Radio
					id={resolvedName + i}
					name={resolvedName}
					label={option.label}
					{disabled}
					checked={option.value === value}
					controlled={true}
					onchange={() => handleChange(option)}
				/>
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

	.radio-vertical.radio-options {
		gap: 0.25rem;
	}

	.radio-vertical {
		flex-direction: column;
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
</style>
