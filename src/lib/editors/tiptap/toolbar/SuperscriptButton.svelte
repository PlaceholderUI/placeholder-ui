<script lang="ts">
  import type { Editor } from '@tiptap/core'
  import ToolbarButton from './ToolbarButton.svelte'
  import { iconSuperscript } from '$lib/icon/index.js'

  interface Props {
    editor: Editor
  }

  let { editor }: Props = $props()
</script>

<ToolbarButton
  icon={iconSuperscript}
  title="Superscript"
  active={editor.isActive('superscript')}
  onclick={() => editor.chain().focus().toggleSuperscript().run()}
/>
