<script lang="ts">
	import Button from './Button.svelte';
	import chevronRight from '../icon/chevron-right.svg?raw';
	import ActionIcon from './ActionIcon.svelte';
	import { iconChevronLeft } from '../icon/index.js';

	interface Props {
		selectedPage?: number;
		totalPages?: number;
		onPageChange?: (page: number) => void;
		maxPageButtons?: number;
	}

	let {
		selectedPage = $bindable(1),
		totalPages,
		onPageChange = (page: number) => {},
		maxPageButtons = 8
	}: Props = $props();

	type Page = { page: number | undefined; isSelected: boolean };

	function setPage(page: number) {
		if (selectedPage === page) return;

		selectedPage = page;
		onPageChange(page);
	}	function determinePages(selectedPage: number, totalPages?: number) {
		let pages: Page[] = [];

		function push(page: number | undefined) {
			pages.push({ page, isSelected: page === selectedPage });
		}

		if (totalPages === undefined) return pages;

		if (totalPages <= maxPageButtons) {
			for (let i = 1; i <= totalPages; i++) push(i);
			return pages;
		}

		// For maxPageButtons, we need to fit: first, last, and some middle pages + ellipsis
		// Reserve 2 slots for first and last pages, leaving maxPageButtons - 2 for middle + ellipsis
		const middleSlots = maxPageButtons - 2;
		
		// Calculate how many pages we can show around the selected page
		const sidePages = Math.floor((middleSlots - 1) / 2); // -1 to account for potential ellipsis

		let startPage = Math.max(2, selectedPage - sidePages);
		let endPage = Math.min(totalPages - 1, selectedPage + sidePages);

		// Adjust if we're too close to the beginning or end
		if (startPage <= 3) {
			// Close to start, show consecutive pages from 2
			startPage = 2;
			endPage = Math.min(totalPages - 1, startPage + middleSlots - 1);
		} else if (endPage >= totalPages - 2) {
			// Close to end, show consecutive pages to totalPages - 1
			endPage = totalPages - 1;
			startPage = Math.max(2, endPage - middleSlots + 1);
		}

		// Always show first page
		push(1);

		// Show ellipsis if there's a gap after first page
		if (startPage > 2) {
			push(undefined); // ellipsis
		}

		// Show middle pages
		for (let i = startPage; i <= endPage; i++) {
			push(i);
		}

		// Show ellipsis if there's a gap before last page
		if (endPage < totalPages - 1) {
			push(undefined); // ellipsis
		}

		// Always show last page (if it's different from first)
		if (totalPages > 1) {
			push(totalPages);
		}

		return pages;
	}
</script>

<div class="pagination-container">
	<ActionIcon
		svg={iconChevronLeft}
		variant="secondary"
		onclick={() => setPage(selectedPage - 1)}
		disabled={selectedPage <= 1}
	/>

	{#each determinePages(selectedPage, totalPages) as page}
		{#if page.page}
			<Button
				variant={page.isSelected ? 'secondary-selected' : 'secondary'}
				class="paginate-button"
				onclick={() => setPage(page.page!)}>{page.page}</Button
			>
		{:else}
			<span class="paginate-button">…</span>
		{/if}
	{/each}

	<ActionIcon
		svg={chevronRight}
		variant="secondary"
		disabled={totalPages === undefined || selectedPage >= totalPages}
		onclick={() => setPage(selectedPage + 1)}
	/>
</div>

<style>
	.pagination-container {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.pagination-container :global(.paginate-button) {
		width: 33.6px;
		height: 29.6px;
		display: flex;
		justify-content: center;
	}
	
	:global(.dark) .pagination-container :global(.paginate-button.secondary-selected) {
		color: black;
	}
</style>
