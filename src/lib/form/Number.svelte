<script lang="ts">
	import { type Snippet } from 'svelte';
	import FormGroup from '$lib/form/FormGroup.svelte';
	import Loader from '$lib/ui/Loader.svelte';
	import Icon from '$lib/icon/Icon.svelte';

	const autoName = `number-${crypto.randomUUID()}`;

	export interface NumberProps {
		/** HTML name attribute for the input (falls back to label, then auto-generated) */
		name?: string;
		/** Label text displayed above the input */
		label?: string;
		/** Custom ID for the input element */
		inputId?: string;
		/** Placeholder text when input is empty */
		placeholder?: string;
		/** Mark field as required (shows asterisk) */
		required?: boolean;
		/** Auto-focus the input on mount */
		autofocus?: boolean;
		/** HTML autocomplete attribute for the input */
		autocomplete?: string;
		/** Show loading spinner inside the input */
		loading?: boolean;
		/** CSS classes for the FormGroup wrapper */
		groupClass?: string;
		/** Reference to the input DOM element */
		numberElement?: HTMLElement;
		/** SVG icon displayed on the left side */
		leftIconSvg?: string;
		/** CSS classes for the input element */
		class?: string;
		/** CSS classes for the container element */
		containerClass?: string;
		/** Disable the input */
		disabled?: boolean;
		/** Input value (bindable) */
		value?: number;
		/** Whether the input is currently focused */
		isFocused?: boolean;
		/** Show error state styling */
		showError?: boolean;
		/** Error message to display */
		errorText?: string;
		/** Position of the tooltip */
		tooltipLocation?: 'top' | 'bottom' | 'left' | 'right';
		/** Minimum allowed value */
		min?: number;
		/** Maximum allowed value */
		max?: number;
		/** Increment/decrement step value */
		step?: number;
		/** Callback when Enter key is pressed */
		onenter?: (value: number) => void;
		/** Callback when value changes */
		onchange?: (e: Event) => void;
		/** Callback on input event */
		oninput?: (e: Event) => void;
		/** Callback on keydown event */
		onkeydown?: (e: KeyboardEvent) => void;
		/** Callback on keypress event */
		onkeypress?: (e: KeyboardEvent) => void;
		/** Callback on keyup event */
		onkeyup?: (e: KeyboardEvent) => void;
		/** Callback when input gains focus */
		onfocus?: (value: number | undefined, e: FocusEvent) => void;
		/** Callback when input loses focus */
		onblur?: (value: number | undefined, e: FocusEvent) => void;
		/** Content to render on the right side of the input */
		right?: Snippet;
		/** Additional content below the input */
		children?: Snippet;
	}

	let {
		name,
		label = '',
		inputId = undefined,
		placeholder = undefined,
		required = false,
		autofocus = false,
		autocomplete = undefined,
		loading = false,
		class: classes = '',
		containerClass = '',
		groupClass = '',
		numberElement: numberElement = $bindable(undefined),
		leftIconSvg = undefined,
		disabled = false,
		value = $bindable(undefined),
		isFocused = false,
		showError = false,
		errorText = '',
		tooltipLocation = 'top',
		min = undefined,
		max = undefined,
		step = undefined,
		onenter = undefined,
		onchange = undefined,
		oninput = undefined,
		onkeydown = undefined,
		onkeypress = undefined,
		onkeyup = undefined,
		onfocus = undefined,
		onblur = undefined,
		right,
		children
	}: NumberProps = $props();

	let resolvedName = $derived(
		(name || label || autoName).replace(/[^a-zA-Z0-9_\-:.]/g, '_')
	);

	let id = $derived.by(() => {
		if (inputId) return inputId;
		// convert label to lowercase, replace spaces with hyphens
		if (label) return `input-${label.toLowerCase().replace(/ /g, '-')}`;
		// generate 6 character random string
		return Math.random().toString(36).substring(2, 8);
	});

	const extraClasses: string[] = $derived.by(() => {
		const classes = [];
		if (right) classes.push('rounded-r-none');
		if (leftIconSvg) classes.push('with-left-icon');
		if (disabled) classes.push('disabled');
		if (showError) classes.push('show-error');

		return classes;
	});

	function handleChange(e: Event) {
		const input = e.target as HTMLInputElement;
		let numValue = parseFloat(input.value);

		// Validate and correct the value
		if (isNaN(numValue)) {
			value = undefined;
		} else {
			// Clamp to min/max if provided
			if (min !== undefined && numValue < min) {
				numValue = min;
			}
			if (max !== undefined && numValue > max) {
				numValue = max;
			}
			value = numValue;
		}

		// Call user's onchange callback
		onchange?.(e);
	}
</script>

<div class="number-container {containerClass}">
	<FormGroup {label} {required} {id} class={groupClass} {tooltipLocation}>
		<div class="number-input">
			<!-- svelte-ignore a11y_autofocus -->
			<input
				class="number {classes} {extraClasses.join(' ')}"
				type="number"
				{id}
				name={resolvedName}
				{placeholder}
				{disabled}
				{autofocus}
				{required}
				{min}
				{max}
				{step}
				autocomplete={autocomplete as any}
				bind:value
				bind:this={numberElement}
				onblur={(e) => {
					isFocused = false;
					onblur?.(value, e);
				}}
				onfocus={(e) => {
					isFocused = true;
					onfocus?.(value, e);
				}}
				onchange={handleChange}
				{oninput}
				onkeydown={(e) => {
					if (e.key === 'Enter' && value !== undefined) {
						onenter?.(value);
					}
					onkeydown?.(e);
				}}
				{onkeypress}
				{onkeyup}
			/>
			{#if leftIconSvg && !loading}
				<div class="left-icon">
					<Icon svg={leftIconSvg} size="1.125em" />
				</div>
			{/if}
			{#if loading}
				<div
					class="absolute
				top-1/2 -translate-y-1/2
				-translate-x-1/2
				{leftIconSvg ? 'left-4' : 'right-0'}"
				>
					<Loader sizeOverride="1.1rem" />
				</div>
			{:else}
				<div class="contents">
					{@render right?.()}
				</div>
			{/if}
		</div>
		{#if showError && errorText}
			<div class="text-error text-sm">{errorText}</div>
		{/if}
		{@render children?.()}
	</FormGroup>
</div>

<style>
	.number-input {
		position: relative;
		display: flex;
	}

	.number {
		width: 100%;
		font-size: 1rem;
		line-height: 1.5rem;
		padding: 0.25rem;
		border: 1px solid var(--border-color);
		background-color: var(--input-bg-color);
		color: var(--text-color);
		border-radius: 0.25rem;
		padding: 0.25rem 0.5rem;
		box-sizing: border-box;
	}

	.number.disabled {
		opacity: 0.5;
		cursor: not-allowed;
		background: var(--border-color);
	}

	.number:focus {
		border-color: var(--accent-color);
		outline: 2px solid transparent;
		outline-offset: 2px;

		& ~ .left-icon {
			color: var(--accent-color);
		}
	}

	.rounded-r-none {
		border-top-right-radius: 0;
		border-bottom-right-radius: 0;
	}

	.with-left-icon {
		padding-left: 2rem;
	}

	.left-icon {
		position: absolute;
		pointer-events: none;
		top: 50%;
		transform: translateY(-40%);
		left: 0.5rem;
		color: rgb(115 115 115);
	}

	.show-error {
		border-color: var(--danger-text);
	}

	.text-error {
		color: var(--danger-text);
	}
</style>
