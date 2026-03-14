<script lang="ts">
	import { Table, Paper } from '$lib/index.js';
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
		{ prop: 'showDrawerButton', type: 'boolean', default: 'false', description: 'Show hamburger menu button (typically for mobile)' },
		{ prop: 'drawerButtonPosition', type: '\'left\' | \'right\'', default: '\'right\'', description: 'Position of the drawer toggle button' },
		{ prop: 'onDrawerButtonClick', type: '() => void', default: 'undefined', description: 'Callback when the drawer button is clicked' },
		{ prop: 'inContainer', type: 'boolean', default: 'false', description: 'Constrain navbar content within a container' },
		{ prop: 'middleSection', type: 'Snippet', default: 'undefined', description: 'Custom content for the middle area' },
		{ prop: 'rightSection', type: 'Snippet', default: 'undefined', description: 'Custom content for the right area' },
	];
</script>

<h1>Navbar</h1>
<p>The Navbar component provides the top navigation bar for your application. It is already rendered in this showcase's layout above.</p>

<div class="vstack">
	<Paper title="Overview">
		<p style="margin: 0;">
			The Navbar is the primary horizontal navigation element displayed at the top of the page.
			It supports application branding, navigation links, a theme switcher, and an optional
			drawer toggle button for mobile layouts. Look at the top of this page to see it in action.
		</p>
	</Paper>

	<Paper title="Configuration Example">
		<pre class="code-block">{`${"<scr" + "ipt"} lang="ts">
	  import { Navbar, type Hyperlink } from '$lib/index.js';

	  const appNav: Hyperlink = {
	    href: '/',
	    text: 'My Application'
	  };

	  const navItems = [
	    { label: 'Home', href: '/' },
	    { label: 'About', href: '/about' },
	    { label: 'Contact', href: '/contact' }
	  ];
	${"</scr" + "ipt>"}

	<Navbar
	  {appNav}
	  items={navItems}
	  showDrawerButton={isMobile}
	  onDrawerButtonClick={() => (drawerOpen = true)}
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
		background: var(--pui-color-bg-tertiary, #f5f5f5);
		border: 1px solid var(--pui-color-border);
		border-radius: 0.375rem;
		padding: 1rem;
		font-size: 0.8125rem;
		font-family: monospace;
		overflow-x: auto;
		white-space: pre;
		margin: 0;
		color: var(--pui-text-primary);
	}
</style>
