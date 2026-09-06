import { goto } from '$app/navigation';
import { resolve } from '$app/paths';

export function navigateTo(url: string) {
	goto(resolve(url as any));
}
