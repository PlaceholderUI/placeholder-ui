<script lang="ts">
	import Paper from '$lib/display/Paper.svelte';
	import Drawer from '$lib/ui/Drawer.svelte';
	import Button from '$lib/ui/Button.svelte';
	import ActionIcon from '$lib/ui/ActionIcon.svelte';
	import type { SidenavSection, SidenavItem } from '$lib/layout/Sidenav.svelte';
	import {
		iconHamburger,
		iconUser,
		iconEdit,
		iconTrash,
		iconCopy,
		iconDownload,
		iconSearch,
		iconPlus,
		iconFolder,
		iconFile,
		iconLock,
		iconSquareArrowRight,
		iconPalette,
		iconDeviceDesktop,
		iconFileReport,
		iconMail
	} from '$lib/icon/index.js';

	// Drawer state variables
	let basicDrawer = $state(false);
	let navigationDrawer = $state(false);
	let settingsDrawer = $state(false);
	let rightDrawer = $state(false);
	let customDrawer = $state(false);

	// Demo data
	let actionLog: string[] = $state([]);

	function addToLog(message: string) {
		actionLog = [`${new Date().toLocaleTimeString()}: ${message}`, ...actionLog.slice(0, 4)];
	}

	function clearLog() {
		actionLog = [];
	}

	function handleItemClick(item: SidenavItem) {
		addToLog(`Clicked: ${item.label}`);
	}

	// Navigation sections for the main drawer
	const mainSections: SidenavSection[] = [
		{
			title: 'Main',
			items: [
				{ label: 'Dashboard', iconSvg: iconDeviceDesktop, href: '#', active: true },
				{ label: 'Analytics', iconSvg: iconFileReport, href: '#' },
				{ label: 'Messages', iconSvg: iconMail, href: '#' }
			]
		},
		{
			title: 'Content',
			items: [
				{
					label: 'Projects',
					iconSvg: iconFolder,
					items: [
						{ label: 'Active Projects', href: '#' },
						{ label: 'Archived', href: '#' },
						{ label: 'Templates', href: '#' }
					]
				},
				{
					label: 'Documents',
					iconSvg: iconFile,
					items: [
						{ label: 'Recent', href: '#' },
						{ label: 'Shared', href: '#' },
						{ label: 'Favorites', href: '#' }
					]
				}
			]
		}
	];

	const bottomSections: SidenavSection[] = [
		{
			items: [
				{ label: 'Settings', iconSvg: iconPalette, href: '#' },
				{ label: 'Profile', iconSvg: iconUser, href: '#' }
			]
		}
	];

	// Settings sections
	const settingsSections: SidenavSection[] = [
		{
			title: 'Account',
			items: [
				{ label: 'Edit Profile', iconSvg: iconUser },
				{ label: 'Change Password', iconSvg: iconLock },
				{ label: 'Privacy Settings', iconSvg: iconPalette }
			]
		},
		{
			title: 'Preferences',
			items: [
				{ label: 'Notifications', iconSvg: iconMail },
				{ label: 'Downloads', iconSvg: iconDownload }
			]
		}
	];

	// File actions for right drawer
	const fileActionsSections: SidenavSection[] = [
		{
			title: 'File Actions',
			items: [
				{ label: 'Download File', iconSvg: iconDownload },
				{ label: 'Copy Link', iconSvg: iconCopy },
				{ label: 'Edit', iconSvg: iconEdit },
				{ label: 'Delete', iconSvg: iconTrash }
			]
		}
	];

	function closeAllDrawers() {
		basicDrawer = false;
		navigationDrawer = false;
		settingsDrawer = false;
		rightDrawer = false;
		customDrawer = false;
	}
</script>

<div class="page-header">
	<h1>Drawer</h1>
	<p>Slide-out panel component with navigation support, consistent styling with Sidenav.</p>
</div>

<div class="vstack">
	<Paper title="Navigation Drawer">
		<div class="demo-section">
			<p class="description">
				A full navigation drawer using <code>sections</code> prop with SidenavSection data. Supports expandable
				sub-items and icons.
			</p>
			<div class="button-row">
				<ActionIcon
					svg={iconHamburger}
					variant="secondary-subtle"
					size="1.5rem"
					onclick={() => (navigationDrawer = true)}
				/>
				<Button onclick={() => (navigationDrawer = true)}>Open Navigation</Button>
			</div>
		</div>
	</Paper>

	<Paper title="Settings Panel">
		<div class="demo-section">
			<p class="description">
				A settings drawer with grouped options. Uses <code>title</code> prop for header.
			</p>
			<Button variant="secondary" onclick={() => (settingsDrawer = true)}>Open Settings</Button>
		</div>
	</Paper>

	<Paper title="Right Side Drawer">
		<div class="demo-section">
			<p class="description">
				Drawer that slides from the right using <code>position="right"</code>.
			</p>
			<Button variant="secondary" onclick={() => (rightDrawer = true)}>Open from Right</Button>
		</div>
	</Paper>

	<Paper title="Custom Content Drawer">
		<div class="demo-section">
			<p class="description">
				Use the <code>children</code> snippet for fully custom content instead of navigation items.
			</p>
			<Button variant="secondary" onclick={() => (customDrawer = true)}>Open Custom Drawer</Button>
		</div>
	</Paper>

	<Paper title="Interactive Controls">
		<div class="controls-section">
			<div class="control-buttons">
				<Button variant="primary" onclick={() => (navigationDrawer = true)}>Navigation</Button>
				<Button variant="secondary" onclick={() => (settingsDrawer = true)}>Settings</Button>
				<Button variant="tertiary" onclick={() => (rightDrawer = true)}>Right</Button>
				<Button variant="accent" onclick={() => (customDrawer = true)}>Custom</Button>
				<Button variant="secondary-subtle" onclick={closeAllDrawers}>Close All</Button>
			</div>
			<div class="drawer-states">
				<strong>Current States:</strong>
				<div class="state-grid">
					<span class:open={navigationDrawer}
						>Navigation: {navigationDrawer ? 'Open' : 'Closed'}</span
					>
					<span class:open={settingsDrawer}>Settings: {settingsDrawer ? 'Open' : 'Closed'}</span>
					<span class:open={rightDrawer}>Right: {rightDrawer ? 'Open' : 'Closed'}</span>
					<span class:open={customDrawer}>Custom: {customDrawer ? 'Open' : 'Closed'}</span>
				</div>
			</div>
		</div>
	</Paper>

	<Paper title="Action Log">
		<div class="log-section">
			<div class="log-header">
				<h4>Recent Actions</h4>
				<Button variant="secondary-subtle" onclick={clearLog}>Clear Log</Button>
			</div>
			<div class="action-log">
				{#each actionLog as entry}
					<p class="log-entry">{entry}</p>
				{/each}
				{#if actionLog.length === 0}
					<p class="no-actions">No actions yet. Try clicking items in the drawers!</p>
				{/if}
			</div>
		</div>
	</Paper>

	<Paper title="Features">
		<div class="feature-list">
			<ul>
				<li><strong>Svelte 5:</strong> Built with modern $props, $state, $effect runes</li>
				<li>
					<strong>Navigation sections:</strong> Uses SidenavSection/SidenavItem types for consistency
				</li>
				<li><strong>Expandable items:</strong> Sub-navigation with smooth slide animations</li>
				<li><strong>Position:</strong> Left or right side positioning</li>
				<li><strong>Custom content:</strong> Use children snippet for custom layouts</li>
				<li><strong>Header/Footer:</strong> Optional header and footer snippets</li>
				<li><strong>Body scroll lock:</strong> Prevents background scrolling when open</li>
				<li><strong>Keyboard support:</strong> Close with ESC key</li>
				<li><strong>Click outside:</strong> Close by clicking backdrop</li>
				<li><strong>Responsive:</strong> Auto-close on large screens option</li>
				<li><strong>Theming:</strong> Full light/dark mode support matching Sidenav</li>
			</ul>
		</div>
	</Paper>
</div>

<!-- Navigation Drawer -->
<Drawer
	bind:open={navigationDrawer}
	title="Navigation"
	sections={mainSections}
	{bottomSections}
	closeForLargeScreens
	onItemClick={handleItemClick}
/>

<!-- Settings Drawer -->
<Drawer
	bind:open={settingsDrawer}
	title="Settings"
	sections={settingsSections}
	onItemClick={handleItemClick}
/>

<!-- Right Side Drawer -->
<Drawer
	bind:open={rightDrawer}
	position="right"
	width="280px"
	sections={fileActionsSections}
	onItemClick={handleItemClick}
>
	{#snippet header()}
		<div class="file-header">
			<h3>document.pdf</h3>
			<p class="file-meta">2.4 MB - PDF Document</p>
		</div>
	{/snippet}
</Drawer>

<!-- Custom Content Drawer -->
<Drawer bind:open={customDrawer} title="Custom Content">
	<div class="custom-content">
		<div class="custom-section">
			<h4>Welcome!</h4>
			<p>
				This drawer uses custom content via the children snippet instead of navigation sections.
			</p>
		</div>
		<div class="custom-section">
			<h4>Actions</h4>
			<div class="custom-actions">
				<Button
					variant="accent"
					onclick={() => {
						addToLog('Create New clicked');
						customDrawer = false;
					}}
				>
					Create New
				</Button>
				<Button
					variant="secondary"
					onclick={() => {
						addToLog('Import clicked');
						customDrawer = false;
					}}
				>
					Import
				</Button>
			</div>
		</div>
		<div class="custom-section">
			<h4>Recent Items</h4>
			<ul class="recent-list">
				<li>Project Alpha</li>
				<li>Design System</li>
				<li>Component Library</li>
			</ul>
		</div>
	</div>
</Drawer>

<style>
	.page-header {
		margin-bottom: 2rem;
	}

	.page-header h1 {
		font-size: 2rem;
		font-weight: 700;
		margin: 0 0 0.5rem 0;
		color: var(--text-color);
	}

	.page-header p {
		color: var(--text-muted);
		margin: 0;
	}

	.demo-section {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.description {
		color: var(--text-muted);
		margin: 0;
	}

	.description code {
		background: rgba(var(--ui-primary-rgbc), 0.1);
		padding: 0.125rem 0.375rem;
		border-radius: 0.25rem;
		font-size: 0.875em;
	}

	.button-row {
		display: flex;
		gap: 1rem;
		align-items: center;
		flex-wrap: wrap;
	}

	.controls-section {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.control-buttons {
		display: flex;
		gap: 0.75rem;
		flex-wrap: wrap;
	}

	.drawer-states {
		padding: 1rem;
		background-color: rgba(var(--ui-primary-rgbc), 0.05);
		border-radius: 0.5rem;
		border: 1px solid var(--border-color);
	}

	.drawer-states strong {
		color: var(--text-color);
		font-weight: 600;
		display: block;
		margin-bottom: 0.75rem;
	}

	.state-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
		gap: 0.5rem;
	}

	.state-grid span {
		font-size: 0.875rem;
		color: var(--text-muted);
		font-family: monospace;
		padding: 0.25rem 0.5rem;
		border-radius: 0.25rem;
		background: rgba(var(--ui-primary-rgbc), 0.05);
	}

	.state-grid span.open {
		background: rgba(var(--ui-accent-rgbc), 0.2);
		color: var(--text-color);
	}

	.log-section {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.log-section h4 {
		margin: 0;
		color: var(--text-color);
	}

	.log-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.action-log {
		padding: 1rem;
		background-color: rgba(var(--ui-primary-rgbc), 0.05);
		border-radius: 0.5rem;
		border: 1px solid var(--border-color);
		min-height: 100px;
		max-height: 200px;
		overflow-y: auto;
	}

	.log-entry {
		font-family: 'Courier New', monospace;
		font-size: 0.875rem;
		color: var(--text-color);
		margin: 0.25rem 0;
		padding: 0.25rem 0.5rem;
		background-color: rgba(var(--ui-primary-rgbc), 0.1);
		border-radius: 0.25rem;
	}

	.no-actions {
		color: var(--text-muted);
		font-style: italic;
		margin: 0;
		text-align: center;
	}

	.feature-list ul {
		margin: 0;
		padding-left: 1.5rem;
		color: var(--text-color);
	}

	.feature-list li {
		margin-bottom: 0.5rem;
		line-height: 1.5;
	}

	.feature-list strong {
		color: var(--ui-primary);
		font-weight: 600;
	}

	/* Custom drawer content styles */
	.file-header h3 {
		margin: 0 0 0.25rem 0;
		font-size: 1rem;
		font-weight: 600;
		color: var(--text-color);
	}

	.file-meta {
		margin: 0;
		font-size: 0.75rem;
		color: var(--text-muted);
	}

	.custom-content {
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.custom-section h4 {
		margin: 0 0 0.75rem 0;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-color);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.custom-section p {
		margin: 0;
		color: var(--text-muted);
		font-size: 0.875rem;
		line-height: 1.5;
	}

	.custom-actions {
		display: flex;
		gap: 0.75rem;
	}

	.recent-list {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.recent-list li {
		padding: 0.5rem 0;
		border-bottom: 1px solid var(--border-color);
		color: var(--text-color);
		font-size: 0.875rem;
	}

	.recent-list li:last-child {
		border-bottom: none;
	}

	:global(.dark) .drawer-states,
	:global(.dark) .action-log {
		background-color: rgba(var(--ui-accent-rgbc), 0.05);
	}

	:global(.dark) .feature-list strong {
		color: var(--ui-accent);
	}

	:global(.dark) .log-entry {
		background-color: rgba(var(--ui-accent-rgbc), 0.1);
	}

	:global(.dark) .description code {
		background: rgba(var(--ui-accent-rgbc), 0.15);
	}
</style>
