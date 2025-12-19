<script lang="ts">
	import type { Snippet } from 'svelte';
	import '../styles/index.css';

	interface Props {
		/** Header/navbar content */
		header?: Snippet;
		/** Left sidebar content */
		aside?: Snippet;
		/** Right sidebar content */
		asideRight?: Snippet;
		/** Footer content */
		footer?: Snippet;
		/** Main content */
		children?: Snippet;
		/** Width of the left aside */
		asideWidth?: string;
		/** Width of the right aside */
		asideRightWidth?: string;
		/** Height of the header */
		headerHeight?: string;
		/** Height of the footer */
		footerHeight?: string;
		/** Whether the header is fixed/sticky */
		fixedHeader?: boolean;
		/** Whether the aside is fixed */
		fixedAside?: boolean;
		/** Additional class for the shell */
		class?: string;
	}

	let {
		header,
		aside,
		asideRight,
		footer,
		children,
		asideWidth = '260px',
		asideRightWidth = '260px',
		headerHeight = 'auto',
		footerHeight = '60px',
		fixedHeader = true,
		fixedAside = true,
		class: className = ''
	}: Props = $props();

	const hasAside = $derived(!!aside);
	const hasAsideRight = $derived(!!asideRight);
	const hasHeader = $derived(!!header);
	const hasFooter = $derived(!!footer);
</script>

<div
	class="app-shell {className}"
	class:has-aside={hasAside}
	class:has-aside-right={hasAsideRight}
	class:has-header={hasHeader}
	class:has-footer={hasFooter}
	class:fixed-header={fixedHeader}
	class:fixed-aside={fixedAside}
	style:--app-shell-aside-width={asideWidth}
	style:--app-shell-aside-right-width={asideRightWidth}
	style:--app-shell-header-height={headerHeight}
	style:--app-shell-footer-height={footerHeight}
>
	{#if header}
		<header class="app-shell-header">
			{@render header()}
		</header>
	{/if}

	<div class="app-shell-body">
		{#if aside}
			<aside class="app-shell-aside">
				{@render aside()}
			</aside>
		{/if}

		<main class="app-shell-main">
			{@render children?.()}
		</main>

		{#if asideRight}
			<aside class="app-shell-aside-right">
				{@render asideRight()}
			</aside>
		{/if}
	</div>

	{#if footer}
		<footer class="app-shell-footer">
			{@render footer()}
		</footer>
	{/if}
</div>

<style>
	.app-shell {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	.app-shell-header {
		height: var(--app-shell-header-height);
		flex-shrink: 0;
	}

	.fixed-header .app-shell-header {
		position: sticky;
		top: 0;
		z-index: var(--pui-z-sticky, 100);
	}

	.app-shell-body {
		display: flex;
		flex: 1;
		min-height: 0;
	}

	.app-shell-aside {
		width: var(--app-shell-aside-width);
		flex-shrink: 0;
		overflow-y: auto;
	}

	.fixed-aside .app-shell-aside {
		position: sticky;
		top: var(--app-shell-header-height);
		height: calc(100vh - var(--app-shell-header-height));
		align-self: flex-start;
	}

	.fixed-aside.has-footer .app-shell-aside {
		height: calc(100vh - var(--app-shell-header-height) - var(--app-shell-footer-height));
	}

	.app-shell-aside-right {
		width: var(--app-shell-aside-right-width);
		flex-shrink: 0;
		overflow-y: auto;
	}

	.fixed-aside .app-shell-aside-right {
		position: sticky;
		top: var(--app-shell-header-height);
		height: calc(100vh - var(--app-shell-header-height));
		align-self: flex-start;
	}

	.app-shell-main {
		flex: 1;
		min-width: 0;
		overflow-x: hidden;
	}

	.app-shell-footer {
		height: var(--app-shell-footer-height);
		flex-shrink: 0;
	}

	/* Responsive behavior */
	@media (max-width: 768px) {
		.app-shell-aside,
		.app-shell-aside-right {
			display: none;
		}
	}
</style>
