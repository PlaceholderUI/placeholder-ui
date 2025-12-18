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
		border: 1px solid var(--border-color);
		border-radius: 0.375rem;
		overflow: hidden;
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
		background-color: rgba(var(--midnight-rgbc), 0.02);
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

	.item-input.error {
		border-color: var(--danger-text);
	}

	.item-input.error:focus {
		border-color: var(--danger-text);
	}

	.error-message {
		padding: 0.375rem 0.75rem;
		font-size: 0.75rem;
		color: var(--danger-text);
		background-color: rgba(var(--midnight-rgbc), 0.02);
	}

	.quick-add {
		padding: 0.5rem 0.75rem;
		background-color: rgba(var(--midnight-rgbc), 0.02);
		display: flex;
		justify-content: flex-end;
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

	:global(.dark) .add-row,
	:global(.dark) .quick-add {
		background-color: rgba(var(--pistachio-rgbc), 0.02);
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

		.item-input {
			padding: 0.25rem 0.375rem;
			font-size: 0.8125rem;
		}
	}
</style>
