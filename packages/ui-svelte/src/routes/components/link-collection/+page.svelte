<script lang="ts">
	import { Table, LinkCollection, Paper, iconHome, iconSettings, iconUser, iconMail, iconChevronRight, type Hyperlink, type LinkCollectionItem } from '$lib/index.js';
	import type { Column } from '$lib/index.js';

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
		{ prop: 'links', type: 'Hyperlink[]', default: '[]', description: 'Array of simple links with href, text, svg, newTab' },
		{ prop: 'items', type: 'LinkCollectionItem[]', default: '[]', description: 'Array of items with left/right content and icons' },
		{ prop: 'classes', type: 'string', default: '\'\'', description: 'Additional CSS classes' },
		{ prop: 'footerButtons', type: 'Hyperlink[]', default: 'undefined', description: 'Footer action links displayed side by side' },
		{ prop: 'notRounded', type: 'boolean', default: 'false', description: 'Remove border-radius' },
		{ prop: 'noOutsideBorder', type: 'boolean', default: 'false', description: 'Remove outer border' },
		{ prop: 'noSeperator', type: 'boolean', default: 'false', description: 'Remove separator lines between items' },
	];
</script>

<h1>LinkCollection</h1>
<p>LinkCollection displays a styled list of links or items in a bordered container, optionally with icons and footer buttons.</p>

<div class="vstack">
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
		<Table columns={propsColumns} rows={propsRows} striped hover={false} />
	</Paper>
</div>

<style>
	h1 { margin-bottom: 0.5rem; }
	p { color: var(--pui-color-text-secondary); margin-bottom: 1.5rem; }</style>
