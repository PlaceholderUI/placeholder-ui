<script lang="ts">
	import { Progress, Paper, Button } from '$lib/index.js';

	let value = $state(40);

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

<h1>Progress</h1>
<p>Visual progress indicator bar. Supports sizes, colors, striped patterns, and labels.</p>

<Paper title="Basic Usage">
	<Progress {value} />
	<div class="demo-row" style="margin-top: 1rem;">
		<Button variant="primary" size="sm" onclick={increment}>+10</Button>
		<Button variant="secondary" size="sm" onclick={decrement}>-10</Button>
		<Button variant="muted" size="sm" onclick={reset}>Reset</Button>
	</div>
	<div class="value-display">Value: {value}%</div>
</Paper>

<Paper title="Sizes">
	<div class="demo-grid">
		<div class="progress-demo">
			<span class="size-label">xs</span>
			<Progress value={60} size="xs" />
		</div>
		<div class="progress-demo">
			<span class="size-label">sm</span>
			<Progress value={60} size="sm" />
		</div>
		<div class="progress-demo">
			<span class="size-label">md</span>
			<Progress value={60} size="md" />
		</div>
		<div class="progress-demo">
			<span class="size-label">lg</span>
			<Progress value={60} size="lg" />
		</div>
		<div class="progress-demo">
			<span class="size-label">xl</span>
			<Progress value={60} size="xl" />
		</div>
	</div>
</Paper>

<Paper title="Colors">
	<div class="demo-grid">
		<div class="progress-demo">
			<Progress value={70} color="primary" />
			<span class="value-display">primary</span>
		</div>
		<div class="progress-demo">
			<Progress value={70} color="secondary" />
			<span class="value-display">secondary</span>
		</div>
		<div class="progress-demo">
			<Progress value={70} color="accent" />
			<span class="value-display">accent</span>
		</div>
		<div class="progress-demo">
			<Progress value={70} color="success" />
			<span class="value-display">success</span>
		</div>
		<div class="progress-demo">
			<Progress value={70} color="warning" />
			<span class="value-display">warning</span>
		</div>
		<div class="progress-demo">
			<Progress value={70} color="danger" />
			<span class="value-display">danger</span>
		</div>
	</div>
</Paper>

<Paper title="Striped & Animated">
	<div class="demo-grid">
		<div class="progress-demo">
			<Progress value={65} striped />
			<span class="value-display">Striped</span>
		</div>
		<div class="progress-demo">
			<Progress value={65} striped animated />
			<span class="value-display">Striped + Animated</span>
		</div>
		<div class="progress-demo">
			<Progress value={65} striped animated color="success" />
			<span class="value-display">Animated Success</span>
		</div>
		<div class="progress-demo">
			<Progress value={65} striped animated color="danger" />
			<span class="value-display">Animated Danger</span>
		</div>
	</div>
</Paper>

<Paper title="With Label and Value">
	<div class="demo-grid">
		<div class="progress-demo">
			<Progress value={45} label="Uploading..." showValue />
		</div>
		<div class="progress-demo">
			<Progress value={78} label="Processing" showValue color="success" />
		</div>
		<div class="progress-demo">
			<Progress value={value} label="Interactive" showValue color="accent" size="lg" />
		</div>
	</div>
</Paper>

<Paper title="Radius Variants">
	<div class="demo-grid">
		<div class="progress-demo">
			<Progress value={50} radius="none" />
			<span class="value-display">none</span>
		</div>
		<div class="progress-demo">
			<Progress value={50} radius="sm" />
			<span class="value-display">sm</span>
		</div>
		<div class="progress-demo">
			<Progress value={50} radius="md" />
			<span class="value-display">md</span>
		</div>
		<div class="progress-demo">
			<Progress value={50} radius="lg" />
			<span class="value-display">lg</span>
		</div>
		<div class="progress-demo">
			<Progress value={50} radius="full" />
			<span class="value-display">full (default)</span>
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
				<td>Current progress value</td>
			</tr>
			<tr>
				<td><code>max</code></td>
				<td><code>number</code></td>
				<td><code>100</code></td>
				<td>Maximum value</td>
			</tr>
			<tr>
				<td><code>size</code></td>
				<td><code>'xs' | 'sm' | 'md' | 'lg' | 'xl'</code></td>
				<td><code>'md'</code></td>
				<td>Height of the progress bar</td>
			</tr>
			<tr>
				<td><code>color</code></td>
				<td><code>'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger'</code></td>
				<td><code>'primary'</code></td>
				<td>Bar color</td>
			</tr>
			<tr>
				<td><code>striped</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Adds striped pattern</td>
			</tr>
			<tr>
				<td><code>animated</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Animates the stripe pattern (requires striped)</td>
			</tr>
			<tr>
				<td><code>label</code></td>
				<td><code>string</code></td>
				<td><code>undefined</code></td>
				<td>Label text shown above the bar</td>
			</tr>
			<tr>
				<td><code>showValue</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Displays percentage value</td>
			</tr>
			<tr>
				<td><code>radius</code></td>
				<td><code>'none' | 'sm' | 'md' | 'lg' | 'full'</code></td>
				<td><code>'full'</code></td>
				<td>Border radius of the bar</td>
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
	.progress-demo { display: flex; flex-direction: column; gap: 0.25rem; }
	.size-label { font-size: 0.8125rem; font-weight: 600; color: var(--pui-color-text-secondary); }
	.props-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
	.props-table th, .props-table td { text-align: left; padding: 0.75rem; border-bottom: 1px solid var(--pui-color-border); }
	.props-table th { font-weight: 600; background: var(--pui-color-bg-secondary); }
	.props-table code { background: var(--pui-color-bg-tertiary); padding: 0.125rem 0.375rem; border-radius: 4px; font-size: 0.8125rem; }
</style>
