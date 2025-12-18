<!-- <script lang="ts">
	import Icon from '../icon/Icon.svelte';
	import Link from '../ui/Link.svelte';
	import type { NavbarItem } from "../models/NavbarItem.js";

    export let item: NavbarItem;
    export let isInDrawer: boolean;
</script>

<div
    class="{item.alwaysShow || isInDrawer ? "" : "hidden sm:block"} {item.class ?? ""}"
>
    {#if "component" in item}
        <svelte:component this={item.component} {isInDrawer} />
    {:else if "link" in item && item.href}
        <Link href={item.href}>
            {#if item.iconSvg}
                <Icon size="1.1em" svg={item.iconSvg}/>
            {/if}
            {item.label}
        </Link>
    {:else}
        <div>
            {item.label}
            {#if item.iconSvg}
                <Icon size="1.1em" svg={item.iconSvg}/>
            {/if}
        </div>
    {/if}
    </div> -->