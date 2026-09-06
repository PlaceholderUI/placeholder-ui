<script lang="ts">
	import type { Editor } from '@tiptap/core';
	import ToolbarButton from './ToolbarButton.svelte';
	import { iconItalic } from '$lib/icon/index.js';

	interface Props {
		editor: Editor;
	}

	let { editor }: Props = $props();
</script>

<ToolbarButton
	icon={iconItalic}
	title="Italic"
	active={editor.isActive('italic')}
	onclick={() => editor.chain().focus().toggleItalic().run()}
/>
