<script lang="ts">
	import LinkCollection from '$lib/display/LinkCollection.svelte';
	import Paper from '$lib/display/Paper.svelte';
	import Button from '$lib/ui/Button.svelte';
	import Badge from '$lib/ui/Badge.svelte';
	import type { Hyperlink } from '$lib/models/Hyperlink.js';
	import type { LinkCollectionItem } from '$lib/models/LinkCollectionItem.js';
	import {
		iconFolder,
		iconFile,
		iconMail,
		iconPhone,
		iconDownload,
		iconSquareArrowRight,
		iconUser,
		iconInfoCircle,
		iconEdit,
		iconTrash,
		iconPlus,
		iconCopy
	} from '$lib/icon/index.js';
	import Number from '$lib/form/Number.svelte';

	// Sample data for basic links
	let basicLinks: Hyperlink[] = $state([
		{ href: '#home', text: 'Home', svg: iconFolder },
		{ href: '#about', text: 'About Us', svg: iconInfoCircle },
		{ href: '#contact', text: 'Contact', svg: iconMail },
		{ href: '#download', text: 'Download', svg: iconDownload }
	]);

	// Sample data for advanced items
	let menuItems: LinkCollectionItem[] = $state([
		{
			href: '#profile',
			leftContent: 'User Profile',
			rightContent: 'View Details',
			leftSvg: iconUser,
			rightSvg: iconSquareArrowRight
		},
		{
			href: '#settings',
			leftContent: 'Account Settings',
			rightContent: 'Configure',
			leftSvg: iconEdit,
			rightSvg: iconSquareArrowRight
		},
		{
			href: '#documents',
			leftContent: 'My Documents',
			rightContent: '12 files',
			leftSvg: iconFile,
			rightSvg: iconFolder
		}
	]);

	// Contact information
	let contactItems: LinkCollectionItem[] = $state([
		{
			href: 'mailto:contact@example.com',
			leftContent:
				'<strong>Email</strong><br><span style="color: var(--text-muted); font-size: 0.875rem;">contact@example.com</span>',
			rightContent: 'Send Message',
			leftSvg: iconMail,
			rightSvg: iconSquareArrowRight
		},
		{
			href: 'tel:+1234567890',
			leftContent:
				'<strong>Phone</strong><br><span style="color: var(--text-muted); font-size: 0.875rem;">+1 (234) 567-890</span>',
			rightContent: 'Call Now',
			leftSvg: iconPhone,
			rightSvg: iconSquareArrowRight
		}
	]);

	// File explorer example
	let fileItems: LinkCollectionItem[] = $state([
		{
			href: '#documents',
			leftContent:
				'<strong>Documents</strong><br><span style="color: var(--text-muted); font-size: 0.875rem;">15 items</span>',
			rightContent: '2.1 MB',
			leftSvg: iconFolder
		},
		{
			href: '#downloads',
			leftContent:
				'<strong>Downloads</strong><br><span style="color: var(--text-muted); font-size: 0.875rem;">8 items</span>',
			rightContent: '45.3 MB',
			leftSvg: iconFolder
		},
		{
			href: '#report.pdf',
			leftContent:
				'<strong>Report.pdf</strong><br><span style="color: var(--text-muted); font-size: 0.875rem;">Modified 2 hours ago</span>',
			rightContent: '1.2 MB',
			leftSvg: iconFile,
			rightSvg: iconDownload
		}
	]);

	// Footer buttons for actions
	let footerActions: Hyperlink[] = $state([
		{ href: '#add', text: 'Add New', svg: iconPlus },
		{ href: '#copy', text: 'Copy', svg: iconCopy },
		{ href: '#delete', text: 'Delete', svg: iconTrash }
	]);

	// Dynamic example data
	let dynamicLinks: Hyperlink[] = $state([
		{ href: '#item1', text: 'Dynamic Item 1', svg: iconFile },
		{ href: '#item2', text: 'Dynamic Item 2', svg: iconFile }
	]);

	let showAdvanced = $state(false);
	let itemCount = $state(3);

	function addItem() {
		const newItem: Hyperlink = {
			href: `#item${dynamicLinks.length + 1}`,
			text: `Dynamic Item ${dynamicLinks.length + 1}`,
			svg: iconFile
		};
		dynamicLinks = [...dynamicLinks, newItem];
	}

	function removeItem() {
		if (dynamicLinks.length > 0) {
			dynamicLinks = dynamicLinks.slice(0, -1);
		}
	}

	function toggleAdvanced() {
		showAdvanced = !showAdvanced;
	}

	function updateItemCount() {
		// Update the count display in one of the file items
		fileItems = fileItems.map((item, index) => {
			if (index === 0) {
				return {
					...item,
					leftContent: `<strong>Documents</strong><br><span style="color: var(--text-muted); font-size: 0.875rem;">${itemCount} items</span>`
				};
			}
			return item;
		});
	}

	// Reactive update when itemCount changes
	// $effect(() => {
	// 	if (!itemCount) return;
	// 	updateItemCount();
	// });
</script>

<div class="page-header">
	<h1>Link Collection</h1>
	<p>Organize and display groups of related links with icons, descriptions, and actions.</p>
</div>

<div class="vstack">
	<Paper title="Basic Link Collection">
		<LinkCollection links={basicLinks} />
		<p class="description">
			Simple link collection using the <code>links</code> prop with icons and text.
		</p>
	</Paper>

	<Paper title="Advanced Items with Rich Content">
		<LinkCollection items={menuItems} />
		<p class="description">
			Advanced items using the <code>items</code> prop with left and right content, plus icons.
		</p>
	</Paper>

	<Paper title="Contact Information">
		<LinkCollection items={contactItems} />
		<p class="description">
			Rich HTML content with formatted text, showing contact details with appropriate actions.
		</p>
	</Paper>

	<Paper title="File Explorer Style">
		<div class="file-explorer">
			<div class="explorer-header">
				<h4>File Browser</h4>
				<div class="controls">
					<label>
						Items in Documents:
						<Number
							bind:value={itemCount}
							onchange={updateItemCount}
							min={1}
							max={100}
							class="item-counter"
						/>
					</label>
				</div>
			</div>
			<LinkCollection items={fileItems} />
		</div>
	</Paper>

	<Paper title="Collection with Footer Actions">
		<LinkCollection items={menuItems.slice(0, 2)} footerButtons={footerActions} />
		<p class="description">
			Link collection with footer buttons for common actions like Add, Copy, and Delete.
		</p>
	</Paper>

	<Paper title="Styling Variants">
		<div class="variant-examples">
			<h4>Default (Rounded with Border)</h4>
			<LinkCollection links={basicLinks.slice(0, 3)} />

			<h4>Not Rounded</h4>
			<LinkCollection links={basicLinks.slice(0, 3)} notRounded />

			<h4>No Outside Border</h4>
			<LinkCollection links={basicLinks.slice(0, 3)} noOutsideBorder />

			<h4>No Separators</h4>
			<LinkCollection links={basicLinks.slice(0, 3)} noSeperator />

			<h4>Combined: Not Rounded + No Border + No Separators</h4>
			<LinkCollection links={basicLinks.slice(0, 3)} notRounded noOutsideBorder noSeperator />
		</div>
	</Paper>

	<Paper title="Interactive Example">
		<div class="interactive-section">
			<div class="controls">
				<Button onclick={addItem} variant="accent">Add Item</Button>
				<Button onclick={removeItem} variant="secondary">Remove Item</Button>
				<Button onclick={toggleAdvanced} variant="primary">
					{showAdvanced ? 'Hide' : 'Show'} Advanced
				</Button>
			</div>

			<div class="dynamic-collections">
				<div class="collection-wrapper">
					<h4>Dynamic Links ({dynamicLinks.length} items)</h4>
					<LinkCollection links={dynamicLinks} />
				</div>

				{#if showAdvanced}
					<div class="collection-wrapper">
						<h4>Advanced View</h4>
						<LinkCollection
							items={dynamicLinks.map((link) => ({
								href: link.href,
								leftContent: `<strong>${link.text}</strong><br><span style="color: var(--text-muted); font-size: 0.875rem;">Click to navigate</span>`,
								rightContent: 'Open',
								leftSvg: link.svg,
								rightSvg: iconSquareArrowRight
							}))}
							footerButtons={[{ href: '#refresh', text: 'Refresh', svg: iconCopy }]}
						/>
					</div>
				{/if}
			</div>
		</div>
	</Paper>

	<Paper title="Navigation Menu Example">
		<div class="navigation-example">
			<h4>Main Navigation</h4>
			<LinkCollection
				links={[
					{ href: '#dashboard', text: 'Dashboard', svg: iconFolder },
					{ href: '#projects', text: 'Projects', svg: iconFile },
					{ href: '#team', text: 'Team', svg: iconUser },
					{ href: '#settings', text: 'Settings', svg: iconEdit }
				]}
			/>

			<h4 class="section-spacing">Quick Actions</h4>
			<LinkCollection
				items={[
					{
						href: '#create-project',
						leftContent:
							'<strong>Create New Project</strong><br><span style="color: var(--text-muted); font-size: 0.875rem;">Start a new project from template</span>',
						rightContent: 'Create',
						leftSvg: iconPlus,
						rightSvg: iconSquareArrowRight
					},
					{
						href: '#import',
						leftContent:
							'<strong>Import Data</strong><br><span style="color: var(--text-muted); font-size: 0.875rem;">Import from CSV or JSON</span>',
						rightContent: 'Import',
						leftSvg: iconDownload,
						rightSvg: iconSquareArrowRight
					}
				]}
				footerButtons={[
					{ href: '#help', text: 'Help', svg: iconInfoCircle },
					{ href: '#support', text: 'Support', svg: iconMail }
				]}
			/>
		</div>
	</Paper>

	<Paper title="Usage Guidelines">
		<div class="guidelines">
			<h4>When to Use Link Collections</h4>
			<ul>
				<li>
					<strong>Navigation menus:</strong> Organize related navigation links in sidebars or dropdowns
				</li>
				<li><strong>File browsers:</strong> Display file and folder structures with metadata</li>
				<li><strong>Contact lists:</strong> Show contact information with action buttons</li>
				<li><strong>Action panels:</strong> Group related actions with descriptions</li>
				<li><strong>Settings pages:</strong> Organize configuration options by category</li>
			</ul>

			<h4>Props Reference</h4>
			<ul>
				<li><code>links</code> - Array of simple Hyperlink objects with text and optional icons</li>
				<li>
					<code>items</code> - Array of LinkCollectionItem objects with rich left/right content
				</li>
				<li><code>footerButtons</code> - Array of Hyperlink objects for footer actions</li>
				<li><code>classes</code> - Additional CSS classes for styling</li>
				<li><code>notRounded</code> - Remove border radius for square corners</li>
				<li><code>noOutsideBorder</code> - Remove the outer border</li>
				<li><code>noSeperator</code> - Remove borders between items</li>
			</ul>

			<h4>Best Practices</h4>
			<ul>
				<li><strong>Consistent icons:</strong> Use similar icon styles throughout a collection</li>
				<li><strong>Meaningful grouping:</strong> Group related links together logically</li>
				<li>
					<strong>Clear descriptions:</strong> Use descriptive text that indicates the action or destination
				</li>
				<li>
					<strong>Appropriate styling:</strong> Choose variants that match your design context
				</li>
				<li>
					<strong>Accessibility:</strong> Ensure links have proper href attributes and meaningful text
				</li>
				<li>
					<strong>Footer actions:</strong> Use footer buttons for global actions that apply to the entire
					collection
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

	.file-explorer {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.explorer-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.explorer-header h4 {
		margin: 0;
		color: var(--text-color);
	}

	.controls {
		display: flex;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.controls label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.875rem;
		color: var(--text-color);
	}

	.variant-examples h4 {
		margin: 1.5rem 0 0.75rem;
		color: var(--text-color);
		font-size: 1rem;
	}

	.variant-examples h4:first-child {
		margin-top: 0;
	}

	.interactive-section {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.dynamic-collections {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 1.5rem;
	}

	.collection-wrapper h4 {
		margin: 0 0 0.75rem;
		color: var(--text-color);
		font-size: 1rem;
	}

	.navigation-example h4 {
		margin: 0 0 0.75rem;
		color: var(--text-color);
		font-size: 1rem;
	}

	.section-spacing {
		margin-top: 1.5rem !important;
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

	:global(.dark) .guidelines code {
		background: rgba(var(--ui-primary-rgbc), 0.2);
		color: var(--ui-primary);
	}

	/* Responsive design */
	@media (max-width: 768px) {
		.explorer-header {
			flex-direction: column;
			align-items: stretch;
		}

		.dynamic-collections {
			grid-template-columns: 1fr;
		}

		.controls {
			justify-content: center;
		}
	}
</style>
