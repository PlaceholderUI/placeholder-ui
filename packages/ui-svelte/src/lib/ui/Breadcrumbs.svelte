<script lang="ts">
	import type { Snippet } from 'svelte';
	import Icon from '../icon/Icon.svelte';
	import { iconChevronRight } from '../icon/index.js';

	interface BreadcrumbItem {
		label: string;
		href?: string;
		icon?: string;
	}

	interface Props {
		items?: BreadcrumbItem[];
		separator?: string | Snippet;
		separatorMargin?: string;
		class?: string;
		children?: Snippet;
	}

	let {
		items = [],
		separator = undefined,
		separatorMargin = '0.5rem',
		class: classes = '',
		children
	}: Props = $props();
</script>

<nav aria-label="Breadcrumb" class="breadcrumbs {classes}">
	<ol class="breadcrumb-list">
		{#if children}
			{@render children()}
		{:else}
			{#each items as item, index (index)}
				{#if index > 0}
					<li class="breadcrumb-separator" style="margin: 0 {separatorMargin};" aria-hidden="true">
						{#if typeof separator === 'function'}
							{@render separator()}
						{:else if separator}
							{separator}
						{:else}
							<Icon svg={iconChevronRight} size="14px" />
						{/if}
					</li>
				{/if}
				<li class="breadcrumb-item">
					{#if item.href && index < items.length - 1}
						<a href={item.href} class="breadcrumb-link">
							{#if item.icon}
								<Icon svg={item.icon} size="16px" />
							{/if}
							<span>{item.label}</span>
						</a>
					{:else}
						<span class="breadcrumb-current" aria-current={index === items.length - 1 ? 'page' : undefined}>
							{#if item.icon}
								<Icon svg={item.icon} size="16px" />
							{/if}
							<span>{item.label}</span>
						</span>
					{/if}
				</li>
			{/each}
		{/if}
	</ol>
</nav>

<style>
	.breadcrumbs {
		width: 100%;
	}

	.breadcrumb-list {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		list-style: none;
		margin: 0;
		padding: 0;
		font-size: var(--cui-font-size-sm);
	}

	.breadcrumb-item {
		display: flex;
		align-items: center;
	}

	.breadcrumb-link {
		display: flex;
		align-items: center;
		gap: var(--cui-spacing-1);
		color: var(--cui-color-gray-600);
		text-decoration: none;
		transition: color var(--cui-transition-fast) var(--cui-ease-in-out);
	}

	:global(.dark) .breadcrumb-link {
		color: var(--cui-color-gray-400);
	}

	.breadcrumb-link:hover {
		color: var(--cui-color-primary);
		text-decoration: underline;
	}

	:global(.dark) .breadcrumb-link:hover {
		color: var(--cui-color-secondary);
	}

	.breadcrumb-current {
		display: flex;
		align-items: center;
		gap: var(--cui-spacing-1);
		color: var(--cui-color-gray-900);
		font-weight: var(--cui-font-weight-medium);
	}

	:global(.dark) .breadcrumb-current {
		color: var(--cui-color-gray-100);
	}

	.breadcrumb-separator {
		display: flex;
		align-items: center;
		color: var(--cui-color-gray-400);
	}

	:global(.dark) .breadcrumb-separator {
		color: var(--cui-color-gray-600);
	}
</style>
