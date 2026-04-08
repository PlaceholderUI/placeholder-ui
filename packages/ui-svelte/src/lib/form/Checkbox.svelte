<script lang="ts">
	import { Icon, iconInfoCircle } from '../icon/index.js';
	import Tooltip from '../ui/Tooltip.svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		/** HTML name attribute for the checkbox */
		name?: string;
		label?: string;
		required?: boolean;
		class?: string;
		inputId?: string;
		disabled?: boolean;
		showError?: boolean;
		errorText?: string;
		checked?: boolean;
		/** When true, the checkbox state is controlled externally only. Clicking will call onchange but won't toggle the checkbox. */
		controlled?: boolean;
		/** Whether the checkbox is in an indeterminate state */
		indeterminate?: boolean;
		onchange?: (e: boolean) => void;
		/** Accessible label for screen readers (use when no visible label) */
		ariaLabel?: string;
		/** Rich tooltip content using a Svelte snippet */
		tooltipContent?: Snippet;
		/** Simple tooltip text */
		tooltipText?: string;
		/** Position of the tooltip */
		tooltipLocation?: 'top' | 'bottom' | 'left' | 'right';
	}

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
		tooltipContent,
		tooltipText,
		tooltipLocation = 'top'
	}: Props = $props();

	const nonce = Math.random().toString(36).substring(2, 15);
	const resolvedName = $derived(
		(name || label || `checkbox-${nonce}`).replace(/[^a-zA-Z0-9_\-:.]/g, '_')
	);

	const id = $derived(inputId ? inputId : label ? `input-${label}` : `input-${nonce}`);

	let inputEl = $state<HTMLInputElement>();
	$effect(() => { if (inputEl) inputEl.indeterminate = indeterminate; });
</script>

<div class="checkbox-container {disabled ? 'disabled' : ''}">
	<label for={id}>
		{#if controlled}
			<input
				bind:this={inputEl}
				class="checkbox {showError && 'error'} {classes}"
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
				class="checkbox {showError && 'error'} {classes}"
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
					<Icon svg={iconInfoCircle} size="1em" />
				</Tooltip>
			{/if}</span
		>
	</label>
	{#if showError && errorText}
		<div class="error-text">{errorText}</div>
	{/if}
</div>

<style>
	.checkbox-container {
		display: flex;
		align-items: center;
		gap: var(--pui-spacing-1_5);
	}

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
		border: 2px solid var(--pui-border-disabled);
		transition: border-color var(--pui-transition-fast) var(--pui-ease-out);
	}
	:global(.dark) input:before {
		border-color: var(--pui-color-gray-600);
	}
	input:checked:before {
		border-color: var(--pui-color-primary);
		transition: border-color var(--pui-transition-slower) var(--pui-ease-out);
	}
	:global(.dark) input:checked:before {
		border-color: var(--pui-color-primary);
	}

	input:disabled:before {
		border-color: var(--pui-border-disabled);
		background-color: var(--pui-bg-disabled);
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
		border-radius: 100vh;
		transform: translate(-50%, -50%) scale(0);
	}
	input:disabled:after {
		opacity: 0.5;
	}
	:global(.dark) input:after {
		background-color: var(--pui-color-primary);
	}

	input[type='checkbox']:before {
		border-radius: var(--pui-radius-sm);
	}
	input[type='checkbox']:after {
		width: 7px;
		height: 14px;
		border-radius: 0;
		transform: translate(-50%, -85%) scale(0) rotate(45deg);
		background-color: transparent;
		box-shadow: 4px 4px 0px 0px var(--pui-color-primary);
	}
	:global(.dark) input[type='checkbox']:after {
		box-shadow: 4px 4px 0px 0px var(--pui-color-primary);
	}
	input[type='checkbox']:checked:after {
		-webkit-animation: toggleOnCheckbox var(--pui-transition-fast) var(--pui-ease-out) forwards;
		animation: toggleOnCheckbox var(--pui-transition-fast) var(--pui-ease-out) forwards;
	}

	/* Indeterminate state */
	input[type='checkbox']:indeterminate:before {
		border-color: var(--pui-color-primary);
	}
	:global(.dark) input[type='checkbox']:indeterminate:before {
		border-color: var(--pui-color-secondary);
	}
	input[type='checkbox']:indeterminate:after {
		width: 10px;
		height: 2px;
		border-radius: 1px;
		background-color: var(--pui-color-primary);
		box-shadow: none;
		transform: translate(-50%, -50%) scale(1);
	}
	:global(.dark) input[type='checkbox']:indeterminate:after {
		background-color: var(--pui-color-secondary);
	}

	input[type='checkbox'].filled:before {
		border-radius: var(--pui-radius-sm);
		transition:
			border-color var(--pui-transition-fast) var(--pui-ease-out),
			background-color var(--pui-transition-fast) var(--pui-ease-out);
	}
	input[type='checkbox'].filled:checked:not(:disabled):before {
		background-color: var(--pui-color-primary);
	}
	:global(.dark) input[type='checkbox'].filled:checked:not(:disabled):before {
		background-color: var(--pui-color-primary);
	}
	input[type='checkbox'].filled:not(:disabled):after {
		box-shadow: 4px 4px 0px 0px var(--pui-color-white);
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
		border-color: var(--pui-text-danger) !important;
	}

	.error-text {
		color: var(--pui-text-danger);
	}
</style>
