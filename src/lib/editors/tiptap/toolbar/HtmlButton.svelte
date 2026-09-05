<script lang="ts">
  import type { Editor } from '@tiptap/core'
  import ToolbarButton from './ToolbarButton.svelte'
  import Dialog from '$lib/ui/Dialog.svelte'
  import Button from '$lib/ui/Button.svelte'
  import CodeMirror from '$lib/editors/CodeMirror.svelte'
  import { iconCode } from '$lib/icon/index.js'
  import { themeState } from '$lib/theme.svelte.js'

  interface Props {
    editor: Editor
  }

  let { editor }: Props = $props()

  let showDialog = $state(false)
  let htmlContent = $state('')
  let codeMirrorRef: any

  const openHtmlEditor = () => {
    htmlContent = editor.getHTML()
    showDialog = true
  }

  const closeDialog = () => {
    showDialog = false
  }

  const saveHtml = () => {
    if (codeMirrorRef) {
      const newHtml = codeMirrorRef.getValue()
      editor.commands.setContent(newHtml)
    }
    closeDialog()
  }
</script>

<ToolbarButton
  icon={iconCode}
  title="Edit HTML"
  onclick={openHtmlEditor}
/>

<Dialog bind:show={showDialog} title="Edit HTML" size="full" preventOverflow={false}>
  <div class="html-editor-container">
    <CodeMirror
      bind:this={codeMirrorRef}
      value={htmlContent}
      language="html"
      theme={themeState.isDarkMode ? 'dark' : 'light'}
      height="100%"
    />
  </div>

  {#snippet footer()}
    <Button variant="secondary" onclick={closeDialog}>Cancel</Button>
    <Button onclick={saveHtml}>Save</Button>
  {/snippet}
</Dialog>

<style>
  .html-editor-container {
    width: 100%;
    height: calc(100vh - 200px);
    max-height: 600px;
    min-height: 300px;
  }
</style>
