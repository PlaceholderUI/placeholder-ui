import { goto } from '$app/navigation';
import { resolve } from '$app/paths';

// SvelteKit puts the error code in the message in both dev and prod builds
const FALLBACK_ERRORS = ['/e/kit/navigation_route_missing', '/e/kit/navigation_external_url'];
// Rejections for navigations superseded by another one, or cancelled via beforeNavigate
const CANCELLED_ERRORS = ['navigation cancelled', 'navigation aborted'];

/**
 * Navigates client-side when the URL is a page route in the app. URLs the client router can't
 * reach (`+server.ts` endpoints, static files, external URLs) fall back to a full browser
 * navigation. Cancelled navigations resolve quietly; any other failure rejects.
 */
export async function navigateTo(url: string): Promise<void> {
	const resolved = resolve(url as any);
	try {
		await goto(resolved);
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		if (FALLBACK_ERRORS.some((code) => message.includes(code))) {
			window.location.assign(resolved);
			return;
		}
		if (CANCELLED_ERRORS.includes(message)) return;
		throw error;
	}
}
