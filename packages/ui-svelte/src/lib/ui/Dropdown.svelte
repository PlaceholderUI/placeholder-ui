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
		background-color: var(--paper-body-bg);
		min-width: 160px;
		box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
		z-index: 1000;
		border-radius: 4px;
		overflow: hidden;
		border: 1px solid var(--border-color);
	}

	.dropdown-group {
		display: flex;
		flex-direction: column;
	}

	.dropdown-group:not(:last-child) {
		border-bottom: 1px solid var(--border-color);
	}

	.dropdown-content :global(a) {
		display: block;
		padding: 8px 12px;
		text-decoration: none;
		color: var(--midnight);
		transition: background-color 0.2s ease;
	}

	.dropdown-content :global(a:hover) {
		background-color: var(--border-color);
	}

	.dropdown.right .dropdown-content {
		left: auto;
		right: 0;
	}

	:global(.dark) {
		.dropdown-content :global(a) {
			color: var(--pistachio);
		}
	}
</style>
