<script lang="ts">
	import type { Editor } from '@tiptap/core';
	import ToolbarButton from './ToolbarButton.svelte';
	import { iconListNumbers } from '$lib/icon/index.js';

	interface Props {
		editor: Editor;
	}

	let { editor }: Props = $props();
</script>

<ToolbarButton
	icon={iconListNumbers}
	title="Numbered List"
	active={editor.isActive('orderedList')}
	onclick={() => editor.chain().focus().toggleOrderedList().run()}
/>
