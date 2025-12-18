<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		containerClass?: string;
		bodyClass?: string;
		titleClass?: string;
		title?: string;
		noPadding?: boolean;
		noGap?: boolean;
		minBodyHeight?: string;
		onTitleClick?: () => void;
		buttons?: Snippet;
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
	}: Props = $props();
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
		border-radius: 0.25rem;
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
		min-height: 60px;
	}

	.paper-body-bg {
		background-color: var(--paper-body-bg);
	}

	.paper {
		box-shadow:
			rgba(0, 0, 0, 0.05) 0px 1px 3px 0px,
			rgba(0, 0, 0, 0.1) 0px 1px 2px 0px;
		display: flex;
		flex-direction: column;
	}

	.paper-title {
		border-bottom: 1px solid #ccc;
		background: var(--paper-title-bg);
		border-color: var(--paper-title-border);
		border-top-left-radius: 0.25rem;
		border-top-right-radius: 0.25rem;
		font-weight: 600;
		display: flex;
		justify-content: space-between;

		/* bg-paper-title rounded-t font-semibold flex justify-between border-paper-border */
	}

	:global(.dark) .paper-title {
		border-bottom: none;
	}

	.paper-title-text {
		padding: 0.5rem 0.75rem;
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
