<script lang="ts">
	import { Timeline, Paper, iconMail, iconCheck, iconStar, iconUser, iconSettings } from '$lib/index.js';

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
</script>

<h1>Timeline</h1>
<p>Timeline displays a list of events in chronological order with visual connectors.</p>

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
				<td><code>items</code></td>
				<td><code>TimelineItem[]</code></td>
				<td><code>[]</code></td>
				<td>Array of timeline items with title, description, date, icon</td>
			</tr>
			<tr>
				<td><code>active</code></td>
				<td><code>number</code></td>
				<td><code>-1</code></td>
				<td>Index up to which items are marked active</td>
			</tr>
			<tr>
				<td><code>bulletSize</code></td>
				<td><code>number</code></td>
				<td><code>20</code></td>
				<td>Size of the bullet indicators in pixels</td>
			</tr>
			<tr>
				<td><code>lineWidth</code></td>
				<td><code>number</code></td>
				<td><code>2</code></td>
				<td>Width of connecting lines in pixels</td>
			</tr>
			<tr>
				<td><code>align</code></td>
				<td><code>'left' | 'right'</code></td>
				<td><code>'left'</code></td>
				<td>Alignment of timeline content</td>
			</tr>
			<tr>
				<td><code>reverseActive</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Reverse active direction (items after active index)</td>
			</tr>
			<tr>
				<td><code>color</code></td>
				<td><code>'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger' | 'gray'</code></td>
				<td><code>'primary'</code></td>
				<td>Color theme for active items</td>
			</tr>
			<tr>
				<td><code>class</code></td>
				<td><code>string</code></td>
				<td><code>''</code></td>
				<td>Additional CSS classes</td>
			</tr>
			<tr>
				<td><code>itemContent</code></td>
				<td><code>Snippet&lt;[TimelineItem, number]&gt;</code></td>
				<td><code>undefined</code></td>
				<td>Custom content snippet for each item</td>
			</tr>
		</tbody>
	</table>
</Paper>

<style>
	h1 { margin-bottom: 0.5rem; }
	p { color: var(--pui-color-text-secondary); margin-bottom: 1.5rem; }
	.demo-row { display: flex; flex-wrap: wrap; gap: 0.75rem; align-items: center; }
	.value-display { font-size: 0.875rem; color: var(--pui-color-text-muted); font-family: monospace; margin-top: 0.5rem; }
	.props-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
	.props-table th, .props-table td { text-align: left; padding: 0.75rem; border-bottom: 1px solid var(--pui-color-border); }
	.props-table th { font-weight: 600; background: var(--pui-color-bg-secondary); }
	.props-table code { background: var(--pui-color-bg-tertiary); padding: 0.125rem 0.375rem; border-radius: 4px; font-size: 0.8125rem; }

	.control-btn {
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
