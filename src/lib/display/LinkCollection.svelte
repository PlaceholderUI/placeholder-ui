<script lang="ts">
	import type { Hyperlink } from '$lib/models/Hyperlink.js';
	import Icon from '$lib/icon/Icon.svelte';
	import Link from '$lib/ui/Link.svelte';
	import type { LinkCollectionItem } from '$lib/models/LinkCollectionItem.js';

	export interface LinkCollectionProps {
		/** Array of simple hyperlinks */
		links?: Hyperlink[];
		/** Array of rich link items with more options */
		items?: LinkCollectionItem[];
		/** Additional CSS classes */
		classes?: string;
		/** Footer action buttons */
		footerButtons?: Hyperlink[];
		/** Disable rounded corners */
		notRounded?: boolean;
		/** Remove outside border */
		noOutsideBorder?: boolean;
		/** Remove separator lines between items */
		noSeperator?: boolean;
	}

	let {
		links = [],
		items = [],
		classes = '',
		footerButtons,
		notRounded = false,
		noOutsideBorder = false,
		noSeperator = false
	}: LinkCollectionProps = $props();
</script>

<div
	class="link-collection {classes} {notRounded ? 'not-rounded' : ''} {noOutsideBorder
		? 'no-outside-border'
		: ''} {noSeperator ? 'no-seperator' : ''}"
>
	{#each links as link}
		<Link
			class="link"
			target={link.newTab ? '_blank' : undefined}
			href={link.href}
			onclick={link.onclick}
		>
			{#if link.svg}
				<Icon svg={link.svg} size="18px" />
			{/if}
			{link.text}
		</Link>
	{/each}
	{#each items as item}
		<Link
			class="link item"
			target={item.newTab ? '_blank' : undefined}
			href={item.href}
			onclick={item.onclick}
		>
			<div class="link-inner left">
				{#if item.leftSvg}
					<Icon svg={item.leftSvg} size="18px" />
				{/if}
				<div>{@html item.leftContent}</div>
			</div>
			<div class="link-inner right">
				<div>{@html item.rightContent}</div>
				{#if item.rightSvg}
					<Icon svg={item.rightSvg} size="18px" />
				{/if}
			</div>
		</Link>
	{/each}
	{#if footerButtons && footerButtons.length > 0}
		<div class="footer">
			{#each footerButtons as button}
				<div class="footer-button">
					<Link
						class="link"
						target={button.newTab ? '_blank' : undefined}
						href={button.href}
						onclick={button.onclick}
					>
						{#if button.svg}
							<Icon svg={button.svg} size="18px" />
						{/if}
						{button.text}
					</Link>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.link-collection {
		display: flex;
		flex-direction: column;
		border: 1px solid var(--border-color);
		border-radius: 6px;
	}

	.link-collection.not-rounded {
		border-radius: 0;
	}

	.link-collection.no-outside-border {
		border: none;
	}

	.link-collection.no-seperator :global(.link) {
		border-bottom: none;
	}

	.link-collection :global(.link.item) {
		display: flex;
		justify-content: space-between;
	}

	.link-inner {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.link-inner.left {
		flex: 1;
	}

	.link-collection :global(.link) {
		transition: all 200ms;
		border-bottom: 1px solid var(--border-color);
		padding: 0.5rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		text-decoration: none;
		color: var(--ui-tertiary-dark);
		font-weight: normal;

		&:hover {
			background: #b7e1d8;
		}

		&:last-child {
			border-bottom: none;
		}
	}

	:global(.dark) {
		.link-collection :global(.link) {
			color: var(--ui-tertiary);
		}

		.link-collection :global(.link) {
			&:hover {
				background: var(--ui-primary);
			}
		}
	}

	.footer {
		display: flex;
	}

	.footer-button {
		flex: 1;
		border-right: 1px solid var(--border-color);
	}

	.link-collection .footer-button :global(.link) {
		font-weight: 600;
	}

	.footer-button:last-child {
		border-right: none;
	}

	.footer-button :global(.link) {
		flex-grow: 1;
		justify-content: center;
	}
</style>
