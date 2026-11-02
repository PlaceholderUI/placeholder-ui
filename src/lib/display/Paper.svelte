<script lang="ts">
	import type { Snippet } from 'svelte';

	export interface PaperProps {
		/** CSS classes for the outer container */
		containerClass?: string;
		/** CSS classes for the body section */
		bodyClass?: string;
		/** CSS classes for the title section */
		titleClass?: string;
		/** Title text displayed in the header */
		title?: string;
		/** Remove default padding from the body */
		noPadding?: boolean;
		/** Remove default gap between title and body */
		noGap?: boolean;
		/** Minimum height for the body section */
		minBodyHeight?: string;
		/** Callback when title is clicked */
		onTitleClick?: () => void;
		/** Action buttons displayed in the title bar */
		buttons?: Snippet;
		/** Main content of the paper */
		children?: Snippet;
	}

	let {
		containerClass = '',
		bodyClass = '',
		titleClass = '',
		title = '',
		noPadding = false,
		noGap = false,
		minBodyHeight,
		onTitleClick = () => {},
		buttons,
		children
	}: PaperProps = $props();
</script>

<div class="paper rounded {containerClass}">
	{#if title}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="paper-title {titleClass}" onclick={onTitleClick}>
			<div class="paper-title-text">{title}</div>
			<div class="paper-title-buttons">
				{@render buttons?.()}
			</div>
		</div>
	{/if}
	<div
		class="paper-body paper-body-bg rounded-b relative {bodyClass} 
		{title && 'rounded-t-none'}
		{noPadding && 'p-0'}
		{!noGap && 'gap'}"
		style="min-height: {minBodyHeight ? minBodyHeight : '0'};"
	>
		{@render children?.()}
	</div>
</div>

<style>
	.paper-body {
		border-radius: var(--paper-inner-radius);
		position: relative;
		padding: 0.75rem;
		flex-grow: 1;
	}

	.paper-body.rounded-t-none {
		border-top-left-radius: 0;
		border-top-right-radius: 0;
	}

	/* Stretch out the paper body so that a loader can show */
	.paper-body:has(> .loader) {
		min-height: 3.75rem;
	}

	/* The overlay loader covers the body, so follow its corners (square under a title) */
	.paper-body > :global(.loader) {
		border-radius: inherit;
	}

	.paper-body-bg {
		background-color: var(--paper-body-bg);
	}

	.paper-body :global(p:first-child) {
		margin-top: 0;
	}

	.paper-body :global(p:last-child) {
		margin-bottom: 0;
	}

	.paper {
		/* Inherited by the content, so children can match the corners: --paper-radius for the
		   outer edge, --paper-inner-radius for anything flush inside the 1px border (keeps the
		   inner curve parallel to the outer one) */
		--paper-radius: var(--ui-radius-lg);
		--paper-inner-radius: calc(var(--paper-radius) - 1px);
		border: 1px solid var(--border-color);
		border-radius: var(--paper-radius);
		display: flex;
		flex-direction: column;
	}

	.paper-title {
		border-bottom: 1px solid #ccc;
		background: var(--paper-title-bg);
		border-color: var(--paper-title-border);
		border-top-left-radius: var(--paper-inner-radius);
		border-top-right-radius: var(--paper-inner-radius);
		display: flex;
		justify-content: space-between;

		/* bg-paper-title rounded-t font-semibold flex justify-between border-paper-border */
	}

	:global(.dark) .paper-title {
		border-color: var(--border-color);
	}

	/* A Paper that holds other Papers becomes the outer shell: its own surfaces step down
	   towards the page so the nested Papers read as raised cards. Dialog renders its content
	   in a Paper and its <dialog> stays where it is declared, so Papers inside a dialog only
	   count for the dialog's own Paper, never for a page Paper around it */
	.paper:not(:global(dialog .paper)):has(:global(.paper-body .paper:not(dialog .paper))),
	:global(dialog) .paper:has(:global(.paper-body .paper)) {
		border-color: var(--paper-outer-border);

		> .paper-title {
			background: var(--paper-outer-title-bg);
			border-color: var(--paper-outer-border);
		}

		> .paper-body-bg {
			background-color: var(--paper-outer-body-bg);
		}
	}

	.paper-title-text {
		padding: 0.5rem 0.75rem;
		font-weight: 600;
	}

	.paper-title-buttons {
		margin-right: 0.5rem;
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}

	.gap {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.p-0 {
		padding: 0;
	}
</style>
