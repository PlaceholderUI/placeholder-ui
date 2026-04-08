<script lang="ts">
	import type { ComboBoxItem } from '../models/ComboBoxItem.js';
	import FormGroup from './FormGroup.svelte';
	import { onMount, tick } from 'svelte';

	export type SegmentedControlSize = 'default' | 'sm';

	interface Props {
		options: ComboBoxItem[];
		value?: any;
		/** Label text displayed above the control */
		label?: string;
		/** Visual size: 'default' or 'sm' (sized to match Textbox/Select) */
		size?: SegmentedControlSize;
		onchange?: (value: string) => void;
	}

	let { options, value = $bindable(), label, size = 'default', onchange }: Props = $props();

	let containerRef: HTMLDivElement;
	let buttonElements = $state<HTMLButtonElement[]>([]);
	let backgroundStyle = $state('');

	// Calculate selected index for background positioning using derived state
	const selectedIndex = $derived(options.findIndex((option) => option.value === value));

	onMount(() => {
		// Recalculate after initial DOM render
		tick().then(() => {
			if (selectedIndex >= 0 && buttonElements[selectedIndex]) {
				recalculateBackground();
			}
		});

		// Use ResizeObserver to handle layout shifts (e.g. font loading, container resize)
		const observer = new ResizeObserver(() => {
			if (selectedIndex >= 0 && buttonElements[selectedIndex]) {
				recalculateBackground();
			}
		});
		observer.observe(containerRef);

		return () => observer.disconnect();
	});

	// Update background position and size when selection changes
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

{#snippet control()}
	<div class="segmented-control size-{size}" bind:this={containerRef}>
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
		{@render control()}
	</FormGroup>
{:else}
	{@render control()}
{/if}

<style>
	.segmented-control {
		position: relative;
		display: inline-flex;
		background-color: var(--pui-color-gray-200);
		border-radius: var(--pui-radius-lg);
		padding: var(--pui-spacing-1);
		user-select: none;
	}

	.segmented-control-background {
		position: absolute;
		background-color: var(--pui-color-white);
		border-radius: var(--pui-radius-md);
		transition: all var(--pui-transition-fast) var(--pui-ease-in-out);
		box-shadow: var(--pui-shadow-sm);
	}

	.segmented-control.size-sm {
		padding: 2px;
	}

	.segmented-control.size-sm .segmented-control-item {
		padding: var(--pui-spacing-1) var(--pui-spacing-3);
		font-size: var(--pui-font-size-xs);
	}

	.segmented-control-item {
		position: relative;
		align-items: center;
		justify-content: center;
		padding: var(--pui-spacing-2) var(--pui-spacing-4);
		cursor: pointer;
		user-select: none;
		border: none;
		background: transparent;
		border-radius: var(--pui-radius-md);
		font-size: var(--pui-font-size-sm);
		font-weight: var(--pui-font-weight-medium);
		color: var(--pui-color-gray-500);
		transition: color var(--pui-transition-fast) var(--pui-ease-in-out);
		z-index: 1;
	}

	.segmented-control-item:hover {
		color: var(--pui-color-gray-700);
	}

	.segmented-control-item.selected {
		color: var(--pui-color-gray-900);
	}

	/* Dark mode styles */
	:global(.dark) .segmented-control {
		background-color: var(--pui-input-bg);
	}

	:global(.dark) .segmented-control-background {
		background-color: var(--pui-color-primary);
	}

	:global(.dark) .segmented-control-item {
		color: var(--pui-color-gray-400);
	}

	:global(.dark) .segmented-control-item:hover {
		color: var(--pui-color-gray-300);
	}

	:global(.dark) .segmented-control-item.selected {
		color: var(--pui-color-gray-100);
	}
</style>
