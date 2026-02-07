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
	import { iconX, iconCopy } from "../icon/index.js";
	import ActionIcon from "../ui/ActionIcon.svelte";
	import { onMount, tick, type Snippet } from "svelte";

	interface Props {
		label?: string;
		value?: string;
		rawValue?: ComboBoxItem;
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
		loadingText?: string;
		options?: ComboBoxItem[];
		groupedOptions?: ComboBoxGroup[];
		tooltipLocation?: "top" | "bottom" | "left" | "right";
		fetchFunction?: FetchFunctionType | null;
		searchFunction?: SearchFunctionType | null;
		retrieveLabelFunction?: RetrieveLabelFunctionType | null;
		tooltipContent?: Snippet;
		tooltipText?: string;
		onchange?: (e: string | undefined) => void;
		onchangeRaw?: (e: ComboBoxItem | undefined) => void;
	}

	let {
		label = "",
		value = $bindable(undefined),
		rawValue = undefined,
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

	// Use derived for computed allowSearch
	let computedAllowSearch = $derived(searchFunction ? true : allowSearch);

	let internalValue = $state(value);
	let filterString = $state("");
	let preloading = $state(false);
	let searching = $state(false);
	let timeout: number;

	let allGroups: ComboBoxGroup[] = $state([]);
	let filteredGroups: ComboBoxGroup[] = $state([]);

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
		},
	});

	function focus() {
		open = true;
		tick().then(() => textboxElement?.focus());
	}

	$effect(() => {
		if (value !== internalValue) {
			internalValue = value;
			rawValue =
				allGroups
					.flatMap((x) => x.items)
					.find((x) => x.value === value) ?? undefined;
			isEmpty = rawValue === undefined;
			onchangeRaw?.(rawValue);
			preloadValues();
		}
	});

	function preloadValues() {
		if (!value) {
			rawValue = undefined;
			return;
		}

		const foundOption = allGroups
			.flatMap((x) => x.items)
			.find((x) => x.value === value);

		if (foundOption !== undefined) {
			rawValue = foundOption;
		} else if (searchFunction && retrieveLabelFunction) {
			preloading = true;
			retrieveLabelFunction(value).then((response) => {
				rawValue = {
					label: response.object ?? value!.toString(),
					value: value!,
				};

				preloading = false;
			});
		} else {
			rawValue = { label: value.toString(), value };
		}
	}

	function initOptions(opts: ComboBoxItem[]) {
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
			} else if (opts.length) {
				convertOptions(opts);
			} else {
				filteredGroups = [];
			}
			preloadValues();
		}
	}

	onMount(() => {
		initOptions(options);
	});

	function convertOptions(options: ComboBoxItem[]) {
		const allOptions = options.map((option) => {
			return {
				...option,
				selected: value === option.value,
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
						selected: value === option.value,
						groupName: group.label,
					};
				}),
			};
		});
		filteredGroups = [...allGroups];
	}

	function onSelection(selectedValue: ComboBoxItem) {
		options.forEach((option) => {
			if (option.value === selectedValue.value)
				option.selected = selectedValue.selected;
		});

		value = selectedValue.value;
		rawValue = selectedValue;

		onchange?.(value ? value : "");
		onchangeRaw?.(rawValue);

		open = false;
	}

	function onFilterChange(value: string) {
		if (value.length === 0) {
			filteredGroups = allGroups;
			return;
		}
		if (searchFunction && value) {
			clearTimeout(timeout);
			searching = true;
			timeout = window.setTimeout(() => {
				searchFunction(value).then(
					(response: NotifyModel<ComboBoxItem[]>) => {
						convertOptions(response.object!);
						searching = false;
						open = true;
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
		}
	}

	let comboBoxEl: ReturnType<typeof ComboBoxMulti> | undefined =
		$state(undefined);
	let textboxElement: HTMLElement | undefined = $state(undefined);
	let buttonElement: HTMLElement | undefined = $state(undefined);
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
		if (buttonElement && buttonElement.contains(e.target as HTMLElement))
			return;

		open = false;
	}

	function copyCurrentValue() {
		if (rawValue?.label) {
			navigator.clipboard.writeText(rawValue.label).catch((err) => {
				console.error("Failed to copy text: ", err);
			});
		}
	}

	const extraClasses: string[] = $derived.by(() => {
		const classes = [];
		if (open) classes.push("!border-accent");
		if (disabled) classes.push("disabled");
		if (showError) classes.push("show-error");
		if (computedAllowSearch) classes.push("searchable");
		if (open && !isEmpty) classes.push("has-actions");

		return classes;
	});
</script>

<div class="select-container {containerClass}">
	<FormGroup
		{label}
		{required}
		{tooltipContent}
		{tooltipText}
		{tooltipLocation}
	>
		{#if computedAllowSearch && open}
			<div class="select-input-wrapper">
				<input
					bind:this={textboxElement}
					bind:value={filterString}
					oninput={() => onFilterChange(filterString)}
					onkeydown={onKeyDown}
					autocomplete="off"
					disabled={preloading || disabled}
					placeholder={isEmpty ? placeholder : rawValue?.label || ""}
					class="select select-input {extraClasses} {classes}"
				/>
				{#if preloading || searching}
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
								value = undefined;
								rawValue = undefined;
								filterString = "";
								filteredGroups = allGroups;

								onchange?.(undefined);
								onchangeRaw?.(undefined);

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
				disabled={preloading || disabled}
				class="select {extraClasses} {classes}"
			>
				{#if isEmpty}
					<span class="placeholder"
						>{preloading ? "Loading..." : placeholder}</span
					>
				{:else if rawValue?.selectedComponent}
					{@const DisplayComponent = rawValue.selectedComponent}
					<DisplayComponent
						option={rawValue}
						{...rawValue.selectedComponentProps}
					/>
				{:else}
					<span>
						{rawValue?.label}
					</span>
				{/if}
				{#if preloading || searching}
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
								value = undefined;
								rawValue = undefined;

								onchange?.(undefined);
								onchangeRaw?.(undefined);

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
		{/if}
	</FormGroup>
	<div
		class="select-panel
			{isEmpty ? 'bottom-0' : 'top-full'}
			{open ? '' : 'hidden'}"
	>
		<div class="select-panel-inner" use:clickOutside={closePopover}>
			<ComboBoxMulti
				bind:this={comboBoxEl}
				{filterString}
				values={rawValue ? [rawValue] : []}
				{onSelection}
				onkeydown={comboBoxKeyDown}
				groupedOptions={filteredGroups}
				{open}
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

	.select.has-actions {
		padding-right: var(--pui-spacing-14);
	}

	.select.searchable {
		cursor: text;
	}

	.select:focus {
		border-color: var(--pui-input-border-focus);
		outline: 2px solid transparent;
		outline-offset: var(--pui-focus-ring-offset);
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
		right: var(--pui-spacing-2);
		top: 50%;
		transform: translateY(-50%);
		width: var(--pui-spacing-4);
		display: flex;
		pointer-events: none;
	}

	.btn-clear-container {
		position: absolute;
		line-height: 0;
		right: var(--pui-spacing-2);
		top: 50%;
		transform: translateY(-50%);
		display: flex;
		gap: var(--pui-spacing-1);
	}

	.select-btn-clear {
		border-radius: var(--pui-radius-base);
		padding: var(--pui-spacing-1);
		right: 0.4rem;
	}

	.select-panel {
		position: absolute;
		width: 100%;
		left: 0;
		z-index: var(--pui-z-dropdown);
		border-top-left-radius: 0;
		border-top-right-radius: 0;
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

	.loader {
		position: absolute;
		right: var(--pui-spacing-2_5);
		top: 50%;
		transform: translateY(-50%);
		width: var(--pui-spacing-4);
	}

	.show-error {
		border-color: var(--pui-text-danger);
	}

	.text-error {
		color: var(--pui-text-danger);
	}
</style>
