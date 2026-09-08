<!-- drop down component that displays a button, when clicked on the children expand -->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import Button from './Button.svelte';
	import { clickOutside } from '$lib/util/ClickOutside.js';
	import { floating } from '$lib/util/Floating.js';

	type PopoverPosition = 'top' | 'bottom' | 'left' | 'right';
	type PopoverTrigger = 'click' | 'hover';

	export interface PopoverProps {
		/** Whether the popover is visible (bindable) */
		show?: boolean;
		/** Text label for the default trigger button */
		label?: string | undefined;
		/** Position of the popover relative to trigger */
		position?: PopoverPosition;
		/** Additional CSS classes */
		class?: string;
		/** Custom width for the popover content */
		cssWidth?: string;
		/** Custom trigger button content */
		button?: Snippet;
		/** Popover content */
		children?: Snippet;
		/** How to trigger the popover */
		trigger?: PopoverTrigger;
		/** Delay before showing on hover (ms) */
		hoverDelay?: number;
	}

	let {
		show = $bindable(false),
		label,
		position = 'bottom',
		class: classes = '',
		cssWidth = 'auto',
		button,
		children,
		trigger = 'click',
		hoverDelay = 1000
	}: PopoverProps = $props();

	let triggerElement: HTMLElement | undefined = $state(undefined);
	let hoverTimeout: ReturnType<typeof setTimeout> | null = null;
	let isHovering = false;

	function handleMouseEnter() {
		if (trigger === 'hover') {
			isHovering = true;
			hoverTimeout = setTimeout(() => {
				if (isHovering) {
					show = true;
				}
			}, hoverDelay);
		}
	}

	function handleMouseLeave() {
		if (trigger === 'hover') {
			isHovering = false;
			if (hoverTimeout) {
				clearTimeout(hoverTimeout);
				hoverTimeout = null;
			}
			// Add a small delay before closing to prevent flickering when moving to content
			setTimeout(() => {
				if (!isHovering) {
					show = false;
				}
			}, 100);
		}
	}

	function handleClick() {
		if (trigger === 'click') {
			show = !show;
		}
	}

	function handleContentMouseEnter() {
		if (trigger === 'hover') {
			isHovering = true;
		}
	}

	function handleContentMouseLeave() {
		if (trigger === 'hover') {
			isHovering = false;
			setTimeout(() => {
				if (!isHovering) {
					show = false;
				}
			}, 100);
		}
	}
</script>

<div class="d-flex">
	<div class="popover {classes}" use:clickOutside={() => trigger === 'click' && (show = false)}>
		{#if button}
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<!-- svelte-ignore a11y_mouse_events_have_key_events -->
			<button
				type="button"
				bind:this={triggerElement}
				onclick={handleClick}
				onmouseenter={handleMouseEnter}
				onmouseleave={handleMouseLeave}
			>
				{@render button?.()}
			</button>
		{:else}
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<!-- svelte-ignore a11y_mouse_events_have_key_events -->
			<div
				bind:this={triggerElement}
				onmouseenter={handleMouseEnter}
				onmouseleave={handleMouseLeave}
			>
				<Button onclick={handleClick}>
					{label}
				</Button>
			</div>
		{/if}
		{#if show}
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<!-- svelte-ignore a11y_mouse_events_have_key_events -->
			<!-- Rendered in the top layer so a scrolling Dialog body cannot clip it.
			     data-placement (set by use:floating, after any flip) drives the arrow. -->
			<div
				class="popover-content"
				data-placement={position}
				use:floating={{ anchor: () => triggerElement, placement: position, offset: 6 }}
				onclick={(e) => e.stopPropagation()}
				onmouseenter={handleContentMouseEnter}
				onmouseleave={handleContentMouseLeave}
				style="width: {cssWidth}"
			>
				{@render children?.()}
			</div>
		{/if}
	</div>
</div>

<style>
	.popover {
		position: relative;
	}

	/* Position and top-layer promotion come from use:floating */
	.popover-content {
		display: block;
		background-color: var(--paper-body-bg);
		border: 1px solid var(--border-color);
		min-width: 160px;
		box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
		z-index: 1000;
		border-radius: 4px;
	}

	/* Arrow indicators for each resolved placement */
	.popover-content::before {
		content: '';
		position: absolute;
		border: 6px solid transparent;
	}

	.popover-content[data-placement='bottom']::before {
		top: -12px;
		left: 50%;
		transform: translateX(-50%);
		border-bottom-color: var(--border-color);
	}

	.popover-content[data-placement='top']::before {
		bottom: -12px;
		left: 50%;
		transform: translateX(-50%);
		border-top-color: var(--border-color);
	}

	.popover-content[data-placement='right']::before {
		top: 50%;
		left: -12px;
		transform: translateY(-50%);
		border-right-color: var(--border-color);
	}

	.popover-content[data-placement='left']::before {
		top: 50%;
		right: -12px;
		transform: translateY(-50%);
		border-left-color: var(--border-color);
	}

	/* clear all button styles */
	.popover button {
		background: none;
		border: none;
		color: inherit;
		cursor: pointer;
		padding: 0;
		font: inherit;
	}
</style>
