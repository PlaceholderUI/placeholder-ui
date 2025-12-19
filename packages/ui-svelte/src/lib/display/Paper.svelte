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
		border-radius: var(--pui-radius-base);
		position: relative;
		padding: var(--pui-spacing-3);
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
		background-color: var(--pui-paper-body-bg);
	}

	.paper {
		box-shadow: var(--pui-shadow-sm);
		display: flex;
		flex-direction: column;
	}

	.paper-title {
		border-bottom: 1px solid var(--pui-border-disabled);
		background: var(--pui-paper-title-bg);
		border-color: var(--pui-paper-title-border);
		border-top-left-radius: var(--pui-radius-base);
		border-top-right-radius: var(--pui-radius-base);
		font-weight: var(--pui-font-weight-semibold);
		display: flex;
		justify-content: space-between;
	}

	:global(.dark) .paper-title {
		border-bottom: none;
	}

	.paper-title-text {
		padding: var(--pui-spacing-2) var(--pui-spacing-3);
	}

	.paper-title-buttons {
		margin-right: var(--pui-spacing-2);
		display: flex;
		align-items: center;
		gap: var(--pui-spacing-1);
	}

	.gap {
		display: flex;
		flex-direction: column;
		gap: var(--pui-spacing-2);
	}

	.p-0 {
		padding: 0;
	}
</style>
