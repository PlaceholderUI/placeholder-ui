<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { ImageAsset } from '#lib/models/ImageAsset.js';

	/** Sort order for the image grid */
	export type ImageSort = 'newest' | 'oldest' | 'name-asc' | 'name-desc';

	export interface ImagePickerProps {
		/** Images to choose from */
		images: ImageAsset[];
		/** Selected image (bindable). Matched to `images` by `href`. */
		value?: ImageAsset | null;
		/** Label text displayed above the picker */
		label?: string;
		/** Mark field as required (shows asterisk) */
		required?: boolean;
		/** CSS classes for the FormGroup wrapper */
		groupClass?: string;
		/** Tooltip text on hover */
		tooltipText?: string;
		/** Position of the tooltip */
		tooltipLocation?: 'top' | 'bottom' | 'left' | 'right';
		/** Show error state styling */
		showError?: boolean;
		/** Error message to display */
		errorText?: string;
		/** Show the search box (matches file name, alt text, keywords and type) */
		searchable?: boolean;
		/** Current search text (bindable) */
		search?: string;
		/** Placeholder for the search box */
		searchPlaceholder?: string;
		/** Show the sort menu */
		sortable?: boolean;
		/** Current sort order (bindable) */
		sort?: ImageSort;
		/** Show a loading spinner instead of the grid */
		loading?: boolean;
		/** Disable selection */
		disabled?: boolean;
		/** Show the selected image's details (alt text, size, type, date, keywords) */
		showDetails?: boolean;
		/** Minimum tile width; the grid fits as many columns as it can */
		tileSize?: string;
		/** Maximum grid height before it scrolls */
		maxHeight?: string;
		/** Text shown when `images` is empty */
		emptyText?: string;
		/** Text shown when the search matches nothing */
		noResultsText?: string;
		/** Additional CSS classes */
		class?: string;
		/** Called when the selection changes */
		onSelect?: (image: ImageAsset | null) => void;
		/** Called when an image is double-clicked (e.g. to confirm a dialog) */
		onActivate?: (image: ImageAsset) => void;
		/** Custom caption under each thumbnail; defaults to file name and size/type/date */
		caption?: Snippet<[ImageAsset]>;
	}

	export const imageSortOptions: { label: string; value: ImageSort }[] = [
		{ label: 'Newest first', value: 'newest' },
		{ label: 'Oldest first', value: 'oldest' },
		{ label: 'Name A–Z', value: 'name-asc' },
		{ label: 'Name Z–A', value: 'name-desc' }
	];

	/** Sort a copy of `images`. Images without a date sort last for both date orders. */
	export function sortImages(images: ImageAsset[], sort: ImageSort): ImageAsset[] {
		const byName = (a: ImageAsset, b: ImageAsset) =>
			a.fileName.localeCompare(b.fileName, undefined, { numeric: true, sensitivity: 'base' });
		const byDate = (a: ImageAsset, b: ImageAsset, direction: 1 | -1) => {
			if (!a.date && !b.date) return byName(a, b);
			if (!a.date) return 1;
			if (!b.date) return -1;
			return (a.date.getTime() - b.date.getTime()) * direction || byName(a, b);
		};
		const copy = [...images];
		switch (sort) {
			case 'oldest':
				return copy.sort((a, b) => byDate(a, b, 1));
			case 'name-asc':
				return copy.sort(byName);
			case 'name-desc':
				return copy.sort((a, b) => byName(b, a));
			default:
				return copy.sort((a, b) => byDate(a, b, -1));
		}
	}
</script>

<script lang="ts">
	import { SvelteSet } from 'svelte/reactivity';
	import FormGroup from './FormGroup.svelte';
	import Textbox from './Textbox.svelte';
	import Select from './Select.svelte';
	import Badge from '#lib/ui/Badge.svelte';
	import Loader from '#lib/ui/Loader.svelte';
	import { Icon, iconPhoto, iconSearch } from '#lib/icon/index.js';
	import dayjs from '#lib/util/dayjs.js';

	let {
		images,
		value = $bindable(null),
		label = '',
		required = false,
		groupClass = '',
		tooltipText = undefined,
		tooltipLocation = 'top',
		showError = false,
		errorText = '',
		searchable = true,
		search = $bindable(''),
		searchPlaceholder = 'Search by name, alt text or keyword',
		sortable = true,
		sort = $bindable('newest'),
		loading = false,
		disabled = false,
		showDetails = true,
		tileSize = '9rem',
		maxHeight = '22rem',
		emptyText = 'No images yet',
		noResultsText = 'No images match your search',
		class: className = '',
		onSelect,
		onActivate,
		caption
	}: ImagePickerProps = $props();

	// Thumbnails that failed to load show a placeholder icon instead
	const brokenImages = new SvelteSet<string>();

	// Own copies: Select may annotate the option objects it is given
	const sortOptions = imageSortOptions.map((option) => ({ ...option }));

	const visibleImages = $derived(
		sortImages(
			images.filter((image) => image.matches(search)),
			sort
		)
	);

	const isSelected = (image: ImageAsset) => !!value && value.href === image.href;

	const formatDate = (date: Date | null) => (date ? dayjs(date).format('D MMM YYYY') : '');

	// Clicking never deselects: a double-click fires two clicks first, and toggling
	// would flicker the selection off and on before onActivate
	function select(image: ImageAsset) {
		if (disabled || isSelected(image)) return;
		value = image;
		onSelect?.(value);
	}

	function activate(image: ImageAsset) {
		if (disabled) return;
		select(image);
		onActivate?.(image);
	}
</script>

<FormGroup
	{label}
	{required}
	class={groupClass}
	{tooltipText}
	{tooltipLocation}
	{showError}
	{errorText}
>
	<div class="image-picker {className}" class:disabled class:has-error={showError}>
		{#if searchable || sortable}
			<div class="image-picker-toolbar">
				{#if searchable}
					<div class="image-picker-search">
						<Textbox
							name="image-picker-search"
							placeholder={searchPlaceholder}
							leftIconSvg={iconSearch}
							bind:value={search}
							{disabled}
						/>
					</div>
				{/if}
				{#if sortable}
					<div class="image-picker-sort">
						<Select name="image-picker-sort" options={sortOptions} bind:value={sort} {disabled} />
					</div>
				{/if}
			</div>
		{/if}

		<div class="image-picker-body" style:max-height={maxHeight}>
			{#if loading}
				<div class="image-picker-message">
					<Loader inline sizeOverride="2rem" />
				</div>
			{:else if images.length === 0}
				<div class="image-picker-message">{emptyText}</div>
			{:else if visibleImages.length === 0}
				<div class="image-picker-message">{noResultsText}</div>
			{:else}
				<div
					class="image-picker-grid"
					style:grid-template-columns="repeat(auto-fill, minmax({tileSize}, 1fr))"
				>
					{#each visibleImages as image (image)}
						<button
							type="button"
							class="image-tile"
							class:selected={isSelected(image)}
							aria-pressed={isSelected(image)}
							title={image.alt ? `${image.fileName}: ${image.alt}` : image.fileName}
							{disabled}
							onclick={() => select(image)}
							ondblclick={() => activate(image)}
						>
							<span class="image-tile-thumb">
								{#if brokenImages.has(image.href)}
									<Icon svg={iconPhoto} size="32" />
								{:else}
									<img
										src={image.href}
										alt={image.alt}
										loading="lazy"
										decoding="async"
										onerror={() => brokenImages.add(image.href)}
									/>
								{/if}
							</span>
							<span class="image-tile-caption">
								{#if caption}
									{@render caption(image)}
								{:else}
									<span class="image-tile-name">{image.fileName}</span>
									<span class="image-tile-meta">
										{[image.dimensionsLabel, image.typeLabel, formatDate(image.date)]
											.filter(Boolean)
											.join(' · ')}
									</span>
								{/if}
							</span>
						</button>
					{/each}
				</div>
			{/if}
		</div>

		{#if showDetails && value}
			<div class="image-picker-details" aria-live="polite">
				<div class="image-picker-details-name">{value.fileName}</div>
				<dl>
					<dt>Alt text</dt>
					<dd class:muted={!value.alt}>{value.alt || 'None'}</dd>
					{#if value.dimensions}
						<dt>Size</dt>
						<dd>{value.dimensionsLabel} px</dd>
					{/if}
					{#if value.type}
						<dt>Type</dt>
						<dd>{value.typeLabel} <span class="muted">({value.type})</span></dd>
					{/if}
					{#if value.date}
						<dt>Date</dt>
						<dd>{formatDate(value.date)}</dd>
					{/if}
				</dl>
				{#if value.keywords.length}
					<div class="image-picker-keywords">
						{#each value.keywords as keyword (keyword)}
							<Badge variant="secondary-subtle" size="sm">{keyword}</Badge>
						{/each}
					</div>
				{/if}
			</div>
		{/if}
	</div>
</FormGroup>

<style>
	.image-picker {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		min-width: 0;
	}

	.image-picker-toolbar {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		align-items: flex-start;
	}

	.image-picker-search {
		flex: 1 1 14rem;
		min-width: 0;
	}

	.image-picker-sort {
		flex: 0 0 11rem;
	}

	.image-picker-body {
		overflow-y: auto;
		border: 1px solid var(--border-color);
		border-radius: var(--ui-radius-lg);
		background: var(--input-bg);
		padding: 0.5rem;
	}

	.has-error .image-picker-body {
		border-color: var(--danger-text);
	}

	.image-picker-grid {
		display: grid;
		gap: 0.5rem;
	}

	.image-picker-message {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 8rem;
		color: var(--text-muted);
		font-size: 0.875rem;
		text-align: center;
	}

	.image-tile {
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
		min-width: 0;
		padding: 0.375rem;
		border: 1px solid transparent;
		border-radius: var(--ui-radius);
		background: transparent;
		color: var(--text-color);
		font: inherit;
		text-align: left;
		cursor: pointer;
		transition:
			background 0.15s ease,
			border-color 0.15s ease;
	}

	.image-tile:hover:not(:disabled) {
		background: var(--hover-bg);
	}

	.image-tile:focus-visible {
		outline: 2px solid var(--ui-focus-color);
		outline-offset: 1px;
	}

	.image-tile.selected {
		background: var(--selected-bg);
		border-color: var(--ui-primary-text-color);
	}

	:global(.dark) .image-tile.selected {
		border-color: var(--ui-accent);
	}

	.image-tile:disabled {
		cursor: not-allowed;
		opacity: 0.6;
	}

	.image-tile-thumb {
		display: flex;
		align-items: center;
		justify-content: center;
		aspect-ratio: 4 / 3;
		overflow: hidden;
		border-radius: var(--ui-radius-sm);
		background: var(--page-bg);
		color: var(--text-muted);
	}

	.image-tile-thumb img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.image-tile-caption {
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
		min-width: 0;
	}

	.image-tile-name {
		font-size: 0.8125rem;
		font-weight: 500;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.image-tile-meta {
		font-size: 0.6875rem;
		color: var(--text-muted);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.image-picker-details {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 0.75rem;
		border: 1px solid var(--border-color);
		border-radius: var(--ui-radius-lg);
		font-size: 0.8125rem;
	}

	.image-picker-details-name {
		font-weight: 600;
		overflow-wrap: anywhere;
	}

	.image-picker-details dl {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 0.25rem 0.75rem;
		margin: 0;
	}

	.image-picker-details dt {
		color: var(--text-muted);
	}

	.image-picker-details dd {
		margin: 0;
		overflow-wrap: anywhere;
	}

	.muted {
		color: var(--text-muted);
	}

	.image-picker-keywords {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem;
	}
</style>
