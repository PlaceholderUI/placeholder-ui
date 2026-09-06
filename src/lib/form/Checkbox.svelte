<script module lang="ts">
	import type { Snippet } from 'svelte';

	export interface CheckboxProps {
		/** HTML name attribute for the checkbox (falls back to label, then auto-generated) */
		name?: string;
		/** Label text displayed next to the checkbox */
		label?: string;
		/** Mark field as required (shows asterisk) */
		required?: boolean;
		/** Additional CSS classes */
		class?: string;
		/** Custom ID for the input element */
		inputId?: string;
		/** Disable the checkbox */
		disabled?: boolean;
		/** Show error state styling */
		showError?: boolean;
		/** Error message to display */
		errorText?: string;
		/** Whether the checkbox is checked (bindable) */
		checked?: boolean;
		/** When true, the checkbox state is controlled externally only. Clicking will call onchange but won't toggle the checkbox. */
		controlled?: boolean;
		/** Whether the checkbox is in an indeterminate state */
		indeterminate?: boolean;
		/** Callback when checked state changes */
		onchange?: (e: boolean) => void;
		/** Accessible label for screen readers (use when no visible label) */
		ariaLabel?: string;
		/** Simple tooltip text */
		tooltipText?: string;
		/** Position of the tooltip */
		tooltipLocation?: 'top' | 'bottom' | 'left' | 'right';
		/** Rich tooltip content using a Svelte snippet */
		tooltipContent?: Snippet;
	}
</script>

<script lang="ts">
	import { Icon, iconInfoCircle } from '$lib/icon/index.js';
	import Tooltip from '$lib/ui/Tooltip.svelte';

	let {
		name,
		label,
		required = false,
		class: classes = '',
		inputId = undefined,
		disabled = false,
		showError = false,
		errorText = '',
		checked = $bindable(false),
		controlled = false,
		indeterminate = false,
		onchange = undefined,
		ariaLabel = undefined,
		tooltipText = undefined,
		tooltipLocation = 'top',
		tooltipContent = undefined
	}: CheckboxProps = $props();

	const autoName = `checkbox-${crypto.randomUUID()}`;
	const nonce = Math.random().toString(36).substring(2, 15);

	let resolvedName = $derived((name || label || autoName).replace(/[^a-zA-Z0-9_\-:.]/g, '_'));

	const id = $derived(inputId ? inputId : label ? `input-${label}` : `input-${nonce}`);

	let inputEl = $state<HTMLInputElement>();
	$effect(() => {
		if (inputEl) inputEl.indeterminate = indeterminate;
	});
</script>

<div class="checkbox-container {disabled ? 'disabled' : ''}">
	<label for={id}>
		{#if controlled}
			<input
				bind:this={inputEl}
				class="checkbox text-base accent-accent mr-1 {showError && 'error'} {classes}"
				type="checkbox"
				{id}
				name={resolvedName}
				{disabled}
				{checked}
				aria-label={ariaLabel}
				onchange={(e) => {
					e.currentTarget.checked = checked;
					onchange?.(!checked);
				}}
			/>
		{:else}
			<input
				bind:this={inputEl}
				class="checkbox text-base accent-accent mr-1 {showError && 'error'} {classes}"
				type="checkbox"
				{id}
				name={resolvedName}
				{disabled}
				bind:checked
				aria-label={ariaLabel}
				onchange={() => onchange?.(checked)}
			/>
		{/if}
		<span class="label-text"
			>{label}
			{#if required}
				<span class="required">*</span>
			{/if}
			{#if tooltipContent || tooltipText}
				<Tooltip {tooltipContent} location={tooltipLocation} text={tooltipText}>
					<Icon svg={iconInfoCircle} size="1em" stroke="var(--accent-color)" />
				</Tooltip>
			{/if}</span
		>
	</label>
	{#if showError && errorText}
		<div class="error-text">{errorText}</div>
	{/if}
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
	:global(.dark) input:before {
		border-color: #666;
	}
	input:checked:before {
		border-color: var(--ui-primary);
		transition: 0.5s border-color ease;
	}
	:global(.dark) input:checked:before {
		border-color: var(--ui-accent);
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
		background-color: var(--ui-primary);
		width: 16px;
		height: 16px;
		border-radius: 100vh;
		transform: translate(-50%, -50%) scale(0);
	}
	input:disabled:after {
		opacity: 0.5;
	}
	:global(.dark) input:after {
		background-color: var(--ui-accent);
	}

	input[type='checkbox']:before {
		border-radius: 4px;
	}
	input[type='checkbox']:after {
		width: 7px;
		height: 14px;
		border-radius: 0;
		transform: translate(-50%, -85%) scale(0) rotate(45deg);
		background-color: transparent;
		box-shadow: 4px 4px 0px 0px var(--ui-primary);
	}
	:global(.dark) input[type='checkbox']:after {
		box-shadow: 4px 4px 0px 0px var(--ui-accent);
	}
	input[type='checkbox']:checked:after {
		-webkit-animation: toggleOnCheckbox 0.2s ease forwards;
		animation: toggleOnCheckbox 0.2s ease forwards;
	}
	input[type='checkbox']:indeterminate:before {
		border-color: var(--ui-primary);
	}
	:global(.dark) input[type='checkbox']:indeterminate:before {
		border-color: var(--ui-accent);
	}
	input[type='checkbox']:indeterminate:after {
		width: 10px;
		height: 2px;
		border-radius: 1px;
		background-color: var(--ui-primary);
		box-shadow: none;
		transform: translate(-50%, -50%) scale(1);
	}
	:global(.dark) input[type='checkbox']:indeterminate:after {
		background-color: var(--ui-accent);
	}
	input[type='checkbox'].filled:before {
		border-radius: 4px;
		transition:
			0.2s border-color ease,
			0.2s background-color ease;
	}
	input[type='checkbox'].filled:checked:not(:disabled):before {
		background-color: var(--ui-primary);
	}
	:global(.dark) input[type='checkbox'].filled:checked:not(:disabled):before {
		background-color: var(--ui-accent);
	}
	input[type='checkbox'].filled:not(:disabled):after {
		box-shadow: 4px 4px 0px 0px white;
	}
	@-webkit-keyframes toggleOnCheckbox {
		0% {
			opacity: 0;
			transform: translate(-50%, -85%) scale(0) rotate(45deg);
		}
		70% {
			opacity: 1;
			transform: translate(-50%, -85%) scale(0.9) rotate(45deg);
		}
		100% {
			transform: translate(-50%, -85%) scale(0.8) rotate(45deg);
		}
	}
	@keyframes toggleOnCheckbox {
		0% {
			opacity: 0;
			transform: translate(-50%, -85%) scale(0) rotate(45deg);
		}
		70% {
			opacity: 1;
			transform: translate(-50%, -85%) scale(0.9) rotate(45deg);
		}
		100% {
			transform: translate(-50%, -85%) scale(0.8) rotate(45deg);
		}
	}

	input.error:before {
		border-color: var(--danger-text) !important;
	}

	.error-text {
		color: var(--danger-text);
	}
</style>
