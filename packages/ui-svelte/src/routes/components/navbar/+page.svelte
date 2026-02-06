<script lang="ts">
	import { Paper } from '$lib/index.js';
</script>

<h1>Navbar</h1>
<p>The Navbar component provides the top navigation bar for your application. It is already rendered in this showcase's layout above.</p>

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
				<td><code>appNav</code></td>
				<td><code>Hyperlink</code></td>
				<td><code>undefined</code></td>
				<td>Application branding link (href + text)</td>
			</tr>
			<tr>
				<td><code>items</code></td>
				<td><code>LinkNavbarItem[]</code></td>
				<td><code>[]</code></td>
				<td>Primary navigation links</td>
			</tr>
			<tr>
				<td><code>secondaryItems</code></td>
				<td><code>LinkNavbarItem[]</code></td>
				<td><code>[]</code></td>
				<td>Secondary navigation links (right side)</td>
			</tr>
			<tr>
				<td><code>noLogo</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Hide the application logo</td>
			</tr>
			<tr>
				<td><code>logoHref</code></td>
				<td><code>string</code></td>
				<td><code>undefined</code></td>
				<td>Custom link URL for the logo</td>
			</tr>
			<tr>
				<td><code>showDrawerButton</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Show hamburger menu button (typically for mobile)</td>
			</tr>
			<tr>
				<td><code>drawerButtonPosition</code></td>
				<td><code>'left' | 'right'</code></td>
				<td><code>'right'</code></td>
				<td>Position of the drawer toggle button</td>
			</tr>
			<tr>
				<td><code>onDrawerButtonClick</code></td>
				<td><code>() => void</code></td>
				<td><code>undefined</code></td>
				<td>Callback when the drawer button is clicked</td>
			</tr>
			<tr>
				<td><code>inContainer</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Constrain navbar content within a container</td>
			</tr>
			<tr>
				<td><code>middleSection</code></td>
				<td><code>Snippet</code></td>
				<td><code>undefined</code></td>
				<td>Custom content for the middle area</td>
			</tr>
			<tr>
				<td><code>rightSection</code></td>
				<td><code>Snippet</code></td>
				<td><code>undefined</code></td>
				<td>Custom content for the right area</td>
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
