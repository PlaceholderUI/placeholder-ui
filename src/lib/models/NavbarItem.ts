import type { Component, ComponentType, SvelteComponent } from 'svelte';

type BaseNavbarItem = {
	alwaysShow?: boolean;
	showInOnly?: undefined | 'Navbar' | 'Drawer';
	class?: string;
	/** Custom click handler. For link items, call event.preventDefault() to override the default href navigation. */
	onclick?: (event: MouseEvent) => void;
};

export type ParentNavbarItem = BaseNavbarItem & {
	label: string;
	iconSvg?: string;
	subItems?: NavbarItem[];
	/** Custom width for the sub-item dropdown panel (any CSS length, e.g. '20rem' or '300px'). Defaults to 12rem. */
	submenuWidth?: string;
};

export type LinkNavbarItem = BaseNavbarItem & {
	label: string;
	iconSvg?: string;
	href: string;
};

export type ComponentNavbarItem = BaseNavbarItem & {
	component: Component;
	componentProps?: any;
};

export type NavbarItem = ParentNavbarItem | LinkNavbarItem | ComponentNavbarItem;
