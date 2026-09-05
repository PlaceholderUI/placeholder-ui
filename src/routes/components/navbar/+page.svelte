<script lang="ts">
	import Navbar from '$lib/layout/Navbar.svelte';
	import Paper from '$lib/display/Paper.svelte';
	import Button from '$lib/ui/Button.svelte';
	import Badge from '$lib/ui/Badge.svelte';
	import type { Hyperlink } from '$lib/models/Hyperlink.js';
	import type { LinkNavbarItem, NavbarItem } from '$lib/models/NavbarItem.js';
	import {
		iconUser,
		iconFile,
		iconFolder,
		iconEdit,
		iconSettings,
		iconLogout,
		iconChartBar
	} from '$lib/icon/index.js';
	import Select from '$lib/form/Select.svelte';
	import ActionIcon from '$lib/ui/ActionIcon.svelte';
	import { themeState } from '$lib/theme.svelte.js';

	// Basic navigation items
	let basicItems: LinkNavbarItem[] = $state([
		{ href: '#home', label: 'Home' },
		{ href: '#about', label: 'About' },
		{ href: '#services', label: 'Services' },
		{ href: '#contact', label: 'Contact' }
	]);

	// Extended navigation with icons
	let navWithIcons: LinkNavbarItem[] = $state([
		{ href: '#dashboard', label: 'Dashboard', iconSvg: iconFolder },
		{ href: '#projects', label: 'Projects', iconSvg: iconFile },
		{ href: '#team', label: 'Team', iconSvg: iconUser },
		{ href: '#settings', label: 'Settings', iconSvg: iconEdit }
	]);

	// Navigation with fold-out sub-lists (and icons)
	let navWithSubItems: NavbarItem[] = $state([
		{ href: '#home', label: 'Home', iconSvg: iconFolder },
		{
			label: 'Products',
			iconSvg: iconFile,
			subItems: [
				{ href: '#analytics', label: 'Analytics', iconSvg: iconChartBar },
				{ href: '#reports', label: 'Reports', iconSvg: iconFile },
				{
					label: 'Admin',
					iconSvg: iconSettings,
					subItems: [
						{ href: '#users', label: 'Users', iconSvg: iconUser },
						{ href: '#settings', label: 'Settings', iconSvg: iconSettings }
					]
				}
			]
		},
		{
			label: 'Account',
			iconSvg: iconUser,
			subItems: [
				{ href: '#profile', label: 'Profile', iconSvg: iconUser },
				{ href: '#preferences', label: 'Preferences', iconSvg: iconEdit },
				{ href: '#logout', label: 'Log out', iconSvg: iconLogout }
			]
		}
	]);

	// Secondary items (usually right-aligned)
	let secondaryItems: LinkNavbarItem[] = $state([
		{ href: '#login', label: 'Login' },
		{ href: '#signup', label: 'Sign Up' }
	]);

	// External links for secondary
	let externalSecondary: LinkNavbarItem[] = $state([
		{ href: 'https://github.com', label: 'GitHub' },
		{ href: 'https://docs.example.com', label: 'Docs' }
	]);

	// App navigation (brand/logo area)
	let appNav: Hyperlink = $state({
		href: '#home',
		text: 'My App'
	});

	let companyAppNav: Hyperlink = $state({
		href: '#dashboard',
		text: 'Acme Corp'
	});

	// Dynamic state for interactive example
	let showLogo = $state(true);
	let useContainer = $state(false);
	let currentItems = $state([...basicItems]);
	let currentSecondary = $state([...secondaryItems]);

	function addNavItem() {
		const newItem: LinkNavbarItem = {
			href: `#item${currentItems.length + 1}`,
			label: `Item ${currentItems.length + 1}`
		};
		currentItems = [...currentItems, newItem];
	}

	function removeNavItem() {
		if (currentItems.length > 1) {
			currentItems = currentItems.slice(0, -1);
		}
	}

	function toggleSecondaryItems() {
		currentSecondary = currentSecondary.length > 0 ? [] : [...secondaryItems];
	}

	const buttonVariant = $derived(themeState.isDarkMode ? 'accent-subtle' : 'primary-subtle');
</script>

<div class="page-header">
	<h1>Navbar</h1>
	<p>
		Responsive navigation component with support for branding, primary and secondary navigation
		items, and theme switching.
	</p>
</div>

<div class="vstack">
	<Paper title="Basic Navbar">
		<div class="navbar-demo">
			<Navbar {appNav} items={basicItems} />
		</div>
		<p class="description">
			Simple navbar with app branding and basic navigation items using the <code>appNav</code> and
			<code>items</code> props.
		</p>
	</Paper>

	<Paper title="Primary Variant">
		<div class="navbar-demo">
			<Navbar variant="primary" appNav={companyAppNav} items={navWithSubItems} {secondaryItems} />
		</div>
		<p class="description">
			Setting <code>variant="primary"</code> gives the navbar a primary background on every theme, with
			light text for contrast.
		</p>
	</Paper>

	<Paper title="Navbar with Icons">
		<div class="navbar-demo">
			<Navbar {appNav} items={navWithIcons} />
		</div>
		<p class="description">
			Add an <code>iconSvg</code> to any item to display a leading icon next to its label.
		</p>
	</Paper>

	<Paper title="Navbar with Fold-out Sub-lists">
		<div class="navbar-demo">
			<Navbar appNav={companyAppNav} items={navWithSubItems} {secondaryItems} />
		</div>
		<p class="description">
			Give an item a <code>subItems</code> array (instead of an <code>href</code>) to turn it into a
			parent. Clicking it folds out a vertical sub-list. Sub-lists can be nested — nested lists fly
			out to the side. Items combine freely with <code>iconSvg</code>.
		</p>
	</Paper>

	<Paper title="Navbar with Secondary Items">
		<div class="navbar-demo">
			<Navbar appNav={companyAppNav} items={navWithIcons} {secondaryItems} />
		</div>
		<p class="description">
			Navbar with both primary navigation items and secondary items (typically authentication or
			external links).
		</p>
	</Paper>

	<Paper title="External Secondary Links">
		<div class="navbar-demo">
			<Navbar {appNav} items={basicItems.slice(0, 3)} secondaryItems={externalSecondary} />
		</div>
		<p class="description">
			Secondary items can include external links. The component automatically detects external URLs
			and renders them as anchor tags instead of SvelteKit Link components.
		</p>
	</Paper>

	<Paper title="Navbar without Logo">
		<div class="navbar-demo">
			<Navbar {appNav} items={navWithIcons} {secondaryItems} noLogo={true} />
		</div>
		<p class="description">
			Use the <code>noLogo</code> prop to hide the default logo component.
		</p>
	</Paper>

	<Paper title="Container Layout">
		<div class="navbar-demo">
			<Navbar appNav={companyAppNav} items={basicItems} {secondaryItems} inContainer={true} />
		</div>
		<p class="description">
			The <code>inContainer</code> prop constrains the navbar content to a container width for better
			layout control.
		</p>
	</Paper>

	<Paper title="Navbar with Middle Section">
		<div class="navbar-demo">
			<Navbar {appNav} items={basicItems.slice(0, 2)}>
				{#snippet middleSection()}
					<Select allowSearch />
				{/snippet}
			</Navbar>
		</div>
		<p class="description">
			Use the middleSection snippet to add custom content like search bars or notifications in the
			center area.
		</p>
	</Paper>

	<Paper title="Navbar with Right Section">
		<div class="navbar-demo">
			<Navbar {appNav} items={basicItems.slice(0, 2)}>
				{#snippet rightSection()}
					<ActionIcon
						svg={iconUser}
						variant={buttonVariant}
						size="1.25rem"
						onclick={() => alert('Profile clicked')}
					/>
				{/snippet}
			</Navbar>
		</div>
		<p class="description">
			Use the rightSection snippet to add custom content like search bars or notifications in the
			right area.
		</p>
	</Paper>

	<Paper title="Custom Styling">
		<div class="navbar-demo">
			<Navbar {appNav} items={navWithIcons.slice(0, 3)} {secondaryItems} class="custom-navbar" />
		</div>
		<p class="description">
			Apply custom CSS classes using the <code>class</code> prop for additional styling.
		</p>
	</Paper>

	<Paper title="Interactive Example">
		<div class="interactive-section">
			<div class="controls">
				<Button onclick={addNavItem} variant="accent">Add Item</Button>
				<Button onclick={removeNavItem} variant="secondary">Remove Item</Button>
				<Button onclick={toggleSecondaryItems} variant="primary">
					{currentSecondary.length > 0 ? 'Hide' : 'Show'} Secondary
				</Button>
			</div>

			<div class="control-switches">
				<label class="switch-label">
					<input type="checkbox" bind:checked={showLogo} class="checkbox" />
					Show Logo
				</label>
				<label class="switch-label">
					<input type="checkbox" bind:checked={useContainer} class="checkbox" />
					Use Container
				</label>
			</div>

			<div class="navbar-demo">
				<Navbar
					{appNav}
					items={currentItems}
					secondaryItems={currentSecondary}
					noLogo={!showLogo}
					inContainer={useContainer}
				/>
			</div>

			<div class="stats">
				<div class="stat">
					<span class="stat-label">Primary Items:</span>
					<Badge variant="primary">{currentItems.length}</Badge>
				</div>
				<div class="stat">
					<span class="stat-label">Secondary Items:</span>
					<Badge variant="accent">{currentSecondary.length}</Badge>
				</div>
			</div>
		</div>
	</Paper>

	<Paper title="Navigation States">
		<div class="states-section">
			<h4>Empty Navigation</h4>
			<div class="navbar-demo">
				<Navbar {appNav} />
			</div>

			<h4>App Nav Only</h4>
			<div class="navbar-demo">
				<Navbar appNav={companyAppNav} noLogo={true} />
			</div>

			<h4>Minimal Setup</h4>
			<div class="navbar-demo">
				<Navbar items={basicItems.slice(0, 2)} />
			</div>
		</div>
	</Paper>

	<Paper title="Real-world Examples">
		<div class="examples-section">
			<h4>E-commerce Site</h4>
			<div class="navbar-demo">
				<Navbar
					appNav={{ href: '#shop', text: 'ShopApp' }}
					items={[
						{ href: '#products', label: 'Products' },
						{ href: '#categories', label: 'Categories' },
						{ href: '#deals', label: 'Deals' },
						{ href: '#support', label: 'Support' }
					]}
					secondaryItems={[
						{ href: '#cart', label: 'Cart' },
						{ href: '#account', label: 'Account' }
					]}
				>
					{#snippet middleSection()}
						<div class="search-section">
							<input type="search" placeholder="Search products..." class="search-input" />
						</div>
					{/snippet}
				</Navbar>
			</div>

			<h4>SaaS Dashboard</h4>
			<div class="navbar-demo">
				<Navbar
					appNav={{ href: '#dashboard', text: 'Analytics Pro' }}
					items={[
						{ href: '#dashboard', label: 'Dashboard', iconSvg: iconFolder },
						{ href: '#reports', label: 'Reports', iconSvg: iconFile },
						{ href: '#users', label: 'Users', iconSvg: iconUser },
						{ href: '#settings', label: 'Settings', iconSvg: iconEdit }
					]}
					secondaryItems={[
						{ href: 'https://docs.analytics.com', label: 'Docs' },
						{ href: '#profile', label: 'Profile' }
					]}
				/>
			</div>

			<h4>Documentation Site</h4>
			<div class="navbar-demo">
				<Navbar
					appNav={{ href: '#docs', text: 'UI Docs' }}
					items={[
						{ href: '#getting-started', label: 'Getting Started' },
						{ href: '#components', label: 'Components' },
						{ href: '#examples', label: 'Examples' }
					]}
					secondaryItems={[
						{ href: 'https://github.com/example/ui', label: 'GitHub' },
						{ href: '#download', label: 'Download' }
					]}
					inContainer={true}
				/>
			</div>
		</div>
	</Paper>

	<Paper title="Usage Guidelines">
		<div class="guidelines">
			<h4>When to Use Navbar</h4>
			<ul>
				<li>
					<strong>Primary navigation:</strong> Main site/app navigation that appears on every page
				</li>
				<li><strong>Branding:</strong> Display company logo and app name consistently</li>
				<li><strong>Quick actions:</strong> Authentication, search, or other global actions</li>
				<li><strong>External links:</strong> Links to documentation, support, or related sites</li>
			</ul>

			<h4>Props Reference</h4>
			<ul>
				<li><code>appNav</code> - Hyperlink object for the main brand/app link</li>
				<li>
					<code>items</code> - Array of primary navigation items. Each item may carry an
					<code>iconSvg</code> (leading icon) and either an <code>href</code> (link) or
					<code>subItems</code> (fold-out sub-list)
				</li>
				<li><code>secondaryItems</code> - Array of secondary navigation items (right-aligned)</li>
				<li><code>middleSection</code> - Snippet for custom content in the center area</li>
				<li><code>noLogo</code> - Hide the default logo component</li>
				<li><code>logoHref</code> - Custom href for the logo link</li>
				<li><code>inContainer</code> - Constrain content to container width</li>
				<li><code>class</code> - Additional CSS classes for styling</li>
			</ul>

			<h4>Best Practices</h4>
			<ul>
				<li><strong>Keep it simple:</strong> Limit primary navigation to 5-7 items for clarity</li>
				<li><strong>Consistent branding:</strong> Use appNav for brand identity and recognition</li>
				<li>
					<strong>Logical grouping:</strong> Group related items and use secondary items for different
					categories
				</li>
				<li>
					<strong>Mobile consideration:</strong> The navbar includes responsive design for smaller screens
				</li>
				<li>
					<strong>Theme integration:</strong> Navbar automatically includes theme switching functionality
				</li>
				<li>
					<strong>External links:</strong> Use full URLs for external links - they'll be handled automatically
				</li>
			</ul>

			<h4>Accessibility</h4>
			<ul>
				<li><strong>Semantic structure:</strong> Uses proper header and nav elements</li>
				<li>
					<strong>Keyboard navigation:</strong> All links are focusable and keyboard accessible
				</li>
				<li><strong>Screen readers:</strong> Proper link text and landmark regions</li>
				<li>
					<strong>High contrast:</strong> Supports both light and dark themes with proper contrast
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
		margin: 0 0 0.5rem;
		color: var(--text-color);
	}
	.page-header p {
		color: var(--text-muted);
		margin: 0;
	}

	.vstack {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.description {
		color: var(--text-muted);
		font-size: 0.875rem;
		margin-top: 1rem;
		margin-bottom: 0;
	}

	.navbar-demo {
		border: 1px solid var(--border-color);
		border-radius: 0.5rem;
		background: var(--page-bg);
		margin-bottom: 1rem;
	}

	.navbar-demo :global(.inner-navbar) {
		padding: 0 1rem;
	}

	.interactive-section {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.controls {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.control-switches {
		display: flex;
		gap: 1.5rem;
		flex-wrap: wrap;
	}

	.switch-label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.875rem;
		color: var(--text-color);
		cursor: pointer;
	}

	.checkbox {
		width: 1rem;
		height: 1rem;
		accent-color: var(--ui-accent);
	}

	.stats {
		display: flex;
		gap: 1.5rem;
		flex-wrap: wrap;
	}

	.stat {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.stat-label {
		font-size: 0.875rem;
		color: var(--text-muted);
	}

	.search-section {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.search-input {
		padding: 0.5rem 0.75rem;
		border: 1px solid var(--border-color);
		border-radius: 0.25rem;
		background: var(--input-bg-color);
		color: var(--text-color);
		font-size: 0.875rem;
		min-width: 200px;
	}

	.search-input:focus {
		outline: none;
		border-color: var(--ui-accent);
		box-shadow: 0 0 0 2px rgba(var(--ui-accent-rgbc), 0.2);
	}

	.states-section h4,
	.examples-section h4 {
		margin: 0 0 0.75rem;
		color: var(--text-color);
		font-size: 1rem;
	}

	.states-section h4:not(:first-child),
	.examples-section h4:not(:first-child) {
		margin-top: 1.5rem;
	}

	.guidelines ul {
		margin: 0.5rem 0 1rem;
		padding-left: 1.5rem;
	}

	.guidelines li {
		margin: 0.5rem 0;
		line-height: 1.5;
	}

	.guidelines h4 {
		margin: 0 0 0.5rem;
		color: var(--text-color);
	}

	.guidelines h4:not(:first-child) {
		margin-top: 1.5rem;
	}

	.guidelines code {
		background: rgba(var(--ui-accent-rgbc), 0.1);
		padding: 0.125rem 0.25rem;
		border-radius: 0.25rem;
		font-family: monospace;
		font-size: 0.875rem;
		color: var(--ui-accent-dark);
	}

	/* Custom navbar styling example */
	:global(.custom-navbar) {
		background: linear-gradient(90deg, var(--ui-primary), var(--ui-tertiary-dark));
	}

	:global(.custom-navbar a) {
		color: white !important;
	}

	:global(.custom-navbar a:hover) {
		color: var(--ui-accent) !important;
	}

	/* Dark mode adjustments */
	:global(.dark) .search-input {
		background: rgb(25, 26, 28);
		border-color: #374151;
		color: var(--text-color);
	}

	:global(.dark) .search-input:focus {
		border-color: var(--ui-primary);
		box-shadow: 0 0 0 2px rgba(var(--ui-primary-rgbc), 0.2);
	}

	:global(.dark) .guidelines code {
		background: rgba(var(--ui-primary-rgbc), 0.2);
		color: var(--ui-primary);
	}

	:global(.dark) .navbar-demo {
		background: var(--page-bg);
		border-color: #374151;
	}

	/* Responsive design */
	@media (max-width: 768px) {
		.controls {
			justify-content: center;
		}

		.control-switches {
			justify-content: center;
		}

		.stats {
			justify-content: center;
		}

		.search-input {
			min-width: 150px;
		}
	}
</style>
