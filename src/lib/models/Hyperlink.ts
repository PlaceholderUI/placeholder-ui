export interface Hyperlink {
	href?: string;
	text: string;
	newTab?: boolean;
	svg?: string;
	/** Custom click handler. Call event.preventDefault() to override the default href navigation. */
	onclick?: (event: MouseEvent) => void;
}
