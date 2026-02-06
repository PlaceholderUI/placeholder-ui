<script lang="ts">
	import { Drawer, Button, Paper, type SidenavSection } from '$lib/index.js';

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
</script>

<h1>Drawer</h1>
<p>A sliding panel that appears from the edge of the screen, useful for navigation or supplementary content.</p>

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
				<td><code>open</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Bindable visibility state</td>
			</tr>
			<tr>
				<td><code>position</code></td>
				<td><code>'left' | 'right'</code></td>
				<td><code>'left'</code></td>
				<td>Which edge the drawer slides from</td>
			</tr>
			<tr>
				<td><code>width</code></td>
				<td><code>string</code></td>
				<td><code>'320px'</code></td>
				<td>Width of the drawer panel</td>
			</tr>
			<tr>
				<td><code>closeOnClickOutside</code></td>
				<td><code>boolean</code></td>
				<td><code>true</code></td>
				<td>Close when clicking the backdrop</td>
			</tr>
			<tr>
				<td><code>closeOnEscape</code></td>
				<td><code>boolean</code></td>
				<td><code>true</code></td>
				<td>Close when pressing Escape</td>
			</tr>
			<tr>
				<td><code>title</code></td>
				<td><code>string</code></td>
				<td><code>''</code></td>
				<td>Title text in the drawer header</td>
			</tr>
			<tr>
				<td><code>sections</code></td>
				<td><code>SidenavSection[]</code></td>
				<td><code>[]</code></td>
				<td>Navigation sections to render</td>
			</tr>
			<tr>
				<td><code>class</code></td>
				<td><code>string</code></td>
				<td><code>''</code></td>
				<td>Additional CSS classes</td>
			</tr>
			<tr>
				<td><code>onclose</code></td>
				<td><code>() => void</code></td>
				<td><code>undefined</code></td>
				<td>Callback when drawer closes</td>
			</tr>
			<tr>
				<td><code>children</code></td>
				<td><code>Snippet</code></td>
				<td><code>undefined</code></td>
				<td>Main content slot</td>
			</tr>
			<tr>
				<td><code>header</code></td>
				<td><code>Snippet</code></td>
				<td><code>undefined</code></td>
				<td>Custom header content</td>
			</tr>
			<tr>
				<td><code>footer</code></td>
				<td><code>Snippet</code></td>
				<td><code>undefined</code></td>
				<td>Footer content slot</td>
			</tr>
		</tbody>
	</table>
</Paper>

<style>
	h1 { margin-bottom: 0.5rem; }
	p { color: var(--pui-color-text-secondary); margin-bottom: 1.5rem; }
	.value-display { font-size: 0.875rem; color: var(--pui-color-text-muted); font-family: monospace; margin-top: 0.5rem; }
	.props-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
	.props-table th, .props-table td { text-align: left; padding: 0.75rem; border-bottom: 1px solid var(--pui-color-border); }
	.props-table th { font-weight: 600; background: var(--pui-color-bg-secondary); }
	.props-table code { background: var(--pui-color-bg-tertiary); padding: 0.125rem 0.375rem; border-radius: 4px; font-size: 0.8125rem; }
</style>
