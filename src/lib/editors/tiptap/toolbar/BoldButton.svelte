<script lang="ts">
  import type { Editor } from '@tiptap/core'
  import ToolbarButton from './ToolbarButton.svelte'
  import { iconBold } from '$lib/icon/index.js'

  interface Props {
    editor: Editor
  }

  let { editor }: Props = $props()
</script>

<ToolbarButton
  icon={iconBold}
  title="Bold"
  active={editor.isActive('bold')}
  onclick={() => editor.chain().focus().toggleBold().run()}
/>
