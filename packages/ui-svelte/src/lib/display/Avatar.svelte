<script lang="ts">
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
		<a {href}>
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
		color: black;
		padding: 0;
		transition: all 0.2s ease-in-out;
		text-decoration: none;

		.avatar {
			cursor: pointer;

			&:hover {
				background: var(--midnight);
				color: var(--text-color);
			}
		}

		&:hover {
			transform: scale(1.1);
		}
	}

	.avatar {
		object-fit: cover;
		background: #e8e8e8;
		display: flex;
		justify-content: center;
		align-items: center;
		transition: all 0.2s ease-in-out;
	}

	.avatar.circle {
		border-radius: 50%;
	}

	.avatar.rounded {
		border-radius: 6px;
	}

	.initials {
		display: flex;
		align-items: center;
		justify-content: center;
		/* background-color: #ccc; Fallback color for initials */
		color: #fff; /* Text color for initials */
		/* font-size: calc({size} / 2); Adjust font size based on avatar size */
		font-weight: bold;
		border-radius: 50%;
	}

	:global(.dark) {
		.avatar-container button,
		.avatar-container a {
			color: var(--text-color);

			.avatar {
				&:hover {
					background: var(--pistachio);
					color: black;
				}
			}
		}

		.avatar {
			background: rgb(6, 7, 9); /* Dark mode background color */
		}
	}
</style>
