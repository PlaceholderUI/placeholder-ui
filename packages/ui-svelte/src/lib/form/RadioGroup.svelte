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
		margin: 8px;
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
		border: 2px solid #ccc;
		transition: 0.2s border-color ease;
	}

	.radio-options {
		display: flex;
		gap: 0.5rem;
		border-radius: 6px;
	}

	.radio-required {
		padding: 0.25rem;
	}

	:global(.dark) input:before {
		border-color: #666;
	}
	input:checked:before {
		border-color: var(--midnight);
		transition: 0.5s border-color ease;
	}
	:global(.dark) input:checked:before {
		border-color: var(--pistachio);
	}

	input:disabled:before {
		border-color: #ccc;
		background-color: #ccc;
		opacity: 0.5;
	}
	:global(.dark) input:disabled:before {
		border-color: #666;
		background-color: #666;
	}
	input:after {
		content: '';
		display: block;
		position: absolute;
		box-sizing: content-box;
		top: 50%;
		left: 50%;
		transform-origin: 50% 50%;
		background-color: var(--midnight);
		width: 16px;
		height: 16px;
		border-radius: 100vh;
		transform: translate(-50%, -50%) scale(0);
	}
	input:disabled:after {
		opacity: 0.5;
	}
	:global(.dark) input:after {
		background-color: var(--pistachio);
	}
	input[type='radio']:before {
		border-radius: 100vh;
	}
	input[type='radio']:after {
		width: 16px;
		height: 16px;
		border-radius: 100vh;
		transform: translate(-50%, -50%) scale(0);
	}
	input[type='radio']:checked:after {
		-webkit-animation: toggleOnRadio 0.2s ease forwards;
		animation: toggleOnRadio 0.2s ease forwards;
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
		border: 1px solid var(--danger-text);
	}

	.error-text {
		margin-top: 0.25rem;
		color: var(--danger-text);
	}
</style>
