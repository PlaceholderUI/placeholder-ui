import { Extension } from '@tiptap/core';

/**
 * Node and mark types that keep their `class` attribute by default. Types that
 * already manage `class` themselves (div, span, alert, link) are left alone.
 */
export const defaultClassAttributeTypes = [
	'paragraph',
	'heading',
	'blockquote',
	'bulletList',
	'orderedList',
	'listItem',
	'codeBlock',
	'horizontalRule',
	'image',
	'table',
	'tableRow',
	'tableHeader',
	'tableCell',
	'bold',
	'italic',
	'strike',
	'code',
	'underline',
	'subscript',
	'superscript',
	'textStyle'
] as const;

export interface ClassAttributeOptions {
	/** Node and mark type names that should preserve `class` (default: all standard types) */
	types: string[];
}

/**
 * Preserves the `class` attribute on standard nodes and marks so classes in
 * loaded or pasted HTML survive the round-trip through the editor instead of
 * being stripped by the schema.
 */
export const ClassAttribute = Extension.create<ClassAttributeOptions>({
	name: 'classAttribute',

	addOptions() {
		return {
			types: [...defaultClassAttributeTypes]
		};
	},

	addGlobalAttributes() {
		return [
			{
				types: this.options.types,
				attributes: {
					class: {
						default: null,
						parseHTML: (element) => element.getAttribute('class') || null,
						renderHTML: (attributes) => {
							if (!attributes.class) return {};
							return { class: attributes.class };
						}
					}
				}
			}
		];
	}
});
