<script lang="ts">
	import FormGroup from './FormGroup.svelte';
	
	interface Props {
		label?: string;
		inputId?: string;
		placeholder?: string;
		required?: boolean;
		autofocus?: boolean;
		noAutocomplete?: boolean;
		groupClass?: string;
		textboxElement?: HTMLElement;
		class?: string;
		containerClass?: string;
		disabled?: boolean;
		value?: string;
		tooltipLocation?: 'top' | 'bottom' | 'left' | 'right';
		tooltipText?: string;
		onblur?: (e: FocusEvent) => void;
		onfocus?: (e: FocusEvent) => void;
		onchange?: (e: FocusEvent) => void;
		oninput?: (e: FocusEvent) => void;
		onkeydown?: (e: FocusEvent) => void;
		onkeypress?: (e: FocusEvent) => void;
		onkeyup?: (e: FocusEvent) => void;
	}

	let {
		label = '',
		inputId = undefined,
		placeholder = undefined,
		required = false,
		autofocus = false,
		noAutocomplete = false,
		class: classes = '',
		containerClass = '',
		groupClass = '',
		textboxElement: textboxElement = undefined,
		disabled = false,
		value = $bindable(''),
		tooltipLocation = 'top',
		tooltipText = undefined,
		onblur = undefined,
		onfocus = undefined,
		onchange = undefined,
		oninput = undefined,
		onkeydown = undefined,
		onkeypress = undefined,
		onkeyup = undefined,
	}: Props = $props();

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
			{placeholder}
			{disabled}
			{autofocus}
			{required}
			autocomplete={!noAutocomplete ? 'on' : 'off'}
			bind:value
			bind:this={textboxElement}
			{onblur}
			{onfocus}
			onchange={() => onchange?.(new FocusEvent('change'))}
			oninput={() => oninput?.(new FocusEvent('input'))}
			onkeydown={() => onkeydown?.(new FocusEvent('keydown'))}
			onkeypress={() => onkeypress?.(new FocusEvent('keypress'))}
			onkeyup={() => onkeyup?.(new FocusEvent('keyup'))}
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
