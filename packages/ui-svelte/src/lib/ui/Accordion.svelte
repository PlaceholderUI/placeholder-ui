<script lang="ts" module>
	export interface AccordionItem {
		id: string;
		title: string;
		content?: string;
	}
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import Icon from '../icon/Icon.svelte';
	import { iconChevronDown } from '../icon/index.js';

	interface Props {
		items?: AccordionItem[];
		multiple?: boolean;
		defaultOpen?: string[];
		variant?: 'default' | 'contained' | 'filled' | 'separated';
		radius?: 'none' | 'sm' | 'md' | 'lg';
		chevronPosition?: 'left' | 'right';
		disableChevronRotation?: boolean;
		class?: string;
		itemContent?: Snippet<[AccordionItem]>;
		children?: Snippet;
	}

	let {
		items = [],
		multiple = false,
		defaultOpen = [],
		variant = 'default',
		radius = 'md',
		chevronPosition = 'right',
		disableChevronRotation = false,
		class: classes = '',
		itemContent,
		children
	}: Props = $props();

	let openItems = $state<Set<string>>(new Set());

	// Initialize with defaultOpen values
	$effect(() => {
		if (defaultOpen.length > 0 && openItems.size === 0) {
			openItems = new Set(defaultOpen);
		}
	});

	function toggleItem(id: string) {
		if (openItems.has(id)) {
			openItems.delete(id);
			openItems = new Set(openItems);
		} else {
			if (multiple) {
				openItems.add(id);
				openItems = new Set(openItems);
			} else {
				openItems = new Set([id]);
			}
		}
	}

	function isOpen(id: string): boolean {
		return openItems.has(id);
	}
</script>

<div class="accordion variant-{variant} radius-{radius} {classes}">
	{#if children}
		{@render children()}
	{:else}
		{#each items as item (item.id)}
			{@const open = isOpen(item.id)}
			<div class="accordion-item" class:open>
				<button
					class="accordion-control chevron-{chevronPosition}"
					aria-expanded={open}
					onclick={() => toggleItem(item.id)}
				>
					{#if chevronPosition === 'left'}
						<span class="accordion-chevron" class:rotated={open && !disableChevronRotation}>
							<Icon svg={iconChevronDown} size="18px" />
						</span>
					{/if}
					<span class="accordion-title">{item.title}</span>
					{#if chevronPosition === 'right'}
						<span class="accordion-chevron" class:rotated={open && !disableChevronRotation}>
							<Icon svg={iconChevronDown} size="18px" />
						</span>
					{/if}
				</button>
				<div class="accordion-panel" class:open aria-hidden={!open}>
					<div class="accordion-content">
						<div class="accordion-content-inner">
							{#if itemContent}
								{@render itemContent(item)}
							{:else if item.content}
								{item.content}
							{/if}
						</div>
					</div>
				</div>
			</div>
		{/each}
	{/if}
</div>

<style>
	.accordion {
		width: 100%;
		--_accordion-radius: var(--pui-radius-md);
	}

	/* Radius */
	.radius-none { --_accordion-radius: 0; }
	.radius-sm { --_accordion-radius: var(--pui-radius-sm); }
	.radius-md { --_accordion-radius: var(--pui-radius-md); }
	.radius-lg { --_accordion-radius: var(--pui-radius-lg); }

	.accordion {
		border-radius: var(--_accordion-radius);
	}

	/* Variants */
	.variant-default .accordion-item {
		border-bottom: 1px solid var(--pui-border-default);
	}

	:global(.dark) .variant-default .accordion-item {
		border-bottom-color: var(--pui-color-dark-border);
	}

	.variant-contained {
		border: 1px solid var(--pui-border-default);
	}

	:global(.dark) .variant-contained {
		border-color: var(--pui-color-dark-border);
	}

	.variant-contained .accordion-item:not(:last-child) {
		border-bottom: 1px solid var(--pui-border-default);
	}

	:global(.dark) .variant-contained .accordion-item:not(:last-child) {
		border-bottom-color: var(--pui-color-dark-border);
	}

	.variant-filled .accordion-item {
		background-color: var(--pui-bg-surface-raised);
		margin-bottom: var(--pui-spacing-2);
	}

	:global(.dark) .variant-filled .accordion-item {
		background-color: var(--pui-color-dark-200);
	}

	.variant-separated .accordion-item {
		border: 1px solid var(--pui-border-default);
		margin-bottom: var(--pui-spacing-2);
	}

	:global(.dark) .variant-separated .accordion-item {
		border-color: var(--pui-color-dark-border);
	}

	/* Item radius — contained/default: first/last corners; filled/separated: all corners */
	.variant-default .accordion-item:first-child,
	.variant-contained .accordion-item:first-child {
		border-top-left-radius: var(--_accordion-radius);
		border-top-right-radius: var(--_accordion-radius);
	}

	.variant-default .accordion-item:last-child,
	.variant-contained .accordion-item:last-child {
		border-bottom-left-radius: var(--_accordion-radius);
		border-bottom-right-radius: var(--_accordion-radius);
	}

	.variant-filled .accordion-item,
	.variant-separated .accordion-item {
		border-radius: var(--_accordion-radius);
	}

	.accordion-item {
		overflow: hidden;
	}

	.accordion-control {
		width: 100%;
		display: flex;
		align-items: center;
		gap: var(--pui-spacing-2);
		padding: var(--pui-spacing-3) var(--pui-spacing-4);
		background: none;
		border: none;
		cursor: pointer;
		font-family: inherit;
		font-size: var(--pui-font-size-base);
		font-weight: var(--pui-font-weight-medium);
		color: var(--pui-text-primary);
		text-align: left;
		transition: background-color var(--pui-transition-fast) var(--pui-ease-in-out);
	}

	:global(.dark) .accordion-control {
		color: var(--pui-color-gray-100);
	}

	.accordion-item.open > .accordion-control {
		background-color: var(--pui-bg-surface-raised);
	}

	:global(.dark) .accordion-item.open > .accordion-control {
		background-color: rgba(255, 255, 255, 0.06);
	}

	.accordion-control:hover {
		background-color: var(--pui-bg-hover);
	}

	:global(.dark) .accordion-control:hover {
		background-color: rgba(255, 255, 255, 0.08);
	}

	.accordion-control:focus-visible {
		outline: var(--pui-focus-ring-width) solid var(--pui-focus-ring-color);
		outline-offset: calc(-1 * var(--pui-focus-ring-width));
	}

	.accordion-title {
		flex: 1;
	}

	.accordion-chevron {
		display: flex;
		align-items: center;
		justify-content: center;
		transition: transform var(--pui-transition-fast) var(--pui-ease-in-out);
		color: var(--pui-text-muted);
	}

	.accordion-chevron.rotated {
		transform: rotate(180deg);
	}

	.accordion-panel {
		display: grid;
		grid-template-rows: 0fr;
		transition: grid-template-rows var(--pui-transition-base) var(--pui-ease-in-out);
	}

	.accordion-panel.open {
		grid-template-rows: 1fr;
	}

	.accordion-content {
		overflow: hidden;
	}

	.accordion-content-inner {
		padding: var(--pui-spacing-2) var(--pui-spacing-4) var(--pui-spacing-4);
		color: var(--pui-text-secondary);
		font-size: var(--pui-font-size-sm);
		line-height: var(--pui-line-height-relaxed);
	}

	:global(.dark) .accordion-content-inner {
		color: var(--pui-color-gray-300);
	}
</style>
