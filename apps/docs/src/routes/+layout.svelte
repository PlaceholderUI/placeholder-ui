<script lang="ts">
	import '../app.css';
	import { untrack } from 'svelte';
	import { page } from '$app/stores';
	import { loadTheme, setTheme, themeState } from '@placeholderco/placeholder-ui';

	let { children } = $props();

	let sidebarOpen = $state(false);

	$effect(() => {
		untrack(() => loadTheme());
	});

	function toggleTheme() {
		setTheme(themeState.current === 'dark' ? 'light' : 'dark');
	}

	const navSections = [
		{
			title: 'Getting Started',
			items: [
				{ label: 'Introduction', href: '/' },
				{ label: 'Installation', href: '/docs/installation' },
				{ label: 'Theming', href: '/docs/theming' }
			]
		},
		{
			title: 'Components',
			items: [
				{ label: 'Button', href: '/docs/components/button' },
				{ label: 'Badge', href: '/docs/components/badge' },
				{ label: 'Alert', href: '/docs/components/alert' },
				{ label: 'Avatar', href: '/docs/components/avatar' },
				{ label: 'Dialog', href: '/docs/components/dialog' },
				{ label: 'Drawer', href: '/docs/components/drawer' },
				{ label: 'Tabs', href: '/docs/components/tabs' },
				{ label: 'Table', href: '/docs/components/table' },
				{ label: 'Tooltip', href: '/docs/components/tooltip' },
				{ label: 'Popover', href: '/docs/components/popover' },
				{ label: 'Loader', href: '/docs/components/loader' },
				{ label: 'Progress', href: '/docs/components/progress' },
				{ label: 'Skeleton', href: '/docs/components/skeleton' },
				{ label: 'Accordion', href: '/docs/components/accordion' },
				{ label: 'Breadcrumbs', href: '/docs/components/breadcrumbs' },
				{ label: 'Stepper', href: '/docs/components/stepper' },
				{ label: 'Timeline', href: '/docs/components/timeline' },
				{ label: 'Pagination', href: '/docs/components/pagination' }
			]
		},
		{
			title: 'Form',
			items: [
				{ label: 'Textbox', href: '/docs/components/textbox' },
				{ label: 'PasswordInput', href: '/docs/components/password-input' },
				{ label: 'TextArea', href: '/docs/components/textarea' },
				{ label: 'Select', href: '/docs/components/select' },
				{ label: 'Checkbox', href: '/docs/components/checkbox' },
				{ label: 'Switch', href: '/docs/components/switch' },
				{ label: 'RadioGroup', href: '/docs/components/radio-group' },
				{ label: 'Slider', href: '/docs/components/slider' },
				{ label: 'Rating', href: '/docs/components/rating' },
				{ label: 'DatePicker', href: '/docs/components/datepicker' },
				{ label: 'FileInput', href: '/docs/components/file-input' },
				{ label: 'Chips', href: '/docs/components/chips' }
			]
		},
		{
			title: 'Layout',
			items: [
				{ label: 'AppShell', href: '/docs/components/appshell' },
				{ label: 'Navbar', href: '/docs/components/navbar' },
				{ label: 'Paper', href: '/docs/components/paper' }
			]
		}
	];

	function isActive(href: string): boolean {
		return $page.url.pathname === href;
	}
</script>

<svelte:head>
	<title>Placeholder UI - Component Library</title>
	<meta name="description" content="A modern Svelte 5 component library with dark mode support" />
</svelte:head>

<div class="docs-layout" class:sidebar-open={sidebarOpen}>
	<!-- Header -->
	<header class="docs-header">
		<div class="header-left">
			<button class="menu-toggle" onclick={() => sidebarOpen = !sidebarOpen}>
				{#if sidebarOpen}
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
				{:else}
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
				{/if}
			</button>
			<a href="/" class="logo">
				<span class="logo-text">Placeholder UI</span>
			</a>
		</div>
		<div class="header-right">
			<a href="https://github.com/placeholderco/placeholder-ui" target="_blank" rel="noopener" class="header-link" aria-label="GitHub">
				<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
			</a>
			<button class="theme-toggle" onclick={toggleTheme} aria-label="Toggle theme">
				{#if themeState.current === 'dark'}
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
				{:else}
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
				{/if}
			</button>
		</div>
	</header>

	<!-- Sidebar -->
	<aside class="docs-sidebar">
		<nav class="sidebar-nav">
			{#each navSections as section}
				<div class="nav-section">
					<div class="nav-section-title">{section.title}</div>
					<ul class="nav-list">
						{#each section.items as item}
							<li>
								<a
									href={item.href}
									class="nav-link"
									class:active={isActive(item.href)}
									onclick={() => sidebarOpen = false}
								>
									{item.label}
								</a>
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</nav>
	</aside>

	<!-- Overlay for mobile -->
	{#if sidebarOpen}
		<button class="sidebar-overlay" onclick={() => sidebarOpen = false} aria-label="Close sidebar"></button>
	{/if}

	<!-- Main content -->
	<main class="docs-content">
		<div class="content-inner">
			{@render children()}
		</div>
	</main>
</div>

<style>
	.docs-layout {
		min-height: 100vh;
	}

	/* Header */
	.docs-header {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		height: var(--docs-header-height);
		background: var(--cui-color-white);
		border-bottom: 1px solid var(--cui-color-gray-200);
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 var(--cui-spacing-4);
		z-index: 100;
	}

	:global(.dark) .docs-header {
		background: var(--cui-color-dark-300);
		border-bottom-color: var(--cui-color-dark-border);
	}

	.header-left {
		display: flex;
		align-items: center;
		gap: var(--cui-spacing-3);
	}

	.header-right {
		display: flex;
		align-items: center;
		gap: var(--cui-spacing-2);
	}

	.menu-toggle {
		display: flex;
		align-items: center;
		justify-content: center;
		background: none;
		border: none;
		cursor: pointer;
		padding: var(--cui-spacing-2);
		color: var(--cui-color-gray-600);
		border-radius: var(--cui-radius-md);
	}

	.menu-toggle:hover {
		background: var(--cui-color-gray-100);
	}

	:global(.dark) .menu-toggle {
		color: var(--cui-color-gray-400);
	}

	:global(.dark) .menu-toggle:hover {
		background: var(--cui-color-dark-200);
	}

	@media (min-width: 768px) {
		.menu-toggle {
			display: none;
		}
	}

	.logo {
		display: flex;
		align-items: center;
		text-decoration: none;
	}

	.logo-text {
		font-size: var(--cui-font-size-lg);
		font-weight: var(--cui-font-weight-bold);
		color: var(--cui-color-primary);
	}

	:global(.dark) .logo-text {
		color: var(--cui-color-secondary);
	}

	.header-link,
	.theme-toggle {
		display: flex;
		align-items: center;
		justify-content: center;
		background: none;
		border: none;
		cursor: pointer;
		padding: var(--cui-spacing-2);
		color: var(--cui-color-gray-600);
		border-radius: var(--cui-radius-md);
		text-decoration: none;
	}

	.header-link:hover,
	.theme-toggle:hover {
		background: var(--cui-color-gray-100);
		text-decoration: none;
	}

	:global(.dark) .header-link,
	:global(.dark) .theme-toggle {
		color: var(--cui-color-gray-400);
	}

	:global(.dark) .header-link:hover,
	:global(.dark) .theme-toggle:hover {
		background: var(--cui-color-dark-200);
	}

	/* Sidebar */
	.docs-sidebar {
		position: fixed;
		top: var(--docs-header-height);
		left: 0;
		bottom: 0;
		width: var(--docs-sidebar-width);
		background: var(--cui-color-white);
		border-right: 1px solid var(--cui-color-gray-200);
		overflow-y: auto;
		padding: var(--cui-spacing-4);
		transform: translateX(-100%);
		transition: transform 0.2s ease;
		z-index: 90;
	}

	:global(.dark) .docs-sidebar {
		background: var(--cui-color-dark-300);
		border-right-color: var(--cui-color-dark-border);
	}

	@media (min-width: 768px) {
		.docs-sidebar {
			transform: translateX(0);
		}
	}

	.sidebar-open .docs-sidebar {
		transform: translateX(0);
	}

	.sidebar-overlay {
		position: fixed;
		inset: 0;
		top: var(--docs-header-height);
		background: rgba(0, 0, 0, 0.5);
		z-index: 80;
		border: none;
		cursor: pointer;
	}

	@media (min-width: 768px) {
		.sidebar-overlay {
			display: none;
		}
	}

	.nav-section {
		margin-bottom: var(--cui-spacing-6);
	}

	.nav-section-title {
		font-size: var(--cui-font-size-xs);
		font-weight: var(--cui-font-weight-semibold);
		text-transform: uppercase;
		letter-spacing: var(--cui-letter-spacing-wider);
		color: var(--cui-color-gray-500);
		margin-bottom: var(--cui-spacing-2);
	}

	.nav-list {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.nav-link {
		display: block;
		padding: var(--cui-spacing-2) var(--cui-spacing-3);
		color: var(--cui-color-gray-700);
		text-decoration: none;
		border-radius: var(--cui-radius-md);
		font-size: var(--cui-font-size-sm);
		transition: all 0.15s ease;
	}

	:global(.dark) .nav-link {
		color: var(--cui-color-gray-300);
	}

	.nav-link:hover {
		background: var(--cui-color-gray-100);
		text-decoration: none;
	}

	:global(.dark) .nav-link:hover {
		background: var(--cui-color-dark-200);
	}

	.nav-link.active {
		background: var(--cui-color-primary);
		color: var(--cui-color-white);
	}

	:global(.dark) .nav-link.active {
		background: var(--cui-color-secondary);
		color: var(--cui-color-primary);
	}

	/* Main content */
	.docs-content {
		margin-top: var(--docs-header-height);
		padding: var(--cui-spacing-6);
	}

	@media (min-width: 768px) {
		.docs-content {
			margin-left: var(--docs-sidebar-width);
		}
	}

	.content-inner {
		max-width: var(--docs-content-max-width);
		margin: 0 auto;
	}
</style>
