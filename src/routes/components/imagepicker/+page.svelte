<script lang="ts">
	import Paper from '#lib/display/Paper.svelte';
	import ImagePicker from '#lib/form/ImagePicker.svelte';
	import ImagePickerDialog from '#lib/form/ImagePickerDialog.svelte';
	import Button from '#lib/ui/Button.svelte';
	import Switch from '#lib/form/Switch.svelte';
	import { ImageAsset } from '#lib/models/ImageAsset.js';
	import { iconPhotoUp } from '#lib/icon/index.js';
	import { sampleImages } from './sampleImages.js';

	// Basic inline picker
	let basicValue = $state<ImageAsset | null>(null);

	// Dialog driven by pick()
	let dialogPicker: ReturnType<typeof ImagePickerDialog>;
	let pickedImage = $state<ImageAsset | null>(null);
	let pickStatus = $state('Nothing picked yet');

	async function openPicker() {
		const image = await dialogPicker.pick();
		if (image) {
			pickedImage = image;
			pickStatus = `Picked ${image.fileName}`;
		} else {
			pickStatus = 'Cancelled';
		}
	}

	// Library that grows with uploads
	let library = $state<ImageAsset[]>([...sampleImages]);
	let libraryValue = $state<ImageAsset | null>(null);
	let showLibrary = $state(false);
	let fileInput: HTMLInputElement | undefined = $state();

	async function handleUpload(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		input.value = '';
		if (!file) return;
		// A real app uploads the file and uses the URL its server returns
		const href = URL.createObjectURL(file);
		const image = await ImageAsset.fromFile(file, href, {
			keywords: ['uploaded'],
			date: new Date()
		});
		library = [image, ...library];
		libraryValue = image;
	}

	// Options playground
	let optSearchable = $state(true);
	let optSortable = $state(true);
	let optDetails = $state(true);
	let optLoading = $state(false);
	let optDisabled = $state(false);
	let optEmpty = $state(false);
	let optionsValue = $state<ImageAsset | null>(null);

	// Form validation
	let requiredValue = $state<ImageAsset | null>(null);
	let submitted = $state(false);

	const usage = `import { ImageAsset, ImagePickerDialog, TipTap } from '@placeholderco/placeholder-ui';

// From your API (dates may be ISO strings)
const images = (await api.getImages()).map((json) => new ImageAsset(json));

// After an upload: reads name, type, date and pixel size from the File
const uploaded = await ImageAsset.fromFile(file, urlFromServer, { keywords: ['banner'] });

uploaded.extension;       // 'png'
uploaded.typeLabel;       // 'PNG'
uploaded.dimensionsLabel; // '1500 × 500'
uploaded.orientation;     // 'landscape'
uploaded.matches('team banner'); // search across name, alt, keywords, type
uploaded.with({ alt: 'Team offsite banner' }); // changed copy
JSON.stringify(uploaded); // date serialised as ISO string`;

	const tiptapUsage = `<ImagePickerDialog bind:this={picker} images={images} okText="Insert" />
<TipTap onImagePick={() => picker.pick()} />`;
</script>

<div class="page-header">
	<h1>ImagePicker</h1>
	<p>
		Browse, search and choose images from an app's library, inline or in a dialog. Images are
		<code>ImageAsset</code> objects with a file name, alt text, href, dimensions, keywords, type and date.
	</p>
</div>

<div class="vstack">
	<Paper title="Basic Usage">
		<p class="description">
			Bind <code>value</code> to the selected <code>ImageAsset</code>. Search matches file name, alt
			text, keywords and type (try <code>warm</code> or <code>png</code>).
		</p>
		<ImagePicker label="Cover image" images={sampleImages} bind:value={basicValue} />
		<div class="info">
			<strong>Selected (JSON):</strong>
			<pre>{basicValue
					? JSON.stringify(basicValue, null, 2).replace(/"href": "[^"]+"/, '"href": "data:…"')
					: 'None'}</pre>
		</div>
	</Paper>

	<Paper title="Dialog">
		<p class="description">
			<code>ImagePickerDialog</code> wraps the picker with Choose and Cancel buttons. Call
			<code>pick()</code> through <code>bind:this</code>: it opens the dialog and resolves with the
			chosen image, or <code>null</code> when dismissed. Double-clicking an image chooses it.
		</p>
		<div class="row">
			<Button onclick={openPicker}>Choose an image…</Button>
			<span class="muted">{pickStatus}</span>
		</div>
		{#if pickedImage}
			<figure class="preview">
				<img src={pickedImage.href} alt={pickedImage.alt} />
				<figcaption>
					{pickedImage.fileName} · {pickedImage.dimensionsLabel} · {pickedImage.typeLabel}
				</figcaption>
			</figure>
		{/if}
		<ImagePickerDialog bind:this={dialogPicker} images={sampleImages} />
	</Paper>

	<Paper title="With Uploads">
		<p class="description">
			Use the <code>footerStart</code> snippet for extra actions. Here an upload button builds an
			<code>ImageAsset</code> with <code>ImageAsset.fromFile()</code>, which reads the name, type,
			date and pixel size, and adds it to the library.
		</p>
		<div class="row">
			<Button onclick={() => (showLibrary = true)}>Open media library</Button>
			<span class="muted">
				{library.length} images{libraryValue ? ` · last chosen: ${libraryValue.fileName}` : ''}
			</span>
		</div>
		<input type="file" accept="image/*" bind:this={fileInput} onchange={handleUpload} hidden />
		<ImagePickerDialog
			bind:show={showLibrary}
			bind:value={libraryValue}
			images={library}
			title="Media library"
			okText="Use image"
		>
			{#snippet footerStart()}
				<Button variant="secondary" svg={iconPhotoUp} onclick={() => fileInput?.click()}>
					Upload
				</Button>
			{/snippet}
		</ImagePickerDialog>
	</Paper>

	<Paper title="Options">
		<div class="switches">
			<Switch label="Searchable" bind:checked={optSearchable} />
			<Switch label="Sortable" bind:checked={optSortable} />
			<Switch label="Show details" bind:checked={optDetails} />
			<Switch label="Loading" bind:checked={optLoading} />
			<Switch label="Disabled" bind:checked={optDisabled} />
			<Switch label="Empty library" bind:checked={optEmpty} />
		</div>
		<ImagePicker
			images={optEmpty ? [] : sampleImages}
			bind:value={optionsValue}
			searchable={optSearchable}
			sortable={optSortable}
			showDetails={optDetails}
			loading={optLoading}
			disabled={optDisabled}
			tileSize="7rem"
			maxHeight="16rem"
		/>
	</Paper>

	<Paper title="Custom Caption">
		<p class="description">
			The <code>caption</code> snippet replaces the text under each thumbnail.
		</p>
		<ImagePicker images={sampleImages} sortable={false} showDetails={false} maxHeight="16rem">
			{#snippet caption(image)}
				<span class="caption-keywords">{image.keywords.map((k) => `#${k}`).join(' ')}</span>
			{/snippet}
		</ImagePicker>
	</Paper>

	<Paper title="Validation">
		<ImagePicker
			label="Profile banner"
			required
			images={sampleImages}
			bind:value={requiredValue}
			showError={submitted && !requiredValue}
			errorText="Choose a banner image"
			maxHeight="16rem"
		/>
		<div class="row spaced">
			<Button onclick={() => (submitted = true)}>Submit</Button>
			{#if submitted && requiredValue}
				<span class="muted">Saved {requiredValue.fileName}</span>
			{/if}
		</div>
	</Paper>

	<Paper title="ImageAsset">
		<p class="description">
			The model behind the picker. Construct it from API data, or from an uploaded
			<code>File</code>, and use its helpers for display and search.
		</p>
		<pre class="code">{usage}</pre>
		<p class="description">
			With TipTap, pass <code>pick()</code> straight to <code>onImagePick</code>:
		</p>
		<pre class="code">{tiptapUsage}</pre>
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

	.vstack {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.description {
		margin: 0 0 1rem 0;
		color: var(--text-muted);
	}

	code {
		font-size: 0.875em;
	}

	.info {
		margin-top: 1rem;
		padding: 1rem;
		background-color: rgba(var(--ui-primary-rgbc), 0.05);
		border-radius: var(--ui-radius);
		border: 1px solid var(--border-color);
	}

	:global(.dark) .info {
		background-color: rgba(var(--ui-accent-rgbc), 0.05);
	}

	.info pre {
		margin: 0.5rem 0 0 0;
		font-size: 0.75rem;
		white-space: pre-wrap;
		overflow-wrap: anywhere;
	}

	.row {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.75rem;
	}

	.row.spaced {
		margin-top: 1rem;
	}

	.muted {
		color: var(--text-muted);
		font-size: 0.875rem;
	}

	.preview {
		margin: 1rem 0 0 0;
		max-width: 20rem;
	}

	.preview img {
		width: 100%;
		border-radius: var(--ui-radius);
		display: block;
	}

	.preview figcaption {
		margin-top: 0.375rem;
		font-size: 0.8125rem;
		color: var(--text-muted);
	}

	.switches {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem 1.5rem;
		margin-bottom: 1rem;
	}

	.caption-keywords {
		font-size: 0.6875rem;
		color: var(--text-muted);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.code {
		margin: 0 0 1rem 0;
		padding: 0.75rem;
		background: var(--page-bg);
		border: 1px solid var(--border-color);
		border-radius: var(--ui-radius);
		font-size: 0.75rem;
		overflow-x: auto;
	}
</style>
