<script lang="ts">
	import { Paper } from '$lib/index.js';
</script>

<h1>Sidenav</h1>
<p>The Sidenav component provides vertical side navigation. It is already rendered in this showcase's layout on the left side of this page.</p>

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
				<td><code>sections</code></td>
				<td><code>SidenavSection[]</code></td>
				<td><code>[]</code></td>
				<td>Navigation sections, each with a title and items array</td>
			</tr>
			<tr>
				<td><code>bottomSections</code></td>
				<td><code>SidenavSection[]</code></td>
				<td><code>[]</code></td>
				<td>Sections pinned to the bottom of the sidenav</td>
			</tr>
			<tr>
				<td><code>collapsed</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Collapse sidenav to show only icons</td>
			</tr>
			<tr>
				<td><code>width</code></td>
				<td><code>string</code></td>
				<td><code>'260px'</code></td>
				<td>Width of the sidenav</td>
			</tr>
			<tr>
				<td><code>searchable</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Show search input for filtering items</td>
			</tr>
			<tr>
				<td><code>responsive</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Switch to Drawer on mobile breakpoint</td>
			</tr>
			<tr>
				<td><code>mobileOpen</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Bindable state for mobile drawer visibility</td>
			</tr>
			<tr>
				<td><code>mobileTitle</code></td>
				<td><code>string</code></td>
				<td><code>''</code></td>
				<td>Title shown in the mobile drawer</td>
			</tr>
			<tr>
				<td><code>mobileDrawerPosition</code></td>
				<td><code>'left' | 'right'</code></td>
				<td><code>'left'</code></td>
				<td>Position of the mobile drawer</td>
			</tr>
			<tr>
				<td><code>mobileBreakpoint</code></td>
				<td><code>number</code></td>
				<td><code>768</code></td>
				<td>Viewport width at which to switch to mobile mode</td>
			</tr>
			<tr>
				<td><code>class</code></td>
				<td><code>string</code></td>
				<td><code>''</code></td>
				<td>Additional CSS classes</td>
			</tr>
			<tr>
				<td><code>header</code></td>
				<td><code>Snippet</code></td>
				<td><code>undefined</code></td>
				<td>Custom header content above navigation</td>
			</tr>
			<tr>
				<td><code>footer</code></td>
				<td><code>Snippet</code></td>
				<td><code>undefined</code></td>
				<td>Custom footer content below navigation</td>
			</tr>
		</tbody>
	</table>
</Paper>

<Paper title="Types">
	<table class="props-table">
		<thead>
			<tr>
				<th>Type</th>
				<th>Definition</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>SidenavSection</code></td>
				<td><code>{'{ title?: string, items: SidenavItem[] }'}</code></td>
			</tr>
			<tr>
				<td><code>SidenavItem</code></td>
				<td><code>{'{ label: string, href?: string, iconSvg?: string, active?: boolean, items?: SidenavItem[], onclick?: () => void }'}</code></td>
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
