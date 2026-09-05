<script lang="ts">
  import type { Editor } from '@tiptap/core'
  import ToolbarButton from './ToolbarButton.svelte'
  import { iconStrikethrough } from '$lib/icon/index.js'

  interface Props {
    editor: Editor
  }

  let { editor }: Props = $props()
</script>

<ToolbarButton
  icon={iconStrikethrough}
  title="Strikethrough"
  active={editor.isActive('strike')}
  onclick={() => editor.chain().focus().toggleStrike().run()}
/>
