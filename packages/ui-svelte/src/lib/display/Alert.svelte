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
		background-color: var(--pui-alert-info-bg);
		border-color: var(--pui-alert-info-border);
		color: var(--pui-color-info-dark, var(--pui-color-info));
	}

	.alert-success {
		background-color: var(--pui-alert-success-bg);
		border-color: var(--pui-alert-success-border);
		color: var(--pui-color-success-dark, var(--pui-color-success));
	}

	.alert-warning {
		background-color: var(--pui-alert-warning-bg);
		border-color: var(--pui-alert-warning-border);
		color: var(--pui-color-warning-dark, var(--pui-color-warning));
	}

	.alert-danger {
		background-color: var(--pui-alert-danger-bg);
		border-color: var(--pui-alert-danger-border);
		color: var(--pui-color-danger, var(--pui-color-danger));
	}

	:global(.dark) .alert-default {
		background-color: var(--pui-color-dark-200);
		border-color: var(--pui-color-dark-border);
		color: var(--pui-color-gray-100);
	}

	:global(.dark) .alert-info {
		background-color: var(--pui-alert-info-bg);
		border-color: var(--pui-alert-info-border);
		color: var(--pui-color-info);
	}

	:global(.dark) .alert-success {
		background-color: var(--pui-alert-success-bg);
		border-color: var(--pui-alert-success-border);
		color: var(--pui-color-success);
	}

	:global(.dark) .alert-warning {
		background-color: var(--pui-alert-warning-bg);
		border-color: var(--pui-alert-warning-border);
		color: var(--pui-color-warning);
	}

	:global(.dark) .alert-danger {
		background-color: var(--pui-alert-danger-bg);
		border-color: var(--pui-alert-danger-border);
		color: var(--pui-color-danger-light, var(--pui-color-danger));
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
