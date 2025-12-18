<script lang="ts">
	import { type Snippet } from 'svelte';
	import FormGroup from './FormGroup.svelte';
	import Loader from '../ui/Loader.svelte';
	import Icon from '../icon/Icon.svelte';
	import { iconEye, iconEyeOff } from '../icon/index.js';

	interface Props {
		label?: string;
		inputId?: string;
		placeholder?: string;
		required?: boolean;
		autofocus?: boolean;
		noAutocomplete?: boolean;
		loading?: boolean;
		groupClass?: string;
		leftIconSvg?: string;
		class?: string;
		containerClass?: string;
		disabled?: boolean;
		value?: string;
		visible?: boolean;
		isFocused?: boolean;
		showError?: boolean;
		errorText?: string;
		tooltipLocation?: 'top' | 'bottom' | 'left' | 'right';
		tooltipText?: string;
		onenter?: (v: string) => void;
		onchange?: (e: Event) => void;
		oninput?: (e: Event) => void;
		onkeydown?: (e: KeyboardEvent) => void;
		onfocus?: (e: FocusEvent) => void;
		onblur?: (e: FocusEvent) => void;
		onVisibilityChange?: (visible: boolean) => void;
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
		leftIconSvg = undefined,
		disabled = false,
		value = $bindable(''),
		visible = $bindable(false),
		isFocused = false,
		showError = false,
		errorText = '',
		tooltipLocation = 'top',
		tooltipText = undefined,
		onenter = undefined,
		onchange = undefined,
		oninput = undefined,
		onkeydown = undefined,
		onfocus = undefined,
		onblur = undefined,
		onVisibilityChange = undefined,
		children
	}: Props = $props();

	// Generate ID on client-side only to avoid hydration mismatches
	let autoId = $state('');

	$effect(() => {
		if (!inputId && !label) {
			autoId = Math.random().toString(36).substring(2, 8);
		}
	});

	let id = $derived.by(() => {
		if (inputId) return inputId;
		if (label) return `input-${label.toLowerCase().replace(/ /g, '-')}`;
		return autoId;
	});

	const inputType = $derived(visible ? 'text' : 'password');

	const extraClasses: string[] = $derived.by(() => {
		const classes = [];
		if (leftIconSvg) classes.push('with-left-icon');
		if (disabled) classes.push('disabled');
		if (showError) classes.push('show-error');
		return classes;
	});

	function toggleVisibility() {
		visible = !visible;
		onVisibilityChange?.(visible);
	}
</script>

<div class="password-container {containerClass}">
	<FormGroup {label} {required} {id} class={groupClass} {tooltipLocation} {tooltipText}>
		<div class="password-input">
			<!-- svelte-ignore a11y_autofocus -->
			<input
				class="password {classes} {extraClasses.join(' ')}"
				type={inputType}
				{id}
				{placeholder}
				{disabled}
				{autofocus}
				{required}
				autocomplete={noAutocomplete ? 'off' : 'current-password'}
				bind:value
				onblur={() => {
					isFocused = false;
					onblur?.(new FocusEvent('blur'));
				}}
				onfocus={() => {
					isFocused = true;
					onfocus?.(new FocusEvent('focus'));
				}}
				{onchange}
				{oninput}
				onkeydown={(e) => {
					if (e.key === 'Enter') {
						onenter?.(value);
					}
					onkeydown?.(e);
				}}
			/>
			{#if leftIconSvg && !loading}
				<div class="left-icon">
					<Icon svg={leftIconSvg} size="1.125em" />
				</div>
			{/if}
			{#if loading}
				<div class="loader-container">
					<Loader sizeOverride="1.1rem" />
				</div>
			{:else}
				<button
					type="button"
					class="visibility-toggle"
					onclick={toggleVisibility}
					tabindex={-1}
					aria-label={visible ? 'Hide password' : 'Show password'}
					{disabled}
				>
					<Icon svg={visible ? iconEyeOff : iconEye} size="1.125em" />
				</button>
			{/if}
		</div>
		{#if showError && errorText}
			<div class="text-error">{errorText}</div>
		{/if}
		{@render children?.()}
	</FormGroup>
</div>

<style>
	.password-input {
		position: relative;
		display: flex;
	}

	.password {
		width: 100%;
		font-size: 1rem;
		line-height: 1.5rem;
		padding: 0.25rem 2.5rem 0.25rem 0.5rem;
		border: 1px solid var(--cui-input-border);
		background-color: var(--cui-input-bg);
		color: var(--cui-input-text);
		border-radius: 0.25rem;
		box-sizing: border-box;
	}

	.password.disabled {
		opacity: 0.5;
		cursor: not-allowed;
		background: var(--cui-input-bg-disabled);
	}

	.password:focus {
		border-color: var(--cui-input-border-focus);
		outline: 2px solid transparent;
		outline-offset: 2px;
	}

	.password:focus ~ .left-icon {
		color: var(--cui-input-border-focus);
	}

	.with-left-icon {
		padding-left: 2rem;
	}

	.left-icon {
		position: absolute;
		pointer-events: none;
		top: 50%;
		transform: translateY(-50%);
		left: 0.5rem;
		color: var(--cui-text-muted);
	}

	.visibility-toggle {
		position: absolute;
		right: 0.5rem;
		top: 50%;
		transform: translateY(-50%);
		background: none;
		border: none;
		cursor: pointer;
		padding: 0.25rem;
		color: var(--cui-text-muted);
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--cui-radius-sm);
		transition: color var(--cui-transition-fast) var(--cui-ease-in-out);
	}

	.visibility-toggle:hover:not(:disabled) {
		color: var(--cui-color-gray-700);
	}

	:global(.dark) .visibility-toggle:hover:not(:disabled) {
		color: var(--cui-color-gray-300);
	}

	.visibility-toggle:disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}

	.loader-container {
		position: absolute;
		right: 0.5rem;
		top: 50%;
		transform: translateY(-50%);
	}

	.show-error {
		border-color: var(--cui-text-danger);
	}

	.text-error {
		color: var(--cui-text-danger);
		font-size: var(--cui-font-size-sm);
		margin-top: var(--cui-spacing-1);
	}
</style>
