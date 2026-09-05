<script lang="ts">
	import type { ComboBoxItem } from '$lib/models/ComboBoxItem.js';
	import FormGroup from '$lib/form/FormGroup.svelte';
	import { onMount } from 'svelte';

	export type SegmentedControlSize = 'default' | 'lg';

	export interface SegmentedControlProps {
		/** Available segment options */
		options: ComboBoxItem[];
		/** Currently selected value (bindable) */
		value?: any;
		/** Label text displayed above the control */
		label?: string;
		/** Visual size: 'default' (sized to match Textbox/Select) or 'lg' */
		size?: SegmentedControlSize;
		/** Callback when selection changes */
		onchange?: (value: string) => void;
	}

	let {
		options,
		value = $bindable(),
		label,
		size = 'default',
		onchange
	}: SegmentedControlProps = $props();

	let containerRef: HTMLDivElement;
	let buttonElements = $state<HTMLButtonElement[]>([]);
	let backgroundStyle = $state('');

	// Calculate selected index for background positioning using derived state
	const selectedIndex = $derived(options.findIndex((option) => option.value === value));

	onMount(() => {
		// recalculate 10 times on startup to ensure background is positioned correctly
		for (let i = 0; i < 10; i++) {
			setTimeout(() => recalculateBackground(), 100 * i);
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

	/**
	 * Recalculate the selected item background position/size (e.g. after a layout change).
	 * @param delay Optional delay in milliseconds before measuring (e.g. to let a transition finish)
	 */
	export function recalculateBackground(delay?: number) {
		if (delay) {
			setTimeout(() => recalculateBackground(), delay);
			return;
		}

		const selectedButton = buttonElements[selectedIndex];
		if (!selectedButton || !containerRef) return;

		const containerRect = containerRef.getBoundingClientRect();
		const buttonRect = selectedButton.getBoundingClientRect();

		// Absolute positioning is relative to the padding box, but getBoundingClientRect
		// measures from the border's outer edge — subtract the border (clientLeft/clientTop)
		const offsetLeft = buttonRect.left - containerRect.left - containerRef.clientLeft;
		const offsetTop = buttonRect.top - containerRect.top - containerRef.clientTop;
		const width = buttonRect.width;
		const height = buttonRect.height;

		backgroundStyle = `left: ${offsetLeft}px; width: ${width}px; height: ${height}px; top: ${offsetTop}px;`;
	}

	function setValue(newValue: any) {
		value = newValue;
		onchange?.(value);
	}
</script>

{#snippet control()}
	<div class="segmented-control {size === 'lg' ? 'large' : ''}" bind:this={containerRef}>
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
{/snippet}

{#if label}
	<FormGroup {label}>
		<div class="segmented-control-container">
			{@render control()}
		</div>
	</FormGroup>
{:else}
	{@render control()}
{/if}

<style>
	.segmented-control {
		position: relative;
		display: inline-flex;
		background-color: #e5e7eb;
		border-radius: 0.5rem;
		border: 1px solid var(--border-color);
		padding: 0.125rem;
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
		cursor: pointer;
		user-select: none;
		border: none;
		background: transparent;
		border-radius: 0.375rem;
		padding: 0.125rem 0.75rem;
		font-size: 0.875rem;
		line-height: 1.5rem;
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

	/* Large size */
	.segmented-control.large {
		border: none;
		padding: 0.25rem;
	}

	.segmented-control.large .segmented-control-item {
		padding: 0.5rem 1rem;
		line-height: inherit;
	}

	/* Dark mode styles */
	:global(.dark) .segmented-control {
		background-color: var(--input-bg-color);
		border-color: var(--border-color);
	}

	:global(.dark) .segmented-control-background {
		background-color: var(--ui-primary);
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
