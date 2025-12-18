<script lang="ts">
	import type { Snippet } from 'svelte';
	import Icon from '../icon/Icon.svelte';
	import { iconInfoCircle, iconAlertTriangle, iconCircleCheck, iconCircleX, iconX } from '../icon/index.js';

	type AlertVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

	interface Props {
		variant?: AlertVariant;
		title?: string;
		dismissible?: boolean;
		children?: Snippet;
		ondismiss?: () => void;
		class?: string;
	}

	let {
		variant = 'default',
		title,
		dismissible = false,
		children,
		ondismiss,
		class: className = ''
	}: Props = $props();

	let visible = $state(true);

	const icons: Record<AlertVariant, string> = {
		default: iconInfoCircle,
		info: iconInfoCircle,
		success: iconCircleCheck,
		warning: iconAlertTriangle,
		danger: iconCircleX
	};

	function dismiss() {
		visible = false;
		ondismiss?.();
	}
</script>

{#if visible}
	<div class="alert alert-{variant} {className}" role="alert">
		<div class="alert-icon">
			<Icon svg={icons[variant]} size="20px" />
		</div>
		<div class="alert-content">
			{#if title}
				<div class="alert-title">{title}</div>
			{/if}
			{#if children}
				<div class="alert-message">
					{@render children()}
				</div>
			{/if}
		</div>
		{#if dismissible}
			<button class="alert-dismiss" onclick={dismiss} aria-label="Dismiss">
				<Icon svg={iconX} size="16px" />
			</button>
		{/if}
	</div>
{/if}

<style>
	.alert {
		display: flex;
		align-items: flex-start;
		gap: var(--cui-spacing-3, 0.75rem);
		padding: var(--cui-spacing-4, 1rem);
		border-radius: var(--cui-radius-md, 0.5rem);
		border: 1px solid;
	}

	.alert-default {
		background-color: var(--cui-color-gray-50, #f9fafb);
		border-color: var(--cui-color-gray-200, #e5e7eb);
		color: var(--cui-color-gray-800, #1f2937);
	}

	.alert-info {
		background-color: var(--cui-color-info-50, #eff6ff);
		border-color: var(--cui-color-info-200, #bfdbfe);
		color: var(--cui-color-info-800, #1e40af);
	}

	.alert-success {
		background-color: var(--cui-color-success-50, #f0fdf4);
		border-color: var(--cui-color-success-200, #bbf7d0);
		color: var(--cui-color-success-800, #166534);
	}

	.alert-warning {
		background-color: var(--cui-color-warning-50, #fffbeb);
		border-color: var(--cui-color-warning-200, #fde68a);
		color: var(--cui-color-warning-800, #92400e);
	}

	.alert-danger {
		background-color: var(--cui-color-danger-50, #fef2f2);
		border-color: var(--cui-color-danger-200, #fecaca);
		color: var(--cui-color-danger-800, #991b1b);
	}

	:global(.dark) .alert-default {
		background-color: var(--cui-color-dark-200, #374151);
		border-color: var(--cui-color-dark-border, #4b5563);
		color: var(--cui-color-gray-100, #f3f4f6);
	}

	:global(.dark) .alert-info {
		background-color: rgba(59, 130, 246, 0.1);
		border-color: rgba(59, 130, 246, 0.3);
		color: var(--cui-color-info-300, #93c5fd);
	}

	:global(.dark) .alert-success {
		background-color: rgba(34, 197, 94, 0.1);
		border-color: rgba(34, 197, 94, 0.3);
		color: var(--cui-color-success-300, #86efac);
	}

	:global(.dark) .alert-warning {
		background-color: rgba(245, 158, 11, 0.1);
		border-color: rgba(245, 158, 11, 0.3);
		color: var(--cui-color-warning-300, #fcd34d);
	}

	:global(.dark) .alert-danger {
		background-color: rgba(239, 68, 68, 0.1);
		border-color: rgba(239, 68, 68, 0.3);
		color: var(--cui-color-danger-300, #fca5a5);
	}

	.alert-icon {
		flex-shrink: 0;
		display: flex;
		align-items: center;
	}

	.alert-content {
		flex: 1;
		min-width: 0;
	}

	.alert-title {
		font-weight: var(--cui-font-weight-semibold, 600);
		margin-bottom: var(--cui-spacing-1, 0.25rem);
	}

	.alert-message {
		font-size: var(--cui-font-size-sm, 0.875rem);
		line-height: var(--cui-line-height-relaxed, 1.625);
	}

	.alert-dismiss {
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		background: none;
		border: none;
		cursor: pointer;
		padding: var(--cui-spacing-1, 0.25rem);
		border-radius: var(--cui-radius-sm, 0.25rem);
		color: inherit;
		opacity: 0.7;
		transition: opacity 0.15s ease;
	}

	.alert-dismiss:hover {
		opacity: 1;
	}
</style>
