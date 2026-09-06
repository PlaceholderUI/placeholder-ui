<script lang="ts">
	import Textbox from '$lib/form/Textbox.svelte';
	import { useDialogEvents } from '$lib/ui/DialogEvents.svelte.js';

	interface Props {
		label: string;
	}

	let { label }: Props = $props();

	let inputValue = $state('');
	let inputElement: HTMLInputElement | undefined = $state(undefined);

	// Listen to dialog events and react accordingly
	useDialogEvents({
		onOpen: () => {
			console.log(label, 'Dialog opened - focusing input');
			// Focus the input when dialog opens
			setTimeout(() => {
				inputElement?.focus();
			}, 100);
		},
		onClose: () => {
			console.log(label, 'Dialog closed - clearing input');
			// Clear the input when dialog closes
			inputValue = '';
		}
	});
</script>

<Textbox
	bind:value={inputValue}
	bind:textboxElement={inputElement}
	label="Auto-focus input"
	placeholder="This input focuses when dialog opens and clears when it closes"
/>
