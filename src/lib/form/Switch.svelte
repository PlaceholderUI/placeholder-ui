<script module lang="ts">
	import type { Snippet } from 'svelte';

	export interface SwitchProps {
		/** Label text displayed above the switch */
		label?: string;
		/** Mark field as required (shows asterisk) */
		required?: boolean;
		/** Whether the switch is on (bindable) */
		checked: boolean;
		/** Disable the switch */
		disabled?: boolean;
		/** CSS classes for the container element */
		containerClass?: string;
		/** CSS classes for the switch element */
		switchClass?: string;
		/** Custom ID for the switch element */
		inputId?: string;
		/** Callback when switch state changes */
		onchange?: (value: boolean) => void;
		/** Show error state styling */
		showError?: boolean;
		/** Error message to display */
		errorText?: string;
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
		label,
		required = false,
		checked = $bindable(),
		disabled = false,
		containerClass = '',
		switchClass = '',
		inputId = undefined,
		onchange,
		showError = false,
		errorText = '',
		tooltipText = undefined,
		tooltipLocation = 'top',
		tooltipContent = undefined
	}: SwitchProps = $props();

	const nonce = Math.random().toString(36).substring(2, 15);

	const id = $derived(inputId ? inputId : label ? `switch-${label}` : `switch-${nonce}`);

	function handleClick() {
		if (disabled) return;
		checked = !checked;
		onchange?.(checked);
	}
</script>

<div class="switch-container {containerClass} {disabled ? 'disabled' : ''}">
	<label for={id}>
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
		<button
			{id}
			role="switch"
			type="button"
			aria-checked={checked}
			aria-label={label || 'Toggle switch'}
			onclick={handleClick}
			class="switch {switchClass} {showError ? 'error' : ''} {disabled ? 'disabled' : ''}"
			{disabled}
		>
		</button>
	</label>
	{#if showError && errorText}
		<div class="error-text">{errorText}</div>
	{/if}
</div>

<style>
	:root .switch-container {
		--accent-color: var(--ui-primary);
		--gray: #ccc;
	}

	:global(.dark) .switch-container {
		--accent-color: var(--ui-primary);
		--gray: #444;
	}

	label {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		user-select: none;
		cursor: pointer;
	}

	.disabled label {
		cursor: not-allowed;
	}

	.switch {
		width: 3em;
		height: 1.6em;
		position: relative;
		margin: 4px 0 0 0;
		background: var(--gray);
		border: none;
		border-radius: 1.5em;
		cursor: pointer;
	}

	.switch::before {
		content: '';
		position: absolute;
		width: 1.3em;
		height: 1.3em;
		background: #fff;
		top: 0.13em;
		right: 1.5em;
		border-radius: 100%;
		transition: transform 0.3s;
	}

	.switch[aria-checked='true'] {
		background-color: var(--ui-primary);
	}

	.switch[aria-checked='true']::before {
		transform: translateX(1.3em);
		transition: transform 0.3s;
	}

	.switch:focus {
		outline: 1px solid var(--ui-primary);
		outline-offset: 2px;
	}

	.switch.disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}

	.switch.error {
		outline: 1px solid var(--danger-text);
	}

	.required {
		color: var(--danger-text);
	}

	.error-text {
		color: var(--danger-text);
	}
</style>
