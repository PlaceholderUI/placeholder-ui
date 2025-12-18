<script lang="ts">
	import ComboBox from "./ComboBox.svelte";
	import { clickOutside } from "../actions/ClickOutside.js";
	import Textbox from "./Textbox.svelte";
	import type { NotifyModel } from "../models/NotifyModel.js";
	import type {
		ComboBoxItem,
		FetchFunctionType,
		SearchFunctionType,
	} from "../models/ComboBoxItem.js";
	import { onMount } from "svelte";

	interface Props {
		label?: string;
		value?: string;
		placeholder?: string;
		showRequired?: boolean;
		classes?: string;
		autofocus?: boolean;
		hideNoResults?: boolean;
		preventChangeOnSelection?: boolean;
		loadingText?: string;
		groupClass?: string;
		leftIconSvg?: string;
		options?: ComboBoxItem[];
		fetchFunction?: FetchFunctionType;
		searchFunction?: SearchFunctionType;
		onchange?: (e: string) => void;
		enterPressed?: (e: string) => void;
		onSelect?: (e: ComboBoxItem) => void;
	}

	let {
		label,
		value = $bindable(""),
		placeholder = "Start typing to search...",
		showRequired = false,
		classes = "",
		autofocus = false,
		hideNoResults = false,
		preventChangeOnSelection = false,
		loadingText = "",
		groupClass = "",
		leftIconSvg,
		options,
		fetchFunction,
		searchFunction,
		onchange = undefined,
		enterPressed = undefined,
		onSelect = undefined,
	}: Props = $props();

	let preloading = $state(false);
	let searching = $state(false);
	let timeout = setTimeout(() => {});

	let allOptions: ComboBoxItem[] = [];
	let filteredOptions: ComboBoxItem[] = $state([]);

	let open = $state(false);

	onMount(() => {
		if (fetchFunction) {
			preloading = true;
			fetchFunction().then((response: NotifyModel<ComboBoxItem[]>) => {
				convertOptions(response.object!);
				preloading = false;
			});
		} else {
			if (options) convertOptions(options);
		}
	});

	function convertOptions(options: ComboBoxItem[]) {
		allOptions = options.map((option) => {
			return {
				html: option.label,
				value: option.value,
				selected: option.value == value,
				label: option.label,
			};
		});
		filteredOptions = [...allOptions];
	}

	function onSelection(selectedValue: ComboBoxItem) {
		open = false;
		if (options) {
			options.forEach((option) => {
				option.selected = option.value == selectedValue.value;
			});
		}

		if (!preventChangeOnSelection) value = selectedValue.value;

		onSelect?.(selectedValue);
	}

	function onFilterChange(value: string) {
		if (searchFunction && value) {
			clearTimeout(timeout);
			searching = true;
			timeout = setTimeout(() => {
				searchFunction(value).then(
					(response: NotifyModel<ComboBoxItem[]>) => {
						convertOptions(response.object!);
						searching = false;
					},
				);
			}, 300);
		} else if (allOptions) {
			filteredOptions = allOptions.filter((option) =>
				option.label.toLowerCase().includes(value.toLowerCase()),
			);
			open = true;
		}

		onchange?.(value);
	}

	let textboxElement: HTMLElement | undefined = $state(undefined);

	// returns true if an item was selected, false otherwise
	let comboBoxKeyDown: ((e: KeyboardEvent) => boolean) | undefined =
		$state(undefined);

	function onKeyDown(e: KeyboardEvent) {
		if (!open) {
			if (e.key === "Enter")
				// If combobox is not open return user entered string
				enterPressed?.(value);

			return;
		}

		if (e.key === "Escape") {
			e.preventDefault();
			open = false;
		} else if (comboBoxKeyDown) {
			const itemSelected = comboBoxKeyDown(e);

			if (!itemSelected && e.key === "Enter") enterPressed?.(value);
		}
	}

	function onFocus(e: any) {
		open = true;
		const target = e?.target as HTMLInputElement;
		target?.select();
	}

	function closePopover(e: MouseEvent) {
		if (textboxElement?.contains(e.target as HTMLElement)) return;

		open = false;
	}
</script>

<Textbox
	{label}
	class={classes}
	required={showRequired}
	bind:textboxElement
	placeholder={preloading ? "Loading..." : placeholder}
	loading={searching || preloading}
	disabled={preloading}
	noAutocomplete
	{groupClass}
	{leftIconSvg}
	bind:value
	oninput={() => {
		onFilterChange(value);
	}}
	onfocus={onFocus}
	onkeydown={onKeyDown}
>
	<div class="relative w-full" use:clickOutside={closePopover}>
		<ComboBox
			{value}
			onselection={onSelection}
			options={filteredOptions}
			{open}
			loading={searching}
			{hideNoResults}
			{loadingText}
		/>
	</div>
</Textbox>

<style>
</style>
