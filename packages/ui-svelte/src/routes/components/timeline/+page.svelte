<script lang="ts">
	import { Table, Timeline, Paper, iconMail, iconCheck, iconStar, iconUser, iconSettings } from '$lib/index.js';
	import type { Column } from '$lib/index.js';

	const basicItems = [
		{ title: 'Project Created', description: 'The project repository was initialized with the initial configuration.', date: 'Jan 15, 2025' },
		{ title: 'Design Phase', description: 'Wireframes and mockups were completed and approved by stakeholders.', date: 'Feb 3, 2025' },
		{ title: 'Development Started', description: 'The engineering team began implementing the core features.', date: 'Mar 1, 2025' },
		{ title: 'Beta Release', description: 'First beta version was published for internal testing.', date: 'Apr 20, 2025' },
		{ title: 'Public Launch', description: 'The product was officially released to the public.', date: 'May 15, 2025' }
	];

	const iconItems = [
		{ title: 'New User', description: 'A new user account was created.', date: '10:30 AM', icon: iconUser },
		{ title: 'Settings Updated', description: 'User preferences were modified.', date: '11:15 AM', icon: iconSettings },
		{ title: 'Email Sent', description: 'Confirmation email was dispatched.', date: '11:45 AM', icon: iconMail },
		{ title: 'Review Complete', description: 'All items have been reviewed.', date: '2:00 PM', icon: iconCheck },
		{ title: 'Milestone Reached', description: 'Project reached 1000 stars.', date: '3:30 PM', icon: iconStar }
	];

	let activeIndex = $state(2);

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
		{ prop: 'items', type: 'TimelineItem[]', default: '[]', description: 'Array of timeline items with title, description, date, icon' },
		{ prop: 'active', type: 'number', default: '-1', description: 'Index up to which items are marked active' },
		{ prop: 'bulletSize', type: 'number', default: '20', description: 'Size of the bullet indicators in pixels' },
		{ prop: 'lineWidth', type: 'number', default: '2', description: 'Width of connecting lines in pixels' },
		{ prop: 'align', type: '\'left\' | \'right\'', default: '\'left\'', description: 'Alignment of timeline content' },
		{ prop: 'reverseActive', type: 'boolean', default: 'false', description: 'Reverse active direction (items after active index)' },
		{ prop: 'color', type: '\'primary\' | \'secondary\' | \'accent\' | \'success\' | \'warning\' | \'danger\' | \'gray\'', default: '\'primary\'', description: 'Color theme for active items' },
		{ prop: 'class', type: 'string', default: '\'\'', description: 'Additional CSS classes' },
		{ prop: 'itemContent', type: 'Snippet<[TimelineItem, number]>', default: 'undefined', description: 'Custom content snippet for each item' },
	];
</script>

<h1>Timeline</h1>
<p>Timeline displays a list of events in chronological order with visual connectors.</p>

<div class="vstack">
	<Paper title="Basic Usage">
		<Timeline items={basicItems} />
	</Paper>

	<Paper title="With Active State">
		<p style="margin-bottom: 0.5rem;">Items up to index {activeIndex} are highlighted as active.</p>
		<div class="demo-row" style="margin-bottom: 1rem;">
			<button class="control-btn" onclick={() => (activeIndex = Math.max(-1, activeIndex - 1))}>-</button>
			<span class="value-display" style="margin: 0;">active: {activeIndex}</span>
			<button class="control-btn" onclick={() => (activeIndex = Math.min(basicItems.length - 1, activeIndex + 1))}>+</button>
		</div>
		<Timeline items={basicItems} active={activeIndex} />
	</Paper>

	<Paper title="With Icons">
		<Timeline items={iconItems} active={3} />
	</Paper>

	<Paper title="Right Align">
		<Timeline items={basicItems.slice(0, 3)} align="right" active={1} />
	</Paper>

	<Paper title="Custom Colors">
		<Timeline items={basicItems.slice(0, 3)} active={2} color="secondary" />
	</Paper>

	<Paper title="Props">
		<Table columns={propsColumns} rows={propsRows} striped hover={false} />
	</Paper>
</div>

<style>
	h1 { margin-bottom: 0.5rem; }
	p { color: var(--pui-color-text-secondary); margin-bottom: 1.5rem; }
	.demo-row { display: flex; flex-wrap: wrap; gap: 0.75rem; align-items: center; }
	.value-display { font-size: 0.875rem; color: var(--pui-color-text-muted); font-family: monospace; margin-top: 0.5rem; }.control-btn {
		width: 2rem;
		height: 2rem;
		border: 1px solid var(--pui-color-border);
		border-radius: 0.25rem;
		background: var(--pui-paper-body-bg);
		color: var(--pui-text-primary);
		cursor: pointer;
		font-size: 1rem;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.control-btn:hover {
		background: var(--pui-bg-hover);
	}
</style>
