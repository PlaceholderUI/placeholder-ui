<script lang="ts">
	import { Table, Dropzone, Paper } from '$lib/index.js';
	import type { Column } from '$lib/index.js';

	let uploadedFiles = $state<string[]>([]);
	let multipleFiles = $state<string[]>([]);
	let imageFiles = $state<string[]>([]);
	let isLoading = $state(false);

	function handleFileSubmit(files: File[]) {
		uploadedFiles = files.map(f => `${f.name} (${(f.size / 1024).toFixed(1)} KB)`);
	}

	function handleMultipleSubmit(files: File[]) {
		multipleFiles = files.map(f => `${f.name} (${(f.size / 1024).toFixed(1)} KB)`);
	}

	function handleImageSubmit(files: File[]) {
		imageFiles = files.map(f => `${f.name} (${(f.size / 1024).toFixed(1)} KB)`);
	}

	function simulateLoading() {
		isLoading = true;
		setTimeout(() => (isLoading = false), 3000);
	}

	interface PropRow {
		prop: string;
		type: string;
		default: string;
		description: string;
	}

	const propsColumns: Column<PropRow>[] = [
		{ key: 'prop', label: 'Prop' },
		{ key: 'type', label: 'Type' },
		{ key: 'default', label: 'Default' },
		{ key: 'description', label: 'Description' },
	];

	const propsRows: PropRow[] = [
		{ prop: 'onFileSubmit', type: '(files: File[]) => void', default: 'required', description: 'Callback when files are submitted' },
		{ prop: 'multiple', type: 'boolean', default: 'false', description: 'Allow multiple file selection' },
		{ prop: 'accept', type: 'string', default: 'undefined', description: 'Accepted file types (e.g. "image/*", ".pdf,.doc")' },
		{ prop: 'loading', type: 'boolean', default: 'false', description: 'Show loading state with spinner' },
	];
</script>

<h1>Dropzone</h1>
<p>A file upload area that supports drag-and-drop and click-to-browse interactions.</p>

<div class="vstack">
	<Paper title="Basic Usage">
		<Dropzone onFileSubmit={handleFileSubmit} />
		{#if uploadedFiles.length > 0}
			<div class="value-display">
				Uploaded: {uploadedFiles.join(', ')}
			</div>
		{/if}
	</Paper>

	<Paper title="Multiple Files">
		<Dropzone onFileSubmit={handleMultipleSubmit} multiple />
		{#if multipleFiles.length > 0}
			<div class="value-display">
				Files: {multipleFiles.join(', ')}
			</div>
		{/if}
	</Paper>

	<Paper title="Accept Filter">
		<p style="margin-bottom: 0.5rem; font-size: 0.875rem;">Only accepts image files (image/*).</p>
		<Dropzone onFileSubmit={handleImageSubmit} accept="image/*" />
		{#if imageFiles.length > 0}
			<div class="value-display">
				Images: {imageFiles.join(', ')}
			</div>
		{/if}
	</Paper>

	<Paper title="Loading State">
		<button class="control-btn" onclick={simulateLoading} style="margin-bottom: 0.75rem;">Simulate Loading (3s)</button>
		<Dropzone onFileSubmit={() => {}} loading={isLoading} />
		<div class="value-display">loading: {isLoading}</div>
	</Paper>

	<Paper title="Props">
		<Table columns={propsColumns} rows={propsRows} striped hover={false} />
	</Paper>
</div>

<style>
	h1 { margin-bottom: 0.5rem; }
	p { color: var(--pui-color-text-secondary); margin-bottom: 1.5rem; }
	.value-display { font-size: 0.875rem; color: var(--pui-color-text-muted); font-family: monospace; margin-top: 0.5rem; }.control-btn {
		padding: 0.5rem 1rem;
		border: 1px solid var(--pui-color-border);
		border-radius: 0.25rem;
		background: var(--pui-paper-body-bg);
		color: var(--pui-text-primary);
		cursor: pointer;
		font-size: 0.875rem;
	}

	.control-btn:hover {
		background: var(--pui-bg-hover);
	}
</style>
