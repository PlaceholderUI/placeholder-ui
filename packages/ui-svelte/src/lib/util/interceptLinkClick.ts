import { navigateTo } from './NavigateTo.js';

export interface InterceptLinkClickOptions {
	/** URL to navigate to */
	href?: string;
	/** Link target attribute */
	target?: '_self' | '_blank' | undefined;
	/** Additional click handler to run before navigation */
	onclick?: (event: MouseEvent) => void;
}

/**
 * Intercepts link clicks to use client-side navigation for internal links.
 * Preserves standard browser behavior for external links, modifier keys, and middle clicks.
 */
export function interceptLinkClick(event: MouseEvent, options: InterceptLinkClickOptions) {
	const { href, target, onclick } = options;

	// Call user-provided onclick handler first
	if (onclick) {
		onclick(event);
	}

	// Don't intercept if event was prevented by user handler
	if (event.defaultPrevented) {
		return;
	}

	// Don't intercept external links
	if (!href?.startsWith('/')) {
		return;
	}

	// Don't intercept if target is _blank or modifier keys are pressed
	// This preserves standard browser behavior for opening in new tabs
	if (target === '_blank' || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) {
		return;
	}

	// Don't intercept middle mouse button clicks
	if (event.button !== 0) {
		return;
	}

	// Prevent default navigation and use SvelteKit's client-side navigation
	event.preventDefault();

	if (href) navigateTo(href);
}
