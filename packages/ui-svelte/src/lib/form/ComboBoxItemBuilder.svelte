<script lang="ts">
	import type { ComboBoxItem } from '../models/ComboBoxItem.js';
	import ActionIcon from '../ui/ActionIcon.svelte';
	import Button from '../ui/Button.svelte';
	import Checkbox from './Checkbox.svelte';
	import { iconPlus, iconTrash } from '../icon/index.js';
	import FormGroup from './FormGroup.svelte';

	interface Props {
		label?: string;
		items?: ComboBoxItem[];
		defaultValues?: string[];
		labelPlaceholder?: string;
		valuePlaceholder?: string;
		class?: string;
		onchange?: (items: ComboBoxItem[], defaultValues: string[]) => void;
	}

	let {
		label = '',
		items = $bindable([]),
		defaultValues = $bindable([]),
		labelPlaceholder = 'Label',
		valuePlaceholder = 'Value',
		class: classes = '',
		onchange
	}: Props = $props();

	let newLabel = $state('');
	let newValue = $state('');
	let valueManuallyEdited = $state(false);
	let labelInputEl: HTMLInputElement | undefined = $state(undefined);

	// Copy label exactly for default value
	function labelToValue(label: string): string {
		return label.trim();
	}

	// Handle label input - auto-sync to value if not manually edited
	function handleLabelInput(value: string) {
		newLabel = value;
		if (!valueManuallyEdited) {
			newValue = labelToValue(value);
		}
	}

	// Handle value input - mark as manually edited
	function handleValueInput(value: string) {
		newValue = value;
		if (value !== labelToValue(newLabel)) {
			valueManuallyEdited = true;
		}
	}

	// Check if a value already exists (excluding a specific index for editing)
	function valueExists(value: string, excludeIndex?: number): boolean {
		return items.some((item, i) =>
			item.value === value && i !== excludeIndex
		);
	}

	// Check if a label already exists (excluding a specific index for editing)
	function labelExists(label: string, excludeIndex?: number): boolean {
		return items.some((item, i) =>
			item.label === label && i !== excludeIndex
		);
	}

	// Check if new value/label would be a duplicate
	let isDuplicateNewValue = $derived(
		newValue.trim() !== '' && valueExists(newValue.trim())
	);

	let isDuplicateNewLabel = $derived(
		newLabel.trim() !== '' && labelExists(newLabel.trim())
	);

	function addItem() {
		if (!newLabel.trim() || !newValue.trim()) return;
		if (isDuplicateNewValue || isDuplicateNewLabel) return;

		const newItem: ComboBoxItem = {
			label: newLabel.trim(),
			value: newValue.trim()
		};

		items = [...items, newItem];
		newLabel = '';
		newValue = '';
		valueManuallyEdited = false;

		notifyChange();

		// Focus back on label input for quick entry of next item
		labelInputEl?.focus();
	}

	function removeItem(index: number) {
		const removedItem = items[index];
		items = items.filter((_, i) => i !== index);

		// Remove from defaults if it was selected
		if (defaultValues.includes(removedItem.value)) {
			defaultValues = defaultValues.filter(v => v !== removedItem.value);
		}

		notifyChange();
	}

	function toggleDefault(value: string, checked: boolean) {
		if (checked) {
			defaultValues = [...defaultValues, value];
		} else {
			defaultValues = defaultValues.filter(v => v !== value);
		}
		notifyChange();
	}

	function updateItemLabel(index: number, label: string) {
		// Don't allow duplicate labels
		if (labelExists(label, index)) return;

		const currentItem = items[index];

		// Check if label and value were in sync (exact case-sensitive match)
		const wasInSync = currentItem.label === currentItem.value;

		// If they were in sync, also update the value to maintain exact match (if it wouldn't create a duplicate)
		if (wasInSync && !valueExists(label, index)) {
			const oldValue = currentItem.value;
			items = items.map((item, i) =>
				i === index ? { ...item, label, value: label } : item
			);

			// Update defaults if the value was changed
			if (defaultValues.includes(oldValue)) {
				defaultValues = defaultValues.map(v => v === oldValue ? label : v);
			}
		} else {
			items = items.map((item, i) =>
				i === index ? { ...item, label } : item
			);
		}

		notifyChange();
	}

	function updateItemValue(index: number, newVal: string) {
		// Don't allow duplicate values
		if (valueExists(newVal, index)) return;

		const oldValue = items[index].value;
		items = items.map((item, i) =>
			i === index ? { ...item, value: newVal } : item
		);

		// Update defaults if the value was changed
		if (defaultValues.includes(oldValue)) {
			defaultValues = defaultValues.map(v => v === oldValue ? newVal : v);
		}

		notifyChange();
	}

	function notifyChange() {
		onchange?.(items, defaultValues);
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			e.preventDefault();
			addItem();
		}
	}

	// Computed output for display/copying
	let outputItems = $derived(
		items.map(item => ({
			...item,
			selected: defaultValues.includes(item.value)
		}))
	);

	// Get labels for selected defaults
	let defaultLabels = $derived(
		defaultValues
			.map(v => items.find(i => i.value === v)?.label ?? v)
			.join(', ')
	);
</script>

<div class="combobox-builder {classes}">
	{#if label}
		<FormGroup {label}>
			<div></div>
		</FormGroup>
	{/if}

	<div class="builder-content">
		<!-- Header row -->
		<div class="header-row">
			<div class="col-default">Selected</div>
			<div class="col-label">Label</div>
			<div class="col-value">Value</div>
			<div class="col-actions"></div>
		</div>

		<!-- Existing items -->
		{#each items as item, index (index)}
			<div class="item-row">
				<div class="col-default">
					<Checkbox
						checked={defaultValues.includes(item.value)}
						onchange={(checked) => toggleDefault(item.value, checked)}
					/>
				</div>
				<div class="col-label">
					<input
						type="text"
						class="item-input"
						value={item.label}
						oninput={(e) => updateItemLabel(index, e.currentTarget.value)}
						placeholder={labelPlaceholder}
					/>
				</div>
				<div class="col-value">
					<input
						type="text"
						class="item-input"
						value={item.value}
						oninput={(e) => updateItemValue(index, e.currentTarget.value)}
						placeholder={valuePlaceholder}
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
			<div class="col-default"></div>
			<div class="col-label">
				<input
					bind:this={labelInputEl}
					type="text"
					class="item-input new-input"
					class:error={isDuplicateNewLabel}
					value={newLabel}
					oninput={(e) => handleLabelInput(e.currentTarget.value)}
					placeholder={labelPlaceholder}
					onkeydown={handleKeyDown}
				/>
			</div>
			<div class="col-value">
				<input
					type="text"
					class="item-input new-input"
					class:error={isDuplicateNewValue}
					value={newValue}
					oninput={(e) => handleValueInput(e.currentTarget.value)}
					placeholder={valuePlaceholder}
					onkeydown={handleKeyDown}
				/>
			</div>
			<div class="col-actions">
				<ActionIcon
					variant="auto-subtle"
					svg={iconPlus}
					size="1rem"
					onclick={addItem}
					disabled={!newLabel.trim() || !newValue.trim() || isDuplicateNewValue || isDuplicateNewLabel}
					tooltip="Add item"
				/>
			</div>
		</div>

		{#if isDuplicateNewLabel || isDuplicateNewValue}
			<div class="error-message">
				{#if isDuplicateNewLabel && isDuplicateNewValue}
					Label "{newLabel}" and value "{newValue}" already exist
				{:else if isDuplicateNewLabel}
					Label "{newLabel}" already exists
				{:else}
					Value "{newValue}" already exists
				{/if}
			</div>
		{/if}

		<!-- Quick add button for mobile/convenience -->
		{#if newLabel.trim() && newValue.trim() && !isDuplicateNewValue && !isDuplicateNewLabel}
			<div class="quick-add">
				<Button variant="auto-subtle" onclick={addItem}>
					Add "{newLabel}"
				</Button>
			</div>
		{/if}
	</div>

	<!-- Summary -->
	{#if items.length > 0}
		<div class="summary">
			<span class="summary-count">{items.length} item{items.length !== 1 ? 's' : ''}</span>
			{#if defaultValues.length > 0}
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
		border: 1px solid var(--pui-border-default);
		border-radius: var(--pui-radius-md);
		overflow: hidden;
	}

	.header-row {
		display: grid;
		grid-template-columns: 3.5rem 1fr 1fr 2.5rem;
		gap: var(--pui-spacing-2);
		padding: var(--pui-spacing-2) var(--pui-spacing-3);
		background-color: var(--pui-input-bg);
		border-bottom: 1px solid var(--pui-border-default);
		font-size: var(--pui-font-size-xs);
		font-weight: var(--pui-font-weight-semibold);
		color: var(--pui-text-muted);
		text-transform: uppercase;
		letter-spacing: 0.025em;
	}

	.item-row,
	.add-row {
		display: grid;
		grid-template-columns: 3.5rem 1fr 1fr 2.5rem;
		gap: var(--pui-spacing-2);
		padding: var(--pui-spacing-2) var(--pui-spacing-3);
		align-items: center;
		border-bottom: 1px solid var(--pui-border-default);
	}

	.item-row:last-of-type {
		border-bottom: 1px solid var(--pui-border-default);
	}

	.add-row {
		background-color: var(--pui-bg-subtle);
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
		padding: var(--pui-spacing-1_5) var(--pui-spacing-2);
		border: 1px solid var(--pui-border-default);
		border-radius: var(--pui-radius-sm);
		background-color: var(--pui-input-bg);
		color: var(--pui-text-primary);
		font-size: var(--pui-font-size-sm);
		transition: border-color var(--pui-transition-fast) var(--pui-ease-in-out);
	}

	.item-input:focus {
		outline: none;
		border-color: var(--pui-input-border-focus);
	}

	.item-input::placeholder {
		color: var(--pui-text-placeholder);
	}

	.new-input {
		background-color: transparent;
	}

	.item-input.error {
		border-color: var(--pui-text-danger);
	}

	.item-input.error:focus {
		border-color: var(--pui-text-danger);
	}

	.error-message {
		padding: var(--pui-spacing-1_5) var(--pui-spacing-3);
		font-size: var(--pui-font-size-xs);
		color: var(--pui-text-danger);
		background-color: var(--pui-bg-subtle);
	}

	.quick-add {
		padding: var(--pui-spacing-2) var(--pui-spacing-3);
		background-color: var(--pui-bg-subtle);
		display: flex;
		justify-content: flex-end;
	}

	.summary {
		display: flex;
		gap: var(--pui-spacing-4);
		padding: var(--pui-spacing-2) 0;
		font-size: var(--pui-font-size-sm);
		color: var(--pui-text-muted);
		margin-top: var(--pui-spacing-2);
	}

	.summary-count {
		font-weight: var(--pui-font-weight-medium);
	}

	.summary-default {
		color: var(--pui-accent-color);
	}

	:global(.dark) .add-row,
	:global(.dark) .quick-add,
	:global(.dark) .error-message {
		background-color: var(--pui-bg-subtle);
	}

	/* Responsive adjustments */
	@media (max-width: 480px) {
		.header-row,
		.item-row,
		.add-row {
			grid-template-columns: 2.5rem 1fr 1fr 2rem;
			gap: var(--pui-spacing-1);
			padding: var(--pui-spacing-1_5) var(--pui-spacing-2);
		}

		.item-input {
			padding: var(--pui-spacing-1) var(--pui-spacing-1_5);
			font-size: var(--pui-font-size-sm);
		}
	}
</style>
