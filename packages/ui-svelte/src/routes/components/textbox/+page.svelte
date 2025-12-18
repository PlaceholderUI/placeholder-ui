<script lang="ts">
	import { Textbox, Paper, Button, iconSearch, iconUser } from '$lib/index.js';

	let basicValue = $state('');
	let searchValue = $state('');
	let errorValue = $state('');
	let disabledValue = $state('Cannot edit this');
</script>

<h1>Textbox</h1>
<p>Text input for collecting user data with labels, icons, validation, and more.</p>

<Paper title="Basic Usage">
	<div class="form-grid">
		<Textbox label="Name" bind:value={basicValue} placeholder="Enter your name" />
		<p class="value-display">Value: "{basicValue}"</p>
	</div>
</Paper>

<Paper title="With Left Icon">
	<div class="form-grid">
		<Textbox
			label="Search"
			bind:value={searchValue}
			placeholder="Search..."
			leftIconSvg={iconSearch}
		/>
		<Textbox label="Username" placeholder="Enter username" leftIconSvg={iconUser} />
	</div>
</Paper>

<Paper title="Required Field">
	<Textbox label="Email" placeholder="you@example.com" required />
</Paper>

<Paper title="With Error State">
	<Textbox
		label="Username"
		bind:value={errorValue}
		placeholder="Enter username"
		showError={errorValue.length > 0 && errorValue.length < 3}
		errorText="Username must be at least 3 characters"
	/>
</Paper>

<Paper title="Disabled">
	<Textbox label="Disabled Input" bind:value={disabledValue} disabled />
</Paper>

<Paper title="Loading State">
	<Textbox label="Loading" placeholder="Fetching data..." loading />
</Paper>

<Paper title="With Right Slot">
	<Textbox label="With Button" placeholder="Enter text...">
		{#snippet right()}
			<Button variant="midnight" size="sm">Submit</Button>
		{/snippet}
	</Textbox>
</Paper>

<Paper title="With Tooltip">
	<Textbox
		label="API Key"
		placeholder="Enter your API key"
		tooltipText="Your API key can be found in the dashboard settings"
	/>
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
				<td><code>(value: string) => void</code></td>
				<td><code>undefined</code></td>
				<td>Called when Enter is pressed</td>
			</tr>
			<tr>
				<td><code>onchange</code></td>
				<td><code>(e: Event) => void</code></td>
				<td><code>undefined</code></td>
				<td>Change event handler</td>
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
