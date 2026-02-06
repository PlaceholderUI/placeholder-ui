<script lang="ts">
	import {
		ActionIcon,
		Paper,
		Button,
		iconSearch,
		iconPlus,
		iconTrash,
		iconEdit,
		iconCheck,
		iconSettings,
		iconUser,
		iconHeart,
		iconStar,
		iconBell
	} from '$lib/index.js';

	let clickCount = $state(0);
	let loading = $state(false);

	function simulateLoading() {
		loading = true;
		setTimeout(() => (loading = false), 2000);
	}
</script>

<h1>ActionIcon</h1>
<p>Icon-only button for compact actions. Wraps a single SVG icon in a clickable button.</p>

<Paper title="Basic Usage">
	<div class="demo-row">
		<ActionIcon svg={iconSearch} onclick={() => clickCount++} />
		<ActionIcon svg={iconPlus} onclick={() => clickCount++} />
		<ActionIcon svg={iconEdit} onclick={() => clickCount++} />
		<ActionIcon svg={iconTrash} onclick={() => clickCount++} />
		<ActionIcon svg={iconSettings} onclick={() => clickCount++} />
		<ActionIcon svg={iconUser} onclick={() => clickCount++} />
		<ActionIcon svg={iconHeart} onclick={() => clickCount++} />
		<ActionIcon svg={iconStar} onclick={() => clickCount++} />
		<ActionIcon svg={iconBell} onclick={() => clickCount++} />
		<ActionIcon svg={iconCheck} onclick={() => clickCount++} />
	</div>
	<div class="value-display">Click count: {clickCount}</div>
</Paper>

<Paper title="Variants">
	<div class="demo-section">
		<div class="demo-row">
			<ActionIcon svg={iconHeart} variant="primary" />
			<ActionIcon svg={iconHeart} variant="primary-outline" />
			<ActionIcon svg={iconHeart} variant="primary-subtle" />
		</div>
	</div>
	<div class="demo-section">
		<div class="demo-row">
			<ActionIcon svg={iconStar} variant="secondary" />
			<ActionIcon svg={iconStar} variant="secondary-outline" />
			<ActionIcon svg={iconStar} variant="secondary-subtle" />
		</div>
	</div>
	<div class="demo-section">
		<div class="demo-row">
			<ActionIcon svg={iconTrash} variant="danger" />
			<ActionIcon svg={iconTrash} variant="danger-subtle" />
		</div>
	</div>
	<div class="demo-section">
		<div class="demo-row">
			<ActionIcon svg={iconSettings} variant="muted" />
			<ActionIcon svg={iconSettings} variant="muted-subtle" />
			<ActionIcon svg={iconSettings} variant="auto-subtle" />
			<ActionIcon svg={iconSettings} variant="auto-outline" />
		</div>
	</div>
</Paper>

<Paper title="With Tooltip">
	<div class="demo-row">
		<ActionIcon svg={iconSearch} tooltip="Search" />
		<ActionIcon svg={iconPlus} tooltip="Add new item" />
		<ActionIcon svg={iconEdit} tooltip="Edit" />
		<ActionIcon svg={iconTrash} tooltip="Delete" variant="danger" />
		<ActionIcon svg={iconSettings} tooltip="Settings" />
	</div>
</Paper>

<Paper title="Loading">
	<div class="demo-row">
		<ActionIcon svg={iconCheck} {loading} onclick={simulateLoading} tooltip="Click to load" />
		<ActionIcon svg={iconPlus} loading variant="primary" />
		<ActionIcon svg={iconStar} loading variant="secondary" />
	</div>
	<div class="value-display">Loading: {loading}</div>
</Paper>

<Paper title="Disabled">
	<div class="demo-row">
		<ActionIcon svg={iconSearch} disabled />
		<ActionIcon svg={iconPlus} disabled variant="primary" />
		<ActionIcon svg={iconTrash} disabled variant="danger" />
		<ActionIcon svg={iconSettings} disabled variant="secondary" />
	</div>
</Paper>

<Paper title="Custom Size">
	<div class="demo-row">
		<ActionIcon svg={iconHeart} size="16px" tooltip="16px" />
		<ActionIcon svg={iconHeart} size="20px" tooltip="20px (default)" />
		<ActionIcon svg={iconHeart} size="24px" tooltip="24px" />
		<ActionIcon svg={iconHeart} size="32px" tooltip="32px" />
	</div>
</Paper>

<Paper title="As Link">
	<div class="demo-row">
		<ActionIcon svg={iconSearch} href="/" tooltip="Internal link" />
		<ActionIcon svg={iconSettings} href="https://svelte.dev" target="_blank" tooltip="External link" />
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
				<td><code>svg</code></td>
				<td><code>string</code></td>
				<td>required</td>
				<td>SVG icon string</td>
			</tr>
			<tr>
				<td><code>variant</code></td>
				<td><code>ButtonVariant</code></td>
				<td><code>'auto-subtle'</code></td>
				<td>Visual style variant</td>
			</tr>
			<tr>
				<td><code>size</code></td>
				<td><code>string</code></td>
				<td><code>'20px'</code></td>
				<td>Icon size</td>
			</tr>
			<tr>
				<td><code>tooltip</code></td>
				<td><code>string</code></td>
				<td><code>undefined</code></td>
				<td>Tooltip text shown on hover</td>
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
				<td><code>inputButton</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Style as input addon button</td>
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
	h1 { margin-bottom: 0.5rem; }
	p { color: var(--pui-color-text-secondary); margin-bottom: 1.5rem; }
	.demo-row { display: flex; flex-wrap: wrap; gap: 0.75rem; align-items: center; }
	.demo-section { margin-bottom: 1rem; }
	.value-display { font-size: 0.875rem; color: var(--pui-color-text-muted); font-family: monospace; margin-top: 0.5rem; }
	.props-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
	.props-table th, .props-table td { text-align: left; padding: 0.75rem; border-bottom: 1px solid var(--pui-color-border); }
	.props-table th { font-weight: 600; background: var(--pui-color-bg-secondary); }
	.props-table code { background: var(--pui-color-bg-tertiary); padding: 0.125rem 0.375rem; border-radius: 4px; font-size: 0.8125rem; }
</style>
