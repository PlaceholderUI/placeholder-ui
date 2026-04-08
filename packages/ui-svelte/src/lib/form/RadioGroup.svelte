<script lang="ts">
	import type { ComboBoxItem } from '../models/ComboBoxItem.js';
	import FormGroup from './FormGroup.svelte';
	import Radio from './Radio.svelte';

	interface Props {
		/** HTML name attribute for the radio group (falls back to label, then auto-generated) */
		name?: string;
		label: string;
		options: ComboBoxItem[];
		required?: boolean;
		showError?: boolean;
		errorText?: string;
		class?: string;
		containerClass?: string;
		disabled?: boolean;
		/** When true, the radio state is controlled externally only. Clicking will call onchange but won't change the value. */
		controlled?: boolean;
		/** Display options vertically instead of horizontally */
		vertical?: boolean;
		value?: string;
		tooltipLocation?: 'top' | 'bottom' | 'left' | 'right';
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
		disabled = false,
		controlled = false,
		vertical = false,
		tooltipLocation = 'top',
		value = $bindable(),
		onchange = undefined
	}: Props = $props();

	const nonce = Math.random().toString(36).substring(2, 15);
	const resolvedName = $derived(
		(name || label || `radio-${nonce}`).replace(/[^a-zA-Z0-9_\-:.]/g, '_')
	);

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
		gap: var(--pui-spacing-2);
		border-radius: var(--pui-radius-lg);
	}

	.radio-vertical.radio-options {
		gap: var(--pui-spacing-1);
	}

	.radio-vertical {
		flex-direction: column;
	}

	.radio-required {
		padding: var(--pui-spacing-1);
	}

	.error {
		border: 1px solid var(--pui-text-danger);
	}

	.error-text {
		margin-top: var(--pui-spacing-1);
		color: var(--pui-text-danger);
	}
</style>
