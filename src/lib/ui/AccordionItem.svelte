<script lang="ts">
	import { getContext } from 'svelte';
	import type { Snippet } from 'svelte';
	import { slide } from 'svelte/transition';
	import Icon from '#lib/icon/Icon.svelte';
	import { iconChevronDown } from '#lib/icon/index.js';
	import { beforeMatch } from '#lib/util/BeforeMatch.js';
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
		/** Keep this item's content in the page while collapsed, overriding the accordion-level `renderHidden` */
		renderHidden?: boolean;
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
		renderHidden,
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
	const keepRendered = $derived(renderHidden ?? accordion.renderHidden);
	const contentId = `${uid}-content`;
	const headerId = `${uid}-header`;

	// With `renderHidden` the content stays mounted, so the slide transition never runs.
	// Animate its height on toggle instead.
	let contentEl = $state<HTMLDivElement>();
	let shownOpen: boolean | undefined;
	let animation: Animation | undefined;
	let revealedByFind = false;

	$effect(() => {
		const el = contentEl;
		const isOpen = open;
		if (!el || shownOpen === undefined || shownOpen === isOpen || revealedByFind) {
			shownOpen = el ? isOpen : undefined;
			revealedByFind = false;
			return;
		}
		shownOpen = isOpen;

		// Svelte has already hidden it; keep it visible until it has slid shut
		if (!isOpen) el.removeAttribute('hidden');
		const from =
			animation?.playState === 'running'
				? el.getBoundingClientRect().height
				: isOpen
					? 0
					: el.scrollHeight;
		animation?.cancel();
		animation = el.animate(
			[{ height: `${from}px` }, { height: `${isOpen ? el.scrollHeight : 0}px` }],
			{ duration: 200, easing: 'ease-out' }
		);
		if (!isOpen) {
			animation.onfinish = () => el.setAttribute('hidden', 'until-found');
		}
	});

	// Find-in-page has already revealed the content; open the item to match, without animating
	function openFromFind() {
		if (open) return;
		revealedByFind = true;
		accordion.toggle(value);
	}
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

	{#snippet body()}
		<div class="accordion-body">
			{@render children?.()}
		</div>
	{/snippet}

	{#if keepRendered}
		<div
			bind:this={contentEl}
			id={contentId}
			class="accordion-content"
			role="region"
			aria-labelledby={headerId}
			hidden={open ? undefined : 'until-found'}
			use:beforeMatch={openFromFind}
		>
			{@render body()}
		</div>
	{:else if open}
		<div
			id={contentId}
			class="accordion-content"
			role="region"
			aria-labelledby={headerId}
			transition:slide={{ duration: 200 }}
		>
			{@render body()}
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
		--accordion-open-color: var(--ui-primary-text-color);
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

	.variant-accent {
		--accordion-open-bg: var(--ui-accent);
		--accordion-open-color: var(--ui-accent-contrast-color);
	}

	.variant-accent-subtle {
		--accordion-open-bg: rgba(var(--ui-accent-rgbc), 0.15);
		--accordion-open-color: var(--ui-accent-text-color);
	}

	.variant-accent-outline {
		--accordion-open-bg: transparent;
		--accordion-open-color: var(--ui-accent-text-color);
		--accordion-open-border-color: var(--ui-accent-text-color);
	}

	.variant-primary {
		--accordion-open-bg: var(--ui-primary);
		--accordion-open-color: var(--ui-primary-contrast-color);
	}

	.variant-primary-subtle {
		--accordion-open-bg: rgba(var(--ui-primary-rgbc), 0.1);
		--accordion-open-color: var(--ui-primary-text-color);
	}

	.variant-primary-outline {
		--accordion-open-bg: transparent;
		--accordion-open-color: var(--ui-primary-text-color);
		--accordion-open-border-color: var(--ui-primary-text-color);
	}

	.variant-tertiary {
		--accordion-open-bg: var(--ui-tertiary);
		--accordion-open-color: var(--ui-tertiary-contrast-color);
	}

	.variant-tertiary-outline {
		--accordion-open-bg: transparent;
		--accordion-open-color: var(--ui-tertiary-text-color);
		--accordion-open-border-color: var(--ui-tertiary-text-color);
	}

	.variant-tertiary-subtle {
		--accordion-open-bg: color-mix(in srgb, var(--ui-tertiary-text-color) 25%, transparent);
		--accordion-open-color: var(--ui-tertiary-text-color);
	}

	.variant-auto-outline {
		--accordion-open-bg: transparent;
		--accordion-open-color: var(--ui-primary-text-color);
		--accordion-open-border-color: var(--ui-primary-text-color);
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
