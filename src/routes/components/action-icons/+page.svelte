<script lang="ts">
	import Paper from '$lib/display/Paper.svelte';
	import ActionIcon from '$lib/ui/ActionIcon.svelte';
	import { 
		iconPlus, 
		iconTrash, 
		iconEdit, 
		iconSearch, 
		iconDownload, 
		iconCloudUpload,
		iconRefresh,
		iconCopy,
		iconX,
		iconCheck,
		iconUser,
		iconMail,
		iconPhone,
		iconHamburger,
		iconChevronLeft,
		iconChevronRight,
		iconChevronUp,
		iconChevronDown,
		iconInfoCircle,
		iconAlertTriangle
	} from '$lib/icon/index.js';

	let clickCount = 0;
	let lastAction = '';
	let isLoading = false;
	let actionLog: string[] = [];

	function handleAction(action: string) {
		clickCount++;
		lastAction = action;
		addToLog(`${action} clicked`);
		console.log(`ActionIcon clicked: ${action}`);
	}

	function handleAsyncAction(action: string) {
		isLoading = true;
		addToLog(`${action} started (loading...)`);
		
		setTimeout(() => {
			isLoading = false;
			addToLog(`${action} completed`);
		}, 2000);
	}

	function addToLog(message: string) {
		actionLog = [`${new Date().toLocaleTimeString()}: ${message}`, ...actionLog.slice(0, 4)];
	}

	function clearLog() {
		actionLog = [];
		clickCount = 0;
		lastAction = '';
	}
</script>

<div class="page-header">
	<h1>Action Icons</h1>
	<p>Compact icon buttons for actions and interactions with multiple variants and sizes.</p>
</div>

<div class="vstack">
	<Paper title="Basic Usage">
		<div class="form-grid">
			<div class="icon-section">
				<h4>Common Actions</h4>
				<div class="icon-grid">
					<ActionIcon 
						svg={iconPlus} 
						onclick={() => handleAction('Add')}
					/>
					<ActionIcon 
						svg={iconEdit} 
						onclick={() => handleAction('Edit')}
					/>
					<ActionIcon 
						svg={iconTrash} 
						onclick={() => handleAction('Delete')}
					/>
					<ActionIcon 
						svg={iconSearch} 
						onclick={() => handleAction('Search')}
					/>
					<ActionIcon 
						svg={iconDownload} 
						onclick={() => handleAction('Download')}
					/>
					<ActionIcon 
						svg={iconRefresh} 
						onclick={() => handleAction('Refresh')}
					/>
				</div>
			</div>
			<div class="icon-info">
				<strong>Action Feedback:</strong>
				<p>Total Clicks: {clickCount}</p>
				<p>Last Action: {lastAction || 'None'}</p>
				<p class="note">Click any icon above to see the interaction feedback.</p>
			</div>
		</div>
	</Paper>

	<Paper title="Variants">
		<div class="variant-showcase">
			<div class="variant-group">
				<h4>Default & Subtle Variants</h4>
				<div class="icon-row">
					<div class="icon-example">
						<ActionIcon tooltip="Test" svg={iconPlus} variant="auto-subtle" />
						<span>auto-subtle</span>
					</div>
					<div class="icon-example">
						<ActionIcon svg={iconPlus} variant="secondary" />
						<span>secondary</span>
					</div>
					<div class="icon-example">
						<ActionIcon svg={iconPlus} variant="secondary-subtle" />
						<span>secondary-subtle</span>
					</div>
				</div>
			</div>

			<div class="variant-group">
				<h4>Color Variants</h4>
				<div class="icon-row">
					<div class="icon-example">
						<ActionIcon svg={iconPlus} variant="accent" />
						<span>accent</span>
					</div>
					<div class="icon-example">
						<ActionIcon svg={iconPlus} variant="accent-outline" />
						<span>accent-outline</span>
					</div>
					<div class="icon-example">
						<ActionIcon svg={iconPlus} variant="accent-subtle" />
						<span>accent-subtle</span>
					</div>
				</div>
				<div class="icon-row">
					<div class="icon-example">
						<ActionIcon svg={iconPlus} variant="primary" />
						<span>primary</span>
					</div>
					<div class="icon-example">
						<ActionIcon svg={iconPlus} variant="primary-outline" />
						<span>primary-outline</span>
					</div>
					<div class="icon-example">
						<ActionIcon svg={iconPlus} variant="primary-subtle" />
						<span>primary-subtle</span>
					</div>
				</div>
				<div class="icon-row">
					<div class="icon-example">
						<ActionIcon svg={iconPlus} variant="tertiary" />
						<span>tertiary</span>
					</div>
					<div class="icon-example">
						<ActionIcon svg={iconPlus} variant="tertiary-subtle" />
						<span>tertiary-subtle</span>
					</div>
				</div>
			</div>

			<div class="variant-group">
				<h4>Special Variants</h4>
				<div class="icon-row">
					<div class="icon-example">
						<ActionIcon svg={iconTrash} variant="danger" />
						<span>danger</span>
					</div>
					<div class="icon-example">
						<ActionIcon svg={iconTrash} variant="danger-subtle" />
						<span>danger-subtle</span>
					</div>
					<div class="icon-example">
						<ActionIcon svg={iconPlus} variant="white" />
						<span>white</span>
					</div>
				</div>
			</div>
		</div>
	</Paper>

	<Paper title="Sizes">
		<div class="size-showcase">
			<h4>Different Sizes</h4>
			<div class="size-row">
				<div class="size-example">
					<ActionIcon svg={iconEdit} size="16px" />
					<span>16px</span>
				</div>
				<div class="size-example">
					<ActionIcon svg={iconEdit} size="20px" />
					<span>20px (default)</span>
				</div>
				<div class="size-example">
					<ActionIcon svg={iconEdit} size="24px" />
					<span>24px</span>
				</div>
				<div class="size-example">
					<ActionIcon svg={iconEdit} size="28px" />
					<span>28px</span>
				</div>
				<div class="size-example">
					<ActionIcon svg={iconEdit} size="32px" />
					<span>32px</span>
				</div>
			</div>
		</div>
	</Paper>

	<Paper title="States">
		<div class="form-grid">
			<div class="state-section">
				<h4>Interactive States</h4>
				<div class="state-grid">
					<div class="state-example">
						<ActionIcon svg={iconCheck} variant="accent" />
						<span>Normal</span>
					</div>
					<div class="state-example">
						<ActionIcon svg={iconX} variant="danger" disabled={true} />
						<span>Disabled</span>
					</div>
					<div class="state-example">
						<ActionIcon 
							svg={iconCloudUpload} 
							variant="secondary" 
							loading={isLoading}
							onclick={() => handleAsyncAction('Upload')}
						/>
						<span>Loading ({isLoading ? 'active' : 'click to test'})</span>
					</div>
				</div>
			</div>
			<div class="state-info">
				<strong>State Information:</strong>
				<p>Loading State: {isLoading ? 'Active' : 'Inactive'}</p>
				<p>Click the upload icon to see the loading state in action.</p>
				<p class="note">Disabled icons cannot be clicked and have reduced opacity.</p>
			</div>
		</div>
	</Paper>

	<Paper title="Navigation & UI Examples">
		<div class="navigation-examples">
			<div class="nav-example">
				<h4>Navigation Controls</h4>
				<div class="nav-controls">
					<ActionIcon svg={iconChevronLeft} variant="secondary-subtle" />
					<span>Page 1 of 5</span>
					<ActionIcon svg={iconChevronRight} variant="secondary-subtle" />
				</div>
			</div>

			<div class="toolbar-example">
				<h4>Toolbar Actions</h4>
				<div class="toolbar">
					<ActionIcon svg={iconCopy} variant="auto-subtle" onclick={() => handleAction('Copy')} />
					<ActionIcon svg={iconDownload} variant="auto-subtle" onclick={() => handleAction('Download')} />
					<ActionIcon svg={iconEdit} variant="auto-subtle" onclick={() => handleAction('Edit')} />
					<ActionIcon svg={iconTrash} variant="danger-subtle" onclick={() => handleAction('Delete')} />
				</div>
			</div>

			<div class="contact-example">
				<h4>Contact Actions</h4>
				<div class="contact-actions">
					<ActionIcon svg={iconMail} variant="primary-subtle" onclick={() => handleAction('Email')} />
					<ActionIcon svg={iconPhone} variant="accent-subtle" onclick={() => handleAction('Call')} />
					<ActionIcon svg={iconUser} variant="tertiary-subtle" onclick={() => handleAction('Profile')} />
				</div>
			</div>
		</div>
	</Paper>

	<Paper title="Interactive Demo">
		<div class="demo-section">
			<h4>Action Log Demo</h4>
			<div class="demo-controls">
				<ActionIcon 
					svg={iconPlus} 
					variant="accent" 
					onclick={() => handleAction('Create Item')}
				/>
				<ActionIcon 
					svg={iconEdit} 
					variant="primary" 
					onclick={() => handleAction('Edit Item')}
				/>
				<ActionIcon 
					svg={iconCopy} 
					variant="tertiary" 
					onclick={() => handleAction('Copy Item')}
				/>
				<ActionIcon 
					svg={iconTrash} 
					variant="danger" 
					onclick={() => handleAction('Delete Item')}
				/>
				<ActionIcon 
					svg={iconX} 
					variant="secondary" 
					onclick={clearLog}
				/>
			</div>
			<div class="action-log">
				<strong>Recent Actions:</strong>
				{#each actionLog as entry}
					<p class="log-entry">{entry}</p>
				{/each}
				{#if actionLog.length === 0}
					<p class="no-actions">No actions yet. Click an icon above!</p>
				{/if}
			</div>
		</div>
	</Paper>

	<Paper title="Features">
		<div class="feature-list">
			<ul>
				<li><strong>Multiple variants:</strong> 16 different visual styles and colors</li>
				<li><strong>Size flexibility:</strong> Any size from 12px to 48px and beyond</li>
				<li><strong>Theme integration:</strong> Works with primary, accent, and tertiary themes</li>
				<li><strong>Interactive states:</strong> Hover, active, disabled, and loading states</li>
				<li><strong>Press animation:</strong> Subtle translateY effect on click</li>
				<li><strong>Built-in Button:</strong> Inherits all Button component functionality</li>
				<li><strong>Link support:</strong> Can function as links with href prop</li>
				<li><strong>Event handling:</strong> Standard onclick event support</li>
				<li><strong>Accessibility:</strong> Full keyboard and screen reader support</li>
				<li><strong>Icon scaling:</strong> Automatically scales SVG icons to match size</li>
				<li><strong>Input integration:</strong> Special inputButton styling for form inputs</li>
				<li><strong>Loading states:</strong> Built-in spinner for async operations</li>
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

	.icon-section h4,
	.variant-group h4,
	.size-showcase h4,
	.state-section h4,
	.nav-example h4,
	.toolbar-example h4,
	.contact-example h4,
	.demo-section h4 {
		color: var(--text-color);
		font-size: 1.125rem;
		font-weight: 600;
		margin: 0 0 1rem 0;
	}

	.icon-info,
	.state-info {
		padding: 1rem;
		background-color: rgba(var(--ui-primary-rgbc), 0.05);
		border-radius: 0.375rem;
		border: 1px solid var(--border-color);
	}

	.icon-info strong,
	.state-info strong {
		color: var(--text-color);
		font-weight: 600;
		display: block;
		margin-bottom: 0.5rem;
	}

	.icon-info p,
	.state-info p {
		margin: 0.25rem 0;
		color: var(--text-muted);
	}

	.variant-showcase {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.variant-group {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.icon-row {
		display: flex;
		flex-wrap: wrap;
		gap: 1.5rem;
		align-items: center;
	}

	.icon-example {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}

	.icon-example span {
		font-size: 0.75rem;
		color: var(--text-muted);
		text-align: center;
	}

	.size-showcase {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.size-row {
		display: flex;
		flex-wrap: wrap;
		gap: 2rem;
		align-items: center;
	}

	.size-example {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}

	.size-example span {
		font-size: 0.75rem;
		color: var(--text-muted);
		text-align: center;
	}

	.state-section {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.state-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(8rem, 1fr));
		gap: 1rem;
	}

	.state-example {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		padding: 1rem;
		border: 1px solid var(--border-color);
		border-radius: 0.375rem;
	}

	.state-example span {
		font-size: 0.75rem;
		color: var(--text-muted);
		text-align: center;
	}

	.navigation-examples {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.nav-controls {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.nav-controls span {
		color: var(--text-color);
		font-weight: 500;
	}

	.toolbar {
		display: flex;
		gap: 0.5rem;
		padding: 0.5rem;
		background-color: rgba(var(--ui-primary-rgbc), 0.05);
		border-radius: 0.375rem;
		border: 1px solid var(--border-color);
		width: fit-content;
	}

	.contact-actions {
		display: flex;
		gap: 1rem;
	}

	.demo-section {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.demo-controls {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.action-log {
		padding: 1rem;
		background-color: rgba(var(--ui-primary-rgbc), 0.05);
		border-radius: 0.375rem;
		border: 1px solid var(--border-color);
		min-height: 150px;
	}

	.action-log strong {
		color: var(--text-color);
		font-weight: 600;
		display: block;
		margin-bottom: 0.5rem;
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

	:global(.dark) .icon-info,
	:global(.dark) .state-info,
	:global(.dark) .toolbar,
	:global(.dark) .action-log {
		background-color: rgba(var(--ui-accent-rgbc), 0.05);
	}

	:global(.dark) .feature-list strong {
		color: var(--ui-accent);
	}

	:global(.dark) .log-entry {
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