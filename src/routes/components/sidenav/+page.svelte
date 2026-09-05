<script lang="ts">
	import Paper from '$lib/display/Paper.svelte';
	import Sidenav from '$lib/layout/Sidenav.svelte';
	import Drawer from '$lib/ui/Drawer.svelte';
	import type { SidenavSection, SidenavItem } from '$lib/layout/Sidenav.svelte';
	import Button from '$lib/ui/Button.svelte';
	import ActionIcon from '$lib/ui/ActionIcon.svelte';
	import Badge from '$lib/ui/Badge.svelte';
	import {
		iconFolder,
		iconFile,
		iconUser,
		iconEdit,
		iconHamburger,
		iconSearch,
		iconPlus,
		iconTrash,
		iconCopy,
		iconDownload,
		iconLock
	} from '$lib/icon/index.js';

	// Helper function to set active item in sections (mutates in place to avoid icon re-render issues)
	function setActiveItem(sections: SidenavSection[], clickedItem: SidenavItem): void {
		for (const section of sections) {
			for (const item of section.items) {
				item.active = item.label === clickedItem.label;
				if (item.items) {
					for (const subItem of item.items) {
						subItem.active = subItem.label === clickedItem.label;
					}
				}
			}
		}
	}

	// Basic navigation sections
	let basicSections: SidenavSection[] = $state([
		{
			items: [
				{ label: 'Dashboard', href: '#dashboard', iconSvg: iconFolder, active: true },
				{ label: 'Projects', href: '#projects', iconSvg: iconFile },
				{ label: 'Team', href: '#team', iconSvg: iconUser },
				{ label: 'Settings', href: '#settings', iconSvg: iconEdit }
			]
		}
	]);

	// Sections with titles
	let titledSections: SidenavSection[] = $state([
		{
			title: 'Main',
			items: [
				{ label: 'Dashboard', href: '#dashboard', iconSvg: iconFolder, active: true },
				{ label: 'Analytics', href: '#analytics', iconSvg: iconSearch }
			]
		},
		{
			title: 'Content',
			items: [
				{ label: 'Documents', href: '#documents', iconSvg: iconFile },
				{ label: 'Media', href: '#media', iconSvg: iconCopy }
			]
		},
		{
			title: 'Settings',
			items: [
				{ label: 'Profile', href: '#profile', iconSvg: iconUser },
				{ label: 'Security', href: '#security', iconSvg: iconLock }
			]
		}
	]);

	// Nested navigation
	let nestedSections: SidenavSection[] = $state([
		{
			items: [
				{ label: 'Home', href: '#home', iconSvg: iconFolder },
				{
					label: 'Projects',
					iconSvg: iconFile,
					items: [
						{ label: 'All Projects', href: '#all-projects' },
						{ label: 'Active', href: '#active-projects', active: true },
						{ label: 'Archived', href: '#archived-projects' }
					]
				},
				{
					label: 'Team',
					iconSvg: iconUser,
					items: [
						{ label: 'Members', href: '#members' },
						{ label: 'Roles', href: '#roles' },
						{ label: 'Invites', href: '#invites' }
					]
				},
				{ label: 'Settings', href: '#settings', iconSvg: iconEdit }
			]
		}
	]);

	// Admin panel sections
	let adminSections: SidenavSection[] = $state([
		{
			title: 'Overview',
			items: [
				{ label: 'Dashboard', href: '#dashboard', iconSvg: iconFolder, active: true },
				{ label: 'Analytics', href: '#analytics', iconSvg: iconSearch }
			]
		},
		{
			title: 'Management',
			items: [
				{
					label: 'Users',
					iconSvg: iconUser,
					items: [
						{ label: 'All Users', href: '#all-users' },
						{ label: 'Add User', href: '#add-user', iconSvg: iconPlus },
						{ label: 'Roles', href: '#roles' }
					]
				},
				{
					label: 'Content',
					iconSvg: iconFile,
					items: [
						{ label: 'Posts', href: '#posts' },
						{ label: 'Pages', href: '#pages' },
						{ label: 'Media', href: '#media' }
					]
				}
			]
		},
		{
			title: 'System',
			items: [
				{ label: 'Settings', href: '#settings', iconSvg: iconEdit },
				{ label: 'Security', href: '#security', iconSvg: iconLock },
				{ label: 'Logs', href: '#logs', iconSvg: iconFile }
			]
		}
	]);

	// Interactive state
	let collapsed = $state(false);
	let interactiveSections: SidenavSection[] = $state([
		{
			items: [
				{ label: 'Dashboard', href: '#dashboard', iconSvg: iconFolder, active: true },
				{ label: 'Projects', href: '#projects', iconSvg: iconFile },
				{ label: 'Team', href: '#team', iconSvg: iconUser },
				{ label: 'Reports', href: '#reports', iconSvg: iconSearch },
				{ label: 'Settings', href: '#settings', iconSvg: iconEdit }
			]
		}
	]);

	// Action log for demos
	let actionLog: string[] = $state([]);

	function addToLog(message: string) {
		actionLog = [`${new Date().toLocaleTimeString()}: ${message}`, ...actionLog.slice(0, 4)];
	}

	function clearLog() {
		actionLog = [];
	}

	// Sections with onclick handlers
	let clickableSections: SidenavSection[] = $state([
		{
			items: [
				{
					label: 'View Dashboard',
					iconSvg: iconFolder,
					onclick: () => addToLog('Dashboard clicked')
				},
				{ label: 'Create New', iconSvg: iconPlus, onclick: () => addToLog('Create New clicked') },
				{ label: 'Download', iconSvg: iconDownload, onclick: () => addToLog('Download clicked') },
				{ label: 'Delete', iconSvg: iconTrash, onclick: () => addToLog('Delete clicked') }
			]
		}
	]);

	// Toggle for the action-buttons demo
	let actionsMode: 'hover' | 'always' = $state('hover');

	// Sections with per-item action buttons
	let actionSections: SidenavSection[] = $state([
		{
			title: 'Workspaces',
			items: [
				{
					label: 'Marketing',
					href: '#marketing',
					iconSvg: iconFolder,
					active: true,
					actions: [
						{ iconSvg: iconEdit, label: 'Rename', onclick: (i) => addToLog(`Rename ${i.label}`) },
						{
							iconSvg: iconTrash,
							label: 'Delete',
							variant: 'danger-subtle',
							onclick: (i) => addToLog(`Delete ${i.label}`)
						}
					]
				},
				{
					label: 'Engineering',
					href: '#engineering',
					iconSvg: iconFolder,
					actions: [
						{ iconSvg: iconEdit, label: 'Rename', onclick: (i) => addToLog(`Rename ${i.label}`) },
						{
							iconSvg: iconTrash,
							label: 'Delete',
							variant: 'danger-subtle',
							onclick: (i) => addToLog(`Delete ${i.label}`)
						}
					]
				},
				{
					label: 'Design',
					href: '#design',
					iconSvg: iconFolder,
					actions: [
						{ iconSvg: iconEdit, label: 'Rename', onclick: (i) => addToLog(`Rename ${i.label}`) },
						{
							iconSvg: iconTrash,
							label: 'Delete',
							variant: 'danger-subtle',
							onclick: (i) => addToLog(`Delete ${i.label}`)
						}
					]
				}
			]
		},
		{
			items: [
				{
					label: 'Add workspace',
					iconSvg: iconPlus,
					onclick: () => addToLog('Add workspace')
				}
			]
		}
	]);

	// Bottom sections example - main content
	let bottomSectionsMain: SidenavSection[] = $state([
		{
			title: 'Navigation',
			items: [
				{ label: 'Dashboard', href: '#dashboard', iconSvg: iconFolder, active: true },
				{ label: 'Projects', href: '#projects', iconSvg: iconFile },
				{ label: 'Team', href: '#team', iconSvg: iconUser },
				{ label: 'Reports', href: '#reports', iconSvg: iconSearch }
			]
		}
	]);

	// Bottom sections example - bottom content
	let bottomSectionsBottom: SidenavSection[] = $state([
		{
			items: [
				{ label: 'Settings', href: '#settings', iconSvg: iconEdit },
				{ label: 'Help & Support', href: '#help', iconSvg: iconSearch }
			]
		}
	]);

	// Responsive mode state
	let mobileOpen = $state(false);
	let responsiveSections: SidenavSection[] = $state([
		{
			title: 'Navigation',
			items: [
				{ label: 'Dashboard', href: '#dashboard', iconSvg: iconFolder, active: true },
				{ label: 'Projects', href: '#projects', iconSvg: iconFile },
				{ label: 'Team', href: '#team', iconSvg: iconUser },
				{ label: 'Reports', href: '#reports', iconSvg: iconSearch }
			]
		}
	]);
</script>

<div class="page-header">
	<h1>Sidenav</h1>
	<p>
		Vertical navigation component for sidebar layouts with support for nested items and collapsible
		sections.
	</p>
</div>

<div class="vstack">
	<Paper title="Basic Usage">
		<div class="demo-container">
			<div class="sidenav-wrapper">
				<Sidenav
					sections={basicSections}
					onItemClick={(item) => setActiveItem(basicSections, item)}
				/>
			</div>
			<div class="demo-info">
				<p>Basic sidenav with icon and label for each navigation item.</p>
				<p>Items can have <code>href</code> for navigation or <code>onclick</code> for actions.</p>
			</div>
		</div>
	</Paper>

	<Paper title="With Section Titles">
		<div class="demo-container">
			<div class="sidenav-wrapper">
				<Sidenav
					sections={titledSections}
					onItemClick={(item) => setActiveItem(titledSections, item)}
				/>
			</div>
			<div class="demo-info">
				<p>Sections can have optional titles to group related navigation items.</p>
				<p>Titles are hidden when the sidenav is collapsed.</p>
			</div>
		</div>
	</Paper>

	<Paper title="Nested Navigation">
		<div class="demo-container">
			<div class="sidenav-wrapper">
				<Sidenav
					sections={nestedSections}
					onItemClick={(item) => setActiveItem(nestedSections, item)}
				/>
			</div>
			<div class="demo-info">
				<p>Items can have nested sub-items that expand/collapse on click.</p>
				<p>The chevron icon indicates expandable sections.</p>
			</div>
		</div>
	</Paper>

	<Paper title="Item Action Buttons">
		<div class="demo-container">
			<div class="sidenav-wrapper">
				<Sidenav
					sections={actionSections}
					actionsVisible={actionsMode}
					onItemClick={(item) => setActiveItem(actionSections, item)}
				/>
			</div>
			<div class="demo-info">
				<p>Add an <code>actions</code> array to any item to show icon buttons on the right.</p>
				<p>
					Use <code>actionsVisible</code> to choose when they appear — <code>'hover'</code>
					(default, revealed on hover/keyboard focus) or <code>'always'</code>.
				</p>
				<div class="controls">
					<Button
						variant={actionsMode === 'hover' ? 'primary' : 'secondary-subtle'}
						onclick={() => (actionsMode = 'hover')}
					>
						hover
					</Button>
					<Button
						variant={actionsMode === 'always' ? 'primary' : 'secondary-subtle'}
						onclick={() => (actionsMode = 'always')}
					>
						always
					</Button>
				</div>
				<p>
					Actions fire independently of the item's own navigation — clicking an action does not
					trigger the item's <code>href</code> or <code>onclick</code>.
				</p>
				<p>
					Each action takes an <code>iconSvg</code>, an optional <code>label</code> (shown as a
					tooltip) and <code>variant</code>, plus an <code>onclick</code> that receives the parent item.
				</p>
				<div class="log-header">
					<strong>Action Log</strong>
					<Button variant="secondary-subtle" onclick={clearLog}>Clear</Button>
				</div>
				<div class="action-log">
					{#each actionLog as entry}
						<p class="log-entry">{entry}</p>
					{/each}
					{#if actionLog.length === 0}
						<p class="no-actions">Hover an item and click an action button.</p>
					{/if}
				</div>
			</div>
		</div>
	</Paper>

	<Paper title="Bottom Sections">
		<div class="demo-container">
			<div class="sidenav-wrapper">
				<Sidenav
					sections={bottomSectionsMain}
					bottomSections={bottomSectionsBottom}
					onItemClick={(item) => {
						setActiveItem(bottomSectionsMain, item);
						setActiveItem(bottomSectionsBottom, item);
					}}
				/>
			</div>
			<div class="demo-info">
				<p>Use <code>bottomSections</code> to pin navigation items to the bottom of the sidenav.</p>
				<p>
					Useful for settings, help, logout, or other secondary actions that should always be
					visible.
				</p>
				<p>
					Bottom sections are separated from the main content with a border and stay fixed at the
					bottom.
				</p>
			</div>
		</div>
	</Paper>

	<Paper title="Collapsible Sidenav">
		<div class="demo-container interactive">
			<div class="sidenav-wrapper" class:collapsed>
				<Sidenav
					sections={interactiveSections}
					{collapsed}
					onItemClick={(item) => setActiveItem(interactiveSections, item)}
				>
					{#snippet header()}
						<div class="header-content">
							{#if !collapsed}
								<span class="brand">MyApp</span>
							{/if}
							<ActionIcon
								svg={iconHamburger}
								variant="secondary-subtle"
								onclick={() => (collapsed = !collapsed)}
							/>
						</div>
					{/snippet}
				</Sidenav>
			</div>
			<div class="demo-info">
				<div class="controls">
					<Button onclick={() => (collapsed = !collapsed)} variant="primary">
						{collapsed ? 'Expand' : 'Collapse'} Sidenav
					</Button>
				</div>
				<p>
					Status: <Badge variant={collapsed ? 'secondary' : 'accent'}>
						{collapsed ? 'Collapsed' : 'Expanded'}
					</Badge>
				</p>
				<p>When collapsed, only icons are shown with tooltips on hover.</p>
			</div>
		</div>
	</Paper>

	<Paper title="Responsive Mode (Mobile Drawer)">
		<div class="demo-container">
			<div class="responsive-demo">
				<div class="responsive-controls">
					<ActionIcon
						svg={iconHamburger}
						variant="secondary-subtle"
						size="1.5rem"
						onclick={() => (mobileOpen = true)}
					/>
					<span class="responsive-label">Click to preview mobile drawer</span>
				</div>
				<div class="responsive-info">
					<p>
						Add <code>responsive</code> prop to automatically switch to a Drawer on mobile devices.
					</p>
					<p>
						The <code>mobileOpen</code> prop is bindable and controls the drawer state.
					</p>
					<p>
						Use <code>mobileBreakpoint</code> to customize when the switch happens (default: 768px).
					</p>
					<p>On mobile, the sidenav is hidden and navigation is shown in a drawer instead.</p>
				</div>
				<div class="responsive-code">
					<strong>Usage:</strong>
					<pre class="code-block">{`<Sidenav
  sections={sections}
  responsive
  bind:mobileOpen
  mobileTitle="Navigation"
/>`}</pre>
				</div>
			</div>
			<!-- Preview drawer (works on any screen size) -->
			<Drawer
				bind:open={mobileOpen}
				title="Navigation"
				sections={responsiveSections}
				onItemClick={(item) => {
					setActiveItem(responsiveSections, item);
					addToLog(`Mobile nav: ${item.label}`);
				}}
			/>
		</div>
	</Paper>

	<Paper title="Searchable">
		<div class="demo-container tall">
			<div class="sidenav-wrapper tall">
				<Sidenav
					sections={adminSections}
					searchable
					searchPlaceholder="Search navigation..."
					onItemClick={(item) => setActiveItem(adminSections, item)}
				/>
			</div>
			<div class="demo-info">
				<p>Add <code>searchable</code> prop to enable fuzzy search filtering.</p>
				<p>
					The search uses a simple fuzzy matching algorithm - characters must appear in order but
					don't need to be consecutive.
				</p>
				<p>
					Both main items and sub-items are searchable. Sections with no matching items are hidden.
				</p>
				<p>Use <code>searchPlaceholder</code> to customize the placeholder text.</p>
			</div>
		</div>
	</Paper>

	<Paper title="Admin Panel Example">
		<div class="demo-container tall">
			<div class="sidenav-wrapper tall">
				<Sidenav
					sections={adminSections}
					onItemClick={(item) => setActiveItem(adminSections, item)}
				>
					{#snippet header()}
						<div class="admin-header">
							<span class="admin-brand">Admin Panel</span>
						</div>
					{/snippet}
					{#snippet footer()}
						<div class="admin-footer">
							<div class="user-info">
								<Badge variant="primary">Admin</Badge>
								<span class="user-name">John Doe</span>
							</div>
						</div>
					{/snippet}
				</Sidenav>
			</div>
			<div class="demo-info">
				<p>Full admin panel example with header, footer, section titles, and nested navigation.</p>
				<p>The header and footer snippets allow for custom branding and user info.</p>
			</div>
		</div>
	</Paper>

	<Paper title="Click Actions">
		<div class="demo-container">
			<div class="sidenav-wrapper">
				<Sidenav sections={clickableSections} />
			</div>
			<div class="demo-info">
				<div class="log-header">
					<strong>Action Log</strong>
					<Button variant="secondary-subtle" onclick={clearLog}>Clear</Button>
				</div>
				<div class="action-log">
					{#each actionLog as entry}
						<p class="log-entry">{entry}</p>
					{/each}
					{#if actionLog.length === 0}
						<p class="no-actions">Click items to see actions logged here.</p>
					{/if}
				</div>
			</div>
		</div>
	</Paper>

	<Paper title="Custom Width">
		<div class="demo-container">
			<div class="width-demos">
				<div class="width-demo">
					<span class="width-label">200px</span>
					<div class="sidenav-wrapper small">
						<Sidenav sections={basicSections} width="200px" />
					</div>
				</div>
				<div class="width-demo">
					<span class="width-label">320px</span>
					<div class="sidenav-wrapper large">
						<Sidenav sections={basicSections} width="320px" />
					</div>
				</div>
			</div>
		</div>
	</Paper>

	<Paper title="Props Reference">
		<div class="props-section">
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
						<td>Array of navigation sections</td>
					</tr>
					<tr>
						<td><code>bottomSections</code></td>
						<td><code>SidenavSection[]</code></td>
						<td><code>[]</code></td>
						<td>Array of sections pinned to the bottom of the sidenav</td>
					</tr>
					<tr>
						<td><code>collapsed</code></td>
						<td><code>boolean</code></td>
						<td><code>false</code></td>
						<td>Whether the sidenav is collapsed to icon-only mode</td>
					</tr>
					<tr>
						<td><code>width</code></td>
						<td><code>string</code></td>
						<td><code>'260px'</code></td>
						<td>Width of the expanded sidenav</td>
					</tr>
					<tr>
						<td><code>collapsedWidth</code></td>
						<td><code>string</code></td>
						<td><code>'60px'</code></td>
						<td>Width when collapsed</td>
					</tr>
					<tr>
						<td><code>header</code></td>
						<td><code>Snippet</code></td>
						<td>-</td>
						<td>Custom header content</td>
					</tr>
					<tr>
						<td><code>footer</code></td>
						<td><code>Snippet</code></td>
						<td>-</td>
						<td>Custom footer content</td>
					</tr>
					<tr>
						<td><code>searchable</code></td>
						<td><code>boolean</code></td>
						<td><code>false</code></td>
						<td>Enable fuzzy search filtering in the sidenav header</td>
					</tr>
					<tr>
						<td><code>searchPlaceholder</code></td>
						<td><code>string</code></td>
						<td><code>'Search...'</code></td>
						<td>Placeholder text for the search input</td>
					</tr>
					<tr>
						<td><code>class</code></td>
						<td><code>string</code></td>
						<td><code>''</code></td>
						<td>Additional CSS classes</td>
					</tr>
					<tr>
						<td><code>onItemClick</code></td>
						<td><code>(item: SidenavItem) => void</code></td>
						<td>-</td>
						<td>Callback fired when an item is clicked</td>
					</tr>
					<tr>
						<td><code>actionsVisible</code></td>
						<td><code>'hover' | 'always'</code></td>
						<td><code>'hover'</code></td>
						<td>
							When item action buttons are shown: on hover/focus or always visible (always visible
							in the mobile drawer)
						</td>
					</tr>
					<tr>
						<td><code>responsive</code></td>
						<td><code>boolean</code></td>
						<td><code>false</code></td>
						<td>Enable responsive mode - shows Drawer on mobile instead of sidenav</td>
					</tr>
					<tr>
						<td><code>mobileBreakpoint</code></td>
						<td><code>number</code></td>
						<td><code>768</code></td>
						<td>Window width threshold for switching to mobile drawer</td>
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
						<td>Title shown in the mobile drawer header</td>
					</tr>
					<tr>
						<td><code>mobileDrawerPosition</code></td>
						<td><code>'left' | 'right'</code></td>
						<td><code>'left'</code></td>
						<td>Which side the mobile drawer opens from</td>
					</tr>
				</tbody>
			</table>
		</div>
	</Paper>

	<Paper title="Types">
		<div class="types-section">
			<h4>SidenavItem</h4>
			<pre class="code-block">{`interface SidenavItem {
  label: string;
  href?: string;
  iconSvg?: string;
  active?: boolean;
  items?: SidenavItem[];
  onclick?: () => void;
  actions?: SidenavItemAction[];
}`}</pre>

			<h4>SidenavItemAction</h4>
			<pre class="code-block">{`interface SidenavItemAction {
  iconSvg: string;
  label?: string;
  variant?: ButtonVariant;
  onclick?: (item: SidenavItem, event: MouseEvent) => void;
}`}</pre>

			<h4>SidenavSection</h4>
			<pre class="code-block">{`interface SidenavSection {
  title?: string;
  items: SidenavItem[];
}`}</pre>
		</div>
	</Paper>

	<Paper title="Features">
		<div class="feature-list">
			<ul>
				<li>
					<strong>Responsive mode:</strong> Automatically switches to Drawer on mobile devices
				</li>
				<li><strong>Fuzzy search:</strong> Built-in fuzzy search to filter navigation items</li>
				<li><strong>Collapsible:</strong> Toggle between full and icon-only modes</li>
				<li><strong>Nested items:</strong> Support for expandable sub-navigation</li>
				<li><strong>Section titles:</strong> Group related items with optional headers</li>
				<li><strong>Bottom sections:</strong> Pin navigation items to the bottom of the sidenav</li>
				<li><strong>Icons:</strong> Optional SVG icons for each item</li>
				<li>
					<strong>Action buttons:</strong> Per-item icon buttons (e.g. edit/delete) revealed on hover
				</li>
				<li><strong>Active state:</strong> Visual indicator for current page/section</li>
				<li><strong>Header/Footer:</strong> Custom snippets for branding and user info</li>
				<li><strong>Theme support:</strong> Full light/dark mode integration</li>
				<li><strong>Smooth animations:</strong> Transition effects for collapse and expand</li>
				<li><strong>Custom width:</strong> Configurable width for expanded and collapsed states</li>
				<li>
					<strong>Click handlers:</strong> Support for onclick actions in addition to href navigation
				</li>
			</ul>
		</div>
	</Paper>
</div>

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

	.demo-container {
		display: flex;
		gap: 2rem;
		align-items: flex-start;
	}

	.demo-container.interactive {
		flex-wrap: wrap;
	}

	.demo-container.tall {
		min-height: 400px;
	}

	.sidenav-wrapper {
		border: 1px solid var(--border-color);
		border-radius: 0.5rem;
		overflow: hidden;
		height: 300px;
		flex-shrink: 0;
	}

	.sidenav-wrapper.tall {
		height: 400px;
	}

	.sidenav-wrapper.collapsed {
		width: auto;
	}

	.sidenav-wrapper.small :global(.sidenav) {
		width: 200px;
		min-width: 200px;
	}

	.sidenav-wrapper.large :global(.sidenav) {
		width: 320px;
		min-width: 320px;
	}

	.demo-info {
		flex: 1;
		min-width: 200px;
	}

	.demo-info p {
		margin: 0.5rem 0;
		color: var(--text-color);
	}

	.demo-info code {
		background: rgba(var(--ui-primary-rgbc), 0.1);
		padding: 0.125rem 0.375rem;
		border-radius: 0.25rem;
		font-family: monospace;
		font-size: 0.875rem;
	}

	:global(.dark) .demo-info code {
		background: rgba(var(--ui-accent-rgbc), 0.15);
	}

	.controls {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}

	.header-content {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
	}

	.brand {
		font-weight: 700;
		font-size: 1.125rem;
		color: var(--ui-primary);
	}

	:global(.dark) .brand {
		color: var(--ui-accent);
	}

	.admin-header {
		text-align: center;
	}

	.admin-brand {
		font-weight: 700;
		font-size: 1rem;
		color: var(--ui-primary);
	}

	:global(.dark) .admin-brand {
		color: var(--ui-accent);
	}

	.admin-footer {
		text-align: center;
	}

	.user-info {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}

	.user-name {
		font-size: 0.875rem;
		color: var(--text-color);
	}

	.log-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.5rem;
	}

	.log-header strong {
		color: var(--text-color);
	}

	.action-log {
		padding: 1rem;
		background-color: rgba(var(--ui-primary-rgbc), 0.05);
		border-radius: 0.375rem;
		border: 1px solid var(--border-color);
		min-height: 100px;
		max-height: 150px;
		overflow-y: auto;
	}

	:global(.dark) .action-log {
		background-color: rgba(var(--ui-accent-rgbc), 0.05);
	}

	.log-entry {
		font-family: monospace;
		font-size: 0.875rem;
		color: var(--text-color);
		margin: 0.25rem 0;
		padding: 0.25rem 0.5rem;
		background-color: rgba(var(--ui-primary-rgbc), 0.1);
		border-radius: 0.25rem;
	}

	:global(.dark) .log-entry {
		background-color: rgba(var(--ui-accent-rgbc), 0.1);
	}

	.no-actions {
		color: var(--text-muted);
		font-style: italic;
		margin: 0;
		text-align: center;
	}

	.width-demos {
		display: flex;
		gap: 2rem;
		flex-wrap: wrap;
	}

	.width-demo {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.width-label {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-muted);
	}

	.props-section {
		overflow-x: auto;
	}

	.props-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.875rem;
	}

	.props-table th,
	.props-table td {
		padding: 0.75rem;
		text-align: left;
		border-bottom: 1px solid var(--border-color);
	}

	.props-table th {
		font-weight: 600;
		color: var(--text-color);
		background-color: rgba(var(--ui-primary-rgbc), 0.05);
	}

	:global(.dark) .props-table th {
		background-color: rgba(var(--ui-accent-rgbc), 0.05);
	}

	.props-table td {
		color: var(--text-color);
	}

	.props-table code {
		background: rgba(var(--ui-primary-rgbc), 0.1);
		padding: 0.125rem 0.375rem;
		border-radius: 0.25rem;
		font-family: monospace;
		font-size: 0.8125rem;
	}

	:global(.dark) .props-table code {
		background: rgba(var(--ui-accent-rgbc), 0.15);
	}

	.types-section h4 {
		margin: 1.5rem 0 0.5rem;
		color: var(--text-color);
	}

	.types-section h4:first-child {
		margin-top: 0;
	}

	.code-block {
		background: rgba(var(--ui-primary-rgbc), 0.05);
		padding: 1rem;
		border-radius: 0.5rem;
		font-family: monospace;
		font-size: 0.875rem;
		overflow-x: auto;
		color: var(--text-color);
		margin: 0;
	}

	:global(.dark) .code-block {
		background: rgba(0, 0, 0, 0.3);
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
	}

	:global(.dark) .feature-list strong {
		color: var(--ui-accent);
	}

	.responsive-demo {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		flex: 1;
	}

	.responsive-controls {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1rem;
		background: rgba(var(--ui-primary-rgbc), 0.05);
		border-radius: 0.5rem;
		border: 1px solid var(--border-color);
	}

	:global(.dark) .responsive-controls {
		background: rgba(var(--ui-accent-rgbc), 0.05);
	}

	.responsive-label {
		color: var(--text-muted);
		font-size: 0.875rem;
	}

	.responsive-info p {
		margin: 0.5rem 0;
		color: var(--text-color);
	}

	.responsive-code {
		margin-top: 0.5rem;
	}

	.responsive-code strong {
		color: var(--text-color);
		display: block;
		margin-bottom: 0.5rem;
	}

	@media (max-width: 768px) {
		.demo-container {
			flex-direction: column;
		}

		.sidenav-wrapper {
			width: 100%;
		}
	}
</style>
