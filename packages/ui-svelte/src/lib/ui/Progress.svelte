<script lang="ts">
	interface Props {
		value?: number;
		max?: number;
		size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
		color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger';
		striped?: boolean;
		animated?: boolean;
		label?: string;
		showValue?: boolean;
		radius?: 'none' | 'sm' | 'md' | 'lg' | 'full';
		class?: string;
	}

	let {
		value = 0,
		max = 100,
		size = 'md',
		color = 'primary',
		striped = false,
		animated = false,
		label = undefined,
		showValue = false,
		radius = 'full',
		class: classes = ''
	}: Props = $props();

	const percentage = $derived(Math.min(100, Math.max(0, (value / max) * 100)));
	const displayValue = $derived(showValue ? `${Math.round(percentage)}%` : '');
</script>

<div class="progress-wrapper {classes}">
	{#if label}
		<div class="progress-label">
			<span>{label}</span>
			{#if showValue}
				<span class="progress-value">{displayValue}</span>
			{/if}
		</div>
	{/if}
	<div
		class="progress size-{size} radius-{radius}"
		role="progressbar"
		aria-valuenow={value}
		aria-valuemin={0}
		aria-valuemax={max}
	>
		<div
			class="progress-bar color-{color}"
			class:striped
			class:animated={animated && striped}
			style="width: {percentage}%"
		>
			{#if showValue && !label}
				<span class="progress-bar-label">{displayValue}</span>
			{/if}
		</div>
	</div>
</div>

<style>
	.progress-wrapper {
		width: 100%;
	}

	.progress-label {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--pui-spacing-1);
		font-size: var(--pui-font-size-sm);
		color: var(--pui-text-secondary);
	}

	:global(.dark) .progress-label {
		color: var(--pui-color-gray-300);
	}

	.progress-value {
		font-weight: var(--pui-font-weight-medium);
	}

	.progress {
		width: 100%;
		background-color: var(--pui-color-gray-200);
		overflow: hidden;
	}

	:global(.dark) .progress {
		background-color: var(--pui-color-dark-border);
	}

	/* Sizes */
	.size-xs {
		height: 4px;
	}
	.size-sm {
		height: 6px;
	}
	.size-md {
		height: 8px;
	}
	.size-lg {
		height: 12px;
	}
	.size-xl {
		height: 16px;
	}

	/* Radius */
	.radius-none {
		border-radius: 0;
	}
	.radius-sm {
		border-radius: var(--pui-radius-sm);
	}
	.radius-md {
		border-radius: var(--pui-radius-md);
	}
	.radius-lg {
		border-radius: var(--pui-radius-lg);
	}
	.radius-full {
		border-radius: var(--pui-radius-full);
	}

	.progress-bar {
		height: 100%;
		border-radius: inherit;
		transition: width var(--pui-transition-slow) var(--pui-ease-out);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.progress-bar-label {
		font-size: var(--pui-font-size-xs);
		font-weight: var(--pui-font-weight-medium);
		color: var(--pui-color-white);
		padding: 0 var(--pui-spacing-2);
		white-space: nowrap;
	}

	/* Colors */
	.color-primary {
		background-color: var(--pui-color-primary);
	}
	.color-secondary {
		background-color: var(--pui-color-secondary);
	}
	.color-accent {
		background-color: var(--pui-color-accent);
	}
	.color-success {
		background-color: var(--pui-color-success);
	}
	.color-warning {
		background-color: var(--pui-color-warning);
	}
	.color-danger {
		background-color: var(--pui-color-danger);
	}

	/* Striped */
	.striped {
		background-image: linear-gradient(
			45deg,
			rgba(255, 255, 255, 0.15) 25%,
			transparent 25%,
			transparent 50%,
			rgba(255, 255, 255, 0.15) 50%,
			rgba(255, 255, 255, 0.15) 75%,
			transparent 75%,
			transparent
		);
		background-size: 1rem 1rem;
	}

	.animated {
		animation: progress-stripes 1s linear infinite;
	}

	@keyframes progress-stripes {
		from {
			background-position: 1rem 0;
		}
		to {
			background-position: 0 0;
		}
	}
</style>
