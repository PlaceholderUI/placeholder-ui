<script module lang="ts">
	import type { Snippet } from 'svelte';

	export type ColorFormat = 'hex' | 'rgb' | 'hsl';

	export interface ColorPickerProps {
		/** HTML name attribute for the input (falls back to label, then auto-generated) */
		name?: string;
		/** Label text displayed above the picker */
		label?: string;
		/** Custom ID for the input element */
		inputId?: string;
		/** Placeholder text when no colour is set */
		placeholder?: string;
		/** Mark field as required (shows asterisk) */
		required?: boolean;
		/** Disable the picker */
		disabled?: boolean;
		/** CSS classes for the container element */
		containerClass?: string;
		/** CSS classes for the input element */
		class?: string;
		/**
		 * Selected colour (bindable). Always stored as a hex string, e.g. `#1e3a5f`,
		 * or `#1e3a5f80` when `allowAlpha` is set and the colour is not fully opaque.
		 */
		value?: string;
		/** Allow selecting transparency; value becomes 8-digit hex when alpha < 1 */
		allowAlpha?: boolean;
		/** Preset swatches shown below the picker area */
		swatches?: string[];
		/** Hide the editable text input beside the swatch */
		hideInput?: boolean;
		/** Hide the eyedropper button (only shown when the browser supports it) */
		hideEyeDropper?: boolean;
		/** Which text format to show in the popup's readout */
		format?: ColorFormat;
		/** Show error state styling */
		showError?: boolean;
		/** Error message to display */
		errorText?: string;
		/** Position of the tooltip */
		tooltipLocation?: 'top' | 'bottom' | 'left' | 'right';
		/** Rich tooltip content using a Svelte snippet */
		tooltipContent?: Snippet;
		/** Simple tooltip text */
		tooltipText?: string;
		/** Callback when the colour changes (fires on every drag step) */
		onchange?: (value: string) => void;
	}

	export type Rgb = { r: number; g: number; b: number; a: number };
	export type Hsv = { h: number; s: number; v: number; a: number };

	const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

	/** Parse a hex string (#rgb, #rgba, #rrggbb, #rrggbbaa) into RGB(A). Returns undefined if invalid. */
	export function parseHex(input: string | undefined): Rgb | undefined {
		if (!input) return undefined;
		let hex = input.trim().replace(/^#/, '');
		if (!/^[0-9a-f]{3,8}$/i.test(hex)) return undefined;
		if (hex.length === 3 || hex.length === 4) {
			hex = hex
				.split('')
				.map((c) => c + c)
				.join('');
		}
		if (hex.length !== 6 && hex.length !== 8) return undefined;
		const r = parseInt(hex.slice(0, 2), 16);
		const g = parseInt(hex.slice(2, 4), 16);
		const b = parseInt(hex.slice(4, 6), 16);
		const a = hex.length === 8 ? parseInt(hex.slice(6, 8), 16) / 255 : 1;
		return { r, g, b, a };
	}

	/** Format RGB(A) as a hex string. Alpha is only appended when < 1. */
	export function toHex({ r, g, b, a }: Rgb): string {
		const p = (n: number) => clamp(Math.round(n), 0, 255).toString(16).padStart(2, '0');
		const base = `#${p(r)}${p(g)}${p(b)}`;
		return a < 1 ? `${base}${p(a * 255)}` : base;
	}

	export function rgbToHsv({ r, g, b, a }: Rgb): Hsv {
		const rn = r / 255,
			gn = g / 255,
			bn = b / 255;
		const max = Math.max(rn, gn, bn);
		const min = Math.min(rn, gn, bn);
		const d = max - min;
		let h = 0;
		if (d !== 0) {
			if (max === rn) h = ((gn - bn) / d) % 6;
			else if (max === gn) h = (bn - rn) / d + 2;
			else h = (rn - gn) / d + 4;
			h *= 60;
			if (h < 0) h += 360;
		}
		const s = max === 0 ? 0 : d / max;
		return { h, s, v: max, a };
	}

	export function hsvToRgb({ h, s, v, a }: Hsv): Rgb {
		const c = v * s;
		const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
		const m = v - c;
		let rn = 0,
			gn = 0,
			bn = 0;
		if (h < 60) [rn, gn, bn] = [c, x, 0];
		else if (h < 120) [rn, gn, bn] = [x, c, 0];
		else if (h < 180) [rn, gn, bn] = [0, c, x];
		else if (h < 240) [rn, gn, bn] = [0, x, c];
		else if (h < 300) [rn, gn, bn] = [x, 0, c];
		else [rn, gn, bn] = [c, 0, x];
		return { r: (rn + m) * 255, g: (gn + m) * 255, b: (bn + m) * 255, a };
	}

	export function rgbToHsl({ r, g, b, a }: Rgb): { h: number; s: number; l: number; a: number } {
		const rn = r / 255,
			gn = g / 255,
			bn = b / 255;
		const max = Math.max(rn, gn, bn);
		const min = Math.min(rn, gn, bn);
		const l = (max + min) / 2;
		const d = max - min;
		let h = 0,
			s = 0;
		if (d !== 0) {
			s = d / (1 - Math.abs(2 * l - 1));
			if (max === rn) h = ((gn - bn) / d) % 6;
			else if (max === gn) h = (bn - rn) / d + 2;
			else h = (rn - gn) / d + 4;
			h *= 60;
			if (h < 0) h += 360;
		}
		return { h, s, l, a };
	}

	/** Format a colour in the requested CSS notation. */
	export function formatColor(rgb: Rgb, format: ColorFormat): string {
		const r = Math.round(rgb.r),
			g = Math.round(rgb.g),
			b = Math.round(rgb.b);
		const alpha = Math.round(rgb.a * 100) / 100;
		switch (format) {
			case 'rgb':
				return rgb.a < 1 ? `rgba(${r}, ${g}, ${b}, ${alpha})` : `rgb(${r}, ${g}, ${b})`;
			case 'hsl': {
				const { h, s, l } = rgbToHsl(rgb);
				const hs = Math.round(h),
					ss = Math.round(s * 100),
					ls = Math.round(l * 100);
				return rgb.a < 1 ? `hsla(${hs}, ${ss}%, ${ls}%, ${alpha})` : `hsl(${hs}, ${ss}%, ${ls}%)`;
			}
			default:
				return toHex(rgb);
		}
	}

	/** Parse any of hex / rgb() / hsl() into RGB(A). Returns undefined if invalid. */
	export function parseColor(input: string | undefined): Rgb | undefined {
		if (!input) return undefined;
		const s = input.trim();
		const hex = parseHex(s);
		if (hex) return hex;

		const rgbMatch = s.match(
			/^rgba?\(\s*(\d{1,3})\s*[, ]\s*(\d{1,3})\s*[, ]\s*(\d{1,3})\s*(?:[,/]\s*([\d.]+%?)\s*)?\)$/i
		);
		if (rgbMatch) {
			const a = parseAlpha(rgbMatch[4]);
			return {
				r: clamp(+rgbMatch[1], 0, 255),
				g: clamp(+rgbMatch[2], 0, 255),
				b: clamp(+rgbMatch[3], 0, 255),
				a
			};
		}

		const hslMatch = s.match(
			/^hsla?\(\s*([\d.]+)\s*[, ]\s*([\d.]+)%\s*[, ]\s*([\d.]+)%\s*(?:[,/]\s*([\d.]+%?)\s*)?\)$/i
		);
		if (hslMatch) {
			const h = ((+hslMatch[1] % 360) + 360) % 360;
			const sl = clamp(+hslMatch[2] / 100, 0, 1);
			const l = clamp(+hslMatch[3] / 100, 0, 1);
			const a = parseAlpha(hslMatch[4]);
			// hsl -> hsv
			const v = l + sl * Math.min(l, 1 - l);
			const sv = v === 0 ? 0 : 2 * (1 - l / v);
			return hsvToRgb({ h, s: sv, v, a });
		}
		return undefined;
	}

	function parseAlpha(raw: string | undefined): number {
		if (raw === undefined) return 1;
		if (raw.endsWith('%')) return clamp(parseFloat(raw) / 100, 0, 1);
		return clamp(parseFloat(raw), 0, 1);
	}
</script>

<script lang="ts">
	import { fade } from 'svelte/transition';
	import FormGroup from '$lib/form/FormGroup.svelte';
	import ActionIcon from '$lib/ui/ActionIcon.svelte';
	import { clickOutside } from '$lib/util/ClickOutside.js';
	import { floating } from '$lib/util/Floating.js';
	import { iconX, iconPalette } from '$lib/icon/index.js';

	const autoName = `colorpicker-${crypto.randomUUID()}`;

	let {
		name,
		label = '',
		inputId = undefined,
		placeholder = 'Select colour',
		required = false,
		disabled = false,
		containerClass = '',
		class: classes = '',
		value = $bindable(''),
		allowAlpha = false,
		swatches = [],
		hideInput = false,
		hideEyeDropper = false,
		format = 'hex',
		showError = false,
		errorText = '',
		tooltipLocation = 'top',
		tooltipContent = undefined,
		tooltipText = undefined,
		onchange = undefined
	}: ColorPickerProps = $props();

	let resolvedName = $derived((name || label || autoName).replace(/[^a-zA-Z0-9_\-:.]/g, '_'));

	let id = $derived.by(() => {
		if (inputId) return inputId;
		if (label) return `colorpicker-${label.toLowerCase().replace(/ /g, '-')}`;
		return Math.random().toString(36).substring(2, 8);
	});

	// --- Internal colour state -------------------------------------------------
	// HSV is the working model so that hue is preserved while the colour is black/white/grey.
	let hsv: Hsv = $state({ h: 210, s: 0.68, v: 0.37, a: 1 });
	let lastEmitted = '';

	// Sync incoming value -> hsv (only when it changed externally).
	$effect(() => {
		if (value === lastEmitted) return;
		const parsed = parseColor(value);
		if (parsed) {
			hsv = rgbToHsv(allowAlpha ? parsed : { ...parsed, a: 1 });
		}
		lastEmitted = value;
	});

	const rgb = $derived(hsvToRgb(hsv));
	const hex = $derived(toHex(rgb));
	const hexOpaque = $derived(toHex({ ...rgb, a: 1 }));
	const readout = $derived(formatColor(rgb, format));
	const hasValue = $derived(!!parseColor(value));

	function commit() {
		const next = toHex(allowAlpha ? rgb : { ...rgb, a: 1 });
		lastEmitted = next;
		value = next;
		onchange?.(next);
	}

	function setFromRgb(next: Rgb | undefined) {
		if (!next) return;
		hsv = rgbToHsv(allowAlpha ? next : { ...next, a: 1 });
		commit();
	}

	function clear() {
		lastEmitted = '';
		value = '';
		onchange?.('');
	}

	// --- Text input ------------------------------------------------------------
	let textValue = $state('');
	let textFocused = $state(false);

	$effect(() => {
		if (!textFocused) textValue = hasValue ? hex : '';
	});

	function onTextInput() {
		const parsed = parseColor(textValue);
		if (parsed) setFromRgb(parsed);
	}

	function onTextBlur() {
		textFocused = false;
		if (textValue.trim() === '') {
			clear();
			return;
		}
		const parsed = parseColor(textValue);
		if (parsed) setFromRgb(parsed);
		else textValue = hasValue ? hex : '';
	}

	// --- Popup -----------------------------------------------------------------
	let open = $state(false);
	let triggerEl: HTMLElement | undefined = $state();

	function toggle() {
		if (disabled) return;
		open = !open;
	}

	function onClickOutside(event: MouseEvent) {
		if (!open) return;
		if (triggerEl?.contains(event.target as Node)) return;
		open = false;
	}

	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && open) {
			open = false;
			e.stopPropagation();
		}
	}

	// --- Pointer dragging ------------------------------------------------------
	type DragKind = 'sv' | 'hue' | 'alpha';

	function drag(node: HTMLElement, kind: DragKind) {
		function update(e: PointerEvent) {
			const rect = node.getBoundingClientRect();
			const x = clamp((e.clientX - rect.left) / rect.width, 0, 1);
			const y = clamp((e.clientY - rect.top) / rect.height, 0, 1);
			if (kind === 'sv') hsv = { ...hsv, s: x, v: 1 - y };
			else if (kind === 'hue') hsv = { ...hsv, h: x * 360 };
			else hsv = { ...hsv, a: x };
			commit();
		}
		function down(e: PointerEvent) {
			if (disabled || e.button !== 0) return;
			e.preventDefault();
			node.setPointerCapture(e.pointerId);
			node.focus();
			update(e);
			node.addEventListener('pointermove', update);
			node.addEventListener('pointerup', up, { once: true });
			node.addEventListener('pointercancel', up, { once: true });
		}
		function up(e: PointerEvent) {
			node.removeEventListener('pointermove', update);
			node.releasePointerCapture(e.pointerId);
		}
		node.addEventListener('pointerdown', down);
		return {
			destroy() {
				node.removeEventListener('pointerdown', down);
			}
		};
	}

	function onSvKeydown(e: KeyboardEvent) {
		const step = e.shiftKey ? 0.1 : 0.01;
		let handled = true;
		switch (e.key) {
			case 'ArrowLeft':
				hsv = { ...hsv, s: clamp(hsv.s - step, 0, 1) };
				break;
			case 'ArrowRight':
				hsv = { ...hsv, s: clamp(hsv.s + step, 0, 1) };
				break;
			case 'ArrowUp':
				hsv = { ...hsv, v: clamp(hsv.v + step, 0, 1) };
				break;
			case 'ArrowDown':
				hsv = { ...hsv, v: clamp(hsv.v - step, 0, 1) };
				break;
			default:
				handled = false;
		}
		if (handled) {
			e.preventDefault();
			commit();
		}
	}

	function onSliderKeydown(e: KeyboardEvent, kind: 'hue' | 'alpha') {
		const dir =
			e.key === 'ArrowRight' || e.key === 'ArrowUp'
				? 1
				: e.key === 'ArrowLeft' || e.key === 'ArrowDown'
					? -1
					: 0;
		if (!dir && e.key !== 'Home' && e.key !== 'End') return;
		e.preventDefault();
		if (kind === 'hue') {
			const step = e.shiftKey ? 10 : 1;
			let h = e.key === 'Home' ? 0 : e.key === 'End' ? 360 : hsv.h + dir * step;
			hsv = { ...hsv, h: ((h % 360) + 360) % 360 };
		} else {
			const step = e.shiftKey ? 0.1 : 0.01;
			const a = e.key === 'Home' ? 0 : e.key === 'End' ? 1 : hsv.a + dir * step;
			hsv = { ...hsv, a: clamp(a, 0, 1) };
		}
		commit();
	}

	// --- EyeDropper ------------------------------------------------------------
	type EyeDropperCtor = new () => { open(): Promise<{ sRGBHex: string }> };
	const eyeDropperSupported = $derived(
		typeof window !== 'undefined' && 'EyeDropper' in window && !hideEyeDropper
	);

	async function pickFromScreen() {
		try {
			const Ctor = (window as unknown as { EyeDropper: EyeDropperCtor }).EyeDropper;
			const result = await new Ctor().open();
			setFromRgb(parseHex(result.sRGBHex));
		} catch {
			// user cancelled
		}
	}

	const hueColor = $derived(toHex(hsvToRgb({ h: hsv.h, s: 1, v: 1, a: 1 })));
</script>

<div class="colorpicker-container {containerClass}" onkeydown={onKeydown} role="presentation">
	<FormGroup {label} {required} {id} {tooltipLocation} {tooltipContent} {tooltipText}>
		<div class="colorpicker">
			<div
				class="trigger {classes}"
				class:disabled
				class:show-error={showError}
				class:open
				class:no-input={hideInput}
				bind:this={triggerEl}
			>
				<button
					type="button"
					class="swatch-button"
					aria-label={hasValue
						? `Selected colour ${hex}. Open colour picker`
						: 'Open colour picker'}
					aria-expanded={open}
					aria-haspopup="dialog"
					{disabled}
					onclick={toggle}
				>
					<span class="checker">
						{#if hasValue}
							<span class="swatch" style:background={hex}></span>
						{:else}
							<span class="swatch empty"></span>
						{/if}
					</span>
				</button>

				{#if hideInput}
					<button type="button" class="readout-button" {disabled} onclick={toggle}>
						{hasValue ? readout : placeholder}
					</button>
				{:else}
					<input
						{id}
						name={resolvedName}
						class="text-input"
						type="text"
						autocomplete="off"
						spellcheck="false"
						{placeholder}
						{disabled}
						{required}
						bind:value={textValue}
						onfocus={() => (textFocused = true)}
						oninput={onTextInput}
						onblur={onTextBlur}
						onkeydown={(e) => {
							if (e.key === 'Enter') {
								onTextBlur();
								textFocused = true;
							}
						}}
					/>
				{/if}

				{#if hasValue && !disabled}
					<div class="clear-button">
						<ActionIcon
							variant="secondary-subtle"
							svg={iconX}
							size="0.75rem"
							ariaLabel="Clear colour"
							onclick={(e: MouseEvent) => {
								clear();
								e.stopPropagation();
							}}
						/>
					</div>
				{/if}
			</div>

			{#if open}
				<!-- Rendered in the top layer so a scrolling Dialog body cannot clip it -->
				<div
					class="panel"
					role="dialog"
					aria-label="Colour picker"
					transition:fade={{ duration: 150 }}
					use:floating={{ anchor: () => triggerEl, placement: 'bottom-start', offset: 4 }}
					use:clickOutside={onClickOutside}
				>
					<div
						class="sv-area"
						style:background-color={hueColor}
						role="slider"
						tabindex="0"
						aria-label="Saturation and brightness"
						aria-valuemin={0}
						aria-valuemax={100}
						aria-valuenow={Math.round(hsv.v * 100)}
						aria-valuetext={`Saturation ${Math.round(hsv.s * 100)}%, brightness ${Math.round(hsv.v * 100)}%`}
						use:drag={'sv'}
						onkeydown={onSvKeydown}
					>
						<div
							class="handle"
							style:left={`${hsv.s * 100}%`}
							style:top={`${(1 - hsv.v) * 100}%`}
							style:background={hexOpaque}
						></div>
					</div>

					<div class="controls">
						{#if eyeDropperSupported}
							<ActionIcon
								svg={iconPalette}
								size="1.125rem"
								ariaLabel="Pick colour from screen"
								tooltip="Pick from screen"
								onclick={pickFromScreen}
							/>
						{/if}
						<div class="sliders">
							<div
								class="slider hue"
								role="slider"
								tabindex="0"
								aria-label="Hue"
								aria-valuemin={0}
								aria-valuemax={360}
								aria-valuenow={Math.round(hsv.h)}
								use:drag={'hue'}
								onkeydown={(e) => onSliderKeydown(e, 'hue')}
							>
								<div
									class="handle"
									style:left={`${(hsv.h / 360) * 100}%`}
									style:background={hueColor}
								></div>
							</div>
							{#if allowAlpha}
								<div
									class="slider alpha checker"
									role="slider"
									tabindex="0"
									aria-label="Opacity"
									aria-valuemin={0}
									aria-valuemax={100}
									aria-valuenow={Math.round(hsv.a * 100)}
									use:drag={'alpha'}
									onkeydown={(e) => onSliderKeydown(e, 'alpha')}
								>
									<div
										class="alpha-track"
										style:background={`linear-gradient(to right, transparent, ${hexOpaque})`}
									></div>
									<div class="handle" style:left={`${hsv.a * 100}%`} style:background={hex}></div>
								</div>
							{/if}
						</div>
					</div>

					<div class="readout" title={readout}>
						<span class="checker readout-swatch"
							><span class="swatch" style:background={hex}></span></span
						>
						<code>{readout}</code>
					</div>

					{#if swatches.length}
						<div class="swatches" role="listbox" aria-label="Preset colours">
							{#each swatches as swatch (swatch)}
								{@const parsed = parseColor(swatch)}
								{#if parsed}
									{@const swatchHex = toHex(parsed)}
									<button
										type="button"
										class="preset checker"
										class:selected={swatchHex.toLowerCase() === hex.toLowerCase()}
										role="option"
										aria-selected={swatchHex.toLowerCase() === hex.toLowerCase()}
										aria-label={swatch}
										title={swatch}
										onclick={() => setFromRgb(parsed)}
									>
										<span class="swatch" style:background={swatchHex}></span>
									</button>
								{/if}
							{/each}
						</div>
					{/if}
				</div>
			{/if}
		</div>
		{#if showError && errorText}
			<div class="text-error">{errorText}</div>
		{/if}
	</FormGroup>
</div>

<style>
	.colorpicker {
		position: relative;
	}

	/* ---- Trigger --------------------------------------------------------- */
	.trigger {
		display: flex;
		align-items: center;
		width: 100%;
		border: 1px solid var(--border-color);
		background-color: var(--input-bg-color);
		color: var(--text-color);
		border-radius: 0.25rem;
		box-sizing: border-box;
		position: relative;
		transition: border-color 0.15s ease;
	}

	.trigger:focus-within,
	.trigger.open {
		border-color: var(--accent-color);
	}

	.trigger.show-error {
		border-color: var(--danger-text);
	}

	.trigger.disabled {
		opacity: 0.5;
		cursor: not-allowed;
		background: var(--border-color);
	}

	.swatch-button {
		flex: 0 0 auto;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.25rem 0.5rem;
		background: none;
		border: none;
		border-right: 1px solid var(--border-color);
		cursor: pointer;
		line-height: 0;
	}

	.swatch-button:disabled {
		cursor: not-allowed;
	}

	.swatch-button:focus-visible {
		outline: 2px solid var(--accent-color);
		outline-offset: -2px;
		border-radius: 0.25rem;
	}

	.checker {
		display: inline-block;
		border-radius: 0.25rem;
		overflow: hidden;
		background-color: #fff;
		background-image:
			linear-gradient(45deg, #ccc 25%, transparent 25%),
			linear-gradient(-45deg, #ccc 25%, transparent 25%),
			linear-gradient(45deg, transparent 75%, #ccc 75%),
			linear-gradient(-45deg, transparent 75%, #ccc 75%);
		background-size: 8px 8px;
		background-position:
			0 0,
			0 4px,
			4px -4px,
			-4px 0;
	}

	.swatch-button .checker {
		width: 1.5rem;
		height: 1.5rem;
		box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.15);
	}

	.swatch {
		display: block;
		width: 100%;
		height: 100%;
	}

	.swatch.empty {
		background:
			linear-gradient(
				to top left,
				transparent calc(50% - 1px),
				var(--danger-text) calc(50% - 1px),
				var(--danger-text) calc(50% + 1px),
				transparent calc(50% + 1px)
			),
			var(--input-bg-color);
	}

	.text-input,
	.readout-button {
		flex: 1 1 auto;
		min-width: 0;
		font-size: 1rem;
		line-height: 1.5rem;
		padding: 0.25rem 0.5rem;
		padding-right: 1.75rem;
		border: none;
		background: transparent;
		color: var(--text-color);
		font-family: var(--ui-font-family, inherit);
		text-align: left;
	}

	.text-input:focus {
		outline: none;
	}

	.text-input::placeholder,
	.readout-button:empty {
		color: var(--placeholder-color);
	}

	.readout-button {
		cursor: pointer;
	}

	.readout-button:disabled {
		cursor: not-allowed;
	}

	.clear-button {
		position: absolute;
		right: 0.5rem;
		top: 50%;
		transform: translateY(-50%);
		line-height: 0;
	}

	.text-error {
		color: var(--danger-text);
		font-size: 0.875rem;
		margin-top: 0.25rem;
	}

	/* ---- Panel ----------------------------------------------------------- */
	/* Position and top-layer promotion come from use:floating */
	.panel {
		z-index: 10;
		width: 16rem;
		padding: 0.75rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		user-select: none;
		background-color: var(--paper-body-bg);
		border: 1px solid var(--border-color);
		border-radius: 0.375rem;
		box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
	}

	.sv-area {
		position: relative;
		width: 100%;
		height: 9rem;
		border-radius: 0.375rem;
		cursor: crosshair;
		touch-action: none;
		background-image:
			linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, transparent);
	}

	.sv-area:focus-visible,
	.slider:focus-visible {
		outline: 2px solid var(--accent-color);
		outline-offset: 2px;
	}

	.handle {
		position: absolute;
		width: 0.875rem;
		height: 0.875rem;
		border-radius: 50%;
		border: 2px solid #fff;
		box-shadow:
			0 0 0 1px rgba(0, 0, 0, 0.4),
			0 1px 3px rgba(0, 0, 0, 0.3);
		transform: translate(-50%, -50%);
		pointer-events: none;
		box-sizing: border-box;
	}

	.controls {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.sliders {
		flex: 1 1 auto;
		display: flex;
		flex-direction: column;
		gap: 0.625rem;
		min-width: 0;
	}

	.slider {
		position: relative;
		height: 0.75rem;
		border-radius: 0.375rem;
		cursor: pointer;
		touch-action: none;
	}

	.slider .handle {
		top: 50%;
	}

	.slider.hue {
		background: linear-gradient(
			to right,
			#f00 0%,
			#ff0 17%,
			#0f0 33%,
			#0ff 50%,
			#00f 67%,
			#f0f 83%,
			#f00 100%
		);
	}

	.slider.alpha {
		overflow: visible;
		background-size: 8px 8px;
	}

	.alpha-track {
		position: absolute;
		inset: 0;
		border-radius: 0.375rem;
	}

	.readout {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		min-width: 0;
	}

	.readout-swatch {
		flex: 0 0 auto;
		width: 1.25rem;
		height: 1.25rem;
		box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.15);
	}

	.readout code {
		flex: 1 1 auto;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 0.8125rem;
		color: var(--text-color);
		background: rgba(var(--ui-primary-rgbc), 0.06);
		padding: 0.125rem 0.375rem;
		border-radius: 0.25rem;
	}

	.swatches {
		display: flex;
		flex-wrap: wrap;
		gap: 0.375rem;
	}

	.preset {
		width: 1.5rem;
		height: 1.5rem;
		padding: 0;
		border: none;
		cursor: pointer;
		box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.15);
		transition: transform 0.1s ease;
	}

	.preset:hover {
		transform: scale(1.1);
	}

	.preset.selected {
		outline: 2px solid var(--accent-color);
		outline-offset: 1px;
	}

	.preset:focus-visible {
		outline: 2px solid var(--accent-color);
		outline-offset: 1px;
	}

	/* ---- Dark mode ------------------------------------------------------- */
	:global(.dark) .checker {
		background-color: #444;
		background-image:
			linear-gradient(45deg, #666 25%, transparent 25%),
			linear-gradient(-45deg, #666 25%, transparent 25%),
			linear-gradient(45deg, transparent 75%, #666 75%),
			linear-gradient(-45deg, transparent 75%, #666 75%);
	}

	:global(.dark) .swatch-button .checker,
	:global(.dark) .readout-swatch,
	:global(.dark) .preset {
		box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.15);
	}

	:global(.dark) .readout code {
		background: rgba(var(--ui-accent-rgbc), 0.1);
	}
</style>
