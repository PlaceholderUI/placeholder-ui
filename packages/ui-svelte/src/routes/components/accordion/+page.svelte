<script lang="ts">
	import { Table, Accordion, Paper, type AccordionItem } from '$lib/index.js';
	import type { Column } from '$lib/index.js';

	const basicItems: AccordionItem[] = [
		{ id: 'item-1', title: 'What is Placeholder UI?', content: 'Placeholder UI is a Svelte 5 component library that provides a comprehensive set of accessible, customizable UI components built with modern web standards.' },
		{ id: 'item-2', title: 'How do I install it?', content: 'Install via npm: npm install @placeholderco/placeholder-ui. The library requires Svelte 5 and uses runes exclusively.' },
		{ id: 'item-3', title: 'Is it free to use?', content: 'Yes, Placeholder UI is open source and free to use in both personal and commercial projects.' },
		{ id: 'item-4', title: 'Does it support dark mode?', content: 'Yes, all components support dark mode out of the box via CSS custom properties and the .dark class on the document root.' }
	];

	const multipleItems: AccordionItem[] = [
		{ id: 'multi-1', title: 'First Section', content: 'Content of the first section. In multiple mode, you can open several sections simultaneously.' },
		{ id: 'multi-2', title: 'Second Section', content: 'Content of the second section. Try opening this along with other sections.' },
		{ id: 'multi-3', title: 'Third Section', content: 'Content of the third section. All three can be open at the same time.' }
	];

	const variantItems: AccordionItem[] = [
		{ id: 'v-1', title: 'Section One', content: 'This accordion uses a specific variant style.' },
		{ id: 'v-2', title: 'Section Two', content: 'Different variants change the visual appearance of the accordion.' },
		{ id: 'v-3', title: 'Section Three', content: 'Choose the variant that best fits your design.' }
	];

	interface PropRow {
		prop: string;
		type: string;
		default: string;
		description: string;
	}

	const propsColumns: Column<PropRow>[] = [
		{ key: 'prop', label: 'Prop' },
		{ key: 'type', label: 'Type' },
		{ key: 'default', label: 'Default' },
		{ key: 'description', label: 'Description' },
	];

	const propsRows: PropRow[] = [
		{ prop: 'items', type: 'AccordionItem[]', default: '[]', description: 'Array of accordion items with id, title, and content' },
		{ prop: 'multiple', type: 'boolean', default: 'false', description: 'Allow multiple panels to be open at once' },
		{ prop: 'defaultOpen', type: 'string[]', default: '[]', description: 'Array of item IDs to open by default' },
		{ prop: 'variant', type: '\'default\' | \'contained\' | \'filled\' | \'separated\'', default: '\'default\'', description: 'Visual style variant' },
		{ prop: 'radius', type: '\'none\' | \'sm\' | \'md\' | \'lg\'', default: '\'md\'', description: 'Border radius size' },
		{ prop: 'chevronPosition', type: '\'left\' | \'right\'', default: '\'right\'', description: 'Position of the expand/collapse chevron icon' },
		{ prop: 'disableChevronRotation', type: 'boolean', default: 'false', description: 'Prevent chevron from rotating on open' },
		{ prop: 'class', type: 'string', default: '\'\'', description: 'Additional CSS classes' },
	];
</script>

<h1>Accordion</h1>
<p>Accordion displays collapsible content panels for presenting information in a limited space.</p>

<div class="vstack">
	<Paper title="Basic Usage">
		<Accordion items={basicItems} />
	</Paper>

	<Paper title="Multiple Open">
		<Accordion items={multipleItems} multiple />
	</Paper>

	<Paper title="Variants">
		<h3 style="margin-bottom: 0.5rem;">Default</h3>
		<Accordion items={variantItems} variant="default" />

		<h3 style="margin: 1.5rem 0 0.5rem;">Contained</h3>
		<Accordion items={variantItems.map(i => ({ ...i, id: 'c-' + i.id }))} variant="contained" />

		<h3 style="margin: 1.5rem 0 0.5rem;">Filled</h3>
		<Accordion items={variantItems.map(i => ({ ...i, id: 'f-' + i.id }))} variant="filled" />

		<h3 style="margin: 1.5rem 0 0.5rem;">Separated</h3>
		<Accordion items={variantItems.map(i => ({ ...i, id: 's-' + i.id }))} variant="separated" />
	</Paper>

	<Paper title="Chevron Left">
		<Accordion items={basicItems.map(i => ({ ...i, id: 'left-' + i.id }))} chevronPosition="left" />
	</Paper>

	<Paper title="Default Open">
		<Accordion items={basicItems.map(i => ({ ...i, id: 'open-' + i.id }))} defaultOpen={['open-item-1', 'open-item-3']} multiple />
	</Paper>

	<Paper title="Props">
		<Table columns={propsColumns} rows={propsRows} striped hover={false} />
	</Paper>
</div>

<style>
	h1 { margin-bottom: 0.5rem; }
	p { color: var(--pui-color-text-secondary); margin-bottom: 1.5rem; }</style>
