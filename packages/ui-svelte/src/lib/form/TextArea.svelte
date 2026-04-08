<script lang="ts">
	import FormGroup from './FormGroup.svelte';

	const autoName = `textarea-${Math.random().toString(36).substring(2, 15)}`;

	interface Props {
		/** HTML name attribute for the textarea (falls back to label, then auto-generated) */
		name?: string;
		label?: string;
		inputId?: string;
		placeholder?: string;
		required?: boolean;
		autofocus?: boolean;
		/** HTML autocomplete attribute */
		autocomplete?: string;
		groupClass?: string;
		textboxElement?: HTMLElement;
		class?: string;
		containerClass?: string;
		disabled?: boolean;
		value?: string;
		/** Height of the textarea (e.g., '200px', '10rem') */
		height?: string;
		tooltipLocation?: 'top' | 'bottom' | 'left' | 'right';
		tooltipText?: string;
		onblur?: (value: string, e: FocusEvent) => void;
		onfocus?: (value: string, e: FocusEvent) => void;
		onchange?: (e: Event) => void;
		oninput?: (e: Event) => void;
		onkeydown?: (e: KeyboardEvent) => void;
		onkeypress?: (e: KeyboardEvent) => void;
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
	}: Props = $props();

	let resolvedName = $derived(
		(name || label || autoName).replace(/[^a-zA-Z0-9_\-:.]/g, '_')
	);

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
			autocomplete={autocomplete as AutoFill}
			style={height ? `height: ${height}` : undefined}
			bind:value
			bind:this={textboxElement}
			onblur={(e) => onblur?.(value, e)}
			onfocus={(e) => onfocus?.(value, e)}
			{onchange}
			{oninput}
			{onkeydown}
			{onkeypress}
			{onkeyup}
		></textarea>
	</FormGroup>
</div>

<style>
	textarea {
		display: block;
		width: 100%;
		min-height: calc(2.25rem + 2px);
		padding: var(--pui-spacing-2);
		font-size: var(--pui-font-size-md);
		font-weight: var(--pui-font-weight-normal);
		line-height: var(--pui-line-height-normal);
		color: var(--pui-input-text);
		background-color: var(--pui-input-bg);
		background-image: none;
		border: 1px solid var(--pui-input-border);
		border-radius: var(--pui-radius-md);
		appearance: none;
		transition: border-color var(--pui-transition-fast) var(--pui-ease-in-out);
		resize: vertical;

		&::placeholder {
			color: var(--pui-text-placeholder);
			opacity: 1;
		}

		&:focus {
			border-color: var(--pui-color-primary);
			outline: 0;
			box-shadow: none;
		}

		&:disabled {
			background-color: var(--pui-bg-disabled);
			opacity: 1;
			cursor: not-allowed;
		}
	}

	:global(.dark) textarea {
		background-color: var(--pui-input-bg);
		color: var(--pui-input-text);
		border-color: var(--pui-input-border);

		&::placeholder {
			color: var(--pui-text-placeholder);
		}

		&:focus {
			border-color: var(--pui-color-secondary);
		}

		&:disabled {
			background-color: var(--pui-bg-disabled);
			color: var(--pui-input-text);
		}
	}

	/* Fix for resize handle in dark mode */
	:global(.dark) textarea::-webkit-resizer {
		background-color: var(--pui-color-gray-700);
		border-color: var(--pui-border-default);
	}

	.loader {
		position: absolute;
		right: var(--pui-spacing-2);
		top: var(--pui-spacing-2);
	}
</style>
