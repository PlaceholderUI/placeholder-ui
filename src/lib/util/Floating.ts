/**
 * Floating panel positioning for dropdowns, pickers and popovers.
 *
 * Panels are promoted to the browser's top layer with the Popover API
 * (`popover="manual"` + `showPopover()`), so they are never clipped by an
 * `overflow: auto` ancestor — a scrolling Dialog body in particular — and they
 * paint above modal dialogs without any z-index coordination. The panel stays
 * where it is in the DOM, so focus, keyboard handling and click-outside logic
 * keep working; only rendering moves.
 *
 * Browsers without the Popover API fall back to `position: fixed`, correcting
 * for any transformed ancestor that would otherwise become the containing block.
 */

export type FloatingSide = 'top' | 'bottom' | 'left' | 'right';
export type FloatingAlignment = 'start' | 'end';
export type FloatingPlacement = FloatingSide | `${FloatingSide}-${FloatingAlignment}`;

export interface FloatingOptions {
	/** Element the panel is positioned against. A getter defers resolution until layout. */
	anchor: HTMLElement | null | undefined | (() => HTMLElement | null | undefined);
	/** Preferred side and alignment relative to the anchor. Default `bottom-start`. */
	placement?: FloatingPlacement;
	/** Gap between anchor and panel in px. Default 0. */
	offset?: number;
	/** Give the panel the anchor's width. Default false. */
	matchWidth?: boolean;
	/** Flip to the opposite side when the preferred side has no room. Default true. */
	flip?: boolean;
	/** Slide along the anchor's edge to stay inside the viewport. Default true. */
	shift?: boolean;
	/** Minimum distance from the viewport edges in px. Default 8. */
	padding?: number;
	/** Notified with the resolved placement after each positioning pass. */
	onPlacement?: (placement: FloatingPlacement) => void;
}

const CLASS = 'ui-floating';
const STYLE_ID = 'ui-floating-style';

const OPPOSITE: Record<FloatingSide, FloatingSide> = {
	top: 'bottom',
	bottom: 'top',
	left: 'right',
	right: 'left'
};

export function supportsPopover(): boolean {
	return typeof HTMLElement !== 'undefined' && 'showPopover' in HTMLElement.prototype;
}

/**
 * Zero-specificity resets (`:where`) so component styles on the panel always win.
 * The UA stylesheet gives `[popover]` a centred inset, a border, padding and a
 * canvas background; all of that is undone here so the panel looks exactly as
 * it did before being promoted.
 */
function ensureStyles() {
	if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;

	const style = document.createElement('style');
	style.id = STYLE_ID;
	style.textContent = `
:where(.${CLASS}) { position: fixed; top: 0; left: 0; }
:where(.${CLASS}[popover]) {
	inset: auto; margin: 0; padding: 0; border: none;
	background: transparent; color: inherit; overflow: visible;
	width: auto; height: auto; max-width: none; max-height: none;
}
`;
	document.head.appendChild(style);
}

function isPopoverOpen(node: HTMLElement): boolean {
	try {
		return node.matches(':popover-open');
	} catch {
		return false;
	}
}

/**
 * Promote an element to the top layer for as long as it is mounted. The element
 * keeps its DOM position; only its rendering escapes overflow and transform
 * ancestors. Falls back to `position: fixed` where the Popover API is missing.
 */
export function topLayer(node: HTMLElement) {
	ensureStyles();
	node.classList.add(CLASS);

	const popover = supportsPopover();
	if (popover) {
		node.setAttribute('popover', 'manual');
		try {
			if (!isPopoverOpen(node)) node.showPopover();
		} catch {
			/* not connected yet, or already shown */
		}
	}

	return {
		destroy() {
			if (popover && node.isConnected && isPopoverOpen(node)) {
				try {
					node.hidePopover();
				} catch {
					/* already hidden */
				}
			}
		}
	};
}

/**
 * A transform, filter, perspective, containment or container-type on an ancestor
 * makes that ancestor the containing block for `position: fixed` descendants.
 * Dialog hits this: its open animation uses a `forwards` fill, leaving a
 * transform applied while open. Only relevant to the non-popover fallback —
 * top-layer elements always resolve against the viewport.
 */
export function findFixedContainingBlock(element: HTMLElement): HTMLElement | null {
	let node = element.parentElement;

	while (node) {
		if (isPopoverOpen(node)) return null;

		const style = getComputedStyle(node);
		const containerType = style.getPropertyValue('container-type');
		const backdropFilter =
			style.getPropertyValue('backdrop-filter') ||
			style.getPropertyValue('-webkit-backdrop-filter');

		if (
			style.transform !== 'none' ||
			style.perspective !== 'none' ||
			style.filter !== 'none' ||
			(backdropFilter !== '' && backdropFilter !== 'none') ||
			(containerType !== '' && containerType !== 'normal') ||
			/\b(paint|layout|strict|content)\b/.test(style.contain) ||
			/\b(transform|perspective|filter)\b/.test(style.willChange)
		) {
			return node;
		}

		node = node.parentElement;
	}

	return null;
}

/** Ancestors that clip their content; scrolling one of them can hide the anchor. */
function findClippingAncestors(element: HTMLElement): HTMLElement[] {
	const result: HTMLElement[] = [];
	let node = element.parentElement;

	while (node && node !== document.body) {
		const style = getComputedStyle(node);
		if (
			style.overflow !== 'visible' ||
			style.overflowX !== 'visible' ||
			style.overflowY !== 'visible'
		) {
			result.push(node);
		}
		node = node.parentElement;
	}

	return result;
}

/** Whether any part of the anchor is still visible through its clipping ancestors. */
function anchorIsVisible(rect: DOMRect, clippers: HTMLElement[]): boolean {
	let { top, bottom, left, right } = rect;

	for (const clipper of clippers) {
		const c = clipper.getBoundingClientRect();
		top = Math.max(top, c.top);
		bottom = Math.min(bottom, c.bottom);
		left = Math.max(left, c.left);
		right = Math.min(right, c.right);
		if (bottom <= top || right <= left) return false;
	}

	return true;
}

function containingBlockOrigin(container: HTMLElement | null): {
	x: number;
	y: number;
} {
	if (!container) return { x: 0, y: 0 };

	const rect = container.getBoundingClientRect();
	const style = getComputedStyle(container);

	// Fixed descendants resolve against the padding box, so drop the border.
	return {
		x: rect.left + (parseFloat(style.borderLeftWidth) || 0),
		y: rect.top + (parseFloat(style.borderTopWidth) || 0)
	};
}

function splitPlacement(
	placement: FloatingPlacement
): [FloatingSide, FloatingAlignment | undefined] {
	const [side, alignment] = placement.split('-') as [FloatingSide, FloatingAlignment | undefined];
	return [side, alignment];
}

function joinPlacement(side: FloatingSide, alignment?: FloatingAlignment): FloatingPlacement {
	return alignment ? `${side}-${alignment}` : side;
}

function clamp(value: number, min: number, max: number): number {
	return Math.max(min, Math.min(value, max));
}

/**
 * Svelte action: keep `node` anchored to another element while it is mounted.
 *
 * ```svelte
 * {#if open}
 *   <div use:floating={{ anchor: () => triggerEl, placement: 'bottom-start', matchWidth: true }}>
 *     ...
 *   </div>
 * {/if}
 * ```
 *
 * The node receives `data-placement` with the resolved placement (after any
 * flip) and a `--ui-floating-max-height` custom property holding the space
 * available on the chosen side, which descendants can use to cap their height.
 */
export function floating(node: HTMLElement, options: FloatingOptions) {
	let opts = options;
	let rafId: number | null = null;
	let observedAnchor: HTMLElement | null = null;
	let clippers: HTMLElement[] = [];
	let clippersFor: HTMLElement | null = null;

	const layer = topLayer(node);
	const usingPopover = supportsPopover();
	// Walking the ancestor chain with getComputedStyle is too costly to repeat on
	// every scroll frame, so resolve the containing block once per mount.
	const fixedContainer = usingPopover ? null : findFixedContainingBlock(node);

	function resolveAnchor(): HTMLElement | null {
		const a = opts.anchor;
		const el = typeof a === 'function' ? a() : a;
		return el ?? null;
	}

	function position() {
		const anchor = resolveAnchor();
		if (!anchor || !node.isConnected) return;

		const placement = opts.placement ?? 'bottom-start';
		const offset = opts.offset ?? 0;
		const padding = opts.padding ?? 8;
		const flip = opts.flip ?? true;
		const shift = opts.shift ?? true;

		const a = anchor.getBoundingClientRect();

		// A panel floating in the top layer is not clipped along with its anchor,
		// so hide it once the anchor is scrolled out of a clipping ancestor (a
		// Dialog body, for instance) rather than leaving it stranded over the
		// dialog chrome.
		if (clippersFor !== anchor) {
			clippers = findClippingAncestors(anchor);
			clippersFor = anchor;
		}
		node.style.visibility = anchorIsVisible(a, clippers) ? '' : 'hidden';

		// Size before measuring so the measured box is the one that gets placed.
		if (opts.matchWidth) node.style.width = `${a.width}px`;

		const n = node.getBoundingClientRect();
		// A zero-sized box means nothing is laid out yet; the ResizeObserver will
		// call again once content arrives.
		if (n.width === 0 && n.height === 0) return;

		// clientWidth/Height exclude scrollbars, which window.innerWidth includes.
		const vw = document.documentElement.clientWidth;
		const vh = document.documentElement.clientHeight;

		const [preferredSide, alignment] = splitPlacement(placement);

		const space: Record<FloatingSide, number> = {
			top: a.top - padding,
			bottom: vh - a.bottom - padding,
			left: a.left - padding,
			right: vw - a.right - padding
		};
		const vertical = preferredSide === 'top' || preferredSide === 'bottom';
		const required = (vertical ? n.height : n.width) + offset;

		// Flip only when the preferred side cannot fit *and* the opposite side is
		// roomier; flipping into an equally cramped side just moves the problem.
		let side = preferredSide;
		if (flip && space[side] < required && space[OPPOSITE[side]] > space[side]) {
			side = OPPOSITE[side];
		}

		let left = 0;
		let top = 0;

		if (side === 'top' || side === 'bottom') {
			top = side === 'bottom' ? a.bottom + offset : a.top - n.height - offset;
			if (alignment === 'start') left = a.left;
			else if (alignment === 'end') left = a.right - n.width;
			else left = a.left + a.width / 2 - n.width / 2;
			if (shift) left = clamp(left, padding, Math.max(padding, vw - n.width - padding));
		} else {
			left = side === 'right' ? a.right + offset : a.left - n.width - offset;
			if (alignment === 'start') top = a.top;
			else if (alignment === 'end') top = a.bottom - n.height;
			else top = a.top + a.height / 2 - n.height / 2;
			if (shift) top = clamp(top, padding, Math.max(padding, vh - n.height - padding));
		}

		const available =
			side === 'bottom'
				? vh - top - padding
				: side === 'top'
					? a.top - offset - padding
					: vh - padding * 2;

		const origin = containingBlockOrigin(fixedContainer);
		node.style.left = `${Math.round(left - origin.x)}px`;
		node.style.top = `${Math.round(top - origin.y)}px`;
		node.style.setProperty('--ui-floating-max-height', `${Math.max(0, Math.floor(available))}px`);

		const resolved = joinPlacement(side, alignment);
		if (node.dataset.placement !== resolved) {
			node.dataset.placement = resolved;
			opts.onPlacement?.(resolved);
		}
	}

	/** Coalesce bursts of scroll/resize events into one reposition per frame. */
	function schedule() {
		if (rafId !== null) return;
		rafId = requestAnimationFrame(() => {
			rafId = null;
			position();
		});
	}

	const observer = new ResizeObserver(() => position());
	observer.observe(node);

	function observeAnchor() {
		const anchor = resolveAnchor();
		if (anchor === observedAnchor) return;
		if (observedAnchor) observer.unobserve(observedAnchor);
		observedAnchor = anchor;
		if (anchor) observer.observe(anchor);
	}

	// Capture phase so scrolling any ancestor container counts, not just the page.
	window.addEventListener('scroll', schedule, true);
	window.addEventListener('resize', schedule);

	observeAnchor();
	position();

	return {
		update(next: FloatingOptions) {
			opts = next;
			observeAnchor();
			position();
		},
		destroy() {
			if (rafId !== null) cancelAnimationFrame(rafId);
			observer.disconnect();
			window.removeEventListener('scroll', schedule, true);
			window.removeEventListener('resize', schedule);
			layer.destroy();
		}
	};
}
