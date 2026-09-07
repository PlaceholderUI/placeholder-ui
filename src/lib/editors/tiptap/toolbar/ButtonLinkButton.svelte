<script lang="ts">
	import type { Editor, JSONContent } from '@tiptap/core';
	import ToolbarButton from './ToolbarButton.svelte';
	import { iconButton } from '../../../icon/index.js';
	import {
		editorButtonClass,
		parseEditorButtonClass,
		type EditorButtonSize,
		type EditorButtonVariant
	} from '../buttonLink.js';

	interface Props {
		editor: Editor;
	}

	let { editor }: Props = $props();

	let showDialog = $state(false);
	let label = $state('');
	let url = $state('');
	let variant = $state<EditorButtonVariant>('primary');
	let size = $state<EditorButtonSize>('md');
	let openInNewTab = $state(false);
	/** The dialog opened on an existing link, which Apply rewrites in place. */
	let editing = $state(false);
	let labelInputElement: HTMLInputElement | undefined = $state();
	let urlInputElement: HTMLInputElement | undefined = $state();

	const variants: { value: EditorButtonVariant; label: string }[] = [
		{ value: 'primary', label: 'Primary' },
		{ value: 'accent', label: 'Accent' },
		{ value: 'tertiary', label: 'Tertiary' },
		{ value: 'primary-outline', label: 'Primary outline' },
		{ value: 'accent-outline', label: 'Accent outline' }
	];

	const sizes: { value: EditorButtonSize; label: string }[] = [
		{ value: 'sm', label: 'Small' },
		{ value: 'md', label: 'Medium' },
		{ value: 'lg', label: 'Large' }
	];

	const isButton = $derived(parseEditorButtonClass(editor.getAttributes('link').class) !== null);

	function selectionText(): string {
		const { from, to } = editor.state.selection;
		return editor.state.doc.textBetween(from, to, ' ');
	}

	const toggleDialog = () => {
		if (showDialog) {
			closeDialog();
			return;
		}

		editing = editor.isActive('link');
		if (editing) {
			// Work on the whole link, whatever part of it the cursor is in.
			editor.chain().extendMarkRange('link').run();
		}

		const attrs = editor.getAttributes('link') as {
			href?: string;
			target?: string | null;
			class?: string | null;
		};
		const style = parseEditorButtonClass(attrs.class);

		url = attrs.href ?? '';
		openInNewTab = attrs.target === '_blank';
		variant = style?.variant ?? 'primary';
		size = style?.size ?? 'md';
		label = selectionText();
		showDialog = true;

		setTimeout(() => {
			const input = label ? urlInputElement : labelInputElement;
			input?.focus();
			input?.select();
		}, 0);
	};

	const applyButton = () => {
		const href = url.trim();
		if (!href) {
			urlInputElement?.focus();
			return;
		}

		const text = label.trim() || href;
		const attrs = {
			href,
			target: openInNewTab ? '_blank' : null,
			rel: openInNewTab ? 'noopener noreferrer' : null,
			class: editorButtonClass({ variant, size })
		};
		const content: JSONContent[] = [{ type: 'text', text, marks: [{ type: 'link', attrs }] }];
		// A button typed in at the cursor gets a space after it, so what is typed
		// next does not extend the button.
		if (!editing && editor.state.selection.empty) {
			content.push({ type: 'text', text: ' ' });
		}

		const chain = editor.chain().focus();
		if (editing) chain.extendMarkRange('link');
		chain.insertContent(content).run();

		closeDialog();
	};

	const removeButton = () => {
		editor.chain().focus().extendMarkRange('link').unsetLink().run();
		closeDialog();
	};

	const closeDialog = () => {
		showDialog = false;
		editing = false;
		label = '';
		url = '';
		variant = 'primary';
		size = 'md';
		openInNewTab = false;
	};

	const handleKeydown = (event: KeyboardEvent) => {
		if (event.key === 'Enter') {
			event.preventDefault();
			applyButton();
		} else if (event.key === 'Escape') {
			event.preventDefault();
			closeDialog();
			editor.commands.focus();
		}
	};
</script>

<div style="position: relative; display: inline-block;">
	<ToolbarButton icon={iconButton} title="Button" active={isButton} onclick={toggleDialog} />

	{#if showDialog}
		<div class="button-dialog" role="dialog" aria-label="Button">
			<div class="dialog-header">
				<h4>{editing ? 'Edit button' : 'Insert button'}</h4>
			</div>

			<div class="dialog-body">
				<div class="form-group">
					<label for="button-link-label">Text</label>
					<input
						id="button-link-label"
						type="text"
						bind:this={labelInputElement}
						bind:value={label}
						onkeydown={handleKeydown}
						placeholder="Button text"
						class="form-input"
					/>
				</div>

				<div class="form-group">
					<label for="button-link-url">URL</label>
					<input
						id="button-link-url"
						type="text"
						bind:this={urlInputElement}
						bind:value={url}
						onkeydown={handleKeydown}
						placeholder="Enter URL"
						class="form-input"
					/>
				</div>

				<div class="form-group">
					<span class="group-label" id="button-link-style">Style</span>
					<div class="option-row" role="group" aria-labelledby="button-link-style">
						{#each variants as option (option.value)}
							<button
								class="editor-button editor-button-{option.value} editor-button-sm option-button"
								class:selected={variant === option.value}
								onclick={() => (variant = option.value)}
								type="button"
							>
								{option.label}
							</button>
						{/each}
					</div>
				</div>

				<div class="form-group">
					<span class="group-label" id="button-link-size">Size</span>
					<div class="option-row" role="group" aria-labelledby="button-link-size">
						{#each sizes as option (option.value)}
							<button
								class="size-button"
								class:active={size === option.value}
								onclick={() => (size = option.value)}
								type="button"
							>
								{option.label}
							</button>
						{/each}
					</div>
				</div>

				<label class="checkbox-label">
					<input type="checkbox" bind:checked={openInNewTab} class="checkbox" />
					<span>Open in new tab</span>
				</label>
			</div>

			<div class="dialog-footer">
				{#if editing}
					<button class="btn btn-remove" onclick={removeButton} type="button">Remove</button>
				{/if}
				<span class="footer-spacer"></span>
				<button class="btn btn-secondary" onclick={closeDialog} type="button">Cancel</button>
				<button class="btn btn-primary" onclick={applyButton} type="button">
					{editing ? 'Apply' : 'Insert'}
				</button>
			</div>
		</div>
	{/if}
</div>

<style>
	.button-dialog {
		position: absolute;
		top: 100%;
		left: 0;
		margin-top: 4px;
		display: flex;
		flex-direction: column;
		background: var(--paper-body-bg);
		border: 1px solid var(--border-color);
		border-radius: 6px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		z-index: 1000;
		width: 360px;
		max-width: calc(100vw - 32px);
	}

	:global(.dark) .button-dialog {
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
	}

	.dialog-header {
		padding: 12px 16px;
		border-bottom: 1px solid var(--border-color);
	}

	.dialog-header h4 {
		margin: 0;
		font-size: 14px;
		font-weight: 600;
		color: var(--text-color);
	}

	.dialog-body {
		padding: 16px;
		display: flex;
		flex-direction: column;
		gap: 14px;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.form-group label,
	.group-label {
		font-size: 12px;
		font-weight: 600;
		color: var(--text-color);
	}

	.form-input {
		padding: 8px 12px;
		border: 1px solid var(--border-color);
		border-radius: 4px;
		background: var(--input-bg);
		color: var(--text-color);
		font-size: 13px;
		font-family: inherit;
	}

	.form-input::placeholder {
		color: var(--placeholder-color);
	}

	.form-input:focus {
		outline: none;
		border-color: var(--ui-primary);
	}

	:global(.dark) .form-input:focus {
		border-color: var(--ui-accent);
	}

	.option-row {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	/* The style choices are drawn with the real button classes from app.css; the
	   ring marks the selected one. */
	.option-button {
		cursor: pointer;
		font-family: inherit;
	}

	.option-button.selected {
		outline: 2px solid var(--ui-primary);
		outline-offset: 2px;
	}

	:global(.dark) .option-button.selected {
		outline-color: var(--ui-accent);
	}

	.size-button {
		padding: 6px 12px;
		border: 1px solid var(--border-color);
		border-radius: 4px;
		background: var(--paper-body-bg);
		color: var(--text-color);
		font-size: 13px;
		font-family: inherit;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.size-button:hover {
		background: var(--page-bg);
	}

	.size-button.active {
		background: var(--page-bg);
		border-color: var(--ui-primary);
		font-weight: 600;
	}

	:global(.dark) .size-button.active {
		border-color: var(--ui-accent);
	}

	.checkbox-label {
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 13px;
		color: var(--text-color);
		cursor: pointer;
		user-select: none;
	}

	.checkbox {
		width: 16px;
		height: 16px;
		cursor: pointer;
		accent-color: var(--ui-primary);
	}

	:global(.dark) .checkbox {
		accent-color: var(--ui-accent);
	}

	.dialog-footer {
		padding: 12px 16px;
		border-top: 1px solid var(--border-color);
		display: flex;
		gap: 8px;
		align-items: center;
	}

	.footer-spacer {
		flex: 1;
	}

	.btn {
		padding: 6px 16px;
		border: none;
		border-radius: 4px;
		font-size: 13px;
		font-weight: 500;
		font-family: inherit;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.btn-secondary {
		background: var(--page-bg);
		color: var(--text-color);
		border: 1px solid var(--border-color);
	}

	.btn-secondary:hover {
		background: var(--border-color);
	}

	.btn-primary {
		background: var(--ui-primary);
		color: var(--off-white);
	}

	.btn-primary:hover {
		opacity: 0.9;
	}

	:global(.dark) .btn-primary {
		background: var(--ui-accent);
		color: var(--ui-primary);
	}

	.btn-remove {
		background: transparent;
		color: var(--danger-text);
		border: 1px solid var(--border-color);
	}

	.btn-remove:hover {
		background: var(--danger-bg-subtle);
	}
</style>
