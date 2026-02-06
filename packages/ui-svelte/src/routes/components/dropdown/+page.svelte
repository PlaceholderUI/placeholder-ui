<script lang="ts">
	import { Dropdown, Paper, Button, iconSettings, iconUser, iconEdit } from '$lib/index.js';
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
</script>

<h1>Dropdown</h1>
<p>Button-triggered dropdown menu with links. Supports grouped links and alignment options.</p>

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
				<td><code>show</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Bindable visibility state</td>
			</tr>
			<tr>
				<td><code>label</code></td>
				<td><code>string</code></td>
				<td>required</td>
				<td>Button label text</td>
			</tr>
			<tr>
				<td><code>buttonSvg</code></td>
				<td><code>string</code></td>
				<td><code>iconChevronDown</code></td>
				<td>Icon for the trigger button</td>
			</tr>
			<tr>
				<td><code>links</code></td>
				<td><code>Hyperlink[] | Hyperlink[][]</code></td>
				<td><code>[]</code></td>
				<td>Array of links or grouped arrays</td>
			</tr>
			<tr>
				<td><code>alignToButton</code></td>
				<td><code>'left' | 'right'</code></td>
				<td><code>'left'</code></td>
				<td>Alignment of the dropdown</td>
			</tr>
			<tr>
				<td><code>class</code></td>
				<td><code>string</code></td>
				<td><code>''</code></td>
				<td>Additional CSS classes</td>
			</tr>
		</tbody>
	</table>

	<h4 style="margin-top: 1.5rem; margin-bottom: 0.75rem;">Hyperlink Type</h4>
	<table class="props-table">
		<thead>
			<tr>
				<th>Property</th>
				<th>Type</th>
				<th>Description</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>href</code></td>
				<td><code>string</code></td>
				<td>Link URL</td>
			</tr>
			<tr>
				<td><code>text</code></td>
				<td><code>string</code></td>
				<td>Display text</td>
			</tr>
			<tr>
				<td><code>newTab</code></td>
				<td><code>boolean</code></td>
				<td>Open in new tab</td>
			</tr>
			<tr>
				<td><code>svg</code></td>
				<td><code>string</code></td>
				<td>Optional icon SVG string</td>
			</tr>
		</tbody>
	</table>
</Paper>

<style>
	h1 { margin-bottom: 0.5rem; }
	p { color: var(--pui-color-text-secondary); margin-bottom: 1.5rem; }
	.demo-row { display: flex; flex-wrap: wrap; gap: 0.75rem; align-items: center; }
	.value-display { font-size: 0.875rem; color: var(--pui-color-text-muted); font-family: monospace; margin-top: 0.5rem; }
	.props-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
	.props-table th, .props-table td { text-align: left; padding: 0.75rem; border-bottom: 1px solid var(--pui-color-border); }
	.props-table th { font-weight: 600; background: var(--pui-color-bg-secondary); }
	.props-table code { background: var(--pui-color-bg-tertiary); padding: 0.125rem 0.375rem; border-radius: 4px; font-size: 0.8125rem; }
</style>
