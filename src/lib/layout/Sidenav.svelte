<script lang="ts" module>
	import type { ButtonVariant } from '$lib/ui/ButtonVariant.js';

	export interface SidenavItemAction {
		/** SVG icon to display in the action button */
		iconSvg: string;
		/** Accessible label, also shown as a tooltip on hover */
		label?: string;
		/** Visual style variant for the action button */
		variant?: ButtonVariant;
		/** Click handler; receives the item the action belongs to and the event */
		onclick?: (item: SidenavItem, event: MouseEvent) => void;
	}

	export interface SidenavItem {
		label: string;
		href?: string;
		iconSvg?: string;
		active?: boolean;
		items?: SidenavItem[];
		onclick?: () => void;
		/** Action buttons shown on the right of the item (e.g. edit, delete) */
		actions?: SidenavItemAction[];
	}

	export interface SidenavSection {
		title?: string;
		items: SidenavItem[];
	}
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import Icon from '$lib/icon/Icon.svelte';
	import Textbox from '$lib/form/Textbox.svelte';
	import ActionIcon from '$lib/ui/ActionIcon.svelte';
	import Drawer from '$lib/ui/Drawer.svelte';
	import { iconChevronRight, iconSearch, iconX } from '$lib/icon/index.js';
	import { slide } from 'svelte/transition';
	import { viewportState } from '$lib/theme.svelte.js';
	import Link from '$lib/ui/Link.svelte';

	export interface SidenavProps {
		/** Navigation sections to display */
		sections?: SidenavSection[];
		/** Sections pinned to the bottom of the sidenav */
		bottomSections?: SidenavSection[];
		/** Whether the sidenav is in collapsed (icon-only) mode */
		collapsed?: boolean;
		/** Width of the expanded sidenav */
		width?: string;
		/** Width when collapsed */
		collapsedWidth?: string;
		/** Additional CSS classes */
		class?: string;
		/** Custom header content */
		header?: Snippet;
		/** Custom footer content */
		footer?: Snippet;
		/** Enable search/filter for navigation items */
		searchable?: boolean;
		/** Placeholder text for search input */
		searchPlaceholder?: string;
		/** Callback when a navigation item is clicked */
		onItemClick?: (item: SidenavItem) => void;
		/** When item action buttons are shown: on hover/focus or always visible.
		 * Note: in the mobile drawer they are always visible (touch has no hover). */
		actionsVisible?: 'hover' | 'always';
		/** Enable responsive behavior (drawer on mobile) */
		responsive?: boolean;
		/** Breakpoint (px) below which mobile mode activates */
		mobileBreakpoint?: number;
		/** Whether the mobile drawer is open (bindable) */
		mobileOpen?: boolean;
		/** Title shown in mobile drawer header */
		mobileTitle?: string;
		/** Position of the mobile drawer */
		mobileDrawerPosition?: 'left' | 'right';
	}

	let {
		sections = [],
		bottomSections = [],
		collapsed = false,
		width = '260px',
		collapsedWidth = '60px',
		class: className = '',
		header,
		footer,
		searchable = false,
		searchPlaceholder = 'Search...',
		onItemClick,
		actionsVisible = 'hover',
		// Responsive props
		responsive = false,
		mobileBreakpoint = 768,
		mobileOpen = $bindable(false),
		mobileTitle = '',
		mobileDrawerPosition = 'left'
	}: SidenavProps = $props();

	let searchQuery = $state('');

	// Track if we're in mobile mode using viewportState
	const isMobile = $derived(responsive && viewportState.isBelow(mobileBreakpoint));

	// Auto-close drawer when resizing to desktop
	$effect(() => {
		if (responsive && !viewportState.isBelow(mobileBreakpoint) && mobileOpen) {
			mobileOpen = false;
		}
	});

	// Simple fuzzy search - checks if characters appear in order
	function fuzzyMatch(query: string, text: string): boolean {
		if (!query) return true;
		const lowerQuery = query.toLowerCase();
		const lowerText = text.toLowerCase();

		let queryIndex = 0;
		for (let i = 0; i < lowerText.length && queryIndex < lowerQuery.length; i++) {
			if (lowerText[i] === lowerQuery[queryIndex]) {
				queryIndex++;
			}
		}
		return queryIndex === lowerQuery.length;
	}

	// Filter sections based on search query
	function filterSections(sects: SidenavSection[]): SidenavSection[] {
		if (!searchQuery) return sects;

		return sects
			.map((section) => {
				const filteredItems = section.items
					.filter((item) => {
						// Check if item matches
						if (fuzzyMatch(searchQuery, item.label)) return true;
						// Check if any sub-item matches
						if (item.items?.some((sub) => fuzzyMatch(searchQuery, sub.label))) return true;
						return false;
					})
					.map((item) => {
						// If item has sub-items, filter those too
						if (item.items) {
							return {
								...item,
								items: item.items.filter((sub) => fuzzyMatch(searchQuery, sub.label))
							};
						}
						return item;
					});

				return { ...section, items: filteredItems };
			})
			.filter((section) => section.items.length > 0);
	}

	let filteredSections = $derived(filterSections(sections));
	let filteredBottomSections = $derived(filterSections(bottomSections));

	function clearSearch() {
		searchQuery = '';
	}

	let expandedSections: Set<string> = $state(new Set());

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
			// Close drawer on mobile after navigation
			if (isMobile) {
				mobileOpen = false;
			}
		}
	}

	function handleNavItemClick(item: SidenavItem) {
		onItemClick?.(item);
		item.onclick?.();
		// Close drawer on mobile after navigation
		if (isMobile) {
			mobileOpen = false;
		}
	}

	function handleDrawerItemClick(item: SidenavItem) {
		onItemClick?.(item);
		item.onclick?.();
		// Close drawer after clicking an item
		mobileOpen = false;
	}

	function handleActionClick(action: SidenavItemAction, item: SidenavItem, e: MouseEvent) {
		// Keep the action independent of the item's own navigation/expand behaviour
		e.stopPropagation();
		action.onclick?.(item, e);
	}
</script>

{#snippet itemActions(item: SidenavItem)}
	{#if item.actions && item.actions.length > 0 && !collapsed}
		<span class="nav-actions" class:always={actionsVisible === 'always'}>
			{#each item.actions as action}
				<ActionIcon
					svg={action.iconSvg}
					size="0.875rem"
					variant={action.variant ?? 'secondary-subtle'}
					tooltip={action.label}
					onclick={(e) => handleActionClick(action, item, e)}
				/>
			{/each}
		</span>
	{/if}
{/snippet}

{#snippet sectionList(sects: SidenavSection[])}
	{#each sects as section}
		{#if section.title && !collapsed}
			<div class="section-title">{section.title}</div>
		{/if}
		<ul class="nav-list">
			{#each section.items as item}
				<li class="nav-item">
					<div class="nav-item-row" class:active={item.active}>
						{#if item.href && !(item.items && item.items.length > 0)}
							<Link
								href={item.href}
								class="nav-link {item.active ? 'active' : ''}"
								onclick={() => handleNavItemClick(item)}
							>
								{#if item.iconSvg}
									<Icon svg={item.iconSvg} size="1.25em" />
								{/if}
								{#if !collapsed}
									<span class="nav-label">{item.label}</span>
								{/if}
							</Link>
						{:else}
							<button
								type="button"
								class="nav-link"
								class:active={item.active}
								class:has-children={item.items && item.items.length > 0}
								title={collapsed ? item.label : undefined}
								onclick={(e) => handleItemClick(item, e)}
							>
								{#if item.iconSvg}
									<Icon svg={item.iconSvg} size="1.25em" />
								{/if}
								{#if !collapsed}
									<span class="nav-label">{item.label}</span>
									{#if item.items && item.items.length > 0}
										<Icon
											svg={iconChevronRight}
											size="0.75em"
											class="chevron {isExpanded(item.label) ? 'expanded' : ''}"
										/>
									{/if}
								{/if}
							</button>
						{/if}
						{@render itemActions(item)}
					</div>
					{#if item.items && item.items.length > 0 && isExpanded(item.label) && !collapsed}
						<ul class="sub-nav-list" transition:slide={{ duration: 200 }}>
							{#each item.items as subItem}
								<li class="sub-nav-item">
									<div class="nav-item-row" class:active={subItem.active}>
										{#if subItem.href}
											<Link
												href={subItem.href}
												class="sub-nav-link {subItem.active ? 'active' : ''}"
												onclick={() => handleNavItemClick(subItem)}
											>
												{#if subItem.iconSvg}
													<Icon svg={subItem.iconSvg} size="1em" />
												{/if}
												<span class="nav-label">{subItem.label}</span>
											</Link>
										{:else}
											<button
												type="button"
												class="sub-nav-link"
												class:active={subItem.active}
												onclick={() => handleNavItemClick(subItem)}
											>
												{#if subItem.iconSvg}
													<Icon svg={subItem.iconSvg} size="1em" />
												{/if}
												<span class="nav-label">{subItem.label}</span>
											</button>
										{/if}
										{@render itemActions(subItem)}
									</div>
								</li>
							{/each}
						</ul>
					{/if}
				</li>
			{/each}
		</ul>
	{/each}
{/snippet}

{#if !isMobile}
	<!-- Desktop: Regular Sidenav -->
	<aside
		class="sidenav {className}"
		class:collapsed
		style="--sidenav-width: {width}; --sidenav-collapsed-width: {collapsedWidth};"
	>
		{#if header}
			<div class="sidenav-header">
				{@render header()}
			</div>
		{/if}

		{#if searchable && !collapsed}
			<div class="sidenav-search">
				<Textbox
					placeholder={searchPlaceholder}
					leftIconSvg={iconSearch}
					bind:value={searchQuery}
					containerClass="search-textbox"
				>
					{#snippet right()}
						{#if searchQuery}
							<ActionIcon
								svg={iconX}
								size="0.75rem"
								variant="secondary-subtle"
								onclick={clearSearch}
								class="search-clear-btn"
							/>
						{/if}
					{/snippet}
				</Textbox>
			</div>
		{/if}

		<nav class="sidenav-content">
			{@render sectionList(filteredSections)}
		</nav>

		{#if filteredBottomSections.length > 0}
			<nav class="sidenav-bottom">
				{@render sectionList(filteredBottomSections)}
			</nav>
		{/if}

		{#if footer}
			<div class="sidenav-footer">
				{@render footer()}
			</div>
		{/if}
	</aside>
{/if}

{#if isMobile}
	<!-- Mobile: Drawer -->
	<Drawer
		bind:open={mobileOpen}
		title={mobileTitle}
		position={mobileDrawerPosition}
		{sections}
		{bottomSections}
		{width}
		actionsVisible="always"
		onItemClick={handleDrawerItemClick}
	>
		{#snippet header()}
			{#if header}
				{@render header()}
			{/if}
		{/snippet}
		{#snippet footer()}
			{#if footer}
				{@render footer()}
			{/if}
		{/snippet}
	</Drawer>
{/if}

<style>
	.sidenav {
		display: flex;
		flex-direction: column;
		width: var(--sidenav-width);
		min-width: var(--sidenav-width);
		background-color: var(--paper-body-bg);
		border-right: 1px solid var(--border-color);
		transition:
			width 0.2s ease,
			min-width 0.2s ease;
		overflow: hidden;
		height: var(--page-content-height);
	}

	.sidenav.collapsed {
		width: var(--sidenav-collapsed-width);
		min-width: var(--sidenav-collapsed-width);
	}

	.sidenav-header {
		padding: 1rem;
		border-bottom: 1px solid var(--border-color);
		flex-shrink: 0;
	}

	.sidenav-search {
		padding: 0.5rem 0.75rem;
		border-bottom: 1px solid var(--border-color);
		flex-shrink: 0;
	}

	.sidenav-search :global(.search-textbox) {
		margin: 0;
	}

	.sidenav-search :global(.search-clear-btn) {
		position: absolute;
		right: 0.25rem;
		top: 50%;
		transform: translateY(-50%);
	}

	.sidenav-content {
		flex: 1;
		overflow-y: auto;
		overflow-x: hidden;
	}

	.sidenav-bottom {
		flex-shrink: 0;
		border-top: 1px solid var(--border-color);
		padding: 0.5rem 0;
	}

	.sidenav-footer {
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
		border-top: 1px solid var(--border-color);
		border-bottom: 1px solid var(--border-color);
	}

	.section-title:first-child {
		border-top: none;
	}

	.nav-list {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.nav-item {
		margin: 0;
	}

	/* Row wraps the nav link/button together with its action buttons. The row (not the
	   link) carries the hover/active background so it spans the full width, including the
	   action-button area. */
	.nav-item-row {
		display: flex;
		align-items: center;
		transition: background-color 0.15s ease;
	}

	.nav-item-row :global(.nav-link),
	.nav-item-row button.nav-link,
	.nav-item-row :global(.sub-nav-link),
	.nav-item-row button.sub-nav-link {
		flex: 1;
		min-width: 0;
	}

	.nav-item :global(.nav-link),
	.nav-item button.nav-link {
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
		transition: color 0.15s ease;
		text-align: left;
	}

	.collapsed .nav-item :global(.nav-link),
	.collapsed .nav-item button.nav-link {
		justify-content: center;
		padding: 0.75rem;
	}

	.nav-item > .nav-item-row:hover {
		background-color: rgba(var(--ui-primary-rgbc), 0.08);
	}

	:global(.dark) .nav-item > .nav-item-row:hover {
		background-color: rgba(var(--ui-primary-rgbc), 0.2);
	}

	.nav-item > .nav-item-row.active {
		background-color: rgba(var(--ui-accent-rgbc), 0.2);
		border-left: 3px solid var(--ui-accent);
	}

	:global(.dark) .nav-item > .nav-item-row.active {
		background-color: rgba(var(--ui-primary-rgbc), 0.3);
		border-left: 3px solid var(--ui-primary);
	}

	.nav-label {
		flex: 1;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	/* Action buttons: revealed on hover/focus by default, or always when opted in */
	.nav-actions {
		display: flex;
		align-items: center;
		gap: 0.125rem;
		flex-shrink: 0;
		padding-right: 0.5rem;
		opacity: 0;
		pointer-events: none;
		transition: opacity 0.15s ease;
	}

	.nav-actions.always,
	.nav-item-row:hover .nav-actions,
	.nav-item-row:focus-within .nav-actions {
		opacity: 1;
		pointer-events: auto;
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
		background-color: rgba(var(--ui-primary-rgbc), 0.03);
	}

	:global(.dark) .sub-nav-list {
		background-color: rgba(0, 0, 0, 0.2);
	}

	.sub-nav-item {
		margin: 0;
	}

	.sub-nav-item :global(.sub-nav-link),
	.sub-nav-item button.sub-nav-link {
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
		transition: color 0.15s ease;
		text-align: left;
	}

	.sub-nav-item > .nav-item-row:hover {
		background-color: rgba(var(--ui-primary-rgbc), 0.08);
	}

	:global(.dark) .sub-nav-item > .nav-item-row:hover {
		background-color: rgba(var(--ui-primary-rgbc), 0.2);
	}

	.sub-nav-item > .nav-item-row.active {
		border-left: 3px solid var(--ui-accent);
	}

	:global(.dark) .sub-nav-item > .nav-item-row.active {
		border-left: 3px solid var(--ui-primary);
	}

	.sub-nav-item > .nav-item-row.active :global(.sub-nav-link),
	.sub-nav-item > .nav-item-row.active button.sub-nav-link {
		font-weight: 500;
	}

	/* Scrollbar styling */
	.sidenav-content::-webkit-scrollbar {
		width: 6px;
	}

	.sidenav-content::-webkit-scrollbar-track {
		background: transparent;
	}

	.sidenav-content::-webkit-scrollbar-thumb {
		background-color: #343434;
		border-radius: 3px;
		border: none;
	}
</style>
