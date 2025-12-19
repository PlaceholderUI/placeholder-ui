<script lang="ts">
	import type { ComboBoxItem } from '../models/ComboBoxItem.js';
	import FormGroup from './FormGroup.svelte';
	import { iconCheck } from '../icon/index.js';
	import Button from '../ui/Button.svelte';

	interface Props {
		label: string;
		options: ComboBoxItem[];
		required?: boolean;
		showError?: boolean;
		errorText?: string;
		class?: string;
		containerClass?: string;
		disabled?: boolean;
		value?: string;
		values?: string[];
		multiple?: boolean;
		deselectable?: boolean;
		tooltipLocation?: 'top' | 'bottom' | 'left' | 'right';
		onchange?: (e: string | string[] | undefined) => void;
	}

	let {
		label,
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
	}: Props = $props();

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
				<div class="flex">
					{#if checked}
						<Button class="chip checked" {disabled} onclick={() => handleChange(option)} svg={iconCheck} iconSize={'16px'}
							>{option.label}</Button
						>
					{:else}
						<Button class="chip" {disabled} onclick={() => handleChange(option)}
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
		gap: var(--pui-spacing-2);
		border-radius: var(--pui-radius-lg);
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

	:global(.chip) {
		padding: var(--pui-spacing-1) var(--pui-spacing-4) !important;
		border-radius: var(--pui-radius-full) !important;
	}

	:global(.chip.checked) {
		padding-left: var(--pui-spacing-1) !important;
		padding-right: var(--pui-spacing-2) !important;
	}

	:global(.chip .button) {
		gap: var(--pui-spacing-1);
	}
</style>
