<script lang="ts">
  import type { Editor } from '@tiptap/core'
  import ToolbarButton from './ToolbarButton.svelte'
  import { iconSubscript } from '$lib/icon/index.js'

  interface Props {
    editor: Editor
  }

  let { editor }: Props = $props()
</script>

<ToolbarButton
  icon={iconSubscript}
  title="Subscript"
  active={editor.isActive('subscript')}
  onclick={() => editor.chain().focus().toggleSubscript().run()}
/>
