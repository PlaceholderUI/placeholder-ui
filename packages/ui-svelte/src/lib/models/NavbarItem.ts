import type { Component, ComponentType, SvelteComponent } from "svelte";

type BaseNavbarItem = {
    alwaysShow?: boolean;
    showInOnly?: undefined | "Navbar" | "Drawer";
    class?: string;
}

export type ParentNavbarItem = BaseNavbarItem
    & {
        label: string;
        iconSvg?: string;
        subItems?: NavbarItem[];
    };

export type LinkNavbarItem = BaseNavbarItem
    & {
        label: string;
        iconSvg?: string;
        href: string;
    };

export type ComponentNavbarItem = BaseNavbarItem
    & {
        component: Component;
        componentProps?: any;
    };

export type NavbarItem = ParentNavbarItem | LinkNavbarItem | ComponentNavbarItem;