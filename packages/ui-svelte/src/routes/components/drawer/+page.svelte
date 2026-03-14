<script lang="ts">
	import { Table, Drawer, Button, Paper, type SidenavSection } from '$lib/index.js';
	import type { Column } from '$lib/index.js';

	let basicOpen = $state(false);
	let rightOpen = $state(false);
	let titleOpen = $state(false);
	let sectionsOpen = $state(false);
	let footerOpen = $state(false);

	const sampleSections: SidenavSection[] = [
		{
			title: 'Navigation',
			items: [
				{ label: 'Dashboard', href: '#' },
				{ label: 'Settings', href: '#' },
				{ label: 'Profile', href: '#' }
			]
		},
		{
			title: 'Resources',
			items: [
				{ label: 'Documentation', href: '#' },
				{ label: 'Support', href: '#' }
			]
		}
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
		{ prop: 'open', type: 'boolean', default: 'false', description: 'Bindable visibility state' },
		{ prop: 'position', type: '\'left\' | \'right\'', default: '\'left\'', description: 'Which edge the drawer slides from' },
		{ prop: 'width', type: 'string', default: '\'320px\'', description: 'Width of the drawer panel' },
		{ prop: 'closeOnClickOutside', type: 'boolean', default: 'true', description: 'Close when clicking the backdrop' },
		{ prop: 'closeOnEscape', type: 'boolean', default: 'true', description: 'Close when pressing Escape' },
		{ prop: 'title', type: 'string', default: '\'\'', description: 'Title text in the drawer header' },
		{ prop: 'sections', type: 'SidenavSection[]', default: '[]', description: 'Navigation sections to render' },
		{ prop: 'class', type: 'string', default: '\'\'', description: 'Additional CSS classes' },
		{ prop: 'onclose', type: '() => void', default: 'undefined', description: 'Callback when drawer closes' },
		{ prop: 'children', type: 'Snippet', default: 'undefined', description: 'Main content slot' },
		{ prop: 'header', type: 'Snippet', default: 'undefined', description: 'Custom header content' },
		{ prop: 'footer', type: 'Snippet', default: 'undefined', description: 'Footer content slot' },
	];
</script>

<h1>Drawer</h1>
<p>A sliding panel that appears from the edge of the screen, useful for navigation or supplementary content.</p>

<div class="vstack">
	<Paper title="Basic Drawer">
		<Button onclick={() => (basicOpen = true)}>Open Drawer</Button>
		<div class="value-display">open: {basicOpen}</div>
		<Drawer bind:open={basicOpen}>
			<div style="padding: 1rem;">
				<h3>Drawer Content</h3>
				<p>This is a basic drawer with custom content. Click outside or press Escape to close.</p>
			</div>
		</Drawer>
	</Paper>

	<Paper title="Right Position">
		<Button variant="secondary" onclick={() => (rightOpen = true)}>Open Right Drawer</Button>
		<div class="value-display">open: {rightOpen}</div>
		<Drawer bind:open={rightOpen} position="right">
			<div style="padding: 1rem;">
				<h3>Right Drawer</h3>
				<p>This drawer slides in from the right side of the screen.</p>
			</div>
		</Drawer>
	</Paper>

	<Paper title="With Title">
		<Button variant="primary-outline" onclick={() => (titleOpen = true)}>Open Titled Drawer</Button>
		<Drawer bind:open={titleOpen} title="Navigation Menu">
			<div style="padding: 1rem;">
				<p>This drawer has a title in the header area.</p>
			</div>
		</Drawer>
	</Paper>

	<Paper title="With Sections">
		<Button variant="secondary" onclick={() => (sectionsOpen = true)}>Open Nav Drawer</Button>
		<Drawer bind:open={sectionsOpen} title="Menu" sections={sampleSections} />
	</Paper>

	<Paper title="With Footer">
		<Button variant="primary-outline" onclick={() => (footerOpen = true)}>Open with Footer</Button>
		<Drawer bind:open={footerOpen} title="Drawer with Footer">
			<div style="padding: 1rem;">
				<p>This drawer has a footer section at the bottom.</p>
			</div>
			{#snippet footer()}
				<div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
					<Button variant="muted" onclick={() => (footerOpen = false)}>Cancel</Button>
					<Button variant="primary" onclick={() => (footerOpen = false)}>Save</Button>
				</div>
			{/snippet}
		</Drawer>
	</Paper>

	<Paper title="Props">
		<Table columns={propsColumns} rows={propsRows} striped hover={false} />
	</Paper>
</div>

<style>
	h1 { margin-bottom: 0.5rem; }
	p { color: var(--pui-color-text-secondary); margin-bottom: 1.5rem; }
	.value-display { font-size: 0.875rem; color: var(--pui-color-text-muted); font-family: monospace; margin-top: 0.5rem; }</style>
