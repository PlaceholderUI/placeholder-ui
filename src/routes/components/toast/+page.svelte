<script lang="ts">
	import Paper from '$lib/display/Paper.svelte';
	import Button from '$lib/ui/Button.svelte';
	import ActionIcon from '$lib/ui/ActionIcon.svelte';
	import Textbox from '$lib/form/Textbox.svelte';
	import TextArea from '$lib/form/TextArea.svelte';
	import Select from '$lib/form/Select.svelte';
	import Checkbox from '$lib/form/Checkbox.svelte';
	import Toaster from '$lib/ui/Toaster.svelte';
	import { 
		iconUser,
		iconEdit,
		iconTrash,
		iconCopy,
		iconDownload,
		iconSearch,
		iconPlus,
		iconCloudUpload,
		iconRefresh
	} from '$lib/icon/index.js';
	import { toast } from '$lib/index.js';

	// Demo state variables
	let customMessage = $state('This is a custom toast message');
	let customDuration = $state('4000');
	let toastPosition = $state('bottom-right');
	let showCloseButton = $state(true);
	let richColorsEnabled = $state(true);

	// Demo data
	let actionLog = $state<string[]>([]);

	function addToLog(message: string) {
		actionLog = [`${new Date().toLocaleTimeString()}: ${message}`, ...actionLog.slice(0, 9)];
	}

	function clearLog() {
		actionLog = [];
	}

	// Position options for toast
	const positionOptions = [
		{ value: 'top-left', label: 'Top Left' },
		{ value: 'top-center', label: 'Top Center' },
		{ value: 'top-right', label: 'Top Right' },
		{ value: 'bottom-left', label: 'Bottom Left' },
		{ value: 'bottom-center', label: 'Bottom Center' },
		{ value: 'bottom-right', label: 'Bottom Right' }
	];

	// Basic toast examples
	function showBasicToast() {
		toast('Hello! This is a basic toast notification.');
		addToLog('Basic toast displayed');
	}

	function showSuccessToast() {
		toast.success('Success! Your changes have been saved.');
		addToLog('Success toast displayed');
	}

	function showErrorToast() {
		toast.error('Error! Something went wrong. Please try again.');
		addToLog('Error toast displayed');
	}

	function showWarningToast() {
		toast.warning('Warning! Please review your inputs before proceeding.');
		addToLog('Warning toast displayed');
	}

	function showInfoToast() {
		toast.info('Info: New features are now available in your dashboard.');
		addToLog('Info toast displayed');
	}

	function showLoadingToast() {
		toast.loading('Loading your data, please wait...');
		addToLog('Loading toast displayed');
		
		// Simulate loading completion
		setTimeout(() => {
			toast.dismiss();
			toast.success('Data loaded successfully!');
		}, 3000);
	}

	// Custom toast with options
	function showCustomToast() {
		toast(customMessage, {
			duration: parseInt(customDuration),
			position: toastPosition,
			closeButton: showCloseButton
		});
		addToLog(`Custom toast displayed: "${customMessage}"`);
	}

	// Promise-based toast
	async function showPromiseToast() {
		const simulateApiCall = new Promise((resolve, reject) => {
			const success = Math.random() > 0.3; // 70% success rate
			setTimeout(() => {
				if (success) {
					resolve({ data: 'User profile updated' });
				} else {
					reject(new Error('Network connection failed'));
				}
			}, 2000);
		});

		toast.promise(simulateApiCall, {
			loading: 'Updating profile...',
			success: (data: any) => `${data.data} successfully!`,
			error: (err: Error) => `Failed: ${err.message}`
		});

		addToLog('Promise toast initiated');
	}

	// Action-specific toasts
	function handleSaveAction() {
		toast.success('Document saved successfully!', {
			duration: 3000,
			action: {
				label: 'View',
				onClick: () => {
					toast.info('Opening document viewer...');
					addToLog('Document viewer opened from toast action');
				}
			}
		});
		addToLog('Save action completed');
	}

	function handleDeleteAction() {
		toast.error('Item deleted permanently', {
			duration: 5000,
			action: {
				label: 'Undo',
				onClick: () => {
					toast.success('Item restored successfully');
					addToLog('Delete action undone');
				}
			}
		});
		addToLog('Delete action completed');
	}

	function handleUploadAction() {
		let uploadToastId: string | number;
		
		// Start with loading toast
		uploadToastId = toast.loading('Uploading files...');
		
		// Simulate upload progress
		setTimeout(() => {
			toast.dismiss(uploadToastId);
			toast.success('3 files uploaded successfully', {
				duration: 4000,
				action: {
					label: 'View Files',
					onClick: () => {
						toast.info('Opening file manager...');
					}
				}
			});
			addToLog('Upload completed successfully');
		}, 2500);
	}

	function handleBatchAction() {
		const items = ['Document 1', 'Image 2', 'Spreadsheet 3'];
		let completed = 0;
		
		const processingToast = toast.loading(`Processing ${items.length} items...`);
		
		items.forEach((item, index) => {
			setTimeout(() => {
				completed++;
				
				if (completed === items.length) {
					toast.dismiss(processingToast);
					toast.success(`All ${items.length} items processed successfully!`);
					addToLog('Batch processing completed');
				} else {
					toast.dismiss(processingToast);
					toast.loading(`Processing... ${completed}/${items.length} completed`);
				}
			}, (index + 1) * 1000);
		});
	}

	// Form validation toasts
	function validateForm() {
		const errors = [];
		
		if (!customMessage.trim()) {
			errors.push('Message is required');
		}
		
		if (parseInt(customDuration) < 1000) {
			errors.push('Duration must be at least 1000ms');
		}
		
		if (errors.length > 0) {
			errors.forEach(error => {
				toast.error(error);
			});
			addToLog(`Form validation failed: ${errors.length} errors`);
		} else {
			toast.success('Form validation passed!');
			addToLog('Form validation successful');
		}
	}

	// Dismiss functions
	function dismissAllToasts() {
		toast.dismiss();
		addToLog('All toasts dismissed');
	}

	function showMultipleToasts() {
		toast.info('First toast notification');
		setTimeout(() => toast.success('Second toast notification'), 500);
		setTimeout(() => toast.warning('Third toast notification'), 1000);
		setTimeout(() => toast.error('Fourth toast notification'), 1500);
		addToLog('Multiple toasts displayed');
	}

	// Complex scenarios
	function simulateWorkflow() {
		toast.info('Starting workflow process...');
		
		setTimeout(() => {
			toast.loading('Validating inputs...');
		}, 1000);
		
		setTimeout(() => {
			toast.dismiss();
			toast.loading('Processing data...');
		}, 2500);
		
		setTimeout(() => {
			toast.dismiss();
			toast.loading('Saving results...');
		}, 4000);
		
		setTimeout(() => {
			toast.dismiss();
			toast.success('Workflow completed successfully!', {
				duration: 6000,
				action: {
					label: 'View Results',
					onClick: () => {
						toast.info('Results dashboard opened');
					}
				}
			});
			addToLog('Workflow process completed');
		}, 5500);
	}
</script>

<!-- Toast container for this page -->
<Toaster />

<div class="page-header">
	<h1>Toast</h1>
	<p>Notification toast component powered by svelte-sonner with rich colors and customizable options.</p>
</div>

<div class="vstack">
	<Paper title="Basic Toast Types">
		<div class="form-grid">
			<div class="toast-section">
				<h4>Standard Notifications</h4>
				<div class="toast-examples">
					<Button onclick={showBasicToast}>
						Basic Toast
					</Button>
					<Button variant="secondary" onclick={showSuccessToast}>
						Success Toast
					</Button>
					<Button variant="danger" onclick={showErrorToast}>
						Error Toast
					</Button>
					<Button variant="secondary" onclick={showWarningToast}>
						Warning Toast
					</Button>
					<Button variant="secondary" onclick={showInfoToast}>
						Info Toast
					</Button>
					<Button variant="secondary" onclick={showLoadingToast}>
						Loading Toast
					</Button>
				</div>
			</div>
			<div class="toast-info">
				<strong>Toast Types:</strong>
				<ul>
					<li><strong>Basic:</strong> Default notification message</li>
					<li><strong>Success:</strong> Positive confirmation messages</li>
					<li><strong>Error:</strong> Error and failure notifications</li>
					<li><strong>Warning:</strong> Cautionary alerts</li>
					<li><strong>Info:</strong> Informational messages</li>
					<li><strong>Loading:</strong> Progress indicators</li>
				</ul>
				<p class="note">All toasts auto-dismiss after 4 seconds by default.</p>
			</div>
		</div>
	</Paper>

	<Paper title="Custom Configuration">
		<div class="config-section">
			<h4>Customizable Options</h4>
			<div class="config-form">
				<div class="config-fields">
					<div class="field-group">
						<Textbox 
							label="Custom Message" 
							bind:value={customMessage}
							placeholder="Enter your toast message"
						/>
					</div>
					<div class="field-row">
						<div class="field-group">
							<Textbox 
								label="Duration (ms)" 
								bind:value={customDuration}
								placeholder="4000"
							/>
						</div>
						<div class="field-group">
							<Select 
								label="Position"
								bind:value={toastPosition}
								options={positionOptions}
							/>
						</div>
					</div>
					<div class="field-options">
						<Checkbox 
							bind:checked={showCloseButton} 
							label="Show close button"
						/>
						<Checkbox 
							bind:checked={richColorsEnabled} 
							label="Enable rich colors"
						/>
					</div>
				</div>
				<div class="config-actions">
					<Button variant="accent" onclick={showCustomToast}>
						Show Custom Toast
					</Button>
					<Button variant="secondary" onclick={validateForm}>
						Validate Form
					</Button>
				</div>
			</div>
		</div>
	</Paper>

	<Paper title="Promise-Based Toasts">
		<div class="promise-section">
			<h4>Async Operation Tracking</h4>
			<div class="promise-demo">
				<div class="promise-description">
					<p>Promise toasts automatically handle loading, success, and error states for async operations.</p>
				</div>
				<div class="promise-actions">
					<Button onclick={showPromiseToast}>
						Simulate API Call
					</Button>
					<Button variant="tertiary" onclick={simulateWorkflow}>
						Multi-Step Workflow
					</Button>
				</div>
			</div>
		</div>
	</Paper>

	<Paper title="Action Toasts">
		<div class="action-section">
			<h4>Interactive Notifications</h4>
			<div class="action-demo">
				<div class="action-grid">
					<div class="action-item">
						<ActionIcon 
							svg={iconEdit} 
							variant="secondary-subtle"
							onclick={handleSaveAction}
						/>
						<span>Save Document</span>
					</div>
					<div class="action-item">
						<ActionIcon 
							svg={iconTrash} 
							variant="danger-subtle"
							onclick={handleDeleteAction}
						/>
						<span>Delete Item</span>
					</div>
					<div class="action-item">
						<ActionIcon 
							svg={iconCloudUpload} 
							variant="tertiary-subtle"
							onclick={handleUploadAction}
						/>
						<span>Upload Files</span>
					</div>
					<div class="action-item">
						<ActionIcon 
							svg={iconRefresh} 
							variant="accent-subtle"
							onclick={handleBatchAction}
						/>
						<span>Batch Process</span>
					</div>
				</div>
				<div class="action-description">
					<p>Action toasts include interactive buttons for quick follow-up actions.</p>
				</div>
			</div>
		</div>
	</Paper>

	<Paper title="Bulk Operations">
		<div class="bulk-section">
			<h4>Multiple Toast Management</h4>
			<div class="bulk-demo">
				<div class="bulk-actions">
					<Button onclick={showMultipleToasts}>
						Show Multiple Toasts
					</Button>
					<Button variant="secondary" onclick={dismissAllToasts}>
						Dismiss All Toasts
					</Button>
				</div>
				<div class="bulk-info">
					<p><strong>Toast Stack:</strong> Multiple toasts stack vertically</p>
					<p><strong>Auto-dismiss:</strong> Each toast has independent timing</p>
					<p><strong>Manual control:</strong> Programmatically dismiss specific or all toasts</p>
				</div>
			</div>
		</div>
	</Paper>

	<Paper title="Real-world Examples">
		<div class="examples-section">
			<h4>Common Use Cases</h4>
			<div class="examples-grid">
				<div class="example-card">
					<h5>Form Submission</h5>
					<p>Save user data with confirmation</p>
					<Button 
						variant="primary" 
						onclick={() => {
							toast.loading('Saving profile...');
							setTimeout(() => {
								toast.dismiss();
								toast.success('Profile updated successfully!');
							}, 1500);
						}}
					>
						Save Profile
					</Button>
				</div>
				
				<div class="example-card">
					<h5>File Operations</h5>
					<p>Copy files with progress tracking</p>
					<Button 
						variant="secondary" 
						svg={iconCopy}
						onclick={() => {
							const copyId = toast.loading('Copying 5 files...');
							setTimeout(() => {
								toast.dismiss(copyId);
								toast.success('Files copied to clipboard');
							}, 2000);
						}}
					>
						Copy Files
					</Button>
				</div>
				
				<div class="example-card">
					<h5>Data Synchronization</h5>
					<p>Sync data with server</p>
					<Button 
						variant="tertiary" 
						svg={iconRefresh}
						onclick={() => {
							const syncPromise = new Promise((resolve) => {
								setTimeout(() => resolve({ synced: 156 }), 2500);
							});
							
							toast.promise(syncPromise, {
								loading: 'Syncing data...',
								success: (data: any) => `Synced ${data.synced} records`,
								error: 'Sync failed'
							});
						}}
					>
						Sync Data
					</Button>
				</div>
				
				<div class="example-card">
					<h5>User Authentication</h5>
					<p>Login with error handling</p>
					<Button 
						variant="accent" 
						svg={iconUser}
						onclick={() => {
							const loginPromise = new Promise((resolve, reject) => {
								setTimeout(() => {
									Math.random() > 0.5 ? resolve({ user: 'John' }) : reject(new Error('Invalid credentials'));
								}, 1500);
							});
							
							toast.promise(loginPromise, {
								loading: 'Signing in...',
								success: 'Welcome back!',
								error: 'Login failed. Please try again.'
							});
						}}
					>
						Sign In
					</Button>
				</div>
			</div>
		</div>
	</Paper>

	<Paper title="Activity Log">
		<div class="log-section">
			<div class="log-header">
				<h4>Toast Activity</h4>
				<Button variant="secondary-subtle" onclick={clearLog}>
					Clear Log
				</Button>
			</div>
			<div class="action-log">
				{#each actionLog as entry}
					<p class="log-entry">{entry}</p>
				{/each}
				{#if actionLog.length === 0}
					<p class="no-actions">No toast activity yet. Try triggering some toasts above!</p>
				{/if}
			</div>
		</div>
	</Paper>

	<Paper title="Features">
		<div class="feature-list">
			<ul>
				<li><strong>Multiple types:</strong> Success, error, warning, info, loading, and custom toasts</li>
				<li><strong>Promise integration:</strong> Automatic loading/success/error states for async operations</li>
				<li><strong>Action buttons:</strong> Interactive buttons within toast notifications</li>
				<li><strong>Custom positioning:</strong> 6 different position options around the screen</li>
				<li><strong>Rich colors:</strong> Enhanced visual styling with theme-aware colors</li>
				<li><strong>Auto-dismiss:</strong> Configurable duration with manual dismiss options</li>
				<li><strong>Stack management:</strong> Multiple toasts stack properly without overlap</li>
				<li><strong>Close buttons:</strong> Optional close buttons for manual dismissal</li>
				<li><strong>Theme integration:</strong> Automatic light/dark mode switching</li>
				<li><strong>Accessibility:</strong> Screen reader friendly with proper ARIA attributes</li>
				<li><strong>Animation:</strong> Smooth slide-in and fade-out animations</li>
				<li><strong>Global control:</strong> Dismiss all toasts or specific toast by ID</li>
				<li><strong>Customizable duration:</strong> Set custom display time for each toast</li>
				<li><strong>Progress tracking:</strong> Loading states for long-running operations</li>
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

	.toast-section h4,
	.config-section h4,
	.promise-section h4,
	.action-section h4,
	.bulk-section h4,
	.examples-section h4,
	.log-section h4 {
		color: var(--text-color);
		font-size: 1.125rem;
		font-weight: 600;
		margin: 0 0 1rem 0;
	}

	.toast-examples {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.toast-info {
		padding: 1rem;
		background-color: rgba(var(--ui-primary-rgbc), 0.05);
		border-radius: 0.375rem;
		border: 1px solid var(--border-color);
	}

	.toast-info strong {
		color: var(--text-color);
		font-weight: 600;
		display: block;
		margin-bottom: 0.5rem;
	}

	.toast-info ul {
		margin: 0.5rem 0;
		padding-left: 1.5rem;
		color: var(--text-color);
	}

	.toast-info li {
		margin-bottom: 0.5rem;
		font-size: 0.875rem;
	}

	.config-form {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.config-fields {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.field-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		flex: 1;
	}

	.field-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}

	.field-options {
		display: flex;
		gap: 2rem;
		flex-wrap: wrap;
	}

	.config-actions {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.promise-demo {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.promise-description p {
		color: var(--text-muted);
		margin: 0;
		font-style: italic;
	}

	.promise-actions {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.action-demo {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.action-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1rem;
	}

	.action-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		padding: 1rem;
		border: 1px solid var(--border-color);
		border-radius: 0.375rem;
		background-color: rgba(var(--ui-primary-rgbc), 0.02);
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.action-item:hover {
		background-color: rgba(var(--ui-primary-rgbc), 0.05);
	}

	.action-item span {
		font-size: 0.875rem;
		color: var(--text-color);
		text-align: center;
	}

	.action-description p {
		color: var(--text-muted);
		margin: 0;
		font-style: italic;
		text-align: center;
	}

	.bulk-demo {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.bulk-actions {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.bulk-info {
		padding: 1rem;
		background-color: rgba(var(--ui-primary-rgbc), 0.05);
		border-radius: 0.375rem;
		border: 1px solid var(--border-color);
	}

	.bulk-info p {
		margin: 0.5rem 0;
		color: var(--text-color);
		font-size: 0.875rem;
	}

	.examples-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 1rem;
	}

	.example-card {
		padding: 1.5rem;
		border: 1px solid var(--border-color);
		border-radius: 0.375rem;
		background-color: rgba(var(--ui-primary-rgbc), 0.02);
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.example-card h5 {
		color: var(--text-color);
		font-weight: 600;
		margin: 0;
		font-size: 1rem;
	}

	.example-card p {
		color: var(--text-muted);
		margin: 0;
		font-size: 0.875rem;
		flex: 1;
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

	/* Button variant styles for demonstration */
	:global(.pui-button.success) {
		--button-bg-color: var(--success-bg);
		--button-text-color: white;
		--button-hover-bg-color: var(--success-bg-hover);
	}

	:global(.pui-button.warning) {
		--button-bg-color: #f59e0b;
		--button-text-color: white;
		--button-hover-bg-color: #d97706;
	}

	:global(.dark) .toast-info,
	:global(.dark) .bulk-info,
	:global(.dark) .action-log {
		background-color: rgba(var(--ui-accent-rgbc), 0.05);
	}

	:global(.dark) .feature-list strong {
		color: var(--ui-accent);
	}

	:global(.dark) .log-entry {
		background-color: rgba(var(--ui-accent-rgbc), 0.1);
	}

	:global(.dark) .action-item {
		background-color: rgba(var(--ui-accent-rgbc), 0.02);
	}

	:global(.dark) .action-item:hover {
		background-color: rgba(var(--ui-accent-rgbc), 0.05);
	}

	:global(.dark) .example-card {
		background-color: rgba(var(--ui-accent-rgbc), 0.02);
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
		.field-row {
			grid-template-columns: 1fr;
		}
		
		.examples-grid {
			grid-template-columns: 1fr;
		}
		
		.action-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}
</style>