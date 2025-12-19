<script lang="ts">
	import { Button, Paper } from "@placeholderco/placeholder-ui";
</script>

<div class="page-header">
	<h1>ButtonVariant</h1>
	<p>Type definition for button visual style variants.</p>
</div>

<Paper title="Type Definition">
	<pre class="code-block"><code>{`type ButtonVariant =
  | 'primary'
  | 'primary-outline'
  | 'primary-subtle'
  | 'secondary'
  | 'secondary-outline'
  | 'secondary-subtle'
  | 'muted'
  | 'muted-subtle'
  | 'muted-selected'
  | 'danger'
  | 'danger-subtle'
  | 'white'
  | 'auto-subtle'
  | 'auto-outline'
  | 'accent'
  | 'accent-subtle';`}</code></pre>
</Paper>

<Paper title="Variant System">
	<p class="section-description">
		The library uses a <strong>color + style modifier</strong> pattern for variants. Each base color can have modifiers like <code>-outline</code>, <code>-subtle</code>, or <code>-selected</code>.
	</p>

	<h4>Base Colors</h4>
	<table class="props-table">
		<thead>
			<tr>
				<th>Color</th>
				<th>Description</th>
				<th>Use Case</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>primary</code></td>
				<td>Dark teal/green primary color</td>
				<td>Primary actions, main CTAs</td>
			</tr>
			<tr>
				<td><code>secondary</code></td>
				<td>Light green accent color</td>
				<td>Secondary actions, success states</td>
			</tr>
			<tr>
				<td><code>muted</code></td>
				<td>Neutral gray</td>
				<td>Tertiary actions, cancel buttons</td>
			</tr>
			<tr>
				<td><code>danger</code></td>
				<td>Red warning color</td>
				<td>Destructive actions, errors</td>
			</tr>
			<tr>
				<td><code>accent</code></td>
				<td>Teal accent color</td>
				<td>Info states, highlights</td>
			</tr>
			<tr>
				<td><code>white</code></td>
				<td>White background</td>
				<td>Buttons on dark backgrounds</td>
			</tr>
		</tbody>
	</table>

	<h4>Style Modifiers</h4>
	<table class="props-table">
		<thead>
			<tr>
				<th>Modifier</th>
				<th>Description</th>
				<th>Example</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>-outline</code></td>
				<td>Transparent background with colored border</td>
				<td><code>primary-outline</code></td>
			</tr>
			<tr>
				<td><code>-subtle</code></td>
				<td>Transparent background, colored on hover</td>
				<td><code>secondary-subtle</code></td>
			</tr>
			<tr>
				<td><code>-selected</code></td>
				<td>Active/selected state styling</td>
				<td><code>muted-selected</code></td>
			</tr>
		</tbody>
	</table>
</Paper>

<Paper title="Visual Reference">
	<h4>Primary</h4>
	<div class="button-row">
		<Button variant="primary">primary</Button>
		<Button variant="primary-outline">primary-outline</Button>
		<Button variant="primary-subtle">primary-subtle</Button>
	</div>

	<h4>Secondary</h4>
	<div class="button-row">
		<Button variant="secondary">secondary</Button>
		<Button variant="secondary-outline">secondary-outline</Button>
		<Button variant="secondary-subtle">secondary-subtle</Button>
	</div>

	<h4>Muted</h4>
	<div class="button-row">
		<Button variant="muted">muted</Button>
		<Button variant="muted-subtle">muted-subtle</Button>
		<Button variant="muted-selected">muted-selected</Button>
	</div>

	<h4>Danger</h4>
	<div class="button-row">
		<Button variant="danger">danger</Button>
		<Button variant="danger-subtle">danger-subtle</Button>
	</div>

	<h4>Other</h4>
	<div class="button-row">
		<Button variant="white">white</Button>
		<Button variant="accent">accent</Button>
		<Button variant="accent-subtle">accent-subtle</Button>
		<Button variant="auto-subtle">auto-subtle</Button>
	</div>
</Paper>

<Paper title="Import">
	<pre class="code-block"><code>{`import type { ButtonVariant } from '@placeholderco/placeholder-ui';

// Usage
const variant: ButtonVariant = 'primary-outline';`}</code></pre>
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

	.button-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		align-items: center;
		margin-bottom: var(--pui-spacing-4);
	}

	.button-row:last-child {
		margin-bottom: 0;
	}

	.props-table {
		width: 100%;
		border-collapse: collapse;
		font-size: var(--pui-font-size-sm);
		margin-bottom: var(--pui-spacing-4);
	}

	.props-table:last-child {
		margin-bottom: 0;
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
