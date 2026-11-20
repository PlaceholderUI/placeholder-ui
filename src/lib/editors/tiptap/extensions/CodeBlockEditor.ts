import { CodeBlock, type CodeBlockOptions } from '@tiptap/extension-code-block';
import type { Editor, KeyboardShortcutCommand } from '@tiptap/core';
import { Selection, TextSelection } from '@tiptap/pm/state';
import { exitCode } from '@tiptap/pm/commands';
import type { Node as ProseMirrorNode } from '@tiptap/pm/model';
import type { EditorView as ProseMirrorView, NodeView } from '@tiptap/pm/view';
import {
	EditorView as CodeMirrorView,
	drawSelection,
	keymap,
	type KeyBinding,
	type ViewUpdate
} from '@codemirror/view';
import { Compartment, EditorState as CodeMirrorState } from '@codemirror/state';
import { defaultKeymap, indentWithTab } from '@codemirror/commands';
import {
	autocompletion,
	closeBrackets,
	closeBracketsKeymap,
	completionKeymap
} from '@codemirror/autocomplete';
import { bracketMatching, indentOnInput, syntaxHighlighting } from '@codemirror/language';
import { classHighlighter } from '@lezer/highlight';
import {
	codeBlockLanguages,
	resolveCodeBlockLanguage,
	type CodeBlockLanguageDef,
	type CodeBlockLanguageId
} from './codeBlockLanguages.js';
import './codeBlockEditor.css';

/** Configuration accepted by the `codeBlocks` prop on TipTap / TipTapBubble */
export interface CodeBlocksOptions {
	/** Languages offered in the code block language picker (default: all registered) */
	languages?: CodeBlockLanguageId[];
	/** Language applied to newly inserted code blocks (default 'javascript') */
	defaultLanguage?: CodeBlockLanguageId;
}

export interface CodeBlockEditorOptions extends CodeBlockOptions {
	/** Language ids offered in the picker; null offers every registered language */
	languages: CodeBlockLanguageId[] | null;
}

/**
 * Renders each code block as an embedded CodeMirror editor, following the
 * ProseMirror codemirror node view pattern: CodeMirror owns the block's text and
 * selection while focused, and every change is forwarded to ProseMirror so the
 * document (and collaboration/undo) stay authoritative.
 */
class CodeBlockView implements NodeView {
	dom: HTMLElement;

	private node: ProseMirrorNode;
	private editor: Editor;
	private getPos: () => number | undefined;
	private cm: CodeMirrorView;
	private select: HTMLSelectElement;
	private languageCompartment = new Compartment();
	private updating = false;

	constructor(
		node: ProseMirrorNode,
		editor: Editor,
		getPos: () => number | undefined,
		languages: CodeBlockLanguageDef[]
	) {
		this.node = node;
		this.editor = editor;
		this.getPos = getPos;

		const editable = editor.isEditable;

		this.cm = new CodeMirrorView({
			doc: node.textContent,
			extensions: [
				keymap.of([
					...closeBracketsKeymap,
					...completionKeymap,
					...this.codeMirrorKeymap(),
					...defaultKeymap,
					indentWithTab
				]),
				drawSelection(),
				syntaxHighlighting(classHighlighter),
				bracketMatching(),
				closeBrackets(),
				autocompletion(),
				indentOnInput(),
				CodeMirrorView.lineWrapping,
				this.languageCompartment.of(this.languageExtension()),
				CodeMirrorView.editable.of(editable),
				CodeMirrorState.readOnly.of(!editable),
				CodeMirrorView.updateListener.of((update) => this.forwardUpdate(update))
			]
		});

		this.select = this.buildLanguageSelect(languages, editable);

		this.dom = document.createElement('div');
		this.dom.className = 'code-block-editor';
		this.dom.appendChild(this.select);
		this.dom.appendChild(this.cm.dom);
	}

	// The ProseMirror view is looked up lazily because node views are constructed
	// while the outer view itself is still being created.
	private get view(): ProseMirrorView {
		return this.editor.view;
	}

	private languageExtension() {
		return resolveCodeBlockLanguage(this.node.attrs.language)?.load() ?? [];
	}

	private buildLanguageSelect(languages: CodeBlockLanguageDef[], editable: boolean) {
		const select = document.createElement('select');
		select.className = 'code-block-language';
		select.setAttribute('aria-label', 'Code language');
		select.contentEditable = 'false';

		for (const def of languages) {
			const option = document.createElement('option');
			option.value = def.id;
			option.textContent = def.label;
			select.appendChild(option);
		}

		select.disabled = !editable;
		this.syncSelect(select);

		select.addEventListener('change', () => {
			const pos = this.getPos();
			if (pos === undefined) return;
			this.view.dispatch(
				this.view.state.tr.setNodeMarkup(pos, undefined, {
					...this.node.attrs,
					language: select.value
				})
			);
			this.cm.focus();
		});

		return select;
	}

	// Reflect the node's language in the picker, adding a fallback option for
	// languages present in parsed content but missing from the configured list.
	private syncSelect(select: HTMLSelectElement = this.select) {
		const raw = this.node.attrs.language as string | null;
		const current = resolveCodeBlockLanguage(raw)?.id ?? raw ?? 'plaintext';
		if (![...select.options].some((option) => option.value === current)) {
			const option = document.createElement('option');
			option.value = current;
			option.textContent = current;
			select.appendChild(option);
		}
		select.value = current;
	}

	// Map CodeMirror document/selection changes onto the ProseMirror document.
	private forwardUpdate(update: ViewUpdate) {
		if (this.updating || !this.cm.hasFocus) return;
		const pos = this.getPos();
		if (pos === undefined) return;

		let offset = pos + 1;
		const { main } = update.state.selection;
		const selFrom = offset + main.from;
		const selTo = offset + main.to;
		const pmSelection = this.view.state.selection;

		if (update.docChanged || pmSelection.from !== selFrom || pmSelection.to !== selTo) {
			const tr = this.view.state.tr;
			update.changes.iterChanges((fromA, toA, fromB, toB, text) => {
				if (text.length) {
					tr.replaceWith(
						offset + fromA,
						offset + toA,
						this.view.state.schema.text(text.toString())
					);
				} else {
					tr.delete(offset + fromA, offset + toA);
				}
				offset += toB - fromB - (toA - fromA);
			});
			tr.setSelection(TextSelection.create(tr.doc, selFrom, selTo));
			this.view.dispatch(tr);
		}
	}

	private codeMirrorKeymap(): KeyBinding[] {
		return [
			{ key: 'ArrowUp', run: () => this.maybeEscape('line', -1) },
			{ key: 'ArrowLeft', run: () => this.maybeEscape('char', -1) },
			{ key: 'ArrowDown', run: () => this.maybeEscape('line', 1) },
			{ key: 'ArrowRight', run: () => this.maybeEscape('char', 1) },
			{ key: 'Escape', run: () => this.escape() },
			{
				key: 'Mod-Enter',
				run: () => {
					if (!exitCode(this.view.state, this.view.dispatch)) return false;
					this.view.focus();
					return true;
				}
			},
			{ key: 'Backspace', run: () => this.removeWhenEmpty() },
			{ key: 'Mod-z', run: () => this.editor.commands.undo() },
			{ key: 'Mod-y', run: () => this.editor.commands.redo() },
			{ key: 'Shift-Mod-z', run: () => this.editor.commands.redo() }
		];
	}

	// Move the selection out of the block when an arrow key is pressed at its edge.
	private maybeEscape(unit: 'char' | 'line', dir: -1 | 1): boolean {
		const { state } = this.cm;
		const { main } = state.selection;
		if (!main.empty) return false;

		if (unit === 'line') {
			const line = state.doc.lineAt(main.head);
			if (dir < 0 ? line.from > 0 : line.to < state.doc.length) return false;
		} else if (dir < 0 ? main.from > 0 : main.to < state.doc.length) {
			return false;
		}

		const pos = this.getPos();
		if (pos === undefined) return false;

		const after = pos + this.node.nodeSize;

		// Arrowing down out of a trailing code block: create a paragraph to land in.
		if (dir > 0 && unit === 'line' && after >= this.view.state.doc.content.size) {
			const paragraph = this.view.state.schema.nodes.paragraph.createAndFill();
			if (!paragraph) return false;
			const tr = this.view.state.tr.insert(after, paragraph);
			tr.setSelection(TextSelection.create(tr.doc, after + 1));
			this.view.dispatch(tr.scrollIntoView());
			this.view.focus();
			return true;
		}

		const selection = Selection.near(this.view.state.doc.resolve(dir < 0 ? pos : after), dir);
		this.view.dispatch(this.view.state.tr.setSelection(selection).scrollIntoView());
		this.view.focus();
		return true;
	}

	private escape(): boolean {
		const pos = this.getPos();
		if (pos === undefined) return false;
		const selection = Selection.near(this.view.state.doc.resolve(pos + this.node.nodeSize), 1);
		this.view.dispatch(this.view.state.tr.setSelection(selection).scrollIntoView());
		this.view.focus();
		return true;
	}

	// Backspace in an empty block converts it back to a paragraph.
	private removeWhenEmpty(): boolean {
		if (this.cm.state.doc.length > 0) return false;
		const pos = this.getPos();
		if (pos === undefined) return false;

		const paragraph = this.view.state.schema.nodes.paragraph.createAndFill();
		if (!paragraph) return false;

		const tr = this.view.state.tr.replaceWith(pos, pos + this.node.nodeSize, paragraph);
		tr.setSelection(TextSelection.create(tr.doc, pos + 1));
		this.view.dispatch(tr);
		this.view.focus();
		return true;
	}

	// Apply external changes (undo, collaboration, setContent) to CodeMirror.
	update(node: ProseMirrorNode): boolean {
		if (node.type !== this.node.type) return false;

		const previousLanguage = this.node.attrs.language;
		this.node = node;

		if (node.attrs.language !== previousLanguage) {
			this.syncSelect();
			this.cm.dispatch({
				effects: this.languageCompartment.reconfigure(this.languageExtension())
			});
		}

		const newText = node.textContent;
		const currentText = this.cm.state.doc.toString();
		if (newText !== currentText) {
			let start = 0;
			let currentEnd = currentText.length;
			let newEnd = newText.length;
			while (
				start < currentEnd &&
				start < newEnd &&
				currentText.charCodeAt(start) === newText.charCodeAt(start)
			) {
				start++;
			}
			while (
				currentEnd > start &&
				newEnd > start &&
				currentText.charCodeAt(currentEnd - 1) === newText.charCodeAt(newEnd - 1)
			) {
				currentEnd--;
				newEnd--;
			}
			this.updating = true;
			this.cm.dispatch({
				changes: { from: start, to: currentEnd, insert: newText.slice(start, newEnd) }
			});
			this.updating = false;
		}
		return true;
	}

	setSelection(anchor: number, head: number) {
		this.cm.focus();
		this.updating = true;
		this.cm.dispatch({ selection: { anchor, head } });
		this.updating = false;
	}

	selectNode() {
		this.cm.focus();
	}

	stopEvent() {
		return true;
	}

	ignoreMutation() {
		return true;
	}

	destroy() {
		this.cm.destroy();
	}
}

// Let arrow keys move the cursor from an adjacent textblock into a code block;
// ProseMirror can't do this itself because the block's content lives in CodeMirror.
function arrowIntoCodeBlock(direction: 'left' | 'right' | 'up' | 'down'): KeyboardShortcutCommand {
	return ({ editor }) => {
		const { state, view } = editor;
		if (!state.selection.empty || !view.endOfTextblock(direction)) return false;

		const side = direction === 'left' || direction === 'up' ? -1 : 1;
		const { $head } = state.selection;
		try {
			const nextPos = Selection.near(
				state.doc.resolve(side > 0 ? $head.after() : $head.before()),
				side
			);
			if (nextPos.$head && nextPos.$head.parent.type.name === 'codeBlock') {
				view.dispatch(state.tr.setSelection(nextPos));
				return true;
			}
		} catch {
			// selection sits at the document boundary — nothing to move into
		}
		return false;
	};
}

/**
 * CodeBlock extension whose blocks are full CodeMirror editors: syntax
 * highlighting, autocompletion, bracket matching and smart indentation, with a
 * per-block language picker. Serializes to standard
 * `<pre><code class="language-...">` HTML, so content round-trips unchanged.
 */
export const CodeBlockEditor = CodeBlock.extend<CodeBlockEditorOptions>({
	addOptions() {
		const parent = this.parent?.() ?? ({} as CodeBlockOptions);
		return {
			...parent,
			defaultLanguage: 'javascript',
			languages: null
		};
	},

	addKeyboardShortcuts() {
		return {
			...this.parent?.(),
			ArrowLeft: arrowIntoCodeBlock('left'),
			ArrowRight: arrowIntoCodeBlock('right'),
			ArrowUp: arrowIntoCodeBlock('up'),
			ArrowDown: arrowIntoCodeBlock('down')
		};
	},

	addNodeView() {
		const configured = this.options.languages;
		const languages = configured
			? configured
					.map((id) => resolveCodeBlockLanguage(id))
					.filter((def): def is CodeBlockLanguageDef => Boolean(def))
			: codeBlockLanguages;

		return ({ node, editor, getPos }) => new CodeBlockView(node, editor, getPos, languages);
	}
});
