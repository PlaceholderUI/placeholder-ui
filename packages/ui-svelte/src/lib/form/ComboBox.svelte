<script lang="ts">
	import { fade } from 'svelte/transition';
	import type { ComboBoxItem } from '../models/ComboBoxItem.js';

	interface Props {
		value: string;
		options: ComboBoxItem[];
		loading: boolean;
		open: boolean;
		htmlElement?: HTMLElement | undefined;
		hideNoResults: boolean;
		loadingText: string;
		onselection: (value: ComboBoxItem) => void;
		onkeydown?: (e: KeyboardEvent) => boolean;
	}

	let {
		value,
		options,
		loading,
		open,
		htmlElement,
		hideNoResults,
		loadingText,
		onselection: onSelection,
		onkeydown
	}: Props = $props();

	let selectedIndex = $state(-1);
	let error = $state('');

	let selecting = $state(false);

	export function onKeyDown(e: KeyboardEvent) {
		error = '';
		onkeydown?.(e);
		if (e.key == 'ArrowUp') {
			e.preventDefault();
			selecting = true;
			selectedIndex = Math.max(0, selectedIndex - 1);
		} else if (e.key == 'ArrowDown') {
			e.preventDefault();
			selecting = true;
			selectedIndex = Math.min(options.length - 1, selectedIndex + 1);
		} else if (e.key == 'Enter') {
			e.preventDefault();

			if (selecting && options[selectedIndex]) {
				onSelection(options[selectedIndex]);
				value = options[selectedIndex].label;
				selecting = false;
				return true;
			}
		} else if (e.key == 'Escape') {
			e.preventDefault();
			selecting = false;
			open = false;
		}

		return false;
	}
</script>

{#if open}
	<div bind:this={htmlElement} class="combobox" transition:fade={{ duration: 150 }}>
		{#if loading}
			{#if loadingText}
				<div class="loading">{loadingText}</div>
			{:else}
				<span></span>
			{/if}
		{:else if error}
			<div class="error">{error}</div>
		{:else if value && options?.length === 0}
			{#if !hideNoResults}
				<div class="no-results">No results found</div>
			{/if}
		{:else}
			<div class="combobox-panel">
				{#each options as option, index}
					{@const localClasses = [
						selectedIndex === index ? 'selected p-2' : 'p-2'
					]}
					<button
						class="combobox-item {localClasses} {option.class}"
						class:selected={selectedIndex === index}
						onclick={() => {
							onSelection(option);
							value = option.label;
							selectedIndex = index;
						}}
					>
						{#if option.component}
							{@const Component = option.component}
							<Component {option} {...option.componentProps} />
						{:else}
							{option.label}
						{/if}
					</button>
				{/each}
			</div>
		{/if}
	</div>
{/if}

<style>
	/* .item {
		&:hover,
		&.selected {
			@apply bg-main-border;
			@apply text-accent;
		}
	} */

	.combobox {
		position: absolute;
		width: 100%;
		z-index: 50;
		border-radius: 0.25rem;
		overflow: hidden;
		border: 1px solid var(--main-border-color);
		background-color: var(--input-bg-color);
		/* absolute w-full z-50 rounded overflow-hidden
			border border-main-border bg-input */
	}

	.combobox-panel {
		overflow: auto;
		max-height: 20rem;
		border: 1px solid var(--border-color);
		border-top: none;
		/* max-h-80 overflow-auto */
	}

	.combobox-item {
		width: 100%;
		display: flex;
		align-items: center;
		text-align: left;
		background-color: transparent;
		color: var(--text-color);
		border: none;
		font-size: 1rem;
		cursor: pointer;
		gap: 0.5rem;
		/* item w-full flex items-center text-left */
	}

	.p-2 {
		padding: 0.5rem;
	}

	.error, .loading, .no-results {
		padding: 0.5rem;
	}

	.no-results {
		color: var(--text-color);
		border: 1px solid var(--border-color);
		border-top: none;
	}

	.combobox-item.selected,
	.combobox-item:hover {
		background-color: var(--border-color);
		color: rgb(var(--accent-color-rgb));
	}
</style>
