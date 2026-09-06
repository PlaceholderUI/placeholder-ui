<script lang="ts">
	import Paper from '$lib/display/Paper.svelte';
	import TimePicker from '$lib/form/TimePicker.svelte';
	import dayjs from 'dayjs';

	let basicTime: string | undefined = $state(undefined);
	let prefilledTime: string | undefined = $state('14:30:00');
	let disabledTime: string | undefined = $state('09:15:00');
	let businessHoursTime: string | undefined = $state(undefined);
	let afternoonTime: string | undefined = $state(undefined);
	let morningTime: string | undefined = $state(undefined);

	// Time restrictions examples
	const today = dayjs();
	const businessHoursStart = today.hour(9).minute(0).second(0).format('YYYY-MM-DDTHH:mm:ssZ');
	const businessHoursEnd = today.hour(17).minute(0).second(0).format('YYYY-MM-DDTHH:mm:ssZ');

	const afternoonStart = today.hour(12).minute(0).second(0).format('YYYY-MM-DDTHH:mm:ssZ');
	const afternoonEnd = today.hour(18).minute(0).second(0).format('YYYY-MM-DDTHH:mm:ssZ');

	const morningStart = today.hour(6).minute(0).second(0).format('YYYY-MM-DDTHH:mm:ssZ');
	const morningEnd = today.hour(12).minute(0).second(0).format('YYYY-MM-DDTHH:mm:ssZ');

	function formatTime(time: string | undefined): string {
		if (!time) return 'None';
		const [hours, minutes] = time.split(':');
		return dayjs().hour(parseInt(hours)).minute(parseInt(minutes)).format('h:mm A');
	}
</script>

<div class="page-header">
	<h1>TimePicker</h1>
	<p>Time selection component with text input support.</p>
</div>

<div class="vstack">
	<Paper title="Basic Usage">
		<div class="form-grid">
			<TimePicker label="Select Time" bind:value={basicTime} />
			<div class="date-info">
				<strong>Selected Time:</strong>
				<p>Raw: {basicTime || 'No time selected'}</p>
				{#if basicTime}
					<p><em>Formatted: {formatTime(basicTime)}</em></p>
				{/if}
			</div>
		</div>
	</Paper>

	<Paper title="Prefilled Time">
		<div class="form-grid">
			<TimePicker label="Appointment Time" bind:value={prefilledTime} />
			<div class="date-info">
				<strong>Selected Time:</strong>
				<p>Raw: {prefilledTime}</p>
				<p><em>Formatted: {formatTime(prefilledTime)}</em></p>
			</div>
		</div>
	</Paper>

	<Paper title="States">
		<div class="form-grid">
			<TimePicker label="Disabled Time" disabled={true} bind:value={disabledTime} />
			<div class="date-info">
				<strong>Disabled State:</strong>
				<p>Time: {formatTime(disabledTime)}</p>
				<p><em>This time picker is disabled and cannot be changed</em></p>
			</div>
		</div>
	</Paper>

	<Paper title="Business Hours (9 AM - 5 PM)">
		<div class="form-grid">
			<TimePicker
				label="Schedule During Business Hours"
				bind:value={businessHoursTime}
				minDate={businessHoursStart}
				maxDate={businessHoursEnd}
				selectedDate={today.format('YYYY-MM-DD')}
			/>
			<div class="date-info">
				<strong>Time Restrictions:</strong>
				<p>Min: 9:00 AM</p>
				<p>Max: 5:00 PM</p>
				<p>Selected: {formatTime(businessHoursTime)}</p>
				<p>
					<em
						>Hours and minutes are restricted to business hours. AM/PM toggle is disabled when
						switching would be invalid.</em
					>
				</p>
			</div>
		</div>
	</Paper>

	<Paper title="Afternoon Only (12 PM - 6 PM)">
		<div class="form-grid">
			<TimePicker
				label="Afternoon Appointment"
				bind:value={afternoonTime}
				minDate={afternoonStart}
				maxDate={afternoonEnd}
				selectedDate={today.format('YYYY-MM-DD')}
			/>
			<div class="date-info">
				<strong>Time Restrictions:</strong>
				<p>Min: 12:00 PM</p>
				<p>Max: 6:00 PM</p>
				<p>Selected: {formatTime(afternoonTime)}</p>
				<p>
					<em>Only afternoon times are available. Try toggling AM/PM - it will be disabled.</em>
				</p>
			</div>
		</div>
	</Paper>

	<Paper title="Morning Only (6 AM - 12 PM)">
		<div class="form-grid">
			<TimePicker
				label="Morning Slot"
				bind:value={morningTime}
				minDate={morningStart}
				maxDate={morningEnd}
				selectedDate={today.format('YYYY-MM-DD')}
			/>
			<div class="date-info">
				<strong>Time Restrictions:</strong>
				<p>Min: 6:00 AM</p>
				<p>Max: 12:00 PM</p>
				<p>Selected: {formatTime(morningTime)}</p>
				<p><em>Only morning times are available. PM is disabled.</em></p>
			</div>
		</div>
	</Paper>

	<Paper title="Features">
		<div class="feature-list">
			<ul>
				<li><strong>12-hour format:</strong> Uses AM/PM time format for easy selection</li>
				<li>
					<strong>Hour selection:</strong> Choose hours from 1-12 with increment/decrement buttons
				</li>
				<li>
					<strong>Minute selection:</strong> Choose minutes from 0-59 with increment/decrement buttons
				</li>
				<li><strong>AM/PM toggle:</strong> Quick toggle button to switch between AM and PM</li>
				<li>
					<strong>Time restrictions:</strong> Supports minDate/maxDate to constrain available times
				</li>
				<li>
					<strong>Smart constraints:</strong> When time is restricted, hours/minutes update dynamically
					and AM/PM toggle disables when invalid
				</li>
				<li><strong>Keyboard input:</strong> Direct number input for precise time entry</li>
				<li><strong>Visual feedback:</strong> Disabled states are clearly indicated</li>
				<li><strong>Theme support:</strong> Colors adapt to light/dark mode</li>
				<li>
					<strong>Compact design:</strong> Clean, minimal interface that fits inline with forms
				</li>
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
