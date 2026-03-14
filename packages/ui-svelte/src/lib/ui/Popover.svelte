<!-- drop down component that displays a button, when clicked on the children expand -->
<script lang="ts">
	import type { Snippet } from "svelte";
	import Button from "./Button.svelte";
	import { clickOutside } from "../actions/ClickOutside.js";

	type PopoverPosition = "top" | "bottom" | "left" | "right";
	type PopoverTrigger = "click" | "hover";

	interface Props {
		show?: boolean;
		label?: string | undefined;
		position?: PopoverPosition;
		class?: string;
		cssWidth?: string;
		button?: Snippet;
		children?: Snippet;
		trigger?: PopoverTrigger;
		hoverDelay?: number;
	}

	let {
		show = $bindable(false),
		label,
		position = "bottom",
		class: classes = "",
		cssWidth = "auto",
		button,
		children,
		trigger = "click",
		hoverDelay = 1000,
	}: Props = $props();

	let hoverTimeout: ReturnType<typeof setTimeout> | null = null;
	let isHovering = false;

	function handleMouseEnter() {
		if (trigger === "hover") {
			isHovering = true;
			hoverTimeout = setTimeout(() => {
				if (isHovering) {
					show = true;
				}
			}, hoverDelay);
		}
	}

	function handleMouseLeave() {
		if (trigger === "hover") {
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
		if (trigger === "click") {
			show = !show;
		}
	}

	function handleContentMouseEnter() {
		if (trigger === "hover") {
			isHovering = true;
		}
	}

	function handleContentMouseLeave() {
		if (trigger === "hover") {
			isHovering = false;
			setTimeout(() => {
				if (!isHovering) {
					show = false;
				}
			}, 100);
		}
	}
</script>

<div class="popover-wrapper">
	<div
		class="popover {classes}"
		use:clickOutside={() => trigger === "click" && (show = false)}
	>
		{#if button}
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<!-- svelte-ignore a11y_mouse_events_have_key_events -->
			<button
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
			<div
				class="popover-content popover-{position}"
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
	.popover-wrapper {
		display: flex;
	}

	.popover {
		position: relative;
	}

	.popover-content {
		display: block;
		position: absolute;
		background-color: var(--pui-paper-body-bg);
		border: 1px solid var(--pui-border-default);
		min-width: 160px;
		box-shadow: var(--pui-shadow-lg);
		z-index: var(--pui-z-dropdown);
		border-radius: var(--pui-radius-base);
	}

	/* Position-specific styles */
	.popover-bottom {
		top: 100%;
		left: 50%;
		transform: translateX(-50%);
		margin-top: var(--pui-spacing-1);
	}

	.popover-top {
		bottom: 100%;
		left: 50%;
		transform: translateX(-50%);
		margin-bottom: var(--pui-spacing-1);
	}

	.popover-right {
		top: 50%;
		left: 100%;
		transform: translateY(-50%);
		margin-left: var(--pui-spacing-1);
	}

	.popover-left {
		top: 50%;
		right: 100%;
		transform: translateY(-50%);
		margin-right: var(--pui-spacing-1);
	}

	/* Arrow indicators for each position */
	.popover-content::before {
		content: "";
		position: absolute;
		border: 6px solid transparent;
	}

	.popover-bottom::before {
		top: -12px;
		left: 50%;
		transform: translateX(-50%);
		border-bottom-color: var(--pui-border-default);
	}

	.popover-top::before {
		bottom: -12px;
		left: 50%;
		transform: translateX(-50%);
		border-top-color: var(--pui-border-default);
	}

	.popover-right::before {
		top: 50%;
		left: -12px;
		transform: translateY(-50%);
		border-right-color: var(--pui-border-default);
	}

	.popover-left::before {
		top: 50%;
		right: -12px;
		transform: translateY(-50%);
		border-left-color: var(--pui-border-default);
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
