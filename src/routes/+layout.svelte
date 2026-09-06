<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import {
		Navbar,
		Sidenav,
		type Hyperlink,
		type SidenavSection,
		viewportState
	} from '$lib/index.js';
	import AppShell from '$lib/layout/AppShell.svelte';

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

	const topNavItems = $derived.by(() => {
		if (viewportState.isMobile) return [];
		return [{ label: 'Home', href: '/' }];
	});

	const navigationData = [
		{
			title: 'Utilities',
			items: [
				{ href: '/utilities/theme', label: 'Theme' },
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
				{ href: '/components/drawer', label: 'Drawer' }
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
		/>
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
		<div id="page-content" class="container px-2 pb-12">
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

	.layout-container {
		display: flex;
	}

	#page-content {
		flex: 1;
		max-height: var(--page-content-height);
		overflow-y: auto;
	}
</style>
