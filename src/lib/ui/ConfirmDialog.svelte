<script lang="ts">
	import type { Snippet } from 'svelte';
	import Button from './Button.svelte';
	import Dialog from './Dialog.svelte';
	import type { ButtonVariant } from './ButtonVariant.js';

	export interface ConfirmDialogProps {
		/** Whether the dialog is visible (bindable) */
		show: boolean;
		/** Dialog title displayed in the header */
		title?: string | undefined;
		/**
		 * Plain-text body. Ignored when `children` is provided, so pass a snippet
		 * for richer content.
		 */
		message?: string | undefined;
		/** Label for the confirming button */
		okText?: string;
		/** Label for the dismissing button */
		cancelText?: string;
		/** Visual variant of the confirming button (use `danger` for destructive actions) */
		okVariant?: ButtonVariant;
		/** Visual variant of the dismissing button */
		cancelVariant?: ButtonVariant;
		/** Icon shown on the left of the confirming button */
		okSvg?: string;
		/** Disable the confirming button (e.g. while a form is invalid) */
		okDisabled?: boolean;
		/** Hide the Cancel button entirely, leaving an acknowledgement-style dialog */
		hideCancel?: boolean;
		/**
		 * Which button receives focus when the dialog opens. Defaults to the
		 * confirming button, or to Cancel when `okVariant` is a danger variant so
		 * a stray Enter cannot trigger a destructive action.
		 */
		initialFocus?: 'ok' | 'cancel' | 'none';
		/**
		 * Called when OK is pressed. Returning a promise puts the OK button into a
		 * loading state and keeps the dialog open until it settles. Return `false`
		 * (or resolve to `false`) to keep the dialog open.
		 */
		onConfirm?: () => void | boolean | Promise<void | boolean>;
		/** Called when the dialog is dismissed via Cancel, the close icon, Escape or the backdrop */
		onCancel?: () => void;
		/** Allow closing by clicking backdrop or pressing Escape */
		allowImplicitClose?: boolean;
		/** Size preset for the dialog width */
		size?: 'md' | 'lg' | 'xl' | 'full';
		/** Additional CSS classes passed through to the dialog */
		class?: string;
		/** Custom body content; overrides `message` */
		children?: Snippet;
	}

	let {
		show = $bindable(false),
		title = undefined,
		message = undefined,
		okText = 'Save',
		cancelText = 'Cancel',
		okVariant = 'primary',
		cancelVariant = 'secondary',
		okSvg = undefined,
		okDisabled = false,
		hideCancel = false,
		initialFocus = undefined,
		onConfirm = undefined,
		onCancel = undefined,
		allowImplicitClose = true,
		size = 'md',
		class: classes = '',
		children
	}: ConfirmDialogProps = $props();

	let loading = $state(false);
	let footerElement: HTMLDivElement | undefined = $state(undefined);

	// Track whether the close was the result of OK so the cancel callback only
	// fires for genuine dismissals (Cancel button, close icon, Escape, backdrop)
	let confirmed = false;
	let wasOpen = false;

	const resolvedFocus = $derived(
		initialFocus ?? (okVariant.startsWith('danger') && !hideCancel ? 'cancel' : 'ok')
	);

	$effect(() => {
		if (show && !wasOpen) {
			wasOpen = true;
			confirmed = false;
			loading = false;
			focusInitialButton();
		} else if (!show && wasOpen) {
			wasOpen = false;
			loading = false;
			if (!confirmed) onCancel?.();
		}
	});

	function focusInitialButton() {
		if (resolvedFocus === 'none') return;
		// showModal() runs in the parent Dialog's effect and moves focus to the
		// first focusable element; wait a frame so this focus call lands after it
		requestAnimationFrame(() => {
			const target = footerElement?.querySelector<HTMLButtonElement>(
				`.confirm-dialog-${resolvedFocus} button`
			);
			target?.focus();
		});
	}

	async function handleConfirm() {
		if (loading) return;
		let result: void | boolean;
		try {
			const pending = onConfirm?.();
			if (pending instanceof Promise) {
				loading = true;
				result = await pending;
			} else {
				result = pending;
			}
		} finally {
			loading = false;
		}
		if (result === false) return;
		confirmed = true;
		show = false;
	}

	function handleCancel() {
		if (loading) return;
		show = false;
	}
</script>

<Dialog
	bind:show
	{title}
	{size}
	class={classes}
	allowImplicitClose={allowImplicitClose && !loading}
>
	{#if children}
		{@render children()}
	{:else if message}
		<p class="confirm-dialog-message">{message}</p>
	{/if}
	{#snippet footer()}
		<div class="confirm-dialog-actions" bind:this={footerElement}>
			{#if !hideCancel}
				<span class="confirm-dialog-cancel">
					<Button variant={cancelVariant} disabled={loading} onclick={handleCancel}>
						{cancelText}
					</Button>
				</span>
			{/if}
			<span class="confirm-dialog-ok">
				<Button
					variant={okVariant}
					svg={okSvg}
					{loading}
					disabled={okDisabled}
					onclick={handleConfirm}
				>
					{okText}
				</Button>
			</span>
		</div>
	{/snippet}
</Dialog>

<style>
	.confirm-dialog-message {
		margin: 0;
		white-space: pre-line;
		overflow-wrap: anywhere;
	}

	.confirm-dialog-actions {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 0.5rem;
	}

	.confirm-dialog-cancel,
	.confirm-dialog-ok {
		display: contents;
	}
</style>
