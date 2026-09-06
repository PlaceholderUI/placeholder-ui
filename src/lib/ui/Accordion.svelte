<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { ButtonVariant } from './ButtonVariant.js';

	export type AccordionSize = 'sm' | 'md';

	export interface AccordionTitleContext {
		/** Value of the item being rendered */
		value: string;
		/** The item's `title` prop */
		title: string;
		/** Whether the item is currently expanded */
		open: boolean;
		/** Whether the item is disabled */
		disabled: boolean;
	}

	export interface AccordionContext {
		/** Whether the given item value is currently expanded (reactive) */
		isOpen: (value: string) => boolean;
		/** Toggle the expanded state for the given item value */
		toggle: (value: string) => void;
		/** Accordion-level snippet used to render item titles */
		readonly itemTitle?: Snippet<[AccordionTitleContext]>;
		/** Size variant applied to all items */
		readonly size: AccordionSize;
		/** Colour variant applied to expanded item headers. Items can override individually */
		readonly variant: ButtonVariant;
	}
</script>

<script lang="ts">
	import { setContext } from 'svelte';

	export interface AccordionProps {
		/** Allow more than one item to be expanded at the same time */
		multiple?: boolean;
		/** Value(s) of the expanded item(s) (bindable). String when `multiple` is false, array otherwise */
		value?: string | string[];
		/** Callback when the expanded value(s) change */
		onchange?: (value: string | string[]) => void;
		/** Size variant applied to all items */
		size?: AccordionSize;
		/** Colour scheme for expanded item headers, using the Button variants. Items can override individually */
		variant?: ButtonVariant;
		/** Custom snippet rendered as the title of every item. Item-level `header` snippets take precedence */
		itemTitle?: Snippet<[AccordionTitleContext]>;
		/** AccordionItem children */
		children?: Snippet;
	}

	let {
		multiple = false,
		value = $bindable(multiple ? [] : ''),
		onchange,
		size = 'md',
		variant = 'primary',
		itemTitle,
		children
	}: AccordionProps = $props();

	const openValues = $derived(Array.isArray(value) ? value : value ? [value] : []);

	function isOpen(itemValue: string): boolean {
		return openValues.includes(itemValue);
	}

	function toggle(itemValue: string): void {
		if (multiple) {
			const current = Array.isArray(value) ? value : value ? [value] : [];
			value = current.includes(itemValue)
				? current.filter((v) => v !== itemValue)
				: [...current, itemValue];
		} else {
			value = value === itemValue ? '' : itemValue;
		}
		onchange?.(value);
	}

	setContext<AccordionContext>('accordion', {
		isOpen,
		toggle,
		get itemTitle() {
			return itemTitle;
		},
		get size() {
			return size;
		},
		get variant() {
			return variant;
		}
	});
</script>

<div class="accordion">
	{@render children?.()}
</div>

<style>
	.accordion {
		display: flex;
		flex-direction: column;
		border: 1px solid var(--border-color);
		border-radius: 0.375rem;
		overflow: hidden;
		background: var(--paper-body-bg);
	}
</style>
