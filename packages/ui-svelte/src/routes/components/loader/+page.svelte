<script lang="ts">
	import { Loader, Paper, Button } from '$lib/index.js';

	let fullScreen = $state(false);

	function showFullScreen() {
		fullScreen = true;
		setTimeout(() => (fullScreen = false), 2000);
	}
</script>

<h1>Loader</h1>
<p>Spinner indicator for loading states. Can be used inline or as a full-screen overlay.</p>

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
	<table class="props-table">
		<thead>
			<tr>
				<th>Prop</th>
				<th>Type</th>
				<th>Default</th>
				<th>Description</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>fullScreen</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Covers the entire screen with an overlay</td>
			</tr>
			<tr>
				<td><code>sizeOverride</code></td>
				<td><code>string</code></td>
				<td><code>'50px'</code></td>
				<td>Custom icon size</td>
			</tr>
			<tr>
				<td><code>class</code></td>
				<td><code>string</code></td>
				<td><code>''</code></td>
				<td>Additional CSS classes</td>
			</tr>
		</tbody>
	</table>
</Paper>

<style>
	h1 { margin-bottom: 0.5rem; }
	p { color: var(--pui-color-text-secondary); margin-bottom: 1.5rem; }
	.demo-row { display: flex; flex-wrap: wrap; gap: 0.75rem; align-items: center; }
	.value-display { font-size: 0.875rem; color: var(--pui-color-text-muted); font-family: monospace; margin-top: 0.5rem; }
	.props-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
	.props-table th, .props-table td { text-align: left; padding: 0.75rem; border-bottom: 1px solid var(--pui-color-border); }
	.props-table th { font-weight: 600; background: var(--pui-color-bg-secondary); }
	.props-table code { background: var(--pui-color-bg-tertiary); padding: 0.125rem 0.375rem; border-radius: 4px; font-size: 0.8125rem; }
</style>
