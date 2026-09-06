<script lang="ts">
	import Paper from '$lib/display/Paper.svelte';
	import Dialog from '$lib/ui/Dialog.svelte';
	import Button from '$lib/ui/Button.svelte';
	import Textbox from '$lib/form/Textbox.svelte';
	import TextArea from '$lib/form/TextArea.svelte';
	import ActionIcon from '$lib/ui/ActionIcon.svelte';
	import Select from '$lib/form/Select.svelte';
	import DatePicker from '$lib/form/DatePicker.svelte';
	import Tooltip from '$lib/ui/Tooltip.svelte';
	import Popover from '$lib/ui/Popover.svelte';
	import Dropdown from '$lib/ui/Dropdown.svelte';
	import {
		iconEdit,
		iconTrash,
		iconDownload,
		iconInfoCircle,
		iconAlertTriangle,
		iconUser
	} from '$lib/icon/index.js';

	// Dialog state variables
	let basicDialog = false;
	let confirmDialog = false;
	let formDialog = false;
	let fullScreenDialog = false;
	let customDialog = false;
	let noPaperDialog = false;
	let infoDialog = false;
	let deleteDialog = false;
	let scrollDialog = false;
	let scrollDialogVisible = false;
	let scrollCountry: string | undefined = undefined;
	let scrollDate: string | undefined = undefined;
	const countryOptions = [
		{ label: 'Australia', value: 'au' },
		{ label: 'Canada', value: 'ca' },
		{ label: 'Germany', value: 'de' },
		{ label: 'Japan', value: 'jp' },
		{ label: 'New Zealand', value: 'nz' },
		{ label: 'United Kingdom', value: 'uk' },
		{ label: 'United States', value: 'us' }
	];

	// Form data
	let userName = '';
	let userEmail = '';
	let userBio = '';

	// Demo data
	let selectedItem = 'Document.pdf';
	let actionLog: string[] = [];

	function addToLog(message: string) {
		actionLog = [`${new Date().toLocaleTimeString()}: ${message}`, ...actionLog.slice(0, 4)];
	}

	function handleSave() {
		addToLog(`Saved user: ${userName} (${userEmail})`);
		formDialog = false;
		userName = '';
		userEmail = '';
		userBio = '';
	}

	function handleDelete() {
		addToLog(`Deleted: ${selectedItem}`);
		deleteDialog = false;
	}

	function handleDownload() {
		addToLog(`Downloaded: ${selectedItem}`);
		customDialog = false;
	}

	function clearLog() {
		actionLog = [];
	}
</script>

<div class="page-header">
	<h1>Dialog</h1>
	<p>Modal dialog component with multiple sizes, animations, and customization options.</p>
</div>

<div class="vstack">
	<Paper title="Basic Usage">
		<div class="form-grid">
			<div class="dialog-section">
				<h4>Simple Dialogs</h4>
				<div class="button-row">
					<Button onclick={() => (basicDialog = true)}>Basic Dialog</Button>
					<Button variant="secondary" onclick={() => (infoDialog = true)}>Info Dialog</Button>
				</div>
			</div>
			<div class="dialog-info">
				<strong>Dialog States:</strong>
				<p>Basic: {basicDialog ? '🟢 Open' : '🔴 Closed'}</p>
				<p>Info: {infoDialog ? '🟢 Open' : '🔴 Closed'}</p>
				<p class="note">Click outside the dialog or the X button to close.</p>
			</div>
		</div>
	</Paper>

	<Paper title="Dialog Sizes">
		<div class="size-section">
			<h4>Different Sizes</h4>
			<div class="size-grid">
				<Button onclick={() => (basicDialog = true)}>Small</Button>
				<Button onclick={() => (basicDialog = true)}>Medium (default)</Button>
				<Button onclick={() => (customDialog = true)}>Large</Button>
				<Button variant="secondary" onclick={() => (fullScreenDialog = true)}>Full Screen</Button>
			</div>
		</div>
	</Paper>

	<Paper title="Form Dialog">
		<div class="form-dialog-section">
			<h4>User Profile Form</h4>
			<div class="form-demo">
				<Button svg={iconUser} onclick={() => (formDialog = true)}>Edit Profile</Button>
				<div class="current-values">
					<strong>Current Values:</strong>
					<p>Name: {userName || 'Not set'}</p>
					<p>Email: {userEmail || 'Not set'}</p>
					<p>Bio: {userBio || 'Not set'}</p>
				</div>
			</div>
		</div>
	</Paper>

	<Paper title="Confirmation Dialogs">
		<div class="confirmation-section">
			<h4>Action Confirmations</h4>
			<div class="confirmation-demo">
				<div class="item-card">
					<span class="item-name">{selectedItem}</span>
					<div class="item-actions">
						<ActionIcon
							svg={iconDownload}
							variant="primary-subtle"
							onclick={() => (customDialog = true)}
						/>
						<ActionIcon
							svg={iconEdit}
							variant="secondary-subtle"
							onclick={() => (formDialog = true)}
						/>
						<ActionIcon
							svg={iconTrash}
							variant="danger-subtle"
							onclick={() => (deleteDialog = true)}
						/>
					</div>
				</div>
			</div>
		</div>
	</Paper>

	<Paper title="Scrolling Content with Popups">
		<div class="custom-section">
			<p>
				The dialog body scrolls by default. Selects, pickers, tooltips, popovers and dropdowns
				render in the browser's top layer, so they open outside the scrolling area instead of being
				clipped by it. Scroll the body while a select is open to see it track its field.
			</p>
			<div class="custom-options">
				<Button onclick={() => (scrollDialog = true)}>Open Scrolling Dialog</Button>
				<Button variant="secondary" onclick={() => (scrollDialogVisible = true)}>
					Same Dialog with allowOverflow
				</Button>
			</div>
		</div>
	</Paper>

	<Paper title="Custom Styling">
		<div class="custom-section">
			<h4>Custom Dialog Options</h4>
			<div class="custom-options">
				<Button variant="tertiary" onclick={() => (noPaperDialog = true)}>
					No Paper Background
				</Button>
				<Button variant="accent-outline" onclick={() => (customDialog = true)}>
					Custom Styled
				</Button>
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
					<p class="no-actions">No actions yet. Try using the dialogs above!</p>
				{/if}
			</div>
		</div>
	</Paper>

	<Paper title="Features">
		<div class="feature-list">
			<ul>
				<li><strong>Multiple sizes:</strong> sm, md, lg, xl, and full-screen options</li>
				<li><strong>Smooth animations:</strong> Fade in/out with backdrop animations</li>
				<li><strong>Click outside to close:</strong> Optional implicit close behavior</li>
				<li><strong>ESC key support:</strong> Close with keyboard for accessibility</li>
				<li><strong>Body scroll lock:</strong> Prevents background scrolling when open</li>
				<li><strong>Custom styling:</strong> Support for custom classes and no-paper mode</li>
				<li><strong>Footer support:</strong> Built-in footer area for action buttons</li>
				<li>
					<strong>Overflow handling:</strong> Body scrolls by default; popups escape to the top
					layer. Use <code>allowOverflow</code> to let content spill instead
				</li>
				<li><strong>Theme integration:</strong> Full light/dark mode support</li>
				<li><strong>Event context:</strong> onOpen, onClose, and onFirstOpen events</li>
				<li><strong>Paper integration:</strong> Built-in Paper component styling</li>
				<li><strong>Accessibility:</strong> Proper ARIA attributes and focus management</li>
			</ul>
		</div>
	</Paper>
</div>

<!-- Basic Dialog -->
<Dialog bind:show={basicDialog} title="Basic Dialog" size="md">
	<div class="dialog-content">
		<p>This is a basic dialog with default settings.</p>
		<p>You can include any content here - text, forms, images, or other components.</p>
	</div>
</Dialog>

<!-- Info Dialog -->
<Dialog bind:show={infoDialog} title="Information" size="sm">
	<div class="dialog-content">
		<div class="info-content">
			<ActionIcon svg={iconInfoCircle} variant="primary-subtle" size="2rem" />
			<div>
				<p><strong>Welcome to the Dialog Component!</strong></p>
				<p>This dialog demonstrates basic information display with icons and styled content.</p>
			</div>
		</div>
	</div>
	{#snippet footer()}
		<Button onclick={() => (infoDialog = false)}>Got it</Button>
	{/snippet}
</Dialog>

<!-- Form Dialog -->
<Dialog bind:show={formDialog} title="Edit Profile" size="md">
	<div class="dialog-content">
		<div class="form-fields">
			<Textbox label="Full Name" bind:value={userName} placeholder="Enter your full name" />
			<Textbox label="Email" bind:value={userEmail} placeholder="Enter your email" />
			<TextArea label="Bio" bind:value={userBio} placeholder="Tell us about yourself..." />
		</div>
	</div>
	{#snippet footer()}
		<Button variant="secondary" onclick={() => (formDialog = false)}>Cancel</Button>
		<Button onclick={handleSave} disabled={!userName || !userEmail}>Save Profile</Button>
	{/snippet}
</Dialog>

<!-- Confirmation Dialog -->
<Dialog bind:show={deleteDialog} title="Confirm Delete" size="sm">
	<div class="dialog-content">
		<div class="warning-content">
			<ActionIcon svg={iconAlertTriangle} variant="danger-subtle" size="2rem" />
			<div>
				<p><strong>Are you sure you want to delete this item?</strong></p>
				<p>"{selectedItem}" will be permanently deleted. This action cannot be undone.</p>
			</div>
		</div>
	</div>
	{#snippet footer()}
		<Button variant="secondary" onclick={() => (deleteDialog = false)}>Cancel</Button>
		<Button variant="danger" onclick={handleDelete}>Delete</Button>
	{/snippet}
</Dialog>

<!-- Scrolling Dialog with Popups -->
{#snippet scrollDialogBody()}
	<!-- Plain wrapper (no overflow of its own) so the Dialog body is what scrolls -->
	<div class="scroll-demo-content">
		<div class="form-fields">
			<Select label="Country" options={countryOptions} bind:value={scrollCountry} allowSearch />
			<DatePicker label="Start date" bind:value={scrollDate} />
			<div class="scroll-popup-row">
				<Tooltip text="Tooltips are position: fixed and were never clipped" location="right">
					<Button variant="secondary">Hover for tooltip</Button>
				</Tooltip>
				<Popover label="Popover" position="bottom">
					<div style="padding: 0.75rem;">Rendered in the top layer.</div>
				</Popover>
				<Dropdown
					label="Dropdown"
					variant="tertiary"
					links={[
						{ text: 'First link', href: '#' },
						{ text: 'Second link', href: '#' }
					]}
				/>
			</div>
		</div>
		{#each Array(12) as _, i}
			<p>
				Paragraph {i + 1}. Filler content so the body is taller than the viewport and has to scroll.
				Open the country select above, then scroll this body: the list stays anchored to the field
				and is never clipped by the scrolling container.
			</p>
		{/each}
		<div class="form-fields">
			<Select
				label="Country (near the bottom, flips upward when there is no room below)"
				options={countryOptions}
				bind:value={scrollCountry}
			/>
		</div>
	</div>
{/snippet}

<Dialog bind:show={scrollDialog} title="Scrolling Dialog" size="md">
	{@render scrollDialogBody()}
	{#snippet footer()}
		<span></span>
		<Button onclick={() => (scrollDialog = false)}>Close</Button>
	{/snippet}
</Dialog>

<Dialog
	bind:show={scrollDialogVisible}
	title="Scrolling Dialog (allowOverflow)"
	size="md"
	allowOverflow
>
	{@render scrollDialogBody()}
	{#snippet footer()}
		<span></span>
		<Button onclick={() => (scrollDialogVisible = false)}>Close</Button>
	{/snippet}
</Dialog>

<!-- Custom Dialog -->
<Dialog bind:show={customDialog} title="Download File" size="lg">
	<div class="dialog-content">
		<div class="download-content">
			<ActionIcon svg={iconDownload} variant="tertiary-subtle" size="3rem" />
			<div class="download-info">
				<h3>Ready to Download</h3>
				<p>File: <strong>{selectedItem}</strong></p>
				<p>Size: 2.4 MB</p>
				<p>Format: PDF Document</p>
			</div>
		</div>
	</div>
	{#snippet footer()}
		<Button variant="secondary" onclick={() => (customDialog = false)}>Cancel</Button>
		<Button variant="tertiary" onclick={handleDownload}>Download Now</Button>
	{/snippet}
</Dialog>

<!-- Full Screen Dialog -->
<Dialog bind:show={fullScreenDialog} title="Full Screen Dialog" size="full">
	<div class="dialog-content full-screen-content">
		<h3>Full Screen Experience</h3>
		<p>This dialog takes up the entire viewport, perfect for detailed forms or data displays.</p>
		<div class="full-screen-demo">
			<div class="demo-section">
				<h4>Section 1</h4>
				<p>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt
					ut labore et dolore magna aliqua.
				</p>
			</div>
			<div class="demo-section">
				<h4>Section 2</h4>
				<p>
					Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
					commodo consequat.
				</p>
			</div>
			<div class="demo-section">
				<h4>Section 3</h4>
				<p>
					Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
					nulla pariatur.
				</p>
			</div>
		</div>
	</div>
	{#snippet footer()}
		<Button variant="secondary" onclick={() => (fullScreenDialog = false)}>Close</Button>
	{/snippet}
</Dialog>

<!-- No Paper Dialog -->
<Dialog bind:show={noPaperDialog} title="Custom Styling" size="md" noPaper={true}>
	<div class="custom-dialog-content">
		<h3>No Paper Background</h3>
		<p>This dialog doesn't use the Paper component, giving you full control over the styling.</p>
		<div class="custom-card">
			<p>You can create your own card-like designs or completely custom layouts.</p>
		</div>
	</div>
	{#snippet footer()}
		<Button variant="accent" onclick={() => (noPaperDialog = false)}>Close</Button>
	{/snippet}
</Dialog>

<style>
	.scroll-demo-content {
		padding: 1rem 0;
	}

	.scroll-popup-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		align-items: center;
	}

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

	.dialog-section h4,
	.size-section h4,
	.form-dialog-section h4,
	.confirmation-section h4,
	.custom-section h4,
	.log-section h4 {
		color: var(--text-color);
		font-size: 1.125rem;
		font-weight: 600;
		margin: 0 0 1rem 0;
	}

	.button-row {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.dialog-info {
		padding: 1rem;
		background-color: rgba(var(--ui-primary-rgbc), 0.05);
		border-radius: 0.375rem;
		border: 1px solid var(--border-color);
	}

	.dialog-info strong {
		color: var(--text-color);
		font-weight: 600;
		display: block;
		margin-bottom: 0.5rem;
	}

	.dialog-info p {
		margin: 0.25rem 0;
		color: var(--text-muted);
	}

	.size-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		gap: 1rem;
	}

	.form-demo {
		display: flex;
		align-items: flex-start;
		gap: 2rem;
		flex-wrap: wrap;
	}

	.current-values {
		padding: 1rem;
		background-color: rgba(var(--ui-primary-rgbc), 0.05);
		border-radius: 0.375rem;
		border: 1px solid var(--border-color);
		flex: 1;
		min-width: 200px;
	}

	.current-values strong {
		color: var(--text-color);
		font-weight: 600;
		display: block;
		margin-bottom: 0.5rem;
	}

	.current-values p {
		margin: 0.25rem 0;
		color: var(--text-muted);
	}

	.item-card {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
		background-color: rgba(var(--ui-primary-rgbc), 0.05);
		border-radius: 0.375rem;
		border: 1px solid var(--border-color);
	}

	.item-name {
		color: var(--text-color);
		font-weight: 500;
	}

	.item-actions {
		display: flex;
		gap: 0.5rem;
	}

	.custom-options {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
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
	}

	/* Dialog Content Styles */
	.dialog-content {
		padding: 1rem 0;
		overflow-y: auto;
	}

	.info-content,
	.warning-content {
		display: flex;
		gap: 1rem;
		align-items: flex-start;
	}

	.info-content div,
	.warning-content div {
		flex: 1;
	}

	.info-content p,
	.warning-content p {
		margin: 0.25rem 0;
		color: var(--text-color);
	}

	.form-fields {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.download-content {
		display: flex;
		gap: 1.5rem;
		align-items: center;
	}

	.download-info h3 {
		color: var(--text-color);
		font-size: 1.25rem;
		font-weight: 600;
		margin: 0 0 0.5rem 0;
	}

	.download-info p {
		margin: 0.25rem 0;
		color: var(--text-color);
	}

	.full-screen-content {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		height: 100%;
	}

	.full-screen-content h3 {
		color: var(--text-color);
		font-size: 1.5rem;
		font-weight: 600;
		margin: 0;
	}

	.full-screen-demo {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 1.5rem;
		flex: 1;
	}

	.demo-section {
		padding: 1rem;
		background-color: rgba(var(--ui-primary-rgbc), 0.05);
		border-radius: 0.375rem;
		border: 1px solid var(--border-color);
	}

	.demo-section h4 {
		color: var(--text-color);
		font-size: 1.125rem;
		font-weight: 600;
		margin: 0 0 0.5rem 0;
	}

	.demo-section p {
		color: var(--text-color);
		margin: 0;
		line-height: 1.5;
	}

	.custom-dialog-content {
		padding: 1.5rem;
		background: linear-gradient(
			135deg,
			rgba(var(--ui-accent-rgbc), 0.1) 0%,
			rgba(var(--ui-tertiary-rgbc), 0.1) 100%
		);
		border-radius: 0.5rem;
	}

	.custom-dialog-content h3 {
		color: var(--text-color);
		font-size: 1.25rem;
		font-weight: 600;
		margin: 0 0 1rem 0;
	}

	.custom-dialog-content p {
		color: var(--text-color);
		margin: 0 0 1rem 0;
	}

	.custom-card {
		padding: 1rem;
		background-color: rgba(var(--ui-primary-rgbc), 0.1);
		border-radius: 0.375rem;
		border: 1px solid var(--border-color);
	}

	.custom-card p {
		margin: 0;
		color: var(--text-color);
	}

	:global(.dark) .dialog-info,
	:global(.dark) .current-values,
	:global(.dark) .item-card,
	:global(.dark) .action-log,
	:global(.dark) .demo-section {
		background-color: rgba(var(--ui-accent-rgbc), 0.05);
	}

	:global(.dark) .feature-list strong {
		color: var(--ui-accent);
	}

	:global(.dark) .log-entry {
		background-color: rgba(var(--ui-accent-rgbc), 0.1);
	}

	:global(.dark) .custom-card {
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
</style>
