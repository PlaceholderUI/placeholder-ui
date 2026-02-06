<script lang="ts">
	import { Number, Paper, iconCreditCard } from '$lib/index.js';

	let basicValue = $state<number | undefined>(undefined);
	let rangeValue = $state<number | undefined>(25);
	let iconValue = $state<number | undefined>(undefined);
	let errorValue = $state<number | undefined>(undefined);
	let disabledValue = $state<number | undefined>(42);
</script>

<h1>Number</h1>
<p>Numeric input with optional min/max constraints, step control, and icon support.</p>

<Paper title="Basic Usage">
	<div class="form-grid">
		<Number label="Quantity" bind:value={basicValue} placeholder="Enter a number" />
		<div class="value-display">Value: {basicValue ?? 'undefined'}</div>
	</div>
</Paper>

<Paper title="Min / Max / Step">
	<div class="form-grid">
		<Number
			label="Quantity (0-100, step 5)"
			bind:value={rangeValue}
			min={0}
			max={100}
			step={5}
			placeholder="0 to 100"
		/>
		<div class="value-display">Value: {rangeValue ?? 'undefined'}</div>
	</div>
</Paper>

<Paper title="With Icon">
	<div class="form-grid">
		<Number
			label="Price"
			bind:value={iconValue}
			placeholder="0.00"
			leftIconSvg={iconCreditCard}
			step={0.01}
		/>
	</div>
</Paper>

<Paper title="Required">
	<div class="form-grid">
		<Number label="Age" placeholder="Enter your age" required />
	</div>
</Paper>

<Paper title="Error State">
	<div class="form-grid">
		<Number
			label="Score"
			bind:value={errorValue}
			placeholder="Enter score"
			showError={errorValue !== undefined && (errorValue < 0 || errorValue > 100)}
			errorText="Score must be between 0 and 100"
		/>
		<div class="value-display">Value: {errorValue ?? 'undefined'}</div>
	</div>
</Paper>

<Paper title="Disabled">
	<div class="form-grid">
		<Number label="Read Only Value" bind:value={disabledValue} disabled />
	</div>
</Paper>

<Paper title="Loading State">
	<div class="form-grid">
		<Number label="Loading" placeholder="Fetching..." loading />
	</div>
</Paper>

<Paper title="With Min/Max">
	<div class="form-grid">
		<Number
			label="Threads"
			placeholder="1-16"
			min={1}
			max={16}
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
				<td><code>number | undefined</code></td>
				<td><code>undefined</code></td>
				<td>Bindable numeric value</td>
			</tr>
			<tr>
				<td><code>label</code></td>
				<td><code>string</code></td>
				<td><code>''</code></td>
				<td>Label text above input</td>
			</tr>
			<tr>
				<td><code>placeholder</code></td>
				<td><code>string</code></td>
				<td><code>undefined</code></td>
				<td>Placeholder text</td>
			</tr>
			<tr>
				<td><code>min</code></td>
				<td><code>number</code></td>
				<td><code>undefined</code></td>
				<td>Minimum allowed value</td>
			</tr>
			<tr>
				<td><code>max</code></td>
				<td><code>number</code></td>
				<td><code>undefined</code></td>
				<td>Maximum allowed value</td>
			</tr>
			<tr>
				<td><code>step</code></td>
				<td><code>number</code></td>
				<td><code>undefined</code></td>
				<td>Step increment</td>
			</tr>
			<tr>
				<td><code>required</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Shows required indicator</td>
			</tr>
			<tr>
				<td><code>disabled</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Disables the input</td>
			</tr>
			<tr>
				<td><code>loading</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Shows loading spinner</td>
			</tr>
			<tr>
				<td><code>leftIconSvg</code></td>
				<td><code>string</code></td>
				<td><code>undefined</code></td>
				<td>SVG string for left icon</td>
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
				<td><code>tooltipText</code></td>
				<td><code>string</code></td>
				<td><code>undefined</code></td>
				<td>Tooltip hint text</td>
			</tr>
			<tr>
				<td><code>onenter</code></td>
				<td><code>(v: number) =&gt; void</code></td>
				<td><code>undefined</code></td>
				<td>Called when Enter is pressed</td>
			</tr>
			<tr>
				<td><code>onchange</code></td>
				<td><code>(e: Event) =&gt; void</code></td>
				<td><code>undefined</code></td>
				<td>Change event handler</td>
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
