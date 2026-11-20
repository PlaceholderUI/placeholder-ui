// Code blocks and the CodeMirror component share one registry; these names predate it.
export {
	codeLanguages as codeBlockLanguages,
	resolveCodeLanguage as resolveCodeBlockLanguage
} from '../../codemirror/languages.js';
export type {
	CodeLanguageDef as CodeBlockLanguageDef,
	CodeLanguageId as CodeBlockLanguageId
} from '../../codemirror/languages.js';
