<script lang="ts">
	import { clickOutside } from "../actions/ClickOutside.js";
	import type { NotifyModel } from "../models/NotifyModel.js";
	import type {
		ComboBoxGroup,
		ComboBoxItem,
		FetchFunctionType,
		RetrieveLabelFunctionType,
		SearchFunctionType,
	} from "../models/ComboBoxItem.js";
	import ComboBoxMulti from "./ComboBoxMulti.svelte";
	import FormGroup from "./FormGroup.svelte";
	import Icon from "../icon/Icon.svelte";
	import Loader from "../ui/Loader.svelte";
	import { useDialogEvents } from "../ui/DialogEvents.svelte.js";
	import selectorSvg from "../icon/selector.svg?raw";
	import Textbox from "./Textbox.svelte";
	import Badge from "../ui/Badge.svelte";
	import ActionIcon from "../ui/ActionIcon.svelte";
	import { iconX } from "../icon/index.js";
	import { onMount, tick, type Snippet } from "svelte";

	interface Props {
		label?: string;
		values?: string[];
		rawValues?: ComboBoxItem[];
		placeholder?: string;
		class?: string;
		containerClass?: string;
		disabled?: boolean;
		required?: boolean;
		showError?: boolean;
		errorText?: string;
		autofocus?: boolean; // will also cause dialog autofocus on first open only
		autofocusDialog?: boolean; // will cause autofocus on every open, not just the first time
		allowSearch?: boolean;
		hideNoResults?: boolean;
		closeOnSelection?: boolean;
		loadingText?: string;
		options?: ComboBoxItem[];
		groupedOptions?: ComboBoxGroup[];
		tooltipLocation?: "top" | "bottom" | "left" | "right";
		fetchFunction?: FetchFunctionType | null;
		searchFunction?: SearchFunctionType | null;
		retrieveLabelFunction?: RetrieveLabelFunctionType | null;
		tooltipContent?: Snippet;
		tooltipText?: string;
		onchange?: (e: string[]) => void;
		onchangeRaw?: (e: ComboBoxItem[]) => void;
	}

	let {
		label = "",
		values = $bindable([]),
		rawValues = $bindable([]),
		placeholder = "\u00a0", // non-breaking space to prevent the height collapsing
		class: classes = "",
		containerClass = "",
		disabled = false,
		required = false,
		showError = false,
		errorText = "",
		autofocus = false,
		autofocusDialog = false,
		allowSearch = false,
		hideNoResults = false,
		closeOnSelection = false,
		loadingText = "",
		options = [],
		groupedOptions = [],
		tooltipLocation = "top",
		fetchFunction = null,
		searchFunction = null,
		retrieveLabelFunction = null,
		tooltipContent,
		tooltipText,
		onchange,
		onchangeRaw,
	}: Props = $props();

	let internalValues: string[] = $state([]);
	let filterString = $state("");
	let preloading = $state(false);
	let searching = $state(false);
	let timeout: number;

	let allGroups: ComboBoxGroup[] = $state([]);
	let filteredGroups: ComboBoxGroup[] = $state([]);

	let open = $state(false);
	let hideCombobox = $state(false);

	if (values === null || values === undefined) values = [];

	let isEmpty: boolean = $derived(rawValues?.length === 0);

	onMount(() => {
		initOptions(options);
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
		},
	});

	function focus() {
		open = true;
		tick().then(() => textboxElement?.focus());
	}

	let canReloadValues = false;

	$effect(() => {
		const currentValues = values || [];
		const currentInternalValues = internalValues || [];

		const arraysAreDifferent =
			currentValues.length !== currentInternalValues.length ||
			currentValues.some(
				(value, index) => value !== currentInternalValues[index],
			);

		if (arraysAreDifferent) {
			internalValues = [...currentValues];

			// Reset all options selection state
			for (let option of allGroups.flatMap((x) => x.items)) {
				option.selected = false;
			}

			// Update rawValues based on new values
			let newRawValues: ComboBoxItem[] = [];

			for (let value of currentValues) {
				const foundOption = allGroups
					.flatMap((x) => x.items)
					.find((x) => x.value === value);

				if (foundOption) {
					foundOption.selected = true;
					newRawValues.push({ ...foundOption });
				} else if (value != null) {
					// Create a new option if not found in allOptions
					const newOption = {
						label: String(value),
						value: value,
						selected: true,
					};
					newRawValues.push(newOption);
				}
			}

			rawValues = newRawValues;
		}
	});

	function initOptions(options: ComboBoxItem[]) {
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
			} else if (searchFunction) {
				// Initialize empty groups for search function
				allGroups = [];
				filteredGroups = [];
				allowSearch = true;
			} else {
				filteredGroups = [];
			}
			preloadValues();
		}
	}

	function preloadValues(overwrite: boolean = false) {
		if (!values || values.length === 0) {
			rawValues = [];
			values = [];

			for (let option of allGroups.flatMap((x) => x.items))
				option.selected = false;

			return;
		}

		if (rawValues.length > 0 && !overwrite) return;

		let promises = [];
		let newRawValues: ComboBoxItem[] = [];

		for (let option of allGroups.flatMap((x) => x.items))
			option.selected = false;

		for (let value of values) {
			const foundOption = allGroups
				.flatMap((x) => x.items)
				.find((x) => x.value === value);

			if (foundOption !== undefined) {
				foundOption.selected = true;
				newRawValues.push(foundOption);
			} else if (searchFunction && retrieveLabelFunction) {
				preloading = true;
				let object = { label: value, value: value, selected: true };

				promises.push(
					retrieveLabelFunction(value).then((response) => {
						object.label = response.object ?? value!.toString();
					}),
				);

				newRawValues.push(object);
			} else {
				newRawValues.push({
					label: value,
					value: value,
					selected: true,
				});
			}
		}

		if (promises && promises.length > 0) {
			preloading = true;

			Promise.all(promises).then((x) => {
				rawValues = newRawValues;
				preloading = false;
			});
		} else {
			rawValues = newRawValues;
		}
	}

	function convertOptions(options: ComboBoxItem[]) {
		const allOptions = options.map((option) => {
			return {
				...option,
				selected: values && values.some((x) => x === option.value),
			};
		});
		allGroups = [{ label: "", items: [...allOptions] }];
		filteredGroups = [{ label: "", items: [...allOptions] }];
	}

	function convertGroupOptions(groups: ComboBoxGroup[]) {
		allGroups = groups.map((group) => {
			return {
				...group,
				items: group.items.map((option) => {
					return {
						...option,
						selected:
							values && values.some((x) => x === option.value),
						groupName: group.label,
					};
				}),
			};
		});
		console.log(
			"convertGroupOptions allGroups",
			$state.snapshot(allGroups),
		);
		filteredGroups = [...allGroups];
	}

	function onSelection(selectedValue: ComboBoxItem) {
		// Find the actual option in allOptions to ensure we're working with the correct reference
		const optionIndex = allGroups
			.flatMap((x) => x.items)
			.findIndex((opt) => opt.value === selectedValue.value);
		const actualOption =
			optionIndex !== -1
				? allGroups.flatMap((x) => x.items)[optionIndex]
				: selectedValue;

		actualOption.selected = !actualOption.selected;

		if (actualOption.selected && !values.includes(actualOption.value)) {
			values = [...values, actualOption.value];
			rawValues = [...rawValues, actualOption];
		} else if (!actualOption.selected) {
			values = values.filter((value) => value !== actualOption.value);
			rawValues = rawValues.filter(
				(rawValue) => rawValue.value !== actualOption.value,
			);
		}

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
			clearTimeout(timeout);
			searching = true;
			timeout = window.setTimeout(() => {
				searchFunction(value).then(
					(response: NotifyModel<ComboBoxItem[]>) => {
						convertOptions(response.object!);
						searching = false;
						open = true;
						hideCombobox = false;
					},
				);
			}, 300);
		} else if (allGroups) {
			filteredGroups = allGroups.filter((group) =>
				group.items.some((x) =>
					x.label.toLowerCase().includes(value.toLowerCase()),
				),
			);

			if (filteredGroups.length > 0) {
				filteredGroups = filteredGroups.map((group) => ({
					...group,
					items: group.items.filter((x) =>
						x.label.toLowerCase().includes(value.toLowerCase()),
					),
				}));
			}

			hideCombobox = false;
		}
	}

	let comboBoxEl: ReturnType<typeof ComboBoxMulti> | undefined =
		$state(undefined);
	let textboxElement: HTMLElement | undefined = $state(undefined);
	let buttonElement: HTMLElement;
	let comboBoxKeyDown: ((e: KeyboardEvent) => void) | undefined =
		$state(undefined);

	function onKeyDown(e: KeyboardEvent) {
		if (!open) return;

		if (e.key === "Escape") {
			e.preventDefault();
			open = false;
		} else if (comboBoxKeyDown) {
			comboBoxKeyDown(e);
		}

		comboBoxEl?.handleKeyDown?.(e);
	}

	function closePopover(e: MouseEvent) {
		if (textboxElement && textboxElement.contains(e.target as HTMLElement))
			return;
		if (buttonElement.contains(e.target as HTMLElement)) return;

		open = false;
	}

	const extraClasses: string[] = $derived.by(() => {
		const classes = [];
		if (open) classes.push("!border-accent");
		if (allowSearch && open && !isEmpty)
			classes.push("border-b-0 rounded-b-none");
		if (disabled) classes.push("disabled");
		if (showError) classes.push("show-error");

		return classes;
	});
</script>

<div
	class="select-container {containerClass}"
	class:mb-[1px]={allowSearch && open && !isEmpty}
>
	<FormGroup {label} {required} {tooltipContent} {tooltipLocation}>
		<button
			bind:this={buttonElement}
			onclick={() => {
				open = !open;
				if (open && allowSearch) {
					tick().then(() => textboxElement?.focus());
				}
			}}
			onkeydown={(e) => onKeyDown(e)}
			disabled={preloading || disabled}
			class="select {extraClasses} {classes}"
		>
			{#if isEmpty || preloading}
				<span class="placeholder"
					>{preloading ? "Loading..." : placeholder}</span
				>
			{:else}
				<div class="selected-items">
					{#each rawValues as value}
						{#if disabled}
							<Badge>{value.label}</Badge>
						{:else}
							<Badge
								onDelete={() => {
									onSelection(value);
									tick().then(() => (open = false));
								}}>{value.label}</Badge
							>
						{/if}
						<!-- <span class="inline-flex items-center bg-primary text-white rounded-md px-2">
						{value.label}
						<button
							class="leading-0 ml-1 size-4 rounded hover:bg-neutral-400/25"
							{disabled}
							onclick={(e) => {
								if (disabled) return;

								value.selected = !value.selected;
								onSelection(value);
								open = false;
								e.stopPropagation();
							}}
							>×
						</button>
					</span> -->
					{/each}
				</div>
			{/if}
			{#if preloading || searching}
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
							rawValues = [];

							onchange?.(values);
							onchangeRaw?.(rawValues);

							options.forEach((x) => (x.selected = false));
							allGroups
								.flatMap((x) => x.items)
								.forEach((x) => (x.selected = false));

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
	<div
		class="select-panel top-full
			{open ? '' : 'hidden'}"
	>
		<div class="select-panel-inner" use:clickOutside={closePopover}>
			{#if allowSearch}
				<Textbox
					bind:value={filterString}
					class="w-full
						{open ? '!border-accent' : 'hidden'}
						{open && !isEmpty ? 'border-t-0 rounded-t-none' : ''}"
					bind:textboxElement
					placeholder="Start typing to search..."
					disabled={preloading}
					noAutocomplete
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
				groupedOptions={filteredGroups}
				open={open && !hideCombobox}
				loading={searching}
				{hideNoResults}
				{loadingText}
			/>
		</div>
	</div>
	{#if showError && errorText}
		<div class="text-error text-xs">{errorText}</div>
	{/if}
</div>

<style>
	.select-container {
		position: relative;
	}

	.select {
		font-size: var(--pui-font-size-md);
		line-height: var(--pui-line-height-normal);
		position: relative;
		display: flex;
		flex-wrap: wrap;
		padding: var(--pui-spacing-1) var(--pui-spacing-2);
		border-radius: var(--pui-radius-base);
		text-align: left;
		background-color: var(--pui-input-bg);
		color: var(--pui-text-primary);
		border-color: var(--pui-border-default);
		cursor: pointer;
		width: 100%;
		align-items: center;
		border: 1px solid var(--pui-border-default);
		padding-right: var(--pui-spacing-8);
	}

	.select:focus {
		border-color: var(--pui-accent-color);
		outline: 2px solid transparent;
		outline-offset: var(--pui-focus-ring-offset);
	}

	.select-icon {
		position: absolute;
		right: var(--pui-spacing-2);
		width: var(--pui-spacing-4);
		display: flex;
	}

	.btn-clear-container {
		position: absolute;
		line-height: 0;
		right: var(--pui-spacing-1);
	}

	.select-btn-clear {
		border-radius: var(--pui-radius-base);
		padding: var(--pui-spacing-1);
	}

	.select-panel {
		position: absolute;
		width: 100%;
		left: 0;
		z-index: var(--pui-z-dropdown);
	}

	.select-panel-inner {
		position: relative;
		width: 100%;
	}

	.placeholder {
		color: var(--pui-text-placeholder);
	}

	.hidden {
		display: none;
	}

	.disabled {
		opacity: 0.5;
		cursor: not-allowed;
		background-color: var(--pui-bg-disabled);
	}

	.selected-items {
		display: flex;
		flex-wrap: wrap;
		gap: var(--pui-spacing-1);
	}

	.loader {
		position: absolute;
		right: var(--pui-spacing-2_5);
		width: var(--pui-spacing-4);
		top: 6px;
	}

	.show-error {
		border-color: var(--pui-text-danger);
	}

	.text-error {
		color: var(--pui-text-danger);
	}
</style>
