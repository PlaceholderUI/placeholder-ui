<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { SidenavItem, SidenavSection } from '../layout/Sidenav.svelte';
	import Icon from '../icon/Icon.svelte';
	import Link from './Link.svelte';
	import ActionIcon from './ActionIcon.svelte';
	import { iconChevronRight, iconX } from '../icon/index.js';
	import { fade, fly } from 'svelte/transition';
	import { slide } from 'svelte/transition';

	interface Props {
		open?: boolean;
		position?: 'left' | 'right';
		width?: string;
		closeOnClickOutside?: boolean;
		closeOnEscape?: boolean;
		closeForLargeScreens?: boolean;
		largeScreenBreakpoint?: number;
		sections?: SidenavSection[];
		bottomSections?: SidenavSection[];
		title?: string;
		class?: string;
		header?: Snippet;
		footer?: Snippet;
		children?: Snippet;
		onclose?: () => void;
		onItemClick?: (item: SidenavItem) => void;
	}

	let {
		open = $bindable(false),
		position = 'left',
		width = '320px',
		closeOnClickOutside = true,
		closeOnEscape = true,
		closeForLargeScreens = false,
		largeScreenBreakpoint = 1024,
		sections = [],
		bottomSections = [],
		title = '',
		class: className = '',
		header,
		footer,
		children,
		onclose,
		onItemClick
	}: Props = $props();

	let expandedSections: Set<string> = $state(new Set());

	function close() {
		open = false;
		onclose?.();
	}

	function handleBackdropClick() {
		if (closeOnClickOutside) {
			close();
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (open && closeOnEscape && e.key === 'Escape') {
			close();
		}
	}

	function handleWindowResize() {
		if (closeForLargeScreens && typeof window !== 'undefined' && window.innerWidth > largeScreenBreakpoint) {
			close();
		}
	}

	function toggleSection(itemLabel: string) {
		if (expandedSections.has(itemLabel)) {
			expandedSections.delete(itemLabel);
			expandedSections = new Set(expandedSections);
		} else {
			expandedSections.add(itemLabel);
			expandedSections = new Set(expandedSections);
		}
	}

	function isExpanded(itemLabel: string): boolean {
		return expandedSections.has(itemLabel);
	}

	function handleItemClick(item: SidenavItem, e: MouseEvent) {
		if (item.items && item.items.length > 0) {
			e.preventDefault();
			toggleSection(item.label);
		} else {
			onItemClick?.(item);
			item.onclick?.();
		}
	}

	function handleLinkClick(item: SidenavItem) {
		onItemClick?.(item);
		item.onclick?.();
	}

	// Body scroll lock
	$effect(() => {
		if (typeof document !== 'undefined') {
			const body = document.body;
			if (open) {
				body.style.overflow = 'hidden';
			} else {
				body.style.overflow = '';
			}
			return () => {
				body.style.overflow = '';
			};
		}
	});

	const hasNavContent = $derived(sections.length > 0 || bottomSections.length > 0);
	const flyDirection = $derived(position === 'left' ? -320 : 320);
</script>

<svelte:window onresize={handleWindowResize} onkeydown={handleKeydown} />

{#if open}
	<!-- Backdrop -->
	<div
		class="drawer-backdrop"
		transition:fade={{ duration: 200 }}
		onclick={handleBackdropClick}
		onkeydown={(e) => e.key === 'Enter' && handleBackdropClick()}
		role="button"
		tabindex="-1"
		aria-label="Close drawer"
	></div>

	<!-- Drawer -->
	<div
		class="drawer {className}"
		class:drawer-left={position === 'left'}
		class:drawer-right={position === 'right'}
		style="--drawer-width: {width};"
		transition:fly={{ x: flyDirection, duration: 250, opacity: 1 }}
		onclick={(e) => e.stopPropagation()}
		onkeydown={(e) => e.stopPropagation()}
		role="dialog"
		aria-modal="true"
		tabindex="-1"
	>
		<!-- Header (always shown for close button) -->
		<div class="drawer-header">
			{#if header}
				{@render header()}
			{:else if title}
				<h2 class="drawer-title">{title}</h2>
			{/if}
			<ActionIcon
				svg={iconX}
				size="1.25rem"
				variant="secondary-subtle"
				onclick={close}
				class="drawer-close-btn"
			/>
		</div>

		<!-- Main content area -->
		<div class="drawer-content">
			{#if hasNavContent}
				<!-- Navigation sections -->
				<nav class="drawer-nav">
					{#each sections as section}
						{#if section.title}
							<div class="section-title">{section.title}</div>
						{/if}
						<ul class="nav-list">
							{#each section.items as item}
								<li class="nav-item">
									{#if item.href && !(item.items && item.items.length > 0)}
										<Link
											href={item.href}
											class="nav-link {item.active ? 'active' : ''}"
											onclick={() => handleLinkClick(item)}
										>
											{#if item.iconSvg}
												<Icon svg={item.iconSvg} size="1.25em" />
											{/if}
											<span class="nav-label">{item.label}</span>
										</Link>
									{:else}
										<button
											type="button"
											class="nav-link"
											class:active={item.active}
											class:has-children={item.items && item.items.length > 0}
											onclick={(e) => handleItemClick(item, e)}
										>
											{#if item.iconSvg}
												<Icon svg={item.iconSvg} size="1.25em" />
											{/if}
											<span class="nav-label">{item.label}</span>
											{#if item.items && item.items.length > 0}
												<Icon
													svg={iconChevronRight}
													size="0.75em"
													class="chevron {isExpanded(item.label) ? 'expanded' : ''}"
												/>
											{/if}
										</button>
										{#if item.items && item.items.length > 0 && isExpanded(item.label)}
											<ul class="sub-nav-list" transition:slide={{ duration: 200 }}>
												{#each item.items as subItem}
													<li class="sub-nav-item">
														{#if subItem.href}
															<Link
																href={subItem.href}
																class="sub-nav-link {subItem.active ? 'active' : ''}"
																onclick={() => handleLinkClick(subItem)}
															>
																{#if subItem.iconSvg}
																	<Icon svg={subItem.iconSvg} size="1em" />
																{/if}
																<span>{subItem.label}</span>
															</Link>
														{:else}
															<button
																type="button"
																class="sub-nav-link"
																class:active={subItem.active}
																onclick={() => handleLinkClick(subItem)}
															>
																{#if subItem.iconSvg}
																	<Icon svg={subItem.iconSvg} size="1em" />
																{/if}
																<span>{subItem.label}</span>
															</button>
														{/if}
													</li>
												{/each}
											</ul>
										{/if}
									{/if}
								</li>
							{/each}
						</ul>
					{/each}
				</nav>
			{:else if children}
				{@render children()}
			{/if}
		</div>

		<!-- Bottom sections -->
		{#if bottomSections.length > 0}
			<nav class="drawer-bottom">
				{#each bottomSections as section}
					{#if section.title}
						<div class="section-title">{section.title}</div>
					{/if}
					<ul class="nav-list">
						{#each section.items as item}
							<li class="nav-item">
								{#if item.href}
									<Link
										href={item.href}
										class="nav-link {item.active ? 'active' : ''}"
										onclick={() => handleLinkClick(item)}
									>
										{#if item.iconSvg}
											<Icon svg={item.iconSvg} size="1.25em" />
										{/if}
										<span class="nav-label">{item.label}</span>
									</Link>
								{:else}
									<button
										type="button"
										class="nav-link"
										class:active={item.active}
										onclick={() => handleLinkClick(item)}
									>
										{#if item.iconSvg}
											<Icon svg={item.iconSvg} size="1.25em" />
										{/if}
										<span class="nav-label">{item.label}</span>
									</button>
								{/if}
							</li>
						{/each}
					</ul>
				{/each}
			</nav>
		{/if}

		<!-- Footer -->
		{#if footer}
			<div class="drawer-footer">
				{@render footer()}
			</div>
		{/if}
	</div>
{/if}

<style>
	.drawer-backdrop {
		position: fixed;
		inset: 0;
		background-color: var(--pui-bg-overlay);
		z-index: var(--pui-z-modal-backdrop);
	}

	.drawer {
		position: fixed;
		top: 0;
		bottom: 0;
		display: flex;
		flex-direction: column;
		width: var(--drawer-width);
		max-width: 100vw;
		background-color: var(--pui-paper-body-bg);
		border-right: 1px solid var(--pui-border-default);
		z-index: var(--pui-z-modal);
		overflow: hidden;
	}

	.drawer-left {
		left: 0;
		border-right: 1px solid var(--pui-border-default);
		border-left: none;
	}

	.drawer-right {
		right: 0;
		border-left: 1px solid var(--pui-border-default);
		border-right: none;
	}

	.drawer-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--pui-spacing-4);
		padding: var(--pui-spacing-3) var(--pui-spacing-4);
		border-bottom: 1px solid var(--pui-border-default);
		flex-shrink: 0;
		min-height: 46px;
	}

	.drawer-title {
		margin: 0;
		font-size: var(--pui-font-size-lg);
		font-weight: var(--pui-font-weight-semibold);
		color: var(--pui-text-primary);
		flex: 1;
	}

	.drawer-header :global(.drawer-close-btn) {
		flex-shrink: 0;
		margin-left: auto;
	}

	.drawer-content {
		flex: 1;
		overflow-y: auto;
		overflow-x: hidden;
	}

	.drawer-nav {
		padding: var(--pui-spacing-2) 0;
	}

	.drawer-bottom {
		flex-shrink: 0;
		border-top: 1px solid var(--pui-border-default);
		padding: var(--pui-spacing-2) 0;
	}

	.drawer-footer {
		padding: var(--pui-spacing-4);
		border-top: 1px solid var(--pui-border-default);
		flex-shrink: 0;
	}

	.section-title {
		padding: var(--pui-spacing-3) var(--pui-spacing-4) var(--pui-spacing-2);
		font-size: var(--pui-font-size-xs);
		font-weight: var(--pui-font-weight-semibold);
		text-transform: uppercase;
		letter-spacing: var(--pui-letter-spacing-wide);
		color: var(--pui-text-muted);
	}

	.nav-list {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.nav-item {
		margin: 0;
	}

	.nav-item :global(.nav-link),
	.nav-item > button.nav-link {
		display: flex;
		align-items: center;
		gap: var(--pui-spacing-3);
		width: 100%;
		padding: var(--pui-spacing-2_5) var(--pui-spacing-4);
		font-size: var(--pui-font-size-base);
		font-weight: var(--pui-font-weight-medium);
		color: var(--pui-text-primary);
		background: none;
		border: none;
		text-decoration: none;
		cursor: pointer;
		transition: background-color var(--pui-transition-fast) var(--pui-ease-out), color var(--pui-transition-fast) var(--pui-ease-out);
		text-align: left;
	}

	.nav-item :global(.nav-link:hover),
	.nav-item > button.nav-link:hover {
		background-color: var(--pui-bg-hover);
	}

	:global(.dark) .nav-item :global(.nav-link:hover),
	:global(.dark) .nav-item > button.nav-link:hover {
		background-color: var(--pui-bg-hover);
	}

	.nav-item :global(.nav-link.active),
	.nav-item > button.nav-link.active {
		background-color: rgba(var(--pui-color-secondary-rgb), 0.2);
		border-left: 3px solid var(--pui-color-secondary);
	}

	:global(.dark) .nav-item :global(.nav-link.active),
	:global(.dark) .nav-item > button.nav-link.active {
		background-color: rgba(var(--pui-color-primary-rgb), 0.3);
		border-left: 3px solid var(--pui-color-primary);
	}

	.nav-label {
		flex: 1;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.nav-link :global(.chevron) {
		transition: transform var(--pui-transition-fast) var(--pui-ease-out);
		flex-shrink: 0;
	}

	.nav-link :global(.chevron.expanded) {
		transform: rotate(90deg);
	}

	.sub-nav-list {
		list-style: none;
		margin: 0;
		padding: 0;
		background-color: var(--pui-bg-hover);
	}

	:global(.dark) .sub-nav-list {
		background-color: rgba(0, 0, 0, 0.2);
	}

	.sub-nav-item {
		margin: 0;
	}

	.sub-nav-item :global(.sub-nav-link),
	.sub-nav-item > button.sub-nav-link {
		display: flex;
		align-items: center;
		gap: var(--pui-spacing-2);
		width: 100%;
		padding: var(--pui-spacing-2) var(--pui-spacing-4) var(--pui-spacing-2) var(--pui-spacing-11);
		font-size: var(--pui-font-size-sm);
		font-weight: var(--pui-font-weight-normal);
		color: var(--pui-text-primary);
		background: none;
		border: none;
		text-decoration: none;
		cursor: pointer;
		transition: background-color var(--pui-transition-fast) var(--pui-ease-out), color var(--pui-transition-fast) var(--pui-ease-out);
		text-align: left;
	}

	.sub-nav-item :global(.sub-nav-link:hover),
	.sub-nav-item > button.sub-nav-link:hover {
		background-color: var(--pui-bg-active);
	}

	:global(.dark) .sub-nav-item :global(.sub-nav-link:hover),
	:global(.dark) .sub-nav-item > button.sub-nav-link:hover {
		background-color: var(--pui-bg-active);
	}

	.sub-nav-item :global(.sub-nav-link.active),
	.sub-nav-item > button.sub-nav-link.active {
		font-weight: var(--pui-font-weight-medium);
		border-left: 3px solid var(--pui-color-secondary);
	}

	:global(.dark) .sub-nav-item :global(.sub-nav-link.active),
	:global(.dark) .sub-nav-item > button.sub-nav-link.active {
		border-left: 3px solid var(--pui-color-primary);
	}

	/* Scrollbar styling */
	.drawer-content::-webkit-scrollbar {
		width: 6px;
	}

	.drawer-content::-webkit-scrollbar-track {
		background: transparent;
	}

	.drawer-content::-webkit-scrollbar-thumb {
		background-color: var(--pui-color-gray-700);
		border-radius: var(--pui-radius-sm);
		border: none;
	}
</style>
