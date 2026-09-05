<script lang="ts">
	import Paper from '$lib/display/Paper.svelte';
	import Popover from '$lib/ui/Popover.svelte';
	import Button from '$lib/ui/Button.svelte';
	import ActionIcon from '$lib/ui/ActionIcon.svelte';
	import Badge from '$lib/ui/Badge.svelte';
	import Icon from '$lib/icon/Icon.svelte';
	import {
		iconUser,
		iconEdit,
		iconArrowsSort,
		iconFolderShare,
		iconDownload,
		iconSearch,
		iconPlus,
		iconHelp,
		iconHamburger,
		iconInfoCircle
	} from '$lib/icon/index.js';

	// Demo data
	let actionLog = $state<string[]>([]);
	let selectedFilter = $state('all');
	let shareOptions = $state({
		email: false,
		link: true,
		social: false
	});

	function addToLog(message: string) {
		actionLog = [`${new Date().toLocaleTimeString()}: ${message}`, ...actionLog.slice(0, 9)];
	}

	function clearLog() {
		actionLog = [];
	}

	// Sample data for demonstrations
	const menuItems = [
		{ label: 'Profile', icon: iconUser, action: 'profile' },
		{ label: 'Edit', icon: iconEdit, action: 'edit' },
		{ label: 'Downloads', icon: iconDownload, action: 'downloads' },
		{ label: 'Help', icon: iconHelp, action: 'help' }
	];

	const filterOptions = [
		{ value: 'all', label: 'All Items' },
		{ value: 'active', label: 'Active Only' },
		{ value: 'archived', label: 'Archived' },
		{ value: 'starred', label: 'Starred' }
	];

	function handleMenuClick(action: string) {
		addToLog(`Menu action: ${action}`);
	}

	function handleFilterChange(value: string) {
		selectedFilter = value;
		addToLog(`Filter changed to: ${value}`);
	}

	function handleShare() {
		const enabled = Object.entries(shareOptions)
			.filter(([_, value]) => value)
			.map(([key]) => key);
		addToLog(`Share via: ${enabled.join(', ') || 'none'}`);
	}
</script>

<div class="page-header">
	<h1>Popover</h1>
	<p>
		Floating popover component with click-triggered display, customizable content, and directional positioning.
	</p>
</div>

<div class="vstack">
	<Paper title="Basic Usage">
		<div class="form-grid">
			<div class="popover-section">
				<h4>Simple Popovers</h4>
				<div class="popover-examples">
					<div class="popover-demo">
						<Popover label="Click Me">
							<div class="simple-content">
								<p>This is a basic popover with text content.</p>
							</div>
						</Popover>
					</div>

					<div class="popover-demo">
						<Popover label="Options" position="right">
							<div class="menu-content">
								<button class="menu-item">Option 1</button>
								<button class="menu-item">Option 2</button>
								<button class="menu-item">Option 3</button>
							</div>
						</Popover>
					</div>

					<div class="popover-demo">
						<Popover position="bottom">
							{#snippet button()}
								<ActionIcon svg={iconHamburger} variant="secondary-subtle" />
							{/snippet}
							<div class="action-menu">
								<button class="menu-item">Edit</button>
								<button class="menu-item">Duplicate</button>
								<button class="menu-item danger">Delete</button>
							</div>
						</Popover>
					</div>
				</div>
			</div>
			<div class="popover-info">
				<strong>Popover Positions:</strong>
				<ul>
					<li><code>top</code> - Above the element</li>
					<li><code>right</code> - To the right of element</li>
					<li><code>bottom</code> - Below the element (default)</li>
					<li><code>left</code> - To the left of element</li>
				</ul>
				<p class="note">Click outside to close the popover automatically.</p>
			</div>
		</div>
	</Paper>

	<Paper title="Hover Trigger">
		<div class="hover-section">
			<h4>Hover to Open Popovers</h4>
			<div class="hover-examples">
				<div class="hover-demo">
					<Popover label="Hover Me (1s delay)" trigger="hover" position="top">
						<div class="hover-content">
							<h6>Hover Triggered</h6>
							<p>This popover opens after hovering for 1 second.</p>
							<p>It stays open while you hover over the content.</p>
						</div>
					</Popover>
				</div>

				<div class="hover-demo">
					<Popover trigger="hover" hoverDelay={500} position="bottom" cssWidth="250px">
						{#snippet button()}
							<Button variant="secondary">Quick Hover (0.5s)</Button>
						{/snippet}
						<div class="hover-content">
							<h6>Faster Hover</h6>
							<p>This popover has a 500ms hover delay.</p>
							<div class="hover-actions">
								<button class="hover-btn" onclick={() => addToLog('Hover action clicked')}>
									Action Button
								</button>
							</div>
						</div>
					</Popover>
				</div>

				<div class="hover-demo">
					<Popover trigger="hover" hoverDelay={2000} position="right">
						{#snippet button()}
							<Badge variant="tertiary">Long Hover (2s)</Badge>
						{/snippet}
						<div class="hover-content">
							<p>This requires 2 seconds of hovering to open.</p>
						</div>
					</Popover>
				</div>

				<div class="hover-demo">
					<Popover trigger="hover" position="bottom" cssWidth="200px">
						{#snippet button()}
							<ActionIcon svg={iconInfoCircle} variant="secondary-subtle" />
						{/snippet}
						<div class="info-tooltip">
							<h6>Information</h6>
							<p>Hover popovers are great for displaying additional context without requiring a click.</p>
						</div>
					</Popover>
				</div>
			</div>
			<div class="hover-info">
				<strong>Hover Features:</strong>
				<ul>
					<li>Default 1 second delay before showing</li>
					<li>Customizable delay with <code>hoverDelay</code> prop</li>
					<li>Stays open when hovering over content</li>
					<li>Closes when mouse leaves trigger and content</li>
					<li>Can contain interactive elements</li>
				</ul>
			</div>
		</div>
	</Paper>

	<Paper title="Positioning Examples">
		<div class="positioning-section">
			<h4>Popover Placement Options</h4>
			<div class="positioning-grid">
				<div class="position-demo">
					<span class="position-label">Top</span>
					<Popover label="Top Popover" position="top">
						<div class="position-content">
							<p>Popover positioned at the top</p>
						</div>
					</Popover>
				</div>

				<div class="position-demo">
					<span class="position-label">Right</span>
					<Popover label="Right Popover" position="right">
						<div class="position-content">
							<p>Popover positioned to the right</p>
						</div>
					</Popover>
				</div>

				<div class="position-demo">
					<span class="position-label">Bottom</span>
					<Popover label="Bottom Popover" position="bottom">
						<div class="position-content">
							<p>Popover positioned at the bottom</p>
						</div>
					</Popover>
				</div>

				<div class="position-demo">
					<span class="position-label">Left</span>
					<Popover label="Left Popover" position="left">
						<div class="position-content">
							<p>Popover positioned to the left</p>
						</div>
					</Popover>
				</div>
			</div>
		</div>
	</Paper>

	<Paper title="Custom Content">
		<div class="content-section">
			<h4>Rich Popover Content</h4>
			<div class="content-examples">
				<div class="content-demo">
					<Popover position="bottom" cssWidth="280px">
						{#snippet button()}
							<Button variant="primary" svg={iconUser}>User Menu</Button>
						{/snippet}
						<div class="user-menu">
							<div class="user-header">
								<div class="user-avatar">JD</div>
								<div class="user-info">
									<h6>John Doe</h6>
									<p>john.doe@example.com</p>
								</div>
							</div>
							<div class="menu-divider"></div>
							{#each menuItems as item}
								<button class="menu-item-icon" onclick={() => handleMenuClick(item.action)}>
									<Icon svg={item.icon} size="16px" />
									{item.label}
								</button>
							{/each}
							<div class="menu-divider"></div>
							<button class="menu-item-icon danger" onclick={() => handleMenuClick('logout')}>
								Sign Out
							</button>
						</div>
					</Popover>
				</div>

				<div class="content-demo">
					<Popover position="bottom" cssWidth="250px">
						{#snippet button()}
							<Button variant="secondary" svg={iconArrowsSort}>Filter</Button>
						{/snippet}
						<div class="filter-content">
							<h6>Filter Options</h6>
							{#each filterOptions as option}
								<label class="filter-option">
									<input
										type="radio"
										name="filter"
										value={option.value}
										checked={selectedFilter === option.value}
										onchange={() => handleFilterChange(option.value)}
									/>
									{option.label}
								</label>
							{/each}
							<div class="filter-actions">
								<button class="filter-btn secondary">Reset</button>
								<button class="filter-btn primary">Apply</button>
							</div>
						</div>
					</Popover>
				</div>

				<div class="content-demo">
					<Popover position="bottom" cssWidth="220px">
						{#snippet button()}
							<ActionIcon svg={iconFolderShare} variant="tertiary-subtle" />
						{/snippet}
						<div class="share-content">
							<h6>Share Options</h6>
							<label class="share-option">
								<input type="checkbox" bind:checked={shareOptions.email} />
								Share via Email
							</label>
							<label class="share-option">
								<input type="checkbox" bind:checked={shareOptions.link} />
								Copy Link
							</label>
							<label class="share-option">
								<input type="checkbox" bind:checked={shareOptions.social} />
								Social Media
							</label>
							<button class="share-btn" onclick={handleShare}>Share Now</button>
						</div>
					</Popover>
				</div>
			</div>
		</div>
	</Paper>

	<Paper title="Form Controls in Popover">
		<div class="form-section">
			<h4>Interactive Forms</h4>
			<div class="form-demo">
				<Popover label="Quick Add" position="bottom" cssWidth="300px">
					<div class="form-popover">
						<h6>Add New Item</h6>
						<div class="form-field">
							<label for="name">Name</label>
							<input id="name" type="text" placeholder="Enter item name" />
						</div>
						<div class="form-field">
							<label for="category">Category</label>
							<select id="category">
								<option>Select category</option>
								<option>Work</option>
								<option>Personal</option>
								<option>Shopping</option>
							</select>
						</div>
						<div class="form-field">
							<label for="priority">Priority</label>
							<div class="priority-options">
								<label><input type="radio" name="priority" /> Low</label>
								<label><input type="radio" name="priority" /> Medium</label>
								<label><input type="radio" name="priority" /> High</label>
							</div>
						</div>
						<div class="form-actions">
							<button class="form-btn secondary">Cancel</button>
							<button class="form-btn primary" onclick={() => addToLog('Item added')}>Add Item</button>
						</div>
					</div>
				</Popover>

				<Popover label="Search" position="bottom" cssWidth="280px">
					<div class="search-popover">
						<div class="search-input">
							<input type="text" placeholder="Search..." />
							<button class="search-btn"><Icon svg={iconSearch} size="16px" /></button>
						</div>
						<div class="search-filters">
							<label><input type="checkbox" /> Include archived</label>
							<label><input type="checkbox" /> Exact match</label>
						</div>
						<div class="search-results">
							<p class="result-count">No results yet</p>
						</div>
					</div>
				</Popover>
			</div>
		</div>
	</Paper>

	<Paper title="Navigation Menus">
		<div class="nav-section">
			<h4>Dropdown Navigation</h4>
			<div class="nav-examples">
				<Popover label="Products" position="bottom" cssWidth="200px">
					<nav class="nav-menu">
						<a href="#1" onclick={(e) => { e.preventDefault(); addToLog('Navigate: All Products'); }}>All Products</a>
						<a href="#2" onclick={(e) => { e.preventDefault(); addToLog('Navigate: Featured'); }}>Featured</a>
						<a href="#3" onclick={(e) => { e.preventDefault(); addToLog('Navigate: New Arrivals'); }}>New Arrivals</a>
						<a href="#4" onclick={(e) => { e.preventDefault(); addToLog('Navigate: Sale'); }}>Sale Items</a>
					</nav>
				</Popover>

				<Popover label="Account" position="bottom" cssWidth="180px">
					<nav class="nav-menu">
						<a href="#1" onclick={(e) => { e.preventDefault(); addToLog('Navigate: Profile'); }}>My Profile</a>
						<a href="#2" onclick={(e) => { e.preventDefault(); addToLog('Navigate: Orders'); }}>Orders</a>
						<a href="#3" onclick={(e) => { e.preventDefault(); addToLog('Navigate: Wishlist'); }}>Wishlist</a>
						<div class="menu-divider"></div>
						<a href="#4" class="danger" onclick={(e) => { e.preventDefault(); addToLog('Navigate: Logout'); }}>Logout</a>
					</nav>
				</Popover>
			</div>
		</div>
	</Paper>

	<Paper title="Custom Triggers">
		<div class="trigger-section">
			<h4>Different Trigger Elements</h4>
			<div class="trigger-examples">
				<Popover position="bottom">
					{#snippet button()}
						<Badge variant="auto-outline">3 New</Badge>
					{/snippet}
					<div class="notification-content">
						<h6>Notifications</h6>
						<div class="notification-item">
							<span class="notification-dot"></span>
							<p>New message received</p>
						</div>
						<div class="notification-item">
							<span class="notification-dot"></span>
							<p>Task completed</p>
						</div>
						<div class="notification-item">
							<span class="notification-dot"></span>
							<p>Update available</p>
						</div>
					</div>
				</Popover>

				<Popover position="bottom">
					{#snippet button()}
						<span class="custom-trigger">Custom Trigger</span>
					{/snippet}
					<div class="custom-content">
						<p>This popover uses a custom trigger element.</p>
					</div>
				</Popover>

				<Popover position="bottom">
					{#snippet button()}
						<div class="avatar-trigger">
							<div class="avatar">AB</div>
						</div>
					{/snippet}
					<div class="avatar-menu">
						<p><strong>Alice Brown</strong></p>
						<p class="text-muted">alice@example.com</p>
						<button class="menu-item" onclick={() => addToLog('View profile')}>View Profile</button>
						<button class="menu-item" onclick={() => addToLog('Settings')}>Settings</button>
					</div>
				</Popover>
			</div>
		</div>
	</Paper>

	<Paper title="Activity Log">
		<div class="log-section">
			<div class="log-header">
				<h4>Popover Interactions</h4>
				<Button variant="secondary-subtle" onclick={clearLog}>Clear Log</Button>
			</div>
			<div class="action-log">
				{#each actionLog as entry}
					<p class="log-entry">{entry}</p>
				{/each}
				{#if actionLog.length === 0}
					<p class="no-actions">
						No popover interactions yet. Try clicking buttons and interacting with popovers above!
					</p>
				{/if}
			</div>
		</div>
	</Paper>

	<Paper title="Features">
		<div class="feature-list">
			<ul>
				<li>
					<strong>Multiple triggers:</strong> Click (default) or hover with customizable delay
				</li>
				<li>
					<strong>Hover support:</strong> Opens after hovering for specified duration (default 1s)
				</li>
				<li><strong>Multiple positions:</strong> Top, right, bottom, left positioning options</li>
				<li><strong>Custom content:</strong> Support for any HTML content via snippets</li>
				<li>
					<strong>Custom triggers:</strong> Use any element as trigger via button snippet
				</li>
				<li><strong>Arrow indicators:</strong> Visual arrow pointing to trigger element</li>
				<li><strong>Auto-dismiss:</strong> Closes when clicking outside (click mode) or mouse leaves (hover mode)</li>
				<li><strong>Width control:</strong> Customizable width with cssWidth prop</li>
				<li><strong>Theme integration:</strong> Full light/dark mode support</li>
				<li><strong>Stop propagation:</strong> Click events inside popover don't close it</li>
				<li><strong>Z-index management:</strong> Proper layering above other content</li>
				<li><strong>Bindable state:</strong> Control show/hide state programmatically</li>
				<li><strong>Flexible styling:</strong> Custom classes supported</li>
				<li><strong>Hover persistence:</strong> Stays open when hovering over content</li>
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

	.popover-section h4,
	.hover-section h4,
	.positioning-section h4,
	.content-section h4,
	.form-section h4,
	.nav-section h4,
	.trigger-section h4,
	.log-section h4 {
		color: var(--text-color);
		font-size: 1.125rem;
		font-weight: 600;
		margin: 0 0 1rem 0;
	}

	.popover-examples {
		display: flex;
		gap: 2rem;
		flex-wrap: wrap;
		align-items: center;
	}

	.popover-demo {
		display: flex;
		align-items: center;
	}

	.popover-info {
		padding: 1rem;
		background-color: rgba(var(--ui-primary-rgbc), 0.05);
		border-radius: 0.375rem;
		border: 1px solid var(--border-color);
	}

	.popover-info strong {
		color: var(--text-color);
		font-weight: 600;
		display: block;
		margin-bottom: 0.5rem;
	}

	.popover-info ul {
		margin: 0.5rem 0;
		padding-left: 1.5rem;
		color: var(--text-color);
	}

	.popover-info li {
		margin-bottom: 0.25rem;
		font-size: 0.875rem;
	}

	.hover-examples {
		display: flex;
		gap: 2rem;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		padding: 1rem;
	}

	.hover-demo {
		display: flex;
		align-items: center;
	}

	.hover-info {
		padding: 1rem;
		background-color: rgba(var(--ui-primary-rgbc), 0.05);
		border-radius: 0.375rem;
		border: 1px solid var(--border-color);
		margin-top: 1.5rem;
	}

	.hover-info strong {
		color: var(--text-color);
		font-weight: 600;
		display: block;
		margin-bottom: 0.5rem;
	}

	.hover-info ul {
		margin: 0.5rem 0;
		padding-left: 1.5rem;
		color: var(--text-color);
	}

	.hover-info li {
		margin-bottom: 0.25rem;
		font-size: 0.875rem;
	}

	.hover-content {
		padding: 0.75rem;
	}

	.hover-content h6 {
		margin: 0 0 0.5rem 0;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-color);
	}

	.hover-content p {
		margin: 0.25rem 0;
		font-size: 0.75rem;
		color: var(--text-color);
		line-height: 1.4;
	}

	.hover-actions {
		margin-top: 0.75rem;
		display: flex;
		gap: 0.5rem;
	}

	.hover-btn {
		padding: 0.375rem 0.75rem;
		background: var(--ui-primary);
		color: white;
		border: none;
		border-radius: 0.25rem;
		font-size: 0.75rem;
		cursor: pointer;
		transition: opacity 0.2s;
	}

	.hover-btn:hover {
		opacity: 0.8;
	}

	.info-tooltip {
		padding: 0.75rem;
	}

	.info-tooltip h6 {
		margin: 0 0 0.5rem 0;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-color);
	}

	.info-tooltip p {
		margin: 0;
		font-size: 0.75rem;
		color: var(--text-color);
		line-height: 1.4;
	}

	.popover-info code,
	.hover-info code {
		background-color: rgba(var(--ui-primary-rgbc), 0.1);
		padding: 0.125rem 0.25rem;
		border-radius: 0.25rem;
		font-family: monospace;
		font-size: 0.75rem;
	}

	.positioning-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		gap: 2rem;
		padding: 2rem;
	}

	.position-demo {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}

	.position-label {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-muted);
	}

	.content-examples,
	.trigger-examples {
		display: flex;
		gap: 2rem;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		padding: 1rem;
	}

	.content-demo {
		display: flex;
		align-items: center;
	}

	.form-demo,
	.nav-examples {
		display: flex;
		gap: 2rem;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
	}

	.log-section {
		display: flex;
		flex-direction: column;
		gap: 1rem;
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
		border-radius: 0.375rem;
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

	.note {
		font-size: 0.875rem;
		color: var(--text-muted);
		font-style: italic;
		margin-top: 0.5rem;
	}

	.text-muted {
		color: var(--text-muted) !important;
		font-size: 0.875rem;
	}

	/* Popover content styles */
	.simple-content {
		padding: 0.5rem;
	}

	.simple-content p {
		margin: 0;
		color: var(--text-color);
		font-size: 0.875rem;
	}

	.position-content {
		padding: 0.75rem;
		min-width: 150px;
	}

	.position-content p {
		margin: 0;
		color: var(--text-color);
		font-size: 0.875rem;
		text-align: center;
	}

	.menu-content,
	.action-menu {
		display: flex;
		flex-direction: column;
		padding: 0.25rem;
	}

	.menu-item {
		background: none;
		border: none;
		color: var(--text-color);
		padding: 0.5rem 1rem;
		text-align: left;
		cursor: pointer;
		font-size: 0.875rem;
		border-radius: 0.25rem;
		transition: background-color 0.2s;
	}

	.menu-item:hover {
		background-color: rgba(var(--ui-primary-rgbc), 0.1);
	}

	.menu-item.danger {
		color: var(--danger);
	}

	.menu-item.danger:hover {
		background-color: rgba(var(--danger-rgbc), 0.1);
	}

	.user-menu {
		padding: 0.5rem;
	}

	.user-header {
		display: flex;
		gap: 0.75rem;
		padding: 0.5rem;
		align-items: center;
	}

	.user-avatar {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: var(--ui-primary);
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 600;
		font-size: 0.875rem;
	}

	.user-info h6 {
		margin: 0;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-color);
	}

	.user-info p {
		margin: 0;
		font-size: 0.75rem;
		color: var(--text-muted);
	}

	.menu-divider {
		height: 1px;
		background-color: var(--border-color);
		margin: 0.25rem 0;
	}

	.menu-item-icon {
		background: none;
		border: none;
		color: var(--text-color);
		padding: 0.5rem 1rem;
		text-align: left;
		cursor: pointer;
		font-size: 0.875rem;
		border-radius: 0.25rem;
		transition: background-color 0.2s;
		display: flex;
		align-items: center;
		gap: 0.75rem;
		width: 100%;
	}

	.menu-item-icon:hover {
		background-color: rgba(var(--ui-primary-rgbc), 0.1);
	}

	.menu-item-icon.danger {
		color: var(--danger);
	}


	.filter-content {
		padding: 1rem;
	}

	.filter-content h6 {
		margin: 0 0 0.75rem 0;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-color);
	}

	.filter-option {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.375rem 0;
		cursor: pointer;
		font-size: 0.875rem;
		color: var(--text-color);
	}

	.filter-option input {
		margin: 0;
	}

	.filter-actions {
		display: flex;
		gap: 0.5rem;
		margin-top: 1rem;
		padding-top: 0.75rem;
		border-top: 1px solid var(--border-color);
	}

	.filter-btn {
		flex: 1;
		padding: 0.375rem 0.75rem;
		border: none;
		border-radius: 0.25rem;
		font-size: 0.75rem;
		cursor: pointer;
		transition: opacity 0.2s;
	}

	.filter-btn.primary {
		background: var(--ui-primary);
		color: white;
	}

	.filter-btn.secondary {
		background: var(--border-color);
		color: var(--text-color);
	}

	.filter-btn:hover {
		opacity: 0.8;
	}

	.share-content {
		padding: 1rem;
	}

	.share-content h6 {
		margin: 0 0 0.75rem 0;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-color);
	}

	.share-option {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.375rem 0;
		cursor: pointer;
		font-size: 0.875rem;
		color: var(--text-color);
	}

	.share-btn {
		width: 100%;
		padding: 0.5rem;
		margin-top: 0.75rem;
		background: var(--ui-tertiary);
		color: white;
		border: none;
		border-radius: 0.25rem;
		font-size: 0.875rem;
		cursor: pointer;
		transition: opacity 0.2s;
	}

	.share-btn:hover {
		opacity: 0.8;
	}

	.form-popover {
		padding: 1rem;
	}

	.form-popover h6 {
		margin: 0 0 1rem 0;
		font-size: 1rem;
		font-weight: 600;
		color: var(--text-color);
	}

	.form-field {
		margin-bottom: 0.75rem;
	}

	.form-field label {
		display: block;
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--text-muted);
		margin-bottom: 0.25rem;
	}

	.form-field input,
	.form-field select {
		width: 100%;
		padding: 0.375rem 0.5rem;
		border: 1px solid var(--border-color);
		border-radius: 0.25rem;
		background: var(--input-bg);
		color: var(--text-color);
		font-size: 0.875rem;
	}

	.priority-options {
		display: flex;
		gap: 1rem;
	}

	.priority-options label {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		font-size: 0.875rem;
		font-weight: normal;
	}

	.form-actions {
		display: flex;
		gap: 0.5rem;
		margin-top: 1rem;
		padding-top: 1rem;
		border-top: 1px solid var(--border-color);
	}

	.form-btn {
		flex: 1;
		padding: 0.5rem 1rem;
		border: none;
		border-radius: 0.25rem;
		font-size: 0.875rem;
		cursor: pointer;
		transition: opacity 0.2s;
	}

	.form-btn.primary {
		background: var(--ui-primary);
		color: white;
	}

	.form-btn.secondary {
		background: transparent;
		color: var(--text-color);
		border: 1px solid var(--border-color);
	}

	.form-btn:hover {
		opacity: 0.8;
	}

	.search-popover {
		padding: 1rem;
	}

	.search-input {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 0.75rem;
	}

	.search-input input {
		flex: 1;
		padding: 0.5rem;
		border: 1px solid var(--border-color);
		border-radius: 0.25rem;
		background: var(--input-bg);
		color: var(--text-color);
		font-size: 0.875rem;
	}

	.search-btn {
		padding: 0.5rem;
		background: var(--ui-primary);
		color: white;
		border: none;
		border-radius: 0.25rem;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
	}


	.search-filters {
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
		padding: 0.5rem 0;
		border-top: 1px solid var(--border-color);
	}

	.search-filters label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.75rem;
		color: var(--text-color);
	}

	.search-results {
		padding: 0.75rem 0 0;
		border-top: 1px solid var(--border-color);
		margin-top: 0.5rem;
	}

	.result-count {
		margin: 0;
		font-size: 0.75rem;
		color: var(--text-muted);
		text-align: center;
	}

	.nav-menu {
		display: flex;
		flex-direction: column;
		padding: 0.25rem;
	}

	.nav-menu a {
		color: var(--text-color);
		text-decoration: none;
		padding: 0.5rem 1rem;
		font-size: 0.875rem;
		border-radius: 0.25rem;
		transition: background-color 0.2s;
	}

	.nav-menu a:hover {
		background-color: rgba(var(--ui-primary-rgbc), 0.1);
	}

	.nav-menu a.danger {
		color: var(--danger);
	}

	.notification-content {
		padding: 1rem;
		min-width: 200px;
	}

	.notification-content h6 {
		margin: 0 0 0.75rem 0;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-color);
	}

	.notification-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.5rem 0;
		border-bottom: 1px solid var(--border-color);
	}

	.notification-item:last-child {
		border-bottom: none;
	}

	.notification-item p {
		margin: 0;
		font-size: 0.75rem;
		color: var(--text-color);
	}

	.notification-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--ui-tertiary);
	}

	.custom-trigger {
		padding: 0.5rem 1rem;
		background: var(--secondary);
		color: white;
		border-radius: 0.25rem;
		cursor: pointer;
		font-size: 0.875rem;
		transition: opacity 0.2s;
	}

	.custom-trigger:hover {
		opacity: 0.8;
	}

	.custom-content {
		padding: 1rem;
	}

	.custom-content p {
		margin: 0;
		color: var(--text-color);
		font-size: 0.875rem;
	}

	.avatar-trigger {
		cursor: pointer;
	}

	.avatar {
		width: 36px;
		height: 36px;
		border-radius: 50%;
		background: var(--ui-tertiary);
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 600;
		font-size: 0.875rem;
	}

	.avatar-menu {
		padding: 1rem;
		min-width: 180px;
	}

	.avatar-menu p {
		margin: 0 0 0.5rem 0;
		font-size: 0.875rem;
		color: var(--text-color);
	}

	.avatar-menu .menu-item {
		width: 100%;
		margin-top: 0.5rem;
	}

	/* Dark mode adjustments */
	:global(.dark) .popover-info,
	:global(.dark) .hover-info,
	:global(.dark) .action-log {
		background-color: rgba(var(--ui-accent-rgbc), 0.05);
	}

	:global(.dark) .feature-list strong {
		color: var(--ui-accent);
	}

	:global(.dark) .log-entry {
		background-color: rgba(var(--ui-accent-rgbc), 0.1);
	}

	:global(.dark) .popover-info code,
	:global(.dark) .hover-info code {
		background-color: rgba(var(--ui-accent-rgbc), 0.1);
	}

	:global(.dark) .user-avatar,
	:global(.dark) .search-btn,
	:global(.dark) .filter-btn.primary,
	:global(.dark) .form-btn.primary,
	:global(.dark) .hover-btn {
		background: var(--ui-accent);
		color: var(--ui-primary);
	}

	:global(.dark) .menu-item:hover,
	:global(.dark) .menu-item-icon:hover,
	:global(.dark) .nav-menu a:hover {
		background-color: rgba(var(--ui-accent-rgbc), 0.1);
	}

	@media (min-width: 768px) {
		.form-grid {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: 1.5rem;
			align-items: start;
		}
	}

	@media (max-width: 640px) {
		.positioning-grid {
			grid-template-columns: repeat(2, 1fr);
			padding: 1rem;
		}

		.content-examples,
		.trigger-examples {
			flex-direction: column;
			gap: 1rem;
		}

		.form-demo,
		.nav-examples {
			flex-direction: column;
			align-items: stretch;
		}
	}
</style>