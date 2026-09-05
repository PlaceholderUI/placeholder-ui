<script lang="ts">
  import type { Editor } from '@tiptap/core'
  import ToolbarButton from './ToolbarButton.svelte'
  import { iconArrowForwardUp } from '$lib/icon/index.js'

  interface Props {
    editor: Editor
  }

  let { editor }: Props = $props()
</script>

<ToolbarButton
  icon={iconArrowForwardUp}
  title="Redo"
  disabled={!editor.can().redo()}
  onclick={() => editor.chain().focus().redo().run()}
/>
