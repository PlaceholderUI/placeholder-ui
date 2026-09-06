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
		<div class="fill {variant} {animated ? 'animated' : ''}" style="width: {clampedValue}%">
			{#if label}
				<span class="label">{label}</span>
			{/if}
		</div>
	{/if}
</div>

<style>
	.progress-bar {
		width: 100%;
		background-color: var(--border-color);
		overflow: hidden;
		display: flex;
	}

	.rounded {
		border-radius: 9999px;
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
		font-weight: 600;
		line-height: 1;
		text-overflow: ellipsis;
		overflow: hidden;
	}

	.size-sm .label {
		font-size: 0.5rem;
		padding: 0 0.125rem;
	}

	.size-md .label {
		font-size: 0.75rem;
		padding: 0 0.5rem;
	}

	.size-lg .label {
		font-size: 0.875rem;
		padding: 0 0.625rem;
	}

	/* Variant colors */
	.primary,
	.midnight {
		background-color: var(--ui-primary);
		color: #fff;
	}

	.accent,
	.pistachio {
		background-color: var(--ui-accent);
		color: var(--ui-primary);
	}

	.tertiary,
	.turquoise {
		background-color: var(--ui-tertiary);
		color: var(--ui-primary);
	}

	.danger {
		background-color: var(--danger-bg);
		color: #fff;
	}

	.secondary {
		background-color: var(--accent-color);
		color: #fff;
	}

	:global(.dark) .secondary {
		color: var(--ui-primary);
	}
</style>
