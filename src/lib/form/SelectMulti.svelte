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
	import { ComboBoxMultiCore } from './comboBoxCore.svelte.js';
	import ComboBoxMulti from './ComboBoxMulti.svelte';
	import FormGroup from '$lib/form/FormGroup.svelte';
	import Icon from '$lib/icon/Icon.svelte';
	import Loader from '$lib/ui/Loader.svelte';
	import { useDialogEvents } from '$lib/ui/DialogEvents.svelte.js';
	import selectorSvg from '$lib/icon/selector.svg?raw';
	import Textbox from '$lib/form/Textbox.svelte';
	import Badge from '$lib/ui/Badge.svelte';
	import ActionIcon from '$lib/ui/ActionIcon.svelte';
	import { iconX } from '$lib/icon/index.js';
	import { onMount, tick, type Snippet } from 'svelte';

	const autoName = `selectmulti-${crypto.randomUUID()}`;

	export interface SelectMultiProps {
		/** HTML name attribute for the select (falls back to label, then auto-generated) */
		name?: string;
		/** Label text displayed above the select */
		label?: string;
		/** Array of selected values (bindable) */
		values?: string[];
		/**
		 * Array of full selected item objects (bindable). Can be passed initially to preset
		 * the selection with known labels — no `values` or retrieveLabelFunction needed.
		 */
		rawValues?: ComboBoxItem[];
		/** Placeholder text when no values are selected */
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
		/** Close dropdown after selecting an option */
		closeOnSelection?: boolean;
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
		/** Async function to retrieve labels for values */
		retrieveLabelFunction?: RetrieveLabelFunctionType | null;
		/** Rich tooltip content using a Svelte snippet */
		tooltipContent?: Snippet;
		/** Simple tooltip text */
		tooltipText?: string;
		/** Callback when selection changes (returns value strings) */
		onchange?: (e: string[]) => void;
		/** Callback when selection changes (returns full item objects) */
		onchangeRaw?: (e: ComboBoxItem[]) => void;
	}

	let {
		name,
		label = '',
		values = $bindable([]),
		rawValues = $bindable([]),
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
		closeOnSelection = false,
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
		onchangeRaw
	}: SelectMultiProps = $props();

	let resolvedName = $derived((name || label || autoName).replace(/[^a-zA-Z0-9_\-:.]/g, '_'));
	let computedAllowSearch = $derived(searchFunction ? true : allowSearch);

	let internalValues: string[] = $state([]);
	let filterString = $state('');

	if (values === null || values === undefined) values = [];
	if (rawValues === null || rawValues === undefined) rawValues = [];
	// Callers may preset the selection by passing only rawValues — adopt their values
	if (values.length === 0 && rawValues.length > 0) values = rawValues.map((r) => r.value);

	const core = new ComboBoxMultiCore({
		getOptions: () => options,
		getGroupedOptions: () => groupedOptions,
		getFetchFunction: () => fetchFunction,
		getSearchFunction: () => searchFunction,
		getRetrieveLabelFunction: () => retrieveLabelFunction,
		getValues: () => values,
		setValues: (v) => (values = v),
		setRawValues: (r) => (rawValues = r),
		initialRawValues: [...rawValues],
		clearUnknownStatic: true,
		onValuesCleared: () => {
			internalValues = [...values];
			onchange?.(values);
			onchangeRaw?.(rawValues);
		},
		onRawValuesResolved: (raw) => onchangeRaw?.(raw),
		// Re-apply the active filter so a mid-search options swap doesn't drop results
		onOptionsChanged: () => {
			if (filterString) onFilterChange(filterString);
		}
	});

	let open = $state(false);
	let hideCombobox = $state(false);

	let isEmpty: boolean = $derived(rawValues?.length === 0);

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
		const currentValues = values || [];
		const currentInternalValues = internalValues || [];

		const arraysAreDifferent =
			currentValues.length !== currentInternalValues.length ||
			currentValues.some((value, index) => value !== currentInternalValues[index]);

		if (arraysAreDifferent) {
			internalValues = [...currentValues];
			const selfChanged = core.preloadValues();
			// preloadValues fires its own callbacks when it drops invalid values; don't double-notify
			if (!selfChanged) {
				onchangeRaw?.(rawValues);
			}
		}
	});

	function onSelection(selectedValue: ComboBoxItem) {
		// Find the actual option in allOptions to ensure we're working with the correct reference
		const optionIndex = core.allGroups
			.flatMap((x) => x.items)
			.findIndex((opt) => opt.value === selectedValue.value);
		const actualOption =
			optionIndex !== -1 ? core.allGroups.flatMap((x) => x.items)[optionIndex] : selectedValue;

		actualOption.selected = !actualOption.selected;

		if (actualOption.selected && !values.includes(actualOption.value)) {
			values = [...values, actualOption.value];
			rawValues = [...rawValues, actualOption];
		} else if (!actualOption.selected) {
			values = values.filter((value) => value !== actualOption.value);
			rawValues = rawValues.filter((rawValue) => rawValue.value !== actualOption.value);
		}

		internalValues = [...values];

		onchange?.(values);
		onchangeRaw?.(rawValues);

		if (closeOnSelection) {
			open = false;
		}
		if (textboxElement) {
			(textboxElement as HTMLInputElement).select();
		}
	}

	function onFilterChange(value: string) {
		if (searchFunction && value) {
			core.search(value, () => {
				open = true;
				hideCombobox = false;
			});
		} else {
			core.filterLocal(value);
			hideCombobox = false;
		}
	}

	let comboBoxEl: ReturnType<typeof ComboBoxMulti> | undefined = $state(undefined);
	let containerElement: HTMLElement | undefined = $state(undefined);
	let textboxElement: HTMLElement | undefined = $state(undefined);
	let buttonElement: HTMLElement;
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
		if (buttonElement.contains(e.target as HTMLElement)) return;

		open = false;
	}

	const extraClasses: string[] = $derived.by(() => {
		const classes = [];
		if (open) classes.push('!border-accent');
		if (computedAllowSearch && open && !isEmpty) classes.push('border-b-0 rounded-b-none');
		if (disabled) classes.push('disabled');
		if (showError) classes.push('show-error');

		return classes;
	});
</script>

<div
	class="select-container {containerClass}"
	class:mb-[1px]={computedAllowSearch && open && !isEmpty}
	bind:this={containerElement}
>
	<FormGroup {label} {required} {tooltipContent} {tooltipLocation}>
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
			{#if isEmpty || core.preloading}
				<span class="placeholder">{core.preloading ? 'Loading...' : placeholder}</span>
			{:else}
				<div class="selected-items">
					{#each rawValues as value}
						{#if disabled}
							<Badge>{value.label}</Badge>
						{:else}
							<Badge
								ondelete={() => {
									onSelection(value);
									tick().then(() => (open = false));
								}}>{value.label}</Badge
							>
						{/if}
					{/each}
				</div>
			{/if}
			{#if core.preloading || core.searching}
				<div class="loader">
					<Loader sizeOverride="1.125rem" />
				</div>
			{:else if open && !isEmpty}
				<div class="btn-clear-container">
					<ActionIcon
						variant="secondary-subtle"
						svg={iconX}
						size="0.75rem"
						onclick={(e: MouseEvent) => {
							values = [];
							internalValues = [];
							rawValues = [];

							onchange?.(values);
							onchangeRaw?.(rawValues);

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
	</FormGroup>
	{#if open}
		<!-- Rendered in the top layer so a scrolling Dialog body cannot clip it -->
		<div
			class="select-panel"
			use:floating={{ anchor: () => containerElement, placement: 'bottom-start', matchWidth: true }}
		>
			<div class="select-panel-inner" use:clickOutside={closePopover}>
				{#if computedAllowSearch}
					<Textbox
						bind:value={filterString}
						class="w-full !border-accent {!isEmpty ? 'border-t-0 rounded-t-none' : ''}"
						bind:textboxElement
						placeholder="Start typing to search..."
						disabled={core.preloading}
						autocomplete="off"
						oninput={() => onFilterChange(filterString)}
						onkeydown={onKeyDown}
					/>
				{/if}
				<ComboBoxMulti
					bind:this={comboBoxEl}
					{filterString}
					values={rawValues}
					{onSelection}
					onkeydown={comboBoxKeyDown}
					groupedOptions={core.filteredGroups}
					open={open && !hideCombobox}
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
		/* relative flex flex-wrap gap-x-1 gap-y-1 text-base rounded py-1 px-2 text-left focus:outline-none
				bg-input border border-main-border focus-visible:border-accent
				placeholder:text-zinc-400 dark:placeholder:text-neutral-500
				disabled:bg-main-border disabled:cursor-not-allowed */
	}

	.select:focus {
		border-color: var(--accent-color);
		outline: 2px solid transparent;
		outline-offset: 2px;
	}

	.select-icon {
		position: absolute;
		right: 0.5rem;
		width: 1rem;
		display: flex;
	}

	.btn-clear-container {
		position: absolute;
		line-height: 0;
		right: 0.4rem;
	}

	.select-btn-clear {
		border-radius: 0.25rem;
		padding: 0.25rem;
	}

	/* Position, width and top-layer promotion come from use:floating */
	.select-panel {
		z-index: 70;
	}

	.select-panel-inner {
		position: relative;
		width: 100%;
	}

	.placeholder {
		color: var(--placeholder-color);
	}

	.disabled {
		opacity: 0.5;
		cursor: not-allowed;
		background-color: var(--border-color);
	}

	.selected-items {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem;
	}

	.loader {
		position: absolute;
		right: 0.65rem;
		width: 1rem;
		top: 6px;
	}

	.show-error {
		border-color: var(--danger-text);
	}

	.text-error {
		color: var(--danger-text);
	}
</style>
