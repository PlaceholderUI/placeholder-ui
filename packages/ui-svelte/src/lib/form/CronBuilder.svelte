<script lang="ts">
	import FormGroup from './FormGroup.svelte';
	import Select from './Select.svelte';
	import Number from './Number.svelte';
	import Checkbox from './Checkbox.svelte';
	import type { ComboBoxItem } from '../models/ComboBoxItem.js';
	import { type Snippet, onMount, untrack } from 'svelte';
	import { CronParser } from '../util/CronParser.js';

	interface Props {
		label?: string;
		value?: string;
		placeholder?: string;
		class?: string;
		containerClass?: string;
		disabled?: boolean;
		required?: boolean;
		showError?: boolean;
		errorText?: string;
		tooltipContent?: Snippet;
		tooltipText?: string;
		tooltipLocation?: 'top' | 'bottom' | 'left' | 'right';
		onchange?: (expression: string) => void;
	}

	let {
		label = 'Schedule',
		value = $bindable('0 0 * * *'),
		placeholder = '',
		class: classes = '',
		containerClass = '',
		disabled = false,
		required = false,
		showError = false,
		errorText = '',
		tooltipContent,
		tooltipText,
		tooltipLocation = 'top',
		onchange
	}: Props = $props();

	type FrequencyType = 'minute' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';

	let frequency = $state<FrequencyType>('daily');
	let isParsingExpression = false;

	// Minute settings
	let minuteInterval = $state(1);

	// Hourly settings
	let hourlyMinute = $state(0);
	let hourlyInterval = $state(1);

	// Daily settings
	let dailyHour = $state(0);
	let dailyMinute = $state(0);
	let dailyInterval = $state(1);

	// Weekly settings
	let weeklyDays = $state<number[]>([1]); // 0=Sunday, 1=Monday, etc.
	let weeklyHour = $state(0);
	let weeklyMinute = $state(0);

	// Monthly settings
	let monthlyDay = $state(1);
	let monthlyHour = $state(0);
	let monthlyMinute = $state(0);

	// Yearly settings
	let yearlyMonth = $state(1);
	let yearlyDay = $state(1);
	let yearlyHour = $state(0);
	let yearlyMinute = $state(0);

	// Custom settings
	let customMinute = $state('*');
	let customHour = $state('*');
	let customDayOfMonth = $state('*');
	let customMonth = $state('*');
	let customDayOfWeek = $state('*');

	const frequencyOptions: ComboBoxItem[] = [
		{ label: 'Every Minute', value: 'minute' },
		{ label: 'Hourly', value: 'hourly' },
		{ label: 'Daily', value: 'daily' },
		{ label: 'Weekly', value: 'weekly' },
		{ label: 'Monthly', value: 'monthly' },
		{ label: 'Yearly', value: 'yearly' },
		{ label: 'Custom', value: 'custom' }
	];

	const dayOptions: ComboBoxItem[] = Array.from({ length: 31 }, (_, i) => ({
		label: String(i + 1),
		value: String(i + 1)
	}));

	const hourOptions: ComboBoxItem[] = Array.from({ length: 24 }, (_, i) => ({
		label: i.toString().padStart(2, '0'),
		value: String(i)
	}));

	const minuteOptions: ComboBoxItem[] = Array.from({ length: 60 }, (_, i) => ({
		label: i.toString().padStart(2, '0'),
		value: String(i)
	}));

	const monthOptions: ComboBoxItem[] = [
		{ label: 'January', value: '1' },
		{ label: 'February', value: '2' },
		{ label: 'March', value: '3' },
		{ label: 'April', value: '4' },
		{ label: 'May', value: '5' },
		{ label: 'June', value: '6' },
		{ label: 'July', value: '7' },
		{ label: 'August', value: '8' },
		{ label: 'September', value: '9' },
		{ label: 'October', value: '10' },
		{ label: 'November', value: '11' },
		{ label: 'December', value: '12' }
	];

	const weekDays = [
		{ label: 'Sunday', value: 0 },
		{ label: 'Monday', value: 1 },
		{ label: 'Tuesday', value: 2 },
		{ label: 'Wednesday', value: 3 },
		{ label: 'Thursday', value: 4 },
		{ label: 'Friday', value: 5 },
		{ label: 'Saturday', value: 6 }
	];

	function generateExpression(): string {
		let expr = '';

		switch (frequency) {
			case 'minute':
				expr = `*/${minuteInterval} * * * *`;
				break;

			case 'hourly':
				expr = `${hourlyMinute} */${hourlyInterval} * * *`;
				break;

			case 'daily':
				expr = `${dailyMinute} ${dailyHour} */${dailyInterval} * *`;
				break;

			case 'weekly':
				const days = weeklyDays.length > 0 ? weeklyDays.sort().join(',') : '*';
				expr = `${weeklyMinute} ${weeklyHour} * * ${days}`;
				break;

			case 'monthly':
				expr = `${monthlyMinute} ${monthlyHour} ${monthlyDay} * *`;
				break;

			case 'yearly':
				expr = `${yearlyMinute} ${yearlyHour} ${yearlyDay} ${yearlyMonth} *`;
				break;

			case 'custom':
				expr = `${customMinute} ${customHour} ${customDayOfMonth} ${customMonth} ${customDayOfWeek}`;
				break;
		}

		return expr;
	}

	function parseExpression(expr: string) {
		if (!expr || isParsingExpression) return;

		const parts = expr.trim().split(/\s+/);
		if (parts.length !== 5) return;

		const [min, hour, dayOfMonth, month, dayOfWeek] = parts;

		isParsingExpression = true;

		// Try to detect frequency type
		if (min.startsWith('*/') && hour === '*' && dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
			frequency = 'minute';
			minuteInterval = parseInt(min.split('/')[1]) || 1;
		} else if (hour.startsWith('*/') && dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
			frequency = 'hourly';
			hourlyMinute = parseInt(min) || 0;
			hourlyInterval = parseInt(hour.split('/')[1]) || 1;
		} else if (dayOfMonth.startsWith('*/') && month === '*' && dayOfWeek === '*') {
			frequency = 'daily';
			dailyMinute = parseInt(min) || 0;
			dailyHour = parseInt(hour) || 0;
			dailyInterval = parseInt(dayOfMonth.split('/')[1]) || 1;
		} else if (dayOfMonth === '*' && month === '*' && dayOfWeek !== '*') {
			frequency = 'weekly';
			weeklyMinute = parseInt(min) || 0;
			weeklyHour = parseInt(hour) || 0;
			weeklyDays = dayOfWeek.split(',').map(d => parseInt(d)).filter(d => !isNaN(d));
		} else if (month === '*' && dayOfWeek === '*' && !dayOfMonth.includes('*')) {
			frequency = 'monthly';
			monthlyMinute = parseInt(min) || 0;
			monthlyHour = parseInt(hour) || 0;
			monthlyDay = parseInt(dayOfMonth) || 1;
		} else if (dayOfWeek === '*' && !month.includes('*') && !dayOfMonth.includes('*')) {
			frequency = 'yearly';
			yearlyMinute = parseInt(min) || 0;
			yearlyHour = parseInt(hour) || 0;
			yearlyDay = parseInt(dayOfMonth) || 1;
			yearlyMonth = parseInt(month) || 1;
		} else {
			frequency = 'custom';
			customMinute = min;
			customHour = hour;
			customDayOfMonth = dayOfMonth;
			customMonth = month;
			customDayOfWeek = dayOfWeek;
		}

		isParsingExpression = false;
	}

	function toggleWeekday(day: number) {
		if (weeklyDays.includes(day)) {
			weeklyDays = weeklyDays.filter(d => d !== day);
		} else {
			weeklyDays = [...weeklyDays, day];
		}
	}

	// Parse initial expression on mount
	onMount(() => {
		if (value) {
			parseExpression(value);
		}
	});

	// Generate expression when settings change
	$effect(() => {
		// Track dependencies
		frequency;
		minuteInterval;
		hourlyMinute;
		hourlyInterval;
		dailyHour;
		dailyMinute;
		dailyInterval;
		weeklyDays;
		weeklyHour;
		weeklyMinute;
		monthlyDay;
		monthlyHour;
		monthlyMinute;
		yearlyMonth;
		yearlyDay;
		yearlyHour;
		yearlyMinute;
		customMinute;
		customHour;
		customDayOfMonth;
		customMonth;
		customDayOfWeek;

		untrack(() => {
			if (!isParsingExpression) {
				const expr = generateExpression();
				value = expr;
				onchange?.(expr);
			}
		});
	});

	function getHumanReadable(): string {
		switch (frequency) {
			case 'minute':
				return minuteInterval === 1 ? 'Every minute' : `Every ${minuteInterval} minutes`;

			case 'hourly':
				const hrText = hourlyInterval === 1 ? 'hour' : `${hourlyInterval} hours`;
				return `Every ${hrText} at minute ${hourlyMinute}`;

			case 'daily':
				const dayText = dailyInterval === 1 ? 'day' : `${dailyInterval} days`;
				return `Every ${dayText} at ${dailyHour.toString().padStart(2, '0')}:${dailyMinute.toString().padStart(2, '0')}`;

			case 'weekly':
				const dayNames = weeklyDays.map(d => weekDays.find(wd => wd.value === d)?.label).join(', ');
				return `Every ${dayNames} at ${weeklyHour.toString().padStart(2, '0')}:${weeklyMinute.toString().padStart(2, '0')}`;

			case 'monthly':
				return `Day ${monthlyDay} of every month at ${monthlyHour.toString().padStart(2, '0')}:${monthlyMinute.toString().padStart(2, '0')}`;

			case 'yearly':
				const monthName = monthOptions.find(m => m.value === yearlyMonth.toString())?.label;
				return `${monthName} ${yearlyDay} at ${yearlyHour.toString().padStart(2, '0')}:${yearlyMinute.toString().padStart(2, '0')}`;

			case 'custom':
				return value;

			default:
				return value;
		}
	}
</script>

<FormGroup
	{label}
	{required}
	{showError}
	{errorText}
	{tooltipContent}
	{tooltipText}
	{tooltipLocation}
	class={containerClass}
>
	<div class="cron-builder {classes}" class:disabled>
		<div class="cron-frequency">
			<Select
				label="Frequency"
				bind:value={frequency}
				options={frequencyOptions}
				{disabled}
			/>
		</div>

		<div class="cron-settings">
			{#if frequency === 'minute'}
				<Number
					label="Interval (minutes)"
					bind:value={minuteInterval}
					min={1}
					max={59}
					{disabled}
				/>
			{:else if frequency === 'hourly'}
				<Number
					label="Interval (hours)"
					bind:value={hourlyInterval}
					min={1}
					max={23}
					{disabled}
				/>
				<Number
					label="At minute"
					bind:value={hourlyMinute}
					min={0}
					max={59}
					{disabled}
				/>
			{:else if frequency === 'daily'}
				<Number
					label="Interval (days)"
					bind:value={dailyInterval}
					min={1}
					max={31}
					{disabled}
				/>
				<Number
					label="Hour"
					bind:value={dailyHour}
					min={0}
					max={23}
					{disabled}
				/>
				<Number
					label="Minute"
					bind:value={dailyMinute}
					min={0}
					max={59}
					{disabled}
				/>
			{:else if frequency === 'weekly'}
				<div class="weekday-selector">
					<span class="weekday-label">Days of Week</span>
					<div class="weekday-buttons">
						{#each weekDays as day}
							<button
								type="button"
								class="weekday-btn"
								class:selected={weeklyDays.includes(day.value)}
								onclick={() => toggleWeekday(day.value)}
								{disabled}
							>
								{day.label.substring(0, 3)}
							</button>
						{/each}
					</div>
				</div>
				<Number
					label="Hour"
					bind:value={weeklyHour}
					min={0}
					max={23}
					{disabled}
				/>
				<Number
					label="Minute"
					bind:value={weeklyMinute}
					min={0}
					max={59}
					{disabled}
				/>
			{:else if frequency === 'monthly'}
				<Number
					label="Day of Month"
					bind:value={monthlyDay}
					min={1}
					max={31}
					{disabled}
				/>
				<Number
					label="Hour"
					bind:value={monthlyHour}
					min={0}
					max={23}
					{disabled}
				/>
				<Number
					label="Minute"
					bind:value={monthlyMinute}
					min={0}
					max={59}
					{disabled}
				/>
			{:else if frequency === 'yearly'}
				<Number
					label="Month"
					bind:value={yearlyMonth}
					min={1}
					max={12}
					{disabled}
				/>
				<Number
					label="Day"
					bind:value={yearlyDay}
					min={1}
					max={31}
					{disabled}
				/>
				<Number
					label="Hour"
					bind:value={yearlyHour}
					min={0}
					max={23}
					{disabled}
				/>
				<Number
					label="Minute"
					bind:value={yearlyMinute}
					min={0}
					max={59}
					{disabled}
				/>
			{:else if frequency === 'custom'}
				<div class="custom-inputs">
					<FormGroup label="Minute">
						<input
							type="text"
							bind:value={customMinute}
							{disabled}
							class="form-control"
							placeholder="0-59, *, */5"
						/>
					</FormGroup>
					<FormGroup label="Hour">
						<input
							type="text"
							bind:value={customHour}
							{disabled}
							class="form-control"
							placeholder="0-23, *, */2"
						/>
					</FormGroup>
					<FormGroup label="Day of Month">
						<input
							type="text"
							bind:value={customDayOfMonth}
							{disabled}
							class="form-control"
							placeholder="1-31, *, */5"
						/>
					</FormGroup>
					<FormGroup label="Month">
						<input
							type="text"
							bind:value={customMonth}
							{disabled}
							class="form-control"
							placeholder="1-12, *, JAN-DEC"
						/>
					</FormGroup>
					<FormGroup label="Day of Week">
						<input
							type="text"
							bind:value={customDayOfWeek}
							{disabled}
							class="form-control"
							placeholder="0-6, *, SUN-SAT"
						/>
					</FormGroup>
				</div>
			{/if}
		</div>

		<div class="cron-output">
			<div class="cron-expression">
				<span class="cron-label">CRON Expression</span>
				<code>{value}</code>
			</div>
			<div class="cron-readable">
				<span class="cron-label">Description</span>
				<div class="readable-text">{getHumanReadable()}</div>
			</div>
			<div class="cron-next-run">
				<span class="cron-label">Next Run</span>
				<div class="next-run-text">{CronParser.getNextRunDescription(value)}</div>
			</div>
		</div>
	</div>
</FormGroup>

<style>
	.cron-builder {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.cron-builder.disabled {
		opacity: 0.6;
		pointer-events: none;
	}

	.cron-frequency {
		width: 100%;
	}

	.cron-settings {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1rem;
	}

	.weekday-selector {
		grid-column: 1 / -1;
	}

	.weekday-label {
		display: block;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-color);
		margin-bottom: 0.5rem;
	}

	.weekday-buttons {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.weekday-btn {
		padding: 0.5rem 1rem;
		border: 1px solid var(--border-color);
		background: var(--input-bg);
		color: var(--text-color);
		border-radius: 0.375rem;
		cursor: pointer;
		font-size: 0.875rem;
		font-weight: 500;
		transition: all 0.2s;
	}

	.weekday-btn:hover:not(:disabled) {
		background: rgba(var(--midnight-rgbc), 0.05);
		border-color: var(--midnight);
	}

	.weekday-btn.selected {
		background: var(--midnight);
		color: white;
		border-color: var(--midnight);
	}

	.weekday-btn:disabled {
		cursor: not-allowed;
	}

	.custom-inputs {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
		gap: 1rem;
		grid-column: 1 / -1;
	}

	.form-control {
		width: 100%;
		padding: 0.5rem;
		border: 1px solid var(--border-color);
		border-radius: 0.375rem;
		background: var(--input-bg);
		color: var(--text-color);
		font-size: 0.875rem;
	}

	.form-control:focus {
		outline: none;
		border-color: var(--midnight);
	}

	.form-control:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.cron-output {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		gap: 1rem;
		padding: 1rem;
		background: rgba(var(--midnight-rgbc), 0.05);
		border-radius: 0.375rem;
		border: 1px solid var(--border-color);
	}

	.cron-expression,
	.cron-readable,
	.cron-next-run {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.cron-output .cron-label {
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--text-muted);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.cron-expression code {
		font-family: 'Courier New', monospace;
		font-size: 0.875rem;
		padding: 0.5rem;
		background: var(--input-bg);
		border: 1px solid var(--border-color);
		border-radius: 0.25rem;
		color: var(--midnight);
		font-weight: 600;
	}

	.readable-text,
	.next-run-text {
		font-size: 0.875rem;
		color: var(--text-color);
		padding: 0.5rem;
		background: var(--input-bg);
		border: 1px solid var(--border-color);
		border-radius: 0.25rem;
	}

	:global(.dark) .weekday-btn:hover:not(:disabled) {
		background: rgba(var(--pistachio-rgbc), 0.1);
		border-color: var(--pistachio);
	}

	:global(.dark) .weekday-btn.selected {
		background: var(--pistachio);
		color: var(--midnight);
		border-color: var(--pistachio);
	}

	:global(.dark) .cron-output {
		background: rgba(var(--pistachio-rgbc), 0.05);
	}

	:global(.dark) .cron-expression code {
		color: var(--pistachio);
	}

	@media (max-width: 1024px) {
		.cron-output {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 768px) {
		.cron-settings {
			grid-template-columns: 1fr;
		}

		.custom-inputs {
			grid-template-columns: 1fr;
		}
	}
</style>