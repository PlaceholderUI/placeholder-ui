<script lang="ts">
	import type { ComboBoxItem } from '../models/ComboBoxItem.js';
	import FormGroup from './FormGroup.svelte';

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
		tooltipLocation?: 'top' | 'bottom' | 'left' | 'right';
		onchange?: (e: string | undefined) => void;
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
		onchange = undefined
	}: Props = $props();

	const nonce = Math.random().toString(36).substring(2, 15);
	const randomName = $derived(label + nonce);

	function handleChange(option: ComboBoxItem) {
		if (option.value === value) return;

		value = option.value;
		onchange?.(value);
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
			{#each options as option, i}
				{@const id = randomName + i}
				<div class="flex">
					<label class={disabled ? 'cursor-not-allowed' : ''} for={id}>
						<input
							{id}
							type="radio"
							class="disabled:cursor-not-allowed accent-accent"
							name={randomName}
							{disabled}
							checked={option.value === value}
							onchange={() => handleChange(option)}
						/>
						{option.label}
					</label>
				</div>
			{/each}
		</div>
		{#if showError && errorText}
			<div class="error-text">{errorText}</div>
		{/if}
	</FormGroup>
</div>

<style>
	label {
		display: flex;
		flex-direction: row;
		align-items: center;
		user-select: none;
		cursor: pointer;
	}

	.disabled label,
	.disabled input {
		cursor: not-allowed;
	}

	input {
		position: relative !important;
		-webkit-appearance: none;
		-moz-appearance: none;
		appearance: none;
		margin: var(--pui-spacing-2);
		box-sizing: content-box;
		overflow: hidden;
		cursor: pointer;
	}

	input:before {
		content: '';
		display: block;
		box-sizing: content-box;
		width: 16px;
		height: 16px;
		border: 2px solid var(--pui-border-disabled);
		transition: var(--pui-transition-fast) border-color var(--pui-ease-out);
	}

	.radio-options {
		display: flex;
		gap: var(--pui-spacing-2);
		border-radius: var(--pui-radius-lg);
	}

	.radio-required {
		padding: var(--pui-spacing-1);
	}

	:global(.dark) input:before {
		border-color: var(--pui-color-gray-600);
	}
	input:checked:before {
		border-color: var(--pui-color-primary);
		transition: var(--pui-transition-slow) border-color var(--pui-ease-out);
	}
	:global(.dark) input:checked:before {
		border-color: var(--pui-color-primary);
	}

	input:disabled:before {
		border-color: var(--pui-border-disabled);
		background-color: var(--pui-border-disabled);
		opacity: 0.5;
	}
	:global(.dark) input:disabled:before {
		border-color: var(--pui-color-gray-600);
		background-color: var(--pui-color-gray-600);
	}
	input:after {
		content: '';
		display: block;
		position: absolute;
		box-sizing: content-box;
		top: 50%;
		left: 50%;
		transform-origin: 50% 50%;
		background-color: var(--pui-color-primary);
		width: 16px;
		height: 16px;
		border-radius: var(--pui-radius-full);
		transform: translate(-50%, -50%) scale(0);
	}
	input:disabled:after {
		opacity: 0.5;
	}
	:global(.dark) input:after {
		background-color: var(--pui-color-primary);
	}
	input[type='radio']:before {
		border-radius: var(--pui-radius-full);
	}
	input[type='radio']:after {
		width: 16px;
		height: 16px;
		border-radius: var(--pui-radius-full);
		transform: translate(-50%, -50%) scale(0);
	}
	input[type='radio']:checked:after {
		-webkit-animation: toggleOnRadio var(--pui-transition-fast) ease forwards;
		animation: toggleOnRadio var(--pui-transition-fast) ease forwards;
	}
	@-webkit-keyframes toggleOnRadio {
		0% {
			opacity: 0;
			transform: translate(-50%, -50%) scale(0);
		}
		70% {
			opacity: 1;
			transform: translate(-50%, -50%) scale(0.9);
		}
		100% {
			transform: translate(-50%, -50%) scale(0.8);
		}
	}
	@keyframes toggleOnRadio {
		0% {
			opacity: 0;
			transform: translate(-50%, -50%) scale(0);
		}
		70% {
			opacity: 1;
			transform: translate(-50%, -50%) scale(0.9);
		}
		100% {
			transform: translate(-50%, -50%) scale(0.8);
		}
	}

	.error {
		border: 1px solid var(--pui-text-danger);
	}

	.error-text {
		margin-top: var(--pui-spacing-1);
		color: var(--pui-text-danger);
	}
</style>
