<script lang="ts">
	import { LinkCollection, Paper, iconHome, iconSettings, iconUser, iconMail, iconChevronRight, type Hyperlink, type LinkCollectionItem } from '$lib/index.js';

	const basicLinks: Hyperlink[] = [
		{ href: '/', text: 'Home' },
		{ href: '/components/button', text: 'Button Component' },
		{ href: '/components/dialog', text: 'Dialog Component' },
		{ href: '/components/tabs', text: 'Tabs Component' }
	];

	const linksWithIcons: Hyperlink[] = [
		{ href: '/', text: 'Home', svg: iconHome },
		{ href: '#', text: 'Profile', svg: iconUser },
		{ href: '#', text: 'Settings', svg: iconSettings },
		{ href: '#', text: 'Messages', svg: iconMail }
	];

	const itemsList: LinkCollectionItem[] = [
		{ href: '#', leftContent: 'Dashboard', rightContent: 'Overview', leftSvg: iconHome, rightSvg: iconChevronRight },
		{ href: '#', leftContent: 'User Management', rightContent: '24 users', leftSvg: iconUser, rightSvg: iconChevronRight },
		{ href: '#', leftContent: 'Settings', rightContent: 'General', leftSvg: iconSettings, rightSvg: iconChevronRight },
		{ href: '#', leftContent: 'Notifications', rightContent: '3 unread', leftSvg: iconMail, rightSvg: iconChevronRight }
	];

	const footerBtns: Hyperlink[] = [
		{ href: '#', text: 'View All' },
		{ href: '#', text: 'Settings' }
	];
</script>

<h1>LinkCollection</h1>
<p>LinkCollection displays a styled list of links or items in a bordered container, optionally with icons and footer buttons.</p>

<Paper title="Basic Links">
	<LinkCollection links={basicLinks} />
</Paper>

<Paper title="Links with Icons">
	<LinkCollection links={linksWithIcons} />
</Paper>

<Paper title="With Items">
	<LinkCollection items={itemsList} />
</Paper>

<Paper title="With Footer Buttons">
	<LinkCollection links={basicLinks.slice(0, 3)} footerButtons={footerBtns} />
</Paper>

<Paper title="No Outside Border">
	<LinkCollection links={basicLinks} noOutsideBorder />
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
				<td><code>links</code></td>
				<td><code>Hyperlink[]</code></td>
				<td><code>[]</code></td>
				<td>Array of simple links with href, text, svg, newTab</td>
			</tr>
			<tr>
				<td><code>items</code></td>
				<td><code>LinkCollectionItem[]</code></td>
				<td><code>[]</code></td>
				<td>Array of items with left/right content and icons</td>
			</tr>
			<tr>
				<td><code>classes</code></td>
				<td><code>string</code></td>
				<td><code>''</code></td>
				<td>Additional CSS classes</td>
			</tr>
			<tr>
				<td><code>footerButtons</code></td>
				<td><code>Hyperlink[]</code></td>
				<td><code>undefined</code></td>
				<td>Footer action links displayed side by side</td>
			</tr>
			<tr>
				<td><code>notRounded</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Remove border-radius</td>
			</tr>
			<tr>
				<td><code>noOutsideBorder</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Remove outer border</td>
			</tr>
			<tr>
				<td><code>noSeperator</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Remove separator lines between items</td>
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
