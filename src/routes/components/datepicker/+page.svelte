<script lang="ts">
	import Paper from '$lib/display/Paper.svelte';
	import DatePicker from '$lib/form/DatePicker.svelte';
	import dayjs from 'dayjs';

	let basicDate = '';
	let requiredDate = '';
	let disabledDate = '2024-01-15';
	let prefilledDate = dayjs().format('YYYY-MM-DD');
	let minimalDate = '';
	let minMaxDate = '';
	let pastOnlyDate = '';
	let futureOnlyDate = '';
	let tooltipDate = '';

	// Min/max date examples
	const today = dayjs();
	const oneWeekAgo = today.subtract(1, 'week').format('YYYY-MM-DD');
	const oneWeekFromNow = today.add(1, 'week').format('YYYY-MM-DD');
	const oneMonthFromNow = today.add(1, 'month').format('YYYY-MM-DD');

	function handleDateChange(date: string | undefined) {
		console.log('Date changed:', date);
	}
</script>

<div class="page-header">
	<h1>DatePicker</h1>
	<p>Date selection component with calendar popup and text input support.</p>
</div>

<div class="vstack">
	<Paper title="Basic Usage">
		<div class="form-grid">
			<DatePicker label="Select Date" bind:value={basicDate} />
			<div class="date-info">
				<strong>Selected Date:</strong>
				<p>{basicDate || 'No date selected'}</p>
				{#if basicDate}
					<p><em>Formatted: {dayjs(basicDate).format('dddd, MMMM D, YYYY')}</em></p>
				{/if}
			</div>
		</div>
	</Paper>

	<Paper title="States">
		<div class="form-grid">
			<DatePicker 
				label="Required Date" 
				required={true} 
				bind:value={requiredDate} 
			/>
			<DatePicker 
				label="Disabled" 
				disabled={true} 
				bind:value={disabledDate} 
			/>
			<DatePicker 
				label="Pre-filled Date" 
				bind:value={prefilledDate} 
			/>
			<div class="date-info">
				<strong>Values:</strong>
				<p>Required: {requiredDate || 'None'}</p>
				<p>Disabled: {disabledDate}</p>
				<p>Pre-filled: {prefilledDate}</p>
			</div>
		</div>
	</Paper>

	<Paper title="With Event Handler">
		<div class="form-grid">
			<DatePicker 
				label="Date with Change Handler" 
				bind:value={basicDate}
				onchange={handleDateChange}
			/>
			<div class="date-info">
				<p>This DatePicker logs changes to the console.</p>
				<p>Open your browser's developer tools to see the output.</p>
			</div>
		</div>
	</Paper>

	<Paper title="Minimal Style">
		<div class="form-grid">
			<DatePicker bind:value={minimalDate} />
			<div class="date-info">
				<strong>No Label:</strong>
				<p>{minimalDate || 'No date selected'}</p>
			</div>
		</div>
	</Paper>

	<Paper title="Date Range Restrictions">
		<div class="form-grid">
			<DatePicker 
				label="Limited Range" 
				bind:value={minMaxDate} 
				minDate={oneWeekAgo}
				maxDate={oneWeekFromNow}
			/>
			<div class="date-info">
				<strong>Date Range:</strong>
				<p>Min: {dayjs(oneWeekAgo).format('MMMM D, YYYY')}</p>
				<p>Max: {dayjs(oneWeekFromNow).format('MMMM D, YYYY')}</p>
				<p>Selected: {minMaxDate || 'None'}</p>
			</div>
		</div>
	</Paper>

	<Paper title="Past and Future Only">
		<div class="form-grid">
			<DatePicker 
				label="Past Dates Only" 
				bind:value={pastOnlyDate} 
				maxDate={today.format('YYYY-MM-DD')}
			/>
			<DatePicker 
				label="Future Dates Only" 
				bind:value={futureOnlyDate} 
				minDate={today.format('YYYY-MM-DD')}
				maxDate={oneMonthFromNow}
			/>
			<div class="date-info">
				<strong>Restrictions:</strong>
				<p>Past only: {pastOnlyDate || 'None'}</p>
				<p>Future only: {futureOnlyDate || 'None'}</p>
			</div>
		</div>
	</Paper>

	<Paper title="Tooltips">
		<div class="form-grid">
			<DatePicker
				label="Simple Tooltip"
				tooltipText="Select a date from the calendar"
				bind:value={tooltipDate}
			/>
			<DatePicker label="Rich Tooltip" bind:value={tooltipDate}>
				{#snippet tooltipContent()}
					<strong>Date format:</strong> dates are stored in
					<code>YYYY-MM-DD</code> format.
				{/snippet}
			</DatePicker>
		</div>
	</Paper>

	<Paper title="Features">
		<div class="feature-list">
			<ul>
				<li><strong>Calendar popup:</strong> Click on the input to open a visual calendar</li>
				<li><strong>Keyboard input:</strong> Type dates in formats like "15 January 2024" or "15/01/2024"</li>
				<li><strong>Today highlighting:</strong> Current date is highlighted in the calendar</li>
				<li><strong>Weekend styling:</strong> Weekends (Saturday/Sunday) are colored differently</li>
				<li><strong>Month navigation:</strong> Use arrow buttons to navigate between months</li>
				<li><strong>Click outside to close:</strong> Calendar closes when clicking outside</li>
				<li><strong>Theme support:</strong> Colors adapt to light/dark mode</li>
				<li><strong>Accessible:</strong> Supports keyboard navigation and screen readers</li>
				<li><strong>Date restrictions:</strong> Set minimum and maximum selectable dates</li>
				<li><strong>Visual feedback:</strong> Disabled dates are grayed out and unclickable</li>
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

	.form-grid {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.date-info {
		padding: 1rem;
		background-color: rgba(var(--ui-primary-rgbc), 0.05);
		border-radius: 0.375rem;
		border: 1px solid var(--border-color);
	}

	.date-info strong {
		color: var(--text-color);
		font-weight: 600;
	}

	.date-info p {
		margin: 0.25rem 0 0 0;
		color: var(--text-muted);
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

	:global(.dark) .date-info {
		background-color: rgba(var(--ui-accent-rgbc), 0.05);
	}

	:global(.dark) .feature-list strong {
		color: var(--ui-accent);
	}

	@media (min-width: 768px) {
		.form-grid {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: 1.5rem;
			align-items: start;
		}
	}
</style>