<script lang="ts">
	import Paper from '$lib/display/Paper.svelte';
	import Tooltip from '$lib/ui/Tooltip.svelte';
	import Button from '$lib/ui/Button.svelte';
	import ActionIcon from '$lib/ui/ActionIcon.svelte';
	import Badge from '$lib/ui/Badge.svelte';
	import Dialog from '$lib/ui/Dialog.svelte';
	import {
		iconUser,
		iconEdit,
		iconTrash,
		iconCopy,
		iconDownload,
		iconSearch,
		iconPlus,
		iconHelp,
		iconInfoCircle
	} from '$lib/icon/index.js';

	// Dialog state
	let tooltipDialog = $state(false);

	// Demo data
	let actionLog = $state<string[]>([]);

	function addToLog(message: string) {
		actionLog = [`${new Date().toLocaleTimeString()}: ${message}`, ...actionLog.slice(0, 9)];
	}

	function clearLog() {
		actionLog = [];
	}

	// Sample data for demonstrations
	const userStats = {
		totalUsers: 1247,
		activeUsers: 892,
		newSignups: 156,
		retention: 94.2
	};

	const productInfo = {
		name: 'Advanced Analytics Dashboard',
		version: '2.1.3',
		lastUpdate: '2024-01-15',
		license: 'Enterprise'
	};

	function handleTooltipAction(action: string) {
		addToLog(`${action} tooltip interaction`);
	}

	// Live-content demo: the tooltip has to re-anchor itself as this grows/shrinks
	const growingLines = [
		'One line.',
		'One line.\nA second line appears.',
		'One line.\nA second line appears.\nAnd a third, much longer line to widen the box.',
		'Back to one line.'
	];
	let growingStep = $state(0);
	let growingTimer: ReturnType<typeof setInterval> | null = null;

	const growingText = $derived(growingLines[growingStep % growingLines.length]);

	function startGrowing(isOpen: boolean) {
		if (isOpen) {
			growingTimer ??= setInterval(() => growingStep++, 900);
		} else if (growingTimer) {
			clearInterval(growingTimer);
			growingTimer = null;
			growingStep = 0;
		}
	}

	$effect(() => {
		return () => startGrowing(false);
	});

	// Manually resized content, so the change can be triggered without hovering off
	let extraDetail = $state(false);
</script>

<div class="page-header">
	<h1>Tooltip</h1>
	<p>
		Advanced tooltip with HTML/snippet support, smart boundary detection, and extensive
		customization options.
	</p>
</div>

<div class="vstack">
	<Paper title="Basic Usage">
		<div class="form-grid">
			<div class="tooltip-section">
				<h4>Simple Text Tooltips</h4>
				<div class="tooltip-examples">
					<div class="tooltip-demo">
						<Tooltip text="This is a basic tooltip">
							<Button>Hover for Tooltip</Button>
						</Tooltip>
					</div>

					<div class="tooltip-demo">
						<Tooltip text="Click to copy this text to clipboard" location="right">
							<Button variant="secondary" svg={iconCopy}>Copy Text</Button>
						</Tooltip>
					</div>

					<div class="tooltip-demo">
						<Tooltip text="Delete this item permanently" location="bottom">
							<ActionIcon svg={iconTrash} variant="danger-subtle" />
						</Tooltip>
					</div>

					<div class="tooltip-demo">
						<Tooltip text="Search through all available items" location="left">
							<ActionIcon svg={iconSearch} variant="secondary-subtle" />
						</Tooltip>
					</div>
				</div>
			</div>
			<div class="tooltip-info">
				<strong>Tooltip Positions:</strong>
				<ul>
					<li><code>top</code> - Above the element (default)</li>
					<li><code>right</code> - To the right of element</li>
					<li><code>bottom</code> - Below the element</li>
					<li><code>left</code> - To the left of element</li>
					<li>Plus <code>-start</code> and <code>-end</code> variants for fine positioning</li>
				</ul>
				<p class="note">
					Tooltips automatically flip and shift position to stay within viewport bounds.
				</p>
			</div>
		</div>
	</Paper>

	<Paper title="Positioning Examples">
		<div class="positioning-section">
			<h4>Tooltip Placement Options</h4>
			<div class="positioning-grid">
				<div class="position-demo">
					<span class="position-label">Top</span>
					<Tooltip text="Tooltip positioned at the top" location="top">
						<Button>Top Tooltip</Button>
					</Tooltip>
				</div>

				<div class="position-demo">
					<span class="position-label">Right</span>
					<Tooltip text="Tooltip positioned to the right" location="right">
						<Button>Right Tooltip</Button>
					</Tooltip>
				</div>

				<div class="position-demo">
					<span class="position-label">Bottom</span>
					<Tooltip text="Tooltip positioned at the bottom" location="bottom">
						<Button>Bottom Tooltip</Button>
					</Tooltip>
				</div>

				<div class="position-demo">
					<span class="position-label">Left</span>
					<Tooltip text="Tooltip positioned to the left" location="left">
						<Button>Left Tooltip</Button>
					</Tooltip>
				</div>
			</div>
		</div>
	</Paper>

	<Paper title="HTML Content">
		<div class="html-section">
			<h4>HTML-Based Tooltips</h4>
			<div class="html-examples">
				<div class="html-demo">
					<Tooltip
						html="<strong>Bold text</strong> and <em>italic text</em><br/>Line breaks work too!"
					>
						<Button variant="secondary">HTML Tooltip</Button>
					</Tooltip>
				</div>

				<div class="html-demo">
					<Tooltip
						html="<p>Formatted paragraph</p><ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>"
						maxWidth="250px"
					>
						<Button variant="tertiary">List Content</Button>
					</Tooltip>
				</div>

				<div class="html-demo">
					<Tooltip html="Use <code>code</code> inline!" location="right">
						<Button variant="accent-outline">Code Example</Button>
					</Tooltip>
				</div>

				<div class="html-demo">
					<Tooltip
						html="<p><strong>Warning:</strong> This action cannot be undone!</p>"
						location="top"
					>
						<Button variant="danger">Delete</Button>
					</Tooltip>
				</div>
			</div>
		</div>
	</Paper>

	<Paper title="Custom Content">
		<div class="content-section">
			<h4>Rich Tooltip Content (Svelte Snippets)</h4>
			<div class="content-examples">
				<div class="content-demo">
					<Tooltip location="top" maxWidth="250px">
						{#snippet tooltipContent()}
							<div class="rich-tooltip">
								<h6>User Profile</h6>
								<p><strong>Name:</strong> John Doe</p>
								<p><strong>Role:</strong> Administrator</p>
								<p><strong>Last Login:</strong> 2 hours ago</p>
							</div>
						{/snippet}
						<Button variant="primary" svg={iconUser}>View Profile</Button>
					</Tooltip>
				</div>

				<div class="content-demo">
					<Tooltip location="right" maxWidth="300px">
						{#snippet tooltipContent()}
							<div class="stats-tooltip">
								<h6>Analytics Summary</h6>
								<div class="stats-grid">
									<div class="stat-item">
										<span class="stat-value">{userStats.totalUsers}</span>
										<span class="stat-label">Total Users</span>
									</div>
									<div class="stat-item">
										<span class="stat-value">{userStats.activeUsers}</span>
										<span class="stat-label">Active</span>
									</div>
									<div class="stat-item">
										<span class="stat-value">{userStats.newSignups}</span>
										<span class="stat-label">New</span>
									</div>
									<div class="stat-item">
										<span class="stat-value">{userStats.retention}%</span>
										<span class="stat-label">Retention</span>
									</div>
								</div>
							</div>
						{/snippet}
						<Badge variant="tertiary">Analytics</Badge>
					</Tooltip>
				</div>

				<div class="content-demo">
					<Tooltip location="bottom" maxWidth="280px">
						{#snippet tooltipContent()}
							<div class="product-tooltip">
								<h6>{productInfo.name}</h6>
								<div class="product-details">
									<p><strong>Version:</strong> {productInfo.version}</p>
									<p><strong>Updated:</strong> {productInfo.lastUpdate}</p>
									<p><strong>License:</strong> {productInfo.license}</p>
								</div>
								<div class="tooltip-actions">
									<button class="tooltip-btn" onclick={() => handleTooltipAction('Download')}>
										Download
									</button>
									<button class="tooltip-btn" onclick={() => handleTooltipAction('Details')}>
										Details
									</button>
								</div>
							</div>
						{/snippet}
						<ActionIcon svg={iconInfoCircle} variant="secondary-subtle" />
					</Tooltip>
				</div>
			</div>
		</div>
	</Paper>

	<Paper title="Changing Content">
		<div class="content-section">
			<h4>Tooltips That Resize While Open</h4>
			<p class="section-description">
				A tooltip has to re-anchor itself whenever its content changes size — otherwise it stays at
				coordinates measured against a box that no longer exists. Keep hovering and watch it stay
				attached to the trigger.
			</p>
			<div class="content-examples">
				<div class="content-demo">
					<Tooltip location="top" maxWidth="260px" onOpen={startGrowing}>
						{#snippet tooltipContent()}
							<div class="growing-tooltip">
								{#each growingText.split('\n') as line}
									<p>{line}</p>
								{/each}
							</div>
						{/snippet}
						<Button variant="primary">Auto-Resizing (Top)</Button>
					</Tooltip>
				</div>

				<div class="content-demo">
					<Tooltip location="right" maxWidth="260px" onOpen={startGrowing}>
						{#snippet tooltipContent()}
							<div class="growing-tooltip">
								{#each growingText.split('\n') as line}
									<p>{line}</p>
								{/each}
							</div>
						{/snippet}
						<Button variant="tertiary">Auto-Resizing (Right)</Button>
					</Tooltip>
				</div>

				<div class="content-demo">
					<Tooltip location="bottom" maxWidth="260px">
						{#snippet tooltipContent()}
							<div class="growing-tooltip">
								<p><strong>Toggle the switch below</strong>, then hover here.</p>
								{#if extraDetail}
									<p>
										This extra paragraph makes the tooltip considerably taller and wider than it was
										a moment ago.
									</p>
									<ul>
										<li>Extra detail one</li>
										<li>Extra detail two</li>
									</ul>
								{/if}
							</div>
						{/snippet}
						<Button variant="secondary">Toggleable Content</Button>
					</Tooltip>
				</div>
			</div>
			<div class="toggle-row">
				<Button variant="accent-outline" onclick={() => (extraDetail = !extraDetail)}>
					{extraDetail ? 'Remove extra detail' : 'Add extra detail'}
				</Button>
			</div>
		</div>
	</Paper>

	<Paper title="Form Field Tooltips">
		<div class="form-section">
			<h4>Input Field Help</h4>
			<div class="form-demo">
				<div class="field-group">
					<label for="username">Username</label>
					<div class="field-with-tooltip">
						<input id="username" type="text" placeholder="Enter username" />
						<Tooltip
							text="Username must be 3-20 characters long and contain only letters, numbers, and underscores"
							location="right"
						>
							<ActionIcon svg={iconHelp} variant="secondary-subtle" />
						</Tooltip>
					</div>
				</div>

				<div class="field-group">
					<label for="email">Email Address</label>
					<div class="field-with-tooltip">
						<input id="email" type="email" placeholder="Enter email address" />
						<Tooltip
							text="We'll never share your email address with third parties"
							location="right"
						>
							<ActionIcon svg={iconInfoCircle} variant="secondary-subtle" />
						</Tooltip>
					</div>
				</div>

				<div class="field-group">
					<label for="password">Password</label>
					<div class="field-with-tooltip">
						<input id="password" type="password" placeholder="Enter password" />
						<Tooltip location="right" maxWidth="220px">
							{#snippet tooltipContent()}
								<div class="password-tooltip">
									<h6>Password Requirements</h6>
									<ul>
										<li>At least 8 characters long</li>
										<li>Include uppercase and lowercase letters</li>
										<li>Include at least one number</li>
										<li>Include at least one special character</li>
									</ul>
								</div>
							{/snippet}
							<ActionIcon svg={iconHelp} variant="secondary-subtle" />
						</Tooltip>
					</div>
				</div>
			</div>
		</div>
	</Paper>

	<Paper title="Action Tooltips">
		<div class="action-section">
			<h4>Interface Actions</h4>
			<div class="action-toolbar">
				<div class="toolbar-group">
					<Tooltip text="Create new document">
						<ActionIcon
							svg={iconPlus}
							variant="primary-subtle"
							onclick={() => handleTooltipAction('Create')}
						/>
					</Tooltip>
					<Tooltip text="Edit selected item">
						<ActionIcon
							svg={iconEdit}
							variant="secondary-subtle"
							onclick={() => handleTooltipAction('Edit')}
						/>
					</Tooltip>
					<Tooltip text="Copy to clipboard">
						<ActionIcon
							svg={iconCopy}
							variant="secondary-subtle"
							onclick={() => handleTooltipAction('Copy')}
						/>
					</Tooltip>
					<Tooltip text="Download selected files">
						<ActionIcon
							svg={iconDownload}
							variant="tertiary-subtle"
							onclick={() => handleTooltipAction('Download')}
						/>
					</Tooltip>
					<Tooltip text="Delete permanently (cannot be undone)" location="bottom">
						<ActionIcon
							svg={iconTrash}
							variant="danger-subtle"
							onclick={() => handleTooltipAction('Delete')}
						/>
					</Tooltip>
				</div>

				<div class="toolbar-info">
					<p>Hover over each action icon to see its tooltip description.</p>
					<p class="muted">Tooltips help users understand interface actions before clicking.</p>
				</div>
			</div>
		</div>
	</Paper>

	<Paper title="Configuration Options">
		<div class="config-section">
			<h4>Customization Features</h4>
			<div class="config-examples">
				<div class="config-demo">
					<span class="config-label">Custom Width</span>
					<Tooltip
						text="This tooltip has a custom max-width of 150px"
						location="top"
						maxWidth="150px"
					>
						<Button>150px Width</Button>
					</Tooltip>
				</div>

				<div class="config-demo">
					<span class="config-label">No Arrow</span>
					<Tooltip text="This tooltip has no arrow!" location="top" showArrow={false}>
						<Button variant="secondary">No Arrow</Button>
					</Tooltip>
				</div>

				<div class="config-demo">
					<span class="config-label">Delayed</span>
					<Tooltip text="This tooltip has a 500ms delay" location="top" delay={500}>
						<Button variant="accent">500ms Delay</Button>
					</Tooltip>
				</div>

				<div class="config-demo">
					<span class="config-label">Disabled</span>
					<Tooltip text="This won't show" location="top" disabled={true}>
						<Button variant="danger">Disabled Tooltip</Button>
					</Tooltip>
				</div>

				<div class="config-demo">
					<span class="config-label">Large Offset</span>
					<Tooltip text="20px offset from element" location="top" offsetDistance={20}>
						<Button variant="tertiary">20px Offset</Button>
					</Tooltip>
				</div>
			</div>
		</div>
	</Paper>

	<Paper title="Interactive Demo">
		<div class="interactive-section">
			<h4>Tooltip Interactions</h4>
			<div class="demo-area">
				<div class="demo-buttons">
					<Tooltip text="Primary action button with confirmation">
						<Button onclick={() => handleTooltipAction('Primary Action')}>Primary Action</Button>
					</Tooltip>

					<Tooltip location="top" maxWidth="200px">
						{#snippet tooltipContent()}
							<div class="interactive-tooltip">
								<p><strong>Secondary Action</strong></p>
								<p>This action requires confirmation and may take a few moments to complete.</p>
							</div>
						{/snippet}
						<Button variant="secondary" onclick={() => handleTooltipAction('Secondary Action')}>
							Secondary Action
						</Button>
					</Tooltip>

					<Tooltip text="Dangerous action - use with caution" location="left">
						<Button variant="danger" onclick={() => handleTooltipAction('Danger Action')}>
							Danger Action
						</Button>
					</Tooltip>
				</div>

				<div class="demo-badges">
					<Tooltip text="Current project status">
						<Badge variant="auto-outline">Active</Badge>
					</Tooltip>
					<Tooltip text="Number of pending reviews">
						<Badge variant="auto-outline">3 Pending</Badge>
					</Tooltip>
					<Tooltip text="Critical issues requiring attention">
						<Badge variant="danger">2 Issues</Badge>
					</Tooltip>
				</div>
			</div>
		</div>
	</Paper>

	<Paper title="Tooltips in Dialog">
		<div class="dialog-section">
			<h4>Modal Dialog Positioning</h4>
			<p class="section-description">
				Test that tooltips position correctly inside modal dialogs. Dialogs use the browser's
				top-layer and CSS transforms, which can affect tooltip positioning.
			</p>
			<div class="dialog-demo">
				<Button variant="primary" onclick={() => (tooltipDialog = true)}>
					Open Dialog with Tooltips
				</Button>
			</div>
		</div>
	</Paper>

	<Paper title="Activity Log">
		<div class="log-section">
			<div class="log-header">
				<h4>Tooltip Interactions</h4>
				<Button variant="secondary-subtle" onclick={clearLog}>Clear Log</Button>
			</div>
			<div class="action-log">
				{#each actionLog as entry}
					<p class="log-entry">{entry}</p>
				{/each}
				{#if actionLog.length === 0}
					<p class="no-actions">
						No tooltip interactions yet. Try hovering and clicking elements above!
					</p>
				{/if}
			</div>
		</div>
	</Paper>

	<Paper title="Features">
		<div class="feature-list">
			<ul>
				<li>
					<strong>Smart positioning:</strong> Automatically flips and shifts position to stay within viewport
				</li>
				<li>
					<strong>12 placement options:</strong> Top, right, bottom, left with -start and -end variants
				</li>
				<li><strong>HTML content:</strong> Support for rich HTML content via html prop</li>
				<li><strong>Svelte snippets:</strong> Full Svelte component support via content snippet</li>
				<li>
					<strong>Text tooltips:</strong> Simple string-based tooltips for quick implementation
				</li>
				<li>
					<strong>Arrow indicators:</strong> Optional visual arrow pointing to trigger element
				</li>
				<li><strong>Fade animations:</strong> Smooth fade in/out transitions</li>
				<li><strong>Hover interactions:</strong> Shows on hover, hides on mouse leave</li>
				<li><strong>Configurable delay:</strong> Optional delay before showing tooltip</li>
				<li><strong>Dismiss handling:</strong> Automatic dismissal with escape key</li>
				<li><strong>Max width control:</strong> Customizable maximum width for content</li>
				<li><strong>Offset distance:</strong> Adjustable spacing from trigger element</li>
				<li><strong>Disable option:</strong> Programmatically disable tooltip display</li>
				<li><strong>Open callbacks:</strong> onOpen callback for state tracking</li>
				<li><strong>Theme integration:</strong> Full light/dark mode support</li>
				<li><strong>Accessibility:</strong> Proper ARIA roles and attributes</li>
				<li>
					<strong>Live re-anchoring:</strong> Re-measures on content resize, scroll and viewport changes
				</li>
				<li><strong>Boundary detection:</strong> Flips and shifts to stay within the viewport</li>
				<li><strong>Z-index management:</strong> Proper layering above other content</li>
				<li><strong>Responsive design:</strong> Works across all screen sizes</li>
			</ul>
		</div>
	</Paper>
</div>

<!-- Tooltip Test Dialog -->
<Dialog bind:show={tooltipDialog} title="Tooltips in Modal">
	<div class="dialog-content">
		<p class="tooltip-test-intro">
			Hover over the elements below to test tooltip positioning inside a modal dialog.
		</p>

		<div class="tooltip-test-grid">
			<div class="tooltip-test-item">
				<span>Top tooltip:</span>
				<Tooltip text="This tooltip appears at the top" location="top">
					<Button>Hover me</Button>
				</Tooltip>
			</div>

			<div class="tooltip-test-item">
				<span>Right tooltip:</span>
				<Tooltip text="This tooltip appears to the right" location="right">
					<Button variant="secondary">Hover me</Button>
				</Tooltip>
			</div>

			<div class="tooltip-test-item">
				<span>Bottom tooltip:</span>
				<Tooltip text="This tooltip appears at the bottom" location="bottom">
					<Button variant="tertiary">Hover me</Button>
				</Tooltip>
			</div>

			<div class="tooltip-test-item">
				<span>Left tooltip:</span>
				<Tooltip text="This tooltip appears to the left" location="left">
					<Button variant="accent">Hover me</Button>
				</Tooltip>
			</div>
		</div>

		<div class="tooltip-test-actions">
			<span>Action icons with tooltips:</span>
			<div class="action-icons-row">
				<Tooltip text="Edit this item">
					<ActionIcon svg={iconEdit} variant="secondary-subtle" />
				</Tooltip>
				<Tooltip text="Download file">
					<ActionIcon svg={iconDownload} variant="tertiary-subtle" />
				</Tooltip>
				<Tooltip text="Get help" location="bottom">
					<ActionIcon svg={iconHelp} variant="primary-subtle" />
				</Tooltip>
				<Tooltip text="Delete permanently" location="bottom">
					<ActionIcon svg={iconTrash} variant="danger-subtle" />
				</Tooltip>
			</div>
		</div>

		<div class="tooltip-test-rich">
			<span>Rich tooltip content:</span>
			<Tooltip location="right" maxWidth="250px">
				{#snippet tooltipContent()}
					<div class="rich-tooltip-content">
						<strong>Rich Content Example</strong>
						<p>Tooltips can contain formatted content with multiple lines.</p>
						<ul>
							<li>List item one</li>
							<li>List item two</li>
						</ul>
					</div>
				{/snippet}
				<ActionIcon svg={iconInfoCircle} variant="primary-subtle" />
			</Tooltip>
		</div>
	</div>
	{#snippet footer()}
		<Button variant="secondary" onclick={() => (tooltipDialog = false)}>Close</Button>
	{/snippet}
</Dialog>

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

	.tooltip-section h4,
	.positioning-section h4,
	.html-section h4,
	.content-section h4,
	.form-section h4,
	.action-section h4,
	.config-section h4,
	.interactive-section h4,
	.log-section h4 {
		color: var(--text-color);
		font-size: 1.125rem;
		font-weight: 600;
		margin: 0 0 1rem 0;
	}

	.tooltip-examples,
	.html-examples {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
		align-items: center;
	}

	.tooltip-demo,
	.html-demo {
		display: flex;
		align-items: center;
	}

	.tooltip-info {
		padding: 1rem;
		background-color: rgba(var(--ui-primary-rgbc), 0.05);
		border-radius: 0.375rem;
		border: 1px solid var(--border-color);
	}

	.tooltip-info strong {
		color: var(--text-color);
		font-weight: 600;
		display: block;
		margin-bottom: 0.5rem;
	}

	.tooltip-info ul {
		margin: 0.5rem 0;
		padding-left: 1.5rem;
		color: var(--text-color);
	}

	.tooltip-info li {
		margin-bottom: 0.25rem;
		font-size: 0.875rem;
	}

	.tooltip-info code {
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

	.content-examples {
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

	.config-examples {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 2rem;
		padding: 1rem;
	}

	.config-demo {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}

	.config-label {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-muted);
	}

	.form-demo {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		max-width: 400px;
	}

	.field-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.field-group label {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-color);
	}

	.field-with-tooltip {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.field-with-tooltip input {
		flex: 1;
		padding: 0.5rem;
		border: 1px solid var(--border-color);
		border-radius: 0.375rem;
		background-color: var(--input-bg);
		color: var(--text-color);
		font-size: 0.875rem;
	}

	.field-with-tooltip input:focus {
		outline: none;
		border-color: var(--ui-primary);
	}

	.action-toolbar {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.toolbar-group {
		display: flex;
		gap: 0.5rem;
		padding: 1rem;
		background-color: rgba(var(--ui-primary-rgbc), 0.05);
		border-radius: 0.375rem;
		border: 1px solid var(--border-color);
	}

	.toolbar-info {
		padding: 1rem;
		background-color: rgba(var(--ui-primary-rgbc), 0.02);
		border-radius: 0.375rem;
		border: 1px dashed var(--border-color);
	}

	.toolbar-info p {
		margin: 0.25rem 0;
		color: var(--text-color);
		font-size: 0.875rem;
	}

	.demo-area {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		padding: 1rem;
	}

	.demo-buttons {
		display: flex;
		gap: 1rem;
		justify-content: center;
		flex-wrap: wrap;
	}

	.demo-badges {
		display: flex;
		gap: 1rem;
		justify-content: center;
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

	.muted {
		color: var(--text-muted) !important;
		font-style: italic;
	}

	/* Custom tooltip content styles */
	:global(.rich-tooltip) {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	:global(.rich-tooltip h6) {
		color: inherit;
		font-weight: 600;
		margin: 0;
		font-size: 0.875rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.2);
		padding-bottom: 0.25rem;
	}

	:global(.rich-tooltip p) {
		color: inherit;
		margin: 0;
		font-size: 0.75rem;
		line-height: 1.4;
	}

	:global(.stats-tooltip) {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	:global(.stats-tooltip h6) {
		color: inherit;
		font-weight: 600;
		margin: 0;
		font-size: 0.875rem;
		text-align: center;
	}

	:global(.stats-grid) {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.75rem;
	}

	:global(.stat-item) {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
	}

	:global(.stat-value) {
		font-weight: 700;
		font-size: 1rem;
		color: inherit;
	}

	:global(.stat-label) {
		font-size: 0.625rem;
		color: inherit;
		opacity: 0.8;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	:global(.product-tooltip) {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	:global(.product-tooltip h6) {
		color: inherit;
		font-weight: 600;
		margin: 0;
		font-size: 0.875rem;
	}

	:global(.product-details) {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	:global(.product-details p) {
		color: inherit;
		margin: 0;
		font-size: 0.75rem;
	}

	:global(.tooltip-actions) {
		display: flex;
		gap: 0.5rem;
		justify-content: center;
	}

	:global(.tooltip-btn) {
		background: var(--ui-primary);
		color: white;
		border: none;
		padding: 0.25rem 0.75rem;
		border-radius: 0.25rem;
		font-size: 0.75rem;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	:global(.tooltip-btn:hover) {
		background: rgba(var(--ui-primary-rgbc), 0.8);
	}

	:global(.password-tooltip) {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	:global(.password-tooltip h6) {
		color: inherit;
		font-weight: 600;
		margin: 0;
		font-size: 0.875rem;
	}

	:global(.password-tooltip ul) {
		margin: 0;
		padding-left: 1rem;
		color: inherit;
	}

	:global(.password-tooltip li) {
		font-size: 0.75rem;
		line-height: 1.4;
		margin-bottom: 0.25rem;
	}

	.toggle-row {
		display: flex;
		justify-content: center;
		padding-top: 0.5rem;
	}

	:global(.growing-tooltip) {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	:global(.growing-tooltip p) {
		color: inherit;
		margin: 0;
		font-size: 0.75rem;
		line-height: 1.4;
	}

	:global(.growing-tooltip ul) {
		margin: 0;
		padding-left: 1rem;
		font-size: 0.75rem;
	}

	:global(.interactive-tooltip) {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	:global(.interactive-tooltip p) {
		color: inherit;
		margin: 0;
		font-size: 0.75rem;
		line-height: 1.4;
	}

	:global(.dark) .tooltip-info,
	:global(.dark) .toolbar-group,
	:global(.dark) .toolbar-info,
	:global(.dark) .action-log {
		background-color: rgba(var(--ui-accent-rgbc), 0.05);
	}

	:global(.dark) .feature-list strong {
		color: var(--ui-accent);
	}

	:global(.dark) .log-entry {
		background-color: rgba(var(--ui-accent-rgbc), 0.1);
	}

	:global(.dark) .tooltip-info code {
		background-color: rgba(var(--ui-accent-rgbc), 0.1);
	}

	:global(.dark) .field-with-tooltip input:focus {
		border-color: var(--ui-accent);
	}

	:global(.dark .tooltip-btn) {
		background: var(--ui-accent);
		color: var(--ui-primary);
	}

	:global(.dark .tooltip-btn:hover) {
		background: rgba(var(--ui-accent-rgbc), 0.8);
	}

	/* Dialog section styles */
	.dialog-section {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.dialog-section h4 {
		color: var(--text-color);
		font-size: 1.125rem;
		font-weight: 600;
		margin: 0;
	}

	.section-description {
		color: var(--text-muted);
		margin: 0;
		font-size: 0.875rem;
	}

	.dialog-demo {
		display: flex;
		gap: 1rem;
	}

	.dialog-content {
		padding: 1rem 0;
	}

	.tooltip-test-intro {
		color: var(--text-muted);
		margin: 0 0 1rem 0;
	}

	.tooltip-test-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	.tooltip-test-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		padding: 1rem;
		background-color: rgba(var(--ui-primary-rgbc), 0.05);
		border-radius: 0.375rem;
	}

	.tooltip-test-item span {
		font-size: 0.875rem;
		color: var(--text-muted);
	}

	.tooltip-test-actions {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem;
		background-color: rgba(var(--ui-primary-rgbc), 0.05);
		border-radius: 0.375rem;
		margin-bottom: 1rem;
	}

	.tooltip-test-actions span {
		font-size: 0.875rem;
		color: var(--text-muted);
	}

	.action-icons-row {
		display: flex;
		gap: 0.5rem;
	}

	.tooltip-test-rich {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		padding: 1rem;
		background-color: rgba(var(--ui-primary-rgbc), 0.05);
		border-radius: 0.375rem;
	}

	.tooltip-test-rich span {
		font-size: 0.875rem;
		color: var(--text-muted);
	}

	:global(.rich-tooltip-content) {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	:global(.rich-tooltip-content strong) {
		font-size: 0.875rem;
	}

	:global(.rich-tooltip-content p) {
		margin: 0;
		font-size: 0.75rem;
	}

	:global(.rich-tooltip-content ul) {
		margin: 0;
		padding-left: 1rem;
		font-size: 0.75rem;
	}

	:global(.dark) .tooltip-test-item,
	:global(.dark) .tooltip-test-actions,
	:global(.dark) .tooltip-test-rich {
		background-color: rgba(var(--ui-accent-rgbc), 0.05);
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

		.content-examples {
			flex-direction: column;
			gap: 1rem;
		}

		.demo-buttons,
		.demo-badges {
			flex-direction: column;
			align-items: center;
		}

		.config-examples {
			grid-template-columns: 1fr;
		}
	}
</style>
