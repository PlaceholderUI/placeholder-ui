<script lang="ts">
	import type { Snippet } from 'svelte';
	import { fade } from 'svelte/transition';

	export type TooltipLocation =
		| 'top'
		| 'right'
		| 'bottom'
		| 'left'
		| 'top-start'
		| 'top-end'
		| 'right-start'
		| 'right-end'
		| 'bottom-start'
		| 'bottom-end'
		| 'left-start'
		| 'left-end';

	type Side = 'top' | 'right' | 'bottom' | 'left';

	export interface TooltipProps {
		/** The element to attach the tooltip to */
		children: Snippet;
		/** Rich content using a Svelte snippet */
		tooltipContent?: Snippet;
		/** Simple text content (alternative to snippet) */
		text?: string;
		/** HTML content (use with caution - sanitize user input) */
		html?: string;
		/** Preferred tooltip position */
		location?: TooltipLocation;
		/** Maximum width of tooltip */
		maxWidth?: string;
		/** Offset distance from target element (px) */
		offsetDistance?: number;
		/** Show arrow pointing to target */
		showArrow?: boolean;
		/** Delay before showing tooltip (ms) */
		delay?: number;
		/** Callback when tooltip opens/closes */
		onOpen?: (open: boolean) => void;
		/** Disable the tooltip */
		disabled?: boolean;
	}

	let {
		children,
		tooltipContent,
		text,
		html,
		location = 'top',
		maxWidth = '300px',
		offsetDistance = 4,
		showArrow = true,
		delay = 0,
		onOpen,
		disabled = false
	}: TooltipProps = $props();

	/** Half the arrow's base and its full height — the triangle is 2x wide, 1x tall. */
	const ARROW_SIZE = 6;
	/** Matches .tooltip-v2-content border-radius so the arrow never sits on a rounded corner. */
	const CORNER_RADIUS = 6;
	/** Minimum gap between the tooltip and the viewport edge. */
	const VIEWPORT_PADDING = 5;

	const OPPOSITE_SIDE: Record<Side, Side> = {
		top: 'bottom',
		bottom: 'top',
		left: 'right',
		right: 'left'
	};

	// State
	let open = $state(false);
	/** False until the tooltip has been measured and placed; it stays hidden until then. */
	let positioned = $state(false);
	let referenceElement: HTMLElement | null = $state(null);
	let tooltipElement: HTMLElement | null = $state(null);
	let timeoutId: number | null = null;
	let rafId: number | null = null;
	/** Ancestor the tooltip's left/top actually resolve against, if not the viewport. */
	let fixedContainer: HTMLElement | null = null;

	// Position state
	let tooltipStyle = $state('left: 0px; top: 0px;');
	let arrowStyle = $state('');
	let actualPlacement = $state<TooltipLocation>('top');

	// Check if tooltip has any content
	const hasContent = $derived(!!(text || html || tooltipContent));
	const visible = $derived(open && hasContent && !disabled);

	function handleMouseEnter() {
		if (disabled || !hasContent) return;

		cancelPending();

		if (delay > 0) {
			timeoutId = window.setTimeout(() => {
				timeoutId = null;
				showTooltip();
			}, delay);
		} else {
			showTooltip();
		}
	}

	function handleMouseLeave() {
		cancelPending();
		hideTooltip();
	}

	function cancelPending() {
		if (timeoutId !== null) {
			clearTimeout(timeoutId);
			timeoutId = null;
		}
	}

	function showTooltip() {
		if (open) return;

		// The floating element is remounted on every open, so it starts unmeasured.
		// Keeping it hidden until the positioning effect has run stops the fade-in
		// from playing at the coordinates left over from the previous open.
		positioned = false;
		open = true;
		onOpen?.(true);
	}

	function hideTooltip() {
		if (!open) return;

		open = false;
		onOpen?.(false);
	}

	function clamp(value: number, min: number, max: number): number {
		return Math.max(min, Math.min(value, max));
	}

	/**
	 * A transform, filter, perspective, containment or container-type on an ancestor
	 * makes that ancestor the containing block for `position: fixed` descendants —
	 * left/top stop meaning "from the viewport" while getBoundingClientRect() keeps
	 * reporting viewport coordinates. Dialog hits this: its open animation uses a
	 * `forwards` fill, which leaves `transform: translateY(0)` applied while open.
	 */
	function findFixedContainingBlock(element: HTMLElement): HTMLElement | null {
		let node = element.parentElement;

		while (node) {
			const style = getComputedStyle(node);
			// Newer properties go through getPropertyValue so an older DOM lib (or a
			// browser without support) reports '' instead of failing to compile.
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

	/** Viewport coordinates of the origin that left/top are measured from. */
	function containingBlockOrigin(): { x: number; y: number } {
		if (!fixedContainer) return { x: 0, y: 0 };

		const rect = fixedContainer.getBoundingClientRect();
		const style = getComputedStyle(fixedContainer);

		// Fixed descendants resolve against the padding box, so drop the border.
		return {
			x: rect.left + (parseFloat(style.borderLeftWidth) || 0),
			y: rect.top + (parseFloat(style.borderTopWidth) || 0)
		};
	}

	function positionTooltip() {
		// Read the geometry props before any early return, so that calling this from
		// an effect always registers them as dependencies and a prop changed while
		// the tooltip is open re-anchors it.
		const preferred = location;
		const offset = offsetDistance + (showArrow ? ARROW_SIZE : 0);

		if (!referenceElement || !tooltipElement) return;

		const refRect = referenceElement.getBoundingClientRect();
		const tooltipRect = tooltipElement.getBoundingClientRect();

		// A zero-sized box means layout has not happened yet; anchoring to it would
		// pin the tooltip to dimensions that are about to change.
		if (tooltipRect.width === 0 || tooltipRect.height === 0) return;

		const { position, placement } = resolvePlacement(preferred, refRect, tooltipRect, offset);

		// `position` is in viewport space, which is what the arrow maths below wants
		// too. Only the style needs translating into the containing block's space.
		const origin = containingBlockOrigin();

		actualPlacement = placement;
		tooltipStyle = `left: ${Math.round(position.left - origin.x)}px; top: ${Math.round(position.top - origin.y)}px;`;
		arrowStyle = showArrow ? calculateArrowPosition(placement, refRect, position, tooltipRect) : '';
		positioned = true;
	}

	/** Coalesce bursts of scroll/resize events into one reposition per frame. */
	function schedulePosition() {
		if (rafId !== null) return;

		rafId = requestAnimationFrame(() => {
			rafId = null;
			positionTooltip();
		});
	}

	function resolvePlacement(
		preferred: TooltipLocation,
		refRect: DOMRect,
		tooltipRect: DOMRect,
		offset: number
	): { position: { left: number; top: number }; placement: TooltipLocation } {
		// clientWidth/Height exclude the scrollbars, which window.innerWidth includes.
		const viewportWidth = document.documentElement.clientWidth;
		const viewportHeight = document.documentElement.clientHeight;

		const [side, alignment] = preferred.split('-') as [Side, string | undefined];

		const space = {
			top: refRect.top - VIEWPORT_PADDING,
			bottom: viewportHeight - refRect.bottom - VIEWPORT_PADDING,
			left: refRect.left - VIEWPORT_PADDING,
			right: viewportWidth - refRect.right - VIEWPORT_PADDING
		};
		const required =
			side === 'top' || side === 'bottom'
				? tooltipRect.height + offset
				: tooltipRect.width + offset;

		// Flip only when the preferred side cannot fit *and* the opposite side is
		// roomier — flipping into an equally cramped side just moves the problem.
		let chosen = side;
		if (space[side] < required && space[OPPOSITE_SIDE[side]] > space[side]) {
			chosen = OPPOSITE_SIDE[side];
		}

		const placement = (alignment ? `${chosen}-${alignment}` : chosen) as TooltipLocation;
		const position = calculatePosition(placement, refRect, tooltipRect, offset);

		// Shift back inside the viewport. The arrow is clamped separately so it keeps
		// pointing at the trigger after the box slides away from it.
		position.left = clamp(
			position.left,
			VIEWPORT_PADDING,
			viewportWidth - tooltipRect.width - VIEWPORT_PADDING
		);
		position.top = clamp(
			position.top,
			VIEWPORT_PADDING,
			viewportHeight - tooltipRect.height - VIEWPORT_PADDING
		);

		return { position, placement };
	}

	function calculatePosition(
		placement: string,
		refRect: DOMRect,
		tooltipRect: DOMRect,
		offset: number
	): { left: number; top: number } {
		let left = 0;
		let top = 0;

		const [side, alignment] = placement.split('-');

		switch (side) {
			case 'top':
				top = refRect.top - tooltipRect.height - offset;
				left = refRect.left + refRect.width / 2 - tooltipRect.width / 2;
				if (alignment === 'start') left = refRect.left;
				if (alignment === 'end') left = refRect.right - tooltipRect.width;
				break;

			case 'bottom':
				top = refRect.bottom + offset;
				left = refRect.left + refRect.width / 2 - tooltipRect.width / 2;
				if (alignment === 'start') left = refRect.left;
				if (alignment === 'end') left = refRect.right - tooltipRect.width;
				break;

			case 'left':
				left = refRect.left - tooltipRect.width - offset;
				top = refRect.top + refRect.height / 2 - tooltipRect.height / 2;
				if (alignment === 'start') top = refRect.top;
				if (alignment === 'end') top = refRect.bottom - tooltipRect.height;
				break;

			case 'right':
				left = refRect.right + offset;
				top = refRect.top + refRect.height / 2 - tooltipRect.height / 2;
				if (alignment === 'start') top = refRect.top;
				if (alignment === 'end') top = refRect.bottom - tooltipRect.height;
				break;
		}

		return { left, top };
	}

	function calculateArrowPosition(
		placement: TooltipLocation,
		refRect: DOMRect,
		tooltipPos: { left: number; top: number },
		tooltipRect: DOMRect
	): string {
		const [side] = placement.split('-');

		const refCenterX = refRect.left + refRect.width / 2;
		const refCenterY = refRect.top + refRect.height / 2;

		// Aim at the trigger's centre, but never past the tooltip's rounded corners —
		// an unclamped arrow floats off the box once the tooltip has been shifted.
		const inset = CORNER_RADIUS + ARROW_SIZE;
		const arrowX = clamp(refCenterX - tooltipPos.left, inset, tooltipRect.width - inset);
		const arrowY = clamp(refCenterY - tooltipPos.top, inset, tooltipRect.height - inset);

		const transparent = `${ARROW_SIZE}px solid transparent`;
		const filled = `${ARROW_SIZE}px solid var(--tooltip-bg)`;
		// Negative margin centres the triangle on the aim point; the 100% offsets sit
		// it flush against the edge so it spans the whole gap to the trigger.
		const centreX = `margin-left: ${-ARROW_SIZE}px;`;
		const centreY = `margin-top: ${-ARROW_SIZE}px;`;

		switch (side) {
			case 'top':
				// Bottom edge, pointing down
				return `left: ${Math.round(arrowX)}px; top: 100%; ${centreX} border-left: ${transparent}; border-right: ${transparent}; border-top: ${filled};`;

			case 'bottom':
				// Top edge, pointing up
				return `left: ${Math.round(arrowX)}px; bottom: 100%; ${centreX} border-left: ${transparent}; border-right: ${transparent}; border-bottom: ${filled};`;

			case 'left':
				// Right edge, pointing right at the trigger
				return `top: ${Math.round(arrowY)}px; left: 100%; ${centreY} border-top: ${transparent}; border-bottom: ${transparent}; border-left: ${filled};`;

			case 'right':
				// Left edge, pointing left at the trigger
				return `top: ${Math.round(arrowY)}px; right: 100%; ${centreY} border-top: ${transparent}; border-bottom: ${transparent}; border-right: ${filled};`;

			default:
				return '';
		}
	}

	// Keep the tooltip anchored for as long as it is on screen. Runs before paint,
	// so the first frame is already in the right place.
	$effect(() => {
		if (!visible || !tooltipElement || !referenceElement) return;

		const tooltip = tooltipElement;
		const reference = referenceElement;

		// Resolved once per open rather than per reposition — walking the ancestor
		// chain with getComputedStyle is too costly to repeat on every scroll frame.
		fixedContainer = findFixedContainingBlock(tooltip);

		// Reads location/offsetDistance/showArrow, so this effect re-runs when they
		// change. maxWidth is covered by the observer below: it resizes the box.
		positionTooltip();

		// Content that grows, shrinks or reflows after the fact — async data, images,
		// a font swap, a reactive snippet — invalidates the measurements above.
		const observer = new ResizeObserver(() => positionTooltip());
		observer.observe(tooltip);
		observer.observe(reference);
		// A centred container (a dialog) moves the trigger when it resizes without
		// resizing the trigger itself, so neither observer above would notice.
		if (fixedContainer) observer.observe(fixedContainer);

		// Capture phase so scrolling any ancestor container counts, not just the page.
		window.addEventListener('scroll', schedulePosition, true);
		window.addEventListener('resize', schedulePosition);

		return () => {
			observer.disconnect();
			window.removeEventListener('scroll', schedulePosition, true);
			window.removeEventListener('resize', schedulePosition);
			fixedContainer = null;

			if (rafId !== null) {
				cancelAnimationFrame(rafId);
				rafId = null;
			}
		};
	});

	$effect(() => {
		if (!visible) return;

		const onKeydown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				cancelPending();
				hideTooltip();
			}
		};

		window.addEventListener('keydown', onKeydown);
		return () => window.removeEventListener('keydown', onKeydown);
	});

	// Losing the content or being disabled mid-hover has to close the tooltip, not
	// just hide it, or onOpen would be left reporting an open tooltip.
	$effect(() => {
		if (open && (disabled || !hasContent)) {
			cancelPending();
			hideTooltip();
		}
	});

	// Drop a pending delay timer if the component is destroyed mid-hover.
	$effect(() => {
		return () => cancelPending();
	});
</script>

<div class="tooltip-v2-container">
	<!-- Reference Element: a passive wrapper — the interactive element (e.g. button) is
	     provided by children; focusin/focusout bubble up from it, unlike focus/blur -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		bind:this={referenceElement}
		class="tooltip-v2-trigger"
		onmouseenter={handleMouseEnter}
		onmouseleave={handleMouseLeave}
		onfocusin={handleMouseEnter}
		onfocusout={handleMouseLeave}
	>
		{@render children()}
	</div>

	<!-- Floating Tooltip -->
	{#if visible}
		<div
			bind:this={tooltipElement}
			class="tooltip-v2-floating"
			class:is-positioned={positioned}
			style="{tooltipStyle} max-width: {maxWidth};"
			data-placement={actualPlacement}
			role="tooltip"
			transition:fade={{ duration: 150 }}
		>
			<div class="tooltip-v2-content">
				{#if text}
					<span>{text}</span>
				{:else if html}
					{@html html}
				{:else if tooltipContent}
					{@render tooltipContent()}
				{/if}
			</div>

			{#if showArrow}
				<div class="tooltip-v2-arrow" style={arrowStyle}></div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.tooltip-v2-container {
		display: inline-block;
	}

	.tooltip-v2-trigger {
		width: auto;
		display: inline-block;
	}

	.tooltip-v2-floating {
		position: fixed;
		left: 0;
		top: 0;
		z-index: 9999;
		pointer-events: none;
		/* Size the box independently of where it sits. With auto width the available
		   space is viewportWidth - left, so measuring and then moving the tooltip
		   would change the size it was measured at and retrigger the observer. */
		width: max-content;
		/* Revealed by .is-positioned once measured, so it is never painted at a
		   stale position. */
		visibility: hidden;
		--tooltip-bg: #e0e0e0;
		--tooltip-text: #333;
	}

	.tooltip-v2-floating.is-positioned {
		visibility: visible;
	}

	:global(.dark) .tooltip-v2-floating {
		--tooltip-bg: rgb(51, 52, 57);
		--tooltip-text: #e5e5e5;
	}

	.tooltip-v2-content {
		background: var(--tooltip-bg);
		color: var(--tooltip-text);
		padding: 0.5rem 0.75rem;
		border-radius: 6px;
		font-size: 0.875rem;
		line-height: 1.4;
		overflow-wrap: break-word;
	}

	:global(.dark) .tooltip-v2-content {
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
	}

	.tooltip-v2-arrow {
		position: absolute;
		width: 0;
		height: 0;
		pointer-events: none;
	}

	/* Handle HTML content spacing */
	.tooltip-v2-content :global(p) {
		margin: 0;
	}

	.tooltip-v2-content :global(p + p) {
		margin-top: 0.5rem;
	}

	.tooltip-v2-content :global(ul),
	.tooltip-v2-content :global(ol) {
		margin: 0;
		padding-left: 1.25rem;
	}

	.tooltip-v2-content :global(code) {
		background: rgba(255, 255, 255, 0.1);
		padding: 0.125rem 0.25rem;
		border-radius: 3px;
		font-size: 0.85em;
	}

	:global(.dark) .tooltip-v2-content :global(code) {
		background: rgba(255, 255, 255, 0.05);
	}
</style>
