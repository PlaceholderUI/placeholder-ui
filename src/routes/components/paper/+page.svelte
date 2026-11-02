<script lang="ts">
	import Paper from '#lib/display/Paper.svelte';
	import Button from '#lib/ui/Button.svelte';
	import ActionIcon from '#lib/ui/ActionIcon.svelte';
	import Badge from '#lib/ui/Badge.svelte';
	import Loader from '#lib/ui/Loader.svelte';
	import Tooltip from '#lib/ui/Tooltip.svelte';
	import SegmentedControl from '#lib/form/SegmentedControl.svelte';
	import { iconEdit, iconTrash, iconPlus, iconInfoCircle } from '#lib/icon/index.js';

	let clicks = $state(0);
	let showLoader = $state(false);

	function inc() {
		clicks += 1;
	}
	function toggleLoader() {
		showLoader = !showLoader;
	}

	let scrollMode = $state('page');
	let pageSpread = $state('none');
	let defaultFit = $state('fit-page');
	const fits = [
		{ label: 'Fit Page', value: 'fit-page' },
		{ label: 'Fit Width', value: 'fit-width' },
		{ label: 'Automatic', value: 'auto' },
		{ label: 'Custom', value: 'custom' }
	];
</script>

<div class="page-header">
	<h1>Paper</h1>
	<p>Card-like container with title, actions, and flexible content layout.</p>
</div>

<div class="vstack">
	<Paper title="Basic Paper">
		<p>Use Paper to group related UI with a title and optional actions.</p>
		<Button onclick={inc}>Click me</Button>
		<Badge variant="auto-outline">Clicks: {clicks}</Badge>
	</Paper>

	<Paper title="With Actions" containerClass="max-w-3xl" onTitleClick={inc}>
		{#snippet buttons()}
			<Tooltip text="Create">
				<ActionIcon svg={iconPlus} variant="primary-subtle" />
			</Tooltip>
			<Tooltip text="Edit">
				<ActionIcon svg={iconEdit} variant="secondary-subtle" />
			</Tooltip>
			<Tooltip text="Delete">
				<ActionIcon svg={iconTrash} variant="danger-subtle" />
			</Tooltip>
		{/snippet}
		<p>Actions are provided via the <code>buttons</code> snippet.</p>
		<p>Click the title to increment the counter above.</p>
	</Paper>

	<Paper title="No Padding" noPadding>
		<div class="media">
			<img src="/favicon.png" alt="logo" width="64" height="64" />
			<div class="media-body">
				<h4>Edge-to-edge content</h4>
				<p>Use <code>noPadding</code> to remove inner spacing.</p>
			</div>
		</div>
	</Paper>

	<Paper title="Min Height and Loader" minBodyHeight="120px">
		{#snippet buttons()}
			<Button variant="secondary-subtle" svg={iconInfoCircle} onclick={toggleLoader}>
				Toggle Loader
			</Button>
		{/snippet}
		{#if showLoader}
			<Loader />
		{:else}
			<p>Set <code>minBodyHeight</code> to reserve space for async content.</p>
		{/if}
	</Paper>

	<Paper
		title="Custom Classes"
		containerClass="ring-1"
		bodyClass="p-4"
		titleClass="text-brand-primary"
	>
		<p>
			Style each region with <code>containerClass</code>, <code>titleClass</code>, and
			<code>bodyClass</code>.
		</p>
	</Paper>

	<Paper title="Grid Content">
		<div class="grid">
			<div class="tile">Tile A</div>
			<div class="tile">Tile B</div>
			<div class="tile">Tile C</div>
			<div class="tile">Tile D</div>
		</div>
	</Paper>

	<Paper title="Nested Papers">
		<p>
			A Paper that contains other Papers becomes the outer shell: its surfaces step down towards the
			page (<code>--paper-outer-title-bg</code>, <code>--paper-outer-body-bg</code>,
			<code>--paper-outer-border</code>) so the nested Papers read as raised cards. Nothing to opt
			into, just nest them.
		</p>

		<div class="section-label">Layout</div>
		<Paper noPadding noGap>
			<div class="setting-row">
				<div>
					<div class="setting-title">Scroll mode</div>
					<div class="setting-desc">
						Page flips one at a time; continuous scrolls through all pages
					</div>
				</div>
				<SegmentedControl
					size="lg"
					bind:value={scrollMode}
					options={[
						{ label: 'Page', value: 'page' },
						{ label: 'Scrolled', value: 'scrolled' },
						{ label: 'Horizontal', value: 'horizontal' }
					]}
				/>
			</div>
			<div class="setting-row">
				<div>
					<div class="setting-title">Page spread</div>
					<div class="setting-desc">Which page number starts on the right in two-page view</div>
				</div>
				<SegmentedControl
					size="lg"
					bind:value={pageSpread}
					options={[
						{ label: 'None', value: 'none' },
						{ label: 'Odd', value: 'odd' },
						{ label: 'Even', value: 'even' },
						{ label: 'Auto', value: 'auto' }
					]}
				/>
			</div>
		</Paper>

		<div class="section-label">Zoom</div>
		<Paper noPadding>
			<div class="setting-row setting-stack">
				<div>
					<div class="setting-title">Default fit</div>
					<div class="setting-desc">How pages are scaled when a PDF is opened</div>
				</div>
				<div class="button-row">
					{#each fits as fit (fit.value)}
						<Button
							variant={defaultFit === fit.value ? 'secondary-selected' : 'secondary'}
							onclick={() => (defaultFit = fit.value)}
						>
							{fit.label}
						</Button>
					{/each}
				</div>
			</div>
		</Paper>
	</Paper>
</div>

<style>
	.page-header {
		margin-bottom: 2rem;
	}
	.page-header h1 {
		font-size: 2rem;
		font-weight: 700;
		margin: 0 0 0.5rem;
		color: var(--text-color);
	}
	.page-header p {
		color: var(--text-muted);
		margin: 0;
	}

	.vstack {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.media {
		display: flex;
		gap: 0.75rem;
		align-items: center;
	}
	.media-body h4 {
		margin: 0;
		color: var(--text-color);
	}
	.media-body p {
		margin: 0.25rem 0 0;
		color: var(--text-muted);
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
		gap: 0.5rem;
	}
	.tile {
		background: var(--paper-title-bg);
		border: 1px solid var(--paper-title-border);
		border-radius: 0.25rem;
		padding: 0.75rem;
		text-align: center;
		color: var(--text-color);
	}

	.section-label {
		margin-top: 0.75rem;
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--label-color);
	}

	.setting-row {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 1rem 1.25rem;
	}

	.setting-stack {
		flex-direction: column;
		align-items: stretch;
		gap: 0.75rem;
	}

	.setting-row + .setting-row {
		border-top: 1px solid var(--border-color);
	}

	.setting-title {
		font-weight: 500;
		color: var(--text-color);
	}

	.setting-desc {
		margin-top: 0.125rem;
		font-size: 0.8125rem;
		color: var(--label-color);
	}

	.button-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	:global(.text-brand-primary) {
		color: var(--ui-primary);
	}
	:global(.ring-1) {
		box-shadow: rgba(0, 0, 0, 0.08) 0 0 0 1px inset;
	}
	:global(.max-w-3xl) {
		max-width: 48rem;
		margin-inline: auto;
	}
	:global(.p-4) {
		padding: 1rem;
	}
</style>
