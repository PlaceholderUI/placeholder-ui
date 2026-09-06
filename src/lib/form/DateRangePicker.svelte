<script module lang="ts">
	export interface DateRangePickerProps {
		/** Label text displayed above the input */
		label?: string;
		/** Disable the date range picker */
		disabled?: boolean;
		/** Mark field as required (shows asterisk) */
		required?: boolean;
		/** CSS classes for the container element */
		containerClass?: string;
		/** Selected start date in ISO format (bindable) */
		startDate?: string | undefined;
		/** Selected end date in ISO format (bindable) */
		endDate?: string | undefined;
		/** Minimum selectable date in ISO format */
		minDate?: string | undefined;
		/** Maximum selectable date in ISO format */
		maxDate?: string | undefined;
		/** Callback when selected range changes */
		onchange?: (startDate: string | undefined, endDate: string | undefined) => void;
	}
</script>

<script lang="ts">
	import FormGroup from './FormGroup.svelte';
	import { fade } from 'svelte/transition';
	import dayjs from '$lib/util/dayjs.js';
	import { clickOutside } from '$lib/util/ClickOutside.js';
	import { floating } from '$lib/util/Floating.js';
	import ActionIcon from '$lib/ui/ActionIcon.svelte';
	import { iconChevronLeft, iconChevronRight, iconX } from '$lib/icon/index.js';

	let {
		label = '',
		disabled = false,
		required = false,
		containerClass = '',
		startDate = $bindable(undefined),
		endDate = $bindable(undefined),
		minDate,
		maxDate,
		onchange
	}: DateRangePickerProps = $props();

	const days = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

	const minDateParsed = $derived(minDate ? dayjs(minDate).startOf('date') : undefined);
	const maxDateParsed = $derived(maxDate ? dayjs(maxDate).startOf('date') : undefined);

	const todayDate = dayjs().startOf('date');

	let selectedStart: dayjs.Dayjs | undefined = $state(undefined);
	let selectedEnd: dayjs.Dayjs | undefined = $state(undefined);
	let selectingEnd = $state(false);
	let hoverDate: dayjs.Dayjs | undefined = $state(undefined);

	$effect(() => {
		const newStart = startDate ? dayjs(startDate).startOf('date') : undefined;
		const newEnd = endDate ? dayjs(endDate).startOf('date') : undefined;
		selectedStart = newStart;
		selectedEnd = newEnd;
		if (newStart) focusedMonth = newStart.startOf('month');
	});

	// svelte-ignore state_referenced_locally
	let focusedMonth = $state((selectedStart ?? todayDate).startOf('month'));
	let showCalendar = $state(false);
	let showYearPicker = $state(false);
	let inputWrapElement: HTMLElement | undefined = $state(undefined);
	let containerElement: HTMLElement | undefined = $state(undefined);

	const yearRangeSize = 12;
	let yearRangeStart = $state(Math.floor(dayjs().year() / yearRangeSize) * yearRangeSize);

	// Effective range (confirmed + hover preview)
	const effectiveStart = $derived.by(() => {
		if (selectingEnd && hoverDate && selectedStart) {
			return hoverDate.isBefore(selectedStart) ? hoverDate : selectedStart;
		}
		return selectedStart;
	});

	const effectiveEnd = $derived.by(() => {
		if (selectingEnd && hoverDate && selectedStart) {
			return hoverDate.isBefore(selectedStart) ? selectedStart : hoverDate;
		}
		return selectedEnd;
	});

	const displayText = $derived.by(() => {
		const startStr = selectedStart ? selectedStart.format('D MMM YYYY') : '';
		const endStr = selectedEnd ? selectedEnd.format('D MMM YYYY') : '';
		if (startStr && endStr) return `${startStr} – ${endStr}`;
		if (startStr && selectingEnd) return `${startStr} – ...`;
		if (startStr) return `${startStr} – ...`;
		return '';
	});

	function startOfWeek(date: dayjs.Dayjs) {
		return date.day(date.day() === 0 ? -6 : 1);
	}

	function endOfWeek(date: dayjs.Dayjs) {
		return date.day(date.day() === 6 ? 8 : 7);
	}

	function getFullWeekCount(month: dayjs.Dayjs) {
		const start = startOfWeek(month.date(1));
		const end = endOfWeek(month.date(month.daysInMonth()));
		return Math.ceil(end.diff(start, 'day', true) / 7) * 7;
	}

	function isDateInRange(date: dayjs.Dayjs) {
		if (minDateParsed && date.isBefore(minDateParsed)) return false;
		if (maxDateParsed && date.isAfter(maxDateParsed)) return false;
		return true;
	}

	type DisplayedDate = {
		date: dayjs.Dayjs;
		text: string;
		color: 'normal' | 'red' | 'grey' | 'disabled';
		isRangeStart: boolean;
		isRangeEnd: boolean;
		isInRange: boolean;
		isDisabled: boolean;
	};

	function calculateDays(
		effStart: dayjs.Dayjs | undefined,
		effEnd: dayjs.Dayjs | undefined,
		month: dayjs.Dayjs
	): DisplayedDate[] {
		const length = getFullWeekCount(month);
		const displayedDates: DisplayedDate[] = [];
		const startDate = startOfWeek(month);

		for (let i = 0; i < length; i++) {
			const date = startDate.add(i, 'day');

			let color: DisplayedDate['color'];
			let isDisabled = false;

			if (!isDateInRange(date)) {
				color = 'disabled';
				isDisabled = true;
			} else if (!date.isSame(month, 'month')) {
				color = 'grey';
			} else if (date.day() === 0 || date.day() === 6) {
				color = 'red';
			} else {
				color = 'normal';
			}

			const isRangeStart = effStart !== undefined && date.isSame(effStart, 'date');
			const isRangeEnd = effEnd !== undefined && date.isSame(effEnd, 'date');

			let isInRange = false;
			if (effStart && effEnd) {
				isInRange =
					(date.isAfter(effStart, 'date') || date.isSame(effStart, 'date')) &&
					(date.isBefore(effEnd, 'date') || date.isSame(effEnd, 'date'));
			} else if (effStart) {
				isInRange = date.isSame(effStart, 'date');
			}

			displayedDates.push({ date, text: date.date().toString(), color, isRangeStart, isRangeEnd, isInRange, isDisabled });
		}

		return displayedDates;
	}

	function buildCellClasses(d: DisplayedDate) {
		const cls: string[] = ['day-cell'];
		if (d.isInRange) cls.push('in-range');
		if (d.isRangeStart) cls.push('range-start');
		if (d.isRangeEnd) cls.push('range-end');
		if (d.isRangeStart && d.isRangeEnd) cls.push('single-day');
		return cls.join(' ');
	}

	function buildButtonClasses(d: DisplayedDate) {
		const cls: string[] = ['day-button'];
		if (d.isDisabled) {
			cls.push('disabled');
		} else if (d.color === 'red') {
			cls.push('text-red');
		} else if (d.color === 'grey') {
			cls.push('text-grey');
		}
		if (d.isRangeStart || d.isRangeEnd) {
			cls.push('selected');
		} else if (d.date.isSame(todayDate, 'date') && !d.isDisabled) {
			cls.push('today');
		}
		return cls.join(' ');
	}

	function handleDayClick(d: DisplayedDate, event: MouseEvent) {
		if (d.isDisabled) {
			event.stopPropagation();
			return;
		}
		event.stopPropagation();

		if (!selectingEnd) {
			// First click: pick start, reset end
			selectedStart = d.date;
			selectedEnd = undefined;
			startDate = d.date.format('YYYY-MM-DD');
			endDate = undefined;
			selectingEnd = true;
			hoverDate = undefined;
		} else {
			// Second click: pick end (swap if needed)
			let s = selectedStart!;
			let e = d.date;
			if (e.isBefore(s)) [s, e] = [e, s];

			selectedStart = s;
			selectedEnd = e;
			startDate = s.format('YYYY-MM-DD');
			endDate = e.format('YYYY-MM-DD');
			selectingEnd = false;
			hoverDate = undefined;
			onchange?.(startDate, endDate);
			showCalendar = false;
		}
	}

	function clearRange(event: MouseEvent) {
		event.stopPropagation();
		selectedStart = undefined;
		selectedEnd = undefined;
		startDate = undefined;
		endDate = undefined;
		selectingEnd = false;
		hoverDate = undefined;
		onchange?.(undefined, undefined);
	}

	function incrementFocusedMonth(delta: number) {
		focusedMonth = focusedMonth.add(delta, 'month');
	}

	function onClickOutside(event: MouseEvent) {
		if (!showCalendar) return;
		const target = event.target as HTMLElement;
		if (!containerElement?.contains(target)) {
			showCalendar = false;
			if (selectingEnd) {
				// Cancel incomplete selection
				selectingEnd = false;
				selectedStart = startDate ? dayjs(startDate).startOf('date') : undefined;
				hoverDate = undefined;
			}
		}
	}

	function getYearRange() {
		const years: number[] = [];
		for (let i = 0; i < yearRangeSize; i++) years.push(yearRangeStart + i);
		return years;
	}

	function selectYear(year: number) {
		focusedMonth = focusedMonth.year(year);
		showYearPicker = false;
	}

	function isYearInRange(year: number) {
		if (minDateParsed && year < minDateParsed.year()) return false;
		if (maxDateParsed && year > maxDateParsed.year()) return false;
		return true;
	}

	function incrementYearRange(delta: number) {
		yearRangeStart += delta * yearRangeSize;
	}

	function toggleYearPicker() {
		if (!showYearPicker) {
			yearRangeStart = Math.floor(focusedMonth.year() / yearRangeSize) * yearRangeSize;
		}
		showYearPicker = !showYearPicker;
	}
</script>

<div class="drp-container {containerClass}" bind:this={containerElement}>
	<FormGroup {label} {required} id="drp-{label}">
		<div
			class="drp-input-wrap"
			class:drp-disabled={disabled}
			class:drp-open={showCalendar}
			role="button"
			tabindex={disabled ? -1 : 0}
			bind:this={inputWrapElement}
			onclick={() => {
				if (!disabled) {
					showCalendar = true;
				}
			}}
			onkeydown={(e) => {
				if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
					e.preventDefault();
					showCalendar = true;
				}
			}}
		>
			<span class="drp-display-text" class:drp-placeholder={!displayText}>
				{displayText || 'Select date range'}
			</span>

			{#if displayText && !disabled}
				<div class="drp-clear">
					<ActionIcon
						variant="secondary-subtle"
						svg={iconX}
						size="0.75rem"
						onclick={clearRange}
					/>
				</div>
			{/if}

			<div class="drp-calendar-anchor">
				{#if showCalendar}
					<!-- Rendered in the top layer so a scrolling Dialog body cannot clip it -->
					<div
						class="calendar"
						transition:fade={{ duration: 150 }}
						use:floating={{ anchor: () => inputWrapElement, placement: 'bottom-start', offset: 4 }}
						use:clickOutside={onClickOutside}
					>
						<!-- Month navigation -->
						<div class="month-buttons">
							{#if showYearPicker}
								<ActionIcon svg={iconChevronLeft} size="1.5rem" onclick={() => incrementYearRange(-1)} />
								<button class="month-label clickable" onclick={toggleYearPicker}>
									{yearRangeStart} – {yearRangeStart + yearRangeSize - 1}
								</button>
								<ActionIcon svg={iconChevronRight} size="1.5rem" onclick={() => incrementYearRange(1)} />
							{:else}
								<ActionIcon svg={iconChevronLeft} size="1.5rem" onclick={() => incrementFocusedMonth(-1)} />
								<button class="month-label clickable" onclick={toggleYearPicker}>
									{focusedMonth.format('MMMM YYYY')}
								</button>
								<ActionIcon svg={iconChevronRight} size="1.5rem" onclick={() => incrementFocusedMonth(1)} />
							{/if}
						</div>

						{#if selectingEnd}
							<div class="selecting-hint">Click to select end date</div>
						{/if}

						{#if showYearPicker}
							<div class="year-grid">
								{#each getYearRange() as year}
									<button
										class="year-button"
										class:selected={focusedMonth.year() === year}
										class:current-year={todayDate.year() === year}
										class:disabled={!isYearInRange(year)}
										disabled={!isYearInRange(year)}
										onclick={() => selectYear(year)}
									>
										{year}
									</button>
								{/each}
							</div>
						{:else}
							<div class="days-header-bar">
								{#each days as day}
									<div class="day-label">{day}</div>
								{/each}
							</div>

							<!-- svelte-ignore a11y_no_static_element_interactions -->
							<div
								class="days-grid"
								onmouseleave={() => { if (selectingEnd) hoverDate = undefined; }}
							>
								{#each calculateDays(effectiveStart, effectiveEnd, focusedMonth) as d, i (i)}
									<div
										class={buildCellClasses(d)}
										onmouseenter={() => { if (selectingEnd && !d.isDisabled) hoverDate = d.date; }}
									>
										<button
											class={buildButtonClasses(d)}
											disabled={d.isDisabled}
											onclick={(e) => handleDayClick(d, e)}
										>
											{d.text}
										</button>
									</div>
								{/each}
							</div>
						{/if}
					</div>
				{/if}
			</div>
		</div>
	</FormGroup>
</div>

<style>
	.drp-container {
		position: relative;
	}

	.drp-input-wrap {
		position: relative;
		display: flex;
		align-items: center;
		width: 100%;
		font-size: 1rem;
		line-height: 1.5rem;
		padding: 0.25rem 0.5rem;
		border: 1px solid var(--border-color);
		background-color: var(--input-bg-color);
		color: var(--text-color);
		border-radius: 0.25rem;
		box-sizing: border-box;
		cursor: pointer;
		user-select: none;
		min-height: 2.125rem;
		transition: border-color 0.15s ease;
	}

	.drp-input-wrap:focus {
		outline: none;
		border-color: var(--accent-color);
	}

	.drp-input-wrap.drp-open {
		border-color: var(--accent-color);
	}

	.drp-input-wrap.drp-disabled {
		opacity: 0.5;
		cursor: not-allowed;
		background: var(--border-color);
		pointer-events: none;
	}

	.drp-display-text {
		flex: 1;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		padding-right: 1.5rem;
	}

	.drp-placeholder {
		color: #9ca3af;
	}

	.drp-clear {
		position: absolute;
		right: 0.5rem;
		top: 50%;
		transform: translateY(-50%);
		line-height: 0;
	}

	.drp-calendar-anchor {
		position: absolute;
		left: 0;
		right: 0;
		top: 100%;
	}

	/* ---- Calendar ---- */

	/* Position and top-layer promotion come from use:floating */
	.calendar {
		width: 19rem;
		text-align: center;
		z-index: 10;
		background-color: var(--paper-body-bg);
		border: 1px solid var(--border-color);
		border-radius: 0.375rem;
		box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
		padding: 0.5rem;
	}


	.month-buttons {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.5rem;
	}

	.month-label {
		font-weight: 600;
		color: var(--text-color);
		font-size: 1.125rem;
		background: none;
		border: none;
		cursor: default;
	}

	.month-label.clickable {
		cursor: pointer;
		padding: 0.25rem 0.5rem;
		border-radius: 0.25rem;
		transition: background-color 0.15s ease;
	}

	.month-label.clickable:hover {
		background-color: rgba(var(--ui-primary-rgbc), 0.1);
	}

	.selecting-hint {
		font-size: 0.75rem;
		color: var(--ui-primary);
		font-style: italic;
		margin-bottom: 0.25rem;
		opacity: 0.75;
	}

	/* ---- Year picker ---- */

	.year-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.5rem;
		margin-top: 0.5rem;
		padding: 0.5rem;
	}

	.year-button {
		color: var(--text-color);
		padding: 0.75rem 0.5rem;
		border-radius: 0.375rem;
		border: none;
		background: transparent;
		cursor: pointer;
		font-size: 0.875rem;
		transition: all 0.15s ease;
	}

	.year-button:hover:not(.disabled) {
		background-color: rgba(var(--ui-primary-rgbc), 0.1);
		color: var(--ui-primary);
	}

	.year-button.current-year {
		background-color: rgba(var(--ui-primary-rgbc), 0.15);
		color: var(--ui-primary);
		font-weight: 600;
	}

	.year-button.selected {
		background-color: var(--ui-primary);
		color: white;
		font-weight: 600;
	}

	.year-button.disabled {
		color: rgb(163 163 163) !important;
		background-color: transparent !important;
		cursor: not-allowed !important;
		opacity: 0.5;
	}

	/* ---- Days grid ---- */

	.days-header-bar {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		margin-top: 0.5rem;
		background-color: #f8f9fa;
		border-radius: 0.25rem;
		border: 1px solid var(--border-color);
	}

	.day-label {
		color: #6b7280;
		padding: 0.5rem;
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		text-align: center;
	}

	.days-grid {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		margin-top: 0.5rem;
	}

	/* ---- Day cells (range background strip) ---- */

	.day-cell {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 2.375rem;
	}

	/* Background strip pseudo-element */
	.day-cell.in-range::before {
		content: '';
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		height: 2rem;
		left: 0;
		right: 0;
		background-color: rgba(var(--ui-primary-rgbc), 0.12);
		z-index: 0;
	}

	/* Start: strip runs from center to right edge */
	.day-cell.in-range.range-start::before {
		left: 50%;
	}

	/* End: strip runs from left edge to center */
	.day-cell.in-range.range-end::before {
		right: 50%;
	}

	/* Single day: no strip */
	.day-cell.in-range.single-day::before {
		display: none;
	}

	/* ---- Day buttons ---- */

	.day-button {
		position: relative;
		z-index: 1;
		color: var(--text-color);
		width: 2.125rem;
		height: 2.125rem;
		border-radius: 50%;
		border: none;
		background: transparent;
		cursor: pointer;
		font-size: 0.875rem;
		transition: background-color 0.15s ease, color 0.15s ease;
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.day-button:hover:not(.disabled):not(.selected) {
		background-color: rgba(var(--ui-primary-rgbc), 0.12);
		color: var(--ui-primary);
	}

	.today {
		background-color: rgba(var(--ui-primary-rgbc), 0.15);
		color: var(--ui-primary);
		font-weight: 600;
	}

	.selected {
		background-color: var(--ui-primary);
		color: white;
		font-weight: 600;
	}

	.text-red {
		color: rgb(248 113 113);
	}

	.text-grey {
		color: rgb(163 163 163);
	}

	.disabled {
		color: rgb(163 163 163) !important;
		background-color: transparent !important;
		cursor: not-allowed !important;
		opacity: 0.5;
	}

	.disabled:hover {
		background-color: transparent !important;
		color: rgb(163 163 163) !important;
	}

	/* ---- Dark mode ---- */

	:global(.dark) {
		.days-header-bar {
			background-color: #252529;
		}

		.day-label {
			color: #d1d5db;
		}

		.day-button:hover:not(.disabled):not(.selected) {
			background-color: rgba(var(--ui-accent-rgbc), 0.12);
			color: var(--ui-accent);
		}

		.today {
			background-color: rgba(var(--ui-accent-rgbc), 0.15);
			color: var(--ui-accent);
		}

		.selected {
			background-color: var(--ui-accent);
			color: var(--ui-primary);
		}

		.day-cell.in-range::before {
			background-color: rgba(var(--ui-accent-rgbc), 0.18);
		}

		.text-grey {
			color: #6b7280;
		}

		.disabled {
			color: #6b7280 !important;
			background-color: transparent !important;
			cursor: not-allowed !important;
			opacity: 0.5;
		}

		.disabled:hover {
			background-color: transparent !important;
			color: #6b7280 !important;
		}

		.selecting-hint {
			color: var(--ui-accent);
		}

		.month-label.clickable:hover {
			background-color: rgba(var(--ui-accent-rgbc), 0.1);
		}

		.year-button:hover:not(.disabled) {
			background-color: rgba(var(--ui-accent-rgbc), 0.1);
			color: var(--ui-accent);
		}

		.year-button.current-year {
			background-color: rgba(var(--ui-accent-rgbc), 0.15);
			color: var(--ui-accent);
		}

		.year-button.selected {
			background-color: var(--ui-accent);
			color: var(--ui-primary);
		}

		.year-button.disabled {
			color: #6b7280 !important;
		}
	}
</style>
