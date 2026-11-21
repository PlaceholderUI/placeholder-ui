<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { ImageAsset } from '#lib/models/ImageAsset.js';
	import type { ImagePickerProps } from './ImagePicker.svelte';

	export interface ImagePickerDialogProps extends Omit<
		ImagePickerProps,
		| 'label'
		| 'required'
		| 'groupClass'
		| 'tooltipText'
		| 'tooltipLocation'
		| 'showError'
		| 'errorText'
		| 'onActivate'
		| 'class'
	> {
		/** Whether the dialog is visible (bindable). `pick()` opens it for you. */
		show?: boolean;
		/** Dialog title */
		title?: string;
		/** Label for the confirming button */
		okText?: string;
		/** Label for the dismissing button */
		cancelText?: string;
		/** Size preset for the dialog width */
		size?: 'md' | 'lg' | 'xl' | 'full';
		/** Allow closing by clicking the backdrop or pressing Escape */
		allowImplicitClose?: boolean;
		/** Additional CSS classes passed through to the dialog */
		class?: string;
		/** Called with the chosen image when the user confirms */
		onConfirm?: (image: ImageAsset) => void;
		/** Called when the dialog is dismissed without choosing */
		onCancel?: () => void;
		/** Extra content at the start of the footer, e.g. an Upload button */
		footerStart?: Snippet;
	}
</script>

<script lang="ts">
	import Dialog from '#lib/ui/Dialog.svelte';
	import Button from '#lib/ui/Button.svelte';
	import ImagePicker from './ImagePicker.svelte';

	let {
		show = $bindable(false),
		value = $bindable(null),
		search = $bindable(''),
		sort = $bindable('newest'),
		title = 'Choose an image',
		okText = 'Choose',
		cancelText = 'Cancel',
		size = 'lg',
		allowImplicitClose = true,
		class: classes = '',
		onConfirm,
		onCancel,
		footerStart,
		...pickerProps
	}: ImagePickerDialogProps = $props();

	// Track whether the close came from confirming so onCancel / pick() only see
	// genuine dismissals (Cancel button, close icon, Escape, backdrop)
	let confirmed = false;
	let wasOpen = false;
	let pending: ((image: ImageAsset | null) => void) | null = null;

	$effect(() => {
		if (show && !wasOpen) {
			wasOpen = true;
			confirmed = false;
		} else if (!show && wasOpen) {
			wasOpen = false;
			if (!confirmed) {
				settle(null);
				onCancel?.();
			}
		}
	});

	function settle(image: ImageAsset | null) {
		const resolve = pending;
		pending = null;
		resolve?.(image);
	}

	/**
	 * Open the dialog and wait for the user. Resolves with the chosen image, or null
	 * when they dismiss it. Fits TipTap's `onImagePick` directly:
	 * `<TipTap onImagePick={() => picker.pick()} />`.
	 */
	export function pick(): Promise<ImageAsset | null> {
		// A newer pick supersedes one still waiting
		settle(null);
		show = true;
		return new Promise((resolve) => (pending = resolve));
	}

	function confirm() {
		if (!value) return;
		const image = value;
		confirmed = true;
		show = false;
		settle(image);
		onConfirm?.(image);
	}
</script>

<Dialog bind:show {title} {size} {allowImplicitClose} class={classes}>
	<ImagePicker {...pickerProps} bind:value bind:search bind:sort onActivate={() => confirm()} />

	{#snippet footer()}
		<div class="image-picker-dialog-footer">
			<div class="image-picker-dialog-footer-start">
				{#if footerStart}
					{@render footerStart()}
				{/if}
			</div>
			<Button variant="secondary" onclick={() => (show = false)}>{cancelText}</Button>
			<Button variant="primary" disabled={!value} onclick={confirm}>{okText}</Button>
		</div>
	{/snippet}
</Dialog>

<style>
	.image-picker-dialog-footer {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		width: 100%;
	}

	.image-picker-dialog-footer-start {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-right: auto;
	}
</style>
