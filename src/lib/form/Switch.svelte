<script module lang="ts">
	import type { Snippet } from 'svelte';

	export type SwitchLabelPosition = 'right' | 'left' | 'top';

	export interface SwitchProps {
		/** Label text displayed next to the switch */
		label?: string;
		/**
		 * Where the label sits relative to the switch.
		 * - `right` (default): switch then label, inline like a checkbox
		 * - `left`: label then switch, with the switch pushed to the far end (settings rows)
		 * - `top`: form-field style label above the switch, matching Textbox/Select
		 */
		labelPosition?: SwitchLabelPosition;
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
	import { Icon, iconInfoCircle } from '#lib/icon/index.js';
	import Tooltip from '#lib/ui/Tooltip.svelte';

	let {
		label,
		labelPosition = 'right',
		required = false,
		checked = $bindable(),
		disabled = false,
		containerClass = '',
		switchClass = '',
		inputId = undefined,
		onchange,
		showError = false,
		errorText = '',
		ariaLabel = undefined,
		tooltipText = undefined,
		tooltipLocation = 'top',
		tooltipContent = undefined
	}: SwitchProps = $props();

	const nonce = Math.random().toString(36).substring(2, 15);

	const id = $derived(
		inputId
			? inputId
			: label
				? `switch-${label.toLowerCase().replace(/[^a-z0-9_-]+/g, '-')}`
				: `switch-${nonce}`
	);

	const hasLabelText = $derived(!!label || required || !!tooltipContent || !!tooltipText);

	function handleClick() {
		if (disabled) return;
		checked = !checked;
		onchange?.(checked);
	}
</script>

<div class="switch-container {labelPosition} {containerClass}" class:disabled>
	<label for={id}>
		<button
			{id}
			role="switch"
			type="button"
			aria-checked={checked}
			aria-label={label ? undefined : (ariaLabel ?? 'Toggle switch')}
			aria-invalid={showError || undefined}
			onclick={handleClick}
			class="switch {switchClass}"
			class:error={showError}
			{disabled}
		>
			<span class="thumb"></span>
		</button>
		{#if hasLabelText}
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
		{/if}
	</label>
	{#if showError && errorText}
		<div class="error-text">{errorText}</div>
	{/if}
</div>

<style>
	.switch-container {
		--switch-track-off: #c4c9d0;
		--switch-track-off-hover: #adb3bc;
		--switch-track-on: var(--ui-primary);
		--switch-thumb: #fff;
		--switch-thumb-on: var(--ui-primary-contrast-color);
	}

	:global(.dark) .switch-container {
		--switch-track-off: #4a4d55;
		--switch-track-off-hover: #5c606a;
		--switch-track-on: var(--ui-accent);
		--switch-thumb: #d4d6da;
		--switch-thumb-on: var(--ui-accent-contrast-color);
	}

	label {
		display: inline-flex;
		align-items: center;
		gap: 0.625em;
		user-select: none;
		cursor: pointer;
		color: var(--text-color);
		line-height: 1.25;
	}

	.label-text {
		display: inline-flex;
		align-items: center;
		gap: 0.25em;
	}

	/* Label first, switch pushed to the far end */
	.left label {
		display: flex;
		flex-direction: row-reverse;
		justify-content: space-between;
	}

	/* Form-field style: matches FormGroup labels above Textbox, Select, etc. */
	.top label {
		flex-direction: column-reverse;
		align-items: flex-start;
		gap: 0.25rem;
	}

	.top .label-text {
		font-size: 0.875rem;
		line-height: 1.25rem;
		font-weight: 500;
		color: var(--label-color, #6c757d);
	}

	.switch {
		flex-shrink: 0;
		box-sizing: border-box;
		position: relative;
		width: 2.25em;
		height: 1.25em;
		margin: 0;
		padding: 0;
		font-size: inherit;
		background-color: var(--switch-track-off);
		border: none;
		border-radius: 999px;
		cursor: pointer;
		transition:
			background-color 0.2s ease,
			box-shadow 0.2s ease;
	}

	.thumb {
		position: absolute;
		top: 0.125em;
		left: 0.125em;
		width: 1em;
		height: 1em;
		border-radius: 50%;
		background-color: var(--switch-thumb);
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);
		transition:
			transform 0.2s ease,
			background-color 0.2s ease;
	}

	.switch[aria-checked='true'] {
		background-color: var(--switch-track-on);
	}

	.switch[aria-checked='true'] .thumb {
		transform: translateX(1em);
		background-color: var(--switch-thumb-on);
	}

	label:hover .switch:not(:disabled)[aria-checked='false'] {
		background-color: var(--switch-track-off-hover);
	}

	.switch:focus {
		outline: none;
	}

	.switch:focus-visible {
		outline: 2px solid var(--ui-focus-color);
		outline-offset: 2px;
	}

	.switch.error {
		box-shadow: inset 0 0 0 2px var(--danger-text);
	}

	.disabled {
		opacity: 0.5;
	}

	.disabled label,
	.switch:disabled {
		cursor: not-allowed;
	}

	.required {
		color: var(--danger-text);
	}

	.error-text {
		color: var(--danger-text);
		font-size: 0.875rem;
		margin-top: 0.25rem;
	}

	@media (prefers-reduced-motion: reduce) {
		.switch,
		.thumb {
			transition: none;
		}
	}
</style>
