<script lang="ts">
	import { Slider, Paper } from '$lib/index.js';

	let basicValue = $state(50);
	let rangeValue = $state(20);
	let marksValue = $state(50);
	let sizeXs = $state(25);
	let sizeSm = $state(40);
	let sizeMd = $state(55);
	let sizeLg = $state(70);
	let sizeXl = $state(85);
	let colorPrimary = $state(50);
	let colorAccent = $state(50);
	let colorSuccess = $state(50);
	let colorWarning = $state(50);
	let colorDanger = $state(50);
	let disabledValue = $state(60);
	let labelValue = $state(30);
</script>

<h1>Slider</h1>
<p>Range slider input for selecting numeric values within a defined range.</p>

<Paper title="Basic Usage">
	<div class="form-grid">
		<Slider label="Volume" bind:value={basicValue} showValue />
		<div class="value-display">Value: {basicValue}</div>
	</div>
</Paper>

<Paper title="Custom Range (min=0, max=50, step=5)">
	<div class="form-grid">
		<Slider label="Quantity" bind:value={rangeValue} min={0} max={50} step={5} showValue />
		<div class="value-display">Value: {rangeValue}</div>
	</div>
</Paper>

<Paper title="With Marks">
	<div class="form-grid">
		<Slider label="Progress" bind:value={marksValue} marks={true} showValue />
		<div class="value-display">Value: {marksValue}</div>
	</div>
</Paper>

<Paper title="Label Always On">
	<div class="form-grid">
		<Slider label="Brightness" bind:value={labelValue} labelAlwaysOn />
	</div>
</Paper>

<Paper title="Sizes">
	<div class="form-grid">
		<Slider label="Extra Small" bind:value={sizeXs} size="xs" showValue />
		<Slider label="Small" bind:value={sizeSm} size="sm" showValue />
		<Slider label="Medium" bind:value={sizeMd} size="md" showValue />
		<Slider label="Large" bind:value={sizeLg} size="lg" showValue />
		<Slider label="Extra Large" bind:value={sizeXl} size="xl" showValue />
	</div>
</Paper>

<Paper title="Colors">
	<div class="form-grid">
		<Slider label="Primary" bind:value={colorPrimary} color="primary" showValue />
		<Slider label="Accent" bind:value={colorAccent} color="accent" showValue />
		<Slider label="Success" bind:value={colorSuccess} color="success" showValue />
		<Slider label="Warning" bind:value={colorWarning} color="warning" showValue />
		<Slider label="Danger" bind:value={colorDanger} color="danger" showValue />
	</div>
</Paper>

<Paper title="Disabled">
	<div class="form-grid">
		<Slider label="Locked" bind:value={disabledValue} disabled showValue />
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
				<td>Bindable slider value</td>
			</tr>
			<tr>
				<td><code>label</code></td>
				<td><code>string</code></td>
				<td><code>''</code></td>
				<td>Label text above slider</td>
			</tr>
			<tr>
				<td><code>min</code></td>
				<td><code>number</code></td>
				<td><code>0</code></td>
				<td>Minimum value</td>
			</tr>
			<tr>
				<td><code>max</code></td>
				<td><code>number</code></td>
				<td><code>100</code></td>
				<td>Maximum value</td>
			</tr>
			<tr>
				<td><code>step</code></td>
				<td><code>number</code></td>
				<td><code>1</code></td>
				<td>Step increment</td>
			</tr>
			<tr>
				<td><code>marks</code></td>
				<td><code>Mark[] | boolean</code></td>
				<td><code>false</code></td>
				<td>Show marks on the track. <code>true</code> generates default marks at 0/25/50/75/100%.</td>
			</tr>
			<tr>
				<td><code>showValue</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Shows current value above the slider</td>
			</tr>
			<tr>
				<td><code>labelAlwaysOn</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Always show the thumb label</td>
			</tr>
			<tr>
				<td><code>size</code></td>
				<td><code>'xs' | 'sm' | 'md' | 'lg' | 'xl'</code></td>
				<td><code>'md'</code></td>
				<td>Slider track and thumb size</td>
			</tr>
			<tr>
				<td><code>color</code></td>
				<td><code>'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger'</code></td>
				<td><code>'primary'</code></td>
				<td>Color of the filled track and thumb border</td>
			</tr>
			<tr>
				<td><code>radius</code></td>
				<td><code>'none' | 'sm' | 'md' | 'lg' | 'full'</code></td>
				<td><code>'full'</code></td>
				<td>Border radius of the track</td>
			</tr>
			<tr>
				<td><code>disabled</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Disables the slider</td>
			</tr>
			<tr>
				<td><code>required</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Shows required indicator</td>
			</tr>
			<tr>
				<td><code>showError</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Shows error styling</td>
			</tr>
			<tr>
				<td><code>errorText</code></td>
				<td><code>string</code></td>
				<td><code>''</code></td>
				<td>Error message text</td>
			</tr>
			<tr>
				<td><code>onchange</code></td>
				<td><code>(value: number) =&gt; void</code></td>
				<td><code>undefined</code></td>
				<td>Called when value changes (on release)</td>
			</tr>
			<tr>
				<td><code>oninput</code></td>
				<td><code>(value: number) =&gt; void</code></td>
				<td><code>undefined</code></td>
				<td>Called continuously while dragging</td>
			</tr>
		</tbody>
	</table>
</Paper>

<style>
	h1 { margin-bottom: 0.5rem; }
	p { color: var(--pui-color-text-secondary); margin-bottom: 1.5rem; }
	.form-grid { display: flex; flex-direction: column; gap: 1rem; max-width: 400px; }
	.value-display { font-size: 0.875rem; color: var(--pui-color-text-muted); font-family: monospace; margin-top: 0.5rem; }
	.props-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
	.props-table th, .props-table td { text-align: left; padding: 0.75rem; border-bottom: 1px solid var(--pui-color-border); }
	.props-table th { font-weight: 600; background: var(--pui-color-bg-secondary); }
	.props-table code { background: var(--pui-color-bg-tertiary); padding: 0.125rem 0.375rem; border-radius: 4px; font-size: 0.8125rem; }
</style>
