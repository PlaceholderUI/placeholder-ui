<script lang="ts">
	import { Table, Dropdown, Paper, Button, iconSettings, iconUser, iconEdit } from '$lib/index.js';
	import type { Column } from '$lib/index.js';
	import type { Hyperlink } from '$lib/index.js';

	let basicShow = $state(false);
	let groupedShow = $state(false);
	let rightShow = $state(false);
	let iconShow = $state(false);

	const basicLinks: Hyperlink[] = [
		{ href: '#profile', text: 'Profile' },
		{ href: '#settings', text: 'Settings' },
		{ href: '#notifications', text: 'Notifications' },
		{ href: '#help', text: 'Help' }
	];

	const groupedLinks: Hyperlink[][] = [
		[
			{ href: '#profile', text: 'My Profile' },
			{ href: '#settings', text: 'Account Settings' }
		],
		[
			{ href: '#team', text: 'Team' },
			{ href: '#organization', text: 'Organization' }
		],
		[
			{ href: '#logout', text: 'Sign Out' }
		]
	];

	const iconLinks: Hyperlink[] = [
		{ href: '#edit', text: 'Edit', svg: iconEdit },
		{ href: '#profile', text: 'Profile', svg: iconUser },
		{ href: '#settings', text: 'Settings', svg: iconSettings }
	];

	const externalLinks: Hyperlink[] = [
		{ href: 'https://svelte.dev', text: 'Svelte', newTab: true },
		{ href: 'https://kit.svelte.dev', text: 'SvelteKit', newTab: true },
		{ href: 'https://vitejs.dev', text: 'Vite', newTab: true }
	];

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

	const propsRows1: PropRow1[] = [
		{ prop: 'show', type: 'boolean', default: 'false', description: 'Bindable visibility state' },
		{ prop: 'label', type: 'string', default: 'required', description: 'Button label text' },
		{ prop: 'buttonSvg', type: 'string', default: 'iconChevronDown', description: 'Icon for the trigger button' },
		{ prop: 'links', type: 'Hyperlink[] | Hyperlink[][]', default: '[]', description: 'Array of links or grouped arrays' },
		{ prop: 'alignToButton', type: '\'left\' | \'right\'', default: '\'left\'', description: 'Alignment of the dropdown' },
		{ prop: 'class', type: 'string', default: '\'\'', description: 'Additional CSS classes' },
	];

	interface PropRow2 {
		property: string;
		type: string;
		description: string;
	}

	const propsColumns2: Column<PropRow2>[] = [
		{ key: 'property', label: 'Property' },
		{ key: 'type', label: 'Type' },
		{ key: 'description', label: 'Description' },
	];

	const propsRows2: PropRow2[] = [
		{ property: 'href', type: 'string', description: 'Link URL' },
		{ property: 'text', type: 'string', description: 'Display text' },
		{ property: 'newTab', type: 'boolean', description: 'Open in new tab' },
		{ property: 'svg', type: 'string', description: 'Optional icon SVG string' },
	];
</script>

<h1>Dropdown</h1>
<p>Button-triggered dropdown menu with links. Supports grouped links and alignment options.</p>

<div class="vstack">
	<Paper title="Basic Usage">
		<Dropdown bind:show={basicShow} label="Menu" links={basicLinks} />
		<div class="value-display">show: {basicShow}</div>
	</Paper>

	<Paper title="Grouped Links">
		<Dropdown bind:show={groupedShow} label="Account" links={groupedLinks} />
		<div class="value-display">show: {groupedShow}</div>
	</Paper>

	<Paper title="Right Aligned">
		<div class="demo-row" style="justify-content: flex-end;">
			<Dropdown bind:show={rightShow} label="Options" links={basicLinks} alignToButton="right" />
		</div>
		<div class="value-display">show: {rightShow}, alignToButton: 'right'</div>
	</Paper>

	<Paper title="With Icon Links">
		<Dropdown bind:show={iconShow} label="Actions" links={iconLinks} buttonSvg={iconSettings} />
		<div class="value-display">show: {iconShow}</div>
	</Paper>

	<Paper title="External Links">
		<Dropdown label="Resources" links={externalLinks} />
		<div class="value-display">Links open in new tabs (newTab: true)</div>
	</Paper>

	<Paper title="Props">
		<Table columns={propsColumns1} rows={propsRows1} striped hover={false} />

		<h4 style="margin-top: 1.5rem; margin-bottom: 0.75rem;">Hyperlink Type</h4>
		<Table columns={propsColumns2} rows={propsRows2} striped hover={false} />
	</Paper>
</div>

<style>
	h1 { margin-bottom: 0.5rem; }
	p { color: var(--pui-color-text-secondary); margin-bottom: 1.5rem; }
	.demo-row { display: flex; flex-wrap: wrap; gap: 0.75rem; align-items: center; }
	.value-display { font-size: 0.875rem; color: var(--pui-color-text-muted); font-family: monospace; margin-top: 0.5rem; }</style>
