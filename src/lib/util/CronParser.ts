/**
 * Parse a CRON expression and calculate the next run date
 * CRON format: minute hour dayOfMonth month dayOfWeek
 * Example: "0 9 * * 1-5" = Every weekday at 9 AM
 */

interface CronParts {
	minute: string;
	hour: string;
	dayOfMonth: string;
	month: string;
	dayOfWeek: string;
}

export class CronParser {
	/**
	 * Get the next run date from a CRON expression
	 * @param cronExpression - CRON expression string (e.g., "0 9 * * 1-5")
	 * @param fromDate - Starting date (defaults to now)
	 * @returns Next run date, or null if invalid
	 */
	static getNextRunDate(cronExpression: string, fromDate: Date = new Date()): Date | null {
		try {
			const parts = CronParser.parseCronExpression(cronExpression);
			if (!parts) return null;

			const startDate = new Date(fromDate);
			startDate.setSeconds(0);
			startDate.setMilliseconds(0);

			// Start from the next minute
			startDate.setMinutes(startDate.getMinutes() + 1);

			// Look ahead at most 1 year (525,600 minutes)
			// This should handle even very infrequent CRON expressions
			const maxIterations = 525600;
			let iterations = 0;
			let currentDate = new Date(startDate);

			while (iterations < maxIterations) {
				if (CronParser.matchesCronExpression(currentDate, parts)) {
					return currentDate;
				}

				// Move to next minute
				currentDate.setMinutes(currentDate.getMinutes() + 1);
				iterations++;
			}

			return null; // No match found within reasonable time
		} catch (error) {
			console.error('Error parsing CRON expression:', error);
			return null;
		}
	}

	/**
	 * Get multiple next run dates
	 * @param cronExpression - CRON expression string
	 * @param count - Number of future dates to return (default 5)
	 * @param fromDate - Starting date (defaults to now)
	 * @returns Array of next run dates
	 */
	static getNextRunDates(
		cronExpression: string,
		count: number = 5,
		fromDate: Date = new Date()
	): Date[] {
		const dates: Date[] = [];
		let currentDate = new Date(fromDate);

		for (let i = 0; i < count; i++) {
			const nextDate = CronParser.getNextRunDate(cronExpression, currentDate);
			if (!nextDate) break;
			dates.push(nextDate);
			// Move to just after this date (add 1 second) to find the next occurrence
			currentDate = new Date(nextDate.getTime() + 1000);
		}

		return dates;
	}

	/**
	 * Parse CRON expression into parts
	 */
	private static parseCronExpression(expression: string): CronParts | null {
		const trimmed = expression.trim();
		const parts = trimmed.split(/\s+/);

		if (parts.length !== 5) {
			console.error('Invalid CRON expression: must have 5 parts');
			return null;
		}

		return {
			minute: parts[0],
			hour: parts[1],
			dayOfMonth: parts[2],
			month: parts[3],
			dayOfWeek: parts[4]
		};
	}

	/**
	 * Check if a date matches a CRON expression
	 */
	private static matchesCronExpression(date: Date, parts: CronParts): boolean {
		const minute = date.getMinutes();
		const hour = date.getHours();
		const dayOfMonth = date.getDate();
		const month = date.getMonth() + 1; // 0-indexed to 1-indexed
		const dayOfWeek = date.getDay(); // 0 = Sunday

		return (
			CronParser.matchesValue(minute, parts.minute, 0, 59) &&
			CronParser.matchesValue(hour, parts.hour, 0, 23) &&
			CronParser.matchesValue(dayOfMonth, parts.dayOfMonth, 1, 31) &&
			CronParser.matchesValue(month, parts.month, 1, 12) &&
			CronParser.matchesValue(dayOfWeek, parts.dayOfWeek, 0, 6)
		);
	}

	/**
	 * Check if a value matches a CRON field
	 * Supports: *, specific values, ranges (1-5), lists (1,3,5), and steps (*\/5)
	 */
	private static matchesValue(
		value: number,
		cronField: string,
		min: number,
		max: number
	): boolean {
		// Handle wildcard
		if (cronField === '*') return true;

		// Handle step values (e.g., */5)
		if (cronField.includes('/')) {
			const [range, step] = cronField.split('/');
			const stepNum = parseInt(step, 10);

			if (range === '*') {
				return value % stepNum === 0;
			}

			// Handle range with step (e.g., 10-20/2)
			if (range.includes('-')) {
				const [rangeStart, rangeEnd] = range.split('-').map((n) => parseInt(n, 10));
				if (value >= rangeStart && value <= rangeEnd) {
					return (value - rangeStart) % stepNum === 0;
				}
				return false;
			}
		}

		// Handle lists (e.g., 1,3,5)
		if (cronField.includes(',')) {
			const values = cronField.split(',').map((v) => parseInt(v.trim(), 10));
			return values.includes(value);
		}

		// Handle ranges (e.g., 1-5)
		if (cronField.includes('-')) {
			const [start, end] = cronField.split('-').map((n) => parseInt(n, 10));
			return value >= start && value <= end;
		}

		// Handle specific value
		const fieldValue = parseInt(cronField, 10);
		return value === fieldValue;
	}

	/**
	 * Get a human-readable description of when the CRON will run next
	 */
	static getNextRunDescription(cronExpression: string): string {
		const nextDate = CronParser.getNextRunDate(cronExpression);
		if (!nextDate) return 'Invalid CRON expression';

		const now = new Date();
		const diff = nextDate.getTime() - now.getTime();
		const minutes = Math.floor(diff / 60000);
		const hours = Math.floor(minutes / 60);
		const days = Math.floor(hours / 24);

		if (minutes < 1) return 'in less than a minute';
		if (minutes < 60) return `in ${minutes} minute${minutes !== 1 ? 's' : ''}`;
		if (hours < 24) return `in ${hours} hour${hours !== 1 ? 's' : ''}`;
		if (days < 7) return `in ${days} day${days !== 1 ? 's' : ''}`;

		// Format the date
		const options: Intl.DateTimeFormatOptions = {
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		};

		return `on ${nextDate.toLocaleDateString('en-US', options)}`;
	}

	/**
	 * Validate a CRON expression
	 */
	static isValid(cronExpression: string): boolean {
		const parts = CronParser.parseCronExpression(cronExpression);
		return parts !== null;
	}
}

// Export utility functions
export function getNextCronRunDate(cronExpression: string, fromDate?: Date): Date | null {
	return CronParser.getNextRunDate(cronExpression, fromDate);
}

export function getNextCronRunDates(
	cronExpression: string,
	count?: number,
	fromDate?: Date
): Date[] {
	return CronParser.getNextRunDates(cronExpression, count, fromDate);
}

export function getNextCronRunDescription(cronExpression: string): string {
	return CronParser.getNextRunDescription(cronExpression);
}

export function validateCronExpression(cronExpression: string): boolean {
	return CronParser.isValid(cronExpression);
}