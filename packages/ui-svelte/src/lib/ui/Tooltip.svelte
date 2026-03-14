<script lang="ts">
	import type { Snippet } from 'svelte';
	import { fade } from 'svelte/transition';

	interface Props {
		/** The element to attach the tooltip to */
		children: Snippet;
		/** Rich content using a Svelte snippet */
		tooltipContent?: Snippet;
		/** Simple text content (alternative to snippet) */
		text?: string;
		/** HTML content (use with caution - sanitize user input) */
		html?: string;
		/** Preferred tooltip position */
		location?: 'top' | 'right' | 'bottom' | 'left' | 'top-start' | 'top-end' | 'right-start' | 'right-end' | 'bottom-start' | 'bottom-end' | 'left-start' | 'left-end';
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
	}: Props = $props();

	// State
	let open = $state(false);
	let referenceElement: HTMLElement | null = $state(null);
	let tooltipElement: HTMLElement | null = $state(null);
	let arrowElement: HTMLElement | null = $state(null);
	let timeoutId: number | null = null;

	// Position state
	let tooltipStyle = $state('');
	let arrowStyle = $state('');
	let actualPlacement = $state<'top' | 'right' | 'bottom' | 'left' | 'top-start' | 'top-end' | 'right-start' | 'right-end' | 'bottom-start' | 'bottom-end' | 'left-start' | 'left-end'>('top');

	// Sync actualPlacement with location prop
	$effect(() => {
		actualPlacement = location;
	});

	// Check if tooltip has any content
	const hasContent = $derived(!!(text || html || tooltipContent));

	function handleMouseEnter() {
		if (disabled || !hasContent) return;

		if (delay > 0) {
			timeoutId = window.setTimeout(() => {
				showTooltip();
			}, delay);
		} else {
			showTooltip();
		}
	}

	function handleMouseLeave() {
		if (timeoutId) {
			clearTimeout(timeoutId);
			timeoutId = null;
		}
		hideTooltip();
	}

	function showTooltip() {
		open = true;
		onOpen?.(true);

		// Position tooltip after it's rendered
		// Use multiple RAF calls and verify dimensions to ensure layout is complete
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				if (referenceElement && tooltipElement) {
					positionTooltip();

					// Verify and reposition if dimensions changed
					requestAnimationFrame(() => {
						if (tooltipElement) {
							const rect = tooltipElement.getBoundingClientRect();
							if (rect.width > 0 && rect.height > 0) {
								positionTooltip();
							}
						}
					});
				}
			});
		});
	}

	function hideTooltip() {
		open = false;
		onOpen?.(false);
	}

	function positionTooltip() {
		if (!referenceElement || !tooltipElement) return;

		const refRect = referenceElement.getBoundingClientRect();
		const tooltipRect = tooltipElement.getBoundingClientRect();
		const arrowSize = showArrow ? 12 : 0;
		const offset = offsetDistance + arrowSize;

		let position = calculatePosition(location, refRect, tooltipRect, offset);

		// Check if tooltip would overflow viewport and flip if needed
		const flippedPosition = checkAndFlipPosition(position, tooltipRect, location, refRect, offset);
		position = flippedPosition.position;
		actualPlacement = flippedPosition.placement as typeof actualPlacement;

		// Apply position
		tooltipStyle = `left: ${position.left}px; top: ${position.top}px;`;

		// Position arrow
		if (showArrow && arrowElement) {
			arrowStyle = calculateArrowPosition(actualPlacement, refRect, position);
		}
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

	function checkAndFlipPosition(
		position: { left: number; top: number },
		tooltipRect: DOMRect,
		placement: string,
		refRect: DOMRect,
		offset: number
	): { position: { left: number; top: number }; placement: string } {
		const viewportWidth = window.innerWidth;
		const viewportHeight = window.innerHeight;
		const padding = 5;

		let newPosition = { ...position };
		let newPlacement = placement;
		const [side] = placement.split('-');

		// Check vertical overflow
		if (side === 'top' && position.top < padding) {
			// Flip to bottom
			newPlacement = placement.replace('top', 'bottom');
			newPosition = calculatePosition(newPlacement, refRect, tooltipRect, offset);
		} else if (side === 'bottom' && position.top + tooltipRect.height > viewportHeight - padding) {
			// Flip to top
			newPlacement = placement.replace('bottom', 'top');
			newPosition = calculatePosition(newPlacement, refRect, tooltipRect, offset);
		}

		// Check horizontal overflow
		if (side === 'left' && position.left < padding) {
			// Flip to right
			newPlacement = placement.replace('left', 'right');
			newPosition = calculatePosition(newPlacement, refRect, tooltipRect, offset);
		} else if (side === 'right' && position.left + tooltipRect.width > viewportWidth - padding) {
			// Flip to left
			newPlacement = placement.replace('right', 'left');
			newPosition = calculatePosition(newPlacement, refRect, tooltipRect, offset);
		}

		// Shift within bounds if still overflowing
		if (newPosition.left < padding) {
			newPosition.left = padding;
		} else if (newPosition.left + tooltipRect.width > viewportWidth - padding) {
			newPosition.left = viewportWidth - tooltipRect.width - padding;
		}

		if (newPosition.top < padding) {
			newPosition.top = padding;
		} else if (newPosition.top + tooltipRect.height > viewportHeight - padding) {
			newPosition.top = viewportHeight - tooltipRect.height - padding;
		}

		return { position: newPosition, placement: newPlacement };
	}

	function calculateArrowPosition(
		placement: string,
		refRect: DOMRect,
		tooltipPos: { left: number; top: number }
	): string {
		const [side] = placement.split('-');

		const refCenter = {
			x: refRect.left + refRect.width / 2,
			y: refRect.top + refRect.height / 2
		};

		const tooltipHeight = tooltipElement?.offsetHeight || 0;
		const tooltipWidth = tooltipElement?.offsetWidth || 0;

		// Calculate arrow center position relative to tooltip
		const arrowX = refCenter.x - tooltipPos.left;
		const arrowY = refCenter.y - tooltipPos.top;

		switch (side) {
			case 'top':
				// Arrow at bottom edge, pointing down
				return `
					left: ${arrowX}px;
					top: ${tooltipHeight}px;
					border-left: 12px solid transparent;
					border-right: 12px solid transparent;
					border-top: 12px solid var(--tooltip-bg);
					transform: translateX(-50%) translateY(-50%);
				`;

			case 'bottom':
				// Arrow at top edge, pointing up
				return `
					left: ${arrowX}px;
					top: 0px;
					border-left: 12px solid transparent;
					border-right: 12px solid transparent;
					border-bottom: 12px solid var(--tooltip-bg);
					transform: translateX(-50%) translateY(-50%);
				`;

			case 'left':
				// Arrow at right edge, pointing left
				return `
					left: ${tooltipWidth}px;
					top: ${arrowY}px;
					border-top: 12px solid transparent;
					border-bottom: 12px solid transparent;
					border-left: 12px solid var(--tooltip-bg);
					transform: translateX(-50%) translateY(-50%);
				`;

			case 'right':
				// Arrow at left edge, pointing right
				return `
					left: 0px;
					top: ${arrowY}px;
					border-top: 12px solid transparent;
					border-bottom: 12px solid transparent;
					border-right: 12px solid var(--tooltip-bg);
					transform: translateX(-50%) translateY(-50%);
				`;

			default:
				return '';
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && open) {
			hideTooltip();
		}
	}

	$effect(() => {
		if (open) {
			window.addEventListener('keydown', handleKeydown);
			window.addEventListener('scroll', positionTooltip, true);
			window.addEventListener('resize', positionTooltip);

			return () => {
				window.removeEventListener('keydown', handleKeydown);
				window.removeEventListener('scroll', positionTooltip, true);
				window.removeEventListener('resize', positionTooltip);
			};
		}
	});
</script>

<div class="tooltip-v2-container">
	<!-- Reference Element -->
	<div
		bind:this={referenceElement}
		class="tooltip-v2-trigger"
		onmouseenter={handleMouseEnter}
		onmouseleave={handleMouseLeave}
		onfocus={handleMouseEnter}
		onblur={handleMouseLeave}
		role="button"
		tabindex="0"
	>
		{@render children()}
	</div>

	<!-- Floating Tooltip -->
	{#if open && hasContent && !disabled}
		<div
			bind:this={tooltipElement}
			class="tooltip-v2-floating"
			style={tooltipStyle}
			role="tooltip"
			transition:fade={{ duration: 150 }}
		>
			<div class="tooltip-v2-content" style="max-width: {maxWidth}">
				{#if text}
					<span>{text}</span>
				{:else if html}
					{@html html}
				{:else if tooltipContent}
					{@render tooltipContent()}
				{/if}
			</div>

			{#if showArrow}
				<div bind:this={arrowElement} class="tooltip-v2-arrow" style={arrowStyle}></div>
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
		z-index: var(--pui-z-tooltip);
		pointer-events: none;
		--tooltip-bg: var(--pui-color-gray-200);
		--tooltip-text: var(--pui-color-gray-800);
	}

	:global(.dark) .tooltip-v2-floating {
		--tooltip-bg: var(--pui-color-gray-800);
		--tooltip-text: var(--pui-color-gray-200);
	}

	.tooltip-v2-content {
		background: var(--tooltip-bg);
		color: var(--tooltip-text);
		padding: var(--pui-spacing-2) var(--pui-spacing-3);
		border-radius: var(--pui-radius-lg);
		font-size: var(--pui-font-size-sm);
		line-height: var(--pui-line-height-normal);
		position: relative;
	}

	:global(.dark) .tooltip-v2-content {
		box-shadow: var(--pui-shadow-md);
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