<script lang="ts">
	import Paper from '$lib/display/Paper.svelte';
	import Loader from '$lib/ui/Loader.svelte';
	import Button from '$lib/ui/Button.svelte';
	import ActionIcon from '$lib/ui/ActionIcon.svelte';
	import { iconRefresh, iconDownload, iconCloudUpload, iconPlus } from '$lib/icon/index.js';

	// Loader state variables
	let showBasicLoader = false;
	let showFullScreenLoader = false;
	let showButtonLoader = false;
	let showCardLoader = false;
	let showDataLoader = false;

	// Demo data
	let loadingStates = {
		saving: false,
		downloading: false,
		uploading: false,
		refreshing: false,
		processing: false
	};

	let actionLog: string[] = [];

	function addToLog(message: string) {
		actionLog = [`${new Date().toLocaleTimeString()}: ${message}`, ...actionLog.slice(0, 4)];
	}

	function clearLog() {
		actionLog = [];
	}

	// Simulate async operations
	async function simulateAsyncOperation(
		operationType: keyof typeof loadingStates,
		duration: number = 2000
	) {
		loadingStates[operationType] = true;
		addToLog(`Started ${operationType}...`);

		await new Promise((resolve) => setTimeout(resolve, duration));

		loadingStates[operationType] = false;
		addToLog(`Completed ${operationType}`);
	}

	function toggleBasicLoader() {
		showBasicLoader = !showBasicLoader;
		if (showBasicLoader) {
			setTimeout(() => (showBasicLoader = false), 3000);
		}
	}

	function toggleFullScreenLoader() {
		showFullScreenLoader = !showFullScreenLoader;
		if (showFullScreenLoader) {
			setTimeout(() => (showFullScreenLoader = false), 3000);
		}
	}

	function toggleButtonLoader() {
		showButtonLoader = !showButtonLoader;
		if (showButtonLoader) {
			setTimeout(() => (showButtonLoader = false), 2000);
		}
	}

	function toggleCardLoader() {
		showCardLoader = !showCardLoader;
		if (showCardLoader) {
			setTimeout(() => (showCardLoader = false), 2500);
		}
	}

	function toggleDataLoader() {
		showDataLoader = !showDataLoader;
		if (showDataLoader) {
			setTimeout(() => (showDataLoader = false), 4000);
		}
	}

	// Mock data for demonstration
	const mockUsers = [
		{ id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active' },
		{ id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Pending' },
		{ id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'Active' },
		{ id: 4, name: 'Alice Brown', email: 'alice@example.com', status: 'Inactive' }
	];
</script>

<div class="page-header">
	<h1>Loader</h1>
	<p>Animated loading indicator component with multiple display modes and size options.</p>
</div>

<div class="vstack">
	<Paper title="Basic Usage">
		<div class="form-grid">
			<div class="loader-section">
				<h4>Simple Loaders</h4>
				<div class="loader-examples">
					<div class="loader-demo">
						<Loader sizeOverride="24px" class="text-brand-primary" />
						<span>Small (24px)</span>
					</div>
					<div class="loader-demo">
						<Loader sizeOverride="32px" class="text-brand-tertiary" />
						<span>Medium (32px)</span>
					</div>
					<div class="loader-demo">
						<Loader sizeOverride="48px" class="text-brand-accent" />
						<span>Large (48px)</span>
					</div>
					<div class="loader-demo">
						<Loader sizeOverride="64px" class="text-danger" />
						<span>Extra Large (64px)</span>
					</div>
				</div>
			</div>
			<div class="loader-info">
				<strong>Loader Sizes:</strong>
				<p>The loader component accepts any size value.</p>
				<p>Colors adapt automatically to theme and can be customized with CSS classes.</p>
				<p class="note">Loaders use smooth CSS animations with a 2-second rotation cycle.</p>
			</div>
		</div>
	</Paper>

	<Paper title="Interactive Loaders">
		<div class="interactive-section">
			<h4>Toggleable Loading States</h4>
			<div class="interactive-grid">
				<div class="interactive-demo">
					<div class="demo-controls">
						<Button onclick={toggleBasicLoader} disabled={showBasicLoader}>
							Toggle Basic Loader
						</Button>
						{#if showBasicLoader}
							<div class="inline-loader">
								<Loader sizeOverride="20px" class="text-brand-primary" />
								<span>Loading...</span>
							</div>
						{/if}
					</div>
				</div>

				<div class="interactive-demo">
					<div class="demo-controls">
						<Button variant="secondary" onclick={toggleButtonLoader}>
							{#if showButtonLoader}
								<Loader sizeOverride="18px" class="text-white" />
								Loading...
							{:else}
								Button with Loader
							{/if}
						</Button>
					</div>
				</div>

				<div class="interactive-demo">
					<div class="demo-controls">
						<Button variant="accent" onclick={toggleCardLoader}>Toggle Card Loader</Button>
					</div>
					<div class="loader-card" class:loading={showCardLoader}>
						{#if showCardLoader}
							<Loader fullScreen={true} sizeOverride="32px" />
						{/if}
						<h5>Sample Card</h5>
						<p>This card shows a full-screen overlay loader when activated.</p>
						<div class="card-actions">
							<Button variant="secondary-subtle">Action 1</Button>
							<Button variant="secondary-subtle">Action 2</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</Paper>

	<Paper title="Async Operations">
		<div class="async-section">
			<h4>Real-world Loading Examples</h4>
			<div class="async-grid">
				<div class="async-demo">
					<Button
						variant="primary"
						disabled={loadingStates.saving}
						onclick={() => simulateAsyncOperation('saving')}
					>
						{#if loadingStates.saving}
							<Loader sizeOverride="16px" class="text-white" />
							Saving...
						{:else}
							Save Document
						{/if}
					</Button>
				</div>

				<div class="async-demo">
					<Button
						variant="tertiary"
						svg={iconDownload}
						disabled={loadingStates.downloading}
						onclick={() => simulateAsyncOperation('downloading')}
					>
						{#if loadingStates.downloading}
							<Loader sizeOverride="16px" class="text-white" />
							Downloading...
						{:else}
							Download File
						{/if}
					</Button>
				</div>

				<div class="async-demo">
					{#if loadingStates.uploading}
						<div class="icon-loader">
							<Loader sizeOverride="20px" class="text-brand-accent" />
						</div>
					{:else}
						<ActionIcon
							svg={iconCloudUpload}
							variant="accent-subtle"
							onclick={() => simulateAsyncOperation('uploading', 3000)}
						/>
					{/if}
					<span>{loadingStates.uploading ? 'Uploading...' : 'Upload'}</span>
				</div>

				<div class="async-demo">
					{#if loadingStates.refreshing}
						<div class="icon-loader">
							<Loader sizeOverride="20px" class="text-brand-primary" />
						</div>
					{:else}
						<ActionIcon
							svg={iconRefresh}
							variant="secondary-subtle"
							onclick={() => simulateAsyncOperation('refreshing', 1500)}
						/>
					{/if}
					<span>{loadingStates.refreshing ? 'Refreshing...' : 'Refresh Data'}</span>
				</div>
			</div>
		</div>
	</Paper>

	<Paper title="Full Screen Loader">
		<div class="fullscreen-section">
			<h4>Overlay Loading State</h4>
			<div class="fullscreen-demo">
				<div class="demo-area" class:loading={showFullScreenLoader}>
					{#if showFullScreenLoader}
						<Loader fullScreen={true} sizeOverride="48px" />
					{/if}
					<div class="demo-content">
						<h5>Content Area</h5>
						<p>This area will be covered by a full-screen loader overlay when activated.</p>
						<p>The overlay includes a semi-transparent background and centered spinner.</p>
						<div class="demo-buttons">
							<Button onclick={toggleFullScreenLoader} disabled={showFullScreenLoader}>
								{showFullScreenLoader ? 'Loading...' : 'Show Full Screen Loader'}
							</Button>
							<Button variant="secondary">Secondary Action</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</Paper>

	<Paper title="Data Loading Example">
		<div class="data-section">
			<h4>Table with Loading State</h4>
			<div class="data-demo">
				<div class="table-controls">
					<Button variant="accent-outline" onclick={toggleDataLoader} disabled={showDataLoader}>
						{showDataLoader ? 'Loading Data...' : 'Reload Table'}
					</Button>
				</div>
				<div class="data-table" class:loading={showDataLoader}>
					{#if showDataLoader}
						<Loader fullScreen={true} sizeOverride="32px" />
					{/if}
					<table>
						<thead>
							<tr>
								<th>Name</th>
								<th>Email</th>
								<th>Status</th>
							</tr>
						</thead>
						<tbody>
							{#each mockUsers as user}
								<tr>
									<td>{user.name}</td>
									<td>{user.email}</td>
									<td>
										<span class="status {user.status.toLowerCase()}">
											{user.status}
										</span>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</Paper>

	<Paper title="Loading States">
		<div class="states-section">
			<h4>Current Loading States</h4>
			<div class="states-grid">
				{#each Object.entries(loadingStates) as [key, isLoading]}
					<div class="state-item" class:active={isLoading}>
						{#if isLoading}
							<Loader sizeOverride="16px" class="text-brand-tertiary" />
						{:else}
							<span class="state-dot"></span>
						{/if}
						<span>{key}: {isLoading ? 'Loading' : 'Idle'}</span>
					</div>
				{/each}
			</div>
		</div>
	</Paper>

	<Paper title="Action Log">
		<div class="log-section">
			<div class="log-header">
				<h4>Loading Activity</h4>
				<Button variant="secondary-subtle" onclick={clearLog}>Clear Log</Button>
			</div>
			<div class="action-log">
				{#each actionLog as entry}
					<p class="log-entry">{entry}</p>
				{/each}
				{#if actionLog.length === 0}
					<p class="no-actions">No loading activities yet. Try the examples above!</p>
				{/if}
			</div>
		</div>
	</Paper>

	<Paper title="Features">
		<div class="feature-list">
			<ul>
				<li>
					<strong>Customizable sizes:</strong> Any size value supported with sizeOverride prop
				</li>
				<li><strong>Full-screen overlay:</strong> Built-in overlay mode with backdrop</li>
				<li><strong>Smooth animation:</strong> CSS-based rotation with 2-second cycle</li>
				<li><strong>Theme integration:</strong> Colors adapt to light/dark mode</li>
				<li><strong>Custom styling:</strong> Accepts CSS classes for color customization</li>
				<li><strong>Button integration:</strong> Works seamlessly within buttons</li>
				<li><strong>Overlay positioning:</strong> Absolute positioning for full-screen mode</li>
				<li><strong>Performance optimized:</strong> CSS animations with transform property</li>
				<li><strong>Accessibility friendly:</strong> Proper contrast and visibility</li>
				<li><strong>Flexible usage:</strong> Inline, button, card, and full-screen modes</li>
				<li><strong>Z-index management:</strong> Proper layering for overlays</li>
				<li><strong>Responsive design:</strong> Works across all screen sizes</li>
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

	.loader-section h4,
	.interactive-section h4,
	.async-section h4,
	.fullscreen-section h4,
	.data-section h4,
	.states-section h4,
	.log-section h4 {
		color: var(--text-color);
		font-size: 1.125rem;
		font-weight: 600;
		margin: 0 0 1rem 0;
	}

	.loader-examples {
		display: flex;
		gap: 2rem;
		flex-wrap: wrap;
		align-items: center;
	}

	.loader-demo {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		padding: 1rem;
		border: 1px solid var(--border-color);
		border-radius: 0.375rem;
		min-width: 100px;
	}

	.loader-demo span {
		font-size: 0.875rem;
		color: var(--text-muted);
		text-align: center;
	}

	.loader-info {
		padding: 1rem;
		background-color: rgba(var(--ui-primary-rgbc), 0.05);
		border-radius: 0.375rem;
		border: 1px solid var(--border-color);
	}

	.loader-info strong {
		color: var(--text-color);
		font-weight: 600;
		display: block;
		margin-bottom: 0.5rem;
	}

	.loader-info p {
		margin: 0.25rem 0;
		color: var(--text-muted);
	}

	.interactive-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 1.5rem;
	}

	.interactive-demo {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.demo-controls {
		display: flex;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.inline-loader {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--text-color);
		font-size: 0.875rem;
	}

	.loader-card {
		position: relative;
		padding: 1rem;
		border: 1px solid var(--border-color);
		border-radius: 0.375rem;
		background-color: var(--paper-body-bg);
		min-height: 150px;
	}

	.loader-card h5 {
		color: var(--text-color);
		font-weight: 600;
		margin: 0 0 0.5rem 0;
	}

	.loader-card p {
		color: var(--text-muted);
		margin: 0 0 1rem 0;
		font-size: 0.875rem;
	}

	.card-actions {
		display: flex;
		gap: 0.5rem;
	}

	.async-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1.5rem;
	}

	.async-demo {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		padding: 1rem;
		border: 1px solid var(--border-color);
		border-radius: 0.375rem;
	}

	.async-demo span {
		font-size: 0.875rem;
		color: var(--text-color);
		text-align: center;
	}

	.icon-loader {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
	}

	.demo-area {
		position: relative;
		padding: 2rem;
		border: 2px dashed var(--border-color);
		border-radius: 0.5rem;
		background-color: rgba(var(--ui-primary-rgbc), 0.02);
		min-height: 200px;
	}

	.demo-area.loading {
		pointer-events: none;
	}

	.demo-content h5 {
		color: var(--text-color);
		font-weight: 600;
		margin: 0 0 1rem 0;
	}

	.demo-content p {
		color: var(--text-muted);
		margin: 0 0 1rem 0;
		line-height: 1.5;
	}

	.demo-buttons {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.data-demo {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.table-controls {
		display: flex;
		justify-content: flex-end;
	}

	.data-table {
		position: relative;
		border-radius: 0.375rem;
		border: 1px solid var(--border-color);
		overflow: hidden;
	}

	.data-table.loading {
		pointer-events: none;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		background-color: var(--paper-body-bg);
	}

	th,
	td {
		padding: 0.75rem;
		text-align: left;
		border-bottom: 1px solid var(--border-color);
	}

	th {
		background-color: rgba(var(--ui-primary-rgbc), 0.05);
		font-weight: 600;
		color: var(--text-color);
	}

	td {
		color: var(--text-color);
	}

	.status {
		padding: 0.25rem 0.5rem;
		border-radius: 0.25rem;
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
	}

	.status.active {
		background-color: var(--success-bg-subtle);
		color: var(--success-text);
	}

	.status.pending {
		background-color: rgba(var(--ui-tertiary-rgbc), 0.2);
		color: var(--ui-tertiary);
	}

	.status.inactive {
		background-color: var(--danger-bg-subtle);
		color: var(--danger-text);
	}

	.states-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		gap: 1rem;
	}

	.state-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem;
		border: 1px solid var(--border-color);
		border-radius: 0.375rem;
		transition: all 0.2s;
	}

	.state-item.active {
		background-color: rgba(var(--ui-tertiary-rgbc), 0.1);
		border-color: var(--ui-tertiary);
	}

	.state-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background-color: var(--text-muted);
	}

	.state-item span {
		font-size: 0.875rem;
		color: var(--text-color);
		font-family: monospace;
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

	:global(.dark) .loader-info,
	:global(.dark) .demo-area,
	:global(.dark) .action-log {
		background-color: rgba(var(--ui-accent-rgbc), 0.05);
	}

	:global(.dark) .feature-list strong {
		color: var(--ui-accent);
	}

	:global(.dark) .log-entry {
		background-color: rgba(var(--ui-accent-rgbc), 0.1);
	}

	:global(.dark) th {
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
</style>
