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
		preventPasswordSave?: boolean;
		loading?: boolean;
		groupClass?: string;
		textboxElement?: HTMLElement;
		leftIconSvg?: string;
		class?: string;
		containerClass?: string;
		disabled?: boolean;
		value?: string;
		isFocused?: boolean;
		showError?: boolean;
		errorText?: string;
		tooltipLocation?: 'top' | 'bottom' | 'left' | 'right';
		tooltipText?: string;
		onenter?: (v: string) => void;
		onchange?: (e: Event) => void;
		oninput?: (e: Event) => void;
		onkeydown?: (e: KeyboardEvent) => void;
		onkeypress?: (e: KeyboardEvent) => void;
		onkeyup?: (e: KeyboardEvent) => void;
		onfocus?: (e: FocusEvent) => void;
		onblur?: (e: FocusEvent) => void;
		right?: Snippet;
		children?: Snippet;
		type?: 'text' | 'password';
	}

	let {
		label = '',
		inputId = undefined,
		placeholder = undefined,
		required = false,
		autofocus = false,
		noAutocomplete = false,
		preventPasswordSave = false,
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
		// convert label to lowercase, replace spaces with hyphens
		if (label) return `input-${label.toLowerCase().replace(/ /g, '-')}`;
		return autoId;
	});

	const extraClasses: string[] = $derived.by(() => {
		const classes = [];
		if (right) classes.push('rounded-r-none');
		if (leftIconSvg) classes.push('with-left-icon');
		if (disabled) classes.push('disabled');
		if (showError) classes.push('show-error');

		return classes;
	});

	const autocompleteValue = $derived.by(() => {
		if (noAutocomplete) return 'off';
		if (type === 'password' && preventPasswordSave) return 'one-time-code';
		return 'on';
	});
</script>

<div class="textbox-container {containerClass}">
	<FormGroup {label} {required} {id} class={groupClass} {tooltipLocation} {tooltipText}>
		<div class="textbox-input">
			<!-- svelte-ignore a11y_autofocus -->
			<input
				class="textbox {classes} {extraClasses.join(' ')}"
				{type}
				{id}
				{placeholder}
				{disabled}
				{autofocus}
				{required}
				autocomplete={autocompleteValue}
				bind:value
				bind:this={textboxElement}
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
		font-size: var(--pui-font-size-md);
		line-height: var(--pui-line-height-normal);
		padding: var(--pui-spacing-1) var(--pui-spacing-2);
		border: 1px solid var(--pui-input-border);
		background-color: var(--pui-input-bg);
		color: var(--pui-input-text);
		border-radius: var(--pui-radius-base);
		box-sizing: border-box;
	}

	.textbox.disabled {
		opacity: 0.5;
		cursor: not-allowed;
		background: var(--pui-input-bg-disabled);
	}

	.textbox:focus {
		border-color: var(--pui-input-border-focus);
		outline: 2px solid transparent;
		outline-offset: var(--pui-focus-ring-offset);

		& ~ .left-icon {
			color: var(--pui-input-border-focus);
		}
	}

	.rounded-r-none {
		border-top-right-radius: 0;
		border-bottom-right-radius: 0;
	}

	.with-left-icon {
		padding-left: var(--pui-spacing-8);
	}

	.left-icon {
		position: absolute;
		pointer-events: none;
		top: 50%;
		transform: translateY(-40%);
		left: var(--pui-spacing-2);
		color: var(--pui-text-muted);
	}

	.show-error {
		border-color: var(--pui-text-danger);
	}

	.text-error {
		color: var(--pui-text-danger);
	}
</style>
