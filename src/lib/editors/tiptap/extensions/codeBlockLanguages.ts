// Code block styles are imported here rather than in CodeBlockEditor so that read-only
// renderers using only resolveCodeBlockLanguage still load them. Production builds split
// CSS per chunk, so an import that lives only in the editor would not reach those routes.
import './codeBlockEditor.css';

// Code blocks and the CodeMirror component share one registry; these names predate it.
export {
	codeLanguages as codeBlockLanguages,
	resolveCodeLanguage as resolveCodeBlockLanguage
} from '../../codemirror/languages.js';
export type {
	CodeLanguageDef as CodeBlockLanguageDef,
	CodeLanguageId as CodeBlockLanguageId
} from '../../codemirror/languages.js';
