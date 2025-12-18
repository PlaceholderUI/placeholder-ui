<script lang="ts">
	import type { Snippet } from 'svelte';
	import Icon from '../icon/Icon.svelte';

	interface TimelineItem {
		title: string;
		description?: string;
		date?: string;
		icon?: string;
		color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger' | 'gray';
	}

	interface Props {
		items?: TimelineItem[];
		active?: number;
		bulletSize?: number;
		lineWidth?: number;
		align?: 'left' | 'right';
		reverseActive?: boolean;
		color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger' | 'gray';
		class?: string;
		itemContent?: Snippet<[TimelineItem, number]>;
		children?: Snippet;
	}

	let {
		items = [],
		active = -1,
		bulletSize = 20,
		lineWidth = 2,
		align = 'left',
		reverseActive = false,
		color = 'primary',
		class: classes = '',
		itemContent,
		children
	}: Props = $props();

	function isActive(index: number): boolean {
		if (active < 0) return false;
		return reverseActive ? index >= active : index <= active;
	}

	function getItemColor(item: TimelineItem, index: number): string {
		if (item.color) return item.color;
		return isActive(index) ? color : 'gray';
	}
</script>

<div class="timeline align-{align} {classes}" style="--bullet-size: {bulletSize}px; --line-width: {lineWidth}px;">
	{#if children}
		{@render children()}
	{:else}
		{#each items as item, index (index)}
			{@const itemColor = getItemColor(item, index)}
			{@const itemActive = isActive(index)}
			<div class="timeline-item color-{itemColor}" class:active={itemActive}>
				<div class="timeline-bullet-wrapper">
					<div class="timeline-bullet">
						{#if item.icon}
							<Icon svg={item.icon} size="{bulletSize * 0.6}px" />
						{/if}
					</div>
					{#if index < items.length - 1}
						<div class="timeline-line" class:active={isActive(index + 1)}></div>
					{/if}
				</div>
				<div class="timeline-content">
					{#if itemContent}
						{@render itemContent(item, index)}
					{:else}
						<div class="timeline-header">
							<div class="timeline-title">{item.title}</div>
							{#if item.date}
								<div class="timeline-date">{item.date}</div>
							{/if}
						</div>
						{#if item.description}
							<div class="timeline-description">{item.description}</div>
						{/if}
					{/if}
				</div>
			</div>
		{/each}
	{/if}
</div>

<style>
	.timeline {
		display: flex;
		flex-direction: column;
		position: relative;
	}

	.timeline-item {
		display: flex;
		position: relative;
	}

	.align-right .timeline-item {
		flex-direction: row-reverse;
	}

	.timeline-bullet-wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
		flex-shrink: 0;
	}

	.timeline-bullet {
		width: var(--bullet-size);
		height: var(--bullet-size);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: var(--cui-color-gray-200);
		border: var(--line-width) solid var(--bullet-color, var(--cui-color-gray-400));
		color: var(--bullet-color, var(--cui-color-gray-400));
		z-index: 1;
		transition: all var(--cui-transition-fast) var(--cui-ease-in-out);
	}

	:global(.dark) .timeline-bullet {
		background-color: var(--cui-color-dark-200);
	}

	.timeline-item.active .timeline-bullet {
		background-color: var(--bullet-color, var(--cui-color-primary));
		color: var(--cui-color-white);
	}

	.timeline-line {
		position: absolute;
		top: var(--bullet-size);
		width: var(--line-width);
		height: calc(100% - var(--bullet-size) + var(--cui-spacing-4));
		background-color: var(--cui-color-gray-300);
		transition: background-color var(--cui-transition-fast) var(--cui-ease-in-out);
	}

	:global(.dark) .timeline-line {
		background-color: var(--cui-color-dark-border);
	}

	.timeline-line.active {
		background-color: var(--bullet-color, var(--cui-color-primary));
	}

	.timeline-content {
		flex: 1;
		padding-bottom: var(--cui-spacing-6);
	}

	.align-left .timeline-content {
		padding-left: var(--cui-spacing-4);
	}

	.align-right .timeline-content {
		padding-right: var(--cui-spacing-4);
		text-align: right;
	}

	.timeline-header {
		display: flex;
		align-items: baseline;
		gap: var(--cui-spacing-2);
		flex-wrap: wrap;
	}

	.align-right .timeline-header {
		flex-direction: row-reverse;
	}

	.timeline-title {
		font-weight: var(--cui-font-weight-semibold);
		color: var(--cui-color-gray-900);
		font-size: var(--cui-font-size-base);
	}

	:global(.dark) .timeline-title {
		color: var(--cui-color-gray-100);
	}

	.timeline-date {
		font-size: var(--cui-font-size-xs);
		color: var(--cui-color-gray-500);
	}

	.timeline-description {
		margin-top: var(--cui-spacing-1);
		font-size: var(--cui-font-size-sm);
		color: var(--cui-color-gray-600);
		line-height: var(--cui-line-height-relaxed);
	}

	:global(.dark) .timeline-description {
		color: var(--cui-color-gray-400);
	}

	/* Colors */
	.color-primary {
		--bullet-color: var(--cui-color-primary);
	}
	.color-secondary {
		--bullet-color: var(--cui-color-secondary);
	}
	.color-accent {
		--bullet-color: var(--cui-color-accent);
	}
	.color-success {
		--bullet-color: var(--cui-color-success);
	}
	.color-warning {
		--bullet-color: var(--cui-color-warning);
	}
	.color-danger {
		--bullet-color: var(--cui-color-danger);
	}
	.color-gray {
		--bullet-color: var(--cui-color-gray-400);
	}
</style>
