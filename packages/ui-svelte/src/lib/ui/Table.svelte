<script lang="ts">
	import { type Snippet } from 'svelte';
	import Textbox from '../form/Textbox.svelte';
	import Checkbox from '../form/Checkbox.svelte';
	import Icon from '../icon/Icon.svelte';
	import { iconArrowsSort, iconChevronDown, iconChevronUp, iconSearch } from '../icon/index.js';

	export interface Column<T = any> {
		key: string;
		label: string;
		sortable?: boolean;
		width?: string;
		align?: 'left' | 'center' | 'right';
		render?: (value: any, row: T) => any;
	}

	interface Props<T = any> {
		/** Column definitions for the table */
		columns: Column<T>[];
		/** Data rows to display */
		rows: T[];
		/** Enable search/filter functionality */
		searchable?: boolean;
		/** Placeholder text for search input */
		searchPlaceholder?: string;
		/** Additional CSS classes */
		class?: string;
		/** Enable alternating row colors */
		striped?: boolean;
		/** Disable rounded corners on table container */
		notRounded?: boolean;
		/** Enable hover effect on rows */
		hover?: boolean;
		/** Message shown when no data is available */
		emptyMessage?: string;
		/** Show loading state */
		loading?: boolean;
		/** Content to render below the table */
		children?: Snippet;
		/** Action buttons snippet, receives row data and index */
		buttons?: Snippet<[T, number]>;
		/** Callback when a row is clicked */
		onrowclick?: (row: T, index: number) => void;
		/** Enable checkbox selection */
		selectable?: boolean;
		/** Field name used to uniquely identify rows (required when selectable is true) */
		rowKey?: string;
		/** Currently selected row objects (bindable) */
		selectedRows?: T[];
		/** Callback when selection changes */
		onselect?: (selectedRows: T[]) => void;
	}

	let {
		columns = [],
		rows = [],
		searchable = false,
		searchPlaceholder = 'Search...',
		class: tableClass = '',
		striped = false,
		notRounded = false,
		hover = true,
		emptyMessage = 'No data available',
		loading = false,
		children,
		buttons,
		onrowclick,
		selectable = false,
		rowKey = undefined,
		selectedRows = $bindable([]),
		onselect = undefined
	}: Props = $props();

	let searchQuery = $state('');
	let sortColumn = $state<string | null>(null);
	let sortDirection = $state<'asc' | 'desc'>('asc');

	let _selectionWarned = false;
	$effect(() => { if (selectable && !rowKey && !_selectionWarned) { _selectionWarned = true; console.warn('Table: rowKey is required when selectable is true'); } });

	// Prune selectedRows when rows change to remove entries no longer present
	$effect(() => {
		if (!selectable || !rowKey || selectedRows.length === 0) return;
		const validKeys = new Set(rows.map(r => getValue(r, rowKey)));
		const pruned = selectedRows.filter(r => validKeys.has(getValue(r, rowKey)));
		if (pruned.length !== selectedRows.length) {
			selectedRows = pruned;
			onselect?.(selectedRows);
		}
	});

	// Set of selected row keys for O(1) lookup
	const selectedKeys = $derived.by(() => {
		if (!selectable || !rowKey) return new Set<any>();
		return new Set(selectedRows.map(r => getValue(r, rowKey)));
	});

	function isRowSelected(row: any): boolean {
		if (!selectable || !rowKey) return false;
		return selectedKeys.has(getValue(row, rowKey));
	}

	function toggleRow(row: any) {
		if (!selectable || !rowKey) return;

		const key = getValue(row, rowKey);
		if (selectedKeys.has(key)) {
			selectedRows = selectedRows.filter(r => getValue(r, rowKey) !== key);
		} else {
			selectedRows = [...selectedRows, row];
		}
		onselect?.(selectedRows);
	}

	function toggleAll() {
		if (!selectable || !rowKey) return;

		const allSelected = filteredRows.length > 0 && filteredRows.every(row => selectedKeys.has(getValue(row, rowKey!)));

		if (allSelected) {
			// Deselect all filtered rows, preserve off-screen selections
			const filteredKeys = new Set(filteredRows.map(r => getValue(r, rowKey!)));
			selectedRows = selectedRows.filter(r => !filteredKeys.has(getValue(r, rowKey!)));
		} else {
			// Select all filtered rows, merge with existing
			const existingKeys = new Set(selectedRows.map(r => getValue(r, rowKey!)));
			const newSelections = filteredRows.filter(r => !existingKeys.has(getValue(r, rowKey!)));
			selectedRows = [...selectedRows, ...newSelections];
		}
		onselect?.(selectedRows);
	}

	const isAllSelected = $derived.by(() => {
		if (!selectable || !rowKey || filteredRows.length === 0) return false;
		return filteredRows.every(row => selectedKeys.has(getValue(row, rowKey)));
	});

	const isSomeSelected = $derived.by(() => {
		if (!selectable || !rowKey || filteredRows.length === 0) return false;
		const selectedCount = filteredRows.filter(row => selectedKeys.has(getValue(row, rowKey))).length;
		return selectedCount > 0 && selectedCount < filteredRows.length;
	});

	function handleSort(column: Column) {
		if (!column.sortable) return;

		if (sortColumn === column.key) {
			sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
		} else {
			sortColumn = column.key;
			sortDirection = 'asc';
		}
	}

	function getValue(row: any, key: string): any {
		const keys = key.split('.');
		let value = row;
		for (const k of keys) {
			value = value?.[k];
		}
		return value;
	}

	const filteredRows = $derived.by(() => {
		let filtered = [...rows];

		// Apply search filter
		if (searchable && searchQuery) {
			filtered = filtered.filter(row => {
				return columns.some(column => {
					const value = getValue(row, column.key);
					if (value === null || value === undefined) return false;
					return String(value).toLowerCase().includes(searchQuery.toLowerCase());
				});
			});
		}

		// Apply sorting
		if (sortColumn) {
			filtered.sort((a, b) => {
				const aValue = getValue(a, sortColumn!);
				const bValue = getValue(b, sortColumn!);

				if (aValue === null || aValue === undefined) return 1;
				if (bValue === null || bValue === undefined) return -1;

				let comparison = 0;
				if (typeof aValue === 'number' && typeof bValue === 'number') {
					comparison = aValue - bValue;
				} else {
					comparison = String(aValue).localeCompare(String(bValue));
				}

				return sortDirection === 'asc' ? comparison : -comparison;
			});
		}

		return filtered;
	});

	const getSortIcon = (column: Column) => {
		if (!column.sortable) return '';
		if (sortColumn !== column.key) return iconArrowsSort;
		return sortDirection === 'asc' ? iconChevronUp : iconChevronDown;
	};

	const tableClasses = $derived(
		`pui-table ${tableClass} ${striped ? 'striped' : ''} ${hover ? 'hover' : ''}`
	);
</script>

<div class="table-container">
	{#if searchable}
		<div class="table-search">
			<Textbox
				placeholder={searchPlaceholder}
				bind:value={searchQuery}
				leftIconSvg={iconSearch}
				class="search-input"
			/>
		</div>
	{/if}

	<div class="table-wrapper {notRounded ? '' : 'rounded'}">
		<table class={tableClasses}>
			<thead>
				<tr>
					{#if selectable && rowKey}
						<th class="table-header checkbox-cell" style="width: 40px">
							<Checkbox
								controlled
								checked={isAllSelected}
								onchange={() => toggleAll()}
							/>
						</th>
					{/if}
					{#each columns as column}
						<th
							class="table-header {column.sortable ? 'sortable' : ''} {column.align || 'left'}"
							style={column.width ? `width: ${column.width}` : ''}
							onclick={() => handleSort(column)}
						>
							<div class="header-content">
								<span>{column.label}</span>
								{#if column.sortable}
									<div class="sort-icon">
										<Icon
											svg={getSortIcon(column)}
											size="14px"
										/>
									</div>
								{/if}
							</div>
						</th>
					{/each}
					{#if buttons}
						<th class="table-header center">Actions</th>
					{/if}
				</tr>
			</thead>
			<tbody>
				{#if loading}
					<tr>
						<td colspan={columns.length + (selectable && rowKey ? 1 : 0) + (buttons ? 1 : 0)} class="loading-cell">
							<div class="loading-content">Loading...</div>
						</td>
					</tr>
				{:else if filteredRows.length === 0}
					<tr>
						<td colspan={columns.length + (selectable && rowKey ? 1 : 0) + (buttons ? 1 : 0)} class="empty-cell">
							<div class="empty-content">{emptyMessage}</div>
						</td>
					</tr>
				{:else}
					{#each filteredRows as row, index}
						<tr
							class="{onrowclick || selectable ? 'clickable-row' : ''} {selectable && isRowSelected(row) ? 'selected' : ''}"
							onclick={() => {
								if (selectable) toggleRow(row);
								onrowclick?.(row, index);
							}}
						>
							{#if selectable && rowKey}
								<td class="table-cell checkbox-cell" onclick={(e) => e.stopPropagation()}>
									<Checkbox
										controlled
										checked={isRowSelected(row)}
										onchange={() => toggleRow(row)}
									/>
								</td>
							{/if}
							{#each columns as column}
								{@const value = getValue(row, column.key)}
								<td class="table-cell {column.align || 'left'}">
									{#if column.render}
										{@html column.render(value, row)}
									{:else if typeof value === 'function'}
										{@render value()}
									{:else}
										{value ?? ''}
									{/if}
								</td>
							{/each}
							{#if buttons}
								<td class="table-cell center">
									{@render buttons(row, index)}
								</td>
							{/if}
						</tr>
					{/each}
				{/if}
			</tbody>
		</table>
	</div>

	{@render children?.()}
</div>

<style>
	.table-container {
		width: 100%;
	}

	.table-search {
		margin-bottom: var(--pui-spacing-4);
		max-width: 400px;
	}

	.table-wrapper {
		width: 100%;
		overflow-x: auto;
		border: 1px solid var(--pui-border-default);
		background-color: var(--pui-input-bg);
	}

	.table-wrapper.rounded {
		border-radius: var(--pui-radius-lg);
	}

	.pui-table {
		width: 100%;
		border-collapse: collapse;
		font-size: var(--pui-font-size-base);
	}

	.table-header {
		padding: var(--pui-spacing-2);
		text-align: left;
		font-weight: var(--pui-font-weight-semibold);
		color: var(--pui-text-primary);
		background-color: var(--pui-bg-surface-raised);
		border-bottom: 2px solid var(--pui-border-default);
		user-select: none;
		white-space: nowrap;
	}

	.table-header.sortable {
		cursor: pointer;
		transition: background-color var(--pui-transition-fast) var(--pui-ease-out);
	}

	.table-header.sortable:hover {
		background-color: var(--pui-bg-hover);
	}

	.table-header.center {
		text-align: center;
	}

	.table-header.right {
		text-align: right;
	}

	.header-content {
		display: flex;
		align-items: center;
		gap: var(--pui-spacing-2);
		justify-content: space-between;
	}

	.sort-icon {
		display: inline-flex;
		align-items: center;
		opacity: 0.5;
		transition: opacity var(--pui-transition-fast) var(--pui-ease-out);
	}

	.table-header.sortable:hover .sort-icon {
		opacity: 1;
	}

	.table-cell {
		padding: var(--pui-spacing-2);
		text-align: left;
		color: var(--pui-text-primary);
		border-bottom: 1px solid var(--pui-border-default);
	}

	.table-cell.center {
		text-align: center;
	}

	.table-cell.right {
		text-align: right;
	}

	.checkbox-cell {
		width: 40px;
		text-align: center;
		padding: var(--pui-spacing-1);
	}

	.checkbox-cell :global(.checkbox-container) {
		display: inline-flex;
		justify-content: center;
	}

	.checkbox-cell :global(input) {
		margin: 2px;
	}

	.pui-table.striped tbody tr:nth-child(even) {
		background-color: var(--pui-bg-hover);
	}

	.pui-table.hover tbody tr:hover {
		background-color: var(--pui-bg-hover);
		transition: background-color var(--pui-transition-fast) var(--pui-ease-out);
	}

	.pui-table tbody tr.selected,
	.pui-table.striped tbody tr.selected:nth-child(even) {
		background-color: var(--pui-bg-active);
	}

	.pui-table tbody tr.selected:hover,
	.pui-table.hover tbody tr.selected:hover {
		background-color: var(--pui-bg-active);
	}

	.clickable-row {
		cursor: pointer;
	}

	.clickable-row:hover {
		background-color: var(--pui-bg-hover);
		transition: background-color var(--pui-transition-fast) var(--pui-ease-out);
	}

	tbody tr:last-child td {
		border-bottom: none;
	}

	.empty-cell,
	.loading-cell {
		padding: var(--pui-spacing-8);
		text-align: center;
		color: var(--pui-text-muted);
		border-bottom: none;
	}

	.empty-content,
	.loading-content {
		font-style: italic;
	}

	/* Icon styles for sort indicators */
	:global(.pui-table .sort-icon svg) {
		width: 14px;
		height: 14px;
	}

	/* Responsive adjustments */
	@media (max-width: 640px) {
		.table-header,
		.table-cell {
			padding: var(--pui-spacing-2) var(--pui-spacing-3);
		}

		.pui-table {
			font-size: var(--pui-font-size-xs);
		}
	}
</style>
