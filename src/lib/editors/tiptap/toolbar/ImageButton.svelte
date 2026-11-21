<script lang="ts">
	import type { Editor } from '@tiptap/core';
	import ToolbarButton from './ToolbarButton.svelte';
	import { iconPhoto } from '#lib/icon/index.js';
	import { ImageAsset } from '#lib/models/ImageAsset.js';
	import type { ImagePickResult } from '../TipTap.svelte';

	interface Props {
		editor: Editor;
		/** Upload a file from the user's device; returns the image URL or null */
		onImageUpload?: (file: File) => Promise<string | null>;
		/** Open the app's own image picker; returns the chosen image or null */
		onImagePick?: () => Promise<ImagePickResult | ImageAsset | null>;
	}

	let { editor, onImageUpload, onImagePick }: Props = $props();

	let fileInputElement: HTMLInputElement | undefined = $state();
	let wrapperElement: HTMLDivElement | undefined = $state();
	let showMenu = $state(false);

	const hasBoth = $derived(!!onImageUpload && !!onImagePick);

	const insertImage = (image: ImagePickResult) => {
		const { src, alt, title } = image;
		editor.chain().focus().setImage({ src, alt, title }).run();
	};

	const handleFileSelect = async (event: Event) => {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];

		if (!file || !onImageUpload) return;

		try {
			const imageUrl = await onImageUpload(file);

			if (imageUrl) {
				insertImage({ src: imageUrl });
			}
		} catch (error) {
			console.error('Failed to upload image:', error);
		}

		// Reset the input
		if (fileInputElement) {
			fileInputElement.value = '';
		}
	};

	const openFilePicker = () => {
		showMenu = false;
		fileInputElement?.click();
	};

	const openImagePicker = async () => {
		showMenu = false;
		if (!onImagePick) return;

		try {
			const picked = await onImagePick();
			const image = picked instanceof ImageAsset ? picked.toImgAttrs() : picked;

			if (image?.src) {
				insertImage(image);
			}
		} catch (error) {
			console.error('Failed to pick image:', error);
		}
	};

	const handleButtonClick = () => {
		if (hasBoth) {
			showMenu = !showMenu;
		} else if (onImagePick) {
			openImagePicker();
		} else {
			openFilePicker();
		}
	};

	const handleWindowClick = (event: MouseEvent) => {
		if (showMenu && wrapperElement && !wrapperElement.contains(event.target as Node)) {
			showMenu = false;
		}
	};

	const handleWindowKeydown = (event: KeyboardEvent) => {
		if (showMenu && event.key === 'Escape') {
			showMenu = false;
		}
	};
</script>

<svelte:window onclick={handleWindowClick} onkeydown={handleWindowKeydown} />

{#if onImageUpload}
	<input
		type="file"
		accept="image/*"
		bind:this={fileInputElement}
		onchange={handleFileSelect}
		style="display: none;"
	/>
{/if}

<div bind:this={wrapperElement} style="position: relative; display: inline-block;">
	<ToolbarButton
		icon={iconPhoto}
		title={hasBoth ? 'Image' : onImagePick ? 'Choose Image' : 'Add Image'}
		active={showMenu}
		onclick={handleButtonClick}
	/>

	{#if showMenu}
		<div class="image-menu" role="menu">
			<div class="menu-title">Insert image</div>
			<button class="menu-item" type="button" role="menuitem" onclick={openFilePicker}>
				Upload from device
			</button>
			<button class="menu-item" type="button" role="menuitem" onclick={openImagePicker}>
				Choose existing image
			</button>
		</div>
	{/if}
</div>

<style>
	.image-menu {
		position: absolute;
		top: 100%;
		left: 0;
		margin-top: 0.25rem;
		display: flex;
		flex-direction: column;
		gap: 2px;
		padding: 0.5rem;
		background: var(--paper-body-bg);
		border: 1px solid var(--border-color);
		border-radius: var(--ui-radius);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		z-index: 1000;
		min-width: 11.25rem;
	}

	:global(.dark) .image-menu {
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
	}

	.menu-title {
		font-size: 0.6875rem;
		font-weight: 600;
		color: var(--text-muted);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		padding: 2px 0.5rem 0.375rem 0.5rem;
	}

	.menu-item {
		padding: 0.375rem 0.5rem;
		border: none;
		background: transparent;
		color: var(--text-color);
		font-size: 0.8125rem;
		font-family: inherit;
		text-align: left;
		border-radius: var(--ui-radius-sm);
		cursor: pointer;
		transition: background 0.15s ease;
		white-space: nowrap;
	}

	.menu-item:hover {
		background: rgba(var(--ui-primary-rgbc), 0.1);
	}

	:global(.dark) .menu-item:hover {
		background: rgba(var(--ui-accent-rgbc), 0.1);
	}
</style>
