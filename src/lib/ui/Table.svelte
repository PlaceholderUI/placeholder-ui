<script lang="ts">
	import { type Snippet } from 'svelte';
	import Textbox from '$lib/form/Textbox.svelte';
	import Checkbox from '$lib/form/Checkbox.svelte';
	import Icon from '$lib/icon/Icon.svelte';
	import Pagination from './Pagination.svelte';
	import {
		iconArrowsSort,
		iconChevronDown,
		iconChevronRight,
		iconChevronUp,
		iconSearch
	} from '$lib/icon/index.js';
	import { navigateTo } from '$lib/util/NavigateTo.js';

	export interface Column<T = any> {
		key: string;
		label: string;
		sortable?: boolean;
		width?: string;
		align?: 'left' | 'center' | 'right';
		/** Snippet rendered as the cell content. Takes precedence over `render`. */
		cell?: Snippet<[{ value: any; row: T; index: number }]>;
		/** @deprecated Returns raw HTML injected via {@html} — unsafe for untrusted
		 * data and cannot render components. Use `cell` instead. */
		render?: (value: any, row: T) => any;
	}

	export interface TableProps<T = any> {
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
		/** Returns a URL for a row. When provided, rows act as links: a plain click
		 * navigates client-side, while middle-click or ctrl/cmd/shift-click opens the
		 * URL in a new tab. Return a falsy value to make a row non-navigable. */
		rowHref?: (row: T, index: number) => string | undefined | null;
		/** Enable checkbox selection */
		selectable?: boolean;
		/** Field name used to uniquely identify rows (required when selectable is true) */
		rowKey?: string;
		/** Currently selected row objects (bindable) */
		selectedRows?: T[];
		/** Callback when selection changes */
		onselect?: (selectedRows: T[]) => void;
		/** Detail content rendered in a full-width row beneath an expanded row.
		 * Providing this enables row expansion: expandable rows toggle on row click
		 * or via their chevron button. Requires rowKey. */
		expandedContent?: Snippet<[T, number]>;
		/** Limits which rows can expand (e.g. only group rows). Default: all rows. */
		canExpand?: (row: T, index: number) => boolean;
		/** Keys (via rowKey) of currently expanded rows (bindable) */
		expandedKeys?: any[];
		/** Callback when a row is expanded or collapsed — trigger on-demand fetches here */
		onexpand?: (row: T, index: number, expanded: boolean) => void;
		/** Rows per page. Setting this enables built-in client-side pagination,
		 * applied after search filtering and sorting. */
		pageSize?: number;
		/** Current page number, 1-based (bindable) */
		page?: number;
		/** Callback when the current page changes */
		onpagechange?: (page: number) => void;
		/** Key of the column currently sorted by, or null for unsorted (bindable).
		 * Set it to render the sort indicator for a server-supplied sort order. */
		sortKey?: string | null;
		/** Current sort direction (bindable) */
		sortDirection?: 'asc' | 'desc';
		/** Callback when the user clicks a sortable header, after `sortKey` and
		 * `sortDirection` have been updated. Use it to request sorted data from a
		 * server. Paginated tables also reset to page 1 before this fires. */
		onsort?: (key: string, direction: 'asc' | 'desc') => void;
		/** Skip the built-in client-side sort and render `rows` in the order given.
		 * Use with `onsort` when the server returns pre-sorted rows. */
		manualSort?: boolean;
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
		rowHref = undefined,
		selectable = false,
		rowKey = undefined,
		selectedRows = $bindable([]),
		onselect = undefined,
		expandedContent = undefined,
		canExpand = undefined,
		expandedKeys = $bindable([]),
		onexpand = undefined,
		pageSize = undefined,
		page = $bindable(1),
		onpagechange = undefined,
		sortKey = $bindable(null),
		sortDirection = $bindable('asc'),
		onsort = undefined,
		manualSort = false
	}: TableProps = $props();

	let searchQuery = $state('');

	let _selectionWarned = false;
	$effect(() => {
		if (selectable && !rowKey && !_selectionWarned) {
			_selectionWarned = true;
			console.warn('Table: rowKey is required when selectable is true');
		}
	});

	let _expandWarned = false;
	$effect(() => {
		if (expandedContent && !rowKey && !_expandWarned) {
			_expandWarned = true;
			console.warn('Table: rowKey is required when expandedContent is provided');
		}
	});

	const expandable = $derived(!!expandedContent && !!rowKey);

	// Prune expandedKeys when rows changes to remove entries no longer present
	$effect(() => {
		if (!expandable || expandedKeys.length === 0) return;
		const validKeys = new Set(rows.map((r) => getValue(r, rowKey!)));
		const pruned = expandedKeys.filter((k) => validKeys.has(k));
		if (pruned.length !== expandedKeys.length) {
			expandedKeys = pruned;
		}
	});

	// Set of expanded row keys for O(1) lookup
	const expandedKeySet = $derived(new Set(expandedKeys));

	function isRowExpanded(row: any): boolean {
		if (!expandable) return false;
		return expandedKeySet.has(getValue(row, rowKey!));
	}

	function rowCanExpand(row: any, index: number): boolean {
		if (!expandable) return false;
		return canExpand ? canExpand(row, index) : true;
	}

	function toggleExpand(row: any, index: number) {
		if (!rowCanExpand(row, index)) return;

		const key = getValue(row, rowKey!);
		const expanded = !expandedKeySet.has(key);
		if (expanded) {
			expandedKeys = [...expandedKeys, key];
		} else {
			expandedKeys = expandedKeys.filter((k) => k !== key);
		}
		onexpand?.(row, index, expanded);
	}

	// Prune selectedRows when rows changes to remove entries no longer present
	$effect(() => {
		if (!selectable || !rowKey || selectedRows.length === 0) return;
		const validKeys = new Set(rows.map((r) => getValue(r, rowKey)));
		const pruned = selectedRows.filter((r) => validKeys.has(getValue(r, rowKey)));
		if (pruned.length !== selectedRows.length) {
			selectedRows = pruned;
			onselect?.(selectedRows);
		}
	});

	// Set of selected row keys for O(1) lookup
	const selectedKeys = $derived.by(() => {
		if (!selectable || !rowKey) return new Set<any>();
		return new Set(selectedRows.map((r) => getValue(r, rowKey)));
	});

	// Check if a row is selected
	function isRowSelected(row: any): boolean {
		if (!selectable || !rowKey) return false;
		return selectedKeys.has(getValue(row, rowKey));
	}

	// Toggle individual row selection
	function toggleRow(row: any) {
		if (!selectable || !rowKey) return;

		const key = getValue(row, rowKey);
		if (selectedKeys.has(key)) {
			// Deselect: remove from selectedRows
			selectedRows = selectedRows.filter((r) => getValue(r, rowKey) !== key);
		} else {
			// Select: add to selectedRows
			selectedRows = [...selectedRows, row];
		}
		onselect?.(selectedRows);
	}

	// Handle a row click. Middle-click and ctrl/cmd/shift-click are treated as
	// open-in-new-tab intent when a rowHref is provided.
	function handleRowClick(row: any, index: number, event: MouseEvent) {
		const href = rowHref?.(row, index);
		const newTabIntent = event.button === 1 || event.ctrlKey || event.metaKey || event.shiftKey;

		// Expansion/selection toggling only applies to a plain primary click without
		// nav intent. Expansion wins on rows that can expand; selection stays
		// available via the checkbox and still handles non-expandable rows.
		if (expandable && !href && event.button !== 1 && rowCanExpand(row, index)) {
			toggleExpand(row, index);
		} else if (selectable && !href && event.button !== 1) {
			toggleRow(row);
		}

		onrowclick?.(row, index);

		if (href) {
			event.preventDefault();
			if (newTabIntent) window.open(href, '_blank', 'noopener');
			else navigateTo(href);
		}
	}

	// Toggle all visible rows (the current page when paginated, else all filtered rows)
	function toggleAll() {
		if (!selectable || !rowKey) return;

		// Check if all visible rows are selected
		const allSelected =
			pagedRows.length > 0 && pagedRows.every((row) => selectedKeys.has(getValue(row, rowKey!)));

		if (allSelected) {
			// Deselect all visible rows
			const visibleKeys = new Set(pagedRows.map((r) => getValue(r, rowKey!)));
			selectedRows = selectedRows.filter((r) => !visibleKeys.has(getValue(r, rowKey!)));
		} else {
			// Select all visible rows (merge with existing selections elsewhere)
			const existingKeys = new Set(selectedRows.map((r) => getValue(r, rowKey!)));
			const newSelections = pagedRows.filter((r) => !existingKeys.has(getValue(r, rowKey!)));
			selectedRows = [...selectedRows, ...newSelections];
		}
		onselect?.(selectedRows);
	}

	// Derived states for select-all checkbox
	const isAllSelected = $derived.by(() => {
		if (!selectable || !rowKey || pagedRows.length === 0) return false;
		return pagedRows.every((row) => selectedKeys.has(getValue(row, rowKey)));
	});

	const isSomeSelected = $derived.by(() => {
		if (!selectable || !rowKey || pagedRows.length === 0) return false;
		const selectedCount = pagedRows.filter((row) => selectedKeys.has(getValue(row, rowKey))).length;
		return selectedCount > 0 && selectedCount < pagedRows.length;
	});

	function handleSort(column: Column) {
		if (!column.sortable) return;

		if (sortKey === column.key) {
			sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
		} else {
			sortKey = column.key;
			sortDirection = 'asc';
		}

		// A new sort order invalidates the current page position
		if (paginated && page !== 1) page = 1;

		onsort?.(column.key, sortDirection);
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
			filtered = filtered.filter((row) => {
				return columns.some((column) => {
					const value = getValue(row, column.key);
					if (value === null || value === undefined) return false;
					return String(value).toLowerCase().includes(searchQuery.toLowerCase());
				});
			});
		}

		// Apply sorting — skipped when the caller sorts the rows itself (e.g. server-side)
		if (sortKey && !manualSort) {
			filtered.sort((a, b) => {
				const aValue = getValue(a, sortKey!);
				const bValue = getValue(b, sortKey!);

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

	// Pagination — applied after search filtering and sorting
	const paginated = $derived(!!pageSize && pageSize > 0);
	const totalPages = $derived(
		paginated ? Math.max(1, Math.ceil(filteredRows.length / pageSize!)) : 1
	);

	// Clamp page when filtering or a rows update shrinks the page count
	$effect(() => {
		if (page > totalPages) page = totalPages;
		else if (page < 1) page = 1;
	});

	// A new search invalidates the current page position — jump back to the first page
	let _lastQuery = '';
	$effect(() => {
		if (searchQuery !== _lastQuery) {
			_lastQuery = searchQuery;
			if (page !== 1) page = 1;
		}
	});

	const pagedRows = $derived.by(() => {
		if (!paginated) return filteredRows;
		const start = (page - 1) * pageSize!;
		return filteredRows.slice(start, start + pageSize!);
	});

	const pageStart = $derived(paginated ? (page - 1) * pageSize! + 1 : 1);
	const pageEnd = $derived(
		paginated ? Math.min(page * pageSize!, filteredRows.length) : filteredRows.length
	);

	const getSortIcon = (column: Column) => {
		if (!column.sortable) return '';
		if (sortKey !== column.key) return iconArrowsSort;
		return sortDirection === 'asc' ? iconChevronUp : iconChevronDown;
	};

	const tableClasses = $derived(
		`pui-table ${tableClass} ${striped ? 'striped' : ''} ${hover ? 'hover' : ''}`
	);

	const totalColumns = $derived(
		columns.length + (expandable ? 1 : 0) + (selectable && rowKey ? 1 : 0) + (buttons ? 1 : 0)
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
					{#if expandable}
						<th class="table-header expand-cell" style="width: 40px"></th>
					{/if}
					{#if selectable && rowKey}
						<th class="table-header checkbox-cell" style="width: 40px">
							<Checkbox
								controlled
								checked={isAllSelected}
								indeterminate={isSomeSelected}
								onchange={() => toggleAll()}
								ariaLabel="Select all rows"
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
										<Icon svg={getSortIcon(column)} size="14px" />
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
						<td colspan={totalColumns} class="loading-cell">
							<div class="loading-content">Loading...</div>
						</td>
					</tr>
				{:else if filteredRows.length === 0}
					<tr>
						<td colspan={totalColumns} class="empty-cell">
							<div class="empty-content">{emptyMessage}</div>
						</td>
					</tr>
				{:else}
					{#each pagedRows as row, index}
						{@const expanded = isRowExpanded(row)}
						<tr
							class={(onrowclick ||
							selectable ||
							rowHref ||
							(expandable && rowCanExpand(row, index))
								? 'clickable-row'
								: '') +
								(selectable && isRowSelected(row) ? ' selected' : '') +
								(expanded ? ' expanded' : '')}
							class:row-even={index % 2 === 1}
							onclick={(e) => handleRowClick(row, index, e)}
							onmousedown={(e) => {
								// Suppress the default middle-button action (autoscroll) so auxclick fires.
								if (e.button === 1 && rowHref?.(row, index)) e.preventDefault();
							}}
							onauxclick={(e) => {
								if (e.button === 1) handleRowClick(row, index, e);
							}}
						>
							{#if expandable}
								<td class="table-cell expand-cell" onclick={(e) => e.stopPropagation()}>
									{#if rowCanExpand(row, index)}
										<button
											type="button"
											class="expand-toggle"
											class:expanded
											aria-expanded={expanded}
											aria-label={expanded ? 'Collapse row' : 'Expand row'}
											onclick={() => toggleExpand(row, index)}
										>
											<Icon svg={iconChevronRight} size="16px" />
										</button>
									{/if}
								</td>
							{/if}
							{#if selectable && rowKey}
								<td class="table-cell checkbox-cell" onclick={(e) => e.stopPropagation()}>
									<Checkbox
										controlled
										checked={isRowSelected(row)}
										onchange={() => toggleRow(row)}
										ariaLabel="Select row"
									/>
								</td>
							{/if}
							{#each columns as column}
								{@const value = getValue(row, column.key)}
								<td class="table-cell {column.align || 'left'}">
									{#if column.cell}
										{@render column.cell({ value, row, index })}
									{:else if column.render}
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
						{#if expanded && expandedContent}
							<tr class="detail-row" class:row-even={index % 2 === 1}>
								<td class="detail-cell" colspan={totalColumns}>
									{@render expandedContent(row, index)}
								</td>
							</tr>
						{/if}
					{/each}
				{/if}
			</tbody>
		</table>
	</div>

	{#if paginated && !loading && totalPages > 1}
		<div class="table-pagination">
			<span class="pagination-info">
				Showing {pageStart}–{pageEnd} of {filteredRows.length}
			</span>
			<Pagination bind:selectedPage={page} {totalPages} onPageChange={(p) => onpagechange?.(p)} />
		</div>
	{/if}

	{@render children?.()}
</div>

<style>
	.table-container {
		width: 100%;
	}

	.table-search {
		margin-bottom: 1rem;
		max-width: 400px;
	}

	.table-wrapper {
		width: 100%;
		overflow-x: auto;
		border: 1px solid var(--border-color);
		background-color: var(--input-bg-color);
	}

	.table-wrapper.rounded {
		border-radius: 0.5rem;
	}

	.pui-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.875rem;
	}

	.table-header {
		padding: 0.5rem;
		text-align: left;
		font-weight: 600;
		color: var(--text-color);
		background-color: var(--bg-color);
		border-bottom: 2px solid var(--border-color);
		user-select: none;
		white-space: nowrap;
	}

	.table-header.sortable {
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.table-header.sortable:hover {
		background-color: var(--hover-bg);
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
		gap: 0.5rem;
		justify-content: space-between;
	}

	.sort-icon {
		display: inline-flex;
		align-items: center;
		opacity: 0.5;
		transition: opacity 0.2s;
	}

	.table-header.sortable:hover .sort-icon {
		opacity: 1;
	}

	.table-cell {
		padding: 0.5rem;
		text-align: left;
		color: var(--text-color);
		border-bottom: 1px solid var(--border-color);
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
		padding: 0.25rem;
	}

	.checkbox-cell :global(.checkbox-container) {
		display: inline-flex;
		justify-content: center;
	}

	.checkbox-cell :global(input) {
		margin: 2px;
	}

	.expand-cell {
		width: 40px;
		text-align: center;
		padding: 0.25rem;
	}

	.expand-toggle {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;
		padding: 0;
		border: none;
		background: transparent;
		color: var(--text-color);
		cursor: pointer;
		border-radius: 0.25rem;
		transition:
			transform 0.15s ease,
			background-color 0.2s;
	}

	.expand-toggle:hover {
		background-color: var(--hover-bg);
	}

	.expand-toggle.expanded {
		transform: rotate(90deg);
	}

	/* An expanded row and its detail row read as one unit: the parent's border
	 * moves to the bottom of the detail row. */
	tbody tr.expanded td {
		border-bottom: none;
	}

	.detail-cell {
		padding: 0.5rem;
		color: var(--text-color);
		border-bottom: 1px solid var(--border-color);
	}

	.pui-table.striped tbody tr.row-even {
		background-color: var(--stripe-bg);
	}

	.pui-table.hover tbody tr:not(.detail-row):hover {
		background-color: var(--hover-bg);
		transition: background-color 0.2s;
	}

	.pui-table tbody tr.selected,
	.pui-table.striped tbody tr.selected.row-even {
		background-color: rgba(var(--ui-tertiary-rgbc), 0.15);
	}
	.pui-table tbody tr.selected:hover,
	.pui-table.hover tbody tr.selected:hover {
		background-color: rgba(var(--ui-tertiary-rgbc), 0.22);
	}
	:global(.dark) .pui-table tbody tr.selected,
	:global(.dark) .pui-table.striped tbody tr.selected.row-even {
		background-color: rgba(var(--ui-tertiary-rgbc), 0.12);
	}
	:global(.dark) .pui-table tbody tr.selected:hover,
	:global(.dark) .pui-table.hover tbody tr.selected:hover {
		background-color: rgba(var(--ui-tertiary-rgbc), 0.16);
	}

	.clickable-row {
		cursor: pointer;
	}

	.clickable-row:hover {
		background-color: var(--hover-bg);
		transition: background-color 0.2s;
	}

	tbody tr:last-child td {
		border-bottom: none;
	}

	.empty-cell,
	.loading-cell {
		padding: 2rem;
		text-align: center;
		color: var(--text-muted);
		border-bottom: none;
	}

	.empty-content,
	.loading-content {
		font-style: italic;
	}

	.table-pagination {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		flex-wrap: wrap;
		margin-top: 1rem;
	}

	.pagination-info {
		color: var(--text-muted);
		font-size: 0.875rem;
	}

	:global(:root) {
		--stripe-bg: rgba(0, 0, 0, 0.02);
		--hover-bg: rgba(0, 0, 0, 0.04);
		--text-muted: #6b7280;
	}

	:global(.dark) {
		--stripe-bg: rgba(255, 255, 255, 0.02);
		--hover-bg: rgba(255, 255, 255, 0.04);
		--text-muted: #9ca3af;
	}

	:global(.pui-table .sort-icon svg) {
		width: 14px;
		height: 14px;
	}

	@media (max-width: 640px) {
		.table-header,
		.table-cell {
			padding: 0.5rem 0.75rem;
		}

		.pui-table {
			font-size: 0.75rem;
		}
	}
</style>
