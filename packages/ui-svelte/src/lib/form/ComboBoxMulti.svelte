<script lang="ts">
	import { fade } from 'svelte/transition';
	import type { ComboBoxGroup, ComboBoxItem } from '../models/ComboBoxItem.js';
	import Icon from '../icon/Icon.svelte';
	import check from '../icon/check.svg?raw';

	interface Props {
		filterString: string;
		values: ComboBoxItem[];
		groupedOptions: ComboBoxGroup[];
		loading: boolean;
		open: boolean;
		hideNoResults: boolean;
		loadingText: string;
		onSelection: (value: ComboBoxItem) => void;
		htmlElement?: HTMLElement;
		onkeydown?: (e: KeyboardEvent) => void;
	}

	let {
		filterString = '',
		values = [],
		groupedOptions = [],
		loading = false,
		open = $bindable(false),
		hideNoResults = false,
		loadingText = '',
		onSelection,
		htmlElement = $bindable(undefined),
		onkeydown = undefined
	}: Props = $props();

	let selectedIndex = $state(-1);
	let error = $state('');

	let selecting = $state(false);
	let flattenedOptions: ComboBoxItem[] = $derived(groupedOptions.flatMap((group) => group.items));

	$effect(() => {
		if (open && flattenedOptions.length > 0) {
			selectedIndex = 0;
		}
	});

	function performSelection(item: ComboBoxItem) {
		onSelection(item);
	}

	export function handleKeyDown(e: KeyboardEvent) {
		error = '';
		if (e.key == 'ArrowUp') {
			e.preventDefault();
			selecting = true;
			selectedIndex = Math.max(0, selectedIndex - 1);
		} else if (e.key == 'ArrowDown') {
			e.preventDefault();
			selecting = true;
			selectedIndex = Math.min(flattenedOptions.length - 1, selectedIndex + 1);
		} else if (e.key == 'Enter') {
			e.preventDefault();
			if (selectedIndex >= 0 && selectedIndex < flattenedOptions.length) {
				performSelection(flattenedOptions[selectedIndex]);
			}
		} else if (e.key == 'Escape') {
			e.preventDefault();
			selecting = false;
			open = false;
		}

		onkeydown?.(e);
	}
</script>

{#if open}
	<div
		bind:this={htmlElement}
		class="combobox-multi"
		transition:fade={{ duration: 150 }}
		tabindex="0"
		role="listbox"
		aria-expanded="true"
		onkeydown={handleKeyDown}
	>
		{#if loading}
			{#if loadingText}
				<div class="p-2">{loadingText}</div>
			{:else}
				<div class="p-2">Loading...</div>
			{/if}
		{:else if error}
			<div class="p-2">{error}</div>
		{:else if filterString && flattenedOptions?.length === 0}
			{#if !hideNoResults}
				<div class="p-2 no-results">No results found</div>
			{/if}
		{:else}
			<div class="combobox-multi-panel">
				{#each groupedOptions as group, groupIndex}
					{#if group != groupedOptions[0]}
						<div class="seperator"></div>
					{/if}
					{#if group.label?.length && group.showGroupName !== false}
						<div class="group-label">{group.label}</div>
					{/if}
					{#each group.items as option, localIndex}
						{@const globalIndex = groupedOptions.slice(0, groupIndex).reduce((acc, g) => acc + g.items.length, 0) + localIndex}
						{@const localClasses = [selectedIndex === globalIndex ? 'selected p-2' : 'p-2']}
						<button
							class="combobox-item {localClasses.join(' ')} {option.class}"
							role="option"
							aria-selected={selectedIndex === globalIndex}
							onclick={() => {
								performSelection(option);
								selectedIndex = globalIndex;
							}}
						>
							{#if option.component}
								{@const Component = option.component}
								<Component {option} {...option.componentProps} />
							{:else}
								{#if values.filter((x) => x.value == option.value).length}
									<Icon size="1rem" svg={check} />
								{/if}
								{option.label}
							{/if}
						</button>
					{/each}
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

	.combobox-multi {
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

	.combobox-multi-panel {
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

	.combobox-item.selected,
	.combobox-item:hover {
		background-color: var(--border-color);
		color: rgb(var(--accent-color-rgb));
	}

	.seperator {
		height: 1px;
		background-color: var(--border-color);
		margin: 0.5rem 0;
	}

	.group-label {
		font-weight: bold;
		padding: 0.5rem;
		background-color: #f6f6f6;
		color: rgb(var(--accent-color-rgb));
	}

	.no-results {
		color: var(--text-color);
		border: 1px solid var(--border-color);
		border-top: none;
	}

	:global(.dark) {
		.group-label {
			background: black;
		}
	}
</style>
