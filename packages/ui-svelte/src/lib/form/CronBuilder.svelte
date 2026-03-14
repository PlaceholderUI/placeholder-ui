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
		gap: var(--pui-spacing-4);
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
		gap: var(--pui-spacing-4);
	}

	.weekday-selector {
		grid-column: 1 / -1;
	}

	.weekday-label {
		display: block;
		font-size: var(--pui-font-size-sm);
		font-weight: var(--pui-font-weight-semibold);
		color: var(--pui-text-primary);
		margin-bottom: var(--pui-spacing-2);
	}

	.weekday-buttons {
		display: flex;
		gap: var(--pui-spacing-2);
		flex-wrap: wrap;
	}

	.weekday-btn {
		padding: var(--pui-spacing-2) var(--pui-spacing-4);
		border: 1px solid var(--pui-border-default);
		background: var(--pui-input-bg);
		color: var(--pui-text-primary);
		border-radius: var(--pui-radius-md);
		cursor: pointer;
		font-size: var(--pui-font-size-sm);
		font-weight: var(--pui-font-weight-medium);
		transition: all var(--pui-transition-fast) var(--pui-ease-in-out);
	}

	.weekday-btn:hover:not(:disabled) {
		background: var(--pui-bg-hover);
		border-color: var(--pui-color-primary);
	}

	.weekday-btn.selected {
		background: var(--pui-color-primary);
		color: var(--pui-color-white);
		border-color: var(--pui-color-primary);
	}

	.weekday-btn:disabled {
		cursor: not-allowed;
	}

	.custom-inputs {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
		gap: var(--pui-spacing-4);
		grid-column: 1 / -1;
	}

	.form-control {
		width: 100%;
		padding: var(--pui-spacing-2);
		border: 1px solid var(--pui-border-default);
		border-radius: var(--pui-radius-md);
		background: var(--pui-input-bg);
		color: var(--pui-text-primary);
		font-size: var(--pui-font-size-sm);
	}

	.form-control:focus {
		outline: none;
		border-color: var(--pui-color-primary);
	}

	.form-control:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.cron-output {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		gap: var(--pui-spacing-4);
		padding: var(--pui-spacing-4);
		background: var(--pui-bg-subtle);
		border-radius: var(--pui-radius-md);
		border: 1px solid var(--pui-border-default);
	}

	.cron-expression,
	.cron-readable,
	.cron-next-run {
		display: flex;
		flex-direction: column;
		gap: var(--pui-spacing-2);
	}

	.cron-output .cron-label {
		font-size: var(--pui-font-size-xs);
		font-weight: var(--pui-font-weight-semibold);
		color: var(--pui-text-muted);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.cron-expression code {
		font-family: 'Courier New', monospace;
		font-size: var(--pui-font-size-sm);
		padding: var(--pui-spacing-2);
		background: var(--pui-input-bg);
		border: 1px solid var(--pui-border-default);
		border-radius: var(--pui-radius-sm);
		color: var(--pui-color-primary);
		font-weight: var(--pui-font-weight-semibold);
	}

	.readable-text,
	.next-run-text {
		font-size: var(--pui-font-size-sm);
		color: var(--pui-text-primary);
		padding: var(--pui-spacing-2);
		background: var(--pui-input-bg);
		border: 1px solid var(--pui-border-default);
		border-radius: var(--pui-radius-sm);
	}

	:global(.dark) .weekday-btn:hover:not(:disabled) {
		background: var(--pui-bg-hover);
		border-color: var(--pui-color-secondary);
	}

	:global(.dark) .weekday-btn.selected {
		background: var(--pui-color-secondary);
		color: var(--pui-color-primary);
		border-color: var(--pui-color-secondary);
	}

	:global(.dark) .cron-output {
		background: var(--pui-bg-subtle);
	}

	:global(.dark) .cron-expression code {
		color: var(--pui-color-secondary);
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