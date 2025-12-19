<script lang="ts">
	import Paper from '../display/Paper.svelte';
	import { iconX } from '../icon/index.js';
	import type { Snippet } from 'svelte';
	import ActionIcon from './ActionIcon.svelte';
	import { setContext } from 'svelte';

	interface Props {
		show: boolean;
		allowImplicitClose?: boolean;
		title?: string | undefined;
		noPaper?: boolean;
		preventOverflow?: boolean;
		size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
		class?: string;
		footer?: Snippet;
		children?: Snippet;
	}

	let {
		show = $bindable(false),
		allowImplicitClose = true,
		title = undefined,
		noPaper = false,
		preventOverflow = false,
		size = 'md',
		class: classes = '',
		footer,
		children
	}: Props = $props();

	let dialogElement: HTMLDialogElement | undefined = $state(undefined);
	
	// Create context for dialog events
	let hasOpenedBefore = $state(false);
	let dialogContext = $state({
		isOpen: show,
		onOpen: () => {},
		onClose: () => {},
		onFirstOpen: () => {}
	});

	$effect(() => {
		dialogContext.isOpen = show;
	});

	// Set context so child components can access dialog state
	setContext('dialog', dialogContext);

	$effect(() => {
		if (dialogElement) {
			if (show) {
				dialogElement.showModal();
				dialogContext.onOpen();
				if (!hasOpenedBefore) {
					hasOpenedBefore = true;
					dialogContext.onFirstOpen();
				}
			} else {
				dialogElement.close();
				dialogContext.onClose();
			}
		}
	});

	$effect(() => {
		if (!body) return;

		if (show) {
			body.style.overflow = 'hidden';
		} else {
			body.style.overflow = '';
		}
	});

	const body = document.querySelector('body');

	function onClose() {
		if (allowImplicitClose) show = false;
	}

	function cancel(e: Event) {
		e.stopImmediatePropagation();
	}
</script>

{#snippet DialogInner()}
	{#if title}
		<div class="dialog-title">
			<span class="font-bold">{title}</span>
			{#if allowImplicitClose}
				<ActionIcon
					onclick={onClose}
					variant="secondary-subtle"
					class="flex !p-[0.3rem] mr-1 !leading-0"
					svg={iconX}
					size="1rem"
				/>
			{/if}
		</div>
	{/if}
	<div
		class="dialog-body
			{preventOverflow ? 'overflow-y-auto' : 'overflow-visible'} 
			{!footer && 'no-footer'}"
	>
		{@render children?.()}
	</div>
	{#if footer}
		<div class="dialog-footer">
			{@render footer?.()}
		</div>
	{/if}
{/snippet}

{#if noPaper}
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<dialog
		bind:this={dialogElement}
		onclose={onClose}
		onmousedown={onClose}
		class={`dialog ${size}`}
	>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="dialog-inner {classes} dialog-no-paper"
			onclick={cancel}
			onmousedown={cancel}
			onmouseup={cancel}
		>
			{@render DialogInner()}
		</div>
	</dialog>
{:else}
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<dialog
		bind:this={dialogElement}
		onclose={onClose}
		onmousedown={onClose}
		class={`dialog ${size}`}
	>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="dialog-inner" onclick={cancel} onmousedown={cancel} onmouseup={cancel}>
			<div class="dialog-paper {preventOverflow ? 'overflow-y-auto' : 'overflow-visible'} ">
				<Paper containerClass={classes}>
					{@render DialogInner()}
				</Paper>
			</div>
		</div>
	</dialog>
{/if}

<style>
	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(-1em);
		}
		to {
			opacity: 1;
			transform: translateY(0em);
		}
	}
	@keyframes fadeOut {
		from {
			opacity: 1;
			transform: translateY(0em);
		}
		to {
			opacity: 0;
			transform: translateY(-1em);
		}
	}

	/* Keyframes for the backdrop pseudo-element */
	@keyframes backdropFadeIn {
		from {
			background: hsl(0 0% 0% / 0%);
		}
		to {
			background: hsl(0 0% 0% / 65%);
		}
	}
	@keyframes backdropFadeOut {
		from {
			background: hsl(0 0% 0% / 65%);
		}
		to {
			background: hsl(0 0% 0% / 0%);
		}
	}

	dialog {
		color: var(--pui-text-primary);
		border: none;
		background-color: transparent;
		overflow: visible;
		margin-top: var(--pui-spacing-4);

		animation: fadeOut var(--pui-transition-fast) forwards;
		transition:
			display var(--pui-transition-fast) allow-discrete,
			overlay var(--pui-transition-fast) allow-discrete;
		&::backdrop {
			animation: backdropFadeOut var(--pui-transition-fast) forwards;
		}
		&[open] {
			animation: fadeIn var(--pui-transition-fast) forwards;
			&::backdrop {
				animation: backdropFadeIn var(--pui-transition-fast) forwards;
			}
		}
	}

	.dialog-title {
		display: flex;
		justify-content: space-between;
		margin-bottom: var(--pui-spacing-2);
		padding-bottom: var(--pui-spacing-1);
		border-bottom: 1px solid var(--pui-border-default);
		font-weight: var(--pui-font-weight-semibold);
	}

	.dialog-body {
		display: flex;
		flex-direction: column;
		min-width: 0;
		flex-shrink: 1;
		max-height: calc(100vh - 167px);
	}

	.dialog-body.no-footer {
		max-height: calc(100vh - 107px);
	}

	.dialog-footer {
		display: flex;
		justify-content: flex-end;
		padding: var(--pui-spacing-2) 0;
		border-top: 1px solid var(--pui-border-default);
		gap: var(--pui-spacing-2);
	}

	.overflow-visible {
		overflow: visible;
	}

	.overflow-y-auto {
		overflow-y: auto;
	}

	.dialog-no-paper {
		padding: var(--pui-spacing-4);
	}

	.dialog-paper,
	.dialog-no-paper {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		border-radius: var(--pui-radius-base);
		background: var(--pui-color-gray-100);
	}

	:global(.dark .dialog-paper),
	:global(.dark .dialog-no-paper) {
		background-color: var(--pui-color-dark-200);
	}

	dialog::backdrop {
		background-color: var(--pui-bg-overlay);
	}

	.dialog.sm {
		width: 20rem;
	}

	.dialog.md {
		width: 30rem;
	}

	.dialog.lg {
		width: 40rem;
	}

	.dialog.xl {
		width: 50rem;
	}

	.dialog.full {
		width: 100%;
		margin-top: auto;
	}

	.dialog.full,
	.dialog.full .dialog-inner,
	.dialog.full :global(.paper),
	.dialog.full :global(.dialog-paper) {
		height: 100%;
	}

	.dialog.full .dialog-body {
		flex-grow: 1;
	}
</style>
