<script lang="ts">
	import type { Editor } from '@tiptap/core';
	import ToolbarButton from './ToolbarButton.svelte';
	import { iconPalette } from '$lib/icon/index.js';

	export interface ColorSwatch {
		/** CSS colour value applied to the text */
		value: string;
		/** Accessible label / tooltip */
		label: string;
	}

	interface Props {
		editor: Editor;
		/**
		 * Swatches shown under "Brand Colors". Defaults to the library's `--ui-*`
		 * tokens, so they follow whatever theme is applied.
		 */
		brandColors?: ColorSwatch[];
	}

	/** Default brand swatches, resolved from the theme tokens at click time. */
	export const defaultBrandColors: ColorSwatch[] = [
		{ value: 'var(--ui-primary)', label: 'Primary' },
		{ value: 'var(--ui-accent)', label: 'Accent' },
		{ value: 'var(--ui-accent-dark)', label: 'Accent Dark' },
		{ value: 'var(--ui-tertiary)', label: 'Tertiary' },
		{ value: 'var(--ui-tertiary-dark)', label: 'Tertiary Dark' }
	];

	let { editor, brandColors = defaultBrandColors }: Props = $props();

	/** Resolve `var(--x)` to a concrete colour so the stored HTML is portable. */
	const resolveColor = (color: string) => {
		const match = color.match(/^var\((--[^,)]+)/);
		if (!match || typeof document === 'undefined') return color;
		const resolved = getComputedStyle(document.documentElement).getPropertyValue(match[1]).trim();
		if (!resolved) return color;
		// Tokens such as `--ui-primary` are themselves `rgb(var(--ui-primary-rgb))`
		const nested = resolved.match(/^rgb\(var\((--[^)]+)\)\)$/);
		if (nested) {
			const triplet = getComputedStyle(document.documentElement).getPropertyValue(nested[1]).trim();
			return triplet ? `rgb(${triplet})` : color;
		}
		return resolved;
	};

	let showColorPicker = $state(false);
	let colorPickerElement: HTMLDivElement | undefined = $state();
	let selectedColor = $state('#000000');

	const toggleColorPicker = () => {
		const currentColor = editor.getAttributes('textStyle')?.color;
		if (currentColor) {
			selectedColor = currentColor;
		}
		showColorPicker = !showColorPicker;
	};

	const applyColor = (color: string) => {
		const resolved = resolveColor(color);
		editor.chain().focus().setColor(resolved).run();
		selectedColor = resolved;
	};

	const removeColor = () => {
		editor.chain().focus().unsetColor().run();
		showColorPicker = false;
	};
</script>

<div style="position: relative; display: inline-block;">
	<ToolbarButton
		icon={iconPalette}
		title="Text Color"
		active={showColorPicker}
		onclick={toggleColorPicker}
	/>

	{#if showColorPicker}
		<div class="color-picker-dropdown" bind:this={colorPickerElement}>
			<!-- Brand Colors Section -->
			<div class="color-section-title">Brand Colors</div>
			<div class="color-preset-grid">
				{#each brandColors as swatch}
					<button
						type="button"
						class="color-preset"
						style="background: {swatch.value}"
						onclick={() => applyColor(swatch.value)}
						title={swatch.label}
						aria-label={swatch.label}
					></button>
				{/each}
			</div>

			<!-- Common Colors Section -->
			<div class="color-section-title">Common Colors</div>
			<div class="color-preset-grid">
				<button
					type="button"
					class="color-preset"
					style="background: #000000"
					onclick={() => applyColor('#000000')}
					title="Black"
					aria-label="Black"
				></button>
				<button
					type="button"
					class="color-preset"
					style="background: #495057"
					onclick={() => applyColor('#495057')}
					title="Gray"
					aria-label="Gray"
				></button>
				<button
					type="button"
					class="color-preset"
					style="background: #fa5252"
					onclick={() => applyColor('#fa5252')}
					title="Red"
					aria-label="Red"
				></button>
				<button
					type="button"
					class="color-preset"
					style="background: #ff922b"
					onclick={() => applyColor('#ff922b')}
					title="Orange"
					aria-label="Orange"
				></button>
				<button
					type="button"
					class="color-preset"
					style="background: #fcc419"
					onclick={() => applyColor('#fcc419')}
					title="Yellow"
					aria-label="Yellow"
				></button>
				<button
					type="button"
					class="color-preset"
					style="background: #51cf66"
					onclick={() => applyColor('#51cf66')}
					title="Green"
					aria-label="Green"
				></button>
				<button
					type="button"
					class="color-preset"
					style="background: #22b8cf"
					onclick={() => applyColor('#22b8cf')}
					title="Cyan"
					aria-label="Cyan"
				></button>
				<button
					type="button"
					class="color-preset"
					style="background: #228be6"
					onclick={() => applyColor('#228be6')}
					title="Blue"
					aria-label="Blue"
				></button>
				<button
					type="button"
					class="color-preset"
					style="background: #9775fa"
					onclick={() => applyColor('#9775fa')}
					title="Purple"
					aria-label="Purple"
				></button>
				<button
					type="button"
					class="color-preset"
					style="background: #f06595"
					onclick={() => applyColor('#f06595')}
					title="Pink"
					aria-label="Pink"
				></button>
			</div>
			<div class="color-input-row">
				<input
					type="color"
					bind:value={selectedColor}
					oninput={(e) => applyColor((e.target as HTMLInputElement).value)}
					class="color-input"
					title="Custom Color"
				/>
				<button
					type="button"
					onclick={removeColor}
					class="color-remove-button"
					title="Remove Color"
				>
					Clear
				</button>
			</div>
		</div>
	{/if}
</div>

<style>
	.color-picker-dropdown {
		position: absolute;
		top: 100%;
		left: 0;
		margin-top: 4px;
		display: flex;
		flex-direction: column;
		gap: 8px;
		padding: 12px;
		background: var(--paper-body-bg);
		border: 1px solid var(--border-color);
		border-radius: 4px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		z-index: 1000;
		min-width: 240px;
	}

	.color-section-title {
		font-size: 11px;
		font-weight: 600;
		color: var(--text-muted);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin-top: 4px;
		margin-bottom: 4px;
	}

	.color-section-title:first-child {
		margin-top: 0;
	}

	:global(.dark) .color-picker-dropdown {
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
	}

	.color-preset-grid {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 8px;
	}

	.color-preset {
		width: 32px;
		height: 32px;
		border: 2px solid var(--border-color);
		border-radius: 4px;
		cursor: pointer;
		transition: all 0.15s ease;
		padding: 0;
	}

	.color-preset:hover {
		border-color: var(--ui-primary);
		transform: scale(1.1);
	}

	:global(.dark) .color-preset:hover {
		border-color: var(--ui-accent);
	}

	.color-input-row {
		display: flex;
		gap: 8px;
		align-items: center;
		padding-top: 8px;
		border-top: 1px solid var(--border-color);
	}

	.color-input {
		flex: 1;
		height: 36px;
		border: 1px solid var(--border-color);
		border-radius: 4px;
		cursor: pointer;
		padding: 2px;
		background: var(--paper-body-bg);
	}

	.color-input::-webkit-color-swatch-wrapper {
		padding: 2px;
	}

	.color-input::-webkit-color-swatch {
		border: none;
		border-radius: 2px;
	}

	.color-remove-button {
		padding: 6px 12px;
		border: none;
		background: var(--ui-tertiary);
		color: var(--ui-primary);
		border-radius: 4px;
		cursor: pointer;
		font-size: 13px;
		font-weight: 500;
		transition: background 0.15s ease;
		white-space: nowrap;
	}

	.color-remove-button:hover {
		background: var(--ui-tertiary-dark);
	}

	:global(.dark) .color-remove-button {
		background: var(--ui-accent);
		color: var(--ui-primary);
	}

	:global(.dark) .color-remove-button:hover {
		background: var(--ui-accent-dark);
	}
</style>
