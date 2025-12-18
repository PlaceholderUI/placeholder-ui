<script lang="ts">
	import Icon from '../icon/Icon.svelte';
	import { iconStar } from '../icon/index.js';
	import FormGroup from './FormGroup.svelte';

	interface Props {
		label?: string;
		value?: number;
		count?: number;
		size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
		color?: 'primary' | 'secondary' | 'accent' | 'warning';
		emptySymbol?: string;
		fullSymbol?: string;
		readOnly?: boolean;
		fractions?: 1 | 2 | 4;
		highlightSelectedOnly?: boolean;
		required?: boolean;
		showError?: boolean;
		errorText?: string;
		class?: string;
		onchange?: (value: number) => void;
		onhover?: (value: number) => void;
	}

	let {
		label = '',
		value = $bindable(0),
		count = 5,
		size = 'md',
		color = 'warning',
		emptySymbol = undefined,
		fullSymbol = undefined,
		readOnly = false,
		fractions = 1,
		highlightSelectedOnly = false,
		required = false,
		showError = false,
		errorText = '',
		class: classes = '',
		onchange,
		onhover
	}: Props = $props();

	let hoverValue = $state(-1);

	const displayValue = $derived(hoverValue >= 0 ? hoverValue : value);

	const sizeMap: Record<string, string> = {
		xs: '16px',
		sm: '20px',
		md: '24px',
		lg: '32px',
		xl: '40px'
	};

	const iconSize = $derived(sizeMap[size] || '24px');

	function handleClick(index: number, fraction: number = 1) {
		if (readOnly) return;
		const newValue = index + fraction / fractions;
		value = newValue;
		onchange?.(newValue);
	}

	function handleMouseEnter(index: number, fraction: number = 1) {
		if (readOnly) return;
		const newHoverValue = index + fraction / fractions;
		hoverValue = newHoverValue;
		onhover?.(newHoverValue);
	}

	function handleMouseLeave() {
		hoverValue = -1;
	}

	function getSymbolState(index: number): 'empty' | 'full' | 'partial' {
		const currentValue = displayValue;
		if (highlightSelectedOnly) {
			return Math.ceil(currentValue) === index + 1 ? 'full' : 'empty';
		}
		if (currentValue >= index + 1) return 'full';
		if (currentValue > index) return 'partial';
		return 'empty';
	}

	function getPartialWidth(index: number): number {
		const currentValue = displayValue;
		if (currentValue <= index) return 0;
		if (currentValue >= index + 1) return 100;
		return (currentValue - index) * 100;
	}
</script>

<FormGroup {label} {required} {showError} {errorText} class={classes}>
	<div
		class="rating size-{size} color-{color}"
		class:read-only={readOnly}
		role="slider"
		tabindex={readOnly ? -1 : 0}
		aria-valuenow={value}
		aria-valuemin={0}
		aria-valuemax={count}
		aria-label={label || 'Rating'}
		onmouseleave={handleMouseLeave}
	>
		{#each Array(count) as _, index (index)}
			{@const state = getSymbolState(index)}
			{@const partialWidth = getPartialWidth(index)}
			<div class="rating-symbol-wrapper">
				{#if fractions > 1}
					<!-- Fractional rating with invisible click zones -->
					{#each Array(fractions) as __, fractionIndex (fractionIndex)}
						<button
							type="button"
							class="rating-fraction-zone"
							style="width: {100 / fractions}%; left: {(fractionIndex / fractions) * 100}%;"
							onclick={() => handleClick(index, fractionIndex + 1)}
							onmouseenter={() => handleMouseEnter(index, fractionIndex + 1)}
							disabled={readOnly}
							aria-label="Rate {index + (fractionIndex + 1) / fractions}"
						></button>
					{/each}
				{:else}
					<button
						type="button"
						class="rating-button"
						onclick={() => handleClick(index)}
						onmouseenter={() => handleMouseEnter(index, 1)}
						disabled={readOnly}
						aria-label="Rate {index + 1}"
					></button>
				{/if}
				<div class="rating-symbol empty">
					<Icon svg={emptySymbol || iconStar} size={iconSize} />
				</div>
				<div class="rating-symbol full" style="width: {partialWidth}%;">
					<Icon svg={fullSymbol || iconStar} size={iconSize} />
				</div>
			</div>
		{/each}
	</div>
</FormGroup>

<style>
	.rating {
		display: inline-flex;
		gap: var(--cui-spacing-1);
	}

	.rating.read-only {
		pointer-events: none;
	}

	.rating-symbol-wrapper {
		position: relative;
		cursor: pointer;
	}

	.read-only .rating-symbol-wrapper {
		cursor: default;
	}

	.rating-button,
	.rating-fraction-zone {
		position: absolute;
		top: 0;
		height: 100%;
		background: transparent;
		border: none;
		cursor: pointer;
		z-index: 2;
		padding: 0;
	}

	.rating-button {
		left: 0;
		width: 100%;
	}

	.rating-button:disabled,
	.rating-fraction-zone:disabled {
		cursor: default;
	}

	.rating-symbol {
		display: flex;
		align-items: center;
		justify-content: center;
		transition: transform var(--cui-transition-fast) var(--cui-ease-out);
	}

	.rating-symbol-wrapper:hover .rating-symbol {
		transform: scale(1.1);
	}

	.read-only .rating-symbol-wrapper:hover .rating-symbol {
		transform: none;
	}

	.rating-symbol.empty {
		color: var(--cui-color-gray-300);
	}

	:global(.dark) .rating-symbol.empty {
		color: var(--cui-color-dark-border);
	}

	.rating-symbol.full {
		position: absolute;
		top: 0;
		left: 0;
		overflow: hidden;
		color: var(--rating-color, var(--cui-color-warning));
	}

	.rating-symbol.full :global(svg) {
		fill: currentColor;
	}

	/* Colors */
	.color-primary {
		--rating-color: var(--cui-color-primary);
	}
	.color-secondary {
		--rating-color: var(--cui-color-secondary);
	}
	.color-accent {
		--rating-color: var(--cui-color-accent);
	}
	.color-warning {
		--rating-color: var(--cui-color-warning);
	}

	/* Sizes via icon prop */
</style>
