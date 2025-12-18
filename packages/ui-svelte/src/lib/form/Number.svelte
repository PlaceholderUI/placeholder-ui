<script lang="ts">
	import { type Snippet } from 'svelte';
	import FormGroup from './FormGroup.svelte';
	import Loader from '../ui/Loader.svelte';
	import Icon from '../icon/Icon.svelte';

	interface Props {
		label?: string;
		inputId?: string;
		placeholder?: string;
		required?: boolean;
		autofocus?: boolean;
		noAutocomplete?: boolean;
		loading?: boolean;
		groupClass?: string;
		numberElement?: HTMLElement;
		leftIconSvg?: string;
		class?: string;
		containerClass?: string;
		disabled?: boolean;
		value?: number;
		isFocused?: boolean;
		showError?: boolean;
		errorText?: string;
		tooltipLocation?: 'top' | 'bottom' | 'left' | 'right';
		min?: number;
		max?: number;
		step?: number;
		onenter?: (v: number) => void;
		onchange?: (e: Event) => void;
		oninput?: (e: Event) => void;
		onkeydown?: (e: KeyboardEvent) => void;
		onkeypress?: (e: KeyboardEvent) => void;
		onkeyup?: (e: KeyboardEvent) => void;
		onfocus?: (e: FocusEvent) => void;
		onblur?: (e: FocusEvent) => void;
		right?: Snippet;
		children?: Snippet;
	}

	let {
		label = '',
		inputId = undefined,
		placeholder = undefined,
		required = false,
		autofocus = false,
		noAutocomplete = false,
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
	}: Props = $props();

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
				{placeholder}
				{disabled}
				{autofocus}
				{required}
				{min}
				{max}
				{step}
				autocomplete={!noAutocomplete ? 'on' : 'off'}
				bind:value
				bind:this={numberElement}
				onblur={() => {
					isFocused = false;
					onblur?.(new FocusEvent('blur'));
				}}
				onfocus={() => {
					isFocused = true;
					onfocus?.(new FocusEvent('focus'));
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