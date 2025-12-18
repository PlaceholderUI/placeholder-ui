<script lang="ts">
	/** Raw HTML. Do NOT retrieve this from external sources; it will be executed in the browser */
	interface Props {
		svg: string;
		stroke?: string;
		fill?: string;
		size?: string;
		flip?: boolean;
		class?: string;
	}

	let {
		svg,
		stroke = 'currentColor',
		fill = 'none',
		size = '',
		flip = false,
		class: classes = ''
	}: Props = $props();

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
