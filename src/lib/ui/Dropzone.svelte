<script lang="ts">
	import type { Snippet } from 'svelte';
	import Loader from './Loader.svelte';
	import Icon from '../icon/Icon.svelte';
	import iconCloudUpload from '../icon/cloud-upload.svg?raw';
	import iconDownload from '../icon/download.svg?raw';

	export interface DropzoneProps {
		/** Show loading state */
		loading?: boolean;
		/** Disable the dropzone without showing the loading state */
		disabled?: boolean;
		/** Allow multiple file selection */
		multiple?: boolean;
		/** Callback when valid files are dropped or selected */
		onFileSubmit: (files: File[]) => void;
		/** Callback with files rejected by accept, maxSize or maxFiles validation */
		onReject?: (files: File[]) => void;
		/** Accepted file types (e.g., "image/*,.pdf") */
		accept?: string;
		/** Maximum file size in bytes */
		maxSize?: number;
		/** Maximum number of files per drop or selection (only applies when multiple) */
		maxFiles?: number;
		/** Icon shown above the label (raw SVG string, defaults to the cloud upload icon) */
		icon?: string;
		/** Icon shown while files are dragged over (raw SVG string, defaults to the download icon) */
		dragOverIcon?: string;
		/** Label text (defaults to "Click to upload or drag and drop") */
		label?: string;
		/** Sublabel text under the label (defaults to a hint built from accept/maxSize) */
		sublabel?: string;
		/** Width override (any CSS width value, defaults to 100%) */
		width?: string;
		/** Height override (any CSS height value) */
		height?: string;
		/** Custom content rendered inside the dropzone instead of the label */
		children?: Snippet;
	}

	let {
		loading = false,
		disabled = false,
		multiple = false,
		onFileSubmit,
		onReject,
		accept,
		maxSize,
		maxFiles,
		icon = iconCloudUpload,
		dragOverIcon = iconDownload,
		label,
		sublabel,
		width,
		height,
		children
	}: DropzoneProps = $props();

	let fileInput: HTMLInputElement;
	// Counter instead of a boolean: dragleave fires when crossing child elements
	let dragDepth = $state(0);
	let dragOver = $derived(dragDepth > 0);
	let labelText = $derived(
		dragOver ? 'Drop files here' : label || 'Click to upload or drag and drop'
	);
	let iconSvg = $derived(dragOver ? dragOverIcon : icon);
	let sublabelText = $derived.by(() => {
		if (sublabel !== undefined) return sublabel;
		const hints = [];
		if (accept) hints.push(accept);
		if (maxSize) hints.push(`up to ${formatBytes(maxSize)}`);
		return hints.length ? hints.join(' · ') : '';
	});

	function formatBytes(bytes: number): string {
		if (bytes < 1024) return `${bytes} B`;
		const units = ['KB', 'MB', 'GB'];
		const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length);
		return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(1))} ${units[i - 1]}`;
	}

	function matchesAccept(file: File): boolean {
		if (!accept) return true;
		return accept.split(',').some((token) => {
			const type = token.trim().toLowerCase();
			if (!type) return false;
			if (type === '*/*') return true;
			if (type.startsWith('.')) return file.name.toLowerCase().endsWith(type);
			if (type.endsWith('/*')) return file.type.toLowerCase().startsWith(type.slice(0, -1));
			return file.type.toLowerCase() === type;
		});
	}

	function submitFiles(files: File[]) {
		let accepted = files.filter(
			(file) => matchesAccept(file) && (!maxSize || file.size <= maxSize)
		);
		let rejected = files.filter((file) => !accepted.includes(file));

		const limit = multiple ? maxFiles : 1;
		if (limit && accepted.length > limit) {
			rejected = [...rejected, ...accepted.slice(limit)];
			accepted = accepted.slice(0, limit);
		}

		if (accepted.length) onFileSubmit(accepted);
		if (rejected.length) onReject?.(rejected);
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		dragDepth = 0;
		if (loading || disabled) return;
		const files = event.dataTransfer?.files;
		if (files?.length) submitFiles(Array.from(files));
	}

	function handleDragEnter(event: DragEvent) {
		event.preventDefault();
		dragDepth++;
	}

	function handleDragLeave(event: DragEvent) {
		event.preventDefault();
		dragDepth = Math.max(0, dragDepth - 1);
	}

	function handleInputChange(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		if (input.files?.length) submitFiles(Array.from(input.files));
		// Reset so selecting the same file again re-fires change
		input.value = '';
	}
</script>

<input
	type="file"
	{multiple}
	{accept}
	onchange={handleInputChange}
	bind:this={fileInput}
	class="hidden"
/>
<button
	type="button"
	class="dropzone"
	class:dragover={dragOver}
	style:width
	style:height
	disabled={loading || disabled}
	aria-busy={loading}
	aria-label={labelText}
	ondragenter={handleDragEnter}
	ondragover={(ev) => ev.preventDefault()}
	ondragleave={handleDragLeave}
	ondrop={handleDrop}
	onclick={() => fileInput.click()}
>
	{#if loading}
		<Loader fullScreen />
	{:else if children}
		{@render children()}
	{:else}
		<span class="dropzone-content">
			<Icon svg={iconSvg} size="32px" class="dropzone-icon" />
			<span class="dropzone-label">{labelText}</span>
			{#if sublabelText}
				<span class="dropzone-sublabel">{sublabelText}</span>
			{/if}
		</span>
	{/if}
</button>

<style>
	.dropzone {
		width: 100%;
		border: 1px dashed var(--border-color);
		padding: 1rem;
		text-align: center;
		cursor: pointer;
		transition: all 0.2s ease-in-out;
		border-radius: 6px;
		flex-grow: 1;
		background: var(--paper-body-bg);
		color: var(--text-color);
	}

	.dropzone:hover:not(:disabled),
	.dropzone.dragover {
		background: var(--page-bg);
	}

	.dropzone:disabled {
		cursor: not-allowed;
		opacity: 0.65;
	}

	.dropzone-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.25rem;
		height: 100%;
	}

	.dropzone-content :global(.dropzone-icon) {
		opacity: 0.65;
		margin-bottom: 0.25rem;
	}

	.dropzone-label {
		font-weight: 500;
	}

	.dropzone-sublabel {
		font-size: 0.8125rem;
		opacity: 0.65;
	}

	.hidden {
		display: none;
	}
</style>
