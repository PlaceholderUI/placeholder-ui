<script module lang="ts">
	import type {
		ComboBoxGroup,
		ComboBoxItem,
		FetchFunctionType,
		RetrieveLabelFunctionType,
		SearchFunctionType
	} from '$lib/models/ComboBoxItem.js';
	import type { Snippet } from 'svelte';

	export interface AutocompleteMultiProps {
		/** HTML name attribute for the input */
		name?: string;
		/** Label text displayed above the input */
		label?: string;
		/** Array of selected values (bindable) */
		values?: string[];
		/**
		 * Array of full selected item objects (bindable). Can be passed initially to preset
		 * the selection with known labels — no `values` or retrieveLabelFunction needed.
		 */
		rawValues?: ComboBoxItem[];
		/** Placeholder text when nothing is selected */
		placeholder?: string;
		/** Mark field as required (shows asterisk) */
		required?: boolean;
		/** CSS classes for the control element */
		class?: string;
		/** CSS classes for the container element */
		containerClass?: string;
		/** CSS classes for the FormGroup wrapper */
		groupClass?: string;
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
		/** Close the dropdown after selecting an option */
		closeOnSelection?: boolean;
		/**
		 * Offer to add the typed text as a new chip when it doesn't match an existing option.
		 * On by default — set to `false` to restrict selection to the provided options.
		 */
		allowAdd?: boolean;
		/** Builds the label shown for the "add new value" suggestion (default: `Add "<value>"`) */
		addItemLabel?: (value: string) => string;
		/** Text shown while loading options */
		loadingText?: string;
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
		/** Async function to retrieve labels for values */
		retrieveLabelFunction?: RetrieveLabelFunctionType | null;
		/** Rich tooltip content using a Svelte snippet */
		tooltipContent?: Snippet;
		/** Simple tooltip text */
		tooltipText?: string;
		/** Callback when Enter is pressed with the current filter text */
		enterPressed?: (e: string) => void;
		/** Callback when selection changes (returns value strings) */
		onchange?: (e: string[]) => void;
		/** Callback when selection changes (returns full item objects) */
		onchangeRaw?: (e: ComboBoxItem[]) => void;
		/** Callback when the user chooses to add the typed value as a new item */
		onItemAdded?: (value: string) => void;
	}
</script>

<script lang="ts">
	import ComboBoxMulti from '$lib/form/ComboBoxMulti.svelte';
	import FormGroup from '$lib/form/FormGroup.svelte';
	import { clickOutside } from '$lib/util/ClickOutside.js';
	import { floating } from '$lib/util/Floating.js';
	import { ComboBoxMultiCore } from './comboBoxCore.svelte.js';
	import Icon from '$lib/icon/Icon.svelte';
	import Loader from '$lib/ui/Loader.svelte';
	import Badge from '$lib/ui/Badge.svelte';
	import ActionIcon from '$lib/ui/ActionIcon.svelte';
	import { iconX } from '$lib/icon/index.js';
	import { tick } from 'svelte';
	import { useDialogEvents } from '$lib/ui/DialogEvents.svelte.js';

	const autoName = `autocompletemulti-${crypto.randomUUID()}`;

	let {
		name,
		label = '',
		values = $bindable([]),
		rawValues = $bindable([]),
		placeholder = 'Start typing to search...',
		required = false,
		class: classes = '',
		containerClass = '',
		groupClass = '',
		disabled = false,
		showError = false,
		errorText = '',
		autofocus = false,
		autofocusDialog = false,
		hideNoResults = false,
		closeOnSelection = false,
		allowAdd = true,
		addItemLabel = (v: string) => `Add "${v}"`,
		loadingText = '',
		leftIconSvg,
		options = [],
		groupedOptions = [],
		tooltipLocation = 'top',
		fetchFunction = null,
		searchFunction = null,
		retrieveLabelFunction = null,
		tooltipContent,
		tooltipText,
		enterPressed = undefined,
		onchange = undefined,
		onchangeRaw = undefined,
		onItemAdded = undefined
	}: AutocompleteMultiProps = $props();

	if (values === null || values === undefined) values = [];
	if (rawValues === null || rawValues === undefined) rawValues = [];
	// Callers may preset the selection by passing only rawValues — adopt their values
	if (values.length === 0 && rawValues.length > 0) values = rawValues.map((r) => r.value);

	let resolvedName = $derived((name || label || autoName).replace(/[^a-zA-Z0-9_\-:.]/g, '_'));

	let internalValues: string[] = $state([]);
	let filterValue = $state('');
	let open = $state(false);

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
		clearUnknownStatic: false,
		onRawValuesResolved: (raw) => onchangeRaw?.(raw),
		onOptionsChanged: () => {
			if (filterValue) core.filterLocal(filterValue);
		}
	});

	let isEmpty: boolean = $derived(rawValues?.length === 0);

	/** Synthetic "add new value" suggestion shown when the typed text matches no option */
	let addOption: ComboBoxItem | undefined = $derived.by(() => {
		const trimmed = filterValue?.trim();
		if (!allowAdd || !trimmed) return undefined;

		const exists = core.allGroups
			.flatMap((x) => x.items)
			.some(
				(x) =>
					x.label.toLowerCase() === trimmed.toLowerCase() ||
					x.value.toLowerCase() === trimmed.toLowerCase()
			);
		const alreadySelected = values.some((v) => v.toLowerCase() === trimmed.toLowerCase());
		if (exists || alreadySelected) return undefined;

		return { label: addItemLabel(trimmed), value: trimmed, isAddNew: true };
	});

	/** Groups passed to the dropdown, including the add suggestion when applicable */
	let displayGroups: ComboBoxGroup[] = $derived(
		addOption
			? [...core.filteredGroups, { label: '', items: [addOption], showGroupName: false }]
			: core.filteredGroups
	);

	useDialogEvents({
		onFirstOpen: () => {
			if (autofocus) setTimeout(() => doFocus(), 150);
		},
		onOpen: () => {
			if (autofocusDialog) setTimeout(() => doFocus(), 150);
		}
	});

	function doFocus() {
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

	let selectionJustMade = false;

	function onSelection(selectedValue: ComboBoxItem) {
		selectionJustMade = true;

		if (selectedValue.isAddNew) {
			addItem(selectedValue.value);
			return;
		}

		const items = core.allGroups.flatMap((x) => x.items);
		const index = items.findIndex((opt) => opt.value === selectedValue.value);
		const actualOption = index !== -1 ? items[index] : selectedValue;

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

		if (closeOnSelection) open = false;
		tick().then(() => textboxElement?.focus());
	}

	function addItem(newValue: string) {
		selectionJustMade = true;
		const trimmed = newValue.trim();
		filterValue = '';
		core.filterLocal('');

		if (!trimmed || values.some((v) => v.toLowerCase() === trimmed.toLowerCase())) return;

		const newItem: ComboBoxItem = { label: trimmed, value: trimmed, selected: true };
		values = [...values, trimmed];
		rawValues = [...rawValues, newItem];
		internalValues = [...values];

		onItemAdded?.(trimmed);
		onchange?.(values);
		onchangeRaw?.(rawValues);

		if (closeOnSelection) open = false;
		tick().then(() => textboxElement?.focus());
	}

	function removeItem(item: ComboBoxItem) {
		values = values.filter((value) => value !== item.value);
		rawValues = rawValues.filter((rawValue) => rawValue.value !== item.value);
		internalValues = [...values];

		const match = core.allGroups.flatMap((x) => x.items).find((x) => x.value === item.value);
		if (match) match.selected = false;

		onchange?.(values);
		onchangeRaw?.(rawValues);
	}

	function clearAll() {
		values = [];
		rawValues = [];
		internalValues = [];
		core.allGroups.flatMap((x) => x.items).forEach((x) => (x.selected = false));

		onchange?.(values);
		onchangeRaw?.(rawValues);
	}

	function onFilterChange(text: string) {
		if (searchFunction && text) {
			core.search(text, () => (open = true));
		} else {
			core.filterLocal(text);
			open = true;
		}
	}

	let textboxElement: HTMLInputElement | undefined = $state(undefined);
	let comboBoxEl: ReturnType<typeof ComboBoxMulti> | undefined = $state(undefined);
	let containerElement: HTMLElement | undefined = $state(undefined);

	function onKeyDown(e: KeyboardEvent) {
		if (e.key === 'Backspace' && filterValue.length === 0 && rawValues.length > 0) {
			removeItem(rawValues[rawValues.length - 1]);
			return;
		}

		if (!open) {
			if (e.key === 'Enter') enterPressed?.(filterValue);
			return;
		}

		if (e.key === 'Escape') {
			e.preventDefault();
			open = false;
		} else {
			selectionJustMade = false;
			comboBoxEl?.handleKeyDown?.(e);

			if (!selectionJustMade && e.key === 'Enter') enterPressed?.(filterValue);
		}
	}

	function onFocus() {
		open = true;
	}

	function closePopover(e: MouseEvent) {
		if (controlElement?.contains(e.target as HTMLElement)) return;
		open = false;
	}

	let controlElement: HTMLElement | undefined = $state(undefined);

	const extraClasses: string[] = $derived.by(() => {
		const list: string[] = [];
		if (open) list.push('open');
		if (disabled) list.push('disabled');
		if (showError) list.push('show-error');
		return list;
	});
</script>

<div class="autocomplete-multi-container {containerClass}" bind:this={containerElement}>
	<FormGroup
		{label}
		{required}
		{showError}
		{errorText}
		{tooltipContent}
		{tooltipText}
		{tooltipLocation}
		class={groupClass}
	>
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			bind:this={controlElement}
			class="ac-control {extraClasses.join(' ')} {classes}"
			onclick={() => {
				if (!disabled) tick().then(() => textboxElement?.focus());
			}}
			onkeydown={() => {}}
		>
			{#if leftIconSvg}
				<span class="left-icon"><Icon svg={leftIconSvg} size="1rem" /></span>
			{/if}

			<div class="ac-chips">
				{#each rawValues as item (item.value)}
					{#if disabled}
						<Badge>{item.label}</Badge>
					{:else}
						<Badge ondelete={() => removeItem(item)}>{item.label}</Badge>
					{/if}
				{/each}

				<input
					bind:this={textboxElement}
					bind:value={filterValue}
					name={resolvedName}
					type="search"
					class="ac-input"
					{disabled}
					placeholder={core.preloading ? 'Loading...' : isEmpty ? placeholder : ''}
					autocomplete="off"
					oninput={() => onFilterChange(filterValue)}
					onfocus={onFocus}
					onkeydown={onKeyDown}
				/>
			</div>

			{#if core.preloading || core.searching}
				<span class="control-action"><Loader sizeOverride="1.125rem" /></span>
			{:else if !isEmpty && !disabled}
				<span class="control-action">
					<ActionIcon
						variant="secondary-subtle"
						svg={iconX}
						size="0.75rem"
						onclick={(e: MouseEvent) => {
							clearAll();
							e.stopPropagation();
						}}
					/>
				</span>
			{/if}
		</div>
	</FormGroup>

	{#if open}
		<!-- Rendered in the top layer so a scrolling Dialog body cannot clip it -->
		<div
			class="autocomplete-panel"
			use:floating={{ anchor: () => containerElement, placement: 'bottom-start', matchWidth: true }}
		>
			<div class="autocomplete-panel-inner" use:clickOutside={closePopover}>
				<ComboBoxMulti
					bind:this={comboBoxEl}
					filterString={filterValue}
					values={rawValues}
					{onSelection}
					groupedOptions={displayGroups}
					{open}
					loading={core.searching}
					{hideNoResults}
					{loadingText}
				/>
			</div>
		</div>
	{/if}
</div>

<style>
	.autocomplete-multi-container {
		position: relative;
	}

	.ac-control {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		width: 100%;
		min-height: 2.25rem;
		padding: 0.25rem 0.5rem;
		border-radius: 0.25rem;
		background-color: var(--input-bg-color);
		color: var(--text-color);
		border: 1px solid var(--border-color);
		cursor: text;
	}

	.ac-control.open {
		border-color: var(--accent-color);
	}

	.ac-control.show-error {
		border-color: var(--danger-text);
	}

	.ac-control.disabled {
		opacity: 0.5;
		cursor: not-allowed;
		background-color: var(--border-color);
	}

	.left-icon {
		display: flex;
		align-items: center;
		pointer-events: none;
	}

	.ac-chips {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.25rem;
		flex: 1 1 auto;
		min-width: 0;
	}

	.ac-input {
		flex: 1 1 6rem;
		min-width: 6rem;
		border: none;
		outline: none;
		background: transparent;
		color: var(--text-color);
		font-size: 1rem;
		padding: 0.25rem 0;
	}

	.control-action {
		display: flex;
		align-items: center;
		line-height: 0;
	}

	/* Position, width and top-layer promotion come from use:floating */
	.autocomplete-panel {
		z-index: 70;
	}

	.autocomplete-panel-inner {
		position: relative;
		width: 100%;
	}
</style>
