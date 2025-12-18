<script lang="ts">
	import Textbox from "./Textbox.svelte";
	import { fade } from "svelte/transition";
	import dayjs from "dayjs";
	import { clickOutside } from "../actions/ClickOutside.js";
	import ActionIcon from "../ui/ActionIcon.svelte";
	import { iconChevronLeft, iconChevronRight, iconX } from "../icon/index.js";

	interface Props {
		label?: string;
		disabled?: boolean;
		required?: boolean;
		containerClass?: string;
		value?: string | undefined;
		minDate?: string | undefined;
		maxDate?: string | undefined;
		onchange?: (date: string | undefined) => void;
	}

	let {
		label,
		disabled,
		required,
		containerClass,
		value = $bindable(undefined),
		minDate,
		maxDate,
		onchange,
	}: Props = $props();

	const days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

	// Parse min and max dates
	const minDateParsed = $derived(
		minDate ? dayjs(minDate).startOf("date") : undefined,
	);
	const maxDateParsed = $derived(
		maxDate ? dayjs(maxDate).startOf("date") : undefined,
	);

	type DisplayedDateColor = "normal" | "red" | "grey" | "disabled";
	type DisplayedDate = {
		date: dayjs.Dayjs;
		text: string;
		color: DisplayedDateColor;
		isSelected: boolean;
		isDisabled: boolean;
	};

	const todayDate = dayjs().startOf("date");

	let selectedDate: dayjs.Dayjs | undefined = $state(undefined);

	$effect(() => {
		setDate(value ? dayjs(value) : undefined, false, true);
		if (selectedDate) {
			focusedMonth = selectedDate.startOf("month");
		}
	});

	let showRequiredRing = $state(false);
	// svelte-ignore state_referenced_locally
	let focusedMonth = $state((selectedDate ?? todayDate).startOf("month"));

	function startOfWeek(date: dayjs.Dayjs) {
		// We celebrate Monday as the one true start of the week in this household. NO exceptions
		return date.day(date.day() === 0 ? -6 : 1);
	}

	function endOfWeek(date: dayjs.Dayjs) {
		return date.day(date.day() === 6 ? 8 : 7);
	}

	function getFullWeekCount(month: dayjs.Dayjs) {
		const start = startOfWeek(month.date(1));
		const end = endOfWeek(month.date(month.daysInMonth()));
		const diff = end.diff(start, "day", true);

		return Math.ceil(diff / 7) * 7;
	}

	function isDateInRange(date: dayjs.Dayjs) {
		if (minDateParsed && date.isBefore(minDateParsed)) return false;
		if (maxDateParsed && date.isAfter(maxDateParsed)) return false;
		return true;
	}

	function calculateDays(
		selectedDate: dayjs.Dayjs | undefined,
		focusedMonth: dayjs.Dayjs,
	) {
		// Fill out the entire 7 day grid
		const length = getFullWeekCount(focusedMonth);

		const displayedDates: DisplayedDate[] = [];

		const startDate = startOfWeek(focusedMonth);

		for (let i = 0; i < length; i++) {
			const date = startDate.add(i, "day");

			let color: DisplayedDateColor;
			let isDisabled = false;

			// Check if date is outside of min/max range
			if (!isDateInRange(date)) {
				color = "disabled";
				isDisabled = true;
			} else if (!date.isSame(focusedMonth, "month")) {
				color = "grey";
			} else if (date.day() == 0 || date.day() == 6) {
				color = "red";
			} else {
				color = "normal";
			}

			displayedDates.push({
				date,
				text: date.date().toString(),
				color,
				isSelected:
					selectedDate !== undefined &&
					selectedDate.isSame(date, "date"),
				isDisabled,
			});
		}

		return displayedDates;
	}

	function buildDayClasses(date: DisplayedDate) {
		let classes = [];

		if (date.isDisabled) {
			classes.push("disabled");
		} else if (date.color === "red") {
			classes.push("text-red");
		} else if (date.color === "grey") {
			classes.push("text-grey");
		}

		if (date.isSelected && !date.isDisabled) {
			classes.push("selected");
		} else {
			if (date.date.isSame(todayDate, "date") && !date.isDisabled) {
				classes.push("today");
			}
		}

		return classes.join(" ");
	}

	function setDate(
		newDate: dayjs.Dayjs | undefined,
		fromTextbox: boolean,
		fromValue: boolean,
	) {
		if (newDate === undefined && selectedDate === undefined) return;

		// Check if the new date is within the allowed range
		if (newDate !== undefined && !isDateInRange(newDate)) {
			// Don't set the date if it's outside the allowed range
			return;
		}

		const isSameDate =
			newDate !== undefined &&
			selectedDate !== undefined &&
			newDate.isSame(selectedDate, "date");

		if (
			newDate === undefined ||
			!newDate.isValid() ||
			(isSameDate && !fromTextbox && !fromValue)
		) {
			value = undefined;
			selectedDate = undefined;
			readableDate = "";

			return;
		} else if (isSameDate) {
			return;
		}

		selectedDate = newDate;
		focusedMonth = newDate.startOf("month");

		value = newDate.format("YYYY-MM-DD");
		onchange?.(value);

		if (!fromTextbox) readableDate = newDate.format("D MMMM YYYY");
	}

	function incrementFocusedMonth(value: number) {
		focusedMonth = focusedMonth.add(value, "month");
	}

	// -----------------------------
	// Control code

	let textboxElement: HTMLElement | undefined = $state(undefined);
	let readableDate: string = $state("");
	let showCalendar = $state(false);
	let showYearPicker = $state(false);
	let dropdownPosition: "above" | "below" = $state("below");

	// Year picker: show a range of years centered around the focused year
	const yearRangeSize = 12;
	let yearRangeStart = $state(
		Math.floor(dayjs().year() / yearRangeSize) * yearRangeSize,
	);

	function getYearRange() {
		const years: number[] = [];
		for (let i = 0; i < yearRangeSize; i++) {
			years.push(yearRangeStart + i);
		}
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
			// Center the range around the focused year
			yearRangeStart =
				Math.floor(focusedMonth.year() / yearRangeSize) * yearRangeSize;
		}
		showYearPicker = !showYearPicker;
	}

	function checkDropdownPosition() {
		if (!textboxElement) return;

		const rect = textboxElement.getBoundingClientRect();
		const dropdownHeight = 300; // Approximate height of the calendar dropdown
		const spaceBelow = window.innerHeight - rect.bottom;
		const spaceAbove = rect.top;

		// If not enough space below and more space above, position above
		if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
			dropdownPosition = "above";
		} else {
			dropdownPosition = "below";
		}
	}

	function onClickOutside(event: MouseEvent) {
		if (!showCalendar) return;

		const target = event.target as HTMLElement;

		if (!textboxElement?.contains(target)) {
			showCalendar = false;
		}
	}

	function onDateTextChange(event: Event) {
		const textbox = event.target as HTMLInputElement;

		const date = dayjs(textbox.value, ["D MMMM YYYY", "DD/MM/YYYY"]);
		if (date.isValid()) {
			setDate(date, true, false);
		}
	}

	function clearDate() {
		value = undefined;
		selectedDate = undefined;
		readableDate = "";
		onchange?.(undefined);
	}

	function handleDateChangeClick(
		event: MouseEvent,
		date: dayjs.Dayjs,
		isDisabled: boolean,
	) {
		if (isDisabled) {
			event.stopPropagation();
			return;
		}

		setDate(date, false, false);
		showCalendar = false;

		event.stopPropagation();
	}
</script>

<div class="date-picker-container {containerClass}">
	<Textbox
		{label}
		placeholder="Enter date"
		{disabled}
		{required}
		noAutocomplete
		bind:textboxElement
		value={readableDate}
		onfocus={() => {
			checkDropdownPosition();
			showCalendar = true;
		}}
		onkeyup={onDateTextChange}
		class={showRequiredRing ? "!border-required" : ""}
	>
		{#snippet right()}
			{#if readableDate && !disabled}
				<div class="clear-button">
					<ActionIcon
						variant="secondary-subtle"
						svg={iconX}
						size="0.75rem"
						onclick={(e: MouseEvent) => {
							clearDate();
							e.stopPropagation();
						}}
					/>
				</div>
			{/if}
		{/snippet}
		<div class="date-picker">
			{#if showCalendar}
				<div
					class="calendar {dropdownPosition}"
					transition:fade={{ duration: 200 }}
					use:clickOutside={onClickOutside}
				>
					<div class="month-buttons">
						{#if showYearPicker}
							<ActionIcon
								svg={iconChevronLeft}
								size="1.5rem"
								onclick={() => incrementYearRange(-1)}
							/>
							<button
								class="month-label clickable"
								onclick={toggleYearPicker}
							>
								{yearRangeStart} - {yearRangeStart +
									yearRangeSize -
									1}
							</button>
							<ActionIcon
								svg={iconChevronRight}
								size="1.5rem"
								onclick={() => incrementYearRange(1)}
							/>
						{:else}
							<ActionIcon
								svg={iconChevronLeft}
								size="1.5rem"
								onclick={() => incrementFocusedMonth(-1)}
							/>
							<button
								class="month-label clickable"
								onclick={toggleYearPicker}
							>
								{focusedMonth.format("MMMM YYYY")}
							</button>
							<ActionIcon
								svg={iconChevronRight}
								size="1.5rem"
								onclick={() => incrementFocusedMonth(1)}
							/>
						{/if}
					</div>

					{#if showYearPicker}
						<div class="year-grid">
							{#each getYearRange() as year}
								<button
									class="year-button"
									class:selected={focusedMonth.year() ===
										year}
									class:current-year={todayDate.year() ===
										year}
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
								<div class="day-label">
									{day}
								</div>
							{/each}
						</div>
						<div class="days-grid">
							{#each calculateDays(selectedDate, focusedMonth) as day, i (i)}
								<button
									class="day-button {buildDayClasses(day)}"
									disabled={day.isDisabled}
									onclick={(e) =>
										handleDateChangeClick(
											e,
											day.date,
											day.isDisabled,
										)}
								>
									{day.text}
								</button>
							{/each}
						</div>
					{/if}
				</div>
			{/if}
		</div>
	</Textbox>
</div>

<style>
	.date-picker {
		position: relative;
	}

	.clear-button {
		position: absolute;
		right: 0.5rem;
		top: 50%;
		transform: translateY(-50%);
		line-height: 0;
	}

	.calendar {
		width: 18rem;
		text-align: center;
		position: absolute;
		z-index: 10;
		user-select: none;
		background-color: var(--paper-body-bg);
		border: 1px solid var(--border-color);
		border-radius: 0.375rem;
		box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
		padding: 0.5rem;
	}

	.calendar.below {
		top: 0;
	}

	.calendar.above {
		bottom: 2.25rem;
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
		background-color: rgba(var(--midnight-rgbc), 0.1);
	}

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
		background-color: rgba(var(--midnight-rgbc), 0.1);
		color: var(--midnight);
	}

	.year-button.current-year {
		background-color: rgba(var(--midnight-rgbc), 0.15);
		color: var(--midnight);
		font-weight: 600;
	}

	.year-button.selected {
		background-color: var(--midnight);
		color: white;
		font-weight: 600;
	}

	.year-button.disabled {
		color: rgb(163 163 163) !important;
		background-color: transparent !important;
		cursor: not-allowed !important;
		opacity: 0.5;
	}

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
		gap: 0.125rem;
		margin-top: 0.5rem;
	}

	.day-button {
		color: var(--text-color);
		width: 2.25rem;
		height: 2.25rem;
		border-radius: 0.375rem;
		border: none;
		background: transparent;
		cursor: pointer;
		font-size: 0.875rem;
		transition: all 0.15s ease;
		justify-self: center;
	}

	.day-button:hover {
		background-color: rgba(var(--midnight-rgbc), 0.1);
		color: var(--midnight);
	}

	.today {
		background-color: rgba(var(--midnight-rgbc), 0.15);
		color: var(--midnight);
		font-weight: 600;
	}

	.selected {
		background-color: var(--midnight);
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

	:global(.dark) {
		.days-header-bar {
			background-color: #252529;
		}

		.day-label {
			color: #d1d5db;
		}

		.day-button:hover {
			background-color: rgba(var(--pistachio-rgbc), 0.1);
			color: var(--pistachio);
		}

		.today {
			background-color: rgba(var(--pistachio-rgbc), 0.15);
			color: var(--pistachio);
		}

		.selected {
			background-color: var(--pistachio);
			color: var(--midnight);
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

		.month-label.clickable:hover {
			background-color: rgba(var(--pistachio-rgbc), 0.1);
		}

		.year-button:hover:not(.disabled) {
			background-color: rgba(var(--pistachio-rgbc), 0.1);
			color: var(--pistachio);
		}

		.year-button.current-year {
			background-color: rgba(var(--pistachio-rgbc), 0.15);
			color: var(--pistachio);
		}

		.year-button.selected {
			background-color: var(--pistachio);
			color: var(--midnight);
		}

		.year-button.disabled {
			color: #6b7280 !important;
		}
	}
</style>
