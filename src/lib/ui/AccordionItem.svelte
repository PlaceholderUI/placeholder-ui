<script lang="ts">
	import { getContext } from 'svelte';
	import type { Snippet } from 'svelte';
	import { slide } from 'svelte/transition';
	import Icon from '$lib/icon/Icon.svelte';
	import { iconChevronDown } from '$lib/icon/index.js';
	import type { AccordionContext } from './Accordion.svelte';
	import type { ButtonVariant } from './ButtonVariant.js';

	export interface AccordionItemProps {
		/** Unique value identifying this item. Defaults to a generated id */
		value?: string;
		/** Header text. Ignored when the `header` snippet is provided */
		title?: string;
		/** Optional leading icon (raw SVG string) shown before the title */
		icon?: string;
		/** Prevent the item from being toggled */
		disabled?: boolean;
		/** Colour variant for this item's expanded header, overriding the accordion-level variant */
		variant?: ButtonVariant;
		/** Custom header content, replaces `title` */
		header?: Snippet;
		/** Collapsible body content */
		children?: Snippet;
	}

	const uid = $props.id();

	let {
		value = uid,
		title = '',
		icon,
		disabled = false,
		variant,
		header,
		children
	}: AccordionItemProps = $props();

	const accordion = getContext<AccordionContext>('accordion');

	if (!accordion) {
		throw new Error('AccordionItem must be used inside an Accordion');
	}

	const open = $derived(accordion.isOpen(value));
	const small = $derived(accordion.size === 'sm');
	const iconSize = $derived(small ? '16' : '18');
	const effectiveVariant = $derived(variant ?? accordion.variant);
	const contentId = `${uid}-content`;
	const headerId = `${uid}-header`;
</script>

<div class="accordion-item variant-{effectiveVariant}" class:open class:small>
	<h3 class="accordion-heading">
		<button
			id={headerId}
			class="accordion-trigger"
			type="button"
			aria-expanded={open}
			aria-controls={contentId}
			{disabled}
			onclick={() => accordion.toggle(value)}
		>
			{#if icon}
				<Icon svg={icon} size={iconSize} class="accordion-leading-icon" />
			{/if}
			<span class="accordion-title">
				{#if header}
					{@render header()}
				{:else if accordion.itemTitle}
					{@render accordion.itemTitle({ value, title, open, disabled })}
				{:else}
					{title}
				{/if}
			</span>
			<span class="accordion-chevron" class:rotated={open}>
				<Icon svg={iconChevronDown} size={iconSize} />
			</span>
		</button>
	</h3>

	{#if open}
		<div
			id={contentId}
			class="accordion-content"
			role="region"
			aria-labelledby={headerId}
			transition:slide={{ duration: 200 }}
		>
			<div class="accordion-body">
				{@render children?.()}
			</div>
		</div>
	{/if}
</div>

<style>
	.accordion-item {
		border-bottom: 1px solid var(--border-color);
	}

	.accordion-item:last-child {
		border-bottom: none;
	}

	.accordion-heading {
		margin: 0;
		font-size: inherit;
		font-weight: inherit;
	}

	.accordion-trigger {
		display: flex;
		align-items: center;
		gap: 0.625rem;
		width: 100%;
		padding: 0.875rem 1rem;
		border: none;
		background: transparent;
		color: var(--text-color);
		font-size: 0.9375rem;
		font-weight: 600;
		text-align: left;
		cursor: pointer;
		transition: background-color 0.15s ease-in-out;
	}

	.accordion-trigger:hover:not(:disabled) {
		background-color: rgba(var(--ui-primary-rgbc), 0.05);
	}

	.accordion-item.open .accordion-trigger {
		background-color: var(--accordion-open-bg, var(--ui-accent));
		color: var(--accordion-open-color, var(--ui-primary));
		box-shadow: inset 0 0 0 1px var(--accordion-open-border-color, transparent);
	}

	.accordion-item.open .accordion-chevron {
		color: var(--accordion-open-color, var(--ui-primary));
	}

	.accordion-trigger:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.accordion-trigger:focus-visible {
		outline: 2px solid var(--ui-primary);
		outline-offset: -2px;
	}

	.accordion-title {
		flex: 1;
		min-width: 0;
	}

	.accordion-chevron {
		display: inline-flex;
		color: var(--text-muted);
		transition: transform 0.2s ease-in-out;
	}

	.accordion-chevron.rotated {
		transform: rotate(180deg);
	}

	.accordion-content {
		overflow: hidden;
	}

	.accordion-body {
		padding: 0.875rem 1rem;
		color: var(--text-color);
		font-size: 0.9375rem;
		line-height: 1.5;
	}

	.accordion-item.small .accordion-trigger {
		gap: 0.5rem;
		padding: 0.5rem 0.75rem;
		font-size: 0.8125rem;
	}

	.accordion-item.small .accordion-body {
		padding: 0.5rem 0.75rem;
		font-size: 0.8125rem;
	}

	/* Variant colours for the expanded header, mirroring the Button variants.
	   `auto-subtle` defines nothing and falls through to the theme-aware defaults. */
	.variant-white {
		--accordion-open-bg: white;
		--accordion-open-color: var(--ui-primary);
	}

	.variant-secondary,
	.variant-shaded {
		--accordion-open-bg: var(--border-color);
		--accordion-open-color: var(--text-color);
	}

	.variant-secondary-subtle {
		--accordion-open-bg: #aaaaaa66;
		--accordion-open-color: var(--text-color);
	}

	.variant-secondary-selected {
		--accordion-open-bg: var(--accent-color);
		--accordion-open-color: white;
	}

	.variant-danger {
		--accordion-open-bg: var(--danger-bg);
		--accordion-open-color: white;
	}

	.variant-danger-subtle {
		--accordion-open-bg: var(--danger-bg-subtle);
		--accordion-open-color: var(--danger-text);
	}

	.variant-accent,
	.variant-pistachio {
		--accordion-open-bg: var(--ui-accent);
		--accordion-open-color: var(--ui-primary);
	}

	.variant-accent-subtle,
	.variant-pistachio-subtle {
		--accordion-open-bg: rgba(var(--ui-accent-rgbc), 0.15);
		--accordion-open-color: var(--text-color);
	}

	.variant-accent-outline,
	.variant-pistachio-outline {
		--accordion-open-bg: transparent;
		--accordion-open-color: var(--ui-accent);
		--accordion-open-border-color: var(--ui-accent);
	}

	.variant-primary,
	.variant-midnight {
		--accordion-open-bg: var(--ui-primary);
		--accordion-open-color: white;
	}

	.variant-primary-subtle,
	.variant-midnight-subtle {
		--accordion-open-bg: rgba(var(--ui-primary-rgbc), 0.1);
		--accordion-open-color: var(--text-color);
	}

	.variant-primary-outline,
	.variant-midnight-outline {
		--accordion-open-bg: transparent;
		--accordion-open-color: var(--ui-primary);
		--accordion-open-border-color: var(--ui-primary);
	}

	.variant-tertiary,
	.variant-turquoise {
		--accordion-open-bg: var(--ui-tertiary);
		--accordion-open-color: var(--ui-primary);
	}

	.variant-tertiary-subtle,
	.variant-turquoise-subtle {
		--accordion-open-bg: rgba(var(--ui-tertiary-dark-rgbc), 0.25);
		--accordion-open-color: var(--ui-tertiary-dark);
	}

	.variant-auto-outline {
		--accordion-open-bg: transparent;
		--accordion-open-color: var(--ui-primary);
		--accordion-open-border-color: var(--ui-primary);
	}

	:global(.dark) .variant-secondary-selected {
		--accordion-open-color: var(--ui-primary);
	}

	:global(.dark) .variant-auto-outline {
		--accordion-open-color: var(--ui-accent);
		--accordion-open-border-color: var(--ui-accent);
	}

	:global(.dark) .accordion-trigger:hover:not(:disabled) {
		background-color: rgba(var(--ui-accent-rgbc), 0.05);
	}

	:global(.dark) .accordion-item.open .accordion-trigger {
		background-color: var(--accordion-open-bg, var(--ui-primary));
		color: var(--accordion-open-color, var(--ui-accent));
	}

	:global(.dark) .accordion-item.open .accordion-chevron {
		color: var(--accordion-open-color, var(--ui-accent));
	}

	:global(.dark) .accordion-trigger:focus-visible {
		outline-color: var(--ui-accent);
	}
</style>
