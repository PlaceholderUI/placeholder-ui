<script lang="ts">
	import type { Snippet } from 'svelte';
	import Icon from '../icon/Icon.svelte';
	import { iconCheck } from '../icon/index.js';

	interface StepItem {
		label: string;
		description?: string;
		icon?: string;
	}

	interface Props {
		active?: number;
		steps?: StepItem[];
		orientation?: 'horizontal' | 'vertical';
		size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
		color?: 'primary' | 'secondary' | 'accent' | 'success';
		iconSize?: number;
		allowStepClick?: boolean;
		allowStepSelect?: boolean;
		completedIcon?: string;
		class?: string;
		onStepClick?: (step: number) => void;
		stepContent?: Snippet<[number, StepItem]>;
		children?: Snippet;
	}

	let {
		active = $bindable(0),
		steps = [],
		orientation = 'horizontal',
		size = 'md',
		color = 'primary',
		iconSize = 24,
		allowStepClick = false,
		allowStepSelect = true,
		completedIcon = undefined,
		class: classes = '',
		onStepClick,
		stepContent,
		children
	}: Props = $props();

	function handleStepClick(index: number) {
		if (!allowStepClick && !allowStepSelect) return;
		if (allowStepSelect && index <= active) {
			active = index;
			onStepClick?.(index);
		} else if (allowStepClick) {
			active = index;
			onStepClick?.(index);
		}
	}

	function getStepState(index: number): 'completed' | 'active' | 'pending' {
		if (index < active) return 'completed';
		if (index === active) return 'active';
		return 'pending';
	}
</script>

<div class="stepper orientation-{orientation} size-{size} color-{color} {classes}">
	{#each steps as step, index (index)}
		{@const state = getStepState(index)}
		<div class="step {state}" class:clickable={allowStepClick || (allowStepSelect && index <= active)}>
			<button
				type="button"
				class="step-button"
				disabled={!allowStepClick && (!allowStepSelect || index > active)}
				onclick={() => handleStepClick(index)}
				aria-current={state === 'active' ? 'step' : undefined}
			>
				<div class="step-icon-wrapper">
					<div class="step-icon">
						{#if state === 'completed'}
							{#if completedIcon}
								<Icon svg={completedIcon} size="{iconSize * 0.6}px" />
							{:else}
								<Icon svg={iconCheck} size="{iconSize * 0.6}px" />
							{/if}
						{:else if step.icon}
							<Icon svg={step.icon} size="{iconSize * 0.6}px" />
						{:else}
							<span class="step-number">{index + 1}</span>
						{/if}
					</div>
				</div>
				<div class="step-content">
					<div class="step-label">{step.label}</div>
					{#if step.description}
						<div class="step-description">{step.description}</div>
					{/if}
				</div>
			</button>
			{#if index < steps.length - 1}
				<div class="step-separator" class:completed={index < active}></div>
			{/if}
		</div>
	{/each}
	{#if children}
		<div class="step-panel">
			{@render children()}
		</div>
	{/if}
</div>

<style>
	.stepper {
		display: flex;
		width: 100%;
	}

	/* Orientation */
	.orientation-horizontal {
		flex-direction: row;
		align-items: flex-start;
	}

	.orientation-vertical {
		flex-direction: column;
	}

	.step {
		display: flex;
		position: relative;
	}

	.orientation-horizontal .step {
		flex: 1;
		flex-direction: column;
		align-items: center;
	}

	.orientation-vertical .step {
		flex-direction: row;
		align-items: flex-start;
		padding-bottom: var(--pui-spacing-6);
	}

	.step-button {
		display: flex;
		background: none;
		border: none;
		cursor: default;
		padding: 0;
		text-align: center;
	}

	.step.clickable .step-button {
		cursor: pointer;
	}

	.orientation-horizontal .step-button {
		flex-direction: column;
		align-items: center;
	}

	.orientation-vertical .step-button {
		flex-direction: row;
		align-items: flex-start;
		gap: var(--pui-spacing-3);
		text-align: left;
	}

	.step-icon-wrapper {
		position: relative;
		z-index: 1;
	}

	.step-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		background-color: var(--pui-color-gray-200);
		color: var(--pui-color-gray-600);
		transition: all var(--pui-transition-fast) var(--pui-ease-in-out);
	}

	:global(.dark) .step-icon {
		background-color: var(--pui-color-dark-border);
		color: var(--pui-color-gray-400);
	}

	.step.active .step-icon {
		background-color: var(--step-color, var(--pui-color-primary));
		color: var(--pui-color-white);
	}

	.step.completed .step-icon {
		background-color: var(--step-color, var(--pui-color-primary));
		color: var(--pui-color-white);
	}

	/* Sizes */
	.size-xs .step-icon {
		width: 24px;
		height: 24px;
		font-size: var(--pui-font-size-xs);
	}
	.size-sm .step-icon {
		width: 32px;
		height: 32px;
		font-size: var(--pui-font-size-sm);
	}
	.size-md .step-icon {
		width: 40px;
		height: 40px;
		font-size: var(--pui-font-size-base);
	}
	.size-lg .step-icon {
		width: 48px;
		height: 48px;
		font-size: var(--pui-font-size-md);
	}
	.size-xl .step-icon {
		width: 56px;
		height: 56px;
		font-size: var(--pui-font-size-lg);
	}

	/* Colors */
	.color-primary {
		--step-color: var(--pui-color-primary);
	}
	.color-secondary {
		--step-color: var(--pui-color-secondary);
	}
	.color-accent {
		--step-color: var(--pui-color-accent);
	}
	.color-success {
		--step-color: var(--pui-color-success);
	}

	.step-number {
		font-weight: var(--pui-font-weight-semibold);
	}

	.step-content {
		margin-top: var(--pui-spacing-2);
	}

	.orientation-vertical .step-content {
		margin-top: 0;
		padding-top: var(--pui-spacing-1);
	}

	.step-label {
		font-weight: var(--pui-font-weight-medium);
		color: var(--pui-color-gray-600);
		font-size: var(--pui-font-size-sm);
	}

	:global(.dark) .step-label {
		color: var(--pui-color-gray-400);
	}

	.step.active .step-label,
	.step.completed .step-label {
		color: var(--pui-color-gray-900);
	}

	:global(.dark) .step.active .step-label,
	:global(.dark) .step.completed .step-label {
		color: var(--pui-color-gray-100);
	}

	.step-description {
		font-size: var(--pui-font-size-xs);
		color: var(--pui-color-gray-500);
		margin-top: var(--pui-spacing-0_5);
	}

	:global(.dark) .step-description {
		color: var(--pui-color-gray-500);
	}

	/* Separator */
	.step-separator {
		background-color: var(--pui-color-gray-300);
		transition: background-color var(--pui-transition-fast) var(--pui-ease-in-out);
	}

	:global(.dark) .step-separator {
		background-color: var(--pui-color-dark-border);
	}

	.step-separator.completed {
		background-color: var(--step-color, var(--pui-color-primary));
	}

	.orientation-horizontal .step-separator {
		position: absolute;
		top: 20px;
		left: calc(50% + 24px);
		right: calc(-50% + 24px);
		height: 2px;
	}

	.size-xs.orientation-horizontal .step-separator {
		top: 12px;
		left: calc(50% + 16px);
		right: calc(-50% + 16px);
	}
	.size-sm.orientation-horizontal .step-separator {
		top: 16px;
		left: calc(50% + 20px);
		right: calc(-50% + 20px);
	}
	.size-lg.orientation-horizontal .step-separator {
		top: 24px;
		left: calc(50% + 28px);
		right: calc(-50% + 28px);
	}
	.size-xl.orientation-horizontal .step-separator {
		top: 28px;
		left: calc(50% + 32px);
		right: calc(-50% + 32px);
	}

	.orientation-vertical .step-separator {
		position: absolute;
		left: 19px;
		top: 44px;
		bottom: 4px;
		width: 2px;
	}

	.size-xs.orientation-vertical .step-separator {
		left: 11px;
		top: 28px;
	}
	.size-sm.orientation-vertical .step-separator {
		left: 15px;
		top: 36px;
	}
	.size-lg.orientation-vertical .step-separator {
		left: 23px;
		top: 52px;
	}
	.size-xl.orientation-vertical .step-separator {
		left: 27px;
		top: 60px;
	}

	.step-panel {
		margin-top: var(--pui-spacing-6);
	}

	.orientation-vertical .step-panel {
		margin-top: 0;
		margin-left: var(--pui-spacing-6);
	}
</style>
