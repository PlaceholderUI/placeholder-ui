<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Editor, Extension, type AnyExtension } from '@tiptap/core';
	import { StarterKit } from '@tiptap/starter-kit';
	import { BubbleMenu } from '@tiptap/extension-bubble-menu';
	import Underline from '@tiptap/extension-underline';
	import TextAlign from '@tiptap/extension-text-align';
	import Link from '@tiptap/extension-link';
	import Subscript from '@tiptap/extension-subscript';
	import Superscript from '@tiptap/extension-superscript';
	import Image from '@tiptap/extension-image';
	import { TableKit } from '@tiptap/extension-table';
	import Color from '@tiptap/extension-color';
	import Placeholder from '@tiptap/extension-placeholder';
	import { TextStyle } from '@tiptap/extension-text-style';
	import Collaboration from '@tiptap/extension-collaboration';
	import { CollaborationCaret } from '@tiptap/extension-collaboration-caret';
	import { Alert, CodeBlockEditor, Div, Span, type CodeBlocksOptions } from './extensions/index.js';
	import type { CollaborationConfig } from './collaboration.js';
	import FormGroup from '$lib/form/FormGroup.svelte';
	import LinkActionMenu from './LinkActionMenu.svelte';
	import BoldButton from './toolbar/BoldButton.svelte';
	import ItalicButton from './toolbar/ItalicButton.svelte';
	import StrikethroughButton from './toolbar/StrikethroughButton.svelte';
	import CodeButton from './toolbar/CodeButton.svelte';
	import UnderlineButton from './toolbar/UnderlineButton.svelte';
	import ColorButton from './toolbar/ColorButton.svelte';
	import LinkButton from './toolbar/LinkButton.svelte';
	import SuperscriptButton from './toolbar/SuperscriptButton.svelte';
	import SubscriptButton from './toolbar/SubscriptButton.svelte';
	import HeadingButton from './toolbar/HeadingButton.svelte';
	import TableButton from './toolbar/TableButton.svelte';
	import CodeBlockButton from './toolbar/CodeBlockButton.svelte';

	export interface TipTapBubbleProps {
		/** HTML content value (bindable). Ignored when collaboration is enabled. */
		value?: string;
		/** Label text displayed above the editor */
		label?: string;
		/** Mark field as required (shows asterisk) */
		required?: boolean;
		/** CSS classes for the FormGroup wrapper */
		groupClass?: string;
		/** Tooltip text on hover */
		tooltipText?: string;
		/** Position of the tooltip */
		tooltipLocation?: 'top' | 'bottom' | 'left' | 'right';
		/** Enable editing mode */
		editable?: boolean;
		/** Placeholder text when editor is empty */
		placeholder?: string;
		/** Additional CSS classes */
		class?: string;
		/** Async handler for image uploads, returns URL or null */
		onImageUpload?: (file: File) => Promise<string | null>;
		/** Callback when content changes */
		onUpdate?: (html: string) => void;
		/** Opt-in real-time collaboration config. When provided, content syncs via Yjs. */
		collaboration?: CollaborationConfig;
		/** Opt-in rich code blocks: CodeMirror-powered editing with syntax highlighting,
		 * autocompletion and a per-block language picker. Pass true for all languages
		 * or a config to narrow the offered languages and set the default. */
		codeBlocks?: boolean | CodeBlocksOptions;
		/** Additional TipTap extensions to register with the editor */
		extensions?: AnyExtension[];
	}

	let {
		value = $bindable(''),
		label = '',
		required = false,
		groupClass = '',
		tooltipText = undefined,
		tooltipLocation = 'top',
		editable = true,
		placeholder = 'Start typing...',
		class: className = '',
		onImageUpload,
		onUpdate,
		collaboration,
		codeBlocks = false,
		extensions: customExtensions = []
	}: TipTapBubbleProps = $props();

	let element: HTMLElement | undefined = $state();
	let bubbleMenuElement: HTMLDivElement | undefined = $state();
	let linkBubbleMenuElement: HTMLDivElement | undefined = $state();
	let editorState: { editor: Editor | null } = $state({ editor: null });
	let isDragging = $state(false);

	// Handle dropped files
	async function handleDrop(event: DragEvent) {
		if (!onImageUpload || !editorState.editor) return;

		event.preventDefault();
		isDragging = false;

		const files = event.dataTransfer?.files;
		if (!files?.length) return;

		for (const file of files) {
			if (file.type.startsWith('image/')) {
				const imageUrl = await onImageUpload(file);
				if (imageUrl) {
					editorState.editor.chain().focus().setImage({ src: imageUrl }).run();
				}
			}
		}
	}

	// Handle drag over
	function handleDragOver(event: DragEvent) {
		if (!onImageUpload) return;
		event.preventDefault();
		isDragging = true;
	}

	// Handle drag leave
	function handleDragLeave(event: DragEvent) {
		if (!onImageUpload) return;
		const relatedTarget = event.relatedTarget as Node | null;
		if (!element?.contains(relatedTarget)) {
			isDragging = false;
		}
	}

	// Handle paste events
	async function handlePaste(event: ClipboardEvent) {
		if (!onImageUpload || !editorState.editor) return;

		const items = event.clipboardData?.items;
		if (!items) return;

		for (const item of items) {
			if (item.type.startsWith('image/')) {
				event.preventDefault();
				const file = item.getAsFile();
				if (file) {
					const imageUrl = await onImageUpload(file);
					if (imageUrl) {
						editorState.editor.chain().focus().setImage({ src: imageUrl }).run();
					}
				}
				break;
			}
		}
	}

	// Strip color declarations from inline styles in pasted HTML so pasted text
	// inherits the editor's colours instead of carrying over the source colours.
	function stripPastedColors(html: string): string {
		if (typeof window === 'undefined') return html;

		const container = document.createElement('div');
		container.innerHTML = html;

		container.querySelectorAll<HTMLElement>('[style]').forEach((el) => {
			const cleaned = el.style.cssText
				.split(';')
				.map((decl) => decl.trim())
				.filter((decl) => {
					if (!decl) return false;
					const prop = decl.slice(0, decl.indexOf(':')).trim().toLowerCase();
					return prop !== 'color' && prop !== '-webkit-text-fill-color';
				})
				.join('; ');

			if (cleaned) {
				el.setAttribute('style', cleaned);
			} else {
				el.removeAttribute('style');
			}
		});

		// Drop legacy <font color> attributes as well.
		container.querySelectorAll('font[color]').forEach((el) => el.removeAttribute('color'));

		return container.innerHTML;
	}

	function handleEditorClick(event: MouseEvent) {
		const target = event.target as HTMLElement | null;
		const link = target?.closest('a');

		if (!link || !element?.contains(link)) {
			return;
		}

		event.preventDefault();

		const position = editorState.editor?.view.posAtCoords({
			left: event.clientX,
			top: event.clientY
		});

		if (position) {
			editorState.editor?.chain().setTextSelection(position.pos).extendMarkRange('link').run();
		}
	}

	// Custom Tab Handler Extension
	const TabHandler = Extension.create({
		name: 'tabHandler',

		addKeyboardShortcuts() {
			return {
				Tab: ({ editor }) => {
					// Rich code blocks handle Tab inside CodeMirror; never replace a
					// selected code block with spaces
					if (codeBlocks && editor.isActive('codeBlock')) {
						return false;
					}
					if (editor.isActive('listItem')) {
						return editor.commands.sinkListItem('listItem');
					}
					if (editor.isActive('table')) {
						return editor.commands.goToNextCell();
					}
					return editor.commands.insertContent('    ');
				},
				'Shift-Tab': ({ editor }) => {
					if (editor.isActive('listItem')) {
						return editor.commands.liftListItem('listItem');
					}
					if (editor.isActive('table')) {
						return editor.commands.goToPreviousCell();
					}
					return false;
				}
			};
		}
	});

	onMount(() => {
		const extensions = [
			Div,
			Span,
			StarterKit.configure({
				undoRedo: collaboration ? false : undefined,
				link: false,
				underline: false,
				codeBlock: codeBlocks ? false : undefined
			}),
			Underline,
			TextStyle,
			Color,
			Placeholder.configure({
				placeholder: placeholder
			}),
			TextAlign.configure({
				types: ['heading', 'paragraph', 'div', 'span']
			}),
			Link.configure({
				openOnClick: false,
				enableClickSelection: true,
				HTMLAttributes: {
					class: 'editor-link'
				}
			}),
			Subscript,
			Superscript,
			Image,
			Alert,
			TabHandler,
			TableKit.configure({ table: { resizable: true } }),
			...customExtensions
		];

		if (codeBlocks) {
			const codeBlocksConfig = typeof codeBlocks === 'object' ? codeBlocks : {};
			extensions.push(
				CodeBlockEditor.configure({
					languages: codeBlocksConfig.languages ?? null,
					defaultLanguage: codeBlocksConfig.defaultLanguage ?? 'javascript'
				})
			);
		}

		if (bubbleMenuElement && editable) {
			extensions.push(
				BubbleMenu.configure({
					pluginKey: 'formatBubbleMenu',
					element: bubbleMenuElement,
					shouldShow: ({ editor, state }) => {
						const { from, to } = state.selection;
						return from !== to && !editor.isActive('image') && !editor.isActive('link');
					}
				})
			);
		}

		if (linkBubbleMenuElement) {
			extensions.push(
				BubbleMenu.configure({
					pluginKey: 'linkActionBubbleMenu',
					element: linkBubbleMenuElement,
					shouldShow: ({ editor }) => Boolean(editor.getAttributes('link').href),
					options: {
						placement: 'top',
						offset: 8
					}
				})
			);
		}

		if (collaboration) {
			extensions.push(
				Collaboration.configure({ fragment: collaboration.fragment }),
				CollaborationCaret.configure({
					provider: collaboration.provider,
					user: collaboration.user
				})
			);
		}

		editorState.editor = new Editor({
			element: element,
			extensions,
			content: collaboration ? undefined : value,
			editable: editable,
			editorProps: {
				transformPastedHTML: stripPastedColors
			},
			onTransaction: ({ editor }) => {
				editorState = { editor };
			},
			onUpdate: ({ editor }) => {
				const html = editor.getHTML();
				value = html;
				if (onUpdate) {
					onUpdate(html);
				}
			}
		});

		if (element) {
			element.addEventListener('click', handleEditorClick, true);
			element.addEventListener('paste', handlePaste as unknown as EventListener);
		}
	});

	onDestroy(() => {
		element?.removeEventListener('click', handleEditorClick, true);
		element?.removeEventListener('paste', handlePaste as unknown as EventListener);
		editorState.editor?.destroy();
	});

	// Public API methods
	export function getHTML(): string {
		const editor = editorState.editor;
		if (!editor || editor.isDestroyed) return '';
		return editor.getHTML();
	}

	export function getJSON(): object {
		const editor = editorState.editor;
		if (!editor || editor.isDestroyed) return {};
		return editor.getJSON();
	}

	export function setContent(html: string) {
		const editor = editorState.editor;
		if (!editor || editor.isDestroyed) return;
		editor.commands.setContent(html);
	}

	export function clear() {
		const editor = editorState.editor;
		if (!editor || editor.isDestroyed) return;
		editor.commands.clearContent();
	}

	export function focus() {
		const editor = editorState.editor;
		if (!editor || editor.isDestroyed) return;
		editor.commands.focus();
	}
</script>

<FormGroup {label} {required} class={groupClass} {tooltipLocation} {tooltipText}>
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="editor-container bubble-editor {className}"
		class:dragging={isDragging}
		ondragover={handleDragOver}
		ondragleave={handleDragLeave}
		ondrop={handleDrop}
	>
		{#if editable}
			<div
				bind:this={bubbleMenuElement}
				class="bubble-menu"
				style="visibility: hidden; opacity: 0; position: absolute;"
			>
				{#if editorState.editor}
					<div class="bubble-menu-group">
						<HeadingButton editor={editorState.editor} level={1} />
						<HeadingButton editor={editorState.editor} level={2} />
						<HeadingButton editor={editorState.editor} level={3} />
					</div>

					<div class="bubble-menu-divider"></div>

					<div class="bubble-menu-group">
						<BoldButton editor={editorState.editor} />
						<ItalicButton editor={editorState.editor} />
						<StrikethroughButton editor={editorState.editor} />
						<UnderlineButton editor={editorState.editor} />
						<CodeButton editor={editorState.editor} />
						{#if codeBlocks}
							<CodeBlockButton editor={editorState.editor} />
						{/if}
						<ColorButton editor={editorState.editor} />
					</div>

					<div class="bubble-menu-divider"></div>

					<div class="bubble-menu-group">
						<LinkButton editor={editorState.editor} />
						<SuperscriptButton editor={editorState.editor} />
						<SubscriptButton editor={editorState.editor} />
					</div>

					<div class="bubble-menu-divider"></div>

					<div class="bubble-menu-group">
						<TableButton editor={editorState.editor} />
					</div>
				{/if}
			</div>
		{/if}

		<div
			bind:this={linkBubbleMenuElement}
			class="link-bubble-menu"
			style="visibility: hidden; opacity: 0; position: absolute;"
		>
			{#if editorState.editor}
				<LinkActionMenu editor={editorState.editor} {editable} />
			{/if}
		</div>

		<div class="editor-content" bind:this={element}></div>
	</div>
</FormGroup>

<style>
	.editor-container {
		position: relative;
		border: 1px solid var(--border-color);
		border-radius: 6px;
		background: var(--paper-body-bg);
		font-family: var(--ui-font-family);
		transition: border-color 0.2s ease;
	}

	.editor-container.dragging {
		border-color: var(--ui-tertiary);
		border-style: dashed;
	}

	.bubble-menu {
		display: flex;
		align-items: center;
		gap: 4px;
		padding: 6px;
		background: var(--paper-title-bg);
		border: 1px solid var(--border-color);
		border-radius: 6px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		flex-wrap: nowrap;
	}

	:global(.dark) .bubble-menu {
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
	}

	.bubble-menu-group {
		display: flex;
		align-items: center;
		gap: 2px;
	}

	.bubble-menu-divider {
		width: 1px;
		height: 24px;
		background: var(--border-color);
		margin: 0 4px;
	}

	.link-bubble-menu {
		z-index: 1100;
	}

	.editor-content {
		padding: 16px;
		min-height: 200px;
		color: var(--text-color);
	}

	/* TipTap Editor Styles */
	.editor-content :global(.ProseMirror) {
		outline: none;
	}

	.editor-content :global(.ProseMirror p) {
		margin: 0 0 1em 0;
	}

	.editor-content :global(.ProseMirror h1) {
		font-size: 2em;
		font-weight: bold;
		margin: 0.67em 0;
	}

	.editor-content :global(.ProseMirror h2) {
		font-size: 1.5em;
		font-weight: bold;
		margin: 0.75em 0;
	}

	.editor-content :global(.ProseMirror h3) {
		font-size: 1.17em;
		font-weight: bold;
		margin: 0.83em 0;
	}

	.editor-content :global(.ProseMirror ul),
	.editor-content :global(.ProseMirror ol) {
		padding-left: 1.5em;
		margin: 1em 0;
	}

	.editor-content :global(.ProseMirror code) {
		background: var(--page-bg);
		padding: 2px 6px;
		border-radius: 3px;
		font-family: 'Monaco', 'Courier New', monospace;
		font-size: 0.9em;
		color: var(--ui-accent-dark);
	}

	:global(.dark) .editor-content :global(.ProseMirror code) {
		color: var(--ui-accent);
	}

	.editor-content :global(.ProseMirror a) {
		color: var(--ui-tertiary-dark);
		text-decoration: underline;
		cursor: pointer;
		pointer-events: auto;
	}

	:global(.dark) .editor-content :global(.ProseMirror a) {
		color: var(--ui-tertiary);
	}

	.editor-content :global(.ProseMirror a.editor-link) {
		cursor: pointer;
		pointer-events: auto;
	}

	.editor-content :global(.ProseMirror a.editor-link:hover) {
		background: rgba(var(--ui-primary-rgbc), 0.1);
	}

	:global(.dark) .editor-content :global(.ProseMirror a.editor-link:hover) {
		background: rgba(var(--ui-accent-rgbc), 0.1);
	}

	.editor-content :global(.ProseMirror) {
		pointer-events: auto;
	}

	.editor-content :global(.ProseMirror img) {
		max-width: 100%;
		height: auto;
	}

	/* Table styles */
	.editor-content :global(.ProseMirror .tableWrapper) {
		overflow-x: auto;
		margin: 1em 0;
	}

	.editor-content :global(.ProseMirror table) {
		border-collapse: collapse;
		table-layout: fixed;
		width: 100%;
		overflow: hidden;
	}

	.editor-content :global(.ProseMirror th),
	.editor-content :global(.ProseMirror td) {
		position: relative;
		border: 1px solid var(--border-color);
		padding: 6px 10px;
		vertical-align: top;
		min-width: 1em;
		box-sizing: border-box;
	}

	.editor-content :global(.ProseMirror th) {
		background: var(--paper-title-bg);
		font-weight: 600;
		text-align: left;
	}

	.editor-content :global(.ProseMirror table p) {
		margin: 0;
	}

	.editor-content :global(.ProseMirror .selectedCell::after) {
		content: '';
		position: absolute;
		inset: 0;
		background: rgba(var(--ui-primary-rgbc), 0.08);
		pointer-events: none;
		z-index: 2;
	}

	:global(.dark) .editor-content :global(.ProseMirror .selectedCell::after) {
		background: rgba(var(--ui-accent-rgbc), 0.12);
	}

	.editor-content :global(.ProseMirror .column-resize-handle) {
		position: absolute;
		top: 0;
		bottom: -2px;
		right: -2px;
		width: 4px;
		background: var(--ui-tertiary);
		pointer-events: none;
		z-index: 20;
	}

	.editor-content :global(.ProseMirror.resize-cursor) {
		cursor: col-resize;
	}

	.editor-content :global(.ProseMirror [style*='text-align: left']) {
		text-align: left;
	}

	.editor-content :global(.ProseMirror [style*='text-align: center']) {
		text-align: center;
	}

	.editor-content :global(.ProseMirror [style*='text-align: right']) {
		text-align: right;
	}

	.editor-content :global(.ProseMirror [style*='text-align: justify']) {
		text-align: justify;
	}

	/* Placeholder styles */
	.editor-content :global(.ProseMirror p.is-editor-empty:first-child::before) {
		content: attr(data-placeholder);
		float: left;
		color: var(--placeholder-color);
		pointer-events: none;
		height: 0;
	}

	/* Alert styles */
	.editor-content :global(.ProseMirror .alert) {
		display: flex;
		flex-direction: column;
		border-radius: 0.25rem;
		padding: 0.5rem;
		margin: 0.5rem 0;
	}

	.editor-content :global(.ProseMirror .alert-title) {
		margin-bottom: 0.25rem;
		font-weight: 700;
	}

	.editor-content :global(.ProseMirror .alert-title::before) {
		content: attr(data-title-element);
		display: none;
	}

	.editor-content :global(.ProseMirror .alert-content) {
		line-height: 1.5;
	}

	.editor-content :global(.ProseMirror .alert-default) {
		background: rgba(var(--ui-accent-rgbc), 0.3);
		border: 1px solid var(--ui-accent);
		color: var(--text-color);
	}

	.editor-content :global(.ProseMirror .alert-default .alert-title) {
		color: var(--ui-primary);
	}

	.editor-content :global(.ProseMirror .alert-danger) {
		background: #f8d7da;
		color: #58151c;
		border: 1px solid #f1aeb5;
	}

	.editor-content :global(.ProseMirror .alert-danger .alert-title) {
		color: #58151c;
	}

	.editor-content :global(.ProseMirror .alert-warning) {
		background: #fff3cd;
		color: #664d03;
		border: 1px solid #ffe69c;
	}

	.editor-content :global(.ProseMirror .alert-warning .alert-title) {
		color: #664d03;
	}

	:global(.dark) .editor-content :global(.ProseMirror .alert-default) {
		background: rgba(var(--ui-primary-rgbc), 0.3);
		border-color: var(--ui-primary);
	}

	:global(.dark) .editor-content :global(.ProseMirror .alert-default .alert-title) {
		color: var(--white);
	}

	:global(.dark) .editor-content :global(.ProseMirror .alert-danger) {
		background: #2c0b0e;
		color: #ea868f;
		border-color: #842029;
	}

	:global(.dark) .editor-content :global(.ProseMirror .alert-danger .alert-title) {
		color: #ea868f;
	}

	:global(.dark) .editor-content :global(.ProseMirror .alert-warning) {
		background: #332701;
		color: #fff3cd;
		border-color: #997404;
	}

	:global(.dark) .editor-content :global(.ProseMirror .alert-warning .alert-title) {
		color: #fff3cd;
	}

	.editor-content :global(.alert p:last-child) {
		margin-bottom: 0;
	}

	.editor-content :global(.tiptap p:last-child) {
		margin-bottom: 0;
	}

	.editor-content :global(.alert) {
		margin-bottom: 1rem !important;
	}

	/* Collaboration caret styles */
	.editor-content :global(.collaboration-carets__caret) {
		position: relative;
		display: inline;
		border-left: 2px solid;
		margin-left: -1px;
		margin-right: -1px;
		pointer-events: none;
		word-break: normal;
	}

	.editor-content :global(.collaboration-carets__label) {
		position: absolute;
		top: -1.4em;
		left: -1px;
		font-size: 12px;
		font-weight: 600;
		line-height: normal;
		padding: 0.1rem 0.3rem;
		border-radius: 3px 3px 3px 0;
		color: #fff;
		white-space: nowrap;
		user-select: none;
		pointer-events: none;
	}

	/* Collaboration selection highlight */
	.editor-content :global(.ProseMirror-yjs-selection) {
		display: inline;
	}
</style>
