<script lang="ts">
	import { Table, Loader, Paper, Button } from '$lib/index.js';
	import type { Column } from '$lib/index.js';

	let fullScreen = $state(false);

	function showFullScreen() {
		fullScreen = true;
		setTimeout(() => (fullScreen = false), 2000);
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
		{ prop: 'fullScreen', type: 'boolean', default: 'false', description: 'Covers the entire screen with an overlay' },
		{ prop: 'sizeOverride', type: 'string', default: '\'50px\'', description: 'Custom icon size' },
		{ prop: 'class', type: 'string', default: '\'\'', description: 'Additional CSS classes' },
	];
</script>

<h1>Loader</h1>
<p>Spinner indicator for loading states. Can be used inline or as a full-screen overlay.</p>

<div class="vstack">
	<Paper title="Default">
		<div class="demo-row">
			<Loader />
		</div>
	</Paper>

	<Paper title="Custom Size">
		<div class="demo-row">
			<Loader sizeOverride="24px" />
			<Loader sizeOverride="36px" />
			<Loader sizeOverride="50px" />
			<Loader sizeOverride="80px" />
		</div>
		<div class="value-display">Sizes: 24px, 36px, 50px (default), 80px</div>
	</Paper>

	<Paper title="Full Screen">
		<p>Click the button below to show a full-screen loader for 2 seconds.</p>
		<Button onclick={showFullScreen} variant="primary">
			Show Full Screen Loader
		</Button>
		<div class="value-display">fullScreen: {fullScreen}</div>
	</Paper>

	{#if fullScreen}
		<Loader fullScreen />
	{/if}

	<Paper title="Inline Usage">
		<div class="demo-row">
			<span>Loading data</span>
			<Loader sizeOverride="20px" />
		</div>
		<div class="demo-row" style="margin-top: 1rem;">
			<Button loading variant="primary">Loading Button</Button>
			<Button loading variant="secondary">Loading Button</Button>
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
	.value-display { font-size: 0.875rem; color: var(--pui-color-text-muted); font-family: monospace; margin-top: 0.5rem; }</style>
