<script module lang="ts">
	import type {
		ComboBoxGroup,
		ComboBoxItem,
		FetchFunctionType,
		RetrieveLabelFunctionType,
		SearchFunctionType
	} from '../models/ComboBoxItem.js';
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
	}
</script>

<script lang="ts">
	import ComboBoxMulti from './ComboBoxMulti.svelte';
	import { clickOutside } from '../actions/ClickOutside.js';
	import Textbox from './Textbox.svelte';
	import type { NotifyModel } from '../models/NotifyModel.js';
	import { onMount, tick } from 'svelte';
	import { useDialogEvents } from '../ui/DialogEvents.svelte.js';

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
		onchangeRaw = undefined
	}: AutocompleteProps = $props();

	let preloading = $state(false);
	let searching = $state(false);
	let timeout: number;

	let allGroups: ComboBoxGroup[] = $state([]);
	let filteredGroups: ComboBoxGroup[] = $state([]);

	let open = $state(false);
	let internalValue = $state(value);

	onMount(() => {
		if (fetchFunction) {
			preloading = true;
			fetchFunction().then((response: NotifyModel<ComboBoxItem[]>) => {
				convertOptions(response.object!);
				preloadValues();
				preloading = false;
			});
		} else {
			if (groupedOptions.length) {
				convertGroupOptions(groupedOptions);
			} else if (options.length) {
				convertOptions(options);
			}
			preloadValues();
		}
	});

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
			rawValue =
				allGroups.flatMap((x) => x.items).find((x) => x.value === value) ?? undefined;
			onchangeRaw?.(rawValue);
			preloadValues();
		}
	});

	function preloadValues() {
		if (!value) {
			rawValue = undefined;
			return;
		}

		const foundOption = allGroups.flatMap((x) => x.items).find((x) => x.value === value);

		if (foundOption !== undefined) {
			rawValue = foundOption;
		} else if (searchFunction && retrieveLabelFunction) {
			preloading = true;
			retrieveLabelFunction(value).then((response) => {
				rawValue = {
					label: response.object ?? value!.toString(),
					value: value!
				};
				preloading = false;
			});
		}
	}

	function convertOptions(opts: ComboBoxItem[]) {
		const allOptions = opts.map((option) => ({
			...option,
			selected: option.value === value
		}));
		allGroups = [{ label: '', items: [...allOptions] }];
		filteredGroups = [{ label: '', items: [...allOptions] }];
	}

	function convertGroupOptions(groups: ComboBoxGroup[]) {
		allGroups = groups.map((group) => ({
			...group,
			items: group.items.map((option) => ({
				...option,
				selected: option.value === value,
				groupName: group.label
			}))
		}));
		filteredGroups = [...allGroups];
	}

	let selectionJustMade = false;

	function onSelection(selectedValue: ComboBoxItem) {
		selectionJustMade = true;
		open = false;

		allGroups.flatMap((x) => x.items).forEach((option) => {
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

	function onFilterChange(filterValue: string) {
		if (filterValue.length === 0) {
			filteredGroups = allGroups;
			open = true;
			return;
		}

		if (searchFunction && filterValue) {
			clearTimeout(timeout);
			searching = true;
			timeout = window.setTimeout(() => {
				searchFunction(filterValue).then((response: NotifyModel<ComboBoxItem[]>) => {
					convertOptions(response.object!);
					searching = false;
					open = true;
				});
			}, 300);
		} else if (allGroups.length) {
			filteredGroups = allGroups
				.map((group) => ({
					...group,
					items: group.items.filter((x) =>
						x.label.toLowerCase().includes(filterValue.toLowerCase())
					)
				}))
				.filter((group) => group.items.length > 0);
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
		placeholder={preloading ? 'Loading...' : placeholder}
		loading={searching || preloading}
		disabled={preloading || disabled}
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
				onSelection={onSelection}
				groupedOptions={filteredGroups}
				{open}
				loading={searching}
				showNoResultsMessage={!hideNoResults}
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
