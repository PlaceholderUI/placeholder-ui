<script lang="ts">
	import type { ProgressBarVariant } from './ProgressBarVariant.js';

	export interface ProgressBarSegment {
		/** Percentage width of this segment (0-100). All segments should sum to <= 100. */
		value: number;
		/** Color variant for this segment */
		variant?: ProgressBarVariant;
		/** Label text displayed inside the segment */
		label?: string;
	}

	export interface ProgressBarProps {
		/** Current progress value (0-100). Used in simple mode. */
		value?: number;
		/** Color variant for simple mode */
		variant?: ProgressBarVariant;
		/** Label text displayed centered on the filled portion */
		label?: string;
		/** Array of segments for multi-segment mode. Overrides value/variant/label when provided. */
		segments?: ProgressBarSegment[];
		/** Height of the bar */
		size?: 'sm' | 'md' | 'lg';
		/** Whether the bar has rounded ends */
		rounded?: boolean;
		/** Whether to animate width changes */
		animated?: boolean;
		/** Additional CSS classes */
		class?: string;
	}

	let {
		value = 0,
		variant = 'primary',
		label = undefined,
		segments = undefined,
		size = 'md',
		rounded = true,
		animated = true,
		class: classes = ''
	}: ProgressBarProps = $props();

	let clampedValue = $derived(Math.min(100, Math.max(0, value)));
	let isMultiSegment = $derived(segments !== undefined && segments.length > 0);
</script>

<div
	class="progress-bar size-{size} {rounded ? 'rounded' : ''} {classes}"
	role="progressbar"
	aria-valuenow={isMultiSegment ? undefined : clampedValue}
	aria-valuemin={0}
	aria-valuemax={100}
>
	{#if isMultiSegment && segments}
		{#each segments as segment}
			<div
				class="segment {segment.variant ?? 'primary'} {animated ? 'animated' : ''}"
				style="width: {Math.min(100, Math.max(0, segment.value))}%"
			>
				{#if segment.label}
					<span class="label">{segment.label}</span>
				{/if}
			</div>
		{/each}
	{:else}
		<div
			class="fill {variant} {animated ? 'animated' : ''}"
			style="width: {clampedValue}%"
		>
			{#if label}
				<span class="label">{label}</span>
			{/if}
		</div>
	{/if}
</div>

<style>
	.progress-bar {
		width: 100%;
		background-color: var(--pui-color-gray-200);
		overflow: hidden;
		display: flex;
	}

	:global(.dark) .progress-bar {
		background-color: var(--pui-color-dark-border);
	}

	.rounded {
		border-radius: var(--pui-radius-full);
	}

	.size-sm {
		height: 8px;
	}

	.size-md {
		height: 20px;
	}

	.size-lg {
		height: 28px;
	}

	.fill,
	.segment {
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		white-space: nowrap;
		min-width: 0;
	}

	.animated {
		transition: width 0.4s ease-in-out;
	}

	.label {
		font-weight: var(--pui-font-weight-semibold);
		line-height: 1;
		text-overflow: ellipsis;
		overflow: hidden;
	}

	.size-sm .label {
		font-size: var(--pui-font-size-xs);
		padding: 0 var(--pui-spacing-half);
	}

	.size-md .label {
		font-size: var(--pui-font-size-xs);
		padding: 0 var(--pui-spacing-2);
	}

	.size-lg .label {
		font-size: var(--pui-font-size-sm);
		padding: 0 var(--pui-spacing-2);
	}

	/* Variant colors */
	.primary {
		background-color: var(--pui-color-primary);
		color: var(--pui-color-white);
	}

	.secondary {
		background-color: var(--pui-color-secondary);
		color: var(--pui-color-primary);
	}

	.accent {
		background-color: var(--pui-color-accent);
		color: var(--pui-color-white);
	}

	.danger {
		background-color: var(--pui-color-danger);
		color: var(--pui-color-white);
	}

	.success {
		background-color: var(--pui-color-success);
		color: var(--pui-color-white);
	}

	.warning {
		background-color: var(--pui-color-warning);
		color: var(--pui-color-primary);
	}
</style>
