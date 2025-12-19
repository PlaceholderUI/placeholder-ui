<script lang="ts">
	import {
		Button,
		Paper,
		iconPlus,
		iconCheck,
		iconArrowRight,
		iconDownload,
		iconTrash,
	} from "@placeholderco/placeholder-ui";

	let loading = $state(false);

	function simulateLoading() {
		loading = true;
		setTimeout(() => (loading = false), 2000);
	}
</script>

<div class="page-header">
	<h1>Button</h1>
	<p>Buttons trigger actions when clicked. They come in multiple variants and sizes.</p>
</div>

<Paper title="Variants">
	<p class="section-description">
		The library uses a color + style modifier pattern for button variants.
	</p>

	<h4>Midnight</h4>
	<div class="button-grid">
		<Button variant="midnight">Midnight</Button>
		<Button variant="midnight-outline">Midnight Outline</Button>
		<Button variant="midnight-subtle">Midnight Subtle</Button>
	</div>

	<h4>Pistachio</h4>
	<div class="button-grid">
		<Button variant="pistachio">Pistachio</Button>
		<Button variant="pistachio-outline">Pistachio Outline</Button>
		<Button variant="pistachio-subtle">Pistachio Subtle</Button>
	</div>

	<h4>Secondary</h4>
	<div class="button-grid">
		<Button variant="secondary">Secondary</Button>
		<Button variant="secondary-subtle">Secondary Subtle</Button>
		<Button variant="secondary-selected">Secondary Selected</Button>
	</div>

	<h4>Other</h4>
	<div class="button-grid">
		<Button variant="danger">Danger</Button>
		<Button variant="danger-subtle">Danger Subtle</Button>
		<Button variant="white">White</Button>
	</div>
</Paper>

<Paper title="Sizes">
	<p class="section-description">
		Buttons come in five sizes from extra small to extra large.
	</p>
	<div class="button-row">
		<Button size="xs">Extra Small</Button>
		<Button size="sm">Small</Button>
		<Button size="md">Medium</Button>
		<Button size="lg">Large</Button>
		<Button size="xl">Extra Large</Button>
	</div>
</Paper>

<Paper title="With Icons">
	<p class="section-description">
		Add icons to the left or right side of buttons using <code>svg</code> and <code>rightSvg</code> props.
	</p>
	<div class="button-row">
		<Button svg={iconPlus}>Add Item</Button>
		<Button svg={iconCheck} variant="pistachio">Confirm</Button>
		<Button rightSvg={iconArrowRight} variant="midnight-outline">Next</Button>
		<Button svg={iconDownload} variant="secondary">Download</Button>
		<Button svg={iconTrash} variant="danger">Delete</Button>
	</div>
</Paper>

<Paper title="Loading State">
	<p class="section-description">
		Show a loading spinner when an async action is in progress. The button is automatically disabled while loading.
	</p>
	<div class="button-row">
		<Button {loading} onclick={simulateLoading}>
			{loading ? "Loading..." : "Click to Load"}
		</Button>
		<Button loading variant="pistachio">Always Loading</Button>
		<Button loading variant="danger">Processing</Button>
	</div>
</Paper>

<Paper title="Disabled">
	<p class="section-description">
		Disabled buttons are non-interactive and appear faded.
	</p>
	<div class="button-row">
		<Button disabled>Disabled</Button>
		<Button disabled variant="pistachio">Disabled Pistachio</Button>
		<Button disabled variant="midnight-outline">Disabled Outline</Button>
		<Button disabled variant="danger">Disabled Danger</Button>
	</div>
</Paper>

<Paper title="As Link">
	<p class="section-description">
		Use the <code>href</code> prop to render as an anchor tag for navigation.
	</p>
	<div class="button-row">
		<Button href="/">Internal Link</Button>
		<Button href="https://svelte.dev" target="_blank" variant="midnight-outline">
			External Link
		</Button>
		<Button href="https://github.com" target="_blank" variant="secondary">
			GitHub
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
				<td><a href="/docs/types/button-variant"><code>ButtonVariant</code></a></td>
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
				<td><code>target</code></td>
				<td><code>'_self' | '_blank'</code></td>
				<td><code>undefined</code></td>
				<td>Link target attribute</td>
			</tr>
			<tr>
				<td><code>loading</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Shows loading spinner and disables button</td>
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
				<td><code>iconSize</code></td>
				<td><code>string</code></td>
				<td><code>'18px'</code></td>
				<td>Size of icon SVGs</td>
			</tr>
			<tr>
				<td><code>class</code></td>
				<td><code>string</code></td>
				<td><code>''</code></td>
				<td>Additional CSS classes</td>
			</tr>
			<tr>
				<td><code>onclick</code></td>
				<td><code>(event: MouseEvent) => void</code></td>
				<td><code>undefined</code></td>
				<td>Click event handler</td>
			</tr>
			<tr>
				<td><code>children</code></td>
				<td><code>Snippet</code></td>
				<td>—</td>
				<td>Button content</td>
			</tr>
		</tbody>
	</table>
</Paper>

<Paper title="Custom Styling">
	<p class="section-description">
		Override button colors using CSS variables. Each variant uses internal CSS variables that you can customize.
	</p>

	<h4>Available CSS Variables</h4>
	<div class="variant-list" style="margin-bottom: var(--pui-spacing-4);">
		<code>--button-bg-color</code>
		<code>--button-text-color</code>
		<code>--button-border</code>
		<code>--button-hover-bg-color</code>
		<code>--button-hover-text-color</code>
		<code>--button-active-bg-color</code>
		<code>--button-active-text-color</code>
		<code>--button-outline-color</code>
	</div>

	<h4>Example: Custom Purple Button</h4>
	<div class="button-row" style="margin-bottom: var(--pui-spacing-4);">
		<Button class="custom-purple">Purple Button</Button>
		<Button class="custom-gradient">Gradient Button</Button>
		<Button class="custom-orange-outline">Orange Outline</Button>
	</div>

	<pre class="code-block"><code>{`/* Custom purple button */
.custom-purple {
  --button-bg-color: #7c3aed;
  --button-text-color: white;
  --button-hover-bg-color: #6d28d9;
  --button-active-bg-color: #5b21b6;
}

/* Gradient button */
.custom-gradient {
  background: linear-gradient(135deg, #ec4899, #8b5cf6) !important;
  --button-text-color: white;
}

/* Custom outline */
.custom-orange-outline {
  --button-bg-color: transparent;
  --button-text-color: #ea580c;
  --button-border: 2px solid #ea580c;
  --button-hover-bg-color: #ea580c;
  --button-hover-text-color: white;
}`}</code></pre>
</Paper>

<Paper title="Variant Reference">
	<p class="section-description">Available button variants:</p>
	<div class="variant-list">
		<code>midnight</code>
		<code>midnight-outline</code>
		<code>midnight-subtle</code>
		<code>pistachio</code>
		<code>pistachio-outline</code>
		<code>pistachio-subtle</code>
		<code>secondary</code>
		<code>secondary-subtle</code>
		<code>secondary-selected</code>
		<code>danger</code>
		<code>danger-subtle</code>
		<code>white</code>
		<code>auto-subtle</code>
		<code>turquoise</code>
		<code>turquoise-subtle</code>
	</div>
</Paper>

<style>
	.page-header {
		margin-bottom: var(--pui-spacing-6);
	}

	.page-header h1 {
		margin-bottom: var(--pui-spacing-2);
	}

	.page-header p {
		color: var(--pui-color-gray-600);
		font-size: var(--pui-font-size-lg);
	}

	:global(.dark) .page-header p {
		color: var(--pui-color-gray-400);
	}

	.section-description {
		color: var(--pui-color-gray-600);
		margin-bottom: var(--pui-spacing-4);
		font-size: var(--pui-font-size-sm);
	}

	:global(.dark) .section-description {
		color: var(--pui-color-gray-400);
	}

	.section-description code {
		background: var(--pui-color-gray-100);
		padding: 0.125rem 0.375rem;
		border-radius: 4px;
		font-size: var(--pui-font-size-sm);
	}

	:global(.dark) .section-description code {
		background: var(--pui-color-dark-300);
	}

	h4 {
		font-size: var(--pui-font-size-sm);
		font-weight: 600;
		color: var(--pui-color-gray-500);
		margin-bottom: var(--pui-spacing-2);
		margin-top: var(--pui-spacing-4);
	}

	h4:first-of-type {
		margin-top: 0;
	}

	.button-grid {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		margin-bottom: var(--pui-spacing-4);
	}

	.button-grid:last-child {
		margin-bottom: 0;
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
		font-size: var(--pui-font-size-sm);
	}

	.props-table th,
	.props-table td {
		text-align: left;
		padding: 0.75rem;
		border-bottom: 1px solid var(--pui-color-gray-200);
	}

	:global(.dark) .props-table th,
	:global(.dark) .props-table td {
		border-bottom-color: var(--pui-color-dark-border);
	}

	.props-table th {
		font-weight: 600;
		background: var(--pui-color-gray-50);
	}

	:global(.dark) .props-table th {
		background: var(--pui-color-dark-200);
	}

	.props-table code {
		background: var(--pui-color-gray-100);
		padding: 0.125rem 0.375rem;
		border-radius: 4px;
		font-size: 0.8125rem;
	}

	:global(.dark) .props-table code {
		background: var(--pui-color-dark-300);
	}

	.variant-list {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.variant-list code {
		background: var(--pui-color-gray-100);
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		font-size: var(--pui-font-size-sm);
	}

	:global(.dark) .variant-list code {
		background: var(--pui-color-dark-300);
	}

	/* Custom button examples */
	:global(.custom-purple) {
		--button-bg-color: #7c3aed;
		--button-text-color: white;
		--button-hover-bg-color: #6d28d9;
		--button-active-bg-color: #5b21b6;
	}

	:global(.custom-gradient) {
		background: linear-gradient(135deg, #ec4899, #8b5cf6) !important;
		--button-text-color: white;
		--button-hover-bg-color: transparent;
	}

	:global(.custom-gradient:hover) {
		background: linear-gradient(135deg, #db2777, #7c3aed) !important;
	}

	:global(.custom-orange-outline) {
		--button-bg-color: transparent;
		--button-text-color: #ea580c;
		--button-border: 2px solid #ea580c;
		--button-hover-bg-color: #ea580c;
		--button-hover-text-color: white;
	}

	/* Code block styling */
	.code-block {
		background: var(--pui-color-gray-900);
		color: var(--pui-color-gray-100);
		padding: var(--pui-spacing-4);
		border-radius: var(--pui-radius-md);
		overflow-x: auto;
		font-size: var(--pui-font-size-sm);
		line-height: 1.6;
		margin: 0;
	}

	.code-block code {
		background: none;
		padding: 0;
		color: inherit;
		font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
	}
</style>
