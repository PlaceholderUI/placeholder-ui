<script lang="ts">
	import FormGroup from './FormGroup.svelte';
	import Icon from '../icon/Icon.svelte';
	import { iconUpload, iconX } from '../icon/index.js';
	import Button from '../ui/Button.svelte';

	interface Props {
		label?: string;
		value?: File | File[] | null;
		accept?: string;
		multiple?: boolean;
		disabled?: boolean;
		placeholder?: string;
		clearable?: boolean;
		required?: boolean;
		showError?: boolean;
		errorText?: string;
		size?: 'xs' | 'sm' | 'md' | 'lg';
		variant?: 'default' | 'filled';
		leftIcon?: string;
		class?: string;
		containerClass?: string;
		tooltipLocation?: 'top' | 'bottom' | 'left' | 'right';
		tooltipText?: string;
		onchange?: (files: File | File[] | null) => void;
	}

	let {
		label = '',
		value = $bindable(null),
		accept = '',
		multiple = false,
		disabled = false,
		placeholder = 'Choose file',
		clearable = true,
		required = false,
		showError = false,
		errorText = '',
		size = 'md',
		variant = 'default',
		leftIcon = undefined,
		class: classes = '',
		containerClass = '',
		tooltipLocation = 'top',
		tooltipText = undefined,
		onchange
	}: Props = $props();

	let inputElement: HTMLInputElement;

	const displayValue = $derived.by(() => {
		if (!value) return '';
		if (Array.isArray(value)) {
			if (value.length === 0) return '';
			if (value.length === 1) return value[0].name;
			return `${value.length} files selected`;
		}
		return value.name;
	});

	function handleClick() {
		if (disabled) return;
		inputElement?.click();
	}

	function handleChange(e: Event) {
		const target = e.target as HTMLInputElement;
		const files = target.files;
		if (!files || files.length === 0) {
			value = null;
		} else if (multiple) {
			value = Array.from(files);
		} else {
			value = files[0];
		}
		onchange?.(value);
	}

	function handleClear(e: Event) {
		e.stopPropagation();
		value = null;
		if (inputElement) {
			inputElement.value = '';
		}
		onchange?.(null);
	}
</script>

<div class="file-input-container {containerClass}">
	<FormGroup
		{label}
		{required}
		class={classes}
		{tooltipLocation}
		{tooltipText}
		{showError}
		{errorText}
	>
		<div class="file-input-wrapper size-{size} variant-{variant}" class:disabled>
			<input
				bind:this={inputElement}
				type="file"
				{accept}
				{multiple}
				{disabled}
				class="file-input-hidden"
				onchange={handleChange}
			/>
			<button type="button" class="file-input-button" onclick={handleClick} {disabled}>
				<span class="file-input-icon">
					<Icon svg={leftIcon || iconUpload} size="1.125em" />
				</span>
				<span class="file-input-text" class:placeholder={!displayValue}>
					{displayValue || placeholder}
				</span>
			</button>
			{#if clearable && value}
				<button type="button" class="file-input-clear" onclick={handleClear} aria-label="Clear file">
					<Icon svg={iconX} size="14px" />
				</button>
			{/if}
		</div>
	</FormGroup>
</div>

<style>
	.file-input-container {
		width: 100%;
	}

	.file-input-hidden {
		display: none;
	}

	.file-input-wrapper {
		display: flex;
		align-items: center;
		width: 100%;
		border: 1px solid var(--pui-input-border);
		background-color: var(--pui-input-bg);
		border-radius: var(--pui-radius-base);
		transition:
			border-color var(--pui-transition-fast) var(--pui-ease-in-out),
			box-shadow var(--pui-transition-fast) var(--pui-ease-in-out);
	}

	.file-input-wrapper:focus-within {
		border-color: var(--pui-input-border-focus);
	}

	.file-input-wrapper.disabled {
		opacity: 0.5;
		cursor: not-allowed;
		background: var(--pui-input-bg-disabled);
	}

	.variant-filled {
		background-color: var(--pui-color-gray-100);
		border-color: transparent;
	}

	:global(.dark) .variant-filled {
		background-color: var(--pui-color-dark-200);
	}

	/* Sizes */
	.size-xs .file-input-button {
		padding: var(--pui-spacing-1) var(--pui-spacing-2);
		font-size: var(--pui-font-size-xs);
	}
	.size-sm .file-input-button {
		padding: var(--pui-spacing-1) var(--pui-spacing-2);
		font-size: var(--pui-font-size-sm);
	}
	.size-md .file-input-button {
		padding: var(--pui-spacing-2) var(--pui-spacing-3);
		font-size: var(--pui-font-size-base);
	}
	.size-lg .file-input-button {
		padding: var(--pui-spacing-3) var(--pui-spacing-4);
		font-size: var(--pui-font-size-md);
	}

	.file-input-button {
		display: flex;
		align-items: center;
		gap: var(--pui-spacing-2);
		flex: 1;
		background: none;
		border: none;
		cursor: pointer;
		text-align: left;
		color: var(--pui-input-text);
		min-width: 0;
	}

	.file-input-button:disabled {
		cursor: not-allowed;
	}

	.file-input-icon {
		display: flex;
		align-items: center;
		color: var(--pui-text-muted);
		flex-shrink: 0;
	}

	.file-input-text {
		flex: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.file-input-text.placeholder {
		color: var(--pui-text-muted);
	}

	.file-input-clear {
		display: flex;
		align-items: center;
		justify-content: center;
		background: none;
		border: none;
		cursor: pointer;
		padding: var(--pui-spacing-2);
		color: var(--pui-text-muted);
		border-radius: var(--pui-radius-sm);
		transition: color var(--pui-transition-fast) var(--pui-ease-in-out);
	}

	.file-input-clear:hover {
		color: var(--pui-color-danger);
	}
</style>
