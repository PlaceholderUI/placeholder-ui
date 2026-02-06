<script lang="ts">
	import { afterNavigate } from "$app/navigation";
	import { page } from "$app/state";
	import {
		Navbar,
		Sidenav,
		type Hyperlink,
		type SidenavSection,
	} from "$lib/index.js";
	import "../lib/styles/index.css";

	interface Props {
		children?: any;
	}

	let { children }: Props = $props();
	let mobileNavOpen = $state(false);

	let currentPath = $derived(page.url.pathname);

	const appNav: Hyperlink = {
		href: "/",
		text: "Placeholder UI",
	};

	const navigationData = [
		{
			title: "Getting Started",
			items: [
				{ href: "/", label: "Introduction" },
				{ href: "/utilities/theme", label: "Theme" },
			],
		},
		{
			title: "Form Components",
			items: [
				{ href: "/components/textbox", label: "Textbox" },
				{ href: "/components/password-input", label: "Password Input" },
				{ href: "/components/number", label: "Number" },
				{ href: "/components/textarea", label: "TextArea" },
				{ href: "/components/select", label: "Select" },
				{ href: "/components/select-multi", label: "Select Multi" },
				{ href: "/components/autocomplete", label: "Autocomplete" },
				{ href: "/components/combobox", label: "ComboBox" },
				{ href: "/components/combobox-multi", label: "ComboBox Multi" },
				{ href: "/components/checkbox", label: "Checkbox" },
				{ href: "/components/radio-group", label: "Radio Group" },
				{ href: "/components/switch", label: "Switch" },
				{
					href: "/components/segmented-control",
					label: "Segmented Control",
				},
				{ href: "/components/slider", label: "Slider" },
				{ href: "/components/rating", label: "Rating" },
				{ href: "/components/chips", label: "Chips" },
				{ href: "/components/file-input", label: "File Input" },
				{ href: "/components/datepicker", label: "Date Picker" },
				{ href: "/components/timepicker", label: "Time Picker" },
				{
					href: "/components/datetimepicker",
					label: "DateTime Picker",
				},
				{ href: "/components/cronbuilder", label: "CRON Builder" },
				{ href: "/components/form-group", label: "Form Group" },
			],
		},
		{
			title: "UI Components",
			items: [
				{ href: "/components/button", label: "Button" },
				{ href: "/components/action-icon", label: "Action Icon" },
				{ href: "/components/badge", label: "Badge" },
				{ href: "/components/loader", label: "Loader" },
				{ href: "/components/progress", label: "Progress" },
				{ href: "/components/ring-progress", label: "Ring Progress" },
				{ href: "/components/skeleton", label: "Skeleton" },
				{
					href: "/components/loading-overlay",
					label: "Loading Overlay",
				},
				{ href: "/components/dialog", label: "Dialog" },
				{ href: "/components/drawer", label: "Drawer" },
				{ href: "/components/dropdown", label: "Dropdown" },
				{ href: "/components/popover", label: "Popover" },
				{ href: "/components/tooltip", label: "Tooltip" },
				{ href: "/components/tabs", label: "Tabs" },
				{ href: "/components/accordion", label: "Accordion" },
				{ href: "/components/table", label: "Table" },
				{ href: "/components/pagination", label: "Pagination" },
				{ href: "/components/breadcrumbs", label: "Breadcrumbs" },
				{ href: "/components/stepper", label: "Stepper" },
				{ href: "/components/timeline", label: "Timeline" },
				{ href: "/components/dropzone", label: "Dropzone" },
				{ href: "/components/toaster", label: "Toaster" },
				{ href: "/components/link", label: "Link" },
				{ href: "/components/icons", label: "Icons" },
			],
		},
		{
			title: "Display Components",
			items: [
				{ href: "/components/paper", label: "Paper" },
				{ href: "/components/avatar", label: "Avatar" },
				{ href: "/components/alert", label: "Alert" },
				{
					href: "/components/link-collection",
					label: "Link Collection",
				},
			],
		},
		{
			title: "Layout Components",
			items: [
				{ href: "/components/navbar", label: "Navbar" },
				{ href: "/components/sidenav", label: "Sidenav" },
			],
		},
	];

	// Derive sections with active state based on current path
	let sections: SidenavSection[] = $derived(
		navigationData.map((section) => ({
			title: section.title,
			items: section.items.map((item) => ({
				...item,
				active: currentPath === item.href,
			})),
		})),
	);

	afterNavigate(() => {
		const el = document.getElementById("page-content");
		if (el) el.scrollTop = 0;
	});

	let isMobile = $state(false);

	$effect(() => {
		if (typeof window !== "undefined") {
			const checkMobile = () => {
				isMobile = window.innerWidth < 768;
			};
			checkMobile();
			window.addEventListener("resize", checkMobile);
			return () => window.removeEventListener("resize", checkMobile);
		}
	});
</script>

<div class="navbar-wrapper">
	<Navbar
		{appNav}
		items={isMobile ? [] : [{ label: "Home", href: "/" }]}
		noLogo={isMobile}
		showDrawerButton={isMobile}
		onDrawerButtonClick={() => (mobileNavOpen = true)}
	/>
</div>

<div class="layout-container">
	<Sidenav
		{sections}
		width="260px"
		class="app-sidenav"
		searchable
		responsive
		bind:mobileOpen={mobileNavOpen}
		mobileTitle="Components"
		mobileDrawerPosition="right"
	/>
	<div id="page-content">
		<div class="page-inner">
			{@render children?.()}
		</div>
	</div>
</div>

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

	.layout-container :global(.app-sidenav) {
		height: calc(100vh - 46px);
	}

	#page-content {
		flex: 1;
		max-height: calc(100vh - 46px);
		overflow-y: auto;
		padding: 0 var(--pui-spacing-4, 1rem);
		padding-bottom: var(--pui-spacing-12, 3rem);
	}

	.page-inner {
		margin-top: var(--pui-spacing-4, 1rem);
		margin-bottom: var(--pui-spacing-4, 1rem);
		max-width: 1200px;
	}
</style>
