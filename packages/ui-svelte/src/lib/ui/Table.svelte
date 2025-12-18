<script lang="ts">
	import { type Snippet } from 'svelte';
	import Textbox from '../form/Textbox.svelte';
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
		columns: Column<T>[];
		rows: T[];
		searchable?: boolean;
		searchPlaceholder?: string;
		class?: string;
		striped?: boolean;
		notRounded?: boolean;
		hover?: boolean;
		emptyMessage?: string;
		loading?: boolean;
		children?: Snippet;
		buttons?: Snippet<[T, number]>;
		onrowclick?: (row: T, index: number) => void;
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
		onrowclick
	}: Props = $props();

	let searchQuery = $state('');
	let sortColumn = $state<string | null>(null);
	let sortDirection = $state<'asc' | 'desc'>('asc');

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
		`cui-table ${tableClass} ${striped ? 'striped' : ''} ${hover ? 'hover' : ''}`
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
						<td colspan={columns.length + (buttons ? 1 : 0)} class="loading-cell">
							<div class="loading-content">Loading...</div>
						</td>
					</tr>
				{:else if filteredRows.length === 0}
					<tr>
						<td colspan={columns.length + (buttons ? 1 : 0)} class="empty-cell">
							<div class="empty-content">{emptyMessage}</div>
						</td>
					</tr>
				{:else}
					{#each filteredRows as row, index}
						<tr
							class={onrowclick ? 'clickable-row' : ''}
							onclick={() => onrowclick?.(row, index)}
						>
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

	.cui-table {
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

	.cui-table.striped tbody tr:nth-child(even) {
		background-color: var(--stripe-bg);
	}

	.cui-table.hover tbody tr:hover {
		background-color: var(--hover-bg);
		transition: background-color 0.2s;
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

	/* CSS Variables for theming */
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

	/* Icon styles for sort indicators */
	:global(.cui-table .sort-icon svg) {
		width: 14px;
		height: 14px;
	}

	/* Responsive adjustments */
	@media (max-width: 640px) {
		.table-header,
		.table-cell {
			padding: 0.5rem 0.75rem;
		}

		.cui-table {
			font-size: 0.75rem;
		}
	}
</style>