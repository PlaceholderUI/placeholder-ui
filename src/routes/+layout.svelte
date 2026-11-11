<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import {
		ActionIcon,
		Navbar,
		Sidenav,
		type Hyperlink,
		type SidenavSection,
		viewportState
	} from '#lib/index.js';
	import AppShell from '#lib/layout/AppShell.svelte';

	interface Props {
		children?: any;
	}

	let { children }: Props = $props();
	let mobileNavOpen = $state(false);

	let currentPath = $derived(page.url.pathname);

	const appNav: Hyperlink = {
		href: '/',
		text: 'PlaceholderUI'
	};

	// Brand icons (Tabler) kept in the showcase only - the library ships no third-party brand marks
	const iconGithub = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5" /></svg>`;
	const iconNpm = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M1 8h22v7h-12v2h-4v-2h-6l0 -7z" /><path d="M7 8v7" /><path d="M14 8v7" /><path d="M17 11v4" /><path d="M4 11v4" /><path d="M11 11v1" /><path d="M20 11v4" /></svg>`;

	const topNavItems = $derived.by(() => {
		if (viewportState.isMobile) return [];
		return [{ label: 'Home', href: '/' }];
	});

	const navigationData = [
		{
			title: 'Utilities',
			items: [
				{ href: '/', label: 'Theme' },
				{ href: '/utilities/viewport', label: 'Viewport' }
			]
		},
		{
			title: 'Editors',
			items: [
				{ href: '/components/codemirror', label: 'CodeMirror Editor' },
				{ href: '/components/tiptap', label: 'TipTap Editor' },
				{ href: '/components/cronbuilder', label: 'CRON Builder' },
				{ href: '/components/combobox-builder', label: 'ComboBox Builder' },
				{ href: '/components/string-array-builder', label: 'StringArray Builder' }
			]
		},
		{
			title: 'Form Components',
			items: [
				{ href: '/components/textbox', label: 'Textbox' },
				{ href: '/components/number', label: 'Number' },
				{ href: '/components/textarea', label: 'Textarea' },
				{ href: '/components/datepicker', label: 'Date Picker' },
				{ href: '/components/timepicker', label: 'Time Picker' },
				{ href: '/components/datetimepicker', label: 'Date Time Picker' },
				{ href: '/components/daterangepicker', label: 'Date Range Picker' },
				{ href: '/components/checkbox', label: 'Checkbox' },
				{ href: '/components/radio', label: 'Radio Group' },
				{ href: '/components/select', label: 'Select' },
				{ href: '/components/selectmulti', label: 'SelectMulti' },
				{ href: '/components/switch', label: 'Switch' },
				{ href: '/components/slider', label: 'Slider' },
				{ href: '/components/autocomplete', label: 'Autocomplete' },
				{ href: '/components/autocompletemulti', label: 'AutocompleteMulti' },
				{ href: '/components/segmented-control', label: 'Segmented Control' },
				{ href: '/components/chips', label: 'Chips' },
				{ href: '/components/colorpicker', label: 'Colour Picker' }
			]
		},
		{
			title: 'UI Components',
			items: [
				{ href: '/components/accordion', label: 'Accordion' },
				{ href: '/components/buttons', label: 'Buttons' },
				{ href: '/components/badges', label: 'Badges' },
				{ href: '/components/icons', label: 'Icons' },
				{ href: '/components/action-icons', label: 'Action Icons' },
				{ href: '/components/dropdown', label: 'Dropdown' },
				{ href: '/components/dialog', label: 'Dialog' },
				{ href: '/components/loader', label: 'Loader' },
				{ href: '/components/pagination', label: 'Pagination' },
				{ href: '/components/progress-bar', label: 'Progress Bar' },
				{ href: '/components/table', label: 'Table' },
				{ href: '/components/tabs', label: 'Tabs' },
				{ href: '/components/popover', label: 'Popover' },
				{ href: '/components/tooltip', label: 'Tooltip' },
				{ href: '/components/toast', label: 'Toast' },
				{ href: '/components/dropzone', label: 'Dropzone' },
				{ href: '/components/sortable', label: 'Sortable' },
				{ href: '/components/multisortable', label: 'MultiSortable' }
			]
		},
		{
			title: 'Display Components',
			items: [
				{ href: '/components/paper', label: 'Paper' },
				{ href: '/components/alert', label: 'Alert' },
				{ href: '/components/avatar', label: 'Avatar' },
				{ href: '/components/link-collection', label: 'Link Collection' },
				{ href: '/components/file-tree', label: 'File Tree' }
			]
		},
		{
			title: 'Layout Components',
			items: [
				{ href: '/components/navbar', label: 'Navbar' },
				{ href: '/components/sidenav', label: 'Sidenav' },
				{ href: '/components/drawer', label: 'Drawer' },
				{ href: '/components/resize-handle', label: 'Resize Handle' }
			]
		},
		{
			title: 'Specialized',
			items: [{ href: '/components/git-card', label: 'Git Card' }]
		}
	];

	// Derive sections with active state based on current path
	let sections: SidenavSection[] = $derived(
		navigationData.map((section) => ({
			title: section.title,
			items: section.items.map((item) => ({
				...item,
				active: currentPath === resolve(item.href as any)
			}))
		}))
	);
</script>

<AppShell>
	<div class="navbar-wrapper">
		<Navbar
			{appNav}
			items={topNavItems}
			noLogo={viewportState.isMobile}
			showDrawerButton={viewportState.isMobile}
			onDrawerButtonClick={() => (mobileNavOpen = true)}
		>
			{#snippet rightSection()}
				<div class="external-links">
					<ActionIcon
						svg={iconGithub}
						href="https://github.com/PlaceholderUI/placeholder-ui"
						target="_blank"
						variant="primary-subtle"
						tooltip="GitHub"
					/>
					<ActionIcon
						svg={iconNpm}
						href="https://www.npmjs.com/package/@placeholderco/placeholder-ui"
						target="_blank"
						variant="primary-subtle"
						tooltip="npm"
					/>
				</div>
			{/snippet}
		</Navbar>
	</div>

	<div class="layout-container">
		<Sidenav
			{sections}
			width="240px"
			searchable
			responsive
			bind:mobileOpen={mobileNavOpen}
			mobileTitle="Components"
			mobileDrawerPosition="right"
		/>
		<div id="page-content" class="container px-3 pb-12">
			<div class="mt-3 mb-4">
				{@render children?.()}
			</div>
		</div>
	</div>
</AppShell>

<style>
	.navbar-wrapper {
		display: flex;
		align-items: center;
	}

	.navbar-wrapper :global(header) {
		flex: 1;
	}

	.external-links {
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}

	.layout-container {
		display: flex;
	}

	#page-content {
		flex: 1;
		max-height: var(--page-content-height);
		overflow-y: auto;
	}
</style>
