<script module lang="ts">
	import type {
		ComboBoxGroup,
		ComboBoxItem,
		FetchFunctionType,
		RetrieveLabelFunctionType,
		SearchFunctionType
	} from '$lib/models/ComboBoxItem.js';
	import type { Snippet } from 'svelte';

	export interface AutocompleteProps {
		/** HTML name attribute for the input */
		name?: string;
		/** Label text displayed above the input */
		label?: string;
		/** Current input value (bindable) */
		value?: string;
		/** Full selected item object (bindable) */
		rawValue?: ComboBoxItem;
		/** Placeholder text when input is empty */
		placeholder?: string;
		/** Mark field as required (shows asterisk) */
		required?: boolean;
		/** CSS classes for the input element */
		class?: string;
		/** CSS classes for the container element */
		containerClass?: string;
		/** Disable the input */
		disabled?: boolean;
		/** Show error state styling */
		showError?: boolean;
		/** Error message to display */
		errorText?: string;
		/** Auto-focus the input on mount */
		autofocus?: boolean;
		/** Auto-focus on every dialog open */
		autofocusDialog?: boolean;
		/** Hide "no results" message when search finds nothing */
		hideNoResults?: boolean;
		/** Prevent updating value when an option is selected */
		preventChangeOnSelection?: boolean;
		/** Allow suggesting a new value be added when the input doesn't match an existing option */
		allowAdd?: boolean;
		/** Builds the label shown for the "add new value" suggestion (default: `Add "<value>"`) */
		addItemLabel?: (value: string) => string;
		/** Text shown while loading options */
		loadingText?: string;
		/** CSS classes for the FormGroup wrapper */
		groupClass?: string;
		/** SVG icon displayed on the left side */
		leftIconSvg?: string;
		/** Static list of autocomplete options */
		options?: ComboBoxItem[];
		/** Options organized into groups */
		groupedOptions?: ComboBoxGroup[];
		/** Position of the tooltip */
		tooltipLocation?: 'top' | 'bottom' | 'left' | 'right';
		/** Async function to fetch all options */
		fetchFunction?: FetchFunctionType | null;
		/** Async function to search/filter options based on input */
		searchFunction?: SearchFunctionType | null;
		/** Async function to retrieve label for a value */
		retrieveLabelFunction?: RetrieveLabelFunctionType | null;
		/** Rich tooltip content using a Svelte snippet */
		tooltipContent?: Snippet;
		/** Simple tooltip text */
		tooltipText?: string;
		/** Callback when input value changes */
		onchange?: (e: string) => void;
		/** Callback when Enter key is pressed */
		enterPressed?: (e: string) => void;
		/** Callback when an option is selected */
		onSelect?: (e: ComboBoxItem) => void;
		/** Callback when selection changes (returns full item object) */
		onchangeRaw?: (e: ComboBoxItem | undefined) => void;
		/** Callback when the user chooses to add the typed value as a new item */
		onItemAdded?: (value: string) => void;
	}
</script>

<script lang="ts">
	import ComboBoxMulti from '$lib/form/ComboBoxMulti.svelte';
	import { clickOutside } from '$lib/util/ClickOutside.js';
	import Textbox from './Textbox.svelte';
	import { ComboBoxCore, findItemByValue } from './comboBoxCore.svelte.js';
	import { tick } from 'svelte';
	import { useDialogEvents } from '$lib/ui/DialogEvents.svelte.js';

	let {
		name,
		label,
		value = $bindable(''),
		rawValue = $bindable(undefined),
		placeholder = 'Start typing to search...',
		required = false,
		class: classes = '',
		containerClass = '',
		disabled = false,
		showError = false,
		errorText = '',
		autofocus = false,
		autofocusDialog = false,
		hideNoResults = false,
		preventChangeOnSelection = false,
		allowAdd = false,
		addItemLabel = (v: string) => `Add "${v}"`,
		loadingText = '',
		groupClass = '',
		leftIconSvg,
		options = [],
		groupedOptions = [],
		tooltipLocation = 'top',
		fetchFunction = null,
		searchFunction = null,
		retrieveLabelFunction = null,
		tooltipContent,
		tooltipText,
		onchange = undefined,
		enterPressed = undefined,
		onSelect = undefined,
		onchangeRaw = undefined,
		onItemAdded = undefined
	}: AutocompleteProps = $props();

	const core = new ComboBoxCore({
		getOptions: () => options,
		getGroupedOptions: () => groupedOptions,
		getValue: () => value,
		setValue: (v) => (value = v ?? ''),
		setRawValue: (r) => (rawValue = r),
		getFetchFunction: () => fetchFunction,
		getSearchFunction: () => searchFunction,
		getRetrieveLabelFunction: () => retrieveLabelFunction,
		clearUnknownStatic: false,
		onOptionsChanged: () => {
			if (value) core.filterLocal(value);
		}
	});

	/** Synthetic "add new value" suggestion shown when the typed value matches no option */
	let addOption: ComboBoxItem | undefined = $derived.by(() => {
		const trimmed = value?.trim();
		if (!allowAdd || !trimmed) return undefined;

		const exists = core.allGroups
			.flatMap((x) => x.items)
			.some(
				(x) =>
					x.label.toLowerCase() === trimmed.toLowerCase() ||
					x.value.toLowerCase() === trimmed.toLowerCase()
			);
		if (exists) return undefined;

		return { label: addItemLabel(trimmed), value: trimmed, isAddNew: true };
	});

	/** Groups passed to the dropdown, including the add suggestion when applicable */
	let displayGroups: ComboBoxGroup[] = $derived(
		addOption
			? [...core.filteredGroups, { label: '', items: [addOption], showGroupName: false }]
			: core.filteredGroups
	);

	let open = $state(false);
	let internalValue = $state(value);

	useDialogEvents({
		onFirstOpen: () => {
			if (autofocus) {
				setTimeout(() => {
					doFocus();
				}, 150);
			}
		},
		onOpen: () => {
			if (autofocusDialog) {
				setTimeout(() => {
					doFocus();
				}, 150);
			}
		}
	});

	function doFocus() {
		open = true;
		tick().then(() => textboxElement?.focus());
	}

	$effect(() => {
		if (value !== internalValue) {
			internalValue = value;
			rawValue = findItemByValue(core.allGroups, value);
			onchangeRaw?.(rawValue);
			core.preloadValues();
		}
	});

	let selectionJustMade = false;

	function onSelection(selectedValue: ComboBoxItem) {
		selectionJustMade = true;
		open = false;

		if (selectedValue.isAddNew) {
			addItem(selectedValue.value);
			return;
		}

		core.allGroups
			.flatMap((x) => x.items)
			.forEach((option) => {
				option.selected = option.value === selectedValue.value;
			});

		if (!preventChangeOnSelection) {
			value = selectedValue.value;
			internalValue = value;
		}

		rawValue = selectedValue;

		onSelect?.(selectedValue);
		onchangeRaw?.(selectedValue);
	}

	function addItem(newValue: string) {
		open = false;

		const newItem: ComboBoxItem = { label: newValue, value: newValue };

		if (!preventChangeOnSelection) {
			value = newValue;
			internalValue = value;
		}

		rawValue = newItem;

		onItemAdded?.(newValue);
		onchangeRaw?.(newItem);
	}

	function onFilterChange(filterValue: string) {
		if (filterValue.length === 0) {
			core.filterLocal('');
			open = true;
			return;
		}

		if (searchFunction && filterValue) {
			core.search(filterValue, () => (open = true));
		} else {
			core.filterLocal(filterValue);
			open = true;
		}

		onchange?.(filterValue);
	}

	let textboxElement: HTMLElement | undefined = $state(undefined);
	let comboBoxEl: ReturnType<typeof ComboBoxMulti> | undefined = $state(undefined);

	function onKeyDown(e: KeyboardEvent) {
		if (!open) {
			if (e.key === 'Enter') enterPressed?.(value);
			return;
		}

		if (e.key === 'Escape') {
			e.preventDefault();
			open = false;
		} else {
			selectionJustMade = false;
			comboBoxEl?.handleKeyDown?.(e);

			if (!selectionJustMade && e.key === 'Enter') enterPressed?.(value);
		}
	}

	function onFocus(_value: string, e: FocusEvent) {
		open = true;
		const target = e?.target as HTMLInputElement;
		target?.select();
	}

	function closePopover(e: MouseEvent) {
		if (textboxElement?.contains(e.target as HTMLElement)) return;

		open = false;
	}
</script>

<div class="autocomplete-container">
	<Textbox
		{name}
		type="search"
		{label}
		class={classes}
		{containerClass}
		{required}
		{showError}
		{errorText}
		{tooltipLocation}
		{tooltipContent}
		{tooltipText}
		bind:textboxElement
		placeholder={core.preloading ? 'Loading...' : placeholder}
		loading={core.searching || core.preloading}
		disabled={core.preloading || disabled}
		autocomplete="off"
		{groupClass}
		{leftIconSvg}
		bind:value
		oninput={() => {
			onFilterChange(value);
		}}
		onfocus={onFocus}
		onkeydown={onKeyDown}
	/>
	<div class="autocomplete-panel {open ? '' : 'hidden'}">
		<div class="autocomplete-panel-inner" use:clickOutside={closePopover}>
			<ComboBoxMulti
				bind:this={comboBoxEl}
				filterString={value}
				values={rawValue ? [rawValue] : []}
				{onSelection}
				groupedOptions={displayGroups}
				{open}
				loading={core.searching}
				{hideNoResults}
				{loadingText}
			/>
		</div>
	</div>
</div>

<style>
	.autocomplete-container {
		position: relative;
	}

	.autocomplete-panel {
		position: absolute;
		width: 100%;
		left: 0;
		z-index: 70;
	}

	.autocomplete-panel-inner {
		position: relative;
		width: 100%;
	}

	.hidden {
		display: none;
	}
</style>
