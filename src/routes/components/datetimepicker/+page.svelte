<script lang="ts">
	import Paper from '$lib/display/Paper.svelte';
	import DateTimePicker from '$lib/form/DateTimePicker.svelte';
	import dayjs from 'dayjs';

	let basicTime: string | undefined = $state(undefined);
	let requiredDateTime: string | undefined = $state(undefined);
	let disabledDateTime: string | undefined = $state('2024-08-24T14:30:00Z');
	let minMaxDateTime: string | undefined = $state(undefined);
	let pastOnlyDateTime: string | undefined = $state(undefined);
	let futureOnlyDateTime: string | undefined = $state(undefined);
	let timeRestrictedDateTime: string | undefined = $state(undefined);
	let businessHoursDateTime: string | undefined = $state(undefined);

	// Min/max date examples
	const today = dayjs();
	const oneWeekAgo = today.subtract(1, 'week').hour(9).minute(30).format('YYYY-MM-DDTHH:mm:ssZ');
	const oneWeekFromNow = today.add(1, 'week').hour(17).minute(45).format('YYYY-MM-DDTHH:mm:ssZ');
	const oneMonthFromNow = today.add(1, 'month').format('YYYY-MM-DD');

	// Time-specific restrictions
	const todayAt2pm = today.hour(14).minute(0).second(0).format('YYYY-MM-DDTHH:mm:ssZ');
	const todayAt6pm = today.hour(18).minute(30).second(0).format('YYYY-MM-DDTHH:mm:ssZ');

	// Business hours: 9 AM to 5 PM
	const businessHoursStart = today.hour(9).minute(0).second(0).format('YYYY-MM-DDTHH:mm:ssZ');
	const businessHoursEnd = today.hour(17).minute(0).second(0).format('YYYY-MM-DDTHH:mm:ssZ');

	function handleDateTimeChange(dateTime: string | undefined) {
		console.log('DateTime changed:', dateTime);
	}

	let tomorrowNinePm = $state(
		dayjs().add(1, 'day').hour(21).minute(30).second(0).format('YYYY-MM-DDTHH:mm:ssZ')
	);
</script>

<div class="page-header">
	<h1>Date Time Picker</h1>
	<p>Date time selection component with text input support and a time picker.</p>
</div>

<div class="vstack">
	<Paper title="Basic Usage">
		<div class="form-grid">
			<DateTimePicker label="Select Date & Time" bind:value={basicTime} />
			<div class="date-info">
				<strong>Selected date time:</strong>
				<p>{basicTime || 'No time selected'}</p>
				{#if basicTime}
					<p><em>Formatted: {dayjs(basicTime).format('dddd, MMMM D, YYYY - h:mm A')}</em></p>
				{/if}
			</div>
		</div>
	</Paper>
	<Paper title="Prefilled">
		<div class="form-grid">
			<DateTimePicker label="Select Date & Time" bind:value={tomorrowNinePm} />
			<div class="date-info">
				<strong>Selected date time:</strong>
				<p>{tomorrowNinePm || 'No time selected'}</p>
				{#if tomorrowNinePm}
					<p><em>Formatted: {dayjs(tomorrowNinePm).format('dddd, MMMM D, YYYY - h:mm A')}</em></p>
				{/if}
			</div>
		</div>
	</Paper>

	<Paper title="States">
		<div class="form-grid">
			<DateTimePicker label="Required DateTime" required={true} bind:value={requiredDateTime} />
			<DateTimePicker label="Disabled" disabled={true} bind:value={disabledDateTime} />
			<div class="date-info">
				<strong>Values:</strong>
				<p>Required: {requiredDateTime || 'None'}</p>
				<p>Disabled: {disabledDateTime}</p>
			</div>
		</div>
	</Paper>

	<Paper title="Date Range Restrictions">
		<div class="form-grid">
			<DateTimePicker
				label="Limited Date Range"
				bind:value={minMaxDateTime}
				minDate={oneWeekAgo}
				maxDate={oneWeekFromNow}
				onchange={handleDateTimeChange}
			/>
			<div class="date-info">
				<strong>Date Range:</strong>
				<p>Min: {dayjs(oneWeekAgo).format('MMMM D, YYYY - h:mm A')}</p>
				<p>Max: {dayjs(oneWeekFromNow).format('MMMM D, YYYY - h:mm A')}</p>
				<p>Selected: {minMaxDateTime || 'None'}</p>
				{#if minMaxDateTime}
					<p><em>Formatted: {dayjs(minMaxDateTime).format('MMMM D, YYYY - h:mm A')}</em></p>
				{/if}
				<p><em>Try selecting the min or max date to see time restrictions</em></p>
			</div>
		</div>
	</Paper>

	<Paper title="Time-Specific Restrictions">
		<div class="form-grid">
			<DateTimePicker
				label="Same Day Time Range (2:00 PM - 6:30 PM)"
				bind:value={timeRestrictedDateTime}
				minDate={todayAt2pm}
				maxDate={todayAt6pm}
			/>
			<div class="date-info">
				<strong>Time Restrictions:</strong>
				<p>Min: {dayjs(todayAt2pm).format('h:mm A')}</p>
				<p>Max: {dayjs(todayAt6pm).format('h:mm A')}</p>
				<p>
					Selected: {timeRestrictedDateTime
						? dayjs(timeRestrictedDateTime).format('h:mm A')
						: 'None'}
				</p>
				<p><em>Only today's date is available, with times restricted to 2:00 PM - 6:30 PM</em></p>
			</div>
		</div>
	</Paper>

	<Paper title="Business Hours (9 AM - 5 PM)">
		<div class="form-grid">
			<DateTimePicker
				label="Schedule During Business Hours"
				bind:value={businessHoursDateTime}
				minDate={businessHoursStart}
				maxDate={businessHoursEnd}
			/>
			<div class="date-info">
				<strong>Business Hours:</strong>
				<p>Hours: 9:00 AM - 5:00 PM</p>
				<p>
					Selected: {businessHoursDateTime ? dayjs(businessHoursDateTime).format('h:mm A') : 'None'}
				</p>
				<p><em>Only today is available, with times restricted to business hours</em></p>
			</div>
		</div>
	</Paper>

	<Paper title="Past and Future Only">
		<div class="form-grid">
			<DateTimePicker
				label="Past Dates Only"
				bind:value={pastOnlyDateTime}
				maxDate={today.format('YYYY-MM-DD')}
			/>
			<DateTimePicker
				label="Future Dates Only"
				bind:value={futureOnlyDateTime}
				minDate={today.format('YYYY-MM-DD')}
				maxDate={oneMonthFromNow}
			/>
			<div class="date-info">
				<strong>Restrictions:</strong>
				<p>Past only: {pastOnlyDateTime || 'None'}</p>
				<p>Future only: {futureOnlyDateTime || 'None'}</p>
			</div>
		</div>
	</Paper>

	<Paper title="Features">
		<div class="feature-list">
			<ul>
				<li><strong>Combined date and time:</strong> Select both date and time in one component</li>
				<li>
					<strong>Calendar popup:</strong> Click on the input to open a visual calendar with time picker
				</li>
				<li>
					<strong>Keyboard input:</strong> Type dates in formats like "15 January 2024" or "15/01/2024"
				</li>
				<li><strong>Today highlighting:</strong> Current date is highlighted in the calendar</li>
				<li>
					<strong>Weekend styling:</strong> Weekends (Saturday/Sunday) are colored differently
				</li>
				<li><strong>Month navigation:</strong> Use arrow buttons to navigate between months</li>
				<li><strong>Time selection:</strong> Integrated time picker for precise time selection</li>
				<li><strong>Date restrictions:</strong> Set minimum and maximum selectable dates</li>
				<li>
					<strong>Time restrictions:</strong> Time picker respects minDate/maxDate - when selecting boundary
					dates, available times are automatically constrained
				</li>
				<li><strong>Visual feedback:</strong> Disabled dates are grayed out and unclickable</li>
				<li><strong>Click outside to close:</strong> Calendar closes when clicking outside</li>
				<li><strong>Theme support:</strong> Colors adapt to light/dark mode</li>
				<li><strong>Accessible:</strong> Supports keyboard navigation and screen readers</li>
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

	.vstack {
		display: flex;
		flex-direction: column;
		gap: 2rem;
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
