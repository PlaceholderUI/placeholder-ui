<script lang="ts">
	import { FileInput, Paper } from '$lib/index.js';

	let singleFile = $state<File | File[] | null>(null);
	let multipleFiles = $state<File | File[] | null>(null);
	let imageFile = $state<File | File[] | null>(null);
	let sizeXs = $state<File | File[] | null>(null);
	let sizeSm = $state<File | File[] | null>(null);
	let sizeMd = $state<File | File[] | null>(null);
	let sizeLg = $state<File | File[] | null>(null);

	const singleFileName = $derived(
		singleFile && !Array.isArray(singleFile) ? singleFile.name : 'No file selected'
	);

	const multipleFileNames = $derived(
		multipleFiles && Array.isArray(multipleFiles)
			? multipleFiles.map((f) => f.name).join(', ')
			: 'No files selected'
	);

	const imageFileName = $derived(
		imageFile && !Array.isArray(imageFile) ? imageFile.name : 'No image selected'
	);
</script>

<h1>FileInput</h1>
<p>File input control for selecting single or multiple files with type filtering and clearable support.</p>

<Paper title="Basic Usage">
	<div class="form-grid">
		<FileInput label="Upload Document" bind:value={singleFile} placeholder="Choose a file" />
		<div class="value-display">File: {singleFileName}</div>
	</div>
</Paper>

<Paper title="Multiple Files">
	<div class="form-grid">
		<FileInput
			label="Upload Documents"
			bind:value={multipleFiles}
			multiple
			placeholder="Choose files"
		/>
		<div class="value-display">Files: {multipleFileNames}</div>
	</div>
</Paper>

<Paper title="Accept Filter (images only)">
	<div class="form-grid">
		<FileInput
			label="Upload Image"
			bind:value={imageFile}
			accept="image/*"
			placeholder="Choose an image"
		/>
		<div class="value-display">Image: {imageFileName}</div>
	</div>
</Paper>

<Paper title="Sizes">
	<div class="form-grid">
		<FileInput label="Extra Small" bind:value={sizeXs} size="xs" placeholder="XS file input" />
		<FileInput label="Small" bind:value={sizeSm} size="sm" placeholder="SM file input" />
		<FileInput label="Medium (default)" bind:value={sizeMd} size="md" placeholder="MD file input" />
		<FileInput label="Large" bind:value={sizeLg} size="lg" placeholder="LG file input" />
	</div>
</Paper>

<Paper title="Filled Variant">
	<div class="form-grid">
		<FileInput label="Filled Style" variant="filled" placeholder="Choose a file" />
	</div>
</Paper>

<Paper title="Non-clearable">
	<div class="form-grid">
		<FileInput label="Cannot Clear" clearable={false} placeholder="Select file (no clear button)" />
	</div>
</Paper>

<Paper title="Required">
	<div class="form-grid">
		<FileInput label="Required Upload" required placeholder="File is required" />
	</div>
</Paper>

<Paper title="With Error">
	<div class="form-grid">
		<FileInput
			label="Upload Required"
			showError
			errorText="Please upload a file"
			placeholder="Choose a file"
		/>
	</div>
</Paper>

<Paper title="Disabled">
	<div class="form-grid">
		<FileInput label="Uploads Disabled" disabled placeholder="Cannot upload" />
	</div>
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
				<td><code>value</code></td>
				<td><code>File | File[] | null</code></td>
				<td><code>null</code></td>
				<td>Bindable file value</td>
			</tr>
			<tr>
				<td><code>label</code></td>
				<td><code>string</code></td>
				<td><code>''</code></td>
				<td>Label text above input</td>
			</tr>
			<tr>
				<td><code>accept</code></td>
				<td><code>string</code></td>
				<td><code>''</code></td>
				<td>Accepted file types (e.g., <code>image/*</code>, <code>.pdf</code>)</td>
			</tr>
			<tr>
				<td><code>multiple</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Allow selecting multiple files</td>
			</tr>
			<tr>
				<td><code>placeholder</code></td>
				<td><code>string</code></td>
				<td><code>'Choose file'</code></td>
				<td>Placeholder text when no file is selected</td>
			</tr>
			<tr>
				<td><code>clearable</code></td>
				<td><code>boolean</code></td>
				<td><code>true</code></td>
				<td>Show a clear button when file is selected</td>
			</tr>
			<tr>
				<td><code>size</code></td>
				<td><code>'xs' | 'sm' | 'md' | 'lg'</code></td>
				<td><code>'md'</code></td>
				<td>Size of the file input</td>
			</tr>
			<tr>
				<td><code>variant</code></td>
				<td><code>'default' | 'filled'</code></td>
				<td><code>'default'</code></td>
				<td>Visual style variant</td>
			</tr>
			<tr>
				<td><code>leftIcon</code></td>
				<td><code>string</code></td>
				<td><code>undefined</code></td>
				<td>SVG string for the left icon (defaults to upload icon)</td>
			</tr>
			<tr>
				<td><code>disabled</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Disables the file input</td>
			</tr>
			<tr>
				<td><code>required</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Shows required indicator</td>
			</tr>
			<tr>
				<td><code>showError</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Shows error styling</td>
			</tr>
			<tr>
				<td><code>errorText</code></td>
				<td><code>string</code></td>
				<td><code>''</code></td>
				<td>Error message text</td>
			</tr>
			<tr>
				<td><code>onchange</code></td>
				<td><code>(files: File | File[] | null) =&gt; void</code></td>
				<td><code>undefined</code></td>
				<td>Called when file selection changes</td>
			</tr>
		</tbody>
	</table>
</Paper>

<style>
	h1 { margin-bottom: 0.5rem; }
	p { color: var(--pui-color-text-secondary); margin-bottom: 1.5rem; }
	.form-grid { display: flex; flex-direction: column; gap: 1rem; max-width: 400px; }
	.value-display { font-size: 0.875rem; color: var(--pui-color-text-muted); font-family: monospace; margin-top: 0.5rem; }
	.props-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
	.props-table th, .props-table td { text-align: left; padding: 0.75rem; border-bottom: 1px solid var(--pui-color-border); }
	.props-table th { font-weight: 600; background: var(--pui-color-bg-secondary); }
	.props-table code { background: var(--pui-color-bg-tertiary); padding: 0.125rem 0.375rem; border-radius: 4px; font-size: 0.8125rem; }
</style>
