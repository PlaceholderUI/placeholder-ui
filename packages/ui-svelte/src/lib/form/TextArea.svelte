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
		transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
		resize: vertical;

		&::placeholder {
			color: #6c757d;
			opacity: 1;
		}

		&:focus {
			border-color: var(--midnight);
			outline: 0;
			box-shadow: none;
		}

		&:disabled {
			background-color: var(--main-border);
			opacity: 1;
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
			border-color: var(--pistachio);
		}

		&:disabled {
			background-color: var(--main-border);
			color: var(--text-base);
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
