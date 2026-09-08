<script lang="ts">
	import type { Editor } from '@tiptap/core';
	import ToolbarButton from './ToolbarButton.svelte';
	import { iconLink } from '$lib/icon/index.js';

	interface Props {
		editor: Editor;
	}

	let { editor }: Props = $props();

	let showLinkInput = $state(false);
	let linkUrl = $state('');
	let linkOpenInNewTab = $state(false);
	let linkInputElement: HTMLInputElement | undefined = $state();
	let linkDropdownElement: HTMLDivElement | undefined = $state();

	const toggleLink = () => {
		const attrs = editor.getAttributes('link');
		linkUrl = attrs?.href || '';
		linkOpenInNewTab = attrs?.target === '_blank';
		showLinkInput = !showLinkInput;

		if (showLinkInput) {
			setTimeout(() => {
				linkInputElement?.focus();
				linkInputElement?.select();
			}, 0);
		}
	};

	const setLink = () => {
		if (linkUrl === '') {
			editor.chain().focus().extendMarkRange('link').unsetLink().run();
		} else {
			const linkAttrs: { href: string; target?: string; rel?: string } = { href: linkUrl };
			if (linkOpenInNewTab) {
				linkAttrs.target = '_blank';
				linkAttrs.rel = 'noopener noreferrer';
			}
			editor.chain().focus().extendMarkRange('link').setLink(linkAttrs).run();
		}
		showLinkInput = false;
		linkUrl = '';
		linkOpenInNewTab = false;
	};

	const updateLinkTarget = () => {
		if (!linkUrl) return;

		const linkAttrs: { href: string; target?: string; rel?: string } = { href: linkUrl };
		if (linkOpenInNewTab) {
			linkAttrs.target = '_blank';
			linkAttrs.rel = 'noopener noreferrer';
		}

		if (editor.isActive('link')) {
			editor.chain().focus().extendMarkRange('link').setLink(linkAttrs).run();
		} else if (!editor.state.selection.empty) {
			editor.chain().focus().setLink(linkAttrs).run();
		}
	};

	const removeLink = () => {
		editor.chain().focus().extendMarkRange('link').unsetLink().run();
		showLinkInput = false;
		linkUrl = '';
		linkOpenInNewTab = false;
	};

	const handleLinkKeydown = (e: KeyboardEvent) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			setLink();
		} else if (e.key === 'Escape') {
			showLinkInput = false;
			linkUrl = '';
			linkOpenInNewTab = false;
		}
	};
</script>

<div style="position: relative; display: inline-block;">
	<ToolbarButton
		icon={iconLink}
		title="Link"
		active={editor.isActive('link')}
		onclick={toggleLink}
	/>

	{#if showLinkInput}
		<div class="link-dropdown" bind:this={linkDropdownElement}>
			<div class="link-input-row">
				<input
					type="text"
					bind:this={linkInputElement}
					bind:value={linkUrl}
					onkeydown={handleLinkKeydown}
					placeholder="Enter URL"
					class="link-input"
				/>
				<button type="button" onclick={setLink} class="link-submit-button" title="Apply">✓</button>
				{#if editor.isActive('link')}
					<button type="button" onclick={removeLink} class="link-remove-button" title="Remove Link"
						>✕</button
					>
				{/if}
			</div>
			<label class="link-checkbox-label">
				<input
					type="checkbox"
					bind:checked={linkOpenInNewTab}
					onchange={updateLinkTarget}
					class="link-checkbox"
				/>
				<span>Open in new tab</span>
			</label>
		</div>
	{/if}
</div>

<style>
	.link-dropdown {
		position: absolute;
		top: 100%;
		left: 0;
		margin-top: 4px;
		display: flex;
		flex-direction: column;
		gap: 8px;
		padding: 8px;
		background: var(--paper-body-bg);
		border: 1px solid var(--border-color);
		border-radius: 4px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		z-index: 1000;
		min-width: 320px;
	}

	:global(.dark) .link-dropdown {
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
	}

	.link-input-row {
		display: flex;
		gap: 4px;
	}

	.link-input {
		flex: 1;
		padding: 6px 10px;
		border: 1px solid var(--border-color);
		border-radius: 4px;
		font-size: 14px;
		outline: none;
		font-family: inherit;
		background: var(--paper-body-bg);
		color: var(--text-color);
	}

	.link-input::placeholder {
		color: var(--placeholder-color);
	}

	.link-input:focus {
		border-color: var(--ui-primary);
		box-shadow: 0 0 0 2px rgba(var(--ui-primary-rgbc), 0.1);
	}

	:global(.dark) .link-input:focus {
		border-color: var(--ui-accent);
		box-shadow: 0 0 0 2px rgba(var(--ui-accent-rgbc), 0.1);
	}

	.link-checkbox-label {
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 14px;
		color: var(--text-color);
		cursor: pointer;
		user-select: none;
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

	.link-checkbox-label:hover {
		color: var(--ui-primary);
	}

	:global(.dark) .link-checkbox-label:hover {
		color: var(--ui-accent);
	}

	.link-submit-button {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 6px 12px;
		border: none;
		background: var(--ui-primary);
		color: white;
		border-radius: 4px;
		cursor: pointer;
		font-size: 16px;
		font-weight: bold;
		transition: background 0.15s ease;
	}

	.link-submit-button:hover {
		background: var(--ui-tertiary-dark);
	}

	:global(.dark) .link-submit-button {
		background: var(--ui-accent);
		color: var(--ui-primary);
	}

	:global(.dark) .link-submit-button:hover {
		background: var(--ui-accent-dark);
	}

	.link-remove-button {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 6px 12px;
		border: none;
		background: var(--ui-tertiary);
		color: var(--ui-primary);
		border-radius: 4px;
		cursor: pointer;
		font-size: 16px;
		font-weight: bold;
		transition: background 0.15s ease;
	}

	.link-remove-button:hover {
		background: var(--ui-tertiary-dark);
	}

	:global(.dark) .link-remove-button {
		background: var(--ui-accent);
		color: var(--ui-primary);
	}

	:global(.dark) .link-remove-button:hover {
		background: var(--ui-accent-dark);
	}
</style>
