<script lang="ts">
	import { Table, Popover, Paper, Button, iconSettings } from '$lib/index.js';
	import type { Column } from '$lib/index.js';

	let basicShow = $state(false);
	let hoverShow = $state(false);
	let customShow = $state(false);
	let widthShow = $state(false);
	let topShow = $state(false);
	let rightShow = $state(false);
	let leftShow = $state(false);
	let bottomShow = $state(false);

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
		{ prop: 'show', type: 'boolean', default: 'false', description: 'Bindable visibility state' },
		{ prop: 'label', type: 'string', default: 'undefined', description: 'Text for the default trigger button' },
		{ prop: 'position', type: '\'top\' | \'bottom\' | \'left\' | \'right\'', default: '\'bottom\'', description: 'Popover position relative to trigger' },
		{ prop: 'cssWidth', type: 'string', default: '\'auto\'', description: 'Custom width for the popover' },
		{ prop: 'trigger', type: '\'click\' | \'hover\'', default: '\'click\'', description: 'How the popover is triggered' },
		{ prop: 'hoverDelay', type: 'number', default: '1000', description: 'Delay in ms before showing on hover' },
		{ prop: 'button', type: 'Snippet', default: 'undefined', description: 'Custom trigger element snippet' },
		{ prop: 'children', type: 'Snippet', default: 'undefined', description: 'Popover content' },
		{ prop: 'class', type: 'string', default: '\'\'', description: 'Additional CSS classes' },
	];
</script>

<h1>Popover</h1>
<p>Floating panel that appears attached to a trigger element. Supports click and hover triggers.</p>

<div class="vstack">
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
		<Table columns={propsColumns} rows={propsRows} striped hover={false} />
	</Paper>
</div>

<style>
	h1 { margin-bottom: 0.5rem; }
	p { color: var(--pui-color-text-secondary); margin-bottom: 1.5rem; }
	.demo-row { display: flex; flex-wrap: wrap; gap: 0.75rem; align-items: center; }
	.value-display { font-size: 0.875rem; color: var(--pui-color-text-muted); font-family: monospace; margin-top: 0.5rem; }
	.popover-body { padding: 1rem; }
	.popover-body h4 { margin: 0 0 0.5rem 0; }
	.popover-body p { margin: 0 0 0.75rem 0; font-size: 0.875rem; }</style>
