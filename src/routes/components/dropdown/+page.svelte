<script lang="ts">
	import Paper from '$lib/display/Paper.svelte';
	import Dropdown from '$lib/ui/Dropdown.svelte';
	import type { Hyperlink } from '$lib/models/Hyperlink.js';
	import {
		iconUser,
		iconEdit,
		iconTrash,
		iconCopy,
		iconDownload,
		iconCloudUpload,
		iconRefresh,
		iconSearch,
		iconPlus,
		iconHamburger,
		iconChevronDown
	} from '$lib/icon/index.js';

	// Basic dropdown links
	const basicActions: Hyperlink[] = [
		{ href: '#', text: 'Edit', svg: iconEdit },
		{ href: '#', text: 'Copy', svg: iconCopy },
		{ href: '#', text: 'Delete', svg: iconTrash }
	];

	const fileActions: Hyperlink[] = [
		{ href: '#', text: 'New File', svg: iconPlus },
		{ href: '#', text: 'Upload', svg: iconCloudUpload },
		{ href: '#', text: 'Download', svg: iconDownload },
		{ href: '#', text: 'Refresh', svg: iconRefresh }
	];

	const userActions: Hyperlink[] = [
		{ href: '#profile', text: 'View Profile' },
		{ href: '#settings', text: 'Settings' },
		{ href: '#help', text: 'Help Center' },
		{ href: '#logout', text: 'Sign Out' }
	];

	// Grouped dropdown links
	const groupedActions: Hyperlink[][] = [
		[
			{ href: '#', text: 'New Document', svg: iconPlus },
			{ href: '#', text: 'New Folder', svg: iconPlus }
		],
		[
			{ href: '#', text: 'Import', svg: iconCloudUpload },
			{ href: '#', text: 'Export', svg: iconDownload }
		],
		[
			{ href: '#', text: 'Settings', svg: iconEdit },
			{ href: '#', text: 'Help', svg: iconSearch }
		]
	];

	const navigationLinks: Hyperlink[] = [
		{ href: '/dashboard', text: 'Dashboard' },
		{ href: '/projects', text: 'Projects' },
		{ href: '/team', text: 'Team' },
		{ href: '/reports', text: 'Reports' },
		{ href: '/settings', text: 'Settings' }
	];

	const contextMenuActions: Hyperlink[] = [
		{ href: '#', text: 'Copy Link', svg: iconCopy },
		{ href: '#', text: 'Edit Item', svg: iconEdit },
		{ href: '#', text: 'Download', svg: iconDownload },
		{ href: '#', text: 'Delete', svg: iconTrash }
	];

	let lastCustomAction = '';

	// Custom onclick handlers override the default href navigation via preventDefault()
	const customClickActions: Hyperlink[] = [
		{
			href: '#edit',
			text: 'Edit (custom)',
			svg: iconEdit,
			onclick: (e) => {
				e.preventDefault();
				lastCustomAction = 'Edit ran a custom handler';
			}
		},
		{
			href: '#copy',
			text: 'Copy (custom)',
			svg: iconCopy,
			onclick: (e) => {
				e.preventDefault();
				lastCustomAction = 'Copy ran a custom handler';
			}
		},
		{
			href: '/settings',
			text: 'Settings (navigates)',
			svg: iconSearch
		}
	];

	// State for controlling dropdowns
	let basicDropdownOpen = false;
	let variantPrimaryOpen = false;
	let variantAccentOpen = false;
	let variantTertiaryOpen = false;
	let variantSecondaryOpen = false;
	let variantOutlineOpen = false;
	let customClickOpen = false;
	let fileDropdownOpen = false;
	let userDropdownOpen = false;
	let groupedDropdownOpen = false;
	let navigationDropdownOpen = false;
	let contextDropdownOpen = false;
	let leftAlignedOpen = false;
	let rightAlignedOpen = false;

	function handleDropdownInteraction(dropdownName: string) {
		console.log(`${dropdownName} dropdown toggled`);
	}

	function closeAllDropdowns() {
		basicDropdownOpen = false;
		fileDropdownOpen = false;
		userDropdownOpen = false;
		groupedDropdownOpen = false;
		navigationDropdownOpen = false;
		contextDropdownOpen = false;
		leftAlignedOpen = false;
		rightAlignedOpen = false;
	}
</script>

<div class="page-header">
	<h1>Dropdown</h1>
	<p>Expandable menu component with support for links, icons, and grouped actions.</p>
</div>

<div class="vstack">
	<Paper title="Basic Usage">
		<div class="form-grid">
			<div class="dropdown-section">
				<h4>Simple Actions</h4>
				<div class="dropdown-row">
					<Dropdown label="Actions" links={basicActions} bind:show={basicDropdownOpen} />
					<Dropdown label="File Menu" links={fileActions} bind:show={fileDropdownOpen} />
				</div>
			</div>
			<div class="dropdown-info">
				<strong>Basic Dropdowns:</strong>
				<p>Actions: {basicDropdownOpen ? 'Open' : 'Closed'}</p>
				<p>File Menu: {fileDropdownOpen ? 'Open' : 'Closed'}</p>
				<p class="note">Click outside the dropdowns to close them.</p>
			</div>
		</div>
	</Paper>

	<Paper title="Variants">
		<div class="dropdown-section">
			<h4>Trigger Button Variants</h4>
			<p class="note">
				The <code>variant</code> prop is passed through to the trigger button, so any
				<code>ButtonVariant</code> is supported.
			</p>
			<div class="dropdown-row">
				<Dropdown
					label="Primary"
					variant="primary"
					links={basicActions}
					bind:show={variantPrimaryOpen}
				/>
				<Dropdown
					label="Accent"
					variant="accent"
					links={basicActions}
					bind:show={variantAccentOpen}
				/>
				<Dropdown
					label="Tertiary"
					variant="tertiary"
					links={basicActions}
					bind:show={variantTertiaryOpen}
				/>
				<Dropdown
					label="Secondary"
					variant="secondary"
					links={basicActions}
					bind:show={variantSecondaryOpen}
				/>
				<Dropdown
					label="Outline"
					variant="primary-outline"
					links={basicActions}
					bind:show={variantOutlineOpen}
				/>
			</div>
		</div>
	</Paper>

	<Paper title="Custom Click Handlers">
		<div class="dropdown-section">
			<h4>Overriding Default Navigation</h4>
			<p class="note">
				Provide an <code>onclick</code> on a link and call <code>event.preventDefault()</code> to
				run a custom action instead of navigating to the <code>href</code>.
			</p>
			<div class="dropdown-row">
				<Dropdown label="Custom Actions" links={customClickActions} bind:show={customClickOpen} />
			</div>
			<p class="note">Last action: {lastCustomAction || '(none yet)'}</p>
		</div>
	</Paper>

	<Paper title="Grouped Actions">
		<div class="form-grid">
			<div class="dropdown-section">
				<h4>Grouped Menu Items</h4>
				<div class="dropdown-row">
					<Dropdown
						label="Create & Manage"
						links={groupedActions}
						bind:show={groupedDropdownOpen}
					/>
				</div>
				<p class="note">
					This dropdown demonstrates grouped menu items with separators between groups.
				</p>
			</div>
			<div class="dropdown-info">
				<strong>Grouped Features:</strong>
				<ul>
					<li>Visual separation between groups</li>
					<li>Logical organization of related actions</li>
					<li>Clean hierarchical structure</li>
				</ul>
			</div>
		</div>
	</Paper>

	<Paper title="Alignment Options">
		<div class="alignment-demo">
			<h4>Dropdown Alignment</h4>
			<div class="alignment-row">
				<div class="alignment-example">
					<Dropdown
						label="Left Aligned"
						links={basicActions}
						alignToButton="left"
						bind:show={leftAlignedOpen}
					/>
					<span>alignToButton="left"</span>
				</div>
				<div class="alignment-example">
					<Dropdown
						label="Right Aligned"
						links={basicActions}
						alignToButton="right"
						bind:show={rightAlignedOpen}
					/>
					<span>alignToButton="right"</span>
				</div>
			</div>
		</div>
	</Paper>

	<Paper title="Navigation Examples">
		<div class="navigation-section">
			<div class="navbar-demo">
				<h4>Navigation Bar</h4>
				<div class="navbar-example">
					<div class="nav-brand">MyApp</div>
					<div class="nav-items">
						<Dropdown
							label="Navigation"
							links={navigationLinks}
							bind:show={navigationDropdownOpen}
						/>
					</div>
				</div>
			</div>

			<div class="context-demo">
				<h4>Context Menu</h4>
				<div class="context-example">
					<p>Right-click style menu for item actions:</p>
					<Dropdown
						label="Item Options"
						buttonSvg={iconHamburger}
						links={contextMenuActions}
						bind:show={contextDropdownOpen}
					/>
				</div>
			</div>
		</div>
	</Paper>

	<Paper title="User Menu Example">
		<div class="user-menu-section">
			<h4>User Profile Menu</h4>
			<div class="user-menu-demo">
				<div class="user-info">
					<span class="user-name">John Doe</span>
					<span class="user-email">john@example.com</span>
				</div>
				<Dropdown
					label="Profile"
					buttonSvg={iconUser}
					links={userActions}
					alignToButton="right"
					bind:show={userDropdownOpen}
				/>
			</div>
			<div class="user-menu-info">
				<p>Common pattern for user account menus with profile actions.</p>
			</div>
		</div>
	</Paper>

	<Paper title="Interactive Demo">
		<div class="interactive-demo">
			<h4>Dropdown States</h4>
			<div class="demo-controls">
				<Dropdown
					label="Demo Actions"
					links={[
						{ href: '#', text: 'Action 1', svg: iconPlus },
						{ href: '#', text: 'Action 2', svg: iconEdit },
						{ href: '#', text: 'Action 3', svg: iconCopy }
					]}
					bind:show={basicDropdownOpen}
				/>
				<button class="btn-secondary" onclick={closeAllDropdowns}> Close All Dropdowns </button>
			</div>
			<div class="demo-info">
				<strong>Current States:</strong>
				<div class="state-grid">
					<span>Basic: {basicDropdownOpen ? '🟢 Open' : '🔴 Closed'}</span>
					<span>File: {fileDropdownOpen ? '🟢 Open' : '🔴 Closed'}</span>
					<span>User: {userDropdownOpen ? '🟢 Open' : '🔴 Closed'}</span>
					<span>Grouped: {groupedDropdownOpen ? '🟢 Open' : '🔴 Closed'}</span>
					<span>Navigation: {navigationDropdownOpen ? '🟢 Open' : '🔴 Closed'}</span>
					<span>Context: {contextDropdownOpen ? '🟢 Open' : '🔴 Closed'}</span>
				</div>
			</div>
		</div>
	</Paper>

	<Paper title="Features">
		<div class="feature-list">
			<ul>
				<li><strong>Icon support:</strong> Add icons to menu items for better visual context</li>
				<li><strong>Grouped items:</strong> Organize related actions with visual separators</li>
				<li><strong>Custom buttons:</strong> Use any SVG icon for the dropdown trigger</li>
				<li><strong>Alignment options:</strong> Left or right alignment relative to button</li>
				<li><strong>Link integration:</strong> Built-in support for navigation links</li>
				<li><strong>Theme support:</strong> Colors adapt to light/dark mode</li>
				<li><strong>Click outside:</strong> Automatically closes when clicking elsewhere</li>
				<li><strong>Keyboard accessible:</strong> Full keyboard navigation support</li>
				<li><strong>Z-index management:</strong> Proper layering above other content</li>
				<li><strong>Responsive design:</strong> Adapts to different screen sizes</li>
				<li><strong>Event propagation:</strong> Prevents unwanted event bubbling</li>
				<li><strong>Flexible positioning:</strong> Absolute positioning with proper overflow</li>
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

	.form-grid {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.dropdown-section h4,
	.navbar-demo h4,
	.context-demo h4,
	.user-menu-section h4,
	.interactive-demo h4,
	.alignment-demo h4 {
		color: var(--text-color);
		font-size: 1.125rem;
		font-weight: 600;
		margin: 0 0 1rem 0;
	}

	.dropdown-row {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.dropdown-info {
		padding: 1rem;
		background-color: rgba(var(--ui-primary-rgbc), 0.05);
		border-radius: 0.375rem;
		border: 1px solid var(--border-color);
	}

	.dropdown-info strong {
		color: var(--text-color);
		font-weight: 600;
		display: block;
		margin-bottom: 0.5rem;
	}

	.dropdown-info p {
		margin: 0.25rem 0;
		color: var(--text-muted);
	}

	.dropdown-info ul {
		margin: 0;
		padding-left: 1.5rem;
		color: var(--text-color);
	}

	.dropdown-info li {
		margin-bottom: 0.25rem;
	}

	.alignment-demo {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.alignment-row {
		display: flex;
		gap: 3rem;
		align-items: flex-start;
		flex-wrap: wrap;
	}

	.alignment-example {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		align-items: center;
	}

	.alignment-example span {
		font-size: 0.875rem;
		color: var(--text-muted);
		font-family: monospace;
	}

	.navigation-section {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.navbar-example {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
		background-color: rgba(var(--ui-primary-rgbc), 0.05);
		border-radius: 0.375rem;
		border: 1px solid var(--border-color);
	}

	.nav-brand {
		font-weight: 700;
		font-size: 1.25rem;
		color: var(--text-color);
	}

	.context-example {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1rem;
		background-color: rgba(var(--ui-primary-rgbc), 0.05);
		border-radius: 0.375rem;
		border: 1px solid var(--border-color);
	}

	.context-example p {
		margin: 0;
		color: var(--text-color);
	}

	.user-menu-section {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.user-menu-demo {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
		background-color: rgba(var(--ui-primary-rgbc), 0.05);
		border-radius: 0.375rem;
		border: 1px solid var(--border-color);
	}

	.user-info {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.user-name {
		font-weight: 600;
		color: var(--text-color);
	}

	.user-email {
		font-size: 0.875rem;
		color: var(--text-muted);
	}

	.user-menu-info p {
		margin: 0;
		color: var(--text-muted);
		font-style: italic;
	}

	.interactive-demo {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.demo-controls {
		display: flex;
		gap: 1rem;
		align-items: center;
		flex-wrap: wrap;
	}

	.btn-secondary {
		background-color: var(--border-color);
		color: var(--text-color);
		border: 1px solid var(--border-color);
		padding: 0.5rem 1rem;
		border-radius: 0.375rem;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.btn-secondary:hover {
		background-color: var(--text-muted);
		color: white;
	}

	.demo-info {
		padding: 1rem;
		background-color: rgba(var(--ui-primary-rgbc), 0.05);
		border-radius: 0.375rem;
		border: 1px solid var(--border-color);
	}

	.demo-info strong {
		color: var(--text-color);
		font-weight: 600;
		display: block;
		margin-bottom: 0.5rem;
	}

	.state-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		gap: 0.5rem;
	}

	.state-grid span {
		font-size: 0.875rem;
		color: var(--text-color);
		font-family: monospace;
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

	.note {
		font-size: 0.875rem;
		color: var(--text-muted);
		font-style: italic;
		margin-top: 0.5rem;
	}

	:global(.dark) .dropdown-info,
	:global(.dark) .navbar-example,
	:global(.dark) .context-example,
	:global(.dark) .user-menu-demo,
	:global(.dark) .demo-info {
		background-color: rgba(var(--ui-accent-rgbc), 0.05);
	}

	:global(.dark) .feature-list strong {
		color: var(--ui-accent);
	}

	:global(.dark) .btn-secondary {
		background-color: rgba(var(--ui-accent-rgbc), 0.1);
		border-color: rgba(var(--ui-accent-rgbc), 0.3);
	}

	:global(.dark) .btn-secondary:hover {
		background-color: var(--ui-accent);
		color: var(--ui-primary);
	}

	@media (min-width: 768px) {
		.form-grid {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: 1.5rem;
			align-items: start;
		}
	}
</style>
