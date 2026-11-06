<script lang="ts">
	import Paper from '#lib/display/Paper.svelte';
	import ResizeHandle from '#lib/layout/ResizeHandle.svelte';
	import Switch from '#lib/form/Switch.svelte';
	import Button from '#lib/ui/Button.svelte';

	const HINT = 'Drag, or focus it and use the arrow keys. Double-click to reset.';

	let actionLog: string[] = $state([]);

	function addToLog(message: string) {
		actionLog = [`${new Date().toLocaleTimeString()}: ${message}`, ...actionLog.slice(0, 9)];
	}

	function clearLog() {
		actionLog = [];
	}

	function describe(size: number | null): string {
		return size === null ? 'default' : `${size}px`;
	}

	function px(size: number | null): string | undefined {
		return size === null ? undefined : `${size}px`;
	}

	// Basic usage
	let sidebar = $state<HTMLElement>();
	let sidebarSize = $state<number | null>(null);

	// Three columns
	let left = $state<HTMLElement>();
	let right = $state<HTMLElement>();
	let leftSize = $state<number | null>(null);
	let rightSize = $state<number | null>(null);
	const columns = $derived(
		`minmax(8rem, ${px(leftSize) ?? '12rem'}) 1rem minmax(14rem, 1fr) 1rem minmax(8rem, ${px(rightSize) ?? '14rem'})`
	);

	// Orientation
	let editor = $state<HTMLElement>();
	let editorSize = $state<number | null>(null);

	// States
	let statesPanel = $state<HTMLElement>();
	let statesSize = $state<number | null>(null);
	let disabled = $state(false);

	// Configuration options
	let configPanel = $state<HTMLElement>();
	let configSize = $state<number | null>(200);

	const scriptExample = `import { onMount } from 'svelte';
import { ResizeHandle } from '@placeholderco/placeholder-ui';

let sidebar = $state<HTMLElement>();
let width = $state<number | null>(null);

// localStorage only exists in the browser, so read it once mounted (safe with SSR)
onMount(() => {
	width = JSON.parse(localStorage.getItem('sidebar') ?? 'null');
});`;

	const markupExample = `<div class="layout">
	<aside bind:this={sidebar} style:width={width === null ? undefined : width + 'px'}>…</aside>
	<ResizeHandle
		panel={sidebar}
		bind:size={width}
		min={160}
		max={480}
		ariaLabel="Resize sidebar"
		onresizeend={(size) => localStorage.setItem('sidebar', JSON.stringify(size))}
	/>
	<main>…</main>
</div>`;
</script>

<div class="page-header">
	<h1>Resize Handle</h1>
	<p>
		Draggable separator that resizes the panel beside it, with keyboard support, limits and a reset.
		Works with flexbox and CSS grid layouts.
	</p>
</div>

<div class="vstack">
	<Paper title="Basic Usage">
		<div class="demo-section">
			<div class="split">
				<aside class="pane sidebar" bind:this={sidebar} style:width={px(sidebarSize)}>
					<strong>Sidebar</strong>
					<span class="pane-size">{describe(sidebarSize)}</span>
				</aside>
				<ResizeHandle
					panel={sidebar}
					bind:size={sidebarSize}
					min={160}
					max={480}
					ariaLabel="Resize sidebar"
					title={HINT}
					onresizeend={(size) => addToLog(`Sidebar resized to ${describe(size)}`)}
				/>
				<section class="pane main">
					<strong>Main</strong>
					<span class="pane-size">Fills the rest</span>
				</section>
			</div>
			<div class="handle-info">
				<strong>Props:</strong>
				<ul>
					<li>
						<code>panel</code> - The element to resize; the handle measures it but never styles it
					</li>
					<li>
						<code>size</code> - Bindable size in px, or <code>null</code> to leave it to the layout
					</li>
					<li>
						<code>min</code> / <code>max</code> - Limits in px (default 0 and the panel's container)
					</li>
					<li><code>ariaLabel</code> - Accessible name, e.g. "Resize sidebar" (required)</li>
					<li><code>title</code> - Optional native tooltip, e.g. how to use it</li>
				</ul>
				<p class="note">
					Apply <code>size</code> to the panel yourself: as a width, a grid track or a flex basis.
				</p>
			</div>
		</div>
	</Paper>

	<Paper title="Three Columns">
		<div class="demo-section">
			<div class="scroller">
				<div class="columns" style:grid-template-columns={columns}>
					<aside class="pane" bind:this={left}>
						<strong>Left</strong>
						<span class="pane-size">{describe(leftSize)}</span>
					</aside>
					<ResizeHandle
						panel={left}
						bind:size={leftSize}
						min={128}
						max={384}
						ariaLabel="Resize left column"
						title={HINT}
						onresizeend={(size) => addToLog(`Left column resized to ${describe(size)}`)}
					/>
					<section class="pane main">
						<strong>Middle</strong>
						<span class="pane-size">At least 14rem</span>
					</section>
					<ResizeHandle
						panel={right}
						side="end"
						bind:size={rightSize}
						min={128}
						max={384}
						ariaLabel="Resize right column"
						title={HINT}
						onresizeend={(size) => addToLog(`Right column resized to ${describe(size)}`)}
					/>
					<aside class="pane" bind:this={right}>
						<strong>Right</strong>
						<span class="pane-size">{describe(rightSize)}</span>
					</aside>
				</div>
			</div>
			<div class="handle-info">
				<strong>Side:</strong>
				<ul>
					<li><code>start</code> - The panel is before the handle: left, or above (default)</li>
					<li><code>end</code> - The panel is after the handle: right, or below</li>
				</ul>
				<p class="note">
					Each side track is <code>minmax(8rem, size)</code> and the middle is
					<code>minmax(14rem, 1fr)</code>, so as the window narrows the side columns give way before
					the middle drops below its minimum.
				</p>
			</div>
		</div>
	</Paper>

	<Paper title="Orientation">
		<div class="demo-section">
			<div class="rows">
				<section class="pane editor" bind:this={editor} style:height={px(editorSize)}>
					<strong>Editor</strong>
					<span class="pane-size">{describe(editorSize)}</span>
				</section>
				<ResizeHandle
					orientation="horizontal"
					panel={editor}
					bind:size={editorSize}
					min={64}
					max={256}
					ariaLabel="Resize editor"
					title={HINT}
					onresizeend={(size) => addToLog(`Editor resized to ${describe(size)}`)}
				/>
				<section class="pane main">
					<strong>Console</strong>
					<span class="pane-size">Fills the rest</span>
				</section>
			</div>
			<div class="handle-info">
				<strong>Orientation:</strong>
				<ul>
					<li><code>vertical</code> - Between columns, sets the panel's width (default)</li>
					<li><code>horizontal</code> - Between rows, sets its height; Up and Down move it</li>
				</ul>
			</div>
		</div>
	</Paper>

	<Paper title="States">
		<div class="demo-section">
			<div class="split">
				<aside class="pane sidebar" bind:this={statesPanel} style:width={px(statesSize)}>
					<strong>Sidebar</strong>
					<span class="pane-size">{describe(statesSize)}</span>
				</aside>
				<ResizeHandle
					panel={statesPanel}
					bind:size={statesSize}
					min={160}
					max={480}
					{disabled}
					ariaLabel="Resize sidebar"
					title={disabled ? undefined : HINT}
				/>
				<section class="pane main">
					<strong>Main</strong>
					<span class="pane-size">{disabled ? 'Resizing is off' : 'Fills the rest'}</span>
				</section>
			</div>
			<div class="button-row">
				<Switch label="Disabled" bind:checked={disabled} />
				<Button variant="secondary-subtle" onclick={() => (statesSize = null)}>Reset size</Button>
			</div>
			<div class="handle-info">
				<strong>States:</strong>
				<ul>
					<li><code>disabled</code> - No dragging or keys, and out of the tab order</li>
					<li>Disabling in the middle of a drag cancels it and puts the size back</li>
					<li>Hover, focus and dragging highlight the line and the grip</li>
				</ul>
			</div>
		</div>
	</Paper>

	<Paper title="Configuration Options">
		<div class="demo-section">
			<div class="split">
				<aside class="pane sidebar" bind:this={configPanel} style:width={px(configSize)}>
					<strong>Sidebar</strong>
					<span class="pane-size">{describe(configSize)}</span>
				</aside>
				<ResizeHandle
					panel={configPanel}
					bind:size={configSize}
					min={160}
					max={480}
					defaultSize={200}
					step={40}
					thickness="0.5rem"
					ariaLabel="Resize sidebar"
					title={HINT}
					onresizeend={(size) => addToLog(`Configured sidebar resized to ${describe(size)}`)}
				/>
				<section class="pane main">
					<strong>Main</strong>
					<span class="pane-size"
						><code>defaultSize={'{'}200{'}'}</code>, <code>step={'{'}40{'}'}</code>,
						<code>thickness="0.5rem"</code></span
					>
				</section>
			</div>
			<div class="handle-info">
				<strong>Options:</strong>
				<ul>
					<li>
						<code>defaultSize</code> - What a double-click or Enter restores, kept within
						<code>min</code> and <code>max</code> (default <code>null</code>)
					</li>
					<li>
						<code>step</code> - px per arrow key press (default 16); Shift moves four times as far
					</li>
					<li>
						<code>thickness</code> - Grab area across the drag axis (default <code>1rem</code>)
					</li>
					<li><code>class</code> - Extra classes on the handle</li>
				</ul>
				<p class="note">The thickness can double as the gap between the panels.</p>
			</div>
		</div>
	</Paper>

	<Paper title="With Event Handlers">
		<div class="demo-section">
			<div class="handle-info">
				<strong>Events:</strong>
				<ul>
					<li><code>onresize(size)</code> - Every change, including each frame of a drag</li>
					<li>
						<code>onresizeend(size)</code> - Once a drag, key press or reset has settled the size
					</li>
				</ul>
				<p class="note">
					Save the size in <code>onresizeend</code>, not <code>onresize</code>, which fires on every
					frame of a drag.
				</p>
			</div>
			<div class="code-example">
				<h4>Remembering the size</h4>
				<pre><code>{scriptExample}</code></pre>
				<pre><code>{markupExample}</code></pre>
			</div>
		</div>
	</Paper>

	<Paper title="Activity Log">
		<div class="log-section">
			<div class="log-header">
				<h4>Resize Events</h4>
				<Button variant="secondary-subtle" onclick={clearLog}>Clear Log</Button>
			</div>
			<div class="action-log">
				{#each actionLog as entry}
					<p class="log-entry">{entry}</p>
				{/each}
				{#if actionLog.length === 0}
					<p class="no-actions">No resizes yet. Try dragging a handle above!</p>
				{/if}
			</div>
		</div>
	</Paper>

	<Paper title="Features">
		<div class="feature-list">
			<ul>
				<li>
					<strong>Two orientations:</strong> Vertical between columns or horizontal between rows
				</li>
				<li><strong>Either side:</strong> Resizes the panel before or after the handle</li>
				<li>
					<strong>Bindable size:</strong> In px, or null to leave the size to the layout's CSS
				</li>
				<li><strong>Limits:</strong> Minimum and maximum size in px</li>
				<li>
					<strong>Keyboard support:</strong> Arrow keys move it (Shift for bigger steps), Home and End
					go to the limits, Enter resets
				</li>
				<li><strong>Double-click reset:</strong> Restores defaultSize</li>
				<li><strong>Escape to cancel:</strong> Puts the size back in the middle of a drag</li>
				<li>
					<strong>Smooth dragging:</strong> The edge follows the pointer from where it was grabbed, at
					most once per frame
				</li>
				<li>
					<strong>Pointer capture:</strong> The drag continues outside the handle, and iframes can't take
					the pointer
				</li>
				<li>
					<strong>Layout aware:</strong> If a neighbour's minimum holds the panel back, a drag, key press
					or reset settles on the size that was drawn
				</li>
				<li><strong>Sticky grip:</strong> Stays in view beside a panel taller than the window</li>
				<li>
					<strong>Touch support:</strong> Drags with touch as well as a mouse; a second finger can't interrupt
					a drag
				</li>
				<li>
					<strong>Events:</strong> onresize on every change, onresizeend once the size has settled
				</li>
				<li>
					<strong>Accessibility:</strong> WAI-ARIA window splitter: a focusable separator with aria-valuenow,
					aria-valuemin and aria-valuemax, linked to its panel by aria-controls
				</li>
				<li>
					<strong>Any layout:</strong> A flex or grid item between the panels that stretches to their
					length
				</li>
				<li><strong>Theme integration:</strong> Full light/dark mode support</li>
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

	.demo-section {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.button-row {
		display: flex;
		gap: 1rem;
		align-items: center;
		flex-wrap: wrap;
	}

	.pane {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		min-width: 0;
		min-height: 0;
		padding: 0.75rem 1rem;
		border: 1px solid var(--border-color);
		border-radius: var(--ui-radius-lg);
		background-color: var(--paper-body-bg);
		color: var(--text-color);
		overflow: hidden;
	}

	.pane-size {
		color: var(--text-muted);
		font-size: 0.875rem;
	}

	.main {
		flex: 1 1 auto;
	}

	.split {
		display: flex;
		height: 12rem;
	}

	.sidebar {
		flex-shrink: 0;
		width: 15rem;
	}

	/* The columns need 32rem; narrower screens scroll the demo sideways. */
	.scroller {
		overflow-x: auto;
	}

	.columns {
		display: grid;
		min-width: 32rem;
		height: 12rem;
	}

	.rows {
		display: flex;
		flex-direction: column;
		height: 20rem;
		max-width: 40rem;
	}

	.editor {
		flex-shrink: 0;
		height: 8rem;
	}

	.handle-info {
		padding: 1rem;
		background-color: rgba(var(--ui-primary-rgbc), 0.05);
		border-radius: var(--ui-radius);
		border: 1px solid var(--border-color);
	}

	.handle-info strong {
		color: var(--text-color);
		font-weight: 600;
		display: block;
		margin-bottom: 0.5rem;
	}

	.handle-info ul {
		margin: 0.5rem 0;
		padding-left: 1.5rem;
		color: var(--text-color);
	}

	.handle-info li {
		margin-bottom: 0.25rem;
		font-size: 0.875rem;
	}

	code {
		background-color: rgba(var(--ui-primary-rgbc), 0.1);
		padding: 0.125rem 0.25rem;
		border-radius: var(--ui-radius-sm);
		font-family: monospace;
		font-size: 0.75rem;
	}

	.note {
		font-size: 0.875rem;
		color: var(--text-muted);
		font-style: italic;
		margin: 0.5rem 0 0 0;
	}

	.code-example {
		padding: 1.5rem;
		background-color: rgba(var(--ui-primary-rgbc), 0.05);
		border-radius: var(--ui-radius);
		border: 1px solid var(--border-color);
	}

	.code-example h4 {
		color: var(--text-color);
		font-size: 1rem;
		font-weight: 600;
		margin: 0 0 1rem 0;
	}

	.code-example pre {
		margin: 0 0 1rem 0;
		overflow-x: auto;
	}

	.code-example pre:last-child {
		margin-bottom: 0;
	}

	.code-example pre code {
		padding: 0;
		background: none;
		font-size: 0.8125rem;
	}

	.log-section {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.log-section h4 {
		color: var(--text-color);
		font-size: 1.125rem;
		font-weight: 600;
		margin: 0;
	}

	.log-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.action-log {
		padding: 1rem;
		background-color: rgba(var(--ui-primary-rgbc), 0.05);
		border-radius: var(--ui-radius);
		border: 1px solid var(--border-color);
		min-height: 6.25rem;
		max-height: 12.5rem;
		overflow-y: auto;
	}

	.log-entry {
		font-family: 'Courier New', monospace;
		font-size: 0.875rem;
		color: var(--text-color);
		margin: 0.25rem 0;
		padding: 0.25rem 0.5rem;
		background-color: rgba(var(--ui-primary-rgbc), 0.1);
		border-radius: var(--ui-radius-sm);
	}

	.no-actions {
		color: var(--text-muted);
		font-style: italic;
		margin: 0;
		text-align: center;
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

	:global(.dark) .handle-info,
	:global(.dark) .code-example,
	:global(.dark) .action-log {
		background-color: rgba(var(--ui-accent-rgbc), 0.05);
	}

	:global(.dark) .feature-list strong {
		color: var(--ui-accent);
	}

	:global(.dark) .log-entry {
		background-color: rgba(var(--ui-accent-rgbc), 0.1);
	}

	:global(.dark) code {
		background-color: rgba(var(--ui-accent-rgbc), 0.1);
	}

	:global(.dark) .code-example pre code {
		background: none;
	}
</style>
