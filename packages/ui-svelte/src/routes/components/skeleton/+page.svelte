<script lang="ts">
	import { Skeleton, Paper, Button } from '$lib/index.js';

	let visible = $state(true);
</script>

<h1>Skeleton</h1>
<p>Placeholder loading indicator that mimics content layout while data is being fetched.</p>

<Paper title="Default">
	<div class="demo-grid">
		<Skeleton />
		<Skeleton />
		<Skeleton width="75%" />
		<Skeleton width="50%" />
	</div>
</Paper>

<Paper title="Different Sizes">
	<div class="demo-grid">
		<Skeleton height="0.5rem" />
		<Skeleton height="1rem" />
		<Skeleton height="1.5rem" />
		<Skeleton height="2rem" />
		<Skeleton height="3rem" />
		<Skeleton height="100px" width="100%" />
	</div>
	<div class="value-display">Heights: 0.5rem, 1rem (default), 1.5rem, 2rem, 3rem, 100px</div>
</Paper>

<Paper title="Circle">
	<div class="demo-row">
		<Skeleton circle width="32px" height="32px" />
		<Skeleton circle width="48px" height="48px" />
		<Skeleton circle width="64px" height="64px" />
		<Skeleton circle width="96px" height="96px" />
	</div>
	<div class="value-display">Circle sizes: 32px, 48px, 64px, 96px</div>
</Paper>

<Paper title="Radius Variants">
	<div class="demo-grid">
		<div class="skeleton-row">
			<span class="size-label">none</span>
			<Skeleton height="2rem" radius="none" />
		</div>
		<div class="skeleton-row">
			<span class="size-label">sm</span>
			<Skeleton height="2rem" radius="sm" />
		</div>
		<div class="skeleton-row">
			<span class="size-label">md (default)</span>
			<Skeleton height="2rem" radius="md" />
		</div>
		<div class="skeleton-row">
			<span class="size-label">lg</span>
			<Skeleton height="2rem" radius="lg" />
		</div>
		<div class="skeleton-row">
			<span class="size-label">full</span>
			<Skeleton height="2rem" radius="full" />
		</div>
	</div>
</Paper>

<Paper title="No Animation">
	<div class="demo-grid">
		<Skeleton animate={false} />
		<Skeleton animate={false} width="60%" />
		<Skeleton animate={false} height="3rem" />
	</div>
	<div class="value-display">animate: false</div>
</Paper>

<Paper title="Toggle Visibility">
	<Button variant="primary" size="sm" onclick={() => (visible = !visible)}>
		{visible ? 'Hide Skeletons' : 'Show Skeletons'}
	</Button>
	<div class="demo-grid" style="margin-top: 1rem;">
		<Skeleton {visible} />
		<Skeleton {visible} width="80%" />
		<Skeleton {visible} width="60%" />
	</div>
	<div class="value-display">visible: {visible}</div>
</Paper>

<Paper title="Content Placeholder Example">
	<div class="content-placeholder">
		<div class="placeholder-header">
			<Skeleton circle width="48px" height="48px" />
			<div class="placeholder-text">
				<Skeleton height="1rem" width="150px" />
				<Skeleton height="0.75rem" width="100px" />
			</div>
		</div>
		<Skeleton height="1rem" />
		<Skeleton height="1rem" />
		<Skeleton height="1rem" width="75%" />
		<Skeleton height="200px" />
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
				<td><code>width</code></td>
				<td><code>string</code></td>
				<td><code>'100%'</code></td>
				<td>Element width</td>
			</tr>
			<tr>
				<td><code>height</code></td>
				<td><code>string</code></td>
				<td><code>'1rem'</code></td>
				<td>Element height</td>
			</tr>
			<tr>
				<td><code>circle</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Renders as a circle (sets border-radius: full)</td>
			</tr>
			<tr>
				<td><code>radius</code></td>
				<td><code>'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'</code></td>
				<td><code>'md'</code></td>
				<td>Border radius</td>
			</tr>
			<tr>
				<td><code>animate</code></td>
				<td><code>boolean</code></td>
				<td><code>true</code></td>
				<td>Enable pulse animation</td>
			</tr>
			<tr>
				<td><code>visible</code></td>
				<td><code>boolean</code></td>
				<td><code>true</code></td>
				<td>Controls visibility</td>
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
	.demo-grid { display: flex; flex-direction: column; gap: 1rem; }
	.value-display { font-size: 0.875rem; color: var(--pui-color-text-muted); font-family: monospace; margin-top: 0.5rem; }
	.skeleton-row { display: flex; flex-direction: column; gap: 0.25rem; }
	.size-label { font-size: 0.8125rem; font-weight: 600; color: var(--pui-color-text-secondary); }
	.content-placeholder { display: flex; flex-direction: column; gap: 0.75rem; }
	.placeholder-header { display: flex; gap: 0.75rem; align-items: center; }
	.placeholder-text { display: flex; flex-direction: column; gap: 0.5rem; }
	.props-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
	.props-table th, .props-table td { text-align: left; padding: 0.75rem; border-bottom: 1px solid var(--pui-color-border); }
	.props-table th { font-weight: 600; background: var(--pui-color-bg-secondary); }
	.props-table code { background: var(--pui-color-bg-tertiary); padding: 0.125rem 0.375rem; border-radius: 4px; font-size: 0.8125rem; }
</style>
