/** Pixel size of an image */
export interface ImageDimensions {
	width: number;
	height: number;
}

/** Plain-object shape accepted by the `ImageAsset` constructor (e.g. straight from an API) */
export interface ImageAssetInit {
	/** File name including extension, e.g. `team-photo.jpg` */
	fileName: string;
	/** URL the image is served from */
	href: string;
	/** Alternative text describing the image. Empty means decorative. */
	alt?: string;
	/** Pixel size, when known */
	dimensions?: ImageDimensions | null;
	/** Search keywords / tags */
	keywords?: string[];
	/** MIME type, e.g. `image/png`. Inferred from the file extension when omitted. */
	type?: string;
	/** When the image was created or uploaded. Accepts a Date, ISO string or timestamp. */
	date?: Date | string | number | null;
}

/** JSON-safe form of an `ImageAsset` (the date is an ISO string) */
export interface ImageAssetJSON {
	fileName: string;
	href: string;
	alt: string;
	dimensions: ImageDimensions | null;
	keywords: string[];
	type: string;
	date: string | null;
}

/** Image attributes ready to insert into an `<img>` or a TipTap editor */
export interface ImageAssetImgAttrs {
	src: string;
	alt?: string;
	title?: string;
}

export type ImageOrientation = 'landscape' | 'portrait' | 'square';

const MIME_BY_EXTENSION: Record<string, string> = {
	apng: 'image/apng',
	avif: 'image/avif',
	bmp: 'image/bmp',
	gif: 'image/gif',
	ico: 'image/x-icon',
	jpeg: 'image/jpeg',
	jpg: 'image/jpeg',
	jfif: 'image/jpeg',
	png: 'image/png',
	svg: 'image/svg+xml',
	tif: 'image/tiff',
	tiff: 'image/tiff',
	webp: 'image/webp'
};

/** Short display labels for MIME types whose subtype isn't a good label on its own */
const TYPE_LABELS: Record<string, string> = {
	'image/jpeg': 'JPG',
	'image/svg+xml': 'SVG',
	'image/x-icon': 'ICO'
};

const toDate = (value: Date | string | number | null | undefined): Date | null => {
	if (value === null || value === undefined || value === '') return null;
	const date = value instanceof Date ? new Date(value.getTime()) : new Date(value);
	return isNaN(date.getTime()) ? null : date;
};

/**
 * An image in an app's library: what it is, where it lives and how to find it.
 * Use it with `ImagePicker` / `ImagePickerDialog`, and pass it straight back to
 * TipTap's `onImagePick`.
 *
 * ```ts
 * const images = (await api.getImages()).map((json) => new ImageAsset(json));
 * ```
 */
export class ImageAsset {
	/** File name including extension, e.g. `team-photo.jpg` */
	fileName: string;
	/** Alternative text describing the image. Empty means decorative. */
	alt: string;
	/** URL the image is served from */
	href: string;
	/** Pixel size, or null when unknown */
	dimensions: ImageDimensions | null;
	/** Search keywords / tags */
	keywords: string[];
	/** MIME type, e.g. `image/png` (empty when it can't be determined) */
	type: string;
	/** When the image was created or uploaded, or null when unknown */
	date: Date | null;

	constructor(init: ImageAssetInit) {
		this.fileName = init.fileName;
		this.href = init.href;
		this.alt = init.alt ?? '';
		this.dimensions = init.dimensions ? { ...init.dimensions } : null;
		this.keywords = init.keywords ? [...init.keywords] : [];
		this.type = init.type || ImageAsset.typeFromFileName(init.fileName);
		this.date = toDate(init.date);
	}

	/** Lower-case file extension without the dot, e.g. `jpg` (empty when there is none) */
	get extension(): string {
		const dot = this.fileName.lastIndexOf('.');
		return dot > 0 ? this.fileName.slice(dot + 1).toLowerCase() : '';
	}

	/** Short upper-case format label for display, e.g. `PNG`, `JPG`, `SVG` */
	get typeLabel(): string {
		if (TYPE_LABELS[this.type]) return TYPE_LABELS[this.type];
		const subtype = this.type.split('/')[1];
		return (subtype || this.extension).toUpperCase();
	}

	/** Width divided by height, or null when the dimensions are unknown */
	get aspectRatio(): number | null {
		if (!this.dimensions || !this.dimensions.height) return null;
		return this.dimensions.width / this.dimensions.height;
	}

	/** Landscape, portrait or square, or null when the dimensions are unknown */
	get orientation(): ImageOrientation | null {
		const ratio = this.aspectRatio;
		if (ratio === null) return null;
		if (ratio === 1) return 'square';
		return ratio > 1 ? 'landscape' : 'portrait';
	}

	/** Dimensions formatted for display, e.g. `1920 × 1080` (empty when unknown) */
	get dimensionsLabel(): string {
		return this.dimensions ? `${this.dimensions.width} × ${this.dimensions.height}` : '';
	}

	/**
	 * Case-insensitive search across file name, alt text, keywords and type.
	 * Every whitespace-separated term must match somewhere. An empty query matches.
	 */
	matches(query: string): boolean {
		const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
		if (terms.length === 0) return true;
		const haystack = [this.fileName, this.alt, this.type, this.typeLabel, ...this.keywords]
			.join(' ')
			.toLowerCase();
		return terms.every((term) => haystack.includes(term));
	}

	/** Attributes for an `<img>` element or TipTap's `setImage` */
	toImgAttrs(): ImageAssetImgAttrs {
		return {
			src: this.href,
			alt: this.alt || undefined,
			title: this.alt || this.fileName
		};
	}

	/** Copy of this image with some fields changed */
	with(changes: Partial<ImageAssetInit>): ImageAsset {
		return new ImageAsset({ ...this.toInit(), ...changes });
	}

	/** JSON-safe representation; also used by `JSON.stringify` */
	toJSON(): ImageAssetJSON {
		return {
			fileName: this.fileName,
			href: this.href,
			alt: this.alt,
			dimensions: this.dimensions ? { ...this.dimensions } : null,
			keywords: [...this.keywords],
			type: this.type,
			date: this.date ? this.date.toISOString() : null
		};
	}

	private toInit(): ImageAssetInit {
		return { ...this.toJSON(), date: this.date };
	}

	/** Build an `ImageAsset` from a plain object, or return it unchanged if it already is one */
	static from(value: ImageAsset | ImageAssetInit): ImageAsset {
		return value instanceof ImageAsset ? value : new ImageAsset(value);
	}

	/** MIME type for a file name's extension, or an empty string when unrecognised */
	static typeFromFileName(fileName: string): string {
		const dot = fileName.lastIndexOf('.');
		if (dot <= 0) return '';
		return MIME_BY_EXTENSION[fileName.slice(dot + 1).toLowerCase()] ?? '';
	}

	/**
	 * Build an `ImageAsset` for a file the user picked or uploaded, reading its name,
	 * type, last-modified date and (in the browser) pixel dimensions. `href` is where
	 * the file now lives, e.g. the URL your upload endpoint returned.
	 */
	static async fromFile(
		file: File,
		href: string,
		extra: Partial<Omit<ImageAssetInit, 'href'>> = {}
	): Promise<ImageAsset> {
		return new ImageAsset({
			fileName: file.name,
			href,
			type: file.type || undefined,
			date: file.lastModified ? new Date(file.lastModified) : new Date(),
			dimensions: await readDimensions(file),
			...extra
		});
	}
}

/** Read an image file's pixel size, or null outside the browser or for unreadable files */
async function readDimensions(file: File): Promise<ImageDimensions | null> {
	if (typeof createImageBitmap === 'function') {
		try {
			const bitmap = await createImageBitmap(file);
			const dimensions = { width: bitmap.width, height: bitmap.height };
			bitmap.close();
			return dimensions;
		} catch {
			// Fall through: some formats (e.g. SVG) can't be decoded by createImageBitmap
		}
	}
	if (typeof document === 'undefined' || typeof URL.createObjectURL !== 'function') return null;

	const url = URL.createObjectURL(file);
	try {
		return await new Promise<ImageDimensions | null>((resolve) => {
			const img = new Image();
			img.onload = () =>
				resolve(img.naturalWidth ? { width: img.naturalWidth, height: img.naturalHeight } : null);
			img.onerror = () => resolve(null);
			img.src = url;
		});
	} finally {
		URL.revokeObjectURL(url);
	}
}
