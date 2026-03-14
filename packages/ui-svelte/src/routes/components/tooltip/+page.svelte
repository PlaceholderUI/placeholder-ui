<script lang="ts">
	import { Table, Tooltip, Paper, Button, iconSearch, iconSettings, iconHeart } from '$lib/index.js';
	import type { Column } from '$lib/index.js';

	let tooltipDisabled = $state(false);

	interface PropRow {
		prop: string;
		type: string;
		default: string;
		description: string;
	}

	const propsColumns: Column<PropRow>[] = [
		{ key: 'prop', label: 'Prop' },
		{ key: 'type', label: 'Type' },
		{ key: 'default', label: 'Default' },
		{ key: 'description', label: 'Description' },
	];

	const propsRows: PropRow[] = [
		{ prop: 'children', type: 'Snippet', default: 'required', description: 'The element to attach the tooltip to' },
		{ prop: 'text', type: 'string', default: 'undefined', description: 'Simple text content' },
		{ prop: 'html', type: 'string', default: 'undefined', description: 'HTML content (use with caution)' },
		{ prop: 'tooltipContent', type: 'Snippet', default: 'undefined', description: 'Rich content via Svelte snippet' },
		{ prop: 'location', type: '\'top\' | \'right\' | \'bottom\' | \'left\' | \'top-start\' | \'top-end\' | ...', default: '\'top\'', description: 'Preferred tooltip position' },
		{ prop: 'maxWidth', type: 'string', default: '\'300px\'', description: 'Maximum width of tooltip' },
		{ prop: 'offsetDistance', type: 'number', default: '4', description: 'Offset distance from target (px)' },
		{ prop: 'showArrow', type: 'boolean', default: 'true', description: 'Show arrow pointing to target' },
		{ prop: 'delay', type: 'number', default: '0', description: 'Delay before showing (ms)' },
		{ prop: 'disabled', type: 'boolean', default: 'false', description: 'Disable the tooltip' },
	];
</script>

<h1>Tooltip</h1>
<p>Floating label that appears on hover to provide additional context or information.</p>

<div class="vstack">
	<Paper title="Basic Text">
		<div class="demo-row">
			<Tooltip text="This is a tooltip">
				<Button variant="primary">Hover me</Button>
			</Tooltip>
			<Tooltip text="Another tooltip with more detailed information">
				<Button variant="secondary">More info</Button>
			</Tooltip>
		</div>
	</Paper>

	<Paper title="Positions">
		<div class="demo-row">
			<Tooltip text="Top tooltip" location="top">
				<Button variant="muted">Top</Button>
			</Tooltip>
			<Tooltip text="Right tooltip" location="right">
				<Button variant="muted">Right</Button>
			</Tooltip>
			<Tooltip text="Bottom tooltip" location="bottom">
				<Button variant="muted">Bottom</Button>
			</Tooltip>
			<Tooltip text="Left tooltip" location="left">
				<Button variant="muted">Left</Button>
			</Tooltip>
		</div>
		<div class="demo-section"></div>
		<div class="demo-row">
			<Tooltip text="Top-start" location="top-start">
				<Button variant="muted" size="sm">Top Start</Button>
			</Tooltip>
			<Tooltip text="Top-end" location="top-end">
				<Button variant="muted" size="sm">Top End</Button>
			</Tooltip>
			<Tooltip text="Bottom-start" location="bottom-start">
				<Button variant="muted" size="sm">Bottom Start</Button>
			</Tooltip>
			<Tooltip text="Bottom-end" location="bottom-end">
				<Button variant="muted" size="sm">Bottom End</Button>
			</Tooltip>
		</div>
	</Paper>

	<Paper title="With HTML">
		<div class="demo-row">
			<Tooltip html="<b>Bold</b> and <em>italic</em> text">
				<Button variant="primary-outline">HTML Content</Button>
			</Tooltip>
			<Tooltip html="<ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>">
				<Button variant="primary-outline">HTML List</Button>
			</Tooltip>
			<Tooltip html="Status: <code>active</code><br/>Last seen: <b>2 min ago</b>">
				<Button variant="primary-outline">Rich Info</Button>
			</Tooltip>
		</div>
	</Paper>

	<Paper title="With Custom Content">
		<div class="demo-row">
			<Tooltip>
				{#snippet tooltipContent()}
					<div class="custom-tooltip">
						<strong>Custom Tooltip</strong>
						<p>This tooltip uses a Svelte snippet for fully custom content.</p>
					</div>
				{/snippet}
				<Button variant="secondary">Custom Content</Button>
			</Tooltip>
			<Tooltip>
				{#snippet tooltipContent()}
					<div class="custom-tooltip">
						<strong>User Info</strong>
						<p>Name: John Doe</p>
						<p>Role: Administrator</p>
					</div>
				{/snippet}
				<Button variant="secondary">User Details</Button>
			</Tooltip>
		</div>
	</Paper>

	<Paper title="No Arrow">
		<div class="demo-row">
			<Tooltip text="No arrow on this tooltip" showArrow={false}>
				<Button variant="muted">No Arrow</Button>
			</Tooltip>
			<Tooltip text="Arrow shown (default)" showArrow={true}>
				<Button variant="muted">With Arrow</Button>
			</Tooltip>
		</div>
	</Paper>

	<Paper title="With Delay">
		<div class="demo-row">
			<Tooltip text="No delay (default)" delay={0}>
				<Button variant="muted">Instant</Button>
			</Tooltip>
			<Tooltip text="300ms delay" delay={300}>
				<Button variant="muted">300ms</Button>
			</Tooltip>
			<Tooltip text="500ms delay" delay={500}>
				<Button variant="muted">500ms</Button>
			</Tooltip>
			<Tooltip text="1000ms delay" delay={1000}>
				<Button variant="muted">1000ms</Button>
			</Tooltip>
		</div>
	</Paper>

	<Paper title="Disabled">
		<div class="demo-row">
			<Button variant="muted" size="sm" onclick={() => (tooltipDisabled = !tooltipDisabled)}>
				Toggle Disabled: {tooltipDisabled}
			</Button>
		</div>
		<div class="demo-row" style="margin-top: 1rem;">
			<Tooltip text="This tooltip can be disabled" disabled={tooltipDisabled}>
				<Button variant="primary">Hover me</Button>
			</Tooltip>
		</div>
		<div class="value-display">disabled: {tooltipDisabled}</div>
	</Paper>

	<Paper title="Max Width">
		<div class="demo-row">
			<Tooltip text="This is a tooltip with a lot of text content that should wrap when it exceeds the max width constraint." maxWidth="200px">
				<Button variant="muted">Max 200px</Button>
			</Tooltip>
			<Tooltip text="Default max width is 300px which provides a comfortable reading width for most tooltip content." maxWidth="300px">
				<Button variant="muted">Max 300px</Button>
			</Tooltip>
		</div>
	</Paper>

	<Paper title="Props">
		<Table columns={propsColumns} rows={propsRows} striped hover={false} />
	</Paper>
</div>

<style>
	h1 { margin-bottom: 0.5rem; }
	p { color: var(--pui-color-text-secondary); margin-bottom: 1.5rem; }
	.demo-row { display: flex; flex-wrap: wrap; gap: 0.75rem; align-items: center; }
	.demo-section { margin-bottom: 1rem; }
	.value-display { font-size: 0.875rem; color: var(--pui-color-text-muted); font-family: monospace; margin-top: 0.5rem; }
	.custom-tooltip { font-size: 0.875rem; }
	.custom-tooltip p { margin: 0.25rem 0 0 0; color: inherit; }</style>
