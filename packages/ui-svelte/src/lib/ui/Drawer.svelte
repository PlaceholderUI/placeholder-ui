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
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 1040;
	}

	.drawer {
		position: fixed;
		top: 0;
		bottom: 0;
		display: flex;
		flex-direction: column;
		width: var(--drawer-width);
		max-width: 100vw;
		background-color: var(--paper-body-bg);
		border-right: 1px solid var(--border-color);
		z-index: 1050;
		overflow: hidden;
	}

	.drawer-left {
		left: 0;
		border-right: 1px solid var(--border-color);
		border-left: none;
	}

	.drawer-right {
		right: 0;
		border-left: 1px solid var(--border-color);
		border-right: none;
	}

	.drawer-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.75rem 1rem;
		border-bottom: 1px solid var(--border-color);
		flex-shrink: 0;
		min-height: 46px;
	}

	.drawer-title {
		margin: 0;
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--text-color);
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
		padding: 0.5rem 0;
	}

	.drawer-bottom {
		flex-shrink: 0;
		border-top: 1px solid var(--border-color);
		padding: 0.5rem 0;
	}

	.drawer-footer {
		padding: 1rem;
		border-top: 1px solid var(--border-color);
		flex-shrink: 0;
	}

	.section-title {
		padding: 0.75rem 1rem 0.5rem;
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--text-muted, #6b7280);
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
		gap: 0.75rem;
		width: 100%;
		padding: 0.625rem 1rem;
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--text-color);
		background: none;
		border: none;
		text-decoration: none;
		cursor: pointer;
		transition: background-color 0.15s ease, color 0.15s ease;
		text-align: left;
	}

	.nav-item :global(.nav-link:hover),
	.nav-item > button.nav-link:hover {
		background-color: rgba(var(--midnight-rgbc), 0.08);
	}

	:global(.dark) .nav-item :global(.nav-link:hover),
	:global(.dark) .nav-item > button.nav-link:hover {
		background-color: rgba(var(--midnight-rgbc), 0.2);
	}

	.nav-item :global(.nav-link.active),
	.nav-item > button.nav-link.active {
		background-color: rgba(var(--pistachio-rgbc), 0.2);
		border-left: 3px solid var(--pistachio);
	}

	:global(.dark) .nav-item :global(.nav-link.active),
	:global(.dark) .nav-item > button.nav-link.active {
		background-color: rgba(var(--midnight-rgbc), 0.3);
		border-left: 3px solid var(--midnight);
	}

	.nav-label {
		flex: 1;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.nav-link :global(.chevron) {
		transition: transform 0.2s ease;
		flex-shrink: 0;
	}

	.nav-link :global(.chevron.expanded) {
		transform: rotate(90deg);
	}

	.sub-nav-list {
		list-style: none;
		margin: 0;
		padding: 0;
		background-color: rgba(var(--midnight-rgbc), 0.03);
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
		gap: 0.5rem;
		width: 100%;
		padding: 0.5rem 1rem 0.5rem 2.75rem;
		font-size: 0.8125rem;
		font-weight: 400;
		color: var(--text-color);
		background: none;
		border: none;
		text-decoration: none;
		cursor: pointer;
		transition: background-color 0.15s ease, color 0.15s ease;
		text-align: left;
	}

	.sub-nav-item :global(.sub-nav-link:hover),
	.sub-nav-item > button.sub-nav-link:hover {
		background-color: rgba(var(--midnight-rgbc), 0.08);
	}

	:global(.dark) .sub-nav-item :global(.sub-nav-link:hover),
	:global(.dark) .sub-nav-item > button.sub-nav-link:hover {
		background-color: rgba(var(--midnight-rgbc), 0.2);
	}

	.sub-nav-item :global(.sub-nav-link.active),
	.sub-nav-item > button.sub-nav-link.active {
		font-weight: 500;
		border-left: 3px solid var(--pistachio);
	}

	:global(.dark) .sub-nav-item :global(.sub-nav-link.active),
	:global(.dark) .sub-nav-item > button.sub-nav-link.active {
		border-left: 3px solid var(--midnight);
	}

	/* Scrollbar styling */
	.drawer-content::-webkit-scrollbar {
		width: 6px;
	}

	.drawer-content::-webkit-scrollbar-track {
		background: transparent;
	}

	.drawer-content::-webkit-scrollbar-thumb {
		background-color: #343434;
		border-radius: 3px;
		border: none;
	}
</style>
