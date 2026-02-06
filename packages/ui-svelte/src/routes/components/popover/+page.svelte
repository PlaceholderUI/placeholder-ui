<script lang="ts">
	import { Popover, Paper, Button, iconSettings } from '$lib/index.js';

	let basicShow = $state(false);
	let hoverShow = $state(false);
	let customShow = $state(false);
	let widthShow = $state(false);
	let topShow = $state(false);
	let rightShow = $state(false);
	let leftShow = $state(false);
	let bottomShow = $state(false);
</script>

<h1>Popover</h1>
<p>Floating panel that appears attached to a trigger element. Supports click and hover triggers.</p>

<Paper title="Basic (Click Trigger)">
	<Popover bind:show={basicShow} label="Open Popover">
		<div class="popover-body">
			<h4>Popover Content</h4>
			<p>This is basic popover content triggered by a click.</p>
			<Button variant="muted" size="sm" onclick={() => (basicShow = false)}>Close</Button>
		</div>
	</Popover>
	<div class="value-display">show: {basicShow}</div>
</Paper>

<Paper title="Hover Trigger">
	<Popover bind:show={hoverShow} label="Hover Me" trigger="hover" hoverDelay={300}>
		<div class="popover-body">
			<h4>Hover Popover</h4>
			<p>This popover appears after a 300ms hover delay.</p>
		</div>
	</Popover>
	<div class="value-display">show: {hoverShow}</div>
</Paper>

<Paper title="Custom Button">
	<Popover bind:show={customShow}>
		{#snippet button()}
			<Button variant="secondary" svg={iconSettings}>
				Custom Trigger
			</Button>
		{/snippet}
		<div class="popover-body">
			<h4>Custom Button Popover</h4>
			<p>The trigger button is fully customizable using the button snippet.</p>
			<Button variant="primary" size="sm" onclick={() => (customShow = false)}>Done</Button>
		</div>
	</Popover>
	<div class="value-display">show: {customShow}</div>
</Paper>

<Paper title="Custom Width">
	<Popover bind:show={widthShow} label="Wide Popover" cssWidth="350px">
		<div class="popover-body">
			<h4>Custom Width</h4>
			<p>This popover has a custom width of 350px set via the cssWidth prop. It provides more room for detailed content like forms or lists.</p>
			<Button variant="muted" size="sm" onclick={() => (widthShow = false)}>Close</Button>
		</div>
	</Popover>
	<div class="value-display">show: {widthShow}, cssWidth: 350px</div>
</Paper>

<Paper title="Positions">
	<div class="demo-row">
		<Popover bind:show={topShow} label="Top" position="top">
			<div class="popover-body">
				<p>Position: top</p>
			</div>
		</Popover>
		<Popover bind:show={bottomShow} label="Bottom" position="bottom">
			<div class="popover-body">
				<p>Position: bottom (default)</p>
			</div>
		</Popover>
		<Popover bind:show={leftShow} label="Left" position="left">
			<div class="popover-body">
				<p>Position: left</p>
			</div>
		</Popover>
		<Popover bind:show={rightShow} label="Right" position="right">
			<div class="popover-body">
				<p>Position: right</p>
			</div>
		</Popover>
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
				<td><code>show</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Bindable visibility state</td>
			</tr>
			<tr>
				<td><code>label</code></td>
				<td><code>string</code></td>
				<td><code>undefined</code></td>
				<td>Text for the default trigger button</td>
			</tr>
			<tr>
				<td><code>position</code></td>
				<td><code>'top' | 'bottom' | 'left' | 'right'</code></td>
				<td><code>'bottom'</code></td>
				<td>Popover position relative to trigger</td>
			</tr>
			<tr>
				<td><code>cssWidth</code></td>
				<td><code>string</code></td>
				<td><code>'auto'</code></td>
				<td>Custom width for the popover</td>
			</tr>
			<tr>
				<td><code>trigger</code></td>
				<td><code>'click' | 'hover'</code></td>
				<td><code>'click'</code></td>
				<td>How the popover is triggered</td>
			</tr>
			<tr>
				<td><code>hoverDelay</code></td>
				<td><code>number</code></td>
				<td><code>1000</code></td>
				<td>Delay in ms before showing on hover</td>
			</tr>
			<tr>
				<td><code>button</code></td>
				<td><code>Snippet</code></td>
				<td><code>undefined</code></td>
				<td>Custom trigger element snippet</td>
			</tr>
			<tr>
				<td><code>children</code></td>
				<td><code>Snippet</code></td>
				<td><code>undefined</code></td>
				<td>Popover content</td>
			</tr>
			<tr>
				<td><code>class</code></td>
				<td><code>string</code></td>
				<td><code>''</code></td>
				<td>Additional CSS classes</td>
			</tr>
		</tbody>
	</table>
</Paper>

<style>
	h1 { margin-bottom: 0.5rem; }
	p { color: var(--pui-color-text-secondary); margin-bottom: 1.5rem; }
	.demo-row { display: flex; flex-wrap: wrap; gap: 0.75rem; align-items: center; }
	.value-display { font-size: 0.875rem; color: var(--pui-color-text-muted); font-family: monospace; margin-top: 0.5rem; }
	.popover-body { padding: 1rem; }
	.popover-body h4 { margin: 0 0 0.5rem 0; }
	.popover-body p { margin: 0 0 0.75rem 0; font-size: 0.875rem; }
	.props-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
	.props-table th, .props-table td { text-align: left; padding: 0.75rem; border-bottom: 1px solid var(--pui-color-border); }
	.props-table th { font-weight: 600; background: var(--pui-color-bg-secondary); }
	.props-table code { background: var(--pui-color-bg-tertiary); padding: 0.125rem 0.375rem; border-radius: 4px; font-size: 0.8125rem; }
</style>
