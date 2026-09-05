export interface LinkCollectionItem {
	href?: string;
	leftContent: string;
	rightContent?: string;
	newTab?: boolean;
	leftSvg?: string;
	rightSvg?: string;
	/** Custom click handler. Call event.preventDefault() to override the default href navigation. */
	onclick?: (event: MouseEvent) => void;
}
