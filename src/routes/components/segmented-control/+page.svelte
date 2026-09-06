<script lang="ts">
	import Paper from '$lib/display/Paper.svelte';
	import SegmentedControl from '$lib/form/SegmentedControl.svelte';
	import Textbox from '$lib/form/Textbox.svelte';
	import Select from '$lib/form/Select.svelte';
	import type { ComboBoxItem } from '$lib/models/ComboBoxItem.js';

	// Basic options
	const viewModeOptions: ComboBoxItem[] = [
		{ label: 'List', value: 'list' },
		{ label: 'Grid', value: 'grid' },
		{ label: 'Card', value: 'card' }
	];

	const sortOptions: ComboBoxItem[] = [
		{ label: 'Name', value: 'name' },
		{ label: 'Date', value: 'date' },
		{ label: 'Size', value: 'size' }
	];

	const timeRangeOptions: ComboBoxItem[] = [
		{ label: 'Day', value: 'day' },
		{ label: 'Week', value: 'week' },
		{ label: 'Month', value: 'month' },
		{ label: 'Year', value: 'year' }
	];

	const priorityOptions: ComboBoxItem[] = [
		{ label: 'Low', value: 'low' },
		{ label: 'Medium', value: 'medium' },
		{ label: 'High', value: 'high' }
	];

	const statusOptions: ComboBoxItem[] = [
		{ label: 'Active', value: 'active' },
		{ label: 'Pending', value: 'pending' },
		{ label: 'Complete', value: 'complete' },
		{ label: 'Archived', value: 'archived' }
	];

	const alignmentOptions: ComboBoxItem[] = [
		{ label: 'Left', value: 'left' },
		{ label: 'Center', value: 'center' },
		{ label: 'Right', value: 'right' }
	];

	const booleanOptions: ComboBoxItem[] = [
		{ label: 'Yes', value: 'yes' },
		{ label: 'No', value: 'no' }
	];

	const sizeOptions: ComboBoxItem[] = [
		{ label: 'XS', value: 'xs' },
		{ label: 'S', value: 's' },
		{ label: 'M', value: 'm' },
		{ label: 'L', value: 'l' },
		{ label: 'XL', value: 'xl' }
	];

	// Inline filter example
	let inlineFilter = 'all';
	let searchText = '';
	let inlineCategory = '';
	let largeSizeValue = 'list';

	const inlineFilterOptions: ComboBoxItem[] = [
		{ label: 'All', value: 'all' },
		{ label: 'Active', value: 'active' },
		{ label: 'Archived', value: 'archived' }
	];

	const inlineCategoryOptions: ComboBoxItem[] = [
		{ label: 'Design', value: 'design' },
		{ label: 'Development', value: 'development' },
		{ label: 'Marketing', value: 'marketing' }
	];

	// State variables
	let viewMode = 'list';
	let sortBy = 'name';
	let timeRange = 'week';
	let taskPriority = 'medium';
	let projectStatus = 'active';
	let textAlignment = 'left';
	let booleanValue = 'true';
	let itemSize = 'm';

	// Dashboard example state
	let dashboardView = 'overview';
	let chartType = 'bar';
	let dataRange = 'month';
	let reportType = 'summary';

	const dashboardViewOptions: ComboBoxItem[] = [
		{ label: 'Overview', value: 'overview' },
		{ label: 'Analytics', value: 'analytics' },
		{ label: 'Reports', value: 'reports' }
	];

	const chartTypeOptions: ComboBoxItem[] = [
		{ label: 'Bar', value: 'bar' },
		{ label: 'Line', value: 'line' },
		{ label: 'Pie', value: 'pie' },
		{ label: 'Area', value: 'area' }
	];

	const dataRangeOptions: ComboBoxItem[] = [
		{ label: 'Week', value: 'week' },
		{ label: 'Month', value: 'month' },
		{ label: 'Quarter', value: 'quarter' },
		{ label: 'Year', value: 'year' }
	];

	const reportTypeOptions: ComboBoxItem[] = [
		{ label: 'Summary', value: 'summary' },
		{ label: 'Detailed', value: 'detailed' },
		{ label: 'Export', value: 'export' }
	];

	// Editor example state
	let textStyle = 'normal';
	let fontSize = 'medium';
	let textColor = 'black';

	const textStyleOptions: ComboBoxItem[] = [
		{ label: 'Normal', value: 'normal' },
		{ label: 'Bold', value: 'bold' },
		{ label: 'Italic', value: 'italic' }
	];

	const fontSizeOptions: ComboBoxItem[] = [
		{ label: 'Small', value: 'small' },
		{ label: 'Medium', value: 'medium' },
		{ label: 'Large', value: 'large' }
	];

	const colorOptions: ComboBoxItem[] = [
		{ label: 'Black', value: 'black' },
		{ label: 'Gray', value: 'gray' },
		{ label: 'Blue', value: 'blue' },
		{ label: 'Red', value: 'red' }
	];

	function handleViewModeChange(value: any) {
		console.log('View mode changed:', value);
	}

	function handlePriorityChange(value: any) {
		console.log('Priority changed:', value);
	}

	// OnChange example state and handlers
	let changeValue = 'option1';
	let changeLog: string[] = [];

	const changeExampleOptions: ComboBoxItem[] = [
		{ label: 'Option 1', value: 'option1' },
		{ label: 'Option 2', value: 'option2' },
		{ label: 'Option 3', value: 'option3' },
		{ label: 'Option 4', value: 'option4' }
	];

	function handleSegmentedControlChange(value: string) {
		const timestamp = new Date().toLocaleTimeString();
		const logEntry = `${timestamp}: Changed to "${value}"`;
		changeLog = [...changeLog, logEntry];
		console.log('SegmentedControl onChange:', value);
	}

	function clearLog() {
		changeLog = [];
	}

	// Programmatic recalculation example
	let recalcControl: SegmentedControl;
	let recalcValue = 'medium';
	let useLongLabels = false;

	const shortLabelOptions: ComboBoxItem[] = [
		{ label: 'S', value: 'small' },
		{ label: 'M', value: 'medium' },
		{ label: 'L', value: 'large' }
	];

	const longLabelOptions: ComboBoxItem[] = [
		{ label: 'Small', value: 'small' },
		{ label: 'Medium', value: 'medium' },
		{ label: 'Large', value: 'large' }
	];

	$: recalcOptions = useLongLabels ? longLabelOptions : shortLabelOptions;
</script>

<div class="page-header">
	<h1>Segmented Control</h1>
	<p>Smooth sliding control for selecting between multiple options with animated transitions.</p>
</div>

<div class="vstack">
	<Paper title="Basic Usage">
		<div class="form-grid">
			<div class="control-section">
				<div class="control-group">
					<SegmentedControl label="View Model" options={viewModeOptions} bind:value={viewMode} />
				</div>
				<div class="control-group">
					<SegmentedControl label="Sort By" options={sortOptions} bind:value={sortBy} />
				</div>
				<div class="control-group">
					<SegmentedControl label="Time Range" options={timeRangeOptions} bind:value={timeRange} />
				</div>
			</div>
			<div class="control-info">
				<strong>Current Values:</strong>
				<p>View Mode: {viewMode}</p>
				<p>Sort By: {sortBy}</p>
				<p>Time Range: {timeRange}</p>
				<p class="note">Notice the smooth sliding animation when selecting different options.</p>
			</div>
		</div>
	</Paper>

	<Paper title="Size Variants">
		<p class="section-description">
			The default size is sized to sit alongside Textbox and Select components in a filter bar. Use <code
				>lg</code
			> for a larger control.
		</p>
		<div class="inline-filter-row">
			<div class="inline-filter-item">
				<Textbox label="Search" placeholder="Search..." bind:value={searchText} />
			</div>
			<div class="inline-filter-item">
				<SegmentedControl label="Status" options={inlineFilterOptions} bind:value={inlineFilter} />
			</div>
			<div class="inline-filter-item">
				<Select label="Category" options={inlineCategoryOptions} bind:value={inlineCategory} />
			</div>
		</div>
		<div class="lg-example">
			<SegmentedControl
				label="Large"
				size="lg"
				options={viewModeOptions}
				bind:value={largeSizeValue}
			/>
		</div>
	</Paper>

	<Paper title="Different Option Counts">
		<div class="form-grid">
			<div class="control-section">
				<div class="control-group">
					<SegmentedControl
						label="Boolean Choice"
						options={booleanOptions}
						bind:value={booleanValue}
					/>
				</div>
				<div class="control-group">
					<SegmentedControl
						label="Priority (3 options)"
						options={priorityOptions}
						bind:value={taskPriority}
					/>
				</div>
				<div class="control-group">
					<SegmentedControl
						label="Status (4 options)"
						options={statusOptions}
						bind:value={projectStatus}
					/>
				</div>
				<div class="control-group">
					<SegmentedControl label="Size (5 options)" options={sizeOptions} bind:value={itemSize} />
				</div>
			</div>
			<div class="control-info">
				<strong>Values:</strong>
				<p>Boolean: {booleanValue === 'true' ? 'Yes (true)' : 'No (false)'}</p>
				<p>Priority: <span class="priority-{taskPriority}">{taskPriority}</span></p>
				<p>Status: <span class="status-{projectStatus}">{projectStatus}</span></p>
				<p>Size: {itemSize.toUpperCase()}</p>
				<p class="note">SegmentedControls adapt to different numbers of options automatically.</p>
			</div>
		</div>
	</Paper>

	<Paper title="Text Alignment Example">
		<div class="alignment-demo">
			<div class="control-group">
				<SegmentedControl
					label="Text Alignment"
					options={alignmentOptions}
					bind:value={textAlignment}
				/>
			</div>
			<div class="preview-text alignment-{textAlignment}">
				<p>This text alignment changes based on the segmented control above.</p>
				<p>Current alignment: <strong>{textAlignment}</strong></p>
			</div>
		</div>
	</Paper>

	<Paper title="Dashboard Controls Example">
		<div class="dashboard-section">
			<h3>Dashboard Configuration</h3>
			<div class="dashboard-controls">
				<div class="control-row">
					<div class="control-group">
						<SegmentedControl
							label="View"
							options={dashboardViewOptions}
							bind:value={dashboardView}
						/>
					</div>
					<div class="control-group">
						<SegmentedControl
							label="Chart Type"
							options={chartTypeOptions}
							bind:value={chartType}
						/>
					</div>
				</div>
				<div class="control-row">
					<div class="control-group">
						<SegmentedControl
							label="Data Range"
							options={dataRangeOptions}
							bind:value={dataRange}
						/>
					</div>
					<div class="control-group">
						<SegmentedControl
							label="Report Type"
							options={reportTypeOptions}
							bind:value={reportType}
						/>
					</div>
				</div>
			</div>
			<div class="dashboard-preview">
				<h4>Dashboard Preview</h4>
				<div class="preview-card">
					<p><strong>View:</strong> {dashboardView}</p>
					<p><strong>Chart:</strong> {chartType} chart</p>
					<p><strong>Data Range:</strong> {dataRange}</p>
					<p><strong>Report:</strong> {reportType} report</p>
				</div>
			</div>
		</div>
	</Paper>

	<Paper title="Text Editor Controls">
		<div class="editor-section">
			<h3>Text Formatting</h3>
			<div class="editor-controls">
				<div class="control-group">
					<SegmentedControl label="Style" options={textStyleOptions} bind:value={textStyle} />
				</div>
				<div class="control-group">
					<SegmentedControl label="Size" options={fontSizeOptions} bind:value={fontSize} />
				</div>
				<div class="control-group">
					<SegmentedControl label="Color" options={colorOptions} bind:value={textColor} />
				</div>
			</div>
			<div class="text-preview">
				<p class="sample-text style-{textStyle} size-{fontSize} color-{textColor}">
					This is sample text showing the current formatting.
				</p>
				<p class="format-summary">
					Format: {textStyle} • {fontSize} • {textColor}
				</p>
			</div>
		</div>
	</Paper>

	<Paper title="OnChange Event Handler">
		<div class="onchange-section">
			<h3>Handling Value Changes</h3>
			<p class="section-description">
				The SegmentedControl component emits a custom 'change' event when the value changes. This
				example shows how to listen for changes and respond accordingly.
			</p>

			<div class="onchange-demo">
				<div class="control-group">
					<SegmentedControl
						label="Sample Control with OnChange Handler"
						options={changeExampleOptions}
						bind:value={changeValue}
						onchange={handleSegmentedControlChange}
					/>
				</div>

				<div class="change-info">
					<div class="current-value">
						<strong>Current Value:</strong>
						{changeValue}
					</div>

					<div class="change-log">
						<div class="log-header">
							<strong>Change Log:</strong>
							<button class="clear-button" on:click={clearLog} disabled={changeLog.length === 0}>
								Clear Log
							</button>
						</div>
						<div class="log-content">
							{#if changeLog.length === 0}
								<p class="no-logs">
									No changes yet. Click on different options to see change events.
								</p>
							{:else}
								{#each changeLog as logEntry}
									<div class="log-entry">{logEntry}</div>
								{/each}
							{/if}
						</div>
					</div>
				</div>
			</div>

			<div class="code-example">
				<h4>Implementation Example:</h4>
				<!-- <pre><code>{`<script>
  let selectedValue = 'option1';
  
//   function handleChange(event) {
//     const newValue = event.detail;
//     console.log('Value changed to:', newValue);
//     // Your custom logic here
//   }
</script>

<SegmentedControl 
  options={options}
  bind:value={selectedValue}
  on:change={handleChange}
/>`}</code></pre> -->
			</div>
		</div>
	</Paper>

	<Paper title="Programmatic Recalculation">
		<div class="recalc-section">
			<p class="section-description">
				The component exposes a <code>recalculateBackground(delay?)</code> function on its instance
				(via <code>bind:this</code>). The sliding background only repositions automatically when the
				selection changes — if a layout change resizes the segments without changing the selection,
				call this function to snap it back into place. Pass an optional delay in milliseconds to
				defer the measurement, e.g. until a CSS transition has finished.
			</p>

			<div class="control-group">
				<SegmentedControl
					bind:this={recalcControl}
					label="Item Size"
					options={recalcOptions}
					bind:value={recalcValue}
				/>
			</div>

			<div class="recalc-buttons">
				<button class="demo-button" on:click={() => (useLongLabels = !useLongLabels)}>
					Toggle label length
				</button>
				<button class="demo-button" on:click={() => recalcControl.recalculateBackground()}>
					Recalculate background
				</button>
			</div>

			<p class="note">
				"Toggle label length" swaps the option labels (S/M/L ↔ Small/Medium/Large), which resizes
				the segments while the background stays where it was. "Recalculate background" repositions
				it under the selected option.
			</p>

			<div class="code-example">
				<h4>Implementation Example:</h4>
				<pre><code
						>{`let control;

<SegmentedControl bind:this={control} {options} bind:value={selected} />

// After a layout change that resizes the segments:
control.recalculateBackground();

// Or wait 200ms first, e.g. for a CSS transition to finish:
control.recalculateBackground(200);`}</code
					></pre>
			</div>
		</div>
	</Paper>

	<Paper title="Features">
		<div class="feature-list">
			<ul>
				<li><strong>Smooth animations:</strong> Sliding background with smooth transitions</li>
				<li><strong>Auto-sizing:</strong> Automatically adapts to any number of options</li>
				<li><strong>Theme support:</strong> Full light/dark mode compatibility</li>
				<li>
					<strong>Flexible values:</strong> Support for strings, numbers, booleans, and objects
				</li>
				<li><strong>Responsive design:</strong> Works well on different screen sizes</li>
				<li><strong>Accessibility:</strong> Keyboard navigation and screen reader support</li>
				<li>
					<strong>Auto-initialization:</strong> Automatically selects first option if none provided
				</li>
				<li><strong>Dynamic positioning:</strong> Background perfectly follows selected option</li>
				<li>
					<strong>Programmatic recalculation:</strong> <code>recalculateBackground()</code> instance function
					to reposition the background after external layout changes
				</li>
				<li><strong>Visual feedback:</strong> Clear hover and selected states</li>
				<li><strong>Touch friendly:</strong> Optimized for touch devices</li>
				<li><strong>No flickering:</strong> Smooth recalculation during component mounting</li>
				<li><strong>Lightweight:</strong> Minimal overhead with efficient rendering</li>
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

	.inline-filter-row {
		display: flex;
		gap: 1rem;
		align-items: flex-end;
	}

	.inline-filter-item {
		flex: 1;
	}

	.lg-example {
		margin-top: 1.5rem;
	}

	.form-grid {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.control-section {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.control-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.control-label {
		color: var(--text-color);
		font-weight: 600;
		font-size: 0.875rem;
	}

	.control-info {
		padding: 1rem;
		background-color: rgba(var(--ui-primary-rgbc), 0.05);
		border-radius: 0.375rem;
		border: 1px solid var(--border-color);
	}

	.control-info strong {
		color: var(--text-color);
		font-weight: 600;
		display: block;
		margin-bottom: 0.5rem;
	}

	.control-info p {
		margin: 0.25rem 0;
		color: var(--text-muted);
	}

	.priority-low {
		color: #10b981;
	}
	.priority-medium {
		color: #f59e0b;
	}
	.priority-high {
		color: #dc2626;
	}

	.status-active {
		color: #10b981;
	}
	.status-pending {
		color: #f59e0b;
	}
	.status-complete {
		color: #8b5cf6;
	}
	.status-archived {
		color: #6b7280;
	}

	.alignment-demo {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.preview-text {
		padding: 1.5rem;
		border: 1px solid var(--border-color);
		border-radius: 0.375rem;
		background-color: rgba(var(--ui-primary-rgbc), 0.02);
	}

	.preview-text.alignment-left {
		text-align: left;
	}
	.preview-text.alignment-center {
		text-align: center;
	}
	.preview-text.alignment-right {
		text-align: right;
	}

	.dashboard-section,
	.editor-section,
	.onchange-section,
	.recalc-section {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.recalc-buttons {
		display: flex;
		gap: 0.75rem;
	}

	.dashboard-section h3,
	.editor-section h3,
	.onchange-section h3 {
		color: var(--text-color);
		font-size: 1.25rem;
		font-weight: 600;
		margin: 0;
	}

	.section-description {
		color: var(--text-muted);
		margin: 0;
		line-height: 1.5;
	}

	.onchange-demo {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.change-info {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.current-value {
		padding: 1rem;
		background-color: rgba(var(--ui-primary-rgbc), 0.05);
		border-radius: 0.375rem;
		border: 1px solid var(--border-color);
	}

	.current-value strong {
		color: var(--text-color);
		font-weight: 600;
	}

	.change-log {
		border: 1px solid var(--border-color);
		border-radius: 0.375rem;
		background-color: rgba(var(--ui-primary-rgbc), 0.02);
	}

	.log-header {
		padding: 1rem;
		border-bottom: 1px solid var(--border-color);
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.log-header strong {
		color: var(--text-color);
		font-weight: 600;
	}

	.clear-button,
	.demo-button {
		background-color: var(--ui-primary);
		color: white;
		border: none;
		padding: 0.375rem 0.75rem;
		border-radius: 0.25rem;
		font-size: 0.875rem;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.clear-button:hover:not(:disabled),
	.demo-button:hover {
		background-color: rgba(var(--ui-primary-rgbc), 0.8);
	}

	.clear-button:disabled {
		background-color: var(--border-color);
		cursor: not-allowed;
		opacity: 0.6;
	}

	.log-content {
		padding: 1rem;
		max-height: 200px;
		overflow-y: auto;
	}

	.no-logs {
		color: var(--text-muted);
		margin: 0;
		text-align: center;
		font-style: italic;
	}

	.log-entry {
		padding: 0.5rem;
		margin-bottom: 0.25rem;
		background-color: rgba(var(--ui-primary-rgbc), 0.05);
		border-radius: 0.25rem;
		font-family: 'Courier New', monospace;
		font-size: 0.875rem;
		color: var(--text-color);
	}

	.log-entry:last-child {
		margin-bottom: 0;
	}

	.code-example {
		padding: 1.5rem;
		background-color: rgba(var(--ui-primary-rgbc), 0.05);
		border-radius: 0.375rem;
		border: 1px solid var(--border-color);
	}

	.code-example h4 {
		color: var(--text-color);
		font-size: 1rem;
		font-weight: 600;
		margin: 0 0 1rem 0;
	}

	.dashboard-controls,
	.editor-controls {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.control-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1.5rem;
	}

	.dashboard-preview,
	.text-preview {
		padding: 1.5rem;
		border: 1px solid var(--border-color);
		border-radius: 0.375rem;
		background-color: rgba(var(--ui-primary-rgbc), 0.02);
	}

	.dashboard-preview h4 {
		color: var(--text-color);
		font-size: 1.125rem;
		font-weight: 600;
		margin: 0 0 1rem 0;
	}

	.preview-card {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.5rem;
	}

	.preview-card p {
		margin: 0;
		color: var(--text-color);
	}

	.sample-text {
		margin: 0 0 1rem 0;
		color: var(--text-color);
	}

	.sample-text.style-bold {
		font-weight: bold;
	}
	.sample-text.style-italic {
		font-style: italic;
	}
	.sample-text.style-normal {
		font-weight: normal;
		font-style: normal;
	}

	.sample-text.size-small {
		font-size: 0.875rem;
	}
	.sample-text.size-medium {
		font-size: 1rem;
	}
	.sample-text.size-large {
		font-size: 1.25rem;
	}

	.sample-text.color-black {
		color: #000000;
	}
	.sample-text.color-gray {
		color: #6b7280;
	}
	.sample-text.color-blue {
		color: #2563eb;
	}
	.sample-text.color-red {
		color: #dc2626;
	}

	.format-summary {
		margin: 0;
		color: var(--text-muted);
		font-size: 0.875rem;
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

	.note {
		font-size: 0.875rem;
		color: var(--text-muted);
		font-style: italic;
	}

	:global(.dark) .control-info,
	:global(.dark) .preview-text,
	:global(.dark) .dashboard-preview,
	:global(.dark) .text-preview,
	:global(.dark) .current-value,
	:global(.dark) .change-log,
	:global(.dark) .code-example {
		background-color: rgba(var(--ui-accent-rgbc), 0.05);
	}

	:global(.dark) .clear-button,
	:global(.dark) .demo-button {
		background-color: var(--ui-accent);
		color: var(--ui-primary);
	}

	:global(.dark) .clear-button:hover:not(:disabled),
	:global(.dark) .demo-button:hover {
		background-color: rgba(var(--ui-accent-rgbc), 0.8);
	}

	:global(.dark) .log-entry {
		background-color: rgba(var(--ui-accent-rgbc), 0.1);
	}

	:global(.dark) .feature-list strong {
		color: var(--ui-accent);
	}

	:global(.dark) .sample-text.color-black {
		color: #ffffff;
	}

	@media (min-width: 768px) {
		.form-grid {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: 1.5rem;
			align-items: start;
		}

		.editor-controls {
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			gap: 1.5rem;
		}
	}
</style>
