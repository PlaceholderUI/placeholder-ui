<script lang="ts">
	import { toast } from './Toast.svelte.js';
	import Loader from './Loader.svelte';

	interface Props {
		loading?: boolean;
		multiple?: boolean;
		onFileSubmit: (files: File[]) => void;
		accept?: string;
	}

	let { loading = false, multiple = false, onFileSubmit, accept }: Props = $props();

	let dragzoneElement: HTMLElement;
	let fileInput: HTMLInputElement;
	let dragOver: boolean = $state(false);
	let labelText = $derived(dragOver ? 'Drop files here' : 'Click here or drag a file');

	function handleClick(e: Event) {
		e.preventDefault();
		fileInput!.click();
	}

	function handleFileSubmission(files: File[]) {
		onFileSubmit(files);
	}

	function handleFiles(event: DragEvent) {
		event.preventDefault();
		const files = event.dataTransfer?.files;
		if (files) {
			let array = Array.from(files);

			if (!multiple && array.length > 1) array = [array[0]];

			handleFileSubmission(array);
		}
		dragOver = false;
	}

	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		dragOver = true;
	}

	function handleDragLeave(event: DragEvent) {
		event.preventDefault();
		dragOver = false;
	}

	function handleInputChange(event: Event) {
		let fileList: FileList | null = (event.currentTarget as HTMLInputElement)?.files;
		if (fileList) {
			handleFileSubmission(Array.from(fileList));
		} else {
			toast.error('No file selected');
		}
	}
</script>

<input
	type="file"
	id="file-input"
	multiple
	onchange={handleInputChange}
	bind:this={fileInput}
	class="hidden"
	accept={accept ? accept : '*.*'}
/>
<button
	bind:this={dragzoneElement}
	class="dropzone"
	class:dragover={dragOver}
	disabled={loading}
	ondragenter={handleDragOver}
	ondragover={(ev) => ev.preventDefault()}
	ondragleave={handleDragLeave}
	ondrop={handleFiles}
	onclick={(e) => handleClick(e)}
>
	{#if loading}
		<Loader fullScreen />
	{:else}
		{labelText}
	{/if}
</button>

<style>
	.dropzone {
		border: 1px dashed var(--pui-border-default);
		padding: var(--pui-spacing-4);
		text-align: center;
		cursor: pointer;
		transition: all var(--pui-transition-fast) var(--pui-ease-in-out);
		border-radius: var(--pui-radius-lg);
		flex-grow: 1;
		background-color: var(--pui-input-bg);
		color: var(--pui-text-primary);
	}

	.dropzone:hover,
	.dropzone.dragover {
		background-color: var(--pui-bg-hover);
		border-color: var(--pui-color-primary);
	}

	.hidden {
		display: none;
	}

	:global(.dark) .dropzone {
		background-color: var(--pui-input-bg);
		border-color: var(--pui-border-default);
		color: var(--pui-text-primary);
	}

	:global(.dark) .dropzone:hover,
	:global(.dark) .dropzone.dragover {
		background-color: var(--pui-bg-hover);
		border-color: var(--pui-color-secondary);
	}
</style>
