<script lang="ts">
	import { Autocomplete, Paper, iconSearch, type ComboBoxItem } from '$lib/index.js';

	let basicValue = $state('');
	let iconValue = $state('');
	let customValue = $state('');

	const fruitOptions: ComboBoxItem[] = [
		{ value: 'apple', label: 'Apple' },
		{ value: 'banana', label: 'Banana' },
		{ value: 'cherry', label: 'Cherry' },
		{ value: 'date', label: 'Date' },
		{ value: 'elderberry', label: 'Elderberry' },
		{ value: 'fig', label: 'Fig' },
		{ value: 'grape', label: 'Grape' },
		{ value: 'honeydew', label: 'Honeydew' }
	];

	const cityOptions: ComboBoxItem[] = [
		{ value: 'new-york', label: 'New York' },
		{ value: 'los-angeles', label: 'Los Angeles' },
		{ value: 'chicago', label: 'Chicago' },
		{ value: 'houston', label: 'Houston' },
		{ value: 'phoenix', label: 'Phoenix' },
		{ value: 'san-francisco', label: 'San Francisco' },
		{ value: 'seattle', label: 'Seattle' },
		{ value: 'boston', label: 'Boston' }
	];
</script>

<h1>Autocomplete</h1>
<p>Text input with autocomplete suggestions from a list of options.</p>

<Paper title="Basic Usage">
	<div class="form-grid">
		<Autocomplete
			label="Favorite Fruit"
			bind:value={basicValue}
			options={fruitOptions}
			placeholder="Start typing a fruit..."
		/>
		<div class="value-display">Value: "{basicValue}"</div>
	</div>
</Paper>

<Paper title="With Icon">
	<div class="form-grid">
		<Autocomplete
			label="Search Cities"
			bind:value={iconValue}
			options={cityOptions}
			placeholder="Search cities..."
			leftIconSvg={iconSearch}
		/>
		<div class="value-display">Value: "{iconValue}"</div>
	</div>
</Paper>

<Paper title="Custom Placeholder">
	<div class="form-grid">
		<Autocomplete
			label="Food Item"
			bind:value={customValue}
			options={fruitOptions}
			placeholder="Type to find food..."
		/>
	</div>
</Paper>

<Paper title="Hide No Results">
	<div class="form-grid">
		<Autocomplete
			label="With Hidden No Results"
			options={fruitOptions}
			placeholder="Try typing something not in the list..."
			hideNoResults
		/>
	</div>
</Paper>

<Paper title="Required">
	<div class="form-grid">
		<Autocomplete
			label="Required Field"
			options={fruitOptions}
			placeholder="This is required..."
			showRequired
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
				<td><code>string</code></td>
				<td><code>''</code></td>
				<td>Bindable input value</td>
			</tr>
			<tr>
				<td><code>label</code></td>
				<td><code>string</code></td>
				<td><code>undefined</code></td>
				<td>Label text above input</td>
			</tr>
			<tr>
				<td><code>placeholder</code></td>
				<td><code>string</code></td>
				<td><code>'Start typing to search...'</code></td>
				<td>Placeholder text</td>
			</tr>
			<tr>
				<td><code>options</code></td>
				<td><code>ComboBoxItem[]</code></td>
				<td><code>undefined</code></td>
				<td>Array of autocomplete options</td>
			</tr>
			<tr>
				<td><code>hideNoResults</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Hides the "no results" dropdown message</td>
			</tr>
			<tr>
				<td><code>showRequired</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Shows required indicator</td>
			</tr>
			<tr>
				<td><code>leftIconSvg</code></td>
				<td><code>string</code></td>
				<td><code>undefined</code></td>
				<td>SVG string for left icon</td>
			</tr>
			<tr>
				<td><code>onchange</code></td>
				<td><code>(e: string) =&gt; void</code></td>
				<td><code>undefined</code></td>
				<td>Called when input value changes</td>
			</tr>
			<tr>
				<td><code>onSelect</code></td>
				<td><code>(e: ComboBoxItem) =&gt; void</code></td>
				<td><code>undefined</code></td>
				<td>Called when an option is selected</td>
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
