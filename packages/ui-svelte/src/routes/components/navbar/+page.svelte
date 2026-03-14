<script lang="ts">
	import { Navbar, Table, Paper, type LinkNavbarItem } from '$lib/index.js';
	import type { Column } from '$lib/index.js';

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
		{ prop: 'appNav', type: 'Hyperlink', default: 'undefined', description: 'Application branding link (href + text)' },
		{ prop: 'items', type: 'LinkNavbarItem[]', default: '[]', description: 'Primary navigation links' },
		{ prop: 'secondaryItems', type: 'LinkNavbarItem[]', default: '[]', description: 'Secondary navigation links (right side)' },
		{ prop: 'responsive', type: 'boolean', default: 'true', description: 'Auto-collapse to burger menu on small screens' },
		{ prop: 'responsiveBreakpoint', type: 'number', default: '768', description: 'Pixel width at which the navbar collapses' },
		{ prop: 'showDrawerButton', type: 'boolean', default: 'false', description: 'Show an additional drawer toggle button' },
		{ prop: 'drawerButtonPosition', type: '\'left\' | \'right\'', default: '\'right\'', description: 'Position of the drawer toggle button' },
		{ prop: 'onDrawerButtonClick', type: '() => void', default: 'undefined', description: 'Callback when the drawer button is clicked' },
		{ prop: 'inContainer', type: 'boolean', default: 'false', description: 'Constrain navbar content within a container' },
		{ prop: 'middleSection', type: 'Snippet', default: 'undefined', description: 'Custom content for the middle area' },
		{ prop: 'rightSection', type: 'Snippet', default: 'undefined', description: 'Custom content for the right area' },
		{ prop: 'drawerHeader', type: 'string', default: 'undefined', description: 'Title shown in the responsive drawer header' },
	];

	const demoItems: LinkNavbarItem[] = [
		{ label: 'Home', href: '#' },
		{ label: 'Features', href: '#' },
		{ label: 'Pricing', href: '#' },
	];

	const demoSecondary: LinkNavbarItem[] = [
		{ label: 'Docs', href: '#' },
		{ label: 'GitHub', href: '#' },
	];

</script>

<h1>Navbar</h1>
<p>The Navbar component provides the top navigation bar for your application. It is already rendered in this showcase's layout above.</p>

<div class="vstack">
	<Paper title="Responsive Demo">
		<p style="margin: 0 0 1rem;">
			Resize your browser window below 768px to see the links collapse into a burger menu.
			Click the burger icon to open the navigation drawer.
		</p>
		<div class="demo-frame">
			<Navbar
				appNav={{ text: 'My App', href: '#' }}
				items={demoItems}
				secondaryItems={demoSecondary}
				responsive={true}
				drawerHeader="Navigation"
			/>
		</div>
	</Paper>

	<Paper title="Configuration Example">
		<pre class="code-block">{`${"<scr" + "ipt"} lang="ts">
  import { Navbar } from '$lib/index.js';

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' }
  ];
${"</scr" + "ipt>"}

<!-- Responsive (default) - collapses at 768px -->
<Navbar
  appNav={{ text: 'My App', href: '/' }}
  items={navItems}
/>

<!-- Custom breakpoint -->
<Navbar
  appNav={{ text: 'My App', href: '/' }}
  items={navItems}
  responsiveBreakpoint={600}
  drawerHeader="Menu"
/>

<!-- Disable responsive collapse -->
<Navbar
  appNav={{ text: 'My App', href: '/' }}
  items={navItems}
  responsive={false}
/>`}</pre>
	</Paper>

	<Paper title="Props">
		<Table columns={propsColumns} rows={propsRows} striped hover={false} />
	</Paper>
</div>

<style>
	h1 { margin-bottom: 0.5rem; }
	p { color: var(--pui-color-text-secondary); margin-bottom: 1.5rem; }
	.code-block {
		background: var(--pui-bg-surface-sunken);
		border: 1px solid var(--pui-border-default);
		border-radius: 0.375rem;
		padding: 1rem;
		font-size: 0.8125rem;
		font-family: monospace;
		overflow-x: auto;
		white-space: pre;
		margin: 0;
		color: var(--pui-text-primary);
	}
	.demo-frame {
		border: 1px solid var(--pui-border-default);
		border-radius: 0.375rem;
		overflow: hidden;
	}
	.demo-frame :global(header) {
		position: relative;
	}
</style>
