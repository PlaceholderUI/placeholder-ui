<script lang="ts" module>
	// One lock shared by every instance so a nested dialog closing does not
	// hand the page its scrollbar back while the parent is still open
	let lockCount = 0;
	let savedOverflow = '';
	let savedPaddingRight = '';

	function lockBodyScroll() {
		if (lockCount++ > 0) return;
		const body = document.body;
		savedOverflow = body.style.overflow;
		savedPaddingRight = body.style.paddingRight;
		// Hiding the scrollbar widens the page and shifts everything sideways,
		// which reads as a flicker behind the backdrop; pad by its width instead
		const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
		if (scrollbarWidth > 0) {
			const current = parseFloat(getComputedStyle(body).paddingRight) || 0;
			body.style.paddingRight = `${current + scrollbarWidth}px`;
		}
		body.style.overflow = 'hidden';
	}

	function unlockBodyScroll() {
		if (--lockCount > 0) return;
		document.body.style.overflow = savedOverflow;
		document.body.style.paddingRight = savedPaddingRight;
	}
</script>

<script lang="ts">
	import Paper from '$lib/display/Paper.svelte';
	import { iconX } from '$lib/icon/index.js';
	import type { Snippet } from 'svelte';
	import ActionIcon from './ActionIcon.svelte';
	import { setContext, untrack } from 'svelte';

	export interface DialogContext {
		/** Whether the dialog is currently open (reactive) */
		readonly isOpen: boolean;
		/** Register a callback invoked each time the dialog opens */
		onOpen: (callback: () => void) => void;
		/** Register a callback invoked each time the dialog closes */
		onClose: (callback: () => void) => void;
		/** Register a callback invoked only the first time the dialog opens */
		onFirstOpen: (callback: () => void) => void;
	}

	export interface DialogProps {
		/** Whether the dialog is visible (bindable) */
		show: boolean;
		/** Allow closing by clicking backdrop or pressing Escape */
		allowImplicitClose?: boolean;
		/** Dialog title displayed in the header */
		title?: string | undefined;
		/** Render without the Paper wrapper component */
		noPaper?: boolean;
		/**
		 * Let content overflow the dialog bounds instead of scrolling inside it.
		 * The body scrolls by default; dropdowns, pickers and tooltips render in
		 * the browser's top layer, so they are never clipped by that scroll.
		 */
		allowOverflow?: boolean;
		/** @deprecated Scrolling is now the default; use `allowOverflow` to opt out. */
		preventOverflow?: boolean;
		/** Size preset for the dialog width */
		size?: 'md' | 'lg' | 'xl' | 'full';
		/** Additional CSS classes */
		class?: string;
		/** Footer content (typically action buttons) */
		footer?: Snippet;
		/** Main dialog content */
		children?: Snippet;
	}

	let {
		show = $bindable(false),
		allowImplicitClose = true,
		title = undefined,
		noPaper = false,
		allowOverflow = false,
		preventOverflow = false,
		size = 'md',
		class: classes = '',
		footer,
		children
	}: DialogProps = $props();

	const uid = $props.id();

	// preventOverflow is the legacy opt-in for the behaviour that is now default,
	// so it wins over allowOverflow when both are set
	const overflowClass = $derived(
		allowOverflow && !preventOverflow ? 'overflow-visible' : 'overflow-y-auto'
	);
	const titleId = `${uid}-title`;

	let dialogElement: HTMLDialogElement | undefined = $state(undefined);

	// Context so child components can react to dialog state
	const openCallbacks: (() => void)[] = [];
	const closeCallbacks: (() => void)[] = [];
	const firstOpenCallbacks: (() => void)[] = [];

	setContext<DialogContext>('dialog', {
		get isOpen() {
			return show;
		},
		onOpen: (callback) => openCallbacks.push(callback),
		onClose: (callback) => closeCallbacks.push(callback),
		onFirstOpen: (callback) => firstOpenCallbacks.push(callback)
	});

	// Plain (untracked) flags — only the `show` transition should re-run the effect
	let wasOpen = false;
	let hasOpenedBefore = false;

	$effect(() => {
		if (!dialogElement) return;

		if (show && !wasOpen) {
			wasOpen = true;
			dialogElement.showModal();
			untrack(() => {
				for (const callback of openCallbacks) callback();
				if (!hasOpenedBefore) {
					hasOpenedBefore = true;
					for (const callback of firstOpenCallbacks) callback();
				}
			});
		} else if (!show && wasOpen) {
			wasOpen = false;
			dialogElement.close();
			untrack(() => {
				for (const callback of closeCallbacks) callback();
			});
		}
	});

	// Lock body scroll while open; effects only run in the browser, so this is SSR-safe
	$effect(() => {
		if (show) {
			lockBodyScroll();
			return unlockBodyScroll;
		}
	});

	function onCancel(e: Event) {
		// Escape closes the native dialog before `close` fires; block it here,
		// otherwise the dialog closes while `show` stays true
		if (!allowImplicitClose) e.preventDefault();
	}

	function onNativeClose() {
		// The dialog has already closed natively (Escape, form method="dialog");
		// sync `show` unconditionally so it can be reopened
		show = false;
	}

	function onBackdropMousedown() {
		if (allowImplicitClose) show = false;
	}

	function stopMousedown(e: Event) {
		// Keep mousedowns inside the dialog from reaching the backdrop handler
		e.stopPropagation();
	}
</script>

{#snippet DialogInner()}
	{#if title}
		<div class="dialog-title">
			<span id={titleId} class="dialog-title-text">{title}</span>
			{#if allowImplicitClose}
				<ActionIcon
					onclick={() => (show = false)}
					variant="secondary-subtle"
					class="dialog-close"
					svg={iconX}
					size="1rem"
					ariaLabel="Close dialog"
				/>
			{/if}
		</div>
	{/if}
	<div class="dialog-body {overflowClass}">
		{@render children?.()}
	</div>
	{#if footer}
		<div class="dialog-footer">
			{@render footer?.()}
		</div>
	{/if}
{/snippet}

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<dialog
	bind:this={dialogElement}
	oncancel={onCancel}
	onclose={onNativeClose}
	onmousedown={onBackdropMousedown}
	class={`dialog ${size}`}
	aria-labelledby={title ? titleId : undefined}
>
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="dialog-inner {noPaper ? `${classes} dialog-no-paper` : ''}"
		onmousedown={stopMousedown}
	>
		{#if noPaper}
			{@render DialogInner()}
		{:else}
			<div class="dialog-paper">
				<!-- Dialog owns the section padding so header and footer dividers span the card -->
				<Paper containerClass={classes} noPadding noGap>
					{@render DialogInner()}
				</Paper>
			</div>
		{/if}
	</div>
</dialog>

<style>
	/* Open/close is a transition driven by [open] plus @starting-style, not a
	   keyframe animation. Keyframes with a `forwards` fill kept a transform
	   applied while open, and the backdrop's static colour could paint for a
	   frame before its animation took over, showing as a flash on open.
	   Transitions have no fill state: the closed values are the base rule, the
	   open values live on [open], and @starting-style supplies the from-values
	   for the first frame after display switches on */
	dialog {
		/* Everything that shapes the box lives here, not on [open]: the close
		   transition runs after [open] is removed, so rules scoped to it would
		   drop out while the dialog is still fading. That includes the browser's
		   own :modal positioning, which stops applying the moment close() runs */
		position: fixed;
		inset: 0;
		flex-direction: column;
		color: var(--text-color);
		border: none;
		/* The dialog element itself is focused by showModal(); don't draw a
		   focus ring around the whole dialog */
		outline: none;
		background-color: transparent;
		overflow: visible;
		margin: auto;
		max-width: calc(100% - 2rem);
		/* Cap to the visible viewport with equal margins; the flex chain below
		   (dialog > inner > paper > body, each min-height: 0) passes this limit
		   down so the body shrinks instead of spilling past the bottom edge.
		   dvh tracks the visible viewport on iOS Safari (100vh includes the
		   area behind the collapsible URL bar); vh is the older-browser fallback */
		max-height: calc(100vh - 2rem);
		max-height: calc(100dvh - 2rem);

		opacity: 0;
		/* Animate transform, not margin: the native dialog centres itself via
		   `margin: auto` */
		transform: translateY(-0.5rem);
		transition:
			opacity 0.2s ease,
			transform 0.2s ease,
			display 0.2s allow-discrete,
			overlay 0.2s allow-discrete;
	}

	dialog[open] {
		/* Only when [open] — an unconditional author display would override
		   the UA's display: none on closed dialogs and make them visible */
		display: flex;
		opacity: 1;
		/* `none`, not translateY(0): a transform of any value makes the dialog
		   the containing block for position: fixed descendants */
		transform: none;
	}

	@starting-style {
		dialog[open] {
			opacity: 0;
			transform: translateY(-0.5rem);
		}
	}

	dialog::backdrop {
		background-color: rgb(0 0 0 / 0);
		transition:
			background-color 0.2s ease,
			display 0.2s allow-discrete,
			overlay 0.2s allow-discrete;
	}

	dialog[open]::backdrop {
		background-color: rgb(0 0 0 / 0.65);
	}

	@starting-style {
		dialog[open]::backdrop {
			background-color: rgb(0 0 0 / 0);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		dialog,
		dialog::backdrop {
			transition-duration: 0.01ms;
		}
	}

	.dialog-inner {
		display: flex;
		flex-direction: column;
		min-height: 0;
	}

	/* Paper sits inside the height chain. Without a gap its body is a plain
	   block, so make it a shrinkable flex column here; the sections below rely
	   on that to give the body the leftover height */
	.dialog :global(.paper),
	.dialog :global(.paper-body) {
		display: flex;
		flex-direction: column;
		min-height: 0;
	}

	/* Section padding: 1rem inset, 0.75rem vertical for the header and footer,
	   1rem for the body. Dividers run edge to edge */
	.dialog-title {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		padding: 0.75rem 1rem;
		border-bottom: 1px solid var(--border-color);
		flex-shrink: 0;
	}

	.dialog-title-text {
		font-size: 1.0625rem;
		font-weight: 600;
		line-height: 1.4;
		min-width: 0;
		overflow-wrap: anywhere;
	}

	/* Keep the close button from setting the header height: its hit area
	   overhangs the text line and the right inset instead */
	.dialog-title :global(button.dialog-close) {
		flex-shrink: 0;
		padding: 0.25rem;
		margin: -0.25rem -0.5rem -0.25rem 0;
		line-height: 0;
	}

	/* The only scroll container. Padding lives inside it so focus rings and
	   negative-margin rows are not clipped, and the scrollbar hugs the edge */
	.dialog-body {
		display: flex;
		flex-direction: column;
		min-width: 0;
		min-height: 0;
		flex-shrink: 1;
		padding: 1rem;
	}

	/* The body padding is the spacing; don't let the first and last elements
	   (or a wrapper's first and last) add their own margins on top of it */
	.dialog-body > :global(:first-child),
	.dialog-body > :global(:first-child > :first-child) {
		margin-top: 0;
	}

	.dialog-body > :global(:last-child),
	.dialog-body > :global(:last-child > :last-child) {
		margin-bottom: 0;
	}

	/* Actions align right. A secondary action can sit on the left with
	   `margin-right: auto` */
	.dialog-footer {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 0.5rem;
		padding: 0.75rem 1rem;
		border-top: 1px solid var(--border-color);
		flex-shrink: 0;
	}

	.overflow-visible {
		overflow: visible;
	}

	.overflow-y-auto {
		overflow-y: auto;
	}

	.dialog-paper,
	.dialog-no-paper {
		display: flex;
		flex-direction: column;
		min-height: 0;
	}

	.dialog-no-paper {
		border-radius: 0.25rem;
		background-color: var(--paper-body-bg);
	}

	.dialog.md {
		width: 30rem;
	}

	.dialog.lg {
		width: 40rem;
	}

	.dialog.xl {
		width: 50rem;
	}

	.dialog.full {
		width: 100%;
		max-width: 100%;
		max-height: 100%;
		margin-top: auto;
		/* Full-screen fades in place; more specific than the @starting-style
		   rule above, so it wins for both the starting and the open state */
		transform: none;
	}

	.dialog.full,
	.dialog.full .dialog-inner,
	.dialog.full :global(.paper),
	.dialog.full .dialog-paper {
		height: 100%;
	}

	.dialog.full .dialog-body {
		flex-grow: 1;
	}
</style>
