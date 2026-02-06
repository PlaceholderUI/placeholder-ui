<script lang="ts">
	import { Accordion, Paper, type AccordionItem } from '$lib/index.js';

	const basicItems: AccordionItem[] = [
		{ id: 'item-1', title: 'What is Placeholder UI?', content: 'Placeholder UI is a Svelte 5 component library that provides a comprehensive set of accessible, customizable UI components built with modern web standards.' },
		{ id: 'item-2', title: 'How do I install it?', content: 'Install via npm: npm install @anthropic-public/ui-svelte. The library requires Svelte 5 and uses runes exclusively.' },
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
</script>

<h1>Accordion</h1>
<p>Accordion displays collapsible content panels for presenting information in a limited space.</p>

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
	<table class="props-table">
		<thead>
			<tr>
				<th>Prop</th>
				<th>Type</th>
				<th>Default</th>
				<th>Description</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>items</code></td>
				<td><code>AccordionItem[]</code></td>
				<td><code>[]</code></td>
				<td>Array of accordion items with id, title, and content</td>
			</tr>
			<tr>
				<td><code>multiple</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Allow multiple panels to be open at once</td>
			</tr>
			<tr>
				<td><code>defaultOpen</code></td>
				<td><code>string[]</code></td>
				<td><code>[]</code></td>
				<td>Array of item IDs to open by default</td>
			</tr>
			<tr>
				<td><code>variant</code></td>
				<td><code>'default' | 'contained' | 'filled' | 'separated'</code></td>
				<td><code>'default'</code></td>
				<td>Visual style variant</td>
			</tr>
			<tr>
				<td><code>radius</code></td>
				<td><code>'none' | 'sm' | 'md' | 'lg'</code></td>
				<td><code>'md'</code></td>
				<td>Border radius size</td>
			</tr>
			<tr>
				<td><code>chevronPosition</code></td>
				<td><code>'left' | 'right'</code></td>
				<td><code>'right'</code></td>
				<td>Position of the expand/collapse chevron icon</td>
			</tr>
			<tr>
				<td><code>disableChevronRotation</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Prevent chevron from rotating on open</td>
			</tr>
			<tr>
				<td><code>class</code></td>
				<td><code>string</code></td>
				<td><code>''</code></td>
				<td>Additional CSS classes</td>
			</tr>
		</tbody>
	</table>
</Paper>

<style>
	h1 { margin-bottom: 0.5rem; }
	p { color: var(--pui-color-text-secondary); margin-bottom: 1.5rem; }
	.props-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
	.props-table th, .props-table td { text-align: left; padding: 0.75rem; border-bottom: 1px solid var(--pui-color-border); }
	.props-table th { font-weight: 600; background: var(--pui-color-bg-secondary); }
	.props-table code { background: var(--pui-color-bg-tertiary); padding: 0.125rem 0.375rem; border-radius: 4px; font-size: 0.8125rem; }
</style>
