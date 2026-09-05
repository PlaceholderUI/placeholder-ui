<script lang="ts">
  import type { Editor } from '@tiptap/core'
  import ToolbarButton from './ToolbarButton.svelte'
  import { iconCode } from '$lib/icon/index.js'

  interface Props {
    editor: Editor
  }

  let { editor }: Props = $props()
</script>

<ToolbarButton
  icon={iconCode}
  title="Code"
  active={editor.isActive('code')}
  onclick={() => editor.chain().focus().toggleCode().run()}
/>
