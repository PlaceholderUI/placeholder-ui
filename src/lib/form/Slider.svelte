<script lang="ts">
	import Tooltip from '$lib/ui/Tooltip.svelte';
	import { Icon, iconInfoCircle } from '$lib/icon/index.js';

	const autoName = `slider-${crypto.randomUUID()}`;

	export interface SliderProps {
		/** HTML name attribute for the slider (falls back to label, then auto-generated) */
		name?: string;
		/** Label text displayed above the slider */
		label?: string;
		/** Custom ID for the slider element */
		inputId?: string;
		/** Mark field as required (shows asterisk) */
		required?: boolean;
		/** Disable the slider */
		disabled?: boolean;
		/** CSS classes for the slider element */
		class?: string;
		/** CSS classes for the container element */
		containerClass?: string;
		/** Slider value (bindable) */
		value?: number;
		/** Minimum allowed value */
		min?: number;
		/** Maximum allowed value */
		max?: number;
		/** Increment/decrement step value */
		step?: number;
		/** Show error state styling */
		showError?: boolean;
		/** Error message to display */
		errorText?: string;
		/** Position of the tooltip */
		tooltipLocation?: 'top' | 'bottom' | 'left' | 'right';
		/** Simple tooltip text */
		tooltipText?: string;
		/** Hide the current value next to the label */
		hideValue?: boolean;
		/** Format function for displaying the value */
		formatValue?: (value: number) => string;
		/** Callback when value changes (after interaction ends) */
		onchange?: (value: number) => void;
		/** Callback on input event (during dragging) */
		oninput?: (value: number) => void;
		/** Callback when slider gains focus */
		onfocus?: (e: FocusEvent) => void;
		/** Callback when slider loses focus */
		onblur?: (e: FocusEvent) => void;
	}

	let {
		name,
		label = '',
		inputId = undefined,
		required = false,
		disabled = false,
		class: classes = '',
		containerClass = '',
		value = $bindable(50),
		min = 0,
		max = 100,
		step = 1,
		showError = false,
		errorText = '',
		tooltipLocation = 'top',
		tooltipText = undefined,
		hideValue = false,
		formatValue = (v: number) => v.toString(),
		onchange = undefined,
		oninput = undefined,
		onfocus = undefined,
		onblur = undefined
	}: SliderProps = $props();

	let resolvedName = $derived((name || label || autoName).replace(/[^a-zA-Z0-9_\-:.]/g, '_'));

	let id = $derived.by(() => {
		if (inputId) return inputId;
		if (label) return `slider-${label.toLowerCase().replace(/ /g, '-')}`;
		return Math.random().toString(36).substring(2, 8);
	});

	const extraClasses: string[] = $derived.by(() => {
		const result = [];
		if (disabled) result.push('disabled');
		if (showError) result.push('show-error');
		return result;
	});

	// Calculate fill percentage for the track
	const fillPercent = $derived(((value - min) / (max - min)) * 100);
</script>

<div class="slider-container {containerClass}">
	{#if label}
		<div class="label-row">
			<label class="label" for={id}>
				{label}
				{#if required}
					<span class="text-required">*</span>
				{/if}
				{#if tooltipText}
					<Tooltip location={tooltipLocation} text={tooltipText}>
						<Icon svg={iconInfoCircle} size="1em" stroke="var(--accent-color)" />
					</Tooltip>
				{/if}
			</label>
			{#if !hideValue}
				<span class="label-value">{formatValue(value)}</span>
			{/if}
		</div>
	{/if}
	<div class="slider-wrapper">
		<input
			type="range"
			class="slider {classes} {extraClasses.join(' ')}"
			{id}
			name={resolvedName}
			{min}
			{max}
			{step}
			{disabled}
			bind:value
			style="--fill-percent: {fillPercent}%"
			onchange={() => onchange?.(value)}
			oninput={() => oninput?.(value)}
			{onfocus}
			{onblur}
		/>
	</div>
	{#if showError && errorText}
		<div class="error-text">{errorText}</div>
	{/if}
</div>

<style>
	.slider-container {
		width: 100%;
	}

	.label-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.25rem;
	}

	.label {
		font-size: 1rem;
		line-height: 1.5rem;
		color: var(--text-color);
	}

	.text-required {
		color: var(--danger-text);
	}

	.label-value {
		font-size: 0.875rem;
		color: var(--text-muted);
		font-variant-numeric: tabular-nums;
	}

	.slider-wrapper {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 4px 0 4px 0;
	}

	.slider {
		-webkit-appearance: none;
		appearance: none;
		width: 100%;
		height: 6px;
		border-radius: 3px;
		background: linear-gradient(
			to right,
			var(--accent-color) 0%,
			var(--accent-color) var(--fill-percent),
			var(--border-color) var(--fill-percent),
			var(--border-color) 100%
		);
		outline: none;
		cursor: pointer;
	}

	.slider::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: var(--accent-color);
		cursor: pointer;
		border: 2px solid var(--bg-color);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
		transition:
			transform 0.15s ease,
			box-shadow 0.15s ease;
	}

	.slider::-moz-range-thumb {
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: var(--accent-color);
		cursor: pointer;
		border: 2px solid var(--bg-color);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
		transition:
			transform 0.15s ease,
			box-shadow 0.15s ease;
	}

	.slider::-webkit-slider-thumb:hover {
		transform: scale(1.1);
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
	}

	.slider::-moz-range-thumb:hover {
		transform: scale(1.1);
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
	}

	.slider:focus {
		outline: none;
	}

	.slider:focus::-webkit-slider-thumb {
		box-shadow: 0 0 0 3px rgba(var(--accent-color-rgb, 59, 130, 246), 0.3);
	}

	.slider:focus::-moz-range-thumb {
		box-shadow: 0 0 0 3px rgba(var(--accent-color-rgb, 59, 130, 246), 0.3);
	}

	.slider.disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.slider.disabled::-webkit-slider-thumb {
		cursor: not-allowed;
	}

	.slider.disabled::-moz-range-thumb {
		cursor: not-allowed;
	}

	.slider.show-error {
		background: linear-gradient(
			to right,
			var(--danger-text) 0%,
			var(--danger-text) var(--fill-percent),
			var(--border-color) var(--fill-percent),
			var(--border-color) 100%
		);
	}

	.slider.show-error::-webkit-slider-thumb {
		background: var(--danger-text);
	}

	.slider.show-error::-moz-range-thumb {
		background: var(--danger-text);
	}

	.error-text {
		color: var(--danger-text);
		font-size: 0.875rem;
		margin-top: 0.25rem;
	}
</style>
