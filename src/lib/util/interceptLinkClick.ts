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

	// Honour SvelteKit's standard opt-outs from client-side navigation
	const anchor = event.currentTarget instanceof HTMLAnchorElement ? event.currentTarget : null;
	if (anchor && isClientNavOptOut(anchor)) {
		return;
	}

	// Prevent default navigation and use SvelteKit's client-side navigation
	event.preventDefault();

	navigateTo(href).catch((error) => {
		console.error(error);
		// The click must still go somewhere, as a plain anchor would
		window.location.assign(anchor?.href ?? href);
	});
}

/** `download`, `rel="external"` and `data-sveltekit-reload` (on the link or an ancestor) */
function isClientNavOptOut(anchor: HTMLAnchorElement) {
	if (anchor.hasAttribute('download')) return true;
	if (anchor.relList.contains('external')) return true;
	const reload = anchor.closest('[data-sveltekit-reload]')?.getAttribute('data-sveltekit-reload');
	return reload != null && reload !== 'off';
}
