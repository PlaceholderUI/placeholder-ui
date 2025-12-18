<script lang="ts">
	import { themeState } from '../theme.svelte.js';
	import { Toaster } from 'svelte-sonner';
</script>

<Toaster theme={themeState.isDarkMode ? 'dark' : 'light'} richColors />
