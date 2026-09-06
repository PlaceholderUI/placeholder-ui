<script lang="ts">
	import type { Editor } from '@tiptap/core';
	import ToolbarButton from './ToolbarButton.svelte';
	import { iconUnderline } from '$lib/icon/index.js';

	interface Props {
		editor: Editor;
	}

	let { editor }: Props = $props();
</script>

<ToolbarButton
	icon={iconUnderline}
	title="Underline"
	active={editor.isActive('underline')}
	onclick={() => editor.chain().focus().toggleUnderline().run()}
/>
