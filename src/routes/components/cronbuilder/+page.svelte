<script lang="ts">
	import Paper from '$lib/display/Paper.svelte';
	import CronBuilder from '$lib/form/CronBuilder.svelte';
	import Button from '$lib/ui/Button.svelte';
	import { CronParser, getNextCronRunDate, getNextCronRunDates } from '$lib/index.js';

	let basicExpression = $state('0 0 * * *');
	let customExpression = $state('*/15 * * * *');
	let disabledExpression = $state('0 9 * * 1-5');
	let parserDemoExpression = $state('0 9 * * 1-5');

	let eventLog = $state<string[]>([]);

	function handleChange(label: string) {
		return (expr: string) => {
			const timestamp = new Date().toLocaleTimeString();
			eventLog = [`${timestamp}: ${label} changed to: ${expr}`, ...eventLog.slice(0, 9)];
		};
	}

	function copyToClipboard(text: string) {
		navigator.clipboard.writeText(text);
		const timestamp = new Date().toLocaleTimeString();
		eventLog = [`${timestamp}: Copied to clipboard: ${text}`, ...eventLog.slice(0, 9)];
	}

	function clearLog() {
		eventLog = [];
	}

	// Example expressions
	const examples = [
		{ label: 'Every minute', expression: '* * * * *' },
		{ label: 'Every 5 minutes', expression: '*/5 * * * *' },
		{ label: 'Every hour', expression: '0 * * * *' },
		{ label: 'Every day at midnight', expression: '0 0 * * *' },
		{ label: 'Every day at 9 AM', expression: '0 9 * * *' },
		{ label: 'Every weekday at 9 AM', expression: '0 9 * * 1-5' },
		{ label: 'Every Monday at 8 AM', expression: '0 8 * * 1' },
		{ label: 'Every month on the 1st at midnight', expression: '0 0 1 * *' },
		{ label: 'Every quarter (Jan/Apr/Jul/Oct) 1st at midnight', expression: '0 0 1 1,4,7,10 *' },
		{ label: 'Every year on Jan 1st at midnight', expression: '0 0 1 1 *' }
	];
</script>

<div class="page-header">
	<h1>CRON Builder</h1>
	<p>Visual builder for creating CRON schedule expressions with human-readable descriptions.</p>
</div>

<div class="vstack">
	<Paper title="Basic Usage">
		<div class="demo-section">
			<CronBuilder
				label="Schedule"
				bind:value={basicExpression}
				onchange={handleChange('Basic')}
			/>
		</div>
	</Paper>

	<Paper title="Frequency Types">
		<div class="vstack">
			<div class="info-box">
				<h4>Supported Frequencies</h4>
				<ul>
					<li><strong>Every Minute:</strong> Run at specified minute intervals</li>
					<li><strong>Hourly:</strong> Run at specified hour intervals and minute</li>
					<li><strong>Daily:</strong> Run at specified day intervals and time</li>
					<li><strong>Weekly:</strong> Run on specific days of the week at specified time</li>
					<li><strong>Monthly:</strong> Run on specific day of month at specified time</li>
					<li><strong>Yearly:</strong> Run on specific date and time each year</li>
					<li><strong>Custom:</strong> Manually enter CRON expression components</li>
				</ul>
			</div>

			<CronBuilder
				label="Configure Your Schedule"
				bind:value={customExpression}
				onchange={handleChange('Custom')}
			/>
		</div>
	</Paper>

	<Paper title="Common Examples">
		<div class="examples-section">
			<h4>Click to Copy Common CRON Expressions</h4>
			<div class="examples-grid">
				{#each examples as example}
					<button
						class="example-card"
						onclick={() => copyToClipboard(example.expression)}
					>
						<div class="example-label">{example.label}</div>
						<code class="example-expression">{example.expression}</code>
					</button>
				{/each}
			</div>
		</div>
	</Paper>

	<Paper title="Disabled State">
		<div class="demo-section">
			<CronBuilder
				label="Read-Only Schedule"
				bind:value={disabledExpression}
				disabled={true}
			/>
		</div>
	</Paper>

	<Paper title="With Validation">
		<div class="demo-section">
			<CronBuilder
				label="Required Schedule"
				bind:value={basicExpression}
				required={true}
				showError={!basicExpression}
				errorText="Schedule is required"
				tooltipText="Select how often this task should run"
				onchange={handleChange('Validation')}
			/>
		</div>
	</Paper>

	<Paper title="CRON Parser Utility">
		<div class="parser-section">
			<h4>Parse CRON Expressions and Get Next Run Dates</h4>
			<p class="section-description">
				Use the <code>CronParser</code> utility to calculate when a CRON expression will run next.
			</p>

			<div class="parser-demo">
				<div class="parser-input">
					<label for="parser-expression">CRON Expression</label>
					<input
						id="parser-expression"
						type="text"
						bind:value={parserDemoExpression}
						class="form-control"
						placeholder="0 9 * * 1-5"
					/>
				</div>

				<div class="parser-results">
					<div class="result-box">
						<h5>Next Run Date</h5>
						<code>
							{#if getNextCronRunDate(parserDemoExpression)}
								{getNextCronRunDate(parserDemoExpression)?.toLocaleString()}
							{:else}
								Invalid CRON expression
							{/if}
						</code>
					</div>

					<div class="result-box">
						<h5>Next 5 Run Dates</h5>
						<ul class="dates-list">
							{#each getNextCronRunDates(parserDemoExpression, 5) as date}
								<li>{date.toLocaleString()}</li>
							{:else}
								<li>No dates found</li>
							{/each}
						</ul>
					</div>

					<div class="result-box">
						<h5>Human Readable</h5>
						<p class="readable-output">{CronParser.getNextRunDescription(parserDemoExpression)}</p>
					</div>
				</div>

				<div class="code-example">
					<h5>Usage Example</h5>
					<pre><code>{`import { CronParser, getNextCronRunDate, getNextCronRunDates } from 'your-library';

// Get the next run date
const nextRun = getNextCronRunDate('0 9 * * 1-5');
console.log(nextRun); // Date object

// Get next 5 run dates
const next5 = getNextCronRunDates('0 9 * * 1-5', 5);
console.log(next5); // Array of Date objects

// Get human-readable description
const description = CronParser.getNextRunDescription('0 9 * * 1-5');
console.log(description); // "in 2 hours"

// Validate expression
const isValid = CronParser.isValid('0 9 * * 1-5');
console.log(isValid); // true`}</code></pre>
				</div>
			</div>
		</div>
	</Paper>

	<Paper title="Event Log">
		<div class="log-section">
			<div class="log-header">
				<h4>Changes Log</h4>
				<Button variant="secondary-subtle" onclick={clearLog}>Clear Log</Button>
			</div>
			<div class="event-log">
				{#each eventLog as entry}
					<div class="log-entry">{entry}</div>
				{/each}
				{#if eventLog.length === 0}
					<p class="no-events">No events yet. Try changing a schedule above!</p>
				{/if}
			</div>
		</div>
	</Paper>

	<Paper title="CRON Format Reference">
		<div class="reference-section">
			<h4>CRON Expression Format</h4>
			<div class="format-explanation">
				<code>* * * * *</code>
				<div class="format-parts">
					<div class="format-part">
						<div class="part-marker">│</div>
						<div class="part-label">Minute (0-59)</div>
					</div>
					<div class="format-part">
						<div class="part-marker">│</div>
						<div class="part-label">Hour (0-23)</div>
					</div>
					<div class="format-part">
						<div class="part-marker">│</div>
						<div class="part-label">Day of Month (1-31)</div>
					</div>
					<div class="format-part">
						<div class="part-marker">│</div>
						<div class="part-label">Month (1-12)</div>
					</div>
					<div class="format-part">
						<div class="part-marker">└</div>
						<div class="part-label">Day of Week (0-6, 0=Sunday)</div>
					</div>
				</div>
			</div>

			<h4>Special Characters</h4>
			<div class="special-chars">
				<div class="char-item">
					<code>*</code>
					<span>Any value (all)</span>
				</div>
				<div class="char-item">
					<code>,</code>
					<span>List separator (e.g., 1,3,5)</span>
				</div>
				<div class="char-item">
					<code>-</code>
					<span>Range (e.g., 1-5)</span>
				</div>
				<div class="char-item">
					<code>/</code>
					<span>Step values (e.g., */5 = every 5)</span>
				</div>
			</div>
		</div>
	</Paper>

	<Paper title="Features">
		<div class="feature-list">
			<ul>
				<li><strong>Visual Builder:</strong> Easy-to-use interface for creating CRON expressions</li>
				<li><strong>Multiple Frequencies:</strong> Support for minute, hourly, daily, weekly, monthly, yearly schedules</li>
				<li><strong>Custom Mode:</strong> Direct input for advanced CRON expressions</li>
				<li><strong>Expression Parsing:</strong> Automatically detects and sets up UI from existing expressions</li>
				<li><strong>Human Readable:</strong> Shows plain English description of schedule</li>
				<li><strong>Real-time Preview:</strong> See CRON expression update as you configure</li>
				<li><strong>Day Selection:</strong> Interactive buttons for selecting weekdays</li>
				<li><strong>Time Pickers:</strong> Hour and minute dropdowns for precise timing</li>
				<li><strong>Validation:</strong> Built-in validation and error handling</li>
				<li><strong>Tooltips:</strong> Support for help text and rich tooltip content</li>
				<li><strong>Disabled State:</strong> Read-only mode for displaying schedules</li>
				<li><strong>Reactive:</strong> Two-way binding with parent components</li>
				<li><strong>Change Events:</strong> Callback function for expression updates</li>
				<li><strong>Responsive:</strong> Mobile-friendly layout that adapts to screen size</li>
				<li><strong>Theme Support:</strong> Full light/dark mode integration</li>
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
		padding: 1rem 0;
	}

	.info-box {
		padding: 1.5rem;
		background: rgba(var(--ui-primary-rgbc), 0.05);
		border-radius: 0.5rem;
		border: 1px solid var(--border-color);
		margin-bottom: 2rem;
	}

	.info-box h4 {
		color: var(--text-color);
		font-size: 1.125rem;
		font-weight: 600;
		margin: 0 0 1rem 0;
	}

	.info-box ul {
		margin: 0;
		padding-left: 1.5rem;
		color: var(--text-color);
	}

	.info-box li {
		margin-bottom: 0.5rem;
		line-height: 1.6;
	}

	.info-box strong {
		color: var(--ui-primary);
		font-weight: 600;
	}

	.examples-section h4 {
		color: var(--text-color);
		font-size: 1.125rem;
		font-weight: 600;
		margin: 0 0 1rem 0;
	}

	.examples-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		gap: 1rem;
	}

	.example-card {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 1rem;
		background: var(--input-bg);
		border: 1px solid var(--border-color);
		border-radius: 0.375rem;
		cursor: pointer;
		transition: all 0.2s;
		text-align: left;
	}

	.example-card:hover {
		background: rgba(var(--ui-primary-rgbc), 0.05);
		border-color: var(--ui-primary);
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	.example-label {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-color);
	}

	.example-expression {
		font-family: 'Courier New', monospace;
		font-size: 0.75rem;
		color: var(--ui-primary);
		background: rgba(var(--ui-primary-rgbc), 0.1);
		padding: 0.25rem 0.5rem;
		border-radius: 0.25rem;
	}

	.log-section {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.log-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.log-header h4 {
		color: var(--text-color);
		font-size: 1.125rem;
		font-weight: 600;
		margin: 0;
	}

	.event-log {
		padding: 1rem;
		background: rgba(var(--ui-primary-rgbc), 0.05);
		border-radius: 0.375rem;
		border: 1px solid var(--border-color);
		min-height: 100px;
		max-height: 300px;
		overflow-y: auto;
	}

	.log-entry {
		font-family: 'Courier New', monospace;
		font-size: 0.875rem;
		color: var(--text-color);
		margin: 0.25rem 0;
		padding: 0.25rem 0.5rem;
		background: rgba(var(--ui-primary-rgbc), 0.1);
		border-radius: 0.25rem;
	}

	.no-events {
		color: var(--text-muted);
		font-style: italic;
		margin: 0;
		text-align: center;
	}

	.reference-section h4 {
		color: var(--text-color);
		font-size: 1.125rem;
		font-weight: 600;
		margin: 0 0 1rem 0;
	}

	.format-explanation {
		margin-bottom: 2rem;
	}

	.format-explanation > code {
		font-size: 1.5rem;
		font-family: 'Courier New', monospace;
		color: var(--ui-primary);
		display: block;
		margin-bottom: 1rem;
		font-weight: 600;
	}

	.format-parts {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 0.5rem;
	}

	.format-part {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}

	.part-marker {
		font-family: 'Courier New', monospace;
		font-size: 1.5rem;
		color: var(--text-muted);
	}

	.part-label {
		font-size: 0.75rem;
		color: var(--text-color);
		text-align: center;
		line-height: 1.3;
	}

	.special-chars {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 1rem;
	}

	.char-item {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 0.75rem;
		background: rgba(var(--ui-primary-rgbc), 0.05);
		border-radius: 0.375rem;
		border: 1px solid var(--border-color);
	}

	.char-item code {
		font-family: 'Courier New', monospace;
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--ui-primary);
		background: rgba(var(--ui-primary-rgbc), 0.1);
		padding: 0.25rem 0.5rem;
		border-radius: 0.25rem;
		min-width: 3rem;
		text-align: center;
	}

	.char-item span {
		font-size: 0.875rem;
		color: var(--text-color);
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

	.parser-section h4,
	.parser-section .section-description {
		margin-bottom: 1rem;
	}

	.parser-section h4 {
		color: var(--text-color);
		font-size: 1.125rem;
		font-weight: 600;
	}

	.section-description {
		color: var(--text-muted);
		font-size: 0.875rem;
	}

	.section-description code {
		background: rgba(var(--ui-primary-rgbc), 0.1);
		padding: 0.125rem 0.25rem;
		border-radius: 0.25rem;
		font-family: monospace;
		font-size: 0.875rem;
		color: var(--ui-primary);
	}

	.parser-demo {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.parser-input {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.parser-input label {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-color);
	}

	.parser-input .form-control {
		width: 100%;
		padding: 0.5rem;
		border: 1px solid var(--border-color);
		border-radius: 0.375rem;
		background: var(--input-bg);
		color: var(--text-color);
		font-size: 0.875rem;
		font-family: monospace;
	}

	.parser-input .form-control:focus {
		outline: none;
		border-color: var(--ui-primary);
	}

	.parser-results {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 1rem;
	}

	.result-box {
		padding: 1rem;
		background: rgba(var(--ui-primary-rgbc), 0.05);
		border: 1px solid var(--border-color);
		border-radius: 0.375rem;
	}

	.result-box h5 {
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--text-muted);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin: 0 0 0.5rem 0;
	}

	.result-box code {
		font-family: monospace;
		font-size: 0.875rem;
		color: var(--ui-primary);
		word-break: break-all;
	}

	.dates-list {
		margin: 0;
		padding-left: 1.25rem;
		list-style: none;
	}

	.dates-list li {
		font-size: 0.875rem;
		color: var(--text-color);
		margin-bottom: 0.25rem;
		font-family: monospace;
	}

	.dates-list li::before {
		content: '▸ ';
		color: var(--ui-primary);
		margin-right: 0.25rem;
	}

	.readable-output {
		font-size: 0.875rem;
		color: var(--text-color);
		margin: 0;
	}

	.code-example {
		background: rgba(var(--ui-primary-rgbc), 0.05);
		border: 1px solid var(--border-color);
		border-radius: 0.375rem;
		padding: 1rem;
	}

	.code-example h5 {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-color);
		margin: 0 0 0.75rem 0;
	}

	.code-example pre {
		margin: 0;
		overflow-x: auto;
	}

	.code-example code {
		font-family: monospace;
		font-size: 0.8125rem;
		color: var(--text-color);
		line-height: 1.5;
	}

	:global(.dark) .info-box,
	:global(.dark) .event-log,
	:global(.dark) .char-item {
		background-color: rgba(var(--ui-accent-rgbc), 0.05);
	}

	:global(.dark) .example-card:hover {
		background: rgba(var(--ui-accent-rgbc), 0.05);
		border-color: var(--ui-accent);
	}

	:global(.dark) .info-box strong,
	:global(.dark) .feature-list strong {
		color: var(--ui-accent);
	}

	:global(.dark) .section-description code,
	:global(.dark) .result-box code {
		color: var(--ui-accent);
	}

	:global(.dark) .dates-list li::before {
		color: var(--ui-accent);
	}

	:global(.dark) .result-box,
	:global(.dark) .code-example {
		background-color: rgba(var(--ui-accent-rgbc), 0.05);
	}

	:global(.dark) .example-expression,
	:global(.dark) .format-explanation > code,
	:global(.dark) .char-item code {
		color: var(--ui-accent);
	}

	:global(.dark) .log-entry {
		background-color: rgba(var(--ui-accent-rgbc), 0.1);
	}

	@media (max-width: 768px) {
		.format-parts {
			grid-template-columns: 1fr;
		}

		.examples-grid {
			grid-template-columns: 1fr;
		}

		.special-chars {
			grid-template-columns: 1fr;
		}
	}
</style>