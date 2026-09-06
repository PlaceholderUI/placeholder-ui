<script lang="ts">
	import Paper from '$lib/display/Paper.svelte';
	import ColorPicker from '$lib/form/ColorPicker.svelte';
	import { formatColor, parseColor } from '$lib/form/ColorPicker.svelte';

	let basic = $state('#1e3a5f');
	let empty = $state('');
	let withAlpha = $state('#93c5fd80');
	let withSwatches = $state('#e03131');
	let rgbReadout = $state('#0e7490');
	let hslReadout = $state('#a5f3fc');
	let compact = $state('#f59f00');
	let disabledValue = $state('#868e96');
	let requiredValue = $state('');
	let errorValue = $state('#000000');

	// Practical example: theme builder
	let themePrimary = $state('#1e3a5f');
	let themeAccent = $state('#93c5fd');
	let themeTertiary = $state('#a5f3fc');

	const brandSwatches = [
		'#1e3a5f',
		'#93c5fd',
		'#a5f3fc',
		'#0e7490',
		'#1d4ed8',
		'#e03131',
		'#f59f00',
		'#2f9e44',
		'#862e9c',
		'#000000',
		'#ffffff'
	];

	function describe(value: string) {
		const rgb = parseColor(value);
		if (!rgb) return 'None';
		return `${formatColor(rgb, 'hex')} · ${formatColor(rgb, 'rgb')} · ${formatColor(rgb, 'hsl')}`;
	}
</script>

<div class="page-header">
	<h1>ColorPicker</h1>
	<p>
		Colour selection with a saturation/brightness area, hue and opacity sliders, presets and text
		entry.
	</p>
</div>

<div class="vstack">
	<Paper title="Basic Usage">
		<div class="form-grid">
			<ColorPicker label="Brand colour" bind:value={basic} />
			<div class="info">
				<strong>Selected:</strong>
				<p>Raw: {basic || 'No colour selected'}</p>
				<p><em>{describe(basic)}</em></p>
			</div>
		</div>
	</Paper>

	<Paper title="Empty Start">
		<div class="form-grid">
			<ColorPicker label="Highlight colour" bind:value={empty} placeholder="Pick a colour…" />
			<div class="info">
				<strong>Selected:</strong>
				<p>Raw: {empty || 'No colour selected'}</p>
				<p><em>Type any hex, rgb() or hsl() value in the box, or open the picker.</em></p>
			</div>
		</div>
	</Paper>

	<Paper title="Opacity (allowAlpha)">
		<div class="form-grid">
			<ColorPicker label="Overlay colour" bind:value={withAlpha} allowAlpha />
			<div class="info">
				<strong>Selected:</strong>
				<p>Raw: {withAlpha}</p>
				<p><em>{describe(withAlpha)}</em></p>
				<div class="preview-strip">
					<div class="preview-overlay" style:background={withAlpha}></div>
				</div>
			</div>
		</div>
	</Paper>

	<Paper title="Preset Swatches">
		<div class="form-grid">
			<ColorPicker label="Tag colour" bind:value={withSwatches} swatches={brandSwatches} />
			<div class="info">
				<strong>Selected:</strong>
				<p>Raw: {withSwatches}</p>
				<p><em>Presets appear below the sliders; the active one is outlined.</em></p>
			</div>
		</div>
	</Paper>

	<Paper title="Readout Formats">
		<div class="form-grid">
			<ColorPicker label="RGB readout" bind:value={rgbReadout} format="rgb" />
			<ColorPicker label="HSL readout" bind:value={hslReadout} format="hsl" allowAlpha />
		</div>
		<p class="note">
			The bound <code>value</code> is always hex. <code>format</code> only changes the readout shown inside
			the popup and in the compact trigger.
		</p>
	</Paper>

	<Paper title="Compact (hideInput)">
		<div class="form-grid">
			<ColorPicker label="Accent" bind:value={compact} hideInput format="rgb" />
			<div class="info">
				<strong>Selected:</strong>
				<p>Raw: {compact}</p>
				<p><em>Without the text box the whole trigger opens the picker.</em></p>
			</div>
		</div>
	</Paper>

	<Paper title="States">
		<div class="form-grid">
			<ColorPicker label="Disabled" bind:value={disabledValue} disabled />
			<ColorPicker label="Required" bind:value={requiredValue} required />
			<ColorPicker
				label="With error"
				bind:value={errorValue}
				showError
				errorText="Pure black is not permitted"
			/>
			<ColorPicker
				label="With tooltip"
				bind:value={basic}
				tooltipText="Used for headings and primary buttons"
			/>
		</div>
	</Paper>

	<Paper title="Practical Example: Theme Builder">
		<div class="form-grid">
			<div class="theme-inputs">
				<ColorPicker label="Primary" bind:value={themePrimary} swatches={brandSwatches} />
				<ColorPicker label="Accent" bind:value={themeAccent} swatches={brandSwatches} />
				<ColorPicker label="Tertiary" bind:value={themeTertiary} swatches={brandSwatches} />
			</div>
			<div class="theme-preview">
				<div class="theme-bar" style:background={themePrimary}>
					<span style:color={themeAccent}>Placeholder UI</span>
				</div>
				<div class="theme-body">
					<button class="theme-btn" style:background={themePrimary}>Primary</button>
					<button class="theme-btn" style:background={themeAccent} style:color={themePrimary}
						>Accent</button
					>
					<button class="theme-btn" style:background={themeTertiary} style:color={themePrimary}
						>Tertiary</button
					>
				</div>
			</div>
		</div>
	</Paper>

	<Paper title="Features">
		<div class="feature-list">
			<ul>
				<li>
					<strong>Saturation/brightness area:</strong> Drag or use arrow keys (hold Shift for larger steps)
				</li>
				<li><strong>Hue and opacity sliders:</strong> Keyboard accessible with Home/End support</li>
				<li>
					<strong>Text entry:</strong> Accepts #rgb, #rrggbb, #rrggbbaa, rgb(), rgba(), hsl() and hsla()
				</li>
				<li><strong>Presets:</strong> Pass <code>swatches</code> for one-click brand colours</li>
				<li>
					<strong>Eyedropper:</strong> Pick from anywhere on screen in browsers that support the EyeDropper
					API
				</li>
				<li>
					<strong>Stable hex value:</strong> <code>value</code> is always normalised hex, with an alpha
					byte only when needed
				</li>
				<li>
					<strong>Helpers exported:</strong> <code>parseColor</code>, <code>toHex</code>,
					<code>formatColor</code>, <code>rgbToHsv</code>, <code>hsvToRgb</code>,
					<code>rgbToHsl</code>
				</li>
				<li><strong>Theme support:</strong> Popup and checkerboard adapt to light/dark mode</li>
			</ul>
		</div>
	</Paper>
</div>

<style>
	.page-header {
		margin-bottom: 2rem;
	}

	.page-header h1 {
		font-size: 2rem;
		font-weight: 700;
		margin: 0 0 0.5rem 0;
		color: var(--text-color);
	}

	.page-header p {
		color: var(--text-muted);
		margin: 0;
	}

	.vstack {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.form-grid {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.info {
		padding: 1rem;
		background-color: rgba(var(--ui-primary-rgbc), 0.05);
		border-radius: 0.375rem;
		border: 1px solid var(--border-color);
	}

	.info strong {
		color: var(--text-color);
		font-weight: 600;
	}

	.info p {
		margin: 0.25rem 0 0 0;
		color: var(--text-muted);
	}

	.note {
		margin: 1rem 0 0;
		color: var(--text-muted);
		font-size: 0.875rem;
	}

	.preview-strip {
		margin-top: 0.75rem;
		height: 2.5rem;
		border-radius: 0.375rem;
		background: repeating-linear-gradient(
			90deg,
			var(--ui-primary) 0 1rem,
			var(--ui-accent) 1rem 2rem,
			var(--ui-tertiary) 2rem 3rem
		);
		overflow: hidden;
	}

	.preview-overlay {
		width: 100%;
		height: 100%;
	}

	.theme-inputs {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.theme-preview {
		border: 1px solid var(--border-color);
		border-radius: 0.375rem;
		overflow: hidden;
	}

	.theme-bar {
		padding: 0.75rem 1rem;
		font-weight: 600;
	}

	.theme-body {
		display: flex;
		gap: 0.5rem;
		padding: 1rem;
		background: var(--paper-body-bg);
	}

	.theme-btn {
		border: none;
		border-radius: 0.375rem;
		padding: 0.375rem 0.875rem;
		color: #fff;
		font-weight: 500;
		cursor: default;
	}

	.feature-list ul {
		margin: 0;
		padding-left: 1.5rem;
		color: var(--text-color);
	}

	.feature-list li {
		margin-bottom: 0.5rem;
		line-height: 1.5;
	}

	.feature-list strong {
		color: var(--ui-primary);
		font-weight: 600;
	}

	:global(.dark) .info {
		background-color: rgba(var(--ui-accent-rgbc), 0.05);
	}

	:global(.dark) .feature-list strong {
		color: var(--ui-accent);
	}

	@media (min-width: 768px) {
		.form-grid {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: 1.5rem;
			align-items: start;
		}
	}
</style>
