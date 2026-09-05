<script lang="ts">
	import type { Editor } from '@tiptap/core';
	import ToolbarButton from './ToolbarButton.svelte';
	import { iconSourceCode } from '$lib/icon/index.js';

	interface Props {
		editor: Editor;
	}

	let { editor }: Props = $props();
</script>

<ToolbarButton
	icon={iconSourceCode}
	title="Code Block"
	active={editor.isActive('codeBlock')}
	onclick={() => editor.chain().focus().toggleCodeBlock().run()}
/>
