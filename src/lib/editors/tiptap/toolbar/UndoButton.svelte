<script lang="ts">
	import type { Editor } from '@tiptap/core';
	import ToolbarButton from './ToolbarButton.svelte';
	import { iconArrowBackUp } from '$lib/icon/index.js';

	interface Props {
		editor: Editor;
	}

	let { editor }: Props = $props();
</script>

<ToolbarButton
	icon={iconArrowBackUp}
	title="Undo"
	disabled={!editor.can().undo()}
	onclick={() => editor.chain().focus().undo().run()}
/>
