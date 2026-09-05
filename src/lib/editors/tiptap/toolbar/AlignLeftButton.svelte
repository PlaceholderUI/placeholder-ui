<script lang="ts">
  import type { Editor } from '@tiptap/core'
  import ToolbarButton from './ToolbarButton.svelte'
  import { iconAlignLeft } from '$lib/icon/index.js'

  interface Props {
    editor: Editor
  }

  let { editor }: Props = $props()
</script>

<ToolbarButton
  icon={iconAlignLeft}
  title="Align Left"
  active={editor.isActive({ textAlign: 'left' })}
  onclick={() => editor.chain().focus().setTextAlign('left').run()}
/>
