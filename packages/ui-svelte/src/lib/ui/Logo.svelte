<script lang="ts">
	import { themeState, Icon, Link } from '../index.js';
	import cuLogo from '../icon/logo.svg?raw';

	interface Props {
		class?: string;
		href?: string;
	}

	let { class: classes = '', href = '/' }: Props = $props();

	const fill = $derived(themeState.isDarkMode ? 'white' : 'var(--midnight)');
</script>

<Link {href}>
	<span class="logo {classes}">
		<Icon svg={cuLogo} {fill} stroke="none" />
	</span>
</Link>
