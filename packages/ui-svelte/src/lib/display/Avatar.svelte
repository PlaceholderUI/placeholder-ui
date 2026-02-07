<script lang="ts">
	import { resolve } from '$app/paths';
	import Icon from '../icon/Icon.svelte';

	interface Props {
		src: string;
		alt?: string;
		size?: number;
		initials?: string;
		fallBackSvg?: string;
		class?: string;
		href?: string;
		backgroundColor?: string;
		shape?: 'circle' | 'rounded' | 'square';
		onClick?: () => void;
	}

	let {
		src,
		alt = '',
		initials = '',
		size = 2.5,
		class: classes = '',
		fallBackSvg,
		href,
		backgroundColor,
		shape = 'circle',
		onClick
	}: Props = $props();

	let imgExists = $state(true);
	const sizeText = $derived(size ? `${size}rem` : '');
	const svgSizeText = $derived(size ? `${size - 1}rem` : '');
	const initialsSizeText = $derived(size ? `${size / 2}rem` : '');

	function handleError() {
		imgExists = false;
	}
</script>

{#snippet img()}
	{#if imgExists && src}
		<img
			{src}
			{alt}
			class="avatar {shape}"
			style="width: {sizeText}; height: {sizeText};"
			onerror={handleError}
		/>
	{:else if initials}
		<div
			class="avatar {shape}"
			style="font-size: {initialsSizeText}; width: {sizeText}; height: {sizeText}; {backgroundColor
				? `background-color: ${backgroundColor};`
				: ''}"
		>
			{initials}
		</div>
	{:else if fallBackSvg}
		<div
			class="avatar {shape}"
			style="width: {sizeText}; height: {sizeText}; {backgroundColor
				? `background-color: ${backgroundColor};`
				: ''}"
		>
			<Icon svg={fallBackSvg} size={svgSizeText} />
		</div>
	{:else}
		<div
			class="avatar {shape}"
			style="width: {sizeText}; height: {sizeText}; background-color: {backgroundColor
				? backgroundColor
				: '#ccc'};"
		>
			?
		</div>
	{/if}
{/snippet}

<div class="avatar-container {classes}">
	{#if onClick}
		<button onclick={onClick}>
			{@render img()}
		</button>
	{:else if href}
		<a href={resolve((href ?? '') as any)}>
			{@render img()}
		</a>
	{:else}
		{@render img()}
	{/if}
</div>

<style>
	.avatar-container {
		display: inline-flex;
		position: relative;
	}

	.avatar-container button,
	.avatar-container a {
		display: inline-flex;
		background: none;
		border: none;
		color: var(--pui-color-black);
		padding: 0;
		transition: all var(--pui-transition-fast) var(--pui-ease-in-out);
		text-decoration: none;

		.avatar {
			cursor: pointer;

			&:hover {
				background: var(--pui-color-primary);
				color: var(--pui-text-primary);
			}
		}

		&:hover {
			transform: scale(1.1);
		}
	}

	.avatar {
		object-fit: cover;
		background: var(--pui-color-gray-200);
		display: flex;
		justify-content: center;
		align-items: center;
		transition: all var(--pui-transition-fast) var(--pui-ease-in-out);
	}

	.avatar.circle {
		border-radius: var(--pui-radius-full);
	}

	.avatar.rounded {
		border-radius: var(--pui-radius-lg);
	}

	.initials {
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--pui-color-white);
		font-weight: var(--pui-font-weight-bold);
		border-radius: var(--pui-radius-full);
	}

	:global(.dark) {
		.avatar-container button,
		.avatar-container a {
			color: var(--pui-text-primary);

			.avatar {
				&:hover {
					background: var(--pui-color-secondary);
					color: var(--pui-color-black);
				}
			}
		}

		.avatar {
			background: var(--pui-color-dark-500);
		}
	}
</style>
