<script lang="ts" module>
	export interface SidenavItem {
		label: string;
		href?: string;
		iconSvg?: string;
		active?: boolean;
		items?: SidenavItem[];
		onclick?: () => void;
	}

	export interface SidenavSection {
		title?: string;
		items: SidenavItem[];
	}
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import Icon from '../icon/Icon.svelte';
	import Textbox from '../form/Textbox.svelte';
	import ActionIcon from '../ui/ActionIcon.svelte';
	import Drawer from '../ui/Drawer.svelte';
	import { iconChevronRight, iconSearch, iconX } from '../icon/index.js';
	import { slide } from 'svelte/transition';
	import { viewportState } from '../theme.svelte.js';

	interface Props {
		sections?: SidenavSection[];
		bottomSections?: SidenavSection[];
		collapsed?: boolean;
		width?: string;
		collapsedWidth?: string;
		class?: string;
		header?: Snippet;
		footer?: Snippet;
		searchable?: boolean;
		searchPlaceholder?: string;
		onItemClick?: (item: SidenavItem) => void;
		// Responsive props
		responsive?: boolean;
		mobileBreakpoint?: number;
		mobileOpen?: boolean;
		mobileTitle?: string;
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
		// Responsive props
		responsive = false,
		mobileBreakpoint = 768,
		mobileOpen = $bindable(false),
		mobileTitle = '',
		mobileDrawerPosition = 'left'
	}: Props = $props();

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
				const filteredItems = section.items.filter((item) => {
					// Check if item matches
					if (fuzzyMatch(searchQuery, item.label)) return true;
					// Check if any sub-item matches
					if (item.items?.some((sub) => fuzzyMatch(searchQuery, sub.label))) return true;
					return false;
				}).map((item) => {
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

	function handleLinkClick(item: SidenavItem) {
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
</script>

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
			{#each filteredSections as section}
				{#if section.title && !collapsed}
					<div class="section-title">{section.title}</div>
				{/if}
				<ul class="nav-list">
					{#each section.items as item}
						<li class="nav-item">
							{#if item.href && !(item.items && item.items.length > 0)}
								<a
									href={item.href}
									class="nav-link"
									class:active={item.active}
									title={collapsed ? item.label : undefined}
									onclick={() => handleLinkClick(item)}
								>
									{#if item.iconSvg}
										<Icon svg={item.iconSvg} size="1.25em" />
									{/if}
									{#if !collapsed}
										<span class="nav-label">{item.label}</span>
									{/if}
								</a>
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
								{#if item.items && item.items.length > 0 && isExpanded(item.label) && !collapsed}
									<ul class="sub-nav-list" transition:slide={{ duration: 200 }}>
										{#each item.items as subItem}
											<li class="sub-nav-item">
												{#if subItem.href}
													<a
														href={subItem.href}
														class="sub-nav-link"
														class:active={subItem.active}
														onclick={() => handleLinkClick(subItem)}
													>
														{#if subItem.iconSvg}
															<Icon svg={subItem.iconSvg} size="1em" />
														{/if}
														<span>{subItem.label}</span>
													</a>
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

		{#if filteredBottomSections.length > 0}
			<nav class="sidenav-bottom">
				{#each filteredBottomSections as section}
					{#if section.title && !collapsed}
						<div class="section-title">{section.title}</div>
					{/if}
					<ul class="nav-list">
						{#each section.items as item}
							<li class="nav-item">
								{#if item.href && !(item.items && item.items.length > 0)}
									<a
										href={item.href}
										class="nav-link"
										class:active={item.active}
										title={collapsed ? item.label : undefined}
										onclick={() => handleLinkClick(item)}
									>
										{#if item.iconSvg}
											<Icon svg={item.iconSvg} size="1.25em" />
										{/if}
										{#if !collapsed}
											<span class="nav-label">{item.label}</span>
										{/if}
									</a>
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
									{#if item.items && item.items.length > 0 && isExpanded(item.label) && !collapsed}
										<ul class="sub-nav-list" transition:slide={{ duration: 200 }}>
											{#each item.items as subItem}
												<li class="sub-nav-item">
													{#if subItem.href}
														<a
															href={subItem.href}
															class="sub-nav-link"
															class:active={subItem.active}
															onclick={() => handleLinkClick(subItem)}
														>
															{#if subItem.iconSvg}
																<Icon svg={subItem.iconSvg} size="1em" />
															{/if}
															<span>{subItem.label}</span>
														</a>
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
		width={width}
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
		height: 100%;
		background-color: var(--paper-body-bg);
		border-right: 1px solid var(--border-color);
		transition: width 0.2s ease, min-width 0.2s ease;
		overflow: hidden;
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
		padding: 0.5rem 0;
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

	.nav-list {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.nav-item {
		margin: 0;
	}

	.nav-link {
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

	.collapsed .nav-link {
		justify-content: center;
		padding: 0.75rem;
	}

	.nav-link:hover {
		background-color: rgba(var(--midnight-rgbc), 0.08);
	}

	:global(.dark) .nav-link:hover {
		background-color: rgba(var(--midnight-rgbc), 0.2);
	}

	.nav-link.active {
		background-color: rgba(var(--pistachio-rgbc), 0.2);
		border-left: 3px solid var(--pistachio);
	}

	:global(.dark) .nav-link.active {
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

	.sub-nav-link {
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

	.sub-nav-link:hover {
		background-color: rgba(var(--midnight-rgbc), 0.08);
	}

	:global(.dark) .sub-nav-link:hover {
		background-color: rgba(var(--midnight-rgbc), 0.2);
	}

	.sub-nav-link.active {
		font-weight: 500;
		border-left: 3px solid var(--pistachio);
	}

	:global(.dark) .sub-nav-link.active {
		border-left: 3px solid var(--midnight);
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
