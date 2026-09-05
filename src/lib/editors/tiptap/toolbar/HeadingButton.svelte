<script lang="ts">
  import type { Editor } from '@tiptap/core'
  import ToolbarButton from './ToolbarButton.svelte'
  import { iconH1, iconH2, iconH3, iconH4, iconH5, iconH6 } from '$lib/icon/index.js'

  interface Props {
    editor: Editor
    level?: 1 | 2 | 3 | 4 | 5 | 6
  }

  let { editor, level = 1 }: Props = $props()

  const iconMap = {
    1: iconH1,
    2: iconH2,
    3: iconH3,
    4: iconH4,
    5: iconH5,
    6: iconH6
  }

  const icon = $derived(iconMap[level])
</script>

<ToolbarButton
  {icon}
  title="Heading {level}"
  active={editor.isActive('heading', { level })}
  onclick={() => editor.chain().focus().toggleHeading({ level }).run()}
/>
