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
		border: 1px dashed #ccc;
		padding: 1rem;
		text-align: center;
		cursor: pointer;
		transition: all 0.2s ease-in-out;
		border-radius: 6px;
		flex-grow: 1;
	}

	.dropzone:hover, .dropzone.dragover {
		background: #f0f0f0;
	}

	.hidden {
		display: none;
	}

	:global(.dark) .dropzone {
		background: rgb(16, 17, 19);
		border-color: rgb(46, 47, 49);
		color: #fff;
	}

	:global(.dark) .dropzone:hover,
	:global(.dark) .dropzone.dragover {
		background: rgb(36, 37, 39);
	}
</style>
