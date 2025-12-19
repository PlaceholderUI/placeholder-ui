<!-- drop down component that displays a button, when clicked on the children expand -->
<script lang="ts">
	import Button from './Button.svelte';
	import type { Hyperlink } from '../models/Hyperlink.js';
	import LinkCollection from '../display/LinkCollection.svelte';
	import { iconChevronDown } from '../icon/index.js';

	interface Props {
		show?: boolean;
		label: string | undefined;
		buttonSvg?: string | undefined;
		links?: Hyperlink[] | Hyperlink[][];
		class?: string;
		alignToButton?: 'left' | 'right';
	}

	let {
		show = $bindable(false),
		label,
		buttonSvg = iconChevronDown,
		links = [],
		class: classes = '',
		alignToButton = 'left'
	}: Props = $props();
</script>

<div class="dropdown {classes} {alignToButton}">
	<Button class="ps-2" svg={buttonSvg} onclick={() => (show = !show)}>
		{label}
	</Button>
	{#if show}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="dropdown-content" onclick={(e) => e.stopPropagation()}>
			{#if links.length > 0 && Array.isArray(links[0])}
				{#each links as group}
					<div class="dropdown-group">
						<LinkCollection links={group as Hyperlink[]} noOutsideBorder noSeperator />
					</div>
				{/each}
			{:else if links.length > 0}
				<LinkCollection links={links as Hyperlink[]} noOutsideBorder noSeperator />
			{/if}
		</div>
	{/if}
</div>

<style>
	.dropdown {
		position: relative;
	}

	.dropdown-content {
		position: absolute;
		top: 100%;
		left: 0;
		background-color: var(--pui-paper-body-bg);
		min-width: 160px;
		box-shadow: var(--pui-shadow-lg);
		z-index: var(--pui-z-dropdown);
		border-radius: var(--pui-radius-sm);
		overflow: hidden;
		border: 1px solid var(--pui-border-default);
	}

	.dropdown-group {
		display: flex;
		flex-direction: column;
	}

	.dropdown-group:not(:last-child) {
		border-bottom: 1px solid var(--pui-border-default);
	}

	.dropdown-content :global(a) {
		display: block;
		padding: var(--pui-spacing-2) var(--pui-spacing-3);
		text-decoration: none;
		color: var(--pui-color-primary);
		transition: background-color var(--pui-transition-fast) var(--pui-ease-out);
	}

	.dropdown-content :global(a:hover) {
		background-color: var(--pui-bg-hover);
	}

	.dropdown.right .dropdown-content {
		left: auto;
		right: 0;
	}

	:global(.dark) {
		.dropdown-content :global(a) {
			color: var(--pui-color-secondary);
		}
	}
</style>
