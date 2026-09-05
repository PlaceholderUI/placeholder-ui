<script lang="ts">
	import Paper from '$lib/display/Paper.svelte';
	import Badge from '$lib/ui/Badge.svelte';
	import { viewportState, breakpoints } from '$lib/index.js';
</script>

<div class="page-header">
	<h1>Viewport State</h1>
	<p>Reactive viewport utilities for responsive design.</p>
</div>

<div class="vstack">
	<Paper title="Viewport Dimensions">
		<div class="demo-section">
			<p class="description">
				The <code>viewportState</code> object provides reactive access to window dimensions and breakpoint helpers.
				Resize your browser to see the values update in real-time.
			</p>

			<div class="state-display">
				<div class="state-item">
					<span class="state-label">Window Width:</span>
					<Badge variant="secondary">{viewportState.width}px</Badge>
				</div>
				<div class="state-item">
					<span class="state-label">Window Height:</span>
					<Badge variant="secondary">{viewportState.height}px</Badge>
				</div>
			</div>
		</div>

		<div class="code-section">
			<strong>Usage:</strong>
			<pre class="code-block">{`import { viewportState } from '$lib/index.js';

// Dimensions (reactive)
viewportState.width   // number
viewportState.height  // number`}</pre>
		</div>
	</Paper>

	<Paper title="Breakpoint Booleans">
		<div class="demo-section">
			<p class="description">
				Pre-defined boolean helpers for common breakpoint checks.
			</p>

			<div class="breakpoint-grid">
				<div class="breakpoint-item" class:active={viewportState.isSmall}>
					<span class="bp-name">isSmall</span>
					<span class="bp-range">&lt; {breakpoints.sm}px</span>
					<Badge variant={viewportState.isSmall ? 'accent' : 'secondary'}>
						{viewportState.isSmall}
					</Badge>
				</div>
				<div class="breakpoint-item" class:active={viewportState.isMobile}>
					<span class="bp-name">isMobile</span>
					<span class="bp-range">&lt; {breakpoints.md}px</span>
					<Badge variant={viewportState.isMobile ? 'accent' : 'secondary'}>
						{viewportState.isMobile}
					</Badge>
				</div>
				<div class="breakpoint-item" class:active={viewportState.isTablet}>
					<span class="bp-name">isTablet</span>
					<span class="bp-range">{breakpoints.md}px - {breakpoints.lg - 1}px</span>
					<Badge variant={viewportState.isTablet ? 'accent' : 'secondary'}>
						{viewportState.isTablet}
					</Badge>
				</div>
				<div class="breakpoint-item" class:active={viewportState.isMedium}>
					<span class="bp-name">isMedium</span>
					<span class="bp-range">&gt;= {breakpoints.md}px</span>
					<Badge variant={viewportState.isMedium ? 'accent' : 'secondary'}>
						{viewportState.isMedium}
					</Badge>
				</div>
				<div class="breakpoint-item" class:active={viewportState.isLarge}>
					<span class="bp-name">isLarge</span>
					<span class="bp-range">&gt;= {breakpoints.lg}px</span>
					<Badge variant={viewportState.isLarge ? 'accent' : 'secondary'}>
						{viewportState.isLarge}
					</Badge>
				</div>
				<div class="breakpoint-item" class:active={viewportState.isDesktop}>
					<span class="bp-name">isDesktop</span>
					<span class="bp-range">&gt;= {breakpoints.lg}px</span>
					<Badge variant={viewportState.isDesktop ? 'accent' : 'secondary'}>
						{viewportState.isDesktop}
					</Badge>
				</div>
				<div class="breakpoint-item" class:active={viewportState.isExtraLarge}>
					<span class="bp-name">isExtraLarge</span>
					<span class="bp-range">&gt;= {breakpoints.xl}px</span>
					<Badge variant={viewportState.isExtraLarge ? 'accent' : 'secondary'}>
						{viewportState.isExtraLarge}
					</Badge>
				</div>
				<div class="breakpoint-item" class:active={viewportState.isUltrawide}>
					<span class="bp-name">isUltrawide</span>
					<span class="bp-range">&gt;= {breakpoints.ultrawide}px</span>
					<Badge variant={viewportState.isUltrawide ? 'accent' : 'secondary'}>
						{viewportState.isUltrawide}
					</Badge>
				</div>
			</div>
		</div>

		<div class="code-section">
			<strong>Usage:</strong>
			<pre class="code-block">{`import { viewportState } from '$lib/index.js';

// Breakpoint booleans (reactive)
viewportState.isMobile      // < 768px
viewportState.isTablet      // 768px - 1023px
viewportState.isDesktop     // >= 1024px
viewportState.isSmall       // < 640px
viewportState.isMedium      // >= 768px
viewportState.isLarge       // >= 1024px
viewportState.isExtraLarge  // >= 1280px
viewportState.isUltrawide   // >= 2100px

// Custom breakpoint checks
viewportState.isBelow(500)  // width < 500
viewportState.isAbove(1200) // width >= 1200`}</pre>
		</div>
	</Paper>

	<Paper title="Breakpoint Values">
		<div class="demo-section">
			<p class="description">
				Default breakpoint values exported from <code>breakpoints</code>.
			</p>

			<table class="props-table">
				<thead>
					<tr>
						<th>Name</th>
						<th>Value</th>
						<th>Description</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td><code>sm</code></td>
						<td>{breakpoints.sm}px</td>
						<td>Small devices (phones)</td>
					</tr>
					<tr>
						<td><code>md</code></td>
						<td>{breakpoints.md}px</td>
						<td>Medium devices (tablets)</td>
					</tr>
					<tr>
						<td><code>lg</code></td>
						<td>{breakpoints.lg}px</td>
						<td>Large devices (desktops)</td>
					</tr>
					<tr>
						<td><code>xl</code></td>
						<td>{breakpoints.xl}px</td>
						<td>Extra large devices (large desktops)</td>
					</tr>
					<tr>
						<td><code>xxl</code></td>
						<td>{breakpoints.xxl}px</td>
						<td>Extra extra large devices</td>
					</tr>
					<tr>
						<td><code>ultrawide</code></td>
						<td>{breakpoints.ultrawide}px</td>
						<td>Ultrawide monitors</td>
					</tr>
				</tbody>
			</table>
		</div>

		<div class="code-section">
			<strong>Usage:</strong>
			<pre class="code-block">{`import { breakpoints } from '$lib/index.js';

breakpoints.sm        // 640
breakpoints.md        // 768
breakpoints.lg        // 1024
breakpoints.xl        // 1280
breakpoints.xxl       // 1536
breakpoints.ultrawide // 2100`}</pre>
		</div>
	</Paper>

	<Paper title="Example: Responsive Layout">
		<div class="demo-section">
			<p class="description">
				Use <code>viewportState</code> to conditionally render content based on screen size.
			</p>

			<div class="responsive-example">
				{#if viewportState.isMobile}
					<div class="example-box mobile">
						Mobile Layout
					</div>
				{:else if viewportState.isTablet}
					<div class="example-box tablet">
						Tablet Layout
					</div>
				{:else}
					<div class="example-box desktop">
						Desktop Layout
					</div>
				{/if}
			</div>
		</div>

		<div class="code-section">
			<strong>Example:</strong>
			<pre class="code-block">{`{#if viewportState.isMobile}
  <MobileNav />
{:else}
  <DesktopNav />
{/if}

// Or use derived values
const columns = $derived(
  viewportState.isMobile ? 1 :
  viewportState.isTablet ? 2 : 4
);`}</pre>
		</div>
	</Paper>
</div>

<style>
	.page-header {
		margin-bottom: 2rem;
	}

	.page-header h1 {
		margin: 0 0 0.5rem;
		font-size: 2rem;
		font-weight: 700;
		color: var(--text-color);
	}

	.page-header p {
		margin: 0;
		color: var(--text-muted);
		font-size: 1.125rem;
	}

	.vstack {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.demo-section {
		margin-bottom: 1.5rem;
	}

	.description {
		margin: 0 0 1rem;
		color: var(--text-color);
	}

	.state-display {
		display: flex;
		flex-wrap: wrap;
		gap: 1.5rem;
		margin-bottom: 1rem;
		padding: 1rem;
		background: rgba(var(--ui-primary-rgbc), 0.05);
		border-radius: 0.5rem;
	}

	:global(.dark) .state-display {
		background: rgba(var(--ui-accent-rgbc), 0.05);
	}

	.state-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.state-label {
		font-weight: 500;
		color: var(--text-color);
	}

	.code-section {
		margin-top: 1.5rem;
		padding-top: 1.5rem;
		border-top: 1px solid var(--border-color);
	}

	.code-section strong {
		display: block;
		margin-bottom: 0.5rem;
		color: var(--text-color);
	}

	.code-block {
		background: rgba(var(--ui-primary-rgbc), 0.05);
		padding: 1rem;
		border-radius: 0.5rem;
		overflow-x: auto;
		font-size: 0.875rem;
		line-height: 1.5;
		margin: 0;
	}

	:global(.dark) .code-block {
		background: rgba(0, 0, 0, 0.3);
	}

	.breakpoint-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 0.75rem;
	}

	.breakpoint-item {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		padding: 0.75rem;
		background: rgba(var(--ui-primary-rgbc), 0.03);
		border: 1px solid var(--border-color);
		border-radius: 0.5rem;
		transition: all 0.2s ease;
	}

	.breakpoint-item.active {
		background: rgba(var(--ui-accent-rgbc), 0.1);
		border-color: var(--ui-accent);
	}

	:global(.dark) .breakpoint-item.active {
		background: rgba(var(--ui-primary-rgbc), 0.2);
		border-color: var(--ui-primary);
	}

	.bp-name {
		font-weight: 600;
		font-family: monospace;
		color: var(--text-color);
	}

	.bp-range {
		font-size: 0.75rem;
		color: var(--text-muted);
	}

	.props-table {
		width: 100%;
		border-collapse: collapse;
	}

	.props-table th,
	.props-table td {
		padding: 0.75rem;
		text-align: left;
		border-bottom: 1px solid var(--border-color);
	}

	.props-table th {
		font-weight: 600;
		color: var(--text-color);
		background: rgba(var(--ui-primary-rgbc), 0.03);
	}

	:global(.dark) .props-table th {
		background: rgba(var(--ui-accent-rgbc), 0.05);
	}

	.props-table td {
		color: var(--text-color);
	}

	.props-table code {
		background: rgba(var(--ui-primary-rgbc), 0.1);
		padding: 0.125rem 0.375rem;
		border-radius: 0.25rem;
		font-size: 0.875rem;
	}

	:global(.dark) .props-table code {
		background: rgba(var(--ui-accent-rgbc), 0.15);
	}

	.responsive-example {
		margin-top: 1rem;
	}

	.example-box {
		padding: 2rem;
		border-radius: 0.5rem;
		text-align: center;
		font-weight: 600;
		font-size: 1.25rem;
	}

	.example-box.mobile {
		background: rgba(var(--ui-accent-rgbc), 0.2);
		color: var(--ui-accent);
	}

	.example-box.tablet {
		background: rgba(var(--ui-primary-rgbc), 0.2);
		color: var(--ui-primary);
	}

	:global(.dark) .example-box.tablet {
		color: var(--text-color);
	}

	.example-box.desktop {
		background: rgba(59, 130, 246, 0.2);
		color: rgb(59, 130, 246);
	}
</style>
