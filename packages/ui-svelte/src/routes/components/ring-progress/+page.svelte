<script lang="ts">
	import { RingProgress, Paper, Button } from '$lib/index.js';

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
				<td><code>value</code></td>
				<td><code>number</code></td>
				<td><code>0</code></td>
				<td>Progress percentage (0-100)</td>
			</tr>
			<tr>
				<td><code>size</code></td>
				<td><code>number</code></td>
				<td><code>120</code></td>
				<td>Diameter in pixels</td>
			</tr>
			<tr>
				<td><code>thickness</code></td>
				<td><code>number</code></td>
				<td><code>8</code></td>
				<td>Stroke width in pixels</td>
			</tr>
			<tr>
				<td><code>roundCaps</code></td>
				<td><code>boolean</code></td>
				<td><code>true</code></td>
				<td>Use rounded stroke ends</td>
			</tr>
			<tr>
				<td><code>color</code></td>
				<td><code>'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger' | string</code></td>
				<td><code>'primary'</code></td>
				<td>Stroke color</td>
			</tr>
			<tr>
				<td><code>sections</code></td>
				<td><code>Section[]</code></td>
				<td><code>[]</code></td>
				<td>Multiple colored sections: <code>{'{ value: number; color: string }'}</code></td>
			</tr>
			<tr>
				<td><code>label</code></td>
				<td><code>Snippet</code></td>
				<td><code>undefined</code></td>
				<td>Content rendered in the center</td>
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
	.ring-demo { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; }
	.ring-label-text { font-size: 1.25rem; font-weight: 700; }
	.props-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
	.props-table th, .props-table td { text-align: left; padding: 0.75rem; border-bottom: 1px solid var(--pui-color-border); }
	.props-table th { font-weight: 600; background: var(--pui-color-bg-secondary); }
	.props-table code { background: var(--pui-color-bg-tertiary); padding: 0.125rem 0.375rem; border-radius: 4px; font-size: 0.8125rem; }
</style>
