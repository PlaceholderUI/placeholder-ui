<script lang="ts">
	import type { Hyperlink } from '../models/Hyperlink.js';
	import Icon from '../icon/Icon.svelte';
	import Link from '../ui/Link.svelte';
	import type { LinkCollectionItem } from '../models/LinkCollectionItem.js';

	interface Props {
		links?: Hyperlink[];
		items?: LinkCollectionItem[];
		classes?: string;
		footerButtons?: Hyperlink[];
		notRounded?: boolean;
		noOutsideBorder?: boolean;
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
	}: Props = $props();
</script>

<div
	class="link-collection {classes} {notRounded ? 'not-rounded' : ''} {noOutsideBorder
		? 'no-outside-border'
		: ''} {noSeperator ? 'no-seperator' : ''}"
>
	{#each links as link}
		<Link class="link" target={link.newTab ? '_blank' : undefined} href={link.href}>
			{#if link.svg}
				<Icon svg={link.svg} size="18px" />
			{/if}
			{link.text}
		</Link>
	{/each}
	{#each items as item}
		<Link class="link item" target={item.newTab ? '_blank' : undefined} href={item.href}>
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
					<Link class="link" target={button.newTab ? '_blank' : undefined} href={button.href}>
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
		border: 1px solid var(--pui-border-default);
		border-radius: var(--pui-radius-md);
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
		gap: var(--pui-spacing-2);
	}

	.link-inner.left {
		flex: 1;
	}

	.link-collection :global(.link) {
		transition: all var(--pui-transition-fast) var(--pui-ease-in-out);
		border-bottom: 1px solid var(--pui-border-default);
		padding: var(--pui-spacing-2);
		display: flex;
		align-items: center;
		gap: var(--pui-spacing-2);
		text-decoration: none;
		color: var(--pui-color-accent);
		font-weight: normal;

		&:hover {
			background: var(--pui-bg-hover);
		}

		&:last-child {
			border-bottom: none;
		}
	}

	:global(.dark) {
		.link-collection :global(.link) {
			color: var(--pui-color-accent);
		}

		.link-collection :global(.link) {
			&:hover {
				background: var(--pui-bg-hover);
			}
		}
	}

	.footer {
		display: flex;
	}

	.footer-button {
		flex: 1;
		border-right: 1px solid var(--pui-border-default);
	}

	.link-collection .footer-button :global(.link) {
		font-weight: var(--pui-font-weight-semibold);
	}

	.footer-button:last-child {
		border-right: none;
	}

	.footer-button :global(.link) {
		flex-grow: 1;
		justify-content: center;
	}
</style>
