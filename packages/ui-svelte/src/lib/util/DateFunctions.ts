import dayjs from "dayjs";

export function getDateInXTimeAgo(date: string) {
	const d = dayjs(date);
	const now = dayjs();
	const diff = now.diff(d, 'minutes');
	let result = 'Just now';
	if (diff > 1) {
		if (diff < 60) {
			result = `${diff} minutes ago`;
		} else if (diff < 1440) {
			result = `${Math.floor(diff / 60)} hours ago`;
		} else if (diff < 10080) {
			result = `${Math.floor(diff / 1440)} days ago`;
		} else if (diff < 40320) {
			result = `${Math.floor(diff / 10080)} weeks ago`;
		} else if (diff < 525600) {
			result = `${Math.floor(diff / 40320)} months ago`;
		} else {
			result = `${Math.floor(diff / 525600)} years ago`;
		}
	}

	return result;
}
