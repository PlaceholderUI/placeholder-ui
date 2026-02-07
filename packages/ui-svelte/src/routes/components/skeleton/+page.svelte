<script lang="ts">
	import { Table, Skeleton, Paper, Button } from '$lib/index.js';
	import type { Column } from '$lib/index.js';

	let visible = $state(true);

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
		{ prop: 'width', type: 'string', default: '\'100%\'', description: 'Element width' },
		{ prop: 'height', type: 'string', default: '\'1rem\'', description: 'Element height' },
		{ prop: 'circle', type: 'boolean', default: 'false', description: 'Renders as a circle (sets border-radius: full)' },
		{ prop: 'radius', type: '\'none\' | \'sm\' | \'md\' | \'lg\' | \'xl\' | \'full\'', default: '\'md\'', description: 'Border radius' },
		{ prop: 'animate', type: 'boolean', default: 'true', description: 'Enable pulse animation' },
		{ prop: 'visible', type: 'boolean', default: 'true', description: 'Controls visibility' },
		{ prop: 'class', type: 'string', default: '\'\'', description: 'Additional CSS classes' },
	];
</script>

<h1>Skeleton</h1>
<p>Placeholder loading indicator that mimics content layout while data is being fetched.</p>

<div class="vstack">
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
		<Table columns={propsColumns} rows={propsRows} striped hover={false} />
	</Paper>
</div>

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
	.placeholder-text { display: flex; flex-direction: column; gap: 0.5rem; }</style>
