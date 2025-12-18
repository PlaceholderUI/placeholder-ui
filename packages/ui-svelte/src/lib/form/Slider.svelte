<script lang="ts">
	import FormGroup from './FormGroup.svelte';

	interface Mark {
		value: number;
		label?: string;
	}

	interface Props {
		label?: string;
		value?: number;
		min?: number;
		max?: number;
		step?: number;
		marks?: Mark[] | boolean;
		showValue?: boolean;
		labelAlwaysOn?: boolean;
		size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
		color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger';
		radius?: 'none' | 'sm' | 'md' | 'lg' | 'full';
		disabled?: boolean;
		class?: string;
		containerClass?: string;
		required?: boolean;
		showError?: boolean;
		errorText?: string;
		tooltipLocation?: 'top' | 'bottom' | 'left' | 'right';
		tooltipText?: string;
		onchange?: (value: number) => void;
		oninput?: (value: number) => void;
	}

	let {
		label = '',
		value = $bindable(0),
		min = 0,
		max = 100,
		step = 1,
		marks = false,
		showValue = false,
		labelAlwaysOn = false,
		size = 'md',
		color = 'primary',
		radius = 'full',
		disabled = false,
		class: classes = '',
		containerClass = '',
		required = false,
		showError = false,
		errorText = '',
		tooltipLocation = 'top',
		tooltipText = undefined,
		onchange,
		oninput
	}: Props = $props();

	let isDragging = $state(false);

	const percentage = $derived(((value - min) / (max - min)) * 100);

	// Generate marks if boolean true
	const computedMarks = $derived.by(() => {
		if (marks === false) return [];
		if (marks === true) {
			// Generate marks at 0%, 25%, 50%, 75%, 100%
			const range = max - min;
			return [
				{ value: min, label: String(min) },
				{ value: min + range * 0.25, label: String(min + range * 0.25) },
				{ value: min + range * 0.5, label: String(min + range * 0.5) },
				{ value: min + range * 0.75, label: String(min + range * 0.75) },
				{ value: max, label: String(max) }
			];
		}
		return marks;
	});

	function handleInput(e: Event) {
		const target = e.target as HTMLInputElement;
		value = Number(target.value);
		oninput?.(value);
	}

	function handleChange(e: Event) {
		const target = e.target as HTMLInputElement;
		value = Number(target.value);
		onchange?.(value);
	}
</script>

<div class="slider-container {containerClass}">
	<FormGroup
		{label}
		{required}
		class={classes}
		{tooltipLocation}
		{tooltipText}
		{showError}
		{errorText}
	>
		<div class="slider-wrapper size-{size}">
			{#if showValue}
				<div class="slider-value-display">
					<span>{value}</span>
				</div>
			{/if}
			<div class="slider-track-wrapper">
				<input
					type="range"
					class="slider color-{color} radius-{radius}"
					{min}
					{max}
					{step}
					{disabled}
					bind:value
					oninput={handleInput}
					onchange={handleChange}
					onmousedown={() => (isDragging = true)}
					onmouseup={() => (isDragging = false)}
					ontouchstart={() => (isDragging = true)}
					ontouchend={() => (isDragging = false)}
					style="--slider-percentage: {percentage}%;"
				/>
				{#if labelAlwaysOn || isDragging}
					<div class="slider-thumb-label" style="left: {percentage}%;">
						{value}
					</div>
				{/if}
			</div>
			{#if computedMarks.length > 0}
				<div class="slider-marks">
					{#each computedMarks as mark}
						{@const markPercentage = ((mark.value - min) / (max - min)) * 100}
						<div class="slider-mark" style="left: {markPercentage}%;">
							<div class="mark-dot" class:active={value >= mark.value}></div>
							{#if mark.label}
								<div class="mark-label">{mark.label}</div>
							{/if}
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</FormGroup>
</div>

<style>
	.slider-container {
		width: 100%;
	}

	.slider-wrapper {
		width: 100%;
		padding-top: var(--cui-spacing-1);
	}

	.slider-value-display {
		text-align: right;
		font-size: var(--cui-font-size-sm);
		font-weight: var(--cui-font-weight-medium);
		color: var(--text-color, var(--cui-color-gray-700));
		margin-bottom: var(--cui-spacing-1);
	}

	:global(.dark) .slider-value-display {
		color: var(--cui-color-gray-300);
	}

	.slider-track-wrapper {
		position: relative;
		width: 100%;
	}

	.slider {
		-webkit-appearance: none;
		appearance: none;
		width: 100%;
		background: transparent;
		cursor: pointer;
	}

	.slider:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	/* Track */
	.slider::-webkit-slider-runnable-track {
		height: var(--track-height, 6px);
		background: linear-gradient(
			to right,
			var(--slider-color, var(--cui-color-primary)) 0%,
			var(--slider-color, var(--cui-color-primary)) var(--slider-percentage),
			var(--cui-color-gray-300) var(--slider-percentage),
			var(--cui-color-gray-300) 100%
		);
		border-radius: var(--track-radius, var(--cui-radius-full));
	}

	:global(.dark) .slider::-webkit-slider-runnable-track {
		background: linear-gradient(
			to right,
			var(--slider-color, var(--cui-color-primary)) 0%,
			var(--slider-color, var(--cui-color-primary)) var(--slider-percentage),
			var(--cui-color-dark-border) var(--slider-percentage),
			var(--cui-color-dark-border) 100%
		);
	}

	.slider::-moz-range-track {
		height: var(--track-height, 6px);
		background: var(--cui-color-gray-300);
		border-radius: var(--track-radius, var(--cui-radius-full));
	}

	.slider::-moz-range-progress {
		background: var(--slider-color, var(--cui-color-primary));
		height: var(--track-height, 6px);
		border-radius: var(--track-radius, var(--cui-radius-full));
	}

	/* Thumb */
	.slider::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: var(--thumb-size, 16px);
		height: var(--thumb-size, 16px);
		background: var(--cui-color-white);
		border: 2px solid var(--slider-color, var(--cui-color-primary));
		border-radius: 50%;
		margin-top: calc((var(--track-height, 6px) - var(--thumb-size, 16px)) / 2);
		box-shadow: var(--cui-shadow-sm);
		transition: transform var(--cui-transition-fast) var(--cui-ease-out);
	}

	.slider::-webkit-slider-thumb:hover {
		transform: scale(1.1);
	}

	.slider::-moz-range-thumb {
		width: var(--thumb-size, 16px);
		height: var(--thumb-size, 16px);
		background: var(--cui-color-white);
		border: 2px solid var(--slider-color, var(--cui-color-primary));
		border-radius: 50%;
		box-shadow: var(--cui-shadow-sm);
	}

	/* Sizes */
	.size-xs {
		--track-height: 4px;
		--thumb-size: 12px;
	}
	.size-sm {
		--track-height: 5px;
		--thumb-size: 14px;
	}
	.size-md {
		--track-height: 6px;
		--thumb-size: 16px;
	}
	.size-lg {
		--track-height: 8px;
		--thumb-size: 20px;
	}
	.size-xl {
		--track-height: 10px;
		--thumb-size: 24px;
	}

	/* Colors */
	.color-primary {
		--slider-color: var(--cui-color-primary);
	}
	.color-secondary {
		--slider-color: var(--cui-color-secondary);
	}
	.color-accent {
		--slider-color: var(--cui-color-accent);
	}
	.color-success {
		--slider-color: var(--cui-color-success);
	}
	.color-warning {
		--slider-color: var(--cui-color-warning);
	}
	.color-danger {
		--slider-color: var(--cui-color-danger);
	}

	/* Radius */
	.radius-none {
		--track-radius: 0;
	}
	.radius-sm {
		--track-radius: var(--cui-radius-sm);
	}
	.radius-md {
		--track-radius: var(--cui-radius-md);
	}
	.radius-lg {
		--track-radius: var(--cui-radius-lg);
	}
	.radius-full {
		--track-radius: var(--cui-radius-full);
	}

	/* Thumb label */
	.slider-thumb-label {
		position: absolute;
		top: -28px;
		transform: translateX(-50%);
		background: var(--cui-color-gray-800);
		color: var(--cui-color-white);
		font-size: var(--cui-font-size-xs);
		padding: 2px 6px;
		border-radius: var(--cui-radius-sm);
		white-space: nowrap;
		pointer-events: none;
	}

	/* Marks */
	.slider-marks {
		position: relative;
		width: 100%;
		height: 20px;
		margin-top: var(--cui-spacing-1);
	}

	.slider-mark {
		position: absolute;
		transform: translateX(-50%);
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.mark-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--cui-color-gray-400);
		margin-bottom: var(--cui-spacing-1);
	}

	.mark-dot.active {
		background: var(--slider-color, var(--cui-color-primary));
	}

	.mark-label {
		font-size: var(--cui-font-size-xs);
		color: var(--cui-color-gray-600);
	}

	:global(.dark) .mark-label {
		color: var(--cui-color-gray-400);
	}
</style>
