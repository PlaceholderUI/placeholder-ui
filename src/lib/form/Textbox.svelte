<script lang="ts">
	import { type Snippet } from 'svelte';
	import FormGroup from '$lib/form/FormGroup.svelte';
	import Loader from '$lib/ui/Loader.svelte';
	import Icon from '$lib/icon/Icon.svelte';

	const autoName = `textbox-${crypto.randomUUID()}`;

	export interface TextboxProps {
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
		/** Reference to the input DOM element (bindable) */
		textboxElement?: HTMLElement;
		/** SVG icon displayed on the left side */
		leftIconSvg?: string;
		/** CSS classes for the input element */
		class?: string;
		/** CSS classes for the container element */
		containerClass?: string;
		/** Disable the input */
		disabled?: boolean;
		/** Input value (bindable) */
		value?: string;
		/** Whether the input is currently focused */
		isFocused?: boolean;
		/** Show error state styling */
		showError?: boolean;
		/** Error message to display */
		errorText?: string;
		/** Position of the tooltip */
		tooltipLocation?: 'top' | 'bottom' | 'left' | 'right';
		/** Rich tooltip content using a Svelte snippet */
		tooltipContent?: Snippet;
		/** Tooltip text on hover */
		tooltipText?: string;
		/** Callback when Enter key is pressed */
		onenter?: (value: string) => void;
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
		onfocus?: (value: string, e: FocusEvent) => void;
		/** Callback when input loses focus */
		onblur?: (value: string, e: FocusEvent) => void;
		/** Content to render on the right side of the input */
		right?: Snippet;
		/** Additional content below the input */
		children?: Snippet;
		/** Input type */
		type?: 'text' | 'password' | 'email' | 'number' | 'search' | 'tel' | 'url';
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
		textboxElement: textboxElement = $bindable(undefined),
		leftIconSvg = undefined,
		disabled = false,
		value = $bindable(''),
		isFocused = false,
		showError = false,
		errorText = '',
		tooltipLocation = 'top',
		tooltipContent = undefined,
		tooltipText = undefined,
		onenter = undefined,
		onchange = undefined,
		oninput = undefined,
		onkeydown = undefined,
		onkeypress = undefined,
		onkeyup = undefined,
		onfocus = undefined,
		onblur = undefined,
		right,
		children,
		type = 'text'
	}: TextboxProps = $props();

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
</script>

<div class="textbox-container {containerClass}">
	<FormGroup {label} {required} {id} class={groupClass} {tooltipLocation} {tooltipContent} {tooltipText}>
		<div class="textbox-input">
			<!-- svelte-ignore a11y_autofocus -->
			<input
				class="textbox {classes} {extraClasses.join(' ')}"
				{type}
				{id}
				name={resolvedName}
				{placeholder}
				{disabled}
				{autofocus}
				{required}
				autocomplete={autocomplete as any}
				bind:value
				bind:this={textboxElement}
				onblur={(e) => {
					isFocused = false;
					onblur?.(value, e);
				}}
				onfocus={(e) => {
					isFocused = true;
					onfocus?.(value, e);
				}}
				{onchange}
				{oninput}
				onkeydown={(e) => {
					if (e.key === 'Enter') {
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
	.textbox-input {
		position: relative;
		display: flex;
	}

	.textbox {
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

	.textbox.disabled {
		opacity: 0.5;
		cursor: not-allowed;
		background: var(--border-color);
	}

	.textbox:focus {
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
		/* absolute {isFocused ? 'text-accent' : 'text-neutral-500'}
				pointer-events-none
				top-1/2 -translate-y-1/2
				left-4 -translate-x-1/2 */

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
