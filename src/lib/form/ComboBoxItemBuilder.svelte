<script module lang="ts">
	import type { ComboBoxItem } from '$lib/models/ComboBoxItem.js';

	export interface ComboBoxItemBuilderProps {
		/** Label text displayed above the builder */
		label?: string;
		/** Array of combo box items (bindable) */
		items?: ComboBoxItem[];
		/** Array of default selected values (bindable) */
		defaultValues?: string[];
		/** Header text for the label column */
		labelHeader?: string;
		/** Header text for the value column */
		valueHeader?: string;
		/** Placeholder for label input field (defaults to labelHeader) */
		labelPlaceholder?: string;
		/** Placeholder for value input field (defaults to valueHeader) */
		valuePlaceholder?: string;
		/** Hide the "Selected" column and skip default-value tracking */
		hideSelected?: boolean;
		/** Disable auto-copying the label into the value field */
		disableValueSync?: boolean;
		/** Allow multiple items to share the same value. Note: default-value tracking is keyed by value, so items sharing a value also share their selected state */
		allowDuplicateValues?: boolean;
		/** Additional CSS classes */
		class?: string;
		/** Callback when items or default values change */
		onchange?: (items: ComboBoxItem[], defaultValues: string[]) => void;
	}
</script>

<script lang="ts">
	import { tick } from 'svelte';
	import ActionIcon from '$lib/ui/ActionIcon.svelte';
	import Checkbox from './Checkbox.svelte';
	import { iconTrash } from '$lib/icon/index.js';
	import FormGroup from './FormGroup.svelte';

	let {
		label = '',
		items = $bindable([]),
		defaultValues = $bindable([]),
		labelHeader = 'Label',
		valueHeader = 'Value',
		labelPlaceholder = undefined,
		valuePlaceholder = undefined,
		hideSelected = false,
		disableValueSync = false,
		allowDuplicateValues = false,
		class: classes = '',
		onchange
	}: ComboBoxItemBuilderProps = $props();

	let effectiveLabelPlaceholder = $derived(labelPlaceholder ?? labelHeader);
	let effectiveValuePlaceholder = $derived(valuePlaceholder ?? valueHeader);

	let labelInputEl: HTMLInputElement | undefined = $state(undefined);
	let itemLabelInputs: HTMLInputElement[] = $state([]);
	let itemValueInputs: HTMLInputElement[] = $state([]);

	// Typing in the empty bottom row immediately creates a real item and moves focus into it
	async function handleNewInput(
		field: 'label' | 'value',
		e: Event & { currentTarget: EventTarget & HTMLInputElement }
	) {
		const text = e.currentTarget.value;
		e.currentTarget.value = '';
		if (!text) return;

		const newItem: ComboBoxItem =
			field === 'label'
				? { label: text, value: disableValueSync ? '' : text }
				: { label: '', value: text };

		items = [...items, newItem];
		notifyChange();

		await tick();
		const input =
			field === 'label' ? itemLabelInputs[items.length - 1] : itemValueInputs[items.length - 1];
		input?.focus();
		input?.setSelectionRange(text.length, text.length);
	}

	// Check if a value already exists (excluding a specific index for editing)
	function valueExists(value: string, excludeIndex: number | undefined = undefined): boolean {
		return items.some((item, i) => item.value === value && i !== excludeIndex);
	}

	// Check if a label already exists (excluding a specific index for editing)
	function labelExists(label: string, excludeIndex: number | undefined = undefined): boolean {
		return items.some((item, i) => item.label === label && i !== excludeIndex);
	}

	function removeItem(index: number) {
		const removedItem = items[index];
		items = items.filter((_, i) => i !== index);

		// Remove from defaults if it was selected and no remaining item shares the value
		if (
			defaultValues.includes(removedItem.value) &&
			!items.some((item) => item.value === removedItem.value)
		) {
			defaultValues = defaultValues.filter((v) => v !== removedItem.value);
		}

		notifyChange();
	}

	function toggleDefault(value: string, checked: boolean) {
		if (checked) {
			defaultValues = [...defaultValues, value];
		} else {
			defaultValues = defaultValues.filter((v) => v !== value);
		}
		notifyChange();
	}

	function updateItemLabel(index: number, label: string) {
		// Don't allow duplicate labels
		if (labelExists(label, index)) return;

		const currentItem = items[index];

		// Check if label and value were in sync (exact case-sensitive match)
		const wasInSync = !disableValueSync && currentItem.label === currentItem.value;

		// If they were in sync, also update the value to maintain exact match (if it wouldn't create a duplicate)
		if (wasInSync && (allowDuplicateValues || !valueExists(label, index))) {
			const oldValue = currentItem.value;
			items = items.map((item, i) => (i === index ? { ...item, label, value: label } : item));

			// Update defaults if the value was changed and no remaining item shares the old value
			if (defaultValues.includes(oldValue) && !items.some((item) => item.value === oldValue)) {
				defaultValues = defaultValues.map((v) => (v === oldValue ? label : v));
			}
		} else {
			items = items.map((item, i) => (i === index ? { ...item, label } : item));
		}

		notifyChange();
	}

	function updateItemValue(index: number, newVal: string) {
		// Don't allow duplicate values
		if (!allowDuplicateValues && valueExists(newVal, index)) return;

		const oldValue = items[index].value;
		items = items.map((item, i) => (i === index ? { ...item, value: newVal } : item));

		// Update defaults if the value was changed and no remaining item shares the old value
		if (defaultValues.includes(oldValue) && !items.some((item) => item.value === oldValue)) {
			defaultValues = defaultValues.map((v) => (v === oldValue ? newVal : v));
		}

		notifyChange();
	}

	function notifyChange() {
		onchange?.(items, defaultValues);
	}

	// Enter in an item row jumps back to the empty row for quick entry of the next item
	function handleItemKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			e.preventDefault();
			labelInputEl?.focus();
		}
	}

	// Computed output for display/copying
	let outputItems = $derived(
		items.map((item) => ({
			...item,
			selected: defaultValues.includes(item.value)
		}))
	);

	// Get labels for selected defaults
	let defaultLabels = $derived(
		defaultValues.map((v) => items.find((i) => i.value === v)?.label ?? v).join(', ')
	);
</script>

<div class="combobox-builder {classes}">
	{#if label}
		<FormGroup {label}>
			<div></div>
		</FormGroup>
	{/if}

	<div class="builder-content" class:no-selected={hideSelected}>
		<!-- Header row -->
		<div class="header-row">
			{#if !hideSelected}
				<div class="col-default">Selected</div>
			{/if}
			<div class="col-label">{labelHeader}</div>
			<div class="col-value">{valueHeader}</div>
			<div class="col-actions"></div>
		</div>

		<!-- Existing items -->
		{#each items as item, index (index)}
			<div class="item-row">
				{#if !hideSelected}
					<div class="col-default">
						<Checkbox
							checked={defaultValues.includes(item.value)}
							onchange={(checked) => toggleDefault(item.value, checked)}
						/>
					</div>
				{/if}
				<div class="col-label">
					<input
						bind:this={itemLabelInputs[index]}
						type="text"
						class="item-input"
						value={item.label}
						oninput={(e) => updateItemLabel(index, e.currentTarget.value)}
						onkeydown={handleItemKeyDown}
						placeholder={effectiveLabelPlaceholder}
					/>
				</div>
				<div class="col-value">
					<input
						bind:this={itemValueInputs[index]}
						type="text"
						class="item-input"
						value={item.value}
						oninput={(e) => updateItemValue(index, e.currentTarget.value)}
						onkeydown={handleItemKeyDown}
						placeholder={effectiveValuePlaceholder}
					/>
				</div>
				<div class="col-actions">
					<ActionIcon
						variant="danger-subtle"
						svg={iconTrash}
						size="1rem"
						onclick={() => removeItem(index)}
						tooltip="Remove item"
					/>
				</div>
			</div>
		{/each}

		<!-- Add new item row -->
		<div class="add-row">
			{#if !hideSelected}
				<div class="col-default"></div>
			{/if}
			<div class="col-label">
				<input
					bind:this={labelInputEl}
					type="text"
					class="item-input new-input"
					oninput={(e) => handleNewInput('label', e)}
					placeholder={effectiveLabelPlaceholder}
				/>
			</div>
			<div class="col-value">
				<input
					type="text"
					class="item-input new-input"
					oninput={(e) => handleNewInput('value', e)}
					placeholder={effectiveValuePlaceholder}
				/>
			</div>
			<div class="col-actions"></div>
		</div>
	</div>

	<!-- Summary -->
	{#if items.length > 0}
		<div class="summary">
			<span class="summary-count">{items.length} item{items.length !== 1 ? 's' : ''}</span>
			{#if !hideSelected && defaultValues.length > 0}
				<span class="summary-default">
					Selected: {defaultLabels}
				</span>
			{/if}
		</div>
	{/if}
</div>

<style>
	.combobox-builder {
		width: 100%;
	}

	.builder-content {
		border: 1px solid var(--border-color);
		border-radius: 0.375rem;
		overflow: hidden;
	}

	.no-selected .header-row,
	.no-selected .item-row,
	.no-selected .add-row {
		grid-template-columns: 1fr 1fr 2.5rem;
	}

	.header-row {
		display: grid;
		grid-template-columns: 3.5rem 1fr 1fr 2.5rem;
		gap: 0.5rem;
		padding: 0.5rem 0.75rem;
		background-color: var(--input-bg-color);
		border-bottom: 1px solid var(--border-color);
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--text-muted);
		text-transform: uppercase;
		letter-spacing: 0.025em;
	}

	.item-row,
	.add-row {
		display: grid;
		grid-template-columns: 3.5rem 1fr 1fr 2.5rem;
		gap: 0.5rem;
		padding: 0.5rem 0.75rem;
		align-items: center;
		border-bottom: 1px solid var(--border-color);
	}

	.item-row:last-of-type {
		border-bottom: 1px solid var(--border-color);
	}

	.add-row {
		background-color: rgba(var(--ui-primary-rgbc), 0.02);
		border-bottom: none;
	}

	.col-default {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.col-actions {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.item-input {
		width: 100%;
		padding: 0.375rem 0.5rem;
		border: 1px solid var(--border-color);
		border-radius: 0.25rem;
		background-color: var(--input-bg-color);
		color: var(--text-color);
		font-size: 0.875rem;
		transition: border-color 0.15s;
	}

	.item-input:focus {
		outline: none;
		border-color: var(--accent-color);
	}

	.item-input::placeholder {
		color: var(--placeholder-color);
	}

	.new-input {
		background-color: transparent;
	}

	.summary {
		display: flex;
		gap: 1rem;
		padding: 0.5rem 0;
		font-size: 0.875rem;
		color: var(--text-muted);
		margin-top: 0.5rem;
	}

	.summary-count {
		font-weight: 500;
	}

	.summary-default {
		color: var(--accent-color);
	}

	:global(.dark) .add-row {
		background-color: rgba(var(--ui-accent-rgbc), 0.02);
	}

	/* Responsive adjustments */
	@media (max-width: 480px) {
		.header-row,
		.item-row,
		.add-row {
			grid-template-columns: 2.5rem 1fr 1fr 2rem;
			gap: 0.25rem;
			padding: 0.375rem 0.5rem;
		}

		.no-selected .header-row,
		.no-selected .item-row,
		.no-selected .add-row {
			grid-template-columns: 1fr 1fr 2rem;
		}

		.item-input {
			padding: 0.25rem 0.375rem;
			font-size: 0.8125rem;
		}
	}
</style>
