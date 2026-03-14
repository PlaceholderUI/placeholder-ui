<script lang="ts">
	import { Table, Paper } from '$lib/index.js';
	import type { Column } from '$lib/index.js';

	interface PropRow1 {
		prop: string;
		type: string;
		default: string;
		description: string;
	}

	const propsColumns1: Column<PropRow1>[] = [
		{ key: 'prop', label: 'Prop' },
		{ key: 'type', label: 'Type' },
		{ key: 'default', label: 'Default' },
		{ key: 'description', label: 'Description' },
	];

	interface TypeRow {
		type: string;
		definition: string;
	}

	const typesColumns: Column<TypeRow>[] = [
		{ key: 'type', label: 'Type' },
		{ key: 'definition', label: 'Definition' },
	];

	const typesRows: TypeRow[] = [
		{ type: 'SidenavSection', definition: '{ title?: string, items: SidenavItem[] }' },
		{ type: 'SidenavItem', definition: '{ label: string, href?: string, iconSvg?: string, active?: boolean, items?: SidenavItem[], onclick?: () => void }' },
	];

	const propsRows1: PropRow1[] = [
		{ prop: 'sections', type: 'SidenavSection[]', default: '[]', description: 'Navigation sections, each with a title and items array' },
		{ prop: 'bottomSections', type: 'SidenavSection[]', default: '[]', description: 'Sections pinned to the bottom of the sidenav' },
		{ prop: 'collapsed', type: 'boolean', default: 'false', description: 'Collapse sidenav to show only icons' },
		{ prop: 'width', type: 'string', default: '\'260px\'', description: 'Width of the sidenav' },
		{ prop: 'searchable', type: 'boolean', default: 'false', description: 'Show search input for filtering items' },
		{ prop: 'responsive', type: 'boolean', default: 'false', description: 'Switch to Drawer on mobile breakpoint' },
		{ prop: 'mobileOpen', type: 'boolean', default: 'false', description: 'Bindable state for mobile drawer visibility' },
		{ prop: 'mobileTitle', type: 'string', default: '\'\'', description: 'Title shown in the mobile drawer' },
		{ prop: 'mobileDrawerPosition', type: '\'left\' | \'right\'', default: '\'left\'', description: 'Position of the mobile drawer' },
		{ prop: 'mobileBreakpoint', type: 'number', default: '768', description: 'Viewport width at which to switch to mobile mode' },
		{ prop: 'class', type: 'string', default: '\'\'', description: 'Additional CSS classes' },
		{ prop: 'header', type: 'Snippet', default: 'undefined', description: 'Custom header content above navigation' },
		{ prop: 'footer', type: 'Snippet', default: 'undefined', description: 'Custom footer content below navigation' },
	];
</script>

<h1>Sidenav</h1>
<p>The Sidenav component provides vertical side navigation. It is already rendered in this showcase's layout on the left side of this page.</p>

<div class="vstack">
	<Paper title="Overview">
		<p style="margin: 0;">
			The Sidenav provides organized, sectioned navigation for your application.
			It supports collapsible sections, search filtering, responsive behavior (switching to a Drawer on mobile),
			and active state highlighting. Look at the left side of this page to see it in action.
		</p>
	</Paper>

	<Paper title="Configuration Example">
		<pre class="code-block">{`${"<scr" + "ipt"} lang="ts">
	  import { Sidenav, type SidenavSection } from '$lib/index.js';

	  let mobileNavOpen = $state(false);

	  const sections: SidenavSection[] = [
	    {
	      title: 'Getting Started',
	      items: [
	        { label: 'Introduction', href: '/' },
	        { label: 'Installation', href: '/install' }
	      ]
	    },
	    {
	      title: 'Components',
	      items: [
	        { label: 'Button', href: '/components/button', active: true },
	        { label: 'Dialog', href: '/components/dialog' }
	      ]
	    }
	  ];
	${"</scr" + "ipt>"}

	<Sidenav
	  {sections}
	  width="260px"
	  searchable
	  responsive
	  bind:mobileOpen={mobileNavOpen}
	  mobileTitle="Navigation"
	  mobileDrawerPosition="right"
	/>`}</pre>
	</Paper>

	<Paper title="Props">
		<Table columns={propsColumns1} rows={propsRows1} striped hover={false} />
	</Paper>

	<Paper title="Types">
		<Table columns={typesColumns} rows={typesRows} striped hover={false} />
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
