<script lang="ts">
	import dayjs from 'dayjs';
	import Button from '../ui/Button.svelte';
	import Number from './Number.svelte';
	import { themeState } from '../theme.svelte.js';
	import customParseFormat from 'dayjs/plugin/customParseFormat.js';

	interface Props {
		label?: string;
		disabled?: boolean;
		required?: boolean;
		containerClass?: string;
		value?: string | undefined;
		rounded?: boolean;
		minDate?: string | undefined;
		maxDate?: string | undefined;
		selectedDate?: string | undefined;
		onchange?: (date: string | undefined) => void;
	}

	let {
		label,
		disabled,
		required,
		containerClass,
		value = $bindable(undefined),
		onchange,
		rounded,
		minDate,
		maxDate,
		selectedDate
	}: Props = $props();

	dayjs.extend(customParseFormat);
	let time: dayjs.Dayjs = $derived(value ? dayjs(value, ['HH:mm:ss', 'HH:mm']) : dayjs());

	let amPm: 'am' | 'pm' = $derived(time.hour() >= 12 ? 'pm' : 'am');
	let hours: number = $derived(time.hour() % 12 == 0 ? 12 : time.hour() % 12);
	let minutes: number = $derived(time.minute());

	// Calculate time constraints based on selected date
	const isMinDateSelected = $derived(selectedDate && minDate && dayjs(selectedDate).isSame(dayjs(minDate), 'day'));
	const isMaxDateSelected = $derived(selectedDate && maxDate && dayjs(selectedDate).isSame(dayjs(maxDate), 'day'));

	const minHour = $derived.by(() => {
		if (!isMinDateSelected || !minDate) return 1;
		const minTime = dayjs(minDate);
		const minHour24 = minTime.hour();
		const isPM = amPm === 'pm';

		if (isPM) {
			// PM: min hour is 12 (noon) or later
			return minHour24 >= 12 ? (minHour24 === 12 ? 12 : minHour24 - 12) : 1;
		} else {
			// AM: min hour is before noon
			return minHour24 < 12 ? (minHour24 === 0 ? 12 : minHour24) : 12;
		}
	});

	const maxHour = $derived.by(() => {
		if (!isMaxDateSelected || !maxDate) return 12;
		const maxTime = dayjs(maxDate);
		const maxHour24 = maxTime.hour();
		const isPM = amPm === 'pm';

		if (isPM) {
			// PM: max hour is noon or later
			return maxHour24 >= 12 ? (maxHour24 === 12 ? 12 : maxHour24 - 12) : 1;
		} else {
			// AM: max hour is before noon
			return maxHour24 < 12 ? (maxHour24 === 0 ? 12 : maxHour24) : 12;
		}
	});

	const minMinute = $derived.by(() => {
		if (!isMinDateSelected || !minDate) return 0;
		const minTime = dayjs(minDate);
		const minHour24 = minTime.hour();
		const currentHour24 = amPm === 'pm' ? (hours === 12 ? 12 : hours + 12) : (hours === 12 ? 0 : hours);

		// Only apply minute constraint if we're on the same hour
		return minHour24 === currentHour24 ? minTime.minute() : 0;
	});

	const maxMinute = $derived.by(() => {
		if (!isMaxDateSelected || !maxDate) return 59;
		const maxTime = dayjs(maxDate);
		const maxHour24 = maxTime.hour();
		const currentHour24 = amPm === 'pm' ? (hours === 12 ? 12 : hours + 12) : (hours === 12 ? 0 : hours);

		// Only apply minute constraint if we're on the same hour
		return maxHour24 === currentHour24 ? maxTime.minute() : 59;
	});

	// Check if AM/PM switch should be disabled
	const isAmPmDisabled = $derived.by(() => {
		if (disabled) return true;

		// If min date is selected, check if switching to AM would be invalid
		if (isMinDateSelected && minDate) {
			const minTime = dayjs(minDate);
			const minHour24 = minTime.hour();

			// If min time is PM and we're currently on PM, can't switch to AM
			if (amPm === 'pm' && minHour24 >= 12) {
				return true;
			}
		}

		// If max date is selected, check if switching to PM would be invalid
		if (isMaxDateSelected && maxDate) {
			const maxTime = dayjs(maxDate);
			const maxHour24 = maxTime.hour();

			// If max time is AM and we're currently on AM, can't switch to PM
			if (amPm === 'am' && maxHour24 < 12) {
				return true;
			}
		}

		return false;
	});

	let UpdateTime = () => {
		if (hours && minutes !== undefined) {
			let hour24 = hours;
			if (amPm === 'pm' && hours !== 12) {
				hour24 += 12;
			} else if (amPm === 'am' && hours === 12) {
				hour24 = 0;
			}

			const timeString = `${hour24.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
			onchange?.(timeString);
			value = timeString;
			return;
		}
		value = dayjs().format('HH:mm');
	};

	if (value === undefined) {
		UpdateTime();
	}
</script>

<div class="element-container {rounded && 'rounded'} {containerClass}">
	<div class="time-label">{label}</div>
	<div class="time-wrapper">
		<div class="time-container">
			<Number
				{disabled}
				bind:value={hours}
				min={minHour}
				max={maxHour}
				onchange={() => {
					UpdateTime();
				}}
			/>
			:
			<Number
				{disabled}
				bind:value={minutes}
				min={minMinute}
				max={maxMinute}
				onchange={() => {
					UpdateTime();
				}}
			/>
		</div>
		<div class="am-pm-container">
			<Button
				disabled={isAmPmDisabled}
				onclick={() => {
					amPm = amPm === 'am' ? 'pm' : 'am';
					UpdateTime();
				}}
				variant={themeState.isDarkMode ? 'secondary' : 'primary'}
			>
				{amPm.toUpperCase()}
			</Button>
		</div>
	</div>
</div>

<style>
	.time-label {
		margin-bottom: var(--pui-spacing-1);
	}

	.time-wrapper {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.time-picker-container {
		border-radius: var(--pui-radius-lg);
		overflow: hidden;
	}

	.time-container {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-grow: 1;
		gap: var(--pui-spacing-1);
		background-color: var(--pui-color-gray-100);
		border: 1px solid var(--pui-border-default);
		border-top-left-radius: var(--pui-radius-md);
		border-bottom-left-radius: var(--pui-radius-md);

		:global(.number-container) {
			flex-grow: 1;

			:global(.number-input input) {
				text-align: center;
				background-color: var(--pui-color-gray-100);
			}
		}
	}

	.time-container :global(.number) {
		border-radius: 0;
		border: none !important;
	}

	.time-container :global(.number-container:first-child .number:hover) {
		border-right: 1px solid var(--pui-border-default) !important;
		background-color: var(--pui-bg-hover) !important;
	}

	.time-container :global(.number-container:last-child .number:hover) {
		border-left: 1px solid var(--pui-border-default) !important;
		background-color: var(--pui-bg-hover) !important;
	}

	.time-container :global(.number-container:first-child .number) {
		border-top-left-radius: var(--pui-radius-md);
		border-bottom-left-radius: var(--pui-radius-md);
	}

	.am-pm-container :global(.pui-button) {
		border-radius: 0;
		border-top-right-radius: var(--pui-radius-md);
		border-bottom-right-radius: var(--pui-radius-md);
	}

	:global(.dark) {
		.time-container {
			background-color: var(--pui-color-dark-200);

			:global(.number-container) {
				:global(.number-input input) {
					background-color: var(--pui-color-dark-200);
				}
			}
		}

		.time-container :global(.number-container:first-child .number:hover) {
			background-color: var(--pui-bg-hover) !important;
		}

		.time-container :global(.number-container:last-child .number:hover) {
			background-color: var(--pui-bg-hover) !important;
		}
	}
</style>
