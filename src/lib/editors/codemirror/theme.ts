import type { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags as t } from '@lezer/highlight';

// The editor's surfaces come from the library's tokens, so it matches inputs and papers and
// follows a re-brand. Syntax colours are `--cm-*` properties, set per mode by CodeMirror.svelte.
const chrome = {
	'&': { color: 'var(--text-color)', backgroundColor: 'var(--input-bg-color)' },
	'.cm-content': { caretColor: 'var(--text-color)' },
	'.cm-cursor, .cm-dropCursor': { borderLeftColor: 'var(--text-color)' },
	'.cm-gutters': {
		backgroundColor: 'var(--input-bg-color)',
		color: 'var(--text-muted)',
		borderRight: '1px solid var(--border-color)'
	},
	'.cm-activeLine, .cm-activeLineGutter': { backgroundColor: 'var(--hover-bg)' },
	'&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection':
		{ backgroundColor: 'rgba(var(--ui-tertiary-rgbc), 0.35)' },
	'.cm-selectionMatch': { backgroundColor: 'rgba(var(--ui-tertiary-rgbc), 0.2)' },
	'.cm-panels': { backgroundColor: 'var(--paper-body-bg)', color: 'var(--text-color)' },
	'.cm-tooltip': {
		backgroundColor: 'var(--paper-body-bg)',
		color: 'var(--text-color)',
		border: '1px solid var(--border-color)'
	},
	'.cm-placeholder': { color: 'var(--text-muted)' }
};

const lightChrome = EditorView.theme(chrome);
// `dark` also switches the `&dark` rules in base themes, such as the log level colours.
const darkChrome = EditorView.theme(chrome, { dark: true });

const highlightStyle = HighlightStyle.define([
	{
		tag: [t.keyword, t.controlKeyword, t.operatorKeyword, t.modifier, t.definitionKeyword],
		color: 'var(--cm-keyword)'
	},
	{ tag: [t.string, t.special(t.string), t.regexp, t.inserted], color: 'var(--cm-string)' },
	{ tag: [t.number, t.bool, t.null, t.atom, t.unit], color: 'var(--cm-number)' },
	{
		tag: [t.comment, t.lineComment, t.blockComment, t.docComment],
		color: 'var(--cm-comment)',
		fontStyle: 'italic'
	},
	{ tag: [t.meta, t.processingInstruction], color: 'var(--cm-comment)' },
	{
		tag: [t.function(t.variableName), t.function(t.propertyName), t.macroName, t.labelName],
		color: 'var(--cm-function)'
	},
	{ tag: [t.typeName, t.className, t.namespace, t.standard(t.typeName)], color: 'var(--cm-type)' },
	{
		tag: [t.definition(t.variableName), t.special(t.variableName), t.local(t.variableName)],
		color: 'var(--cm-variable)'
	},
	{ tag: [t.propertyName, t.attributeName], color: 'var(--cm-property)' },
	{ tag: [t.tagName, t.angleBracket], color: 'var(--cm-tag)' },
	{ tag: [t.operator, t.derefOperator], color: 'var(--cm-operator)' },
	{ tag: [t.invalid, t.deleted], color: 'var(--cm-invalid)' },
	{ tag: t.heading, color: 'var(--cm-keyword)', fontWeight: '600' },
	{ tag: t.strong, fontWeight: '600' },
	{ tag: t.emphasis, fontStyle: 'italic' },
	{ tag: t.strikethrough, textDecoration: 'line-through' },
	{ tag: [t.link, t.url], color: 'var(--ui-link-color)', textDecoration: 'underline' }
]);

/** The editor theme for the library's own light or dark mode */
export function libraryTheme(dark: boolean): Extension {
	return [dark ? darkChrome : lightChrome, syntaxHighlighting(highlightStyle)];
}
