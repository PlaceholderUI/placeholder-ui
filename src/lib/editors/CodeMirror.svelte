<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import {
    EditorView,
    lineNumbers as lineNumbersGutter,
    highlightActiveLineGutter,
    highlightSpecialChars,
    drawSelection,
    dropCursor,
    rectangularSelection,
    crosshairCursor,
    highlightActiveLine,
    keymap
  } from '@codemirror/view'
  import { EditorState, Compartment } from '@codemirror/state'
  import {
    foldGutter,
    foldKeymap,
    indentOnInput,
    syntaxHighlighting,
    defaultHighlightStyle,
    bracketMatching
  } from '@codemirror/language'
  import { history, defaultKeymap, historyKeymap } from '@codemirror/commands'
  import { highlightSelectionMatches, searchKeymap } from '@codemirror/search'
  import {
    closeBrackets,
    closeBracketsKeymap,
    autocompletion,
    completionKeymap
  } from '@codemirror/autocomplete'
  import { lintKeymap } from '@codemirror/lint'
  import { javascript } from '@codemirror/lang-javascript'
  import { html } from '@codemirror/lang-html'
  import { css } from '@codemirror/lang-css'
  import { json } from '@codemirror/lang-json'
  import { markdown } from '@codemirror/lang-markdown'
  import { oneDark } from '@codemirror/theme-one-dark'
  import { themeState } from '../theme.svelte.js'
  import ActionIcon from '../ui/ActionIcon.svelte'
  import { iconCopy, iconCheck } from '../icon/index.js'

  export interface CodeMirrorProps {
    /** Editor content value (bindable) */
    value?: string
    /** Programming language for syntax highlighting */
    language?: 'javascript' | 'html' | 'css' | 'json' | 'typescript' | 'markdown'
    /** Color theme for the editor (defaults to app theme) */
    theme?: 'light' | 'dark' | 'auto'
    /** Disable editing */
    readOnly?: boolean
    /** Show line numbers in the gutter */
    lineNumbers?: boolean
    /** Show a button that copies the editor contents to the clipboard */
    copyButton?: boolean
    /** Additional CSS classes */
    class?: string
    /** Height of the editor */
    height?: string
    /** Callback when content changes */
    onChange?: (value: string) => void
    /** Callback after the contents are copied to the clipboard */
    onCopy?: (value: string) => void
  }

  let {
    value = $bindable(''),
    language = 'javascript',
    theme = 'auto',
    readOnly = false,
    lineNumbers = true,
    copyButton = false,
    class: className = '',
    height = '500px',
    onChange,
    onCopy
  }: CodeMirrorProps = $props()

  let editorContainer: HTMLDivElement | undefined = $state()
  let view: EditorView | null = $state(null)
  let themeCompartment = new Compartment()
  let gutterCompartment = new Compartment()
  let copied = $state(false)
  let copiedTimeout: ReturnType<typeof setTimeout>

  // basicSetup minus the gutters, which we swap in via a compartment so the
  // `lineNumbers` prop can be toggled after the editor is created.
  const baseSetup = [
    highlightSpecialChars(),
    history(),
    drawSelection(),
    dropCursor(),
    EditorState.allowMultipleSelections.of(true),
    indentOnInput(),
    syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
    bracketMatching(),
    closeBrackets(),
    autocompletion(),
    rectangularSelection(),
    crosshairCursor(),
    highlightActiveLine(),
    highlightSelectionMatches(),
    keymap.of([
      ...closeBracketsKeymap,
      ...defaultKeymap,
      ...searchKeymap,
      ...historyKeymap,
      ...foldKeymap,
      ...completionKeymap,
      ...lintKeymap
    ])
  ]

  const getGutterExtension = (show: boolean) =>
    show ? [lineNumbersGutter(), highlightActiveLineGutter(), foldGutter()] : []

  // Derive effective dark mode from prop or app theme
  let isDark = $derived(
    theme === 'auto' ? themeState.isDarkMode : theme === 'dark'
  )

  const getLanguageExtension = (lang: string) => {
    switch (lang) {
      case 'javascript':
      case 'typescript':
        return javascript()
      case 'html':
        return html()
      case 'css':
        return css()
      case 'json':
        return json()
      case 'markdown':
        return markdown()
      default:
        return javascript()
    }
  }

  onMount(() => {
    if (!editorContainer) return

    const extensions = [
      gutterCompartment.of(getGutterExtension(lineNumbers)),
      baseSetup,
      getLanguageExtension(language),
      EditorView.lineWrapping,
      themeCompartment.of(isDark ? oneDark : [])
    ]

    if (readOnly) {
      extensions.push(EditorState.readOnly.of(true))
    }

    // Always add update listener to sync bindable value
    extensions.push(
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          const newValue = update.state.doc.toString()
          value = newValue
          if (onChange) {
            onChange(newValue)
          }
        }
      })
    )

    const startState = EditorState.create({
      doc: value,
      extensions
    })

    view = new EditorView({
      state: startState,
      parent: editorContainer
    })
  })

  onDestroy(() => {
    view?.destroy()
    clearTimeout(copiedTimeout)
  })

  async function copyToClipboard() {
    const text = view?.state.doc.toString() ?? value

    try {
      await navigator.clipboard.writeText(text)
      copied = true
      clearTimeout(copiedTimeout)
      copiedTimeout = setTimeout(() => (copied = false), 2000)
      onCopy?.(text)
    } catch (err) {
      console.error('CodeMirror: failed to copy to clipboard', err)
    }
  }

  // Watch for theme changes and reconfigure
  $effect(() => {
    if (!view) return

    view.dispatch({
      effects: themeCompartment.reconfigure(isDark ? oneDark : [])
    })
  })

  // Watch for lineNumbers changes and reconfigure the gutter
  $effect(() => {
    if (!view) return

    view.dispatch({
      effects: gutterCompartment.reconfigure(getGutterExtension(lineNumbers))
    })
  })

  // Watch for external value changes and update editor
  $effect(() => {
    if (!view) return

    const currentValue = view.state.doc.toString()
    if (value !== currentValue) {
      view.dispatch({
        changes: { from: 0, to: currentValue.length, insert: value }
      })
    }
  })

  // Public API methods
  export function getValue(): string {
    return view?.state.doc.toString() || ''
  }

  export function setValue(newValue: string) {
    if (!view) return
    view.dispatch({
      changes: { from: 0, to: view.state.doc.length, insert: newValue }
    })
  }

  export function getView(): EditorView | null {
    return view
  }

  export function focus() {
    view?.focus()
  }
</script>

<div class="codemirror-container {className}" style="height: {height}">
  {#if copyButton}
    <div class="codemirror-copy" class:copied class:dark={isDark}>
      <ActionIcon
        svg={copied ? iconCheck : iconCopy}
        size="16px"
        tooltip={copied ? 'Copied' : 'Copy to clipboard'}
        ariaLabel={copied ? 'Copied to clipboard' : 'Copy to clipboard'}
        onclick={copyToClipboard}
      />
    </div>
  {/if}
  <div class="codemirror-wrapper" bind:this={editorContainer}></div>
</div>

<style>
  .codemirror-container {
    position: relative;
    width: 100%;
    border: 1px solid var(--border-color, #ddd);
    border-radius: 6px;
    overflow: hidden;
    background: var(--input-bg-color);
  }

  /* The ActionIcon supplies the button chrome; this only places it and gives it
     an opaque backing so it stays readable over the code underneath. */
  .codemirror-copy {
    position: absolute;
    top: 6px;
    right: 6px;
    z-index: 2;
    display: inline-flex;
    border-radius: 6px;
    opacity: 0.65;
    transition: opacity 0.15s ease;
  }

  .codemirror-container:hover .codemirror-copy,
  .codemirror-copy:hover,
  .codemirror-copy:focus-within,
  .codemirror-copy.copied {
    opacity: 1;
  }

  .codemirror-wrapper {
    width: 100%;
    height: 100%;
  }

  .codemirror-wrapper :global(.cm-editor) {
    height: 100%;
  }

  .codemirror-wrapper :global(.cm-scroller) {
    overflow: auto;
  }
</style>
