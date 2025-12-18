<script lang="ts">
	import { Select, Paper, type ComboBoxItem } from '$lib/index.js';

	let selectedValue = $state<string | undefined>(undefined);
	let searchableValue = $state<string | undefined>(undefined);

	const fruitOptions: ComboBoxItem[] = [
		{ value: 'apple', label: 'Apple' },
		{ value: 'banana', label: 'Banana' },
		{ value: 'cherry', label: 'Cherry' },
		{ value: 'date', label: 'Date' },
		{ value: 'elderberry', label: 'Elderberry' }
	];

	const countryOptions: ComboBoxItem[] = [
		{ value: 'us', label: 'United States' },
		{ value: 'uk', label: 'United Kingdom' },
		{ value: 'ca', label: 'Canada' },
		{ value: 'au', label: 'Australia' },
		{ value: 'de', label: 'Germany' },
		{ value: 'fr', label: 'France' },
		{ value: 'jp', label: 'Japan' }
	];

	const groupedOptions = [
		{
			label: 'Fruits',
			items: [
				{ value: 'apple', label: 'Apple' },
				{ value: 'banana', label: 'Banana' },
				{ value: 'cherry', label: 'Cherry' }
			]
		},
		{
			label: 'Vegetables',
			items: [
				{ value: 'carrot', label: 'Carrot' },
				{ value: 'broccoli', label: 'Broccoli' },
				{ value: 'spinach', label: 'Spinach' }
			]
		}
	];
</script>

<h1>Select</h1>
<p>Dropdown select component for choosing from a list of options.</p>

<Paper title="Basic Usage">
	<div class="form-grid">
		<Select
			label="Favorite Fruit"
			options={fruitOptions}
			bind:value={selectedValue}
			placeholder="Select a fruit..."
		/>
		<p class="value-display">Selected: {selectedValue ?? 'none'}</p>
	</div>
</Paper>

<Paper title="Searchable">
	<div class="form-grid">
		<Select
			label="Country"
			options={countryOptions}
			bind:value={searchableValue}
			placeholder="Search countries..."
			allowSearch
		/>
	</div>
</Paper>

<Paper title="Grouped Options">
	<div class="form-grid">
		<Select
			label="Food Category"
			{groupedOptions}
			placeholder="Select food..."
		/>
	</div>
</Paper>

<Paper title="Required">
	<div class="form-grid">
		<Select label="Required Field" options={fruitOptions} placeholder="Select..." required />
	</div>
</Paper>

<Paper title="With Error">
	<div class="form-grid">
		<Select
			label="With Error"
			options={fruitOptions}
			placeholder="Select..."
			showError
			errorText="This field is required"
		/>
	</div>
</Paper>

<Paper title="Disabled">
	<div class="form-grid">
		<Select label="Disabled" options={fruitOptions} placeholder="Cannot select" disabled />
	</div>
</Paper>

<Paper title="With Tooltip">
	<div class="form-grid">
		<Select
			label="With Tooltip"
			options={fruitOptions}
			placeholder="Select..."
			tooltipText="Choose your preferred option from the list"
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
				<td><code>undefined</code></td>
				<td>Bindable selected value</td>
			</tr>
			<tr>
				<td><code>label</code></td>
				<td><code>string</code></td>
				<td><code>''</code></td>
				<td>Label text above select</td>
			</tr>
			<tr>
				<td><code>placeholder</code></td>
				<td><code>string</code></td>
				<td><code>'\u00a0'</code></td>
				<td>Placeholder text when empty</td>
			</tr>
			<tr>
				<td><code>options</code></td>
				<td><code>ComboBoxItem[]</code></td>
				<td><code>[]</code></td>
				<td>Array of options</td>
			</tr>
			<tr>
				<td><code>groupedOptions</code></td>
				<td><code>ComboBoxGroup[]</code></td>
				<td><code>[]</code></td>
				<td>Grouped options array</td>
			</tr>
			<tr>
				<td><code>allowSearch</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Enable search filtering</td>
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
				<td>Disables the select</td>
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
				<td><code>(value: string) => void</code></td>
				<td><code>undefined</code></td>
				<td>Called when selection changes</td>
			</tr>
		</tbody>
	</table>
</Paper>

<style>
	h1 {
		margin-bottom: 0.5rem;
	}

	p {
		color: var(--cui-color-text-secondary);
		margin-bottom: 1.5rem;
	}

	.form-grid {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		max-width: 400px;
	}

	.value-display {
		font-size: 0.875rem;
		color: var(--cui-color-text-muted);
		font-family: monospace;
	}

	.props-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.875rem;
	}

	.props-table th,
	.props-table td {
		text-align: left;
		padding: 0.75rem;
		border-bottom: 1px solid var(--cui-color-border);
	}

	.props-table th {
		font-weight: 600;
		background: var(--cui-color-bg-secondary);
	}

	.props-table code {
		background: var(--cui-color-bg-tertiary);
		padding: 0.125rem 0.375rem;
		border-radius: 4px;
		font-size: 0.8125rem;
	}
</style>
