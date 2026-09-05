<script lang="ts">
	export interface IconProps {
		/** Raw SVG HTML string. Do NOT use external/user input - it will be executed in the browser */
		svg: string;
		/** Stroke color for the icon */
		stroke?: string;
		/** Fill color for the icon */
		fill?: string;
		/** Size of the icon (width and height) */
		size?: string;
		/** Flip the icon horizontally */
		flip?: boolean;
		/** Additional CSS classes */
		class?: string;
	}

	let {
		svg,
		stroke = 'currentColor',
		fill = 'none',
		size = '',
		flip = false,
		class: classes = ''
	}: IconProps = $props();

	let sizeStyle = $derived(size ? `width:${size};height:${size};` : '');
</script>

<span style="--svg-stroke: {stroke}; --svg-fill: {fill}; {sizeStyle}" class:flip class="cu-icon {classes}">
	{@html svg}
</span>

<style>
	.cu-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}

	.cu-icon :global(svg) {
		width: 100%;
		height: 100%;
	}

	.cu-icon :global(svg:not(.icons-tabler-filled)) {
		stroke: var(--svg-stroke);
		fill: var(--svg-fill);
	}

	.flip {
		transform: scale(-1, 1);
	}

	.text-accent {
		stroke: var(--accent-color);
	}
</style>
