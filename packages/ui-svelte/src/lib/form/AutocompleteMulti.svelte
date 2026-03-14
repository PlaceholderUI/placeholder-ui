<script lang="ts">
	import { clickOutside } from "../actions/ClickOutside.js";
	import type { NotifyModel } from "../models/NotifyModel.js";
	import type {
		ComboBoxItem,
		FetchFunctionType,
		SearchFunctionType,
	} from "../models/ComboBoxItem.js";
	import ComboBoxMulti from "./ComboBoxMulti.svelte";
	import FormGroup from "./FormGroup.svelte";
	import Badge from "../ui/Badge.svelte";
	import { onMount, tick, type Snippet } from "svelte";

	interface Props {
		label?: string;
		values?: string[];
		rawValues?: ComboBoxItem[];
		placeholder?: string;
		class?: string;
		disabled?: boolean;
		required?: boolean;
		showError?: boolean;
		errorText?: string;
		autofocus?: boolean;
		showNoResultsMessage?: boolean;
		loadingText?: string;
		options?: ComboBoxItem[];
		fetchFunction?: FetchFunctionType;
		searchFunction?: SearchFunctionType;
		tooltipLocation?: "top" | "bottom" | "left" | "right";
		tooltipContent?: Snippet;
		tooltipText?: string;
		onchange?: (e: string[]) => void;
		onchangeRaw?: (e: ComboBoxItem[]) => void;
		onCreate?: (value: string) => void;
	}

	let {
		label = "",
		values = $bindable([]),
		rawValues = $bindable([]),
		placeholder = "Start typing to search...",
		class: classes = "",
		disabled = false,
		required = false,
		showError = false,
		errorText = "",
		autofocus = false,
		showNoResultsMessage = false,
		loadingText = "",
		options = [],
		fetchFunction,
		searchFunction,
		tooltipLocation = "top",
		tooltipContent,
		tooltipText,
		onchange,
		onchangeRaw,
		onCreate,
	}: Props = $props();

	const CREATE_PREFIX = "__create__";

	let filterString = $state("");
	let preloading = $state(false);
	let searching = $state(false);
	let timeout: number;

	let allOptions: ComboBoxItem[] = [];
	let filteredOptions: ComboBoxItem[] = $state([]);

	let open = $state(false);

	if (values === null || values === undefined) values = [];

	onMount(() => {
		if (fetchFunction) {
			preloading = true;
			fetchFunction().then((response: NotifyModel<ComboBoxItem[]>) => {
				convertOptions(response.object!);
				preloadValues();
				preloading = false;
			});
		} else {
			if (options.length) convertOptions(options);
			preloadValues();
		}

		if (autofocus) {
			tick().then(() => textboxElement?.focus());
		}
	});

	function preloadValues() {
		if (!values || values.length === 0) {
			rawValues = [];
			return;
		}

		if (rawValues.length > 0) return;

		let newRawValues: ComboBoxItem[] = [];

		for (let value of values) {
			const foundOption = allOptions.find((x) => x.value === value);
			if (foundOption) {
				foundOption.selected = true;
				newRawValues.push({ ...foundOption });
			} else if (value != null) {
				newRawValues.push({
					label: String(value),
					value: value,
					selected: true,
				});
			}
		}

		rawValues = newRawValues;
	}

	function convertOptions(opts: ComboBoxItem[]) {
		allOptions = opts.map((option) => ({
			...option,
			selected: values && values.some((x) => x === option.value),
		}));
		filteredOptions = [...allOptions];
	}

	function appendCreateOption(opts: ComboBoxItem[], query: string): ComboBoxItem[] {
		if (!query.trim()) return opts;
		const normalizedQuery = query.trim().toLowerCase();
		const exactMatch = opts.some((o) => o.label.toLowerCase() === normalizedQuery);
		if (exactMatch) return opts;
		// Don't offer create for values already selected
		if (values.some((v) => v.toLowerCase() === normalizedQuery)) return opts;
		return [...opts, { label: `Create "${query.trim()}"`, value: CREATE_PREFIX + query.trim() }];
	}

	function onSelection(selectedValue: ComboBoxItem) {
		if (selectedValue.value.startsWith(CREATE_PREFIX)) {
			const newValue = selectedValue.value.slice(CREATE_PREFIX.length);
			const newItem: ComboBoxItem = { label: newValue, value: newValue, selected: true };

			// Add to allOptions so it's available going forward
			allOptions = [...allOptions, newItem];
			if (options) {
				options.push({ label: newValue, value: newValue });
			}

			values = [...values, newValue];
			rawValues = [...rawValues, newItem];

			onchange?.(values);
			onchangeRaw?.(rawValues);
			onCreate?.(newValue);

			filterString = "";
			filteredOptions = appendCreateOption(
				allOptions.filter((o) => !values.includes(o.value) || o.value === newValue),
				"",
			);
			filteredOptions = [...allOptions];
			return;
		}

		// Toggle selection
		const alreadySelected = values.includes(selectedValue.value);

		if (alreadySelected) {
			values = values.filter((v) => v !== selectedValue.value);
			rawValues = rawValues.filter((rv) => rv.value !== selectedValue.value);
			const opt = allOptions.find((o) => o.value === selectedValue.value);
			if (opt) opt.selected = false;
		} else {
			const opt = allOptions.find((o) => o.value === selectedValue.value);
			if (opt) opt.selected = true;
			values = [...values, selectedValue.value];
			rawValues = [...rawValues, opt ?? selectedValue];
		}

		onchange?.(values);
		onchangeRaw?.(rawValues);

		filterString = "";
		filteredOptions = [...allOptions];
	}

	function removeValue(item: ComboBoxItem) {
		values = values.filter((v) => v !== item.value);
		rawValues = rawValues.filter((rv) => rv.value !== item.value);
		const opt = allOptions.find((o) => o.value === item.value);
		if (opt) opt.selected = false;
		onchange?.(values);
		onchangeRaw?.(rawValues);
	}

	function onFilterChange(value: string) {
		if (searchFunction && value) {
			clearTimeout(timeout);
			searching = true;
			timeout = window.setTimeout(() => {
				searchFunction(value).then(
					(response: NotifyModel<ComboBoxItem[]>) => {
						convertOptions(response.object!);
						filteredOptions = appendCreateOption(filteredOptions, value);
						searching = false;
						open = true;
					},
				);
			}, 300);
		} else if (allOptions) {
			filteredOptions = allOptions.filter((option) =>
				option.label.toLowerCase().includes(value.toLowerCase()),
			);
			filteredOptions = appendCreateOption(filteredOptions, value);
			open = true;
		}
	}

	let comboBoxEl: ReturnType<typeof ComboBoxMulti> | undefined = $state(undefined);
	let textboxElement: HTMLElement | undefined = $state(undefined);

	function onKeyDown(e: KeyboardEvent) {
		if (e.key === "Backspace" && filterString === "" && rawValues.length > 0) {
			// Remove last selected value on backspace when input is empty
			removeValue(rawValues[rawValues.length - 1]);
			return;
		}

		if (!open) return;

		if (e.key === "Escape") {
			e.preventDefault();
			open = false;
		}

		comboBoxEl?.handleKeyDown?.(e);
	}

	function onFocus() {
		open = true;
	}

	function closePopover(e: MouseEvent) {
		if (textboxElement?.contains(e.target as HTMLElement)) return;

		open = false;
	}

	// Build grouped options for ComboBoxMulti
	let groupedOptions = $derived([{ label: "", items: filteredOptions }]);
</script>

<div class="autocomplete-multi-container" class:show-error={showError}>
	<FormGroup {label} {required} {tooltipContent} {tooltipLocation} {tooltipText}>
		<div class="autocomplete-multi-input {classes}" class:focused={open} class:disabled use:clickOutside={closePopover}>
			{#each rawValues as item}
				{#if disabled}
					<Badge>{item.label}</Badge>
				{:else}
					<Badge onDelete={() => removeValue(item)}>{item.label}</Badge>
				{/if}
			{/each}
			<input
				class="inline-input"
				bind:this={textboxElement}
				bind:value={filterString}
				{placeholder}
				{disabled}
				autocomplete="off"
				onfocus={onFocus}
				oninput={() => onFilterChange(filterString)}
				onkeydown={onKeyDown}
			/>
		</div>
		<div class="relative w-full">
			<ComboBoxMulti
				bind:this={comboBoxEl}
				{filterString}
				values={rawValues}
				onSelection={onSelection}
				{groupedOptions}
				{open}
				loading={searching || preloading}
				{showNoResultsMessage}
				{loadingText}
			/>
		</div>
	</FormGroup>
	{#if showError && errorText}
		<div class="text-error">{errorText}</div>
	{/if}
</div>

<style>
	.autocomplete-multi-container {
		position: relative;
	}

	.autocomplete-multi-input {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--pui-spacing-1);
		padding: var(--pui-spacing-1) var(--pui-spacing-2);
		border: 1px solid var(--pui-input-border);
		background-color: var(--pui-input-bg);
		color: var(--pui-input-text);
		border-radius: var(--pui-radius-base);
		cursor: text;
		min-height: 2.25rem;
	}

	.autocomplete-multi-input.focused {
		border-color: var(--pui-input-border-focus);
	}

	.autocomplete-multi-input.disabled {
		opacity: 0.5;
		cursor: not-allowed;
		background-color: var(--pui-bg-disabled);
	}

	.inline-input {
		flex: 1;
		min-width: 4rem;
		border: none;
		outline: none;
		background: transparent;
		color: var(--pui-input-text);
		font-size: var(--pui-font-size-md);
		line-height: var(--pui-line-height-normal);
		padding: 0;
	}

	.inline-input::placeholder {
		color: var(--pui-text-placeholder);
	}

	.relative {
		position: relative;
	}

	.w-full {
		width: 100%;
	}

	.show-error .autocomplete-multi-input {
		border-color: var(--pui-text-danger);
	}

	.text-error {
		color: var(--pui-text-danger);
		font-size: var(--pui-font-size-sm);
	}
</style>
