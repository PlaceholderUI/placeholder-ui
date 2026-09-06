<script lang="ts">
	import type { Editor } from '@tiptap/core';
	import ToolbarButton from './ToolbarButton.svelte';
	import { iconAlignRight } from '$lib/icon/index.js';

	interface Props {
		editor: Editor;
	}

	let { editor }: Props = $props();
</script>

<ToolbarButton
	icon={iconAlignRight}
	title="Align Right"
	active={editor.isActive({ textAlign: 'right' })}
	onclick={() => editor.chain().focus().setTextAlign('right').run()}
/>
