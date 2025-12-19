<script lang="ts">
	import { Button, Paper, Loader, iconPlus, iconCheck, iconArrowRight } from '$lib/index.js';

	let loading = $state(false);

	function simulateLoading() {
		loading = true;
		setTimeout(() => (loading = false), 2000);
	}
</script>

<h1>Button</h1>
<p>Buttons trigger actions when clicked. They come in multiple variants and sizes.</p>

<Paper title="Variants">
	<p>The library uses a color + style modifier pattern for button variants.</p>
	<div class="button-grid">
		<Button variant="midnight">Midnight</Button>
		<Button variant="midnight-outline">Midnight Outline</Button>
		<Button variant="midnight-subtle">Midnight Subtle</Button>
	</div>
	<div class="button-grid">
		<Button variant="pistachio">Pistachio</Button>
		<Button variant="pistachio-outline">Pistachio Outline</Button>
		<Button variant="pistachio-subtle">Pistachio Subtle</Button>
	</div>
	<div class="button-grid">
		<Button variant="secondary">Secondary</Button>
		<Button variant="secondary-subtle">Secondary Subtle</Button>
		<Button variant="secondary-selected">Secondary Selected</Button>
	</div>
	<div class="button-grid">
		<Button variant="danger">Danger</Button>
		<Button variant="danger-subtle">Danger Subtle</Button>
		<Button variant="white">White</Button>
	</div>
</Paper>

<Paper title="Sizes">
	<div class="button-row">
		<Button size="xs">Extra Small</Button>
		<Button size="sm">Small</Button>
		<Button size="md">Medium</Button>
		<Button size="lg">Large</Button>
		<Button size="xl">Extra Large</Button>
	</div>
</Paper>

<Paper title="With Icons">
	<div class="button-row">
		<Button svg={iconPlus}>Add Item</Button>
		<Button svg={iconCheck} variant="pistachio">Confirm</Button>
		<Button rightSvg={iconArrowRight} variant="midnight-outline">Next</Button>
	</div>
</Paper>

<Paper title="Loading State">
	<div class="button-row">
		<Button {loading} onclick={simulateLoading}>
			{loading ? 'Loading...' : 'Click to Load'}
		</Button>
		<Button loading variant="pistachio">Always Loading</Button>
	</div>
</Paper>

<Paper title="Disabled">
	<div class="button-row">
		<Button disabled>Disabled</Button>
		<Button disabled variant="pistachio">Disabled Pistachio</Button>
		<Button disabled variant="danger">Disabled Danger</Button>
	</div>
</Paper>

<Paper title="As Link">
	<div class="button-row">
		<Button href="/">Internal Link</Button>
		<Button href="https://svelte.dev" target="_blank" variant="midnight-outline">
			External Link
		</Button>
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
				<td><code>variant</code></td>
				<td><code>ButtonVariant</code></td>
				<td><code>'midnight'</code></td>
				<td>Visual style variant</td>
			</tr>
			<tr>
				<td><code>size</code></td>
				<td><code>'xs' | 'sm' | 'md' | 'lg' | 'xl'</code></td>
				<td><code>'md'</code></td>
				<td>Button size</td>
			</tr>
			<tr>
				<td><code>href</code></td>
				<td><code>string</code></td>
				<td><code>undefined</code></td>
				<td>Renders as anchor tag when set</td>
			</tr>
			<tr>
				<td><code>loading</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Shows loading spinner</td>
			</tr>
			<tr>
				<td><code>disabled</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Disables the button</td>
			</tr>
			<tr>
				<td><code>svg</code></td>
				<td><code>string</code></td>
				<td><code>undefined</code></td>
				<td>Left icon SVG string</td>
			</tr>
			<tr>
				<td><code>rightSvg</code></td>
				<td><code>string</code></td>
				<td><code>undefined</code></td>
				<td>Right icon SVG string</td>
			</tr>
			<tr>
				<td><code>onclick</code></td>
				<td><code>(event: MouseEvent) => void</code></td>
				<td><code>undefined</code></td>
				<td>Click event handler</td>
			</tr>
		</tbody>
	</table>
</Paper>

<style>
	h1 {
		margin-bottom: 0.5rem;
	}

	p {
		color: var(--pui-color-text-secondary);
		margin-bottom: 1.5rem;
	}

	.button-grid {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		margin-bottom: 1rem;
	}

	.button-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		align-items: center;
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
		border-bottom: 1px solid var(--pui-color-border);
	}

	.props-table th {
		font-weight: 600;
		background: var(--pui-color-bg-secondary);
	}

	.props-table code {
		background: var(--pui-color-bg-tertiary);
		padding: 0.125rem 0.375rem;
		border-radius: 4px;
		font-size: 0.8125rem;
	}
</style>
