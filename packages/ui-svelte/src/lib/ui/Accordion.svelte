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
						{#if itemContent}
							{@render itemContent(item)}
						{:else if item.content}
							{item.content}
						{/if}
					</div>
				</div>
			</div>
		{/each}
	{/if}
</div>

<style>
	.accordion {
		width: 100%;
	}

	/* Variants */
	.variant-default .accordion-item {
		border-bottom: 1px solid var(--pui-color-gray-300);
	}

	:global(.dark) .variant-default .accordion-item {
		border-bottom-color: var(--pui-color-dark-border);
	}

	.variant-contained {
		border: 1px solid var(--pui-color-gray-300);
	}

	:global(.dark) .variant-contained {
		border-color: var(--pui-color-dark-border);
	}

	.variant-contained .accordion-item:not(:last-child) {
		border-bottom: 1px solid var(--pui-color-gray-300);
	}

	:global(.dark) .variant-contained .accordion-item:not(:last-child) {
		border-bottom-color: var(--pui-color-dark-border);
	}

	.variant-filled .accordion-item {
		background-color: var(--pui-color-gray-100);
		margin-bottom: var(--pui-spacing-2);
	}

	:global(.dark) .variant-filled .accordion-item {
		background-color: var(--pui-color-dark-200);
	}

	.variant-separated .accordion-item {
		border: 1px solid var(--pui-color-gray-300);
		margin-bottom: var(--pui-spacing-2);
	}

	:global(.dark) .variant-separated .accordion-item {
		border-color: var(--pui-color-dark-border);
	}

	/* Radius */
	.radius-none,
	.radius-none .accordion-item {
		border-radius: 0;
	}

	.radius-sm {
		border-radius: var(--pui-radius-sm);
	}
	.radius-sm .accordion-item:first-child {
		border-top-left-radius: var(--pui-radius-sm);
		border-top-right-radius: var(--pui-radius-sm);
	}
	.radius-sm .accordion-item:last-child {
		border-bottom-left-radius: var(--pui-radius-sm);
		border-bottom-right-radius: var(--pui-radius-sm);
	}
	.radius-sm.variant-filled .accordion-item,
	.radius-sm.variant-separated .accordion-item {
		border-radius: var(--pui-radius-sm);
	}

	.radius-md {
		border-radius: var(--pui-radius-md);
	}
	.radius-md .accordion-item:first-child {
		border-top-left-radius: var(--pui-radius-md);
		border-top-right-radius: var(--pui-radius-md);
	}
	.radius-md .accordion-item:last-child {
		border-bottom-left-radius: var(--pui-radius-md);
		border-bottom-right-radius: var(--pui-radius-md);
	}
	.radius-md.variant-filled .accordion-item,
	.radius-md.variant-separated .accordion-item {
		border-radius: var(--pui-radius-md);
	}

	.radius-lg {
		border-radius: var(--pui-radius-lg);
	}
	.radius-lg .accordion-item:first-child {
		border-top-left-radius: var(--pui-radius-lg);
		border-top-right-radius: var(--pui-radius-lg);
	}
	.radius-lg .accordion-item:last-child {
		border-bottom-left-radius: var(--pui-radius-lg);
		border-bottom-right-radius: var(--pui-radius-lg);
	}
	.radius-lg.variant-filled .accordion-item,
	.radius-lg.variant-separated .accordion-item {
		border-radius: var(--pui-radius-lg);
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
		font-size: var(--pui-font-size-base);
		font-weight: var(--pui-font-weight-medium);
		color: var(--pui-text-primary);
		text-align: left;
		transition: background-color var(--pui-transition-fast) var(--pui-ease-in-out);
	}

	:global(.dark) .accordion-control {
		color: var(--pui-color-gray-100);
	}

	.accordion-control:hover {
		background-color: var(--pui-color-gray-100);
	}

	:global(.dark) .accordion-control:hover {
		background-color: var(--pui-color-dark-300);
	}

	.accordion-control.chevron-left {
		flex-direction: row;
	}

	.accordion-control.chevron-right {
		flex-direction: row;
	}

	.accordion-title {
		flex: 1;
	}

	.accordion-chevron {
		display: flex;
		align-items: center;
		justify-content: center;
		transition: transform var(--pui-transition-fast) var(--pui-ease-in-out);
		color: var(--pui-color-gray-500);
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
		padding: 0 var(--pui-spacing-4);
		color: var(--pui-text-secondary);
		font-size: var(--pui-font-size-sm);
		line-height: var(--pui-line-height-relaxed);
	}

	:global(.dark) .accordion-content {
		color: var(--pui-color-gray-300);
	}

	.accordion-panel.open .accordion-content {
		padding-bottom: var(--pui-spacing-4);
	}
</style>
