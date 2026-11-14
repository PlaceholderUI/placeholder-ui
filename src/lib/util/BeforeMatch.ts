/**
 * Calls `handler` when the browser's find-in-page reveals a `hidden="until-found"` element
 * (the `beforematch` event), so the component can mark that content as open.
 */
export function beforeMatch(node: HTMLElement, handler: () => void) {
	let current = handler;
	const handleMatch = () => current();

	node.addEventListener('beforematch', handleMatch);

	return {
		update(next: () => void) {
			current = next;
		},
		destroy() {
			node.removeEventListener('beforematch', handleMatch);
		}
	};
}
