<script lang="ts">
  import type { Editor } from '@tiptap/core'
  import ToolbarButton from './ToolbarButton.svelte'
  import { iconAlignJustified } from '$lib/icon/index.js'

  interface Props {
    editor: Editor
  }

  let { editor }: Props = $props()
</script>

<ToolbarButton
  icon={iconAlignJustified}
  title="Justify"
  active={editor.isActive({ textAlign: 'justify' })}
  onclick={() => editor.chain().focus().setTextAlign('justify').run()}
/>
