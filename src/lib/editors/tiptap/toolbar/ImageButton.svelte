<script lang="ts">
	import type { Editor } from '@tiptap/core';
	import ToolbarButton from './ToolbarButton.svelte';
	import { iconPhoto } from '$lib/icon/index.js';

	interface Props {
		editor: Editor;
		onImageUpload?: (file: File) => Promise<string | null>;
	}

	let { editor, onImageUpload }: Props = $props();

	let fileInputElement: HTMLInputElement | undefined = $state();

	const handleFileSelect = async (event: Event) => {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];

		if (!file || !onImageUpload) return;

		try {
			const imageUrl = await onImageUpload(file);

			if (imageUrl) {
				editor.chain().focus().setImage({ src: imageUrl }).run();
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
		fileInputElement?.click();
	};
</script>

<input
	type="file"
	accept="image/*"
	bind:this={fileInputElement}
	onchange={handleFileSelect}
	style="display: none;"
/>

<ToolbarButton icon={iconPhoto} title="Add Image" onclick={openFilePicker} />
