<script lang="ts">
	import type { Editor } from '@tiptap/core';
	import ToolbarButton from './ToolbarButton.svelte';
	import { iconAlignCenter } from '$lib/icon/index.js';

	interface Props {
		editor: Editor;
	}

	let { editor }: Props = $props();
</script>

<ToolbarButton
	icon={iconAlignCenter}
	title="Align Center"
	active={editor.isActive({ textAlign: 'center' })}
	onclick={() => editor.chain().focus().setTextAlign('center').run()}
/>
