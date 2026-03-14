<script lang="ts">
	import type { ComboBoxItem } from '../models/ComboBoxItem.js';
	import { onMount } from 'svelte';

	interface Props {
		tabOptions: ComboBoxItem[];
		activeTab?: string;
		solidBg?: boolean;
		onchange?: (newValue: string) => void;
	}

	let { tabOptions, activeTab = $bindable(''), solidBg = false, onchange }: Props = $props();
	let containerRef: HTMLDivElement;
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

	function setValue(newValue: any) {
		activeTab = newValue;
		onchange?.(newValue);
	}
</script>

<div class="tabs" bind:this={containerRef}>
	{#each tabOptions as option, index}
		{@const isSelected = option.value === activeTab}

		<button
			bind:this={buttonElements[index]}
			class="tab-item {isSelected ? 'selected' : ''} {solidBg ? 'solid' : ''}"
			onclick={() => setValue(option.value)}
		>
			{option.label}
		</button>
	{/each}
	<div class="tab-underline" style={underlineStyle}></div>
</div>

<style>
	.tabs {
		position: relative;
		display: inline-flex;
		border-bottom: 1px solid var(--pui-border-default);
		user-select: none;
	}

	.tab-item {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--pui-spacing-3) var(--pui-spacing-6);
		cursor: pointer;
		user-select: none;
		border: none;
		background: transparent;
		font-size: var(--pui-font-size-base);
		font-weight: var(--pui-font-weight-medium);
		color: var(--pui-color-gray-500);
		transition: color var(--pui-transition-fast) var(--pui-ease-in-out);
		z-index: 1;
		border-bottom: 2px solid transparent;
	}

	.tab-item:hover {
		color: var(--pui-color-gray-700);
	}

	.tab-item.selected {
		color: var(--pui-color-primary);
	}

	.tab-underline {
		position: absolute;
		bottom: -1px;
		height: 2px;
		background-color: var(--pui-color-primary);
		transition: all var(--pui-transition-fast) var(--pui-ease-in-out);
		z-index: 2;
	}

	.solid {
		background: var(--pui-paper-body-bg);
	}

	/* Dark mode styles */
	:global(.dark) .tabs {
		border-bottom-color: var(--pui-color-gray-700);
	}

	:global(.dark) .tab-item {
		color: var(--pui-color-gray-400);
	}

	:global(.dark) .tab-item:hover {
		color: var(--pui-color-gray-300);
	}

	:global(.dark) .tab-item.selected {
		color: var(--pui-color-secondary);
	}

	:global(.dark) .tab-underline {
		background-color: var(--pui-color-secondary);
	}
</style>
