<script lang="ts">
	import Paper from '$lib/display/Paper.svelte';
	import Accordion from '$lib/ui/Accordion.svelte';
	import AccordionItem from '$lib/ui/AccordionItem.svelte';
	import type { ButtonVariant } from '$lib/ui/ButtonVariant.js';
	import { iconUser, iconSettings, iconBell } from '$lib/icon/index.js';

	let single = $state('item-1');
	let multi = $state<string[]>(['features']);

	const variantExamples: ButtonVariant[] = [
		'primary',
		'tertiary',
		'danger',
		'secondary-selected',
		'primary-outline',
		'danger-subtle'
	];
</script>

<div class="page-header">
	<h1>Accordion</h1>
	<p>Vertically stacked, collapsible panels for showing and hiding sections of content.</p>
</div>

<div class="vstack">
	<Paper title="Basic Usage">
		<Accordion bind:value={single}>
			<AccordionItem value="item-1" title="What is this component?">
				An accordion lets you toggle the visibility of related content sections one at a time,
				keeping the interface compact.
			</AccordionItem>
			<AccordionItem value="item-2" title="When should I use it?">
				Use it for FAQs, settings panels, or any place where you want to group content and let users
				reveal only what they need.
			</AccordionItem>
			<AccordionItem value="item-3" title="Is it accessible?">
				Yes — triggers are real buttons with <code>aria-expanded</code> and
				<code>aria-controls</code>, and the body is exposed as a labelled region.
			</AccordionItem>
		</Accordion>
		<p class="state">Open item: <code>{single || 'none'}</code></p>
	</Paper>

	<Paper title="Allow Multiple Open">
		<Accordion multiple bind:value={multi}>
			<AccordionItem value="features" title="Features" icon={iconSettings}>
				Single or multiple expansion, bindable value, custom header snippets, leading icons, and
				smooth slide transitions.
			</AccordionItem>
			<AccordionItem value="account" title="Account" icon={iconUser}>
				Manage your profile, password, and connected services here.
			</AccordionItem>
			<AccordionItem value="notifications" title="Notifications" icon={iconBell}>
				Choose which alerts you receive and how they are delivered.
			</AccordionItem>
		</Accordion>
		<p class="state">Open items: <code>{multi.length ? multi.join(', ') : 'none'}</code></p>
	</Paper>

	<Paper title="Disabled Item & Custom Header">
		<Accordion>
			<AccordionItem value="a" title="Standard item">A regular collapsible panel.</AccordionItem>
			<AccordionItem value="b" disabled title="Disabled item">
				This content cannot be reached because the item is disabled.
			</AccordionItem>
			<AccordionItem value="c">
				{#snippet header()}
					<span class="custom-header">Custom <strong>header</strong> snippet</span>
				{/snippet}
				Header content is fully customizable via the <code>header</code> snippet.
			</AccordionItem>
		</Accordion>
	</Paper>

	<Paper title="Colour Variants">
		<p class="hint">
			Set <code>variant</code> to any Button variant to colour the expanded panel's header. The
			default is <code>primary</code> in both light and dark mode; use
			<code>auto-subtle</code> for theme-aware accent/primary colours.
		</p>
		<div class="variant-grid">
			{#each variantExamples as v (v)}
				<div>
					<p class="variant-label"><code>{v}</code></p>
					<Accordion variant={v} value="open">
						<AccordionItem value="open" title="Expanded panel">
							The open header uses the <code>{v}</code> colours.
						</AccordionItem>
						<AccordionItem value="closed" title="Collapsed panel">
							Collapsed headers are unaffected.
						</AccordionItem>
					</Accordion>
				</div>
			{/each}
		</div>

		<p class="hint override-hint">
			Individual items can override the accordion-level variant with their own
			<code>variant</code> prop:
		</p>
		<Accordion multiple value={['default', 'override']}>
			<AccordionItem value="default" title="Accordion default (primary)">
				This item inherits the accordion's variant.
			</AccordionItem>
			<AccordionItem value="override" variant="danger" title="Overridden with danger">
				This item sets <code>variant="danger"</code> on itself.
			</AccordionItem>
		</Accordion>
	</Paper>

	<Paper title="Small Size">
		<p class="hint">
			Set <code>size="sm"</code> for a compact accordion with tighter padding and smaller text.
		</p>
		<Accordion size="sm">
			<AccordionItem value="sm-1" title="Compact panel" icon={iconSettings}>
				Smaller padding, font size and icons — useful in dense layouts like sidebars.
			</AccordionItem>
			<AccordionItem value="sm-2" title="Another compact panel">
				All items inherit the size from the parent Accordion.
			</AccordionItem>
		</Accordion>
	</Paper>

	<Paper title="Accordion-level Title Snippet">
		<p class="hint">
			Provide an <code>itemTitle</code> snippet on the Accordion to template every panel title. It
			receives the item's <code>title</code>, <code>value</code>, <code>open</code> and
			<code>disabled</code> state.
		</p>
		<Accordion>
			{#snippet itemTitle({ title, open })}
				<span class="tpl-title">
					{title}
					<span class="tpl-state" class:open>{open ? 'Open' : 'Closed'}</span>
				</span>
			{/snippet}
			<AccordionItem value="one" title="First panel">
				Every panel in this accordion shares the same title template.
			</AccordionItem>
			<AccordionItem value="two" title="Second panel">
				The snippet re-renders as the open state changes.
			</AccordionItem>
			<AccordionItem value="three" title="Third panel">
				{#snippet header()}
					<span class="custom-header">Item-level <strong>header</strong> wins</span>
				{/snippet}
				An item's own <code>header</code> snippet takes precedence over the accordion-level template.
			</AccordionItem>
		</Accordion>
	</Paper>

	<Paper title="Features">
		<div class="feature-list">
			<ul>
				<li>
					<strong>Single or multiple:</strong> Use the <code>multiple</code> prop to allow several panels
					open at once
				</li>
				<li>
					<strong>Bindable value:</strong> Two-way bind the open item(s) via <code>value</code>
				</li>
				<li>
					<strong>Icons:</strong> Add a leading icon to any item with the <code>icon</code> prop
				</li>
				<li>
					<strong>Custom headers:</strong> Provide a <code>header</code> snippet for rich titles
				</li>
				<li>
					<strong>Title templates:</strong> An accordion-level <code>itemTitle</code> snippet renders
					every panel title
				</li>
				<li><strong>Size variants:</strong> Default or compact via <code>size="sm"</code></li>
				<li>
					<strong>Colour variants:</strong> Style the expanded header with any Button variant via
					<code>variant</code>, with per-item overrides
				</li>
				<li><strong>Disabled items:</strong> Prevent toggling individual panels</li>
				<li><strong>Accessible:</strong> Proper button semantics and ARIA attributes</li>
				<li><strong>Theme aware:</strong> Adapts to light and dark mode</li>
			</ul>
		</div>
	</Paper>
</div>

<style>
	.page-header {
		margin-bottom: 2rem;
	}

	.page-header h1 {
		font-size: 2rem;
		font-weight: 700;
		margin: 0 0 0.5rem 0;
		color: var(--text-color);
	}

	.page-header p {
		color: var(--text-muted);
		margin: 0;
	}

	.state {
		margin: 1rem 0 0 0;
		color: var(--text-muted);
		font-size: 0.875rem;
	}

	code {
		font-family: monospace;
		background-color: rgba(var(--ui-primary-rgbc), 0.08);
		padding: 0.1rem 0.3rem;
		border-radius: 0.25rem;
	}

	.custom-header strong {
		color: var(--ui-primary);
	}

	.hint {
		margin: 0 0 1rem 0;
		color: var(--text-muted);
		font-size: 0.875rem;
	}

	.variant-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 1rem;
	}

	.variant-label {
		margin: 0 0 0.5rem 0;
		font-size: 0.875rem;
		color: var(--text-muted);
	}

	.override-hint {
		margin-top: 1.5rem;
	}

	.tpl-title {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
	}

	.tpl-state {
		padding: 0.1rem 0.5rem;
		border-radius: 999px;
		background-color: rgba(var(--ui-primary-rgbc), 0.08);
		color: var(--text-muted);
		font-size: 0.75rem;
		font-weight: 500;
	}

	.tpl-state.open {
		background-color: var(--ui-primary);
		color: var(--ui-accent);
	}

	.feature-list ul {
		margin: 0;
		padding-left: 1.5rem;
		color: var(--text-color);
	}

	.feature-list li {
		margin-bottom: 0.5rem;
		line-height: 1.5;
	}

	.feature-list strong {
		color: var(--ui-primary);
		font-weight: 600;
	}

	:global(.dark) code {
		background-color: rgba(var(--ui-accent-rgbc), 0.1);
	}

	:global(.dark) .custom-header strong,
	:global(.dark) .feature-list strong {
		color: var(--ui-accent);
	}
</style>
