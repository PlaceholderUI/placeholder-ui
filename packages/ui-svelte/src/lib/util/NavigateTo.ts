import { goto } from "$app/navigation";
import { base } from "$app/paths";

export function navigateTo(url: string) {
    goto(base + url);
} 