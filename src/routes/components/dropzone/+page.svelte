<script lang="ts">
	import Paper from '$lib/display/Paper.svelte';
	import Dropzone from '$lib/ui/Dropzone.svelte';
	import Button from '$lib/ui/Button.svelte';
	import ActionIcon from '$lib/ui/ActionIcon.svelte';
	import Badge from '$lib/ui/Badge.svelte';
	import Checkbox from '$lib/form/Checkbox.svelte';
	import Select from '$lib/form/Select.svelte';
	import { toast } from '$lib/ui/Toast.svelte';
	import {
		iconCloudUpload,
		iconTrash,
		iconDownload,
		iconFile,
		iconPhoto,
		iconRefresh
	} from '$lib/icon/index.js';

	// State management
	let uploadedFiles = $state<File[]>([]);
	let imageFiles = $state<File[]>([]);
	let documentFiles = $state<File[]>([]);
	let multipleFiles = $state<File[]>([]);

	// Configuration options
	let allowMultiple = $state(false);
	let showProgress = $state(false);
	let acceptedTypes = $state('*/*');

	// Loading states
	let basicLoading = $state(false);
	let imageLoading = $state(false);
	let documentLoading = $state(false);
	let multipleLoading = $state(false);

	// Demo data
	let actionLog = $state<string[]>([]);
	let uploadProgress = $state(0);

	// File type options
	const fileTypeOptions = [
		{ value: '*/*', label: 'All Files' },
		{ value: 'image/*', label: 'Images Only' },
		{ value: '.pdf,.doc,.docx,.txt', label: 'Documents' },
		{ value: '.jpg,.jpeg,.png,.gif,.webp', label: 'Image Files' },
		{ value: '.mp4,.mov,.avi,.mkv', label: 'Video Files' },
		{ value: '.mp3,.wav,.flac,.m4a', label: 'Audio Files' }
	];

	function addToLog(message: string) {
		actionLog = [`${new Date().toLocaleTimeString()}: ${message}`, ...actionLog.slice(0, 9)];
	}

	function clearLog() {
		actionLog = [];
	}

	// File handling functions
	function handleBasicUpload(files: File[]) {
		addToLog(`Basic upload: ${files.length} file(s) selected`);
		basicLoading = true;

		// Simulate upload process
		setTimeout(() => {
			uploadedFiles = [...uploadedFiles, ...files];
			basicLoading = false;
			toast.success(`Successfully uploaded ${files.length} file(s)`);
			addToLog(`Basic upload completed: ${files.map((f) => f.name).join(', ')}`);
		}, 2000);
	}

	// Invalid file types are filtered out by the Dropzone itself (accept prop) —
	// the onReject callback receives whatever was filtered.
	function handleRejected(files: File[]) {
		toast.error(`${files.length} file(s) rejected by validation`);
		addToLog(`Rejected files: ${files.map((f) => f.name).join(', ')}`);
	}

	function handleImageUpload(files: File[]) {
		addToLog(`Image upload: ${files.length} file(s) selected`);
		imageLoading = true;
		setTimeout(() => {
			imageFiles = [...imageFiles, ...files];
			imageLoading = false;
			toast.success(`${files.length} image(s) uploaded successfully`);
			addToLog(`Image upload completed: ${files.map((f) => f.name).join(', ')}`);
		}, 1500);
	}

	function handleDocumentUpload(files: File[]) {
		addToLog(`Document upload: ${files.length} file(s) selected`);
		documentLoading = true;
		setTimeout(() => {
			documentFiles = [...documentFiles, ...files];
			documentLoading = false;
			toast.success(`${files.length} document(s) uploaded successfully`);
			addToLog(`Document upload completed: ${files.map((f) => f.name).join(', ')}`);
		}, 2500);
	}

	function handleMultipleUpload(files: File[]) {
		addToLog(`Multiple upload: ${files.length} file(s) selected`);
		multipleLoading = true;

		if (showProgress) {
			uploadProgress = 0;
			const progressInterval = setInterval(() => {
				uploadProgress += Math.random() * 20;
				if (uploadProgress >= 100) {
					uploadProgress = 100;
					clearInterval(progressInterval);
					setTimeout(() => {
						multipleFiles = [...multipleFiles, ...files];
						multipleLoading = false;
						uploadProgress = 0;
						toast.success(`All ${files.length} file(s) uploaded successfully`);
						addToLog(`Multiple upload completed: ${files.map((f) => f.name).join(', ')}`);
					}, 500);
				}
			}, 200);
		} else {
			setTimeout(() => {
				multipleFiles = [...multipleFiles, ...files];
				multipleLoading = false;
				toast.success(`${files.length} file(s) uploaded successfully`);
				addToLog(`Multiple upload completed: ${files.map((f) => f.name).join(', ')}`);
			}, 2000);
		}
	}

	function handleCustomUpload(files: File[]) {
		addToLog(`Custom upload: ${files.length} file(s) with type filter: ${acceptedTypes}`);
		toast.success(`${files.length} file(s) accepted for upload`);
		addToLog(`Custom upload completed: ${files.map((f) => f.name).join(', ')}`);
	}

	// Utility functions
	function formatFileSize(bytes: number): string {
		if (bytes === 0) return '0 Bytes';
		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
	}

	function getFileIcon(fileName: string): string {
		const ext = fileName.toLowerCase().split('.').pop() || '';
		if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) return iconPhoto;
		if (['pdf', 'doc', 'docx', 'txt', 'rtf'].includes(ext)) return iconFile;
		return iconFile;
	}

	function removeFile(fileList: File[], index: number, listName: string) {
		const fileName = fileList[index].name;

		if (listName === 'basic') {
			uploadedFiles = uploadedFiles.filter((_, i) => i !== index);
		} else if (listName === 'image') {
			imageFiles = imageFiles.filter((_, i) => i !== index);
		} else if (listName === 'document') {
			documentFiles = documentFiles.filter((_, i) => i !== index);
		} else if (listName === 'multiple') {
			multipleFiles = multipleFiles.filter((_, i) => i !== index);
		}

		toast.info(`Removed: ${fileName}`);
		addToLog(`File removed: ${fileName} from ${listName} list`);
	}

	function clearAllFiles() {
		const totalFiles =
			uploadedFiles.length + imageFiles.length + documentFiles.length + multipleFiles.length;
		uploadedFiles = [];
		imageFiles = [];
		documentFiles = [];
		multipleFiles = [];
		toast.success(`Cleared ${totalFiles} file(s)`);
		addToLog(`All files cleared (${totalFiles} total)`);
	}

	function downloadFile(file: File) {
		// Create a download link for the file
		const url = URL.createObjectURL(file);
		const a = document.createElement('a');
		a.href = url;
		a.download = file.name;
		a.click();
		URL.revokeObjectURL(url);

		toast.success(`Downloaded: ${file.name}`);
		addToLog(`File downloaded: ${file.name}`);
	}

	// Simulate batch operations
	function processBatch() {
		const allFiles = [...uploadedFiles, ...imageFiles, ...documentFiles, ...multipleFiles];
		if (allFiles.length === 0) {
			toast.warning('No files to process');
			return;
		}

		toast.loading(`Processing ${allFiles.length} file(s)...`);
		addToLog(`Batch processing started: ${allFiles.length} files`);

		setTimeout(() => {
			toast.dismiss();
			toast.success(`Batch processing completed for ${allFiles.length} file(s)`);
			addToLog(`Batch processing completed successfully`);
		}, 3000);
	}
</script>

<div class="page-header">
	<h1>Dropzone</h1>
	<p>
		File upload component with drag-and-drop support, file type validation, and progress tracking.
	</p>
</div>

<div class="vstack">
	<Paper title="Basic Usage">
		<div class="form-grid">
			<div class="dropzone-section">
				<h4>Simple File Upload</h4>
				<div class="upload-demo">
					<Dropzone loading={basicLoading} onFileSubmit={handleBasicUpload} />
					{#if uploadedFiles.length > 0}
						<div class="file-list">
							<h6>Uploaded Files ({uploadedFiles.length})</h6>
							{#each uploadedFiles as file, index}
								<div class="file-item">
									<ActionIcon svg={getFileIcon(file.name)} variant="secondary-subtle" />
									<div class="file-info">
										<span class="file-name">{file.name}</span>
										<span class="file-size">{formatFileSize(file.size)}</span>
									</div>
									<div class="file-actions">
										<ActionIcon
											svg={iconDownload}
											variant="tertiary-subtle"
											onclick={() => downloadFile(file)}
										/>
										<ActionIcon
											svg={iconTrash}
											variant="danger-subtle"
											onclick={() => removeFile(uploadedFiles, index, 'basic')}
										/>
									</div>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			</div>
			<div class="dropzone-info">
				<strong>Basic Features:</strong>
				<ul>
					<li>Click to browse files</li>
					<li>Drag and drop support</li>
					<li>Visual feedback on hover</li>
					<li>Loading state indicator</li>
					<li>Theme-aware styling</li>
				</ul>
				<p class="note">Accepts all file types by default.</p>
			</div>
		</div>
	</Paper>

	<Paper title="File Type Restrictions">
		<div class="restriction-section">
			<h4>Image Upload Only</h4>
			<div class="restriction-demo">
				<Dropzone
					loading={imageLoading}
					onFileSubmit={handleImageUpload}
					onReject={handleRejected}
					accept="image/*"
				/>
				{#if imageFiles.length > 0}
					<div class="image-grid">
						{#each imageFiles as file, index}
							<div class="image-item">
								<div class="image-preview">
									<img src={URL.createObjectURL(file)} alt={file.name} />
									<div class="image-overlay">
										<ActionIcon
											svg={iconTrash}
											variant="danger-subtle"
											onclick={() => removeFile(imageFiles, index, 'image')}
										/>
									</div>
								</div>
								<div class="image-details">
									<span class="image-name">{file.name}</span>
									<span class="image-size">{formatFileSize(file.size)}</span>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</div>

			<h4>Document Upload Only</h4>
			<div class="restriction-demo">
				<Dropzone
					loading={documentLoading}
					onFileSubmit={handleDocumentUpload}
					onReject={handleRejected}
					accept=".pdf,.doc,.docx,.txt"
				/>
				{#if documentFiles.length > 0}
					<div class="document-list">
						{#each documentFiles as file, index}
							<div class="document-item">
								<ActionIcon svg={iconFile} variant="primary-subtle" />
								<div class="document-info">
									<span class="document-name">{file.name}</span>
									<span class="document-details">
										{formatFileSize(file.size)} • {file.type || 'Unknown type'}
									</span>
								</div>
								<Badge variant="accent">Document</Badge>
								<ActionIcon
									svg={iconTrash}
									variant="danger-subtle"
									onclick={() => removeFile(documentFiles, index, 'document')}
								/>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	</Paper>

	<Paper title="Multiple Files & Progress">
		<div class="multiple-section">
			<h4>Batch File Upload</h4>
			<div class="multiple-config">
				<div class="config-options">
					<Checkbox bind:checked={allowMultiple} label="Allow multiple files" />
					<Checkbox bind:checked={showProgress} label="Show progress simulation" />
				</div>
			</div>
			<div class="multiple-demo">
				<Dropzone
					loading={multipleLoading}
					multiple={allowMultiple}
					maxFiles={5}
					onFileSubmit={handleMultipleUpload}
					onReject={handleRejected}
					label={allowMultiple ? 'Drop up to 5 files here' : undefined}
				/>
				{#if showProgress && multipleLoading}
					<div class="progress-bar">
						<div class="progress-fill" style="width: {uploadProgress}%"></div>
						<span class="progress-text">{Math.round(uploadProgress)}%</span>
					</div>
				{/if}
				{#if multipleFiles.length > 0}
					<div class="multiple-list">
						<div class="list-header">
							<h6>Batch Upload Results ({multipleFiles.length} files)</h6>
							<Button variant="secondary-subtle" onclick={processBatch}>Process Batch</Button>
						</div>
						<div class="file-grid">
							{#each multipleFiles as file, index}
								<div class="grid-item">
									<ActionIcon svg={getFileIcon(file.name)} variant="secondary-subtle" />
									<span class="grid-name">{file.name}</span>
									<span class="grid-size">{formatFileSize(file.size)}</span>
									<ActionIcon
										svg={iconTrash}
										variant="danger-subtle"
										onclick={() => removeFile(multipleFiles, index, 'multiple')}
									/>
								</div>
							{/each}
						</div>
					</div>
				{/if}
			</div>
		</div>
	</Paper>

	<Paper title="Custom Configuration">
		<div class="custom-section">
			<h4>Configurable Dropzone</h4>
			<div class="custom-config">
				<div class="config-field">
					<Select
						label="Accepted File Types"
						bind:value={acceptedTypes}
						options={fileTypeOptions}
					/>
				</div>
				<div class="config-preview">
					<p><strong>Current Filter:</strong> {acceptedTypes}</p>
				</div>
			</div>
			<div class="custom-demo">
				<Dropzone
					onFileSubmit={handleCustomUpload}
					onReject={handleRejected}
					accept={acceptedTypes}
				/>
			</div>
		</div>
	</Paper>

	<Paper title="File Management">
		<div class="management-section">
			<h4>Bulk Operations</h4>
			<div class="management-stats">
				<div class="stat-item">
					<span class="stat-value">{uploadedFiles.length}</span>
					<span class="stat-label">Basic Files</span>
				</div>
				<div class="stat-item">
					<span class="stat-value">{imageFiles.length}</span>
					<span class="stat-label">Images</span>
				</div>
				<div class="stat-item">
					<span class="stat-value">{documentFiles.length}</span>
					<span class="stat-label">Documents</span>
				</div>
				<div class="stat-item">
					<span class="stat-value">{multipleFiles.length}</span>
					<span class="stat-label">Batch Files</span>
				</div>
			</div>
			<div class="management-actions">
				<Button onclick={processBatch}>Process All Files</Button>
				<Button variant="secondary" onclick={clearAllFiles}>Clear All Files</Button>
				<Button variant="secondary-subtle" svg={iconRefresh}>Refresh View</Button>
			</div>
		</div>
	</Paper>

	<Paper title="Activity Log">
		<div class="log-section">
			<div class="log-header">
				<h4>Upload Activity</h4>
				<Button variant="secondary-subtle" onclick={clearLog}>Clear Log</Button>
			</div>
			<div class="action-log">
				{#each actionLog as entry}
					<p class="log-entry">{entry}</p>
				{/each}
				{#if actionLog.length === 0}
					<p class="no-actions">No upload activity yet. Try uploading some files above!</p>
				{/if}
			</div>
		</div>
	</Paper>

	<Paper title="Features">
		<div class="feature-list">
			<ul>
				<li>
					<strong>Drag and drop:</strong> Native HTML5 drag and drop support with visual feedback
				</li>
				<li><strong>Click to browse:</strong> Traditional file input as fallback option</li>
				<li><strong>File type filtering:</strong> Accept attribute for restricting file types</li>
				<li><strong>Multiple files:</strong> Support for single or multiple file selection</li>
				<li>
					<strong>Loading states:</strong> Built-in loading indicator with full-screen overlay
				</li>
				<li><strong>Visual feedback:</strong> Hover and drag-over states for better UX</li>
				<li>
					<strong>File validation:</strong> Built-in accept, maxSize and maxFiles validation for both
					drops and browsing
				</li>
				<li>
					<strong>Rejection callback:</strong> onReject reports files filtered out by validation
				</li>
				<li><strong>Theme support:</strong> Full light/dark mode integration</li>
				<li><strong>Custom styling:</strong> Dashed border with smooth transitions</li>
				<li><strong>Progress tracking:</strong> Loading states for upload simulation</li>
				<li><strong>Error handling:</strong> Graceful handling of invalid files</li>
				<li><strong>Accessibility:</strong> Keyboard accessible with proper ARIA attributes</li>
				<li><strong>Mobile friendly:</strong> Touch-friendly interface for mobile devices</li>
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

	.dropzone-section h4,
	.restriction-section h4,
	.multiple-section h4,
	.custom-section h4,
	.management-section h4,
	.log-section h4 {
		color: var(--text-color);
		font-size: 1.125rem;
		font-weight: 600;
		margin: 0 0 1rem 0;
	}

	.upload-demo {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.dropzone-info {
		padding: 1rem;
		background-color: rgba(var(--ui-primary-rgbc), 0.05);
		border-radius: 0.375rem;
		border: 1px solid var(--border-color);
	}

	.dropzone-info strong {
		color: var(--text-color);
		font-weight: 600;
		display: block;
		margin-bottom: 0.5rem;
	}

	.dropzone-info ul {
		margin: 0.5rem 0;
		padding-left: 1.5rem;
		color: var(--text-color);
	}

	.dropzone-info li {
		margin-bottom: 0.25rem;
		font-size: 0.875rem;
	}

	.file-list {
		margin-top: 1rem;
	}

	.file-list h6 {
		color: var(--text-color);
		font-weight: 600;
		margin: 0 0 0.5rem 0;
		font-size: 0.875rem;
	}

	.file-item {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 0.75rem;
		border: 1px solid var(--border-color);
		border-radius: 0.375rem;
		background-color: var(--paper-body-bg);
		margin-bottom: 0.5rem;
	}

	.file-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.file-name {
		color: var(--text-color);
		font-size: 0.875rem;
		font-weight: 500;
	}

	.file-size {
		color: var(--text-muted);
		font-size: 0.75rem;
	}

	.file-actions {
		display: flex;
		gap: 0.5rem;
	}

	.restriction-demo {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-bottom: 2rem;
	}

	.image-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
		gap: 1rem;
		margin-top: 1rem;
	}

	.image-item {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.image-preview {
		position: relative;
		aspect-ratio: 1;
		border-radius: 0.375rem;
		overflow: hidden;
		border: 1px solid var(--border-color);
	}

	.image-preview img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.image-overlay {
		position: absolute;
		top: 0.25rem;
		right: 0.25rem;
		opacity: 0;
		transition: opacity 0.2s;
	}

	.image-preview:hover .image-overlay {
		opacity: 1;
	}

	.image-details {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.image-name {
		color: var(--text-color);
		font-size: 0.75rem;
		font-weight: 500;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.image-size {
		color: var(--text-muted);
		font-size: 0.625rem;
	}

	.document-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-top: 1rem;
	}

	.document-item {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 0.75rem;
		border: 1px solid var(--border-color);
		border-radius: 0.375rem;
		background-color: var(--paper-body-bg);
	}

	.document-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.document-name {
		color: var(--text-color);
		font-size: 0.875rem;
		font-weight: 500;
	}

	.document-details {
		color: var(--text-muted);
		font-size: 0.75rem;
	}

	.multiple-config {
		margin-bottom: 1rem;
	}

	.config-options {
		display: flex;
		gap: 2rem;
		flex-wrap: wrap;
	}

	.multiple-demo {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.progress-bar {
		position: relative;
		width: 100%;
		height: 24px;
		background-color: rgba(var(--ui-primary-rgbc), 0.1);
		border-radius: 12px;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background-color: var(--ui-tertiary);
		transition: width 0.3s ease;
		border-radius: 12px;
	}

	.progress-text {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		color: var(--text-color);
		font-size: 0.75rem;
		font-weight: 600;
	}

	.multiple-list {
		margin-top: 1rem;
	}

	.list-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	.list-header h6 {
		color: var(--text-color);
		font-weight: 600;
		margin: 0;
		font-size: 0.875rem;
	}

	.file-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 0.5rem;
	}

	.grid-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.5rem;
		border: 1px solid var(--border-color);
		border-radius: 0.25rem;
		background-color: var(--paper-body-bg);
		font-size: 0.75rem;
	}

	.grid-name {
		flex: 1;
		color: var(--text-color);
		font-weight: 500;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.grid-size {
		color: var(--text-muted);
		font-size: 0.625rem;
	}

	.custom-config {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.config-field {
		max-width: 300px;
	}

	.config-preview {
		padding: 0.75rem;
		background-color: rgba(var(--ui-primary-rgbc), 0.05);
		border-radius: 0.375rem;
		border: 1px solid var(--border-color);
	}

	.config-preview p {
		margin: 0;
		color: var(--text-color);
		font-size: 0.875rem;
	}

	.custom-demo {
		margin-top: 1rem;
	}

	.management-stats {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	.stat-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 1rem;
		background-color: rgba(var(--ui-primary-rgbc), 0.05);
		border-radius: 0.375rem;
		border: 1px solid var(--border-color);
	}

	.stat-value {
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--ui-primary);
	}

	.stat-label {
		font-size: 0.75rem;
		color: var(--text-muted);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin-top: 0.25rem;
	}

	.management-actions {
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

	:global(.dark) .dropzone-info,
	:global(.dark) .config-preview,
	:global(.dark) .stat-item,
	:global(.dark) .action-log {
		background-color: rgba(var(--ui-accent-rgbc), 0.05);
	}

	:global(.dark) .feature-list strong {
		color: var(--ui-accent);
	}

	:global(.dark) .log-entry {
		background-color: rgba(var(--ui-accent-rgbc), 0.1);
	}

	:global(.dark) .stat-value {
		color: var(--ui-accent);
	}

	:global(.dark) .progress-fill {
		background-color: var(--ui-accent);
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
		.image-grid {
			grid-template-columns: repeat(2, 1fr);
		}

		.file-grid {
			grid-template-columns: 1fr;
		}

		.management-stats {
			grid-template-columns: repeat(2, 1fr);
		}

		.management-actions {
			flex-direction: column;
		}
	}
</style>
