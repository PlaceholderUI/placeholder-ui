import { Node, mergeAttributes } from '@tiptap/core';

export interface AlertOptions {
	HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
	interface Commands<ReturnType> {
		alert: {
			/**
			 * Insert an alert block
			 */
			setAlert: (attributes?: { variant?: string; title?: string }) => ReturnType;
		};
	}
}

export const Alert = Node.create<AlertOptions>({
	name: 'alert',

	group: 'block',

	content: 'block+',

	defining: true,

	addAttributes() {
		return {
			variant: {
				default: 'default',
				parseHTML: (element) => element.getAttribute('data-variant'),
				renderHTML: (attributes) => {
					return {
						'data-variant': attributes.variant
					};
				}
			},
			title: {
				default: 'Alert',
				parseHTML: (element) => element.getAttribute('data-title'),
				renderHTML: (attributes) => {
					return {
						'data-title': attributes.title
					};
				}
			}
		};
	},

	parseHTML() {
		return [
			{
				tag: 'div[data-type="alert"]'
			}
		];
	},

	renderHTML({ HTMLAttributes }) {
		return [
			'div',
			mergeAttributes(HTMLAttributes, {
				'data-type': 'alert',
				class: `alert alert-${HTMLAttributes['data-variant'] || 'default'}`
			}),
			[
				'div',
				{ class: 'alert-title', 'data-title-element': 'true' },
				HTMLAttributes['data-title'] || 'Alert'
			],
			['div', { class: 'alert-content' }, 0]
		];
	},

	addCommands() {
		return {
			setAlert:
				(attributes) =>
				({ commands }) => {
					return commands.insertContent({
						type: this.name,
						attrs: attributes,
						content: [
							{
								type: 'paragraph',
								content: [
									{
										type: 'text',
										text: 'Enter your alert message here...'
									}
								]
							}
						]
					});
				}
		};
	}
});
