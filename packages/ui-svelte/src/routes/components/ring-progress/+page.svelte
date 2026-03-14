<script lang="ts">
	import { Table, RingProgress, Paper, Button } from '$lib/index.js';
	import type { Column } from '$lib/index.js';

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
		{ prop: 'value', type: 'number', default: '0', description: 'Progress percentage (0-100)' },
		{ prop: 'size', type: 'number', default: '120', description: 'Diameter in pixels' },
		{ prop: 'thickness', type: 'number', default: '8', description: 'Stroke width in pixels' },
		{ prop: 'roundCaps', type: 'boolean', default: 'true', description: 'Use rounded stroke ends' },
		{ prop: 'color', type: '\'primary\' | \'secondary\' | \'accent\' | \'success\' | \'warning\' | \'danger\' | string', default: '\'primary\'', description: 'Stroke color' },
		{ prop: 'sections', type: 'Section[]', default: '[]', description: 'Multiple colored sections: { value: number; color: string }' },
		{ prop: 'label', type: 'Snippet', default: 'undefined', description: 'Content rendered in the center' },
		{ prop: 'class', type: 'string', default: '\'\'', description: 'Additional CSS classes' },
	];

	let value = $state(65);

	function increment() {
		value = Math.min(100, value + 10);
	}

	function decrement() {
		value = Math.max(0, value - 10);
	}

	function reset() {
		value = 0;
	}
</script>

<h1>RingProgress</h1>
<p>Circular progress indicator with optional label. Supports single value or multiple colored sections.</p>

<div class="vstack">
	<Paper title="Basic Usage">
		<div class="demo-row">
			<RingProgress {value} />
			<div>
				<div class="demo-row">
					<Button variant="primary" size="sm" onclick={increment}>+10</Button>
					<Button variant="secondary" size="sm" onclick={decrement}>-10</Button>
					<Button variant="muted" size="sm" onclick={reset}>Reset</Button>
				</div>
				<div class="value-display">Value: {value}%</div>
			</div>
		</div>
	</Paper>

	<Paper title="Sizes">
		<div class="demo-row">
			<div class="ring-demo">
				<RingProgress value={75} size={80} />
				<span class="value-display">80px</span>
			</div>
			<div class="ring-demo">
				<RingProgress value={75} size={120} />
				<span class="value-display">120px (default)</span>
			</div>
			<div class="ring-demo">
				<RingProgress value={75} size={160} />
				<span class="value-display">160px</span>
			</div>
			<div class="ring-demo">
				<RingProgress value={75} size={200} />
				<span class="value-display">200px</span>
			</div>
		</div>
	</Paper>

	<Paper title="Colors">
		<div class="demo-row">
			<div class="ring-demo">
				<RingProgress value={70} color="primary" />
				<span class="value-display">primary</span>
			</div>
			<div class="ring-demo">
				<RingProgress value={70} color="secondary" />
				<span class="value-display">secondary</span>
			</div>
			<div class="ring-demo">
				<RingProgress value={70} color="accent" />
				<span class="value-display">accent</span>
			</div>
			<div class="ring-demo">
				<RingProgress value={70} color="success" />
				<span class="value-display">success</span>
			</div>
			<div class="ring-demo">
				<RingProgress value={70} color="warning" />
				<span class="value-display">warning</span>
			</div>
			<div class="ring-demo">
				<RingProgress value={70} color="danger" />
				<span class="value-display">danger</span>
			</div>
		</div>
	</Paper>

	<Paper title="Custom Thickness">
		<div class="demo-row">
			<div class="ring-demo">
				<RingProgress value={60} thickness={4} />
				<span class="value-display">4px</span>
			</div>
			<div class="ring-demo">
				<RingProgress value={60} thickness={8} />
				<span class="value-display">8px (default)</span>
			</div>
			<div class="ring-demo">
				<RingProgress value={60} thickness={14} />
				<span class="value-display">14px</span>
			</div>
			<div class="ring-demo">
				<RingProgress value={60} thickness={20} />
				<span class="value-display">20px</span>
			</div>
		</div>
	</Paper>

	<Paper title="Round Caps">
		<div class="demo-row">
			<div class="ring-demo">
				<RingProgress value={50} roundCaps={true} thickness={12} />
				<span class="value-display">roundCaps: true</span>
			</div>
			<div class="ring-demo">
				<RingProgress value={50} roundCaps={false} thickness={12} />
				<span class="value-display">roundCaps: false</span>
			</div>
		</div>
	</Paper>

	<Paper title="With Label">
		<div class="demo-row">
			<RingProgress value={value} size={140} thickness={10}>
				{#snippet label()}
					<span class="ring-label-text">{value}%</span>
				{/snippet}
			</RingProgress>
			<RingProgress value={85} size={140} thickness={10} color="success">
				{#snippet label()}
					<span class="ring-label-text" style="color: var(--pui-color-success);">85%</span>
				{/snippet}
			</RingProgress>
			<RingProgress value={23} size={140} thickness={10} color="danger">
				{#snippet label()}
					<span class="ring-label-text" style="color: var(--pui-color-danger);">23%</span>
				{/snippet}
			</RingProgress>
		</div>
	</Paper>

	<Paper title="Multiple Sections">
		<div class="demo-row">
			<div class="ring-demo">
				<RingProgress
					size={160}
					thickness={12}
					sections={[
						{ value: 30, color: 'primary' },
						{ value: 25, color: 'accent' },
						{ value: 20, color: 'warning' }
					]}
				>
					{#snippet label()}
						<span class="ring-label-text">75%</span>
					{/snippet}
				</RingProgress>
				<span class="value-display">3 sections</span>
			</div>
			<div class="ring-demo">
				<RingProgress
					size={160}
					thickness={12}
					sections={[
						{ value: 40, color: 'success' },
						{ value: 30, color: 'warning' },
						{ value: 20, color: 'danger' }
					]}
				>
					{#snippet label()}
						<span class="ring-label-text">90%</span>
					{/snippet}
				</RingProgress>
				<span class="value-display">Status breakdown</span>
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
	.ring-demo { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; }
	.ring-label-text { font-size: 1.25rem; font-weight: 700; }</style>
