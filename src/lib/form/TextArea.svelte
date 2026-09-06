<script lang="ts">
	import FormGroup from '$lib/form/FormGroup.svelte';

	const autoName = `textarea-${crypto.randomUUID()}`;

	export interface TextAreaProps {
		/** HTML name attribute for the textarea (falls back to label, then auto-generated) */
		name?: string;
		/** Label text displayed above the textarea */
		label?: string;
		/** Custom ID for the textarea element */
		inputId?: string;
		/** Placeholder text when textarea is empty */
		placeholder?: string;
		/** Mark field as required (shows asterisk) */
		required?: boolean;
		/** Auto-focus the textarea on mount */
		autofocus?: boolean;
		/** HTML autocomplete attribute for the input */
		autocomplete?: string;
		/** CSS classes for the FormGroup wrapper */
		groupClass?: string;
		/** Reference to the textarea DOM element */
		textboxElement?: HTMLElement;
		/** CSS classes for the textarea element */
		class?: string;
		/** CSS classes for the container element */
		containerClass?: string;
		/** Disable the textarea */
		disabled?: boolean;
		/** Textarea value (bindable) */
		value?: string;
		/** Height of the textarea (e.g., '200px', '10rem') */
		height?: string;
		/** Position of the tooltip */
		tooltipLocation?: 'top' | 'bottom' | 'left' | 'right';
		/** Tooltip text on hover */
		tooltipText?: string;
		/** Callback when textarea loses focus */
		onblur?: (value: string, e: FocusEvent) => void;
		/** Callback when textarea gains focus */
		onfocus?: (value: string, e: FocusEvent) => void;
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
	}

	let {
		name,
		label = '',
		inputId = undefined,
		placeholder = undefined,
		required = false,
		autofocus = false,
		autocomplete = undefined,
		class: classes = '',
		containerClass = '',
		groupClass = '',
		textboxElement: textboxElement = undefined,
		disabled = false,
		value = $bindable(''),
		height = undefined,
		tooltipLocation = 'top',
		tooltipText = undefined,
		onblur = undefined,
		onfocus = undefined,
		onchange = undefined,
		oninput = undefined,
		onkeydown = undefined,
		onkeypress = undefined,
		onkeyup = undefined
	}: TextAreaProps = $props();

	let resolvedName = $derived((name || label || autoName).replace(/[^a-zA-Z0-9_\-:.]/g, '_'));

	let showRequiredRing = $state(false);
	const id = $derived(inputId ?? `input-${label.replaceAll(' ', '')}`);
</script>

<div class="textarea-container {containerClass}">
	<FormGroup {label} {required} {id} class={groupClass} {tooltipLocation} {tooltipText}>
		<!-- svelte-ignore a11y_autofocus -->
		<textarea
			class="
            {showRequiredRing && '!border-required'}
            {classes}"
			{id}
			name={resolvedName}
			{placeholder}
			{disabled}
			{autofocus}
			{required}
			autocomplete={autocomplete as any}
			style={height ? `height: ${height}` : undefined}
			bind:value
			bind:this={textboxElement}
			onblur={(e) => onblur?.(value, e)}
			onfocus={(e) => onfocus?.(value, e)}
			{onchange}
			{oninput}
			{onkeydown}
			{onkeypress}
			{onkeyup}></textarea>
	</FormGroup>
</div>

<style>
	textarea {
		display: block;
		width: 100%;
		min-height: calc(2.25rem + 2px);
		padding: 0.5rem;
		font-size: 1rem;
		font-weight: 400;
		line-height: 1.5;
		color: var(--text-base);
		background-color: var(--input-bg-color);
		background-image: none;
		border: 1px solid var(--border-color);
		border-radius: 0.375rem;
		appearance: none;
		transition:
			border-color 0.15s ease-in-out,
			box-shadow 0.15s ease-in-out;
		resize: vertical;

		&::placeholder {
			color: #6c757d;
			opacity: 1;
		}

		&:focus {
			border-color: var(--ui-primary);
			outline: 0;
			box-shadow: none;
		}

		&:disabled {
			background-color: var(--border-color);
			opacity: 0.5;
			cursor: not-allowed;
		}
	}

	:global(.dark) textarea {
		background-color: var(--input-bg-color);
		color: var(--text-base);
		border-color: var(--border-color);

		&::placeholder {
			color: #9ca3af;
		}

		&:focus {
			border-color: var(--ui-accent);
		}

		&:disabled {
			background-color: var(--border-color);
			opacity: 0.5;
		}
	}

	/* Fix for resize handle in dark mode */
	:global(.dark) textarea::-webkit-resizer {
		background-color: #2f353b;
		border-color: var(--border-color);
	}

	.loader {
		position: absolute;
		right: 8px;
		top: 8px;
	}
</style>
