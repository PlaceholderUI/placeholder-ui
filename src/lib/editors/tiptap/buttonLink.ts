/**
 * Call-to-action buttons in TipTap content.
 *
 * A button is an ordinary link whose `class` attribute carries `editor-button`
 * plus a variant and, optionally, a size class. The styles live in `app.css`
 * (global, built on the `--ui-*` tokens) so the saved HTML looks the same in
 * the editor and wherever the consumer renders it.
 */

export const editorButtonVariants = [
	'primary',
	'accent',
	'tertiary',
	'primary-outline',
	'accent-outline'
] as const;

export type EditorButtonVariant = (typeof editorButtonVariants)[number];

export const editorButtonSizes = ['sm', 'md', 'lg'] as const;

export type EditorButtonSize = (typeof editorButtonSizes)[number];

export interface EditorButtonStyle {
	variant: EditorButtonVariant;
	size: EditorButtonSize;
}

export const EDITOR_BUTTON_CLASS = 'editor-button';

const CLASS_PREFIX = `${EDITOR_BUTTON_CLASS}-`;

/** The link `class` value for a button style, e.g. `editor-button editor-button-accent editor-button-lg`. */
export function editorButtonClass(style: EditorButtonStyle): string {
	const classes = [EDITOR_BUTTON_CLASS, `${CLASS_PREFIX}${style.variant}`];
	if (style.size !== 'md') classes.push(`${CLASS_PREFIX}${style.size}`);
	return classes.join(' ');
}

/** The button style encoded in a link's `class`, or `null` when the link is not a button. */
export function parseEditorButtonClass(
	className: string | null | undefined
): EditorButtonStyle | null {
	const tokens = (className ?? '').split(/\s+/).filter(Boolean);
	if (!tokens.includes(EDITOR_BUTTON_CLASS)) return null;

	let variant: EditorButtonVariant = 'primary';
	let size: EditorButtonSize = 'md';
	for (const token of tokens) {
		if (!token.startsWith(CLASS_PREFIX)) continue;
		const suffix = token.slice(CLASS_PREFIX.length);
		if ((editorButtonVariants as readonly string[]).includes(suffix)) {
			variant = suffix as EditorButtonVariant;
		} else if ((editorButtonSizes as readonly string[]).includes(suffix)) {
			size = suffix as EditorButtonSize;
		}
	}
	return { variant, size };
}
