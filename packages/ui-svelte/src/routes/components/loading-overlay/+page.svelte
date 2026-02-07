<script lang="ts">
	import { Table, LoadingOverlay, Paper, Button } from '$lib/index.js';
	import type { Column } from '$lib/index.js';

	let basicVisible = $state(false);
	let blurVisible = $state(false);
	let opacityVisible = $state(false);

	function showBasic() {
		basicVisible = true;
		setTimeout(() => (basicVisible = false), 2000);
	}

	function showBlur() {
		blurVisible = true;
		setTimeout(() => (blurVisible = false), 2000);
	}

	function showOpacity() {
		opacityVisible = true;
		setTimeout(() => (opacityVisible = false), 2000);
	}

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
		{ prop: 'visible', type: 'boolean', default: 'false', description: 'Controls overlay visibility' },
		{ prop: 'loaderSize', type: 'string', default: '\'40px\'', description: 'Size of the spinner' },
		{ prop: 'overlayOpacity', type: 'number', default: '0.75', description: 'Opacity of the background overlay' },
		{ prop: 'blur', type: 'number', default: '0', description: 'Backdrop blur in pixels' },
		{ prop: 'zIndex', type: 'number', default: '30', description: 'CSS z-index of the overlay' },
		{ prop: 'class', type: 'string', default: '\'\'', description: 'Additional CSS classes' },
	];
</script>

<h1>LoadingOverlay</h1>
<p>Overlay with a loader that covers a parent container. The parent must have <code>position: relative</code>.</p>

<div class="vstack">
	<Paper title="Basic Usage">
		<p>Click the button to show the overlay for 2 seconds.</p>
		<div class="overlay-container">
			<LoadingOverlay visible={basicVisible} />
			<div class="demo-content">
				<h3>Sample Content</h3>
				<p>This content is covered by the loading overlay when active.</p>
				<p>The overlay automatically positions itself over the nearest relative parent.</p>
				<Button variant="primary" onclick={showBasic}>Show Overlay</Button>
			</div>
		</div>
		<div class="value-display">visible: {basicVisible}</div>
	</Paper>

	<Paper title="With Blur">
		<div class="overlay-container">
			<LoadingOverlay visible={blurVisible} blur={2} />
			<div class="demo-content">
				<h3>Blurred Content</h3>
				<p>When blur is applied, the content behind the overlay becomes blurred.</p>
				<p>This provides a stronger visual indication that the content is loading.</p>
				<Button variant="primary" onclick={showBlur}>Show Blurred Overlay</Button>
			</div>
		</div>
		<div class="value-display">visible: {blurVisible}, blur: 2</div>
	</Paper>

	<Paper title="Custom Opacity">
		<div class="overlay-container">
			<LoadingOverlay visible={opacityVisible} overlayOpacity={0.5} />
			<div class="demo-content">
				<h3>Reduced Opacity</h3>
				<p>The overlay opacity can be customized. A lower value makes the content more visible underneath.</p>
				<p>Default opacity is 0.75. This demo uses 0.5.</p>
				<Button variant="primary" onclick={showOpacity}>Show Low Opacity Overlay</Button>
			</div>
		</div>
		<div class="value-display">visible: {opacityVisible}, overlayOpacity: 0.5</div>
	</Paper>

	<Paper title="Custom Loader Size">
		<div class="demo-row">
			<div class="overlay-container overlay-small">
				<LoadingOverlay visible={true} loaderSize="24px" />
				<div class="demo-content-mini">
					<p>24px</p>
				</div>
			</div>
			<div class="overlay-container overlay-small">
				<LoadingOverlay visible={true} loaderSize="40px" />
				<div class="demo-content-mini">
					<p>40px</p>
				</div>
			</div>
			<div class="overlay-container overlay-small">
				<LoadingOverlay visible={true} loaderSize="60px" />
				<div class="demo-content-mini">
					<p>60px</p>
				</div>
			</div>
		</div>
	</Paper>

	<Paper title="Props">
		<Table columns={propsColumns} rows={propsRows} striped hover={false} />
	</Paper>
</div>

<style>
	h1 { margin-bottom: 0.5rem; }
	p { color: var(--pui-color-text-secondary); margin-bottom: 1.5rem; }
	.demo-row { display: flex; flex-wrap: wrap; gap: 0.75rem; align-items: center; }
	.value-display { font-size: 0.875rem; color: var(--pui-color-text-muted); font-family: monospace; margin-top: 0.5rem; }
	.overlay-container {
		position: relative;
		border: 1px solid var(--pui-color-border);
		border-radius: var(--pui-radius-md);
		overflow: hidden;
	}
	.overlay-small {
		width: 150px;
		height: 150px;
	}
	.demo-content {
		padding: 1.5rem;
	}
	.demo-content h3 {
		margin: 0 0 0.5rem 0;
	}
	.demo-content p {
		margin-bottom: 0.5rem;
	}
	.demo-content-mini {
		padding: 1rem;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
	}
	.demo-content-mini p {
		margin: 0;
		opacity: 0.3;
	}</style>
