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
		gap: var(--pui-spacing-3);
		padding: var(--pui-spacing-4);
		border-radius: var(--pui-radius-md);
		border: 1px solid;
	}

	.alert-default {
		background-color: var(--pui-color-gray-50);
		border-color: var(--pui-color-gray-200);
		color: var(--pui-color-gray-800);
	}

	.alert-info {
		background-color: var(--pui-color-info-50);
		border-color: var(--pui-color-info-200);
		color: var(--pui-color-info-800);
	}

	.alert-success {
		background-color: var(--pui-color-success-50);
		border-color: var(--pui-color-success-200);
		color: var(--pui-color-success-800);
	}

	.alert-warning {
		background-color: var(--pui-color-warning-50);
		border-color: var(--pui-color-warning-200);
		color: var(--pui-color-warning-800);
	}

	.alert-danger {
		background-color: var(--pui-color-danger-50);
		border-color: var(--pui-color-danger-200);
		color: var(--pui-color-danger-800);
	}

	:global(.dark) .alert-default {
		background-color: var(--pui-color-dark-200);
		border-color: var(--pui-color-dark-border);
		color: var(--pui-color-gray-100);
	}

	:global(.dark) .alert-info {
		background-color: var(--pui-color-info-900);
		border-color: var(--pui-color-info-700);
		color: var(--pui-color-info-300);
	}

	:global(.dark) .alert-success {
		background-color: var(--pui-color-success-900);
		border-color: var(--pui-color-success-700);
		color: var(--pui-color-success-300);
	}

	:global(.dark) .alert-warning {
		background-color: var(--pui-color-warning-900);
		border-color: var(--pui-color-warning-700);
		color: var(--pui-color-warning-300);
	}

	:global(.dark) .alert-danger {
		background-color: var(--pui-color-danger-900);
		border-color: var(--pui-color-danger-700);
		color: var(--pui-color-danger-300);
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
		font-weight: var(--pui-font-weight-semibold);
		margin-bottom: var(--pui-spacing-1);
	}

	.alert-message {
		font-size: var(--pui-font-size-sm);
		line-height: var(--pui-line-height-relaxed);
	}

	.alert-dismiss {
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		background: none;
		border: none;
		cursor: pointer;
		padding: var(--pui-spacing-1);
		border-radius: var(--pui-radius-sm);
		color: inherit;
		opacity: 0.7;
		transition: opacity var(--pui-transition-fast) var(--pui-ease-in-out);
	}

	.alert-dismiss:hover {
		opacity: 1;
	}
</style>
