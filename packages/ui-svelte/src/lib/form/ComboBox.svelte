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
	.combobox {
		position: absolute;
		width: 100%;
		z-index: var(--pui-z-dropdown);
		border-radius: var(--pui-radius-base);
		overflow: hidden;
		border: 1px solid var(--pui-border-default);
		background-color: var(--pui-input-bg);
	}

	.combobox-panel {
		overflow: auto;
		max-height: 20rem;
		border: 1px solid var(--pui-border-default);
		border-top: none;
	}

	.combobox-item {
		width: 100%;
		display: flex;
		align-items: center;
		text-align: left;
		background-color: transparent;
		color: var(--pui-text-primary);
		border: none;
		font-size: var(--pui-font-size-md);
		cursor: pointer;
		gap: var(--pui-spacing-2);
	}

	.p-2 {
		padding: var(--pui-spacing-2);
	}

	.error,
	.loading,
	.no-results {
		padding: var(--pui-spacing-2);
	}

	.no-results {
		color: var(--pui-text-primary);
		border: 1px solid var(--pui-border-default);
		border-top: none;
	}

	.combobox-item.selected,
	.combobox-item:hover {
		background-color: var(--pui-bg-hover);
		color: var(--pui-accent-color);
	}
</style>
