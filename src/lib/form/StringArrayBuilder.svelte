<script module lang="ts">
	export interface StringArrayBuilderProps {
		/** Label text displayed above the builder */
		label?: string;
		/** Array of string values (bindable) */
		items?: string[];
		/** Placeholder for value input field */
		placeholder?: string;
		/** Additional CSS classes */
		class?: string;
		/** Callback when items change */
		onchange?: (items: string[]) => void;
	}
</script>

<script lang="ts">
	import ActionIcon from '$lib/ui/ActionIcon.svelte';
	import Button from '$lib/ui/Button.svelte';
	import { iconPlus, iconTrash } from '$lib/icon/index.js';
	import FormGroup from './FormGroup.svelte';

	let {
		label = '',
		items = $bindable([]),
		placeholder = 'Value',
		class: classes = '',
		onchange
	}: StringArrayBuilderProps = $props();

	let newValue = $state('');
	let valueInputEl: HTMLInputElement | undefined = $state(undefined);

	function valueExists(value: string, excludeIndex: number | undefined = undefined): boolean {
		return items.some((item, i) => item === value && i !== excludeIndex);
	}

	let isDuplicateNewValue = $derived(
		newValue.trim() !== '' && valueExists(newValue.trim())
	);

	function addItem() {
		const trimmed = newValue.trim();
		if (!trimmed) return;
		if (isDuplicateNewValue) return;

		items = [...items, trimmed];
		newValue = '';

		notifyChange();

		valueInputEl?.focus();
	}

	function removeItem(index: number) {
		items = items.filter((_, i) => i !== index);
		notifyChange();
	}

	function updateItem(index: number, newVal: string) {
		if (valueExists(newVal, index)) return;

		items = items.map((item, i) => (i === index ? newVal : item));
		notifyChange();
	}

	function notifyChange() {
		onchange?.(items);
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			e.preventDefault();
			addItem();
		}
	}
</script>

<div class="string-array-builder {classes}">
	{#if label}
		<FormGroup {label}>
			<div></div>
		</FormGroup>
	{/if}

	<div class="builder-content">
		<!-- Existing items -->
		{#each items as item, index (index)}
			<div class="item-row">
				<div class="col-value">
					<input
						type="text"
						class="item-input"
						value={item}
						oninput={(e) => updateItem(index, e.currentTarget.value)}
						{placeholder}
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
			<div class="col-value">
				<input
					bind:this={valueInputEl}
					type="text"
					class="item-input new-input"
					class:error={isDuplicateNewValue}
					value={newValue}
					oninput={(e) => (newValue = e.currentTarget.value)}
					{placeholder}
					onkeydown={handleKeyDown}
				/>
			</div>
			<div class="col-actions">
				<ActionIcon
					variant="auto-subtle"
					svg={iconPlus}
					size="1rem"
					onclick={addItem}
					disabled={!newValue.trim() || isDuplicateNewValue}
					tooltip="Add item"
				/>
			</div>
		</div>

		{#if isDuplicateNewValue}
			<div class="error-message">
				Value "{newValue}" already exists
			</div>
		{/if}

		<!-- Quick add button for mobile/convenience -->
		{#if newValue.trim() && !isDuplicateNewValue}
			<div class="quick-add">
				<Button variant="auto-subtle" onclick={addItem}>
					Add "{newValue}"
				</Button>
			</div>
		{/if}
	</div>

	<!-- Summary -->
	{#if items.length > 0}
		<div class="summary">
			<span class="summary-count">{items.length} item{items.length !== 1 ? 's' : ''}</span>
		</div>
	{/if}
</div>

<style>
	.string-array-builder {
		width: 100%;
	}

	.item-row,
	.add-row {
		display: grid;
		grid-template-columns: 1fr 2.5rem;
		gap: 0.5rem;
		padding: 0.25rem 0;
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
		padding: 0.375rem 0;
		font-size: 0.75rem;
		color: var(--danger-text);
	}

	.quick-add {
		padding: 0.5rem 0;
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

	@media (max-width: 480px) {
		.item-row,
		.add-row {
			grid-template-columns: 1fr 2rem;
			gap: 0.25rem;
		}

		.item-input {
			padding: 0.25rem 0.375rem;
			font-size: 0.8125rem;
		}
	}
</style>
