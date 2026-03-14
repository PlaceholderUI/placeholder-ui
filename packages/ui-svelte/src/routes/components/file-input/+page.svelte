<script lang="ts">
	import { Table, FileInput, Paper } from '$lib/index.js';
	import type { Column } from '$lib/index.js';

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
		{ prop: 'value', type: 'File | File[] | null', default: 'null', description: 'Bindable file value' },
		{ prop: 'label', type: 'string', default: '\'\'', description: 'Label text above input' },
		{ prop: 'accept', type: 'string', default: '\'\'', description: 'image/*' },
		{ prop: 'multiple', type: 'boolean', default: 'false', description: 'Allow selecting multiple files' },
		{ prop: 'placeholder', type: 'string', default: '\'Choose file\'', description: 'Placeholder text when no file is selected' },
		{ prop: 'clearable', type: 'boolean', default: 'true', description: 'Show a clear button when file is selected' },
		{ prop: 'size', type: '\'xs\' | \'sm\' | \'md\' | \'lg\'', default: '\'md\'', description: 'Size of the file input' },
		{ prop: 'variant', type: '\'default\' | \'filled\'', default: '\'default\'', description: 'Visual style variant' },
		{ prop: 'leftIcon', type: 'string', default: 'undefined', description: 'SVG string for the left icon (defaults to upload icon)' },
		{ prop: 'disabled', type: 'boolean', default: 'false', description: 'Disables the file input' },
		{ prop: 'required', type: 'boolean', default: 'false', description: 'Shows required indicator' },
		{ prop: 'showError', type: 'boolean', default: 'false', description: 'Shows error styling' },
		{ prop: 'errorText', type: 'string', default: '\'\'', description: 'Error message text' },
		{ prop: 'onchange', type: '(files: File | File[] | null) => void', default: 'undefined', description: 'Called when file selection changes' },
	];
</script>

<h1>FileInput</h1>
<p>File input control for selecting single or multiple files with type filtering and clearable support.</p>

<div class="vstack">
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
		<Table columns={propsColumns} rows={propsRows} striped hover={false} />
	</Paper>
</div>

<style>
	h1 { margin-bottom: 0.5rem; }
	p { color: var(--pui-color-text-secondary); margin-bottom: 1.5rem; }
	.form-grid { display: flex; flex-direction: column; gap: 1rem; max-width: 400px; }
	.value-display { font-size: 0.875rem; color: var(--pui-color-text-muted); font-family: monospace; margin-top: 0.5rem; }</style>
