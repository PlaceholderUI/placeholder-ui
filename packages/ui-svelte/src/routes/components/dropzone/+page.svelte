<script lang="ts">
	import { Dropzone, Paper } from '$lib/index.js';

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
</script>

<h1>Dropzone</h1>
<p>A file upload area that supports drag-and-drop and click-to-browse interactions.</p>

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
	<table class="props-table">
		<thead>
			<tr>
				<th>Prop</th>
				<th>Type</th>
				<th>Default</th>
				<th>Description</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>onFileSubmit</code></td>
				<td><code>(files: File[]) => void</code></td>
				<td>required</td>
				<td>Callback when files are submitted</td>
			</tr>
			<tr>
				<td><code>multiple</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Allow multiple file selection</td>
			</tr>
			<tr>
				<td><code>accept</code></td>
				<td><code>string</code></td>
				<td><code>undefined</code></td>
				<td>Accepted file types (e.g. "image/*", ".pdf,.doc")</td>
			</tr>
			<tr>
				<td><code>loading</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Show loading state with spinner</td>
			</tr>
		</tbody>
	</table>
</Paper>

<style>
	h1 { margin-bottom: 0.5rem; }
	p { color: var(--pui-color-text-secondary); margin-bottom: 1.5rem; }
	.value-display { font-size: 0.875rem; color: var(--pui-color-text-muted); font-family: monospace; margin-top: 0.5rem; }
	.props-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
	.props-table th, .props-table td { text-align: left; padding: 0.75rem; border-bottom: 1px solid var(--pui-color-border); }
	.props-table th { font-weight: 600; background: var(--pui-color-bg-secondary); }
	.props-table code { background: var(--pui-color-bg-tertiary); padding: 0.125rem 0.375rem; border-radius: 4px; font-size: 0.8125rem; }

	.control-btn {
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
