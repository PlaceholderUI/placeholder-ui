<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Section {
		value: number;
		color: string;
	}

	interface Props {
		value?: number;
		size?: number;
		thickness?: number;
		roundCaps?: boolean;
		color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger' | string;
		sections?: Section[];
		label?: Snippet;
		class?: string;
	}

	let {
		value = 0,
		size = 120,
		thickness = 8,
		roundCaps = true,
		color = 'primary',
		sections = [],
		label,
		class: classes = ''
	}: Props = $props();

	const radius = $derived((size - thickness) / 2);
	const circumference = $derived(2 * Math.PI * radius);
	const center = $derived(size / 2);

	// Color mapping
	const colorMap: Record<string, string> = {
		primary: 'var(--cui-color-primary)',
		secondary: 'var(--cui-color-secondary)',
		accent: 'var(--cui-color-accent)',
		success: 'var(--cui-color-success)',
		warning: 'var(--cui-color-warning)',
		danger: 'var(--cui-color-danger)'
	};

	const strokeColor = $derived(colorMap[color] || color);

	// Calculate sections or single value
	const computedSections = $derived.by(() => {
		if (sections.length > 0) {
			return sections;
		}
		return [{ value: Math.min(100, Math.max(0, value)), color: strokeColor }];
	});

	// Calculate stroke dash arrays for each section
	const sectionData = $derived.by(() => {
		let offset = 0;
		return computedSections.map((section) => {
			const sectionLength = (section.value / 100) * circumference;
			const data = {
				dashArray: `${sectionLength} ${circumference - sectionLength}`,
				dashOffset: -offset + circumference * 0.25, // Start from top
				color: colorMap[section.color] || section.color
			};
			offset += sectionLength;
			return data;
		});
	});
</script>

<div class="ring-progress {classes}" style="width: {size}px; height: {size}px;">
	<svg width={size} height={size} viewBox="0 0 {size} {size}">
		<!-- Background circle -->
		<circle
			cx={center}
			cy={center}
			r={radius}
			fill="none"
			stroke="var(--ring-progress-bg, var(--cui-color-gray-200))"
			stroke-width={thickness}
		/>
		<!-- Progress sections -->
		{#each sectionData as section}
			<circle
				cx={center}
				cy={center}
				r={radius}
				fill="none"
				stroke={section.color}
				stroke-width={thickness}
				stroke-dasharray={section.dashArray}
				stroke-dashoffset={section.dashOffset}
				stroke-linecap={roundCaps ? 'round' : 'butt'}
				class="progress-ring"
			/>
		{/each}
	</svg>
	{#if label}
		<div class="ring-label">
			{@render label()}
		</div>
	{/if}
</div>

<style>
	.ring-progress {
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}

	:global(.dark) .ring-progress {
		--ring-progress-bg: var(--cui-color-dark-border);
	}

	svg {
		transform: rotate(-90deg);
	}

	.progress-ring {
		transition:
			stroke-dasharray var(--cui-transition-slow) var(--cui-ease-out),
			stroke-dashoffset var(--cui-transition-slow) var(--cui-ease-out);
	}

	.ring-label {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		text-align: center;
		font-size: var(--cui-font-size-lg);
		font-weight: var(--cui-font-weight-semibold);
		color: var(--text-color, var(--cui-color-gray-900));
	}

	:global(.dark) .ring-label {
		color: var(--cui-color-gray-100);
	}
</style>
