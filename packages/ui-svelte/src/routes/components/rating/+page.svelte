<script lang="ts">
	import { Rating, Paper } from '$lib/index.js';

	let basicValue = $state(0);
	let sizeXs = $state(2);
	let sizeSm = $state(3);
	let sizeMd = $state(4);
	let sizeLg = $state(3);
	let sizeXl = $state(5);
	let colorPrimary = $state(3);
	let colorSecondary = $state(3);
	let colorAccent = $state(3);
	let colorWarning = $state(3);
	let readOnlyValue = $state(3.5);
	let halfValue = $state(0);
	let customCountValue = $state(0);
</script>

<h1>Rating</h1>
<p>Star rating component for collecting user feedback with fractional precision support.</p>

<Paper title="Basic Usage">
	<div class="form-grid">
		<Rating label="Rating" bind:value={basicValue} />
		<div class="value-display">Value: {basicValue}</div>
	</div>
</Paper>

<Paper title="Sizes">
	<div class="form-grid">
		<Rating label="Extra Small" bind:value={sizeXs} size="xs" />
		<Rating label="Small" bind:value={sizeSm} size="sm" />
		<Rating label="Medium" bind:value={sizeMd} size="md" />
		<Rating label="Large" bind:value={sizeLg} size="lg" />
		<Rating label="Extra Large" bind:value={sizeXl} size="xl" />
	</div>
</Paper>

<Paper title="Colors">
	<div class="form-grid">
		<Rating label="Primary" bind:value={colorPrimary} color="primary" />
		<Rating label="Secondary" bind:value={colorSecondary} color="secondary" />
		<Rating label="Accent" bind:value={colorAccent} color="accent" />
		<Rating label="Warning (default)" bind:value={colorWarning} color="warning" />
	</div>
</Paper>

<Paper title="Read Only">
	<div class="form-grid">
		<Rating label="Average Score" value={readOnlyValue} readOnly />
		<div class="value-display">Value: {readOnlyValue} (read-only)</div>
	</div>
</Paper>

<Paper title="Half Stars (fractions=2)">
	<div class="form-grid">
		<Rating label="Precise Rating" bind:value={halfValue} fractions={2} />
		<div class="value-display">Value: {halfValue}</div>
	</div>
</Paper>

<Paper title="Custom Count (count=10)">
	<div class="form-grid">
		<Rating label="Rate out of 10" bind:value={customCountValue} count={10} size="sm" />
		<div class="value-display">Value: {customCountValue} / 10</div>
	</div>
</Paper>

<Paper title="Highlight Selected Only">
	<div class="form-grid">
		<Rating label="Select One" value={3} highlightSelectedOnly readOnly />
	</div>
</Paper>

<Paper title="Required with Error">
	<div class="form-grid">
		<Rating
			label="Your Rating"
			bind:value={basicValue}
			required
			showError={basicValue === 0}
			errorText="Please provide a rating"
		/>
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
				<td>Bindable rating value</td>
			</tr>
			<tr>
				<td><code>label</code></td>
				<td><code>string</code></td>
				<td><code>''</code></td>
				<td>Label text</td>
			</tr>
			<tr>
				<td><code>count</code></td>
				<td><code>number</code></td>
				<td><code>5</code></td>
				<td>Number of rating symbols</td>
			</tr>
			<tr>
				<td><code>size</code></td>
				<td><code>'xs' | 'sm' | 'md' | 'lg' | 'xl'</code></td>
				<td><code>'md'</code></td>
				<td>Size of the star icons</td>
			</tr>
			<tr>
				<td><code>color</code></td>
				<td><code>'primary' | 'secondary' | 'accent' | 'warning'</code></td>
				<td><code>'warning'</code></td>
				<td>Color of filled stars</td>
			</tr>
			<tr>
				<td><code>readOnly</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Makes the rating non-interactive</td>
			</tr>
			<tr>
				<td><code>fractions</code></td>
				<td><code>1 | 2 | 4</code></td>
				<td><code>1</code></td>
				<td>Fractional precision (1 = whole, 2 = half, 4 = quarter)</td>
			</tr>
			<tr>
				<td><code>highlightSelectedOnly</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Only highlight the selected star, not all preceding ones</td>
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
				<td>Called when rating changes</td>
			</tr>
			<tr>
				<td><code>onhover</code></td>
				<td><code>(value: number) =&gt; void</code></td>
				<td><code>undefined</code></td>
				<td>Called when hovering over a star</td>
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
