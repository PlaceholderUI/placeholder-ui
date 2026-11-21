import { ImageAsset } from '#lib/models/ImageAsset.js';

/** Inline SVG gradient so the demo needs no network or image files */
const gradientSvg = (label: string, width: number, height: number, from: string, to: string) =>
	'data:image/svg+xml;charset=utf-8,' +
	encodeURIComponent(
		`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" ` +
			`viewBox="0 0 ${width} ${height}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">` +
			`<stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/>` +
			`</linearGradient></defs><rect width="${width}" height="${height}" fill="url(#g)"/>` +
			`<text x="50%" y="50%" dominant-baseline="middle" font-family="sans-serif" ` +
			`font-size="${Math.round(Math.min(width, height) / 8)}" fill="#fff" ` +
			`text-anchor="middle">${label}</text></svg>`
	);

const sample = (
	fileName: string,
	label: string,
	alt: string,
	[width, height]: [number, number],
	[from, to]: [string, string],
	keywords: string[],
	date: string
) =>
	new ImageAsset({
		fileName,
		alt,
		href: gradientSvg(label, width, height, from, to),
		dimensions: { width, height },
		keywords,
		// No `type`: it is inferred from the file name. (The demo pixels are inline SVGs.)
		date
	});

export const sampleImages: ImageAsset[] = [
	sample(
		'sunrise-over-harbour.jpg',
		'Sunrise',
		'Pink and orange sky at sunrise',
		[1920, 1080],
		['#ff9a8b', '#ff6a88'],
		['sunrise', 'sky', 'morning', 'warm'],
		'2026-11-18T07:12:00Z'
	),
	sample(
		'ocean-swell.jpg',
		'Ocean',
		'Blue ocean water',
		[1600, 900],
		['#2193b0', '#6dd5ed'],
		['ocean', 'water', 'blue', 'beach'],
		'2026-10-02T03:40:00Z'
	),
	sample(
		'forest-canopy.png',
		'Forest',
		'Green forest canopy',
		[1080, 1350],
		['#11998e', '#38ef7d'],
		['forest', 'trees', 'green', 'nature'],
		'2026-09-14T22:05:00Z'
	),
	sample(
		'city-at-dusk.webp',
		'Dusk',
		'Purple city skyline at dusk',
		[2400, 1200],
		['#614385', '#516395'],
		['city', 'dusk', 'evening', 'purple'],
		'2026-11-20T09:30:00Z'
	),
	sample(
		'desert-dunes.jpg',
		'Sand',
		'Golden sand dunes',
		[1200, 1200],
		['#e6b980', '#eacda3'],
		['desert', 'sand', 'warm'],
		'2026-06-30T01:15:00Z'
	),
	sample(
		'team-offsite-banner.png',
		'Team',
		'',
		[1500, 500],
		['#485563', '#29323c'],
		['banner', 'team', 'event'],
		'2026-08-21T05:00:00Z'
	),
	sample(
		'product-hero.webp',
		'Product',
		'Product shot on a gradient background',
		[1280, 720],
		['#f7971e', '#ffd200'],
		['product', 'hero', 'marketing'],
		'2026-11-05T11:45:00Z'
	),
	sample(
		'logo-mark.svg',
		'Logo',
		'Company logo mark',
		[512, 512],
		['#1e3a5f', '#93c5fd'],
		['logo', 'brand', 'icon'],
		'2026-01-10T00:00:00Z'
	),
	sample(
		'portrait-headshot.jpg',
		'Portrait',
		'Headshot placeholder',
		[800, 1000],
		['#ee9ca7', '#ffdde1'],
		['people', 'portrait', 'headshot'],
		'2026-07-19T04:20:00Z'
	)
];
