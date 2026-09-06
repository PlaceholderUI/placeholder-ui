<script lang="ts">
	import Paper from '$lib/display/Paper.svelte';
	import DateRangePicker from '$lib/form/DateRangePicker.svelte';
	import dayjs from 'dayjs';

	let basicStart = $state<string | undefined>(undefined);
	let basicEnd = $state<string | undefined>(undefined);

	let prefilledStart = $state(dayjs().startOf('week').add(1, 'day').format('YYYY-MM-DD'));
	let prefilledEnd = $state(dayjs().startOf('week').add(7, 'day').format('YYYY-MM-DD'));

	let restrictedStart = $state<string | undefined>(undefined);
	let restrictedEnd = $state<string | undefined>(undefined);

	let disabledStart = $state('2025-03-01');
	let disabledEnd = $state('2025-03-14');

	const today = dayjs();
	const minDate = today.subtract(2, 'week').format('YYYY-MM-DD');
	const maxDate = today.add(2, 'week').format('YYYY-MM-DD');

	function handleRangeChange(start: string | undefined, end: string | undefined) {
		console.log('Range changed:', start, '→', end);
	}
</script>

<div class="page-header">
	<h1>DateRangePicker</h1>
	<p>Date range selection component with visual range highlighting and hover preview.</p>
</div>

<div class="vstack">
	<Paper title="Basic Usage">
		<div class="form-grid">
			<DateRangePicker label="Date Range" bind:startDate={basicStart} bind:endDate={basicEnd} />
			<div class="date-info">
				<strong>Selected Range:</strong>
				<p>Start: {basicStart || 'Not selected'}</p>
				<p>End: {basicEnd || 'Not selected'}</p>
				{#if basicStart && basicEnd}
					<p>
						<em>
							{dayjs(basicEnd).diff(dayjs(basicStart), 'day') + 1} days selected
						</em>
					</p>
				{/if}
			</div>
		</div>
	</Paper>

	<Paper title="Pre-filled Range">
		<div class="form-grid">
			<DateRangePicker
				label="This Week"
				bind:startDate={prefilledStart}
				bind:endDate={prefilledEnd}
			/>
			<div class="date-info">
				<strong>Range:</strong>
				<p>Start: {prefilledStart ? dayjs(prefilledStart).format('D MMMM YYYY') : '–'}</p>
				<p>End: {prefilledEnd ? dayjs(prefilledEnd).format('D MMMM YYYY') : '–'}</p>
			</div>
		</div>
	</Paper>

	<Paper title="States">
		<div class="form-grid">
			<DateRangePicker
				label="Required"
				required
				bind:startDate={basicStart}
				bind:endDate={basicEnd}
			/>
			<DateRangePicker
				label="Disabled"
				disabled
				bind:startDate={disabledStart}
				bind:endDate={disabledEnd}
			/>
		</div>
	</Paper>

	<Paper title="With Min / Max Restrictions">
		<div class="form-grid">
			<DateRangePicker
				label="±2 Weeks from Today"
				bind:startDate={restrictedStart}
				bind:endDate={restrictedEnd}
				{minDate}
				{maxDate}
			/>
			<div class="date-info">
				<strong>Allowed Window:</strong>
				<p>Min: {dayjs(minDate).format('D MMMM YYYY')}</p>
				<p>Max: {dayjs(maxDate).format('D MMMM YYYY')}</p>
				<p>Selected: {restrictedStart || '–'} → {restrictedEnd || '–'}</p>
			</div>
		</div>
	</Paper>

	<Paper title="With Change Handler">
		<div class="form-grid">
			<DateRangePicker
				label="Range with Handler"
				bind:startDate={basicStart}
				bind:endDate={basicEnd}
				onchange={handleRangeChange}
			/>
			<div class="date-info">
				<p>This picker logs changes to the browser console.</p>
				<p>Open DevTools to see the output.</p>
			</div>
		</div>
	</Paper>

	<Paper title="Features">
		<ul class="feature-list">
			<li><strong>Two-click selection:</strong> First click sets start, second sets end</li>
			<li>
				<strong>Hover preview:</strong> Hover over dates to preview the range before confirming
			</li>
			<li><strong>Range highlight:</strong> Selected range shown with a background color strip</li>
			<li><strong>Auto-swap:</strong> Selecting an end before start automatically swaps them</li>
			<li><strong>Cancel on close:</strong> Clicking outside cancels an incomplete selection</li>
			<li><strong>Clear button:</strong> Click × to clear the entire range</li>
			<li><strong>Year picker:</strong> Click month/year header to jump to a different year</li>
			<li><strong>Min / max dates:</strong> Restrict the selectable range</li>
			<li><strong>Theme support:</strong> Adapts to light and dark mode</li>
		</ul>
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

	@media (min-width: 768px) {
		.form-grid {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: 1.5rem;
			align-items: start;
		}
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

	.feature-list {
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
</style>
