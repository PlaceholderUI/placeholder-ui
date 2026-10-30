<script lang="ts">
	import type { ComboBoxItem } from '#lib/models/ComboBoxItem.js';
	import { onMount } from 'svelte';

	export interface TabsProps {
		/**
		 * Available tab options. `class` is added to the tab button (style it with `:global()`),
		 * and a divider is drawn between neighbouring tabs whose `groupName` differs
		 */
		tabOptions: ComboBoxItem[];
		/** Currently active tab value (bindable) */
		activeTab?: string;
		/** Use solid background instead of transparent */
		solidBg?: boolean;
		/** Callback when active tab changes */
		onchange?: (newValue: string) => void;
	}

	let { tabOptions, activeTab = $bindable(''), solidBg = false, onchange }: TabsProps = $props();
	let containerRef: HTMLDivElement;
	let scrollRef: HTMLDivElement;
	let buttonElements = $state<HTMLButtonElement[]>([]);
	let underlineStyle = $state('');

	// Initialize activeTab if empty and tabs are available
	$effect(() => {
		if (!activeTab && tabOptions && tabOptions.length > 0) {
			activeTab = tabOptions[0].value;
		}
	});

	// Calculate selected index for background positioning using derived state
	const selectedIndex = $derived(
		tabOptions.findIndex((tabOptions) => tabOptions.value === activeTab)
	);

	onMount(() => {
		// recalculate 10 times on startup to ensure underline is positioned correctly
		for (let i = 0; i < 10; i++) {
			setTimeout(() => {
				if (selectedIndex >= 0 && buttonElements[selectedIndex]) {
					recalculateUnderline();
				}
			}, 100 * i);
		}
	});

	// Update underline position and size based on selected element
	$effect(() => {
		if (selectedIndex >= 0 && buttonElements[selectedIndex] && containerRef) {
			recalculateUnderline();
			scrollSelectedIntoView();
		}
	});

	function recalculateUnderline() {
		const selectedButton = buttonElements[selectedIndex];
		const containerRect = containerRef.getBoundingClientRect();
		const buttonRect = selectedButton.getBoundingClientRect();

		const offsetLeft = buttonRect.left - containerRect.left;
		const width = buttonRect.width;

		underlineStyle = `left: ${offsetLeft}px; width: ${width}px;`;
	}

	// Scroll the bar (not the page) so the selected tab is fully visible
	function scrollSelectedIntoView() {
		const selectedButton = buttonElements[selectedIndex];
		const scrollRect = scrollRef.getBoundingClientRect();
		const buttonRect = selectedButton.getBoundingClientRect();

		if (buttonRect.left < scrollRect.left) {
			scrollRef.scrollLeft -= scrollRect.left - buttonRect.left;
		} else if (buttonRect.right > scrollRect.right) {
			scrollRef.scrollLeft += buttonRect.right - scrollRect.right;
		}
	}

	function setValue(newValue: any) {
		activeTab = newValue;
		onchange?.(newValue);
	}
</script>

<div class="tabs-scroll" bind:this={scrollRef}>
	<div class="tabs" bind:this={containerRef}>
		{#each tabOptions as option, index}
			{@const isSelected = option.value === activeTab}

			{#if index > 0 && (option.groupName ?? '') !== (tabOptions[index - 1].groupName ?? '')}
				<span class="tab-divider" aria-hidden="true"></span>
			{/if}
			<button
				type="button"
				bind:this={buttonElements[index]}
				class="tab-item {isSelected ? 'selected' : ''} {solidBg ? 'solid' : ''} {option.class ??
					''}"
				onclick={() => setValue(option.value)}
			>
				{option.label}
			</button>
		{/each}
		<div class="tab-underline" style={underlineStyle}></div>
	</div>
</div>

<style>
	.tabs-scroll {
		display: inline-block;
		max-width: 100%;
		vertical-align: bottom;
		overflow-x: auto;
		overflow-y: hidden;
	}

	.tabs {
		position: relative;
		display: inline-flex;
		border-bottom: 1px solid #e5e7eb;
		user-select: none;
	}

	.tab-item {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.75rem 1.5rem;
		cursor: pointer;
		user-select: none;
		border: none;
		background: transparent;
		font-size: 0.875rem;
		font-weight: 500;
		color: #6b7280;
		transition: color 0.2s ease-in-out;
		z-index: 1;
		border-bottom: 2px solid transparent;
		flex-shrink: 0;
		white-space: nowrap;
	}

	.tab-divider {
		flex-shrink: 0;
		align-self: center;
		width: 1px;
		height: 1.25rem;
		background-color: var(--border-color);
	}

	.tab-item:hover {
		color: #374151;
	}

	.tab-item.selected {
		color: var(--ui-primary-text-color);
	}

	.tab-underline {
		position: absolute;
		bottom: -1px;
		height: 2px;
		background-color: var(--ui-primary);
		transition: all 0.2s ease-in-out;
		z-index: 2;
	}

	.solid {
		background: var(--paper-body-bg);
	}

	/* Dark mode styles */
	:global(.dark) .tabs {
		border-bottom-color: #374151;
	}

	:global(.dark) .tab-item {
		color: #9ca3af;
	}

	:global(.dark) .tab-item:hover {
		color: #d1d5db;
	}

	:global(.dark) .tab-item.selected {
		color: var(--ui-accent);
	}

	:global(.dark) .tab-underline {
		background-color: var(--ui-accent);
	}
</style>
