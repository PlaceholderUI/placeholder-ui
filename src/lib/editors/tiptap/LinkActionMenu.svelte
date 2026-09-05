<script lang="ts">
	import type { Editor } from '@tiptap/core';
	import { onMount } from 'svelte';
	import {
		Icon,
		iconCheck,
		iconEdit,
		iconExternalLink,
		iconTrash,
		iconX
	} from '$lib/icon/index.js';

	interface Props {
		editor: Editor;
		editable?: boolean;
	}

	let { editor, editable = true }: Props = $props();

	let href = $state('');
	let target = $state<string | null>(null);
	let isEditing = $state(false);
	let draftHref = $state('');
	let draftOpenInNewTab = $state(false);
	let linkInputElement: HTMLInputElement | undefined = $state();

	function refreshLinkState() {
		const attrs = editor.getAttributes('link') as {
			href?: string;
			target?: string | null;
		};

		href = attrs.href || '';
		target = attrs.target || null;

		if (!isEditing) {
			draftHref = href;
			draftOpenInNewTab = target === '_blank';
		}
	}

	function openLink() {
		if (!href) return;

		const linkTarget = target || '_self';
		const openedWindow = window.open(
			href,
			linkTarget,
			linkTarget === '_blank' ? 'noopener,noreferrer' : undefined
		);

		if (openedWindow && linkTarget === '_blank') {
			openedWindow.opener = null;
		}
	}

	function startEditing() {
		if (!editable) return;

		draftHref = href;
		draftOpenInNewTab = target === '_blank';
		isEditing = true;

		setTimeout(() => {
			linkInputElement?.focus();
			linkInputElement?.select();
		}, 0);
	}

	function applyLink() {
		if (!editable) return;

		const nextHref = draftHref.trim();

		if (!nextHref) {
			removeLink();
			return;
		}

		editor
			.chain()
			.focus()
			.extendMarkRange('link')
			.setLink({
				href: nextHref,
				target: draftOpenInNewTab ? '_blank' : null,
				rel: draftOpenInNewTab ? 'noopener noreferrer' : null
			})
			.run();

		isEditing = false;
		refreshLinkState();
	}

	function cancelEditing() {
		isEditing = false;
		refreshLinkState();
		editor.commands.focus();
	}

	function removeLink() {
		if (!editable) return;

		editor.chain().focus().extendMarkRange('link').unsetLink().run();
		isEditing = false;
		refreshLinkState();
	}

	function handleEditKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			event.preventDefault();
			applyLink();
		}

		if (event.key === 'Escape') {
			event.preventDefault();
			cancelEditing();
		}
	}

	onMount(() => {
		refreshLinkState();
		editor.on('selectionUpdate', refreshLinkState);
		editor.on('transaction', refreshLinkState);

		return () => {
			editor.off('selectionUpdate', refreshLinkState);
			editor.off('transaction', refreshLinkState);
		};
	});
</script>

<div class="link-action-menu">
	{#if isEditing && editable}
		<div class="link-edit-row">
			<input
				bind:this={linkInputElement}
				bind:value={draftHref}
				class="link-input"
				onkeydown={handleEditKeydown}
				placeholder="Enter URL"
				type="text"
			/>
			<button class="link-icon-button primary" onclick={applyLink} title="Apply" type="button">
				<Icon svg={iconCheck} size="16px" />
			</button>
			<button class="link-icon-button" onclick={cancelEditing} title="Cancel" type="button">
				<Icon svg={iconX} size="16px" />
			</button>
		</div>
		<label class="link-checkbox-label">
			<input bind:checked={draftOpenInNewTab} class="link-checkbox" type="checkbox" />
			<span>Open in new tab</span>
		</label>
	{:else}
		<button class="link-url" onclick={openLink} title={href} type="button">
			{href}
		</button>
		<button class="link-icon-button primary" onclick={openLink} title="Open link" type="button">
			<Icon svg={iconExternalLink} size="16px" />
		</button>
		{#if editable}
			<button class="link-icon-button" onclick={startEditing} title="Edit link" type="button">
				<Icon svg={iconEdit} size="16px" />
			</button>
			<button class="link-icon-button danger" onclick={removeLink} title="Remove link" type="button">
				<Icon svg={iconTrash} size="16px" />
			</button>
		{/if}
	{/if}
</div>

<style>
	.link-action-menu {
		display: flex;
		align-items: center;
		gap: 6px;
		max-width: min(560px, calc(100vw - 32px));
		padding: 6px;
		border: 1px solid var(--border-color);
		border-radius: 6px;
		background: var(--paper-title-bg);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		color: var(--text-color);
		font-family: var(--ui-font-family);
	}

	:global(.dark) .link-action-menu {
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
	}

	.link-url {
		min-width: 0;
		max-width: 320px;
		padding: 5px 8px;
		overflow: hidden;
		border: 1px solid var(--border-color);
		border-radius: 4px;
		background: var(--paper-body-bg);
		color: var(--ui-tertiary-dark);
		cursor: pointer;
		font: inherit;
		font-size: 13px;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	:global(.dark) .link-url {
		color: var(--ui-tertiary);
	}

	.link-edit-row {
		display: flex;
		align-items: center;
		gap: 4px;
		min-width: min(360px, calc(100vw - 80px));
	}

	.link-input {
		flex: 1;
		min-width: 0;
		padding: 6px 10px;
		border: 1px solid var(--border-color);
		border-radius: 4px;
		background: var(--paper-body-bg);
		color: var(--text-color);
		font: inherit;
		font-size: 14px;
		outline: none;
	}

	.link-input:focus {
		border-color: var(--ui-primary);
		box-shadow: 0 0 0 2px rgba(var(--ui-primary-rgbc), 0.1);
	}

	:global(.dark) .link-input:focus {
		border-color: var(--ui-accent);
		box-shadow: 0 0 0 2px rgba(var(--ui-accent-rgbc), 0.1);
	}

	.link-icon-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 28px;
		padding: 0;
		border: none;
		border-radius: 4px;
		background: transparent;
		color: var(--text-color);
		cursor: pointer;
		transition:
			background 0.15s ease,
			color 0.15s ease;
	}

	.link-icon-button:hover {
		background: rgba(var(--ui-primary-rgbc), 0.1);
		color: var(--ui-primary);
	}

	:global(.dark) .link-icon-button:hover {
		background: rgba(var(--ui-accent-rgbc), 0.1);
		color: var(--ui-accent);
	}

	.link-icon-button.primary {
		background: var(--ui-primary);
		color: white;
	}

	.link-icon-button.primary:hover {
		background: var(--ui-tertiary-dark);
		color: white;
	}

	:global(.dark) .link-icon-button.primary {
		background: var(--ui-accent);
		color: var(--ui-primary);
	}

	.link-icon-button.danger:hover {
		background: rgba(var(--bs-danger-rgb), 0.12);
		color: var(--bs-danger);
	}

	.link-checkbox-label {
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 13px;
		white-space: nowrap;
	}

	.link-checkbox {
		width: 16px;
		height: 16px;
		cursor: pointer;
		accent-color: var(--ui-primary);
	}

	:global(.dark) .link-checkbox {
		accent-color: var(--ui-accent);
	}
</style>
