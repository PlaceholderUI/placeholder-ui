<script lang="ts">
  import type { Editor } from '@tiptap/core'
  import ToolbarButton from './ToolbarButton.svelte'
  import { iconList } from '$lib/icon/index.js'

  interface Props {
    editor: Editor
  }

  let { editor }: Props = $props()
</script>

<ToolbarButton
  icon={iconList}
  title="Bullet List"
  active={editor.isActive('bulletList')}
  onclick={() => editor.chain().focus().toggleBulletList().run()}
/>
