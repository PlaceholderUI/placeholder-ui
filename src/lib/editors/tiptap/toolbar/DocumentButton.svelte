<script lang="ts">
  import type { Editor } from '@tiptap/core'
  import ToolbarButton from './ToolbarButton.svelte'
  import { iconPaperclip } from '$lib/icon/index.js'
  import type { DocumentUploadResult } from '../TipTap.svelte'

  interface Props {
    editor: Editor
    onDocumentUpload?: (file: File) => Promise<DocumentUploadResult | null>
  }

  let { editor, onDocumentUpload }: Props = $props()

  let fileInputElement: HTMLInputElement | undefined = $state()

  const handleFileSelect = async (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]

    if (!file || !onDocumentUpload) return

    try {
      const result = await onDocumentUpload(file)

      if (result) {
        editor
          .chain()
          .focus()
          .insertContent({
            type: 'text',
            text: result.label,
            marks: [{ type: 'link', attrs: { href: result.url } }]
          })
          .run()
      }
    } catch (error) {
      console.error('Failed to upload document:', error)
    }

    // Reset the input
    if (fileInputElement) {
      fileInputElement.value = ''
    }
  }

  const openFilePicker = () => {
    fileInputElement?.click()
  }
</script>

<input
  type="file"
  bind:this={fileInputElement}
  onchange={handleFileSelect}
  style="display: none;"
/>

<ToolbarButton icon={iconPaperclip} title="Attach Document" onclick={openFilePicker} />
