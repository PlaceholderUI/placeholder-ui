<script lang="ts">
	import type { Editor } from '@tiptap/core';
	import ToolbarButton from './ToolbarButton.svelte';
	import { iconAlertTriangle } from '$lib/icon/index.js';

	interface Props {
		editor: Editor;
	}

	let { editor }: Props = $props();

	let showDialog = $state(false);
	let dialogElement: HTMLDivElement | undefined = $state();
	let titleInputElement: HTMLInputElement | undefined = $state();
	let selectedVariant = $state('default');
	let alertTitle = $state('Alert');

	const variants = [
		{ value: 'default', label: 'Default', color: 'var(--ui-accent)' },
		{ value: 'warning', label: 'Warning', color: '#ffc107' },
		{ value: 'danger', label: 'Danger', color: '#dc3545' }
	];

	const toggleDialog = () => {
		showDialog = !showDialog;
		if (showDialog) {
			// Focus and select the title input when dialog opens
			setTimeout(() => {
				titleInputElement?.focus();
				titleInputElement?.select();
			}, 0);
		}
	};

	const insertAlert = () => {
		editor
			.chain()
			.focus()
			.setAlert({
				variant: selectedVariant,
				title: alertTitle || 'Alert'
			})
			.run();

		showDialog = false;
		// Reset to defaults
		selectedVariant = 'default';
		alertTitle = 'Alert';
	};

	const closeDialog = () => {
		showDialog = false;
		selectedVariant = 'default';
		alertTitle = 'Alert';
	};
</script>

<div style="position: relative; display: inline-block;">
	<ToolbarButton
		icon={iconAlertTriangle}
		title="Insert Alert"
		active={showDialog}
		onclick={toggleDialog}
	/>

	{#if showDialog}
		<div class="alert-dialog" bind:this={dialogElement}>
			<div class="dialog-header">
				<h4>Insert Alert</h4>
			</div>

			<div class="dialog-body">
				<div class="form-group">
					<label for="alert-title">Title</label>
					<input
						id="alert-title"
						type="text"
						bind:this={titleInputElement}
						bind:value={alertTitle}
						placeholder="Enter alert title"
						class="form-input"
					/>
				</div>

				<div class="form-group">
					<label for="alert-variants">Variant</label>
					<div
						id="alert-variants"
						class="variant-grid"
						role="group"
						aria-label="Alert variant selection"
					>
						{#each variants as variant}
							<button
								class="variant-button"
								class:active={selectedVariant === variant.value}
								style="border-left: 4px solid {variant.color}"
								onclick={() => (selectedVariant = variant.value)}
								type="button"
							>
								{variant.label}
							</button>
						{/each}
					</div>
				</div>
			</div>

			<div class="dialog-footer">
				<button class="btn btn-secondary" onclick={closeDialog} type="button"> Cancel </button>
				<button class="btn btn-primary" onclick={insertAlert} type="button"> Insert </button>
			</div>
		</div>
	{/if}
</div>

<style>
	.alert-dialog {
		position: absolute;
		top: 100%;
		right: 0;
		margin-top: 4px;
		display: flex;
		flex-direction: column;
		background: var(--paper-body-bg);
		border: 1px solid var(--border-color);
		border-radius: 6px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		z-index: 1000;
		min-width: 300px;
		max-width: 350px;
	}

	:global(.dark) .alert-dialog {
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
		gap: 16px;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.form-group label {
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

	.form-input:focus {
		outline: none;
		border-color: var(--ui-primary);
	}

	:global(.dark) .form-input:focus {
		border-color: var(--ui-accent);
	}

	.variant-grid {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.variant-button {
		width: 100%;
		padding: 10px 12px;
		border: 1px solid var(--border-color);
		border-radius: 4px;
		background: var(--paper-body-bg);
		color: var(--text-color);
		font-size: 13px;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.15s ease;
		text-align: left;
	}

	.variant-button:hover {
		background: var(--page-bg);
	}

	.variant-button.active {
		background: var(--page-bg);
		border-color: var(--ui-primary);
		font-weight: 600;
	}

	:global(.dark) .variant-button.active {
		border-color: var(--ui-accent);
	}

	.dialog-footer {
		padding: 12px 16px;
		border-top: 1px solid var(--border-color);
		display: flex;
		gap: 8px;
		justify-content: flex-end;
	}

	.btn {
		padding: 6px 16px;
		border: none;
		border-radius: 4px;
		font-size: 13px;
		font-weight: 500;
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
</style>
