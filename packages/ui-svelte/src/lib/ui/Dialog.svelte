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
		color: var(--text-color);
		border: none;
		background-color: transparent;
		overflow: visible;
		margin-top: 1rem;

		animation: fadeOut 0.2s forwards;
		transition:
			display 0.2s allow-discrete,
			overlay 0.2s allow-discrete;
		&::backdrop {
			animation: backdropFadeOut 0.2s forwards;
		}
		&[open] {
			animation: fadeIn 0.2s forwards;
			&::backdrop {
				animation: backdropFadeIn 0.2s forwards;
			}
		}
	}

	.dialog-title {
		display: flex;
		justify-content: space-between;
		margin-bottom: 0.5rem;
		padding-bottom: 0.25rem;
		border-bottom: 1px solid var(--border-color);
		font-weight: 600;
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
		padding: 0.5rem 0;
		border-top: 1px solid var(--border-color);
		gap: 0.5rem;
	}

	.overflow-visible {
		overflow: visible;
	}

	.overflow-y-auto {
		overflow-y: auto;
	}

	.dialog-no-paper {
		padding: 1rem;
	}

	.dialog-paper,
	.dialog-no-paper {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		border-radius: 0.25rem;
		background: #f1f3f5;
	}

	:global(.dark .dialog-paper),
	:global(.dark .dialog-no-paper) {
		background-color: rgb(33, 34, 38);
	}

	dialog::backdrop {
		background-color: #0008;
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
