<script lang="ts">
	import type { ComboBoxItem } from '../models/ComboBoxItem.js';
	import { onMount } from 'svelte';

	interface Props {
		options: ComboBoxItem[];
		value?: any;
		onchange?: (value: string) => void;
	}

	let { options, value = $bindable(), onchange }: Props = $props();

	let containerRef: HTMLDivElement;
	let buttonElements = $state<HTMLButtonElement[]>([]);
	let backgroundStyle = $state('');

	// Calculate selected index for background positioning using derived state
	const selectedIndex = $derived(options.findIndex((option) => option.value === value));

    onMount(() => {
        // recalculate 10 times on startup to ensure background is positioned correctly
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                if (selectedIndex >= 0 && buttonElements[selectedIndex]) {
                    recalculateBackground();
                }
            }, 100 * i);
        }
    });

	// Update background position and size based on selected element
	$effect(() => {
		if (selectedIndex >= 0 && buttonElements[selectedIndex] && containerRef) {
            recalculateBackground();
		}
	});

	// Initialize value if undefined using effect
	$effect(() => {
		if (value === undefined && options && options.length > 0) {
			value = options[0].value;
		}
	});

	function recalculateBackground() {
		const selectedButton = buttonElements[selectedIndex];
		const containerRect = containerRef.getBoundingClientRect();
		const buttonRect = selectedButton.getBoundingClientRect();

		const offsetLeft = buttonRect.left - containerRect.left;
		const width = buttonRect.width;
		const height = buttonRect.height;

		backgroundStyle = `left: ${offsetLeft}px; width: ${width}px; height: ${height}px; top: ${buttonRect.top - containerRect.top}px;`;
	}

	function setValue(newValue: any) {
		value = newValue;
		onchange?.(value);
	}
</script>

<div class="segmented-control" bind:this={containerRef}>
	<div class="segmented-control-background" style={backgroundStyle}></div>
	{#each options as option, index}
		{@const isSelected = option.value === value}

		<button
			bind:this={buttonElements[index]}
			class="segmented-control-item {isSelected ? 'selected' : ''}"
			onclick={() => setValue(option.value)}
		>
			{option.label}
		</button>
	{/each}
</div>

<style>
	.segmented-control {
		position: relative;
		display: inline-flex;
		background-color: #e5e7eb;
		border-radius: 0.5rem;
		padding: 0.25rem;
		user-select: none;
	}

	.segmented-control-background {
		position: absolute;
		background-color: white;
		border-radius: 0.375rem;
		transition: all 0.2s ease-in-out;
		box-shadow:
			0 1px 3px 0 rgba(0, 0, 0, 0.1),
			0 1px 2px 0 rgba(0, 0, 0, 0.06);
	}

	.segmented-control-item {
		position: relative;
		align-items: center;
		justify-content: center;
		padding: 0.5rem 1rem;
		cursor: pointer;
		user-select: none;
		border: none;
		background: transparent;
		border-radius: 0.375rem;
		font-size: 0.875rem;
		font-weight: 500;
		color: #6b7280;
		transition: color 0.2s ease-in-out;
		z-index: 1;
	}

	.segmented-control-item:hover {
		color: #374151;
	}

	.segmented-control-item.selected {
		color: #111827;
	}

	/* Dark mode styles */
	:global(.dark) .segmented-control {
		background-color: var(--input-bg-color);
	}

	:global(.dark) .segmented-control-background {
		background-color: var(--midnight);
	}

	:global(.dark) .segmented-control-item {
		color: #9ca3af;
	}

	:global(.dark) .segmented-control-item:hover {
		color: #d1d5db;
	}

	:global(.dark) .segmented-control-item.selected {
		color: #f9fafb;
	}
</style>
