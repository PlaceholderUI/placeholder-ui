<script lang="ts">
	import { clickOutside } from '$lib/util/ClickOutside.js';
	import { floating } from '$lib/util/Floating.js';
	import type {
		ComboBoxGroup,
		ComboBoxItem,
		FetchFunctionType,
		RetrieveLabelFunctionType,
		SearchFunctionType
	} from '$lib/models/ComboBoxItem.js';
	import { ComboBoxCore } from './comboBoxCore.svelte.js';
	import ComboBoxMulti from './ComboBoxMulti.svelte';
	import FormGroup from '$lib/form/FormGroup.svelte';
	import Icon from '$lib/icon/Icon.svelte';
	import Loader from '$lib/ui/Loader.svelte';
	import { useDialogEvents } from '$lib/ui/DialogEvents.svelte.js';
	import selectorSvg from '$lib/icon/selector.svg?raw';
	import { iconX, iconCopy } from '$lib/icon/index.js';
	import ActionIcon from '$lib/ui/ActionIcon.svelte';
	import { onMount, tick, type Snippet } from 'svelte';

	const autoName = `select-${crypto.randomUUID()}`;

	export interface SelectProps {
		/** HTML name attribute for the select (falls back to label, then auto-generated) */
		name?: string;
		/** Label text displayed above the select */
		label?: string;
		/** Selected value (bindable) */
		value?: string;
		/** Full selected item object */
		rawValue?: ComboBoxItem;
		/** Placeholder text when no value is selected */
		placeholder?: string;
		/** CSS classes for the select element */
		class?: string;
		/** CSS classes for the container element */
		containerClass?: string;
		/** Disable the select */
		disabled?: boolean;
		/** Mark field as required (shows asterisk) */
		required?: boolean;
		/** Show error state styling */
		showError?: boolean;
		/** Error message to display */
		errorText?: string;
		/** Auto-focus on mount (first dialog open only) */
		autofocus?: boolean;
		/** Auto-focus on every dialog open */
		autofocusDialog?: boolean;
		/** Enable search/filter within options */
		allowSearch?: boolean;
		/** Hide "no results" message when search finds nothing */
		hideNoResults?: boolean;
		/** Text shown while loading options */
		loadingText?: string;
		/** Flat list of selectable options */
		options?: ComboBoxItem[];
		/** Options organized into groups */
		groupedOptions?: ComboBoxGroup[];
		/** Position of the tooltip */
		tooltipLocation?: 'top' | 'bottom' | 'left' | 'right';
		/** Async function to fetch options */
		fetchFunction?: FetchFunctionType | null;
		/** Async function to search/filter options */
		searchFunction?: SearchFunctionType | null;
		/** Async function to retrieve label for a value */
		retrieveLabelFunction?: RetrieveLabelFunctionType | null;
		/** Rich tooltip content using a Svelte snippet */
		tooltipContent?: Snippet;
		/** Simple tooltip text */
		tooltipText?: string;
		/** Callback when selection changes (returns value string) */
		onchange?: (e: string | undefined) => void;
		/** Callback when selection changes (returns full item object) */
		onchangeRaw?: (e: ComboBoxItem | undefined) => void;
		/** HTML autocomplete attribute for the input */
		autocomplete?: string;
	}

	let {
		name,
		label = '',
		value = $bindable(undefined),
		rawValue = undefined,
		placeholder = '\u00a0', // non-breaking space to prevent the height collapsing
		class: classes = '',
		containerClass = '',
		disabled = false,
		required = false,
		showError = false,
		errorText = '',
		autofocus = false,
		autofocusDialog = false,
		allowSearch = false,
		hideNoResults = false,
		loadingText = '',
		options = [],
		groupedOptions = [],
		tooltipLocation = 'top',
		fetchFunction = null,
		searchFunction = null,
		retrieveLabelFunction = null,
		tooltipContent,
		tooltipText,
		onchange,
		onchangeRaw,
		autocomplete
	}: SelectProps = $props();

	// Use derived for computed allowSearch
	let computedAllowSearch = $derived(searchFunction ? true : allowSearch);
	let resolvedName = $derived((name || label || autoName).replace(/[^a-zA-Z0-9_\-:.]/g, '_'));

	let internalValue = $state(value);
	let filterString = $state('');

	const core = new ComboBoxCore({
		getOptions: () => options,
		getGroupedOptions: () => groupedOptions,
		getValue: () => value,
		setValue: (v) => (value = v),
		setRawValue: (r) => (rawValue = r),
		getFetchFunction: () => fetchFunction,
		getSearchFunction: () => searchFunction,
		getRetrieveLabelFunction: () => retrieveLabelFunction,
		clearUnknownStatic: true,
		onValueCleared: () => {
			internalValue = undefined;
			onchange?.(undefined);
			onchangeRaw?.(undefined);
		},
		onRawValueResolved: (raw) => onchangeRaw?.(raw),
		// Re-apply the active filter so a mid-search options swap doesn't drop results
		onOptionsChanged: () => {
			if (filterString) onFilterChange(filterString);
		}
	});

	let open = $state(false);

	let isEmpty: boolean = $derived(rawValue === undefined);

	onMount(() => {
		if (autofocus) {
			tick().then(() => {
				focus();
			});
		}
	});

	useDialogEvents({
		onFirstOpen: () => {
			if (autofocus) {
				// Focus the input when dialog opens
				setTimeout(() => {
					focus();
				}, 150);
			}
		},
		onOpen: () => {
			if (autofocusDialog) {
				// Focus the input every time dialog opens
				setTimeout(() => {
					focus();
				}, 150);
			}
		}
	});

	function focus() {
		open = true;
		tick().then(() => textboxElement?.focus());
	}

	$effect(() => {
		if (value !== internalValue) {
			internalValue = value;
			const selfCleared = core.preloadValues();
			// preloadValues fires its own callbacks on the clear path; don't double-notify
			if (!selfCleared) {
				onchangeRaw?.(rawValue);
			}
		}
	});

	function onSelection(selectedValue: ComboBoxItem) {
		core.allGroups.forEach((group) => {
			group.items.forEach((item) => {
				item.selected = item.value === selectedValue.value;
			});
		});

		value = selectedValue.value;
		internalValue = value;
		rawValue = selectedValue;

		onchange?.(value);
		onchangeRaw?.(rawValue);

		open = false;
	}

	function onFilterChange(filterValue: string) {
		if (searchFunction && filterValue) {
			core.search(filterValue, () => (open = true));
		} else {
			core.filterLocal(filterValue);
		}
	}

	let comboBoxEl: ReturnType<typeof ComboBoxMulti> | undefined = $state(undefined);
	let containerElement: HTMLElement | undefined = $state(undefined);
	let textboxElement: HTMLElement | undefined = $state(undefined);
	let buttonElement: HTMLElement | undefined = $state(undefined);
	let comboBoxKeyDown: ((e: KeyboardEvent) => void) | undefined = $state(undefined);

	function onKeyDown(e: KeyboardEvent) {
		if (!open) return;

		if (e.key === 'Escape') {
			e.preventDefault();
			open = false;
		} else if (comboBoxKeyDown) {
			comboBoxKeyDown(e);
		}

		comboBoxEl?.handleKeyDown?.(e);
	}

	function closePopover(e: MouseEvent) {
		if (textboxElement && textboxElement.contains(e.target as HTMLElement)) return;
		if (buttonElement && buttonElement.contains(e.target as HTMLElement)) return;

		open = false;
	}

	function copyCurrentValue() {
		if (rawValue?.label) {
			navigator.clipboard.writeText(rawValue.label).catch((err) => {
				console.error('Failed to copy text: ', err);
			});
		}
	}

	const extraClasses: string[] = $derived.by(() => {
		const classes = [];
		if (open) classes.push('!border-accent');
		if (disabled) classes.push('disabled');
		if (showError) classes.push('show-error');
		if (computedAllowSearch) classes.push('searchable');
		if (open && !isEmpty) classes.push('has-actions');

		return classes;
	});
</script>

<div class="select-container {containerClass}" bind:this={containerElement}>
	<FormGroup {label} {required} {tooltipContent} {tooltipText} {tooltipLocation}>
		{#if computedAllowSearch && open}
			<div class="select-input-wrapper">
				<input
					bind:this={textboxElement}
					bind:value={filterString}
					oninput={() => onFilterChange(filterString)}
					onkeydown={onKeyDown}
					name={resolvedName}
					autocomplete={(autocomplete as any) ?? 'off'}
					disabled={core.preloading || disabled}
					placeholder={isEmpty ? placeholder : rawValue?.label || ''}
					class="select select-input {extraClasses} {classes}"
					type="search"
				/>
				{#if core.preloading || core.searching}
					<div class="loader">
						<Loader sizeOverride="1.125rem" />
					</div>
				{:else if !isEmpty}
					<div class="btn-clear-container">
						<ActionIcon
							variant="secondary-subtle"
							svg={iconCopy}
							size="0.75rem"
							onclick={(e: MouseEvent) => {
								copyCurrentValue();
								e.stopPropagation();
							}}
						/>
						<ActionIcon
							variant="secondary-subtle"
							svg={iconX}
							size="0.75rem"
							onclick={(e: MouseEvent) => {
								internalValue = undefined;
								value = undefined;
								rawValue = undefined;
								filterString = '';
								core.filteredGroups = core.allGroups;

								onchange?.(undefined);
								onchangeRaw?.(undefined);

								core.allGroups.flatMap((x) => x.items).forEach((x) => (x.selected = false));

								e.stopPropagation();
							}}
						/>
					</div>
				{:else}
					<div class="select-icon">
						<Icon svg={selectorSvg} size="1rem" />
					</div>
				{/if}
			</div>
		{:else}
			<button
				bind:this={buttonElement}
				onclick={() => {
					open = !open;
					if (open && computedAllowSearch) {
						tick().then(() => textboxElement?.focus());
					}
				}}
				onkeydown={(e) => onKeyDown(e)}
				name={resolvedName}
				disabled={core.preloading || disabled}
				class="select {extraClasses} {classes}"
			>
				{#if isEmpty}
					<span class="placeholder">{core.preloading ? 'Loading...' : placeholder}</span>
				{:else if rawValue?.selectedComponent}
					{@const DisplayComponent = rawValue.selectedComponent}
					<DisplayComponent option={rawValue} {...rawValue.selectedComponentProps} />
				{:else}
					<span>
						{rawValue?.label}
					</span>
				{/if}
				{#if core.preloading || core.searching}
					<div class="loader">
						<Loader sizeOverride="1.125rem" />
					</div>
				{:else if open && !isEmpty}
					<div class="btn-clear-container">
						<ActionIcon
							variant="secondary-subtle"
							svg={iconCopy}
							size="0.75rem"
							onclick={(e: MouseEvent) => {
								copyCurrentValue();
								e.stopPropagation();
							}}
						/>
						<ActionIcon
							variant="secondary-subtle"
							svg={iconX}
							size="0.75rem"
							onclick={(e: MouseEvent) => {
								internalValue = undefined;
								value = undefined;
								rawValue = undefined;

								onchange?.(undefined);
								onchangeRaw?.(undefined);

								core.allGroups.flatMap((x) => x.items).forEach((x) => (x.selected = false));

								e.stopPropagation();
							}}
						/>
					</div>
				{:else}
					<div class="select-icon">
						<Icon svg={selectorSvg} size="1rem" />
					</div>
				{/if}
			</button>
		{/if}
	</FormGroup>
	{#if open}
		<!-- Rendered in the top layer so a scrolling Dialog body cannot clip it -->
		<div
			class="select-panel"
			use:floating={{ anchor: () => containerElement, placement: 'bottom-start', matchWidth: true }}
		>
			<div class="select-panel-inner" use:clickOutside={closePopover}>
				<ComboBoxMulti
					bind:this={comboBoxEl}
					{filterString}
					values={rawValue ? [rawValue] : []}
					{onSelection}
					onkeydown={comboBoxKeyDown}
					groupedOptions={core.filteredGroups}
					{open}
					loading={core.searching}
					{hideNoResults}
					{loadingText}
				/>
			</div>
		</div>
	{/if}
	{#if showError && errorText}
		<div class="text-error text-xs">{errorText}</div>
	{/if}
</div>

<style>
	.select-container {
		position: relative;
	}

	.select {
		font-size: 1rem;
		line-height: 1.5rem;
		position: relative;
		display: flex;
		flex-wrap: wrap;
		padding: 0.25rem 0.5rem;
		border-radius: 0.25rem;
		text-align: left;
		background-color: var(--input-bg-color);
		color: var(--text-color);
		border-color: var(--border-color);
		cursor: pointer;
		width: 100%;
		align-items: center;
		border: 1px solid var(--border-color);
		padding-right: 2rem;
	}

	.select.has-actions {
		padding-right: 3.5rem;
	}

	.select.searchable {
		cursor: text;
	}

	.select:focus {
		border-color: var(--accent-color);
		outline: 2px solid transparent;
		outline-offset: 2px;
	}

	.select-input-wrapper {
		position: relative;
		width: 100%;
	}

	.select-input {
		cursor: text;
	}

	.select-icon {
		position: absolute;
		right: 0.5rem;
		top: 50%;
		transform: translateY(-50%);
		width: 1rem;
		display: flex;
		pointer-events: none;
	}

	.btn-clear-container {
		position: absolute;
		line-height: 0;
		right: 0.5rem;
		top: 50%;
		transform: translateY(-50%);
		display: flex;
		gap: 0.25rem;
	}

	.select-btn-clear {
		border-radius: 0.25rem;
		padding: 0.25rem;
		right: 0.4rem;
	}

	/* Position, width and top-layer promotion come from use:floating */
	.select-panel {
		z-index: 70;
		border-top-left-radius: 0;
		border-top-right-radius: 0;
	}

	.select-panel-inner {
		position: relative;
		width: 100%;
	}

	.placeholder {
		color: var(--placeholder-color);
		/* text-zinc-400 dark:text-neutral-500 */
	}

	.disabled {
		opacity: 0.5;
		cursor: not-allowed;
		background-color: var(--border-color);
	}

	.loader {
		position: absolute;
		right: 0.65rem;
		top: 50%;
		transform: translateY(-50%);
		width: 1rem;
	}

	.show-error {
		border-color: var(--danger-text);
	}

	.text-error {
		color: var(--danger-text);
	}
</style>
