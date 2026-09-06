<script lang="ts">
	import Paper from '$lib/display/Paper.svelte';
	import Slider from '$lib/form/Slider.svelte';

	// Basic sliders
	let basicValue = 50;
	let customRangeValue = 25;
	let stepValue = 50;

	// With value display
	let volumeValue = 70;
	let brightnessValue = 80;
	let percentValue = 45;

	// States
	let disabledValue = 30;
	let errorValue = 20;
	let requiredValue = 60;

	// Practical examples
	let priceMin = 100;
	let priceMax = 500;
	let quality = 3;
	let opacity = 100;
	let fontSize = 16;

	function formatCurrency(value: number) {
		return `$${value}`;
	}

	function formatPercent(value: number) {
		return `${value}%`;
	}

	function formatQuality(value: number) {
		const labels = ['Very Low', 'Low', 'Medium', 'High', 'Ultra'];
		return labels[value - 1] || '';
	}

	function formatPixels(value: number) {
		return `${value}px`;
	}

	function handleVolumeChange(value: number) {
		console.log('Volume changed to:', value);
	}
</script>

<div class="page-header">
	<h1>Slider</h1>
	<p>Range slider component for selecting numeric values within a defined range.</p>
</div>

<div class="vstack">
	<Paper title="Basic Usage">
		<div class="form-grid">
			<div class="slider-section">
				<Slider label="Basic Slider" hideValue bind:value={basicValue} />
				<Slider label="Custom Range (0-50)" bind:value={customRangeValue} min={0} max={50} />
				<Slider label="With Step (10)" bind:value={stepValue} min={0} max={100} step={10} />
			</div>
			<div class="slider-info">
				<strong>Current Values:</strong>
				<p>Basic: {basicValue}</p>
				<p>Custom Range: {customRangeValue}</p>
				<p>Step: {stepValue}</p>
			</div>
		</div>
	</Paper>

	<Paper title="With Value Display">
		<div class="form-grid">
			<div class="slider-section">
				<Slider label="Volume" bind:value={volumeValue} onchange={handleVolumeChange} />
				<Slider
					label="Brightness"
					tooltipText="Adjust the screen brightness"
					bind:value={brightnessValue}
					formatValue={formatPercent}
				/>
				<Slider label="Completion" bind:value={percentValue} formatValue={formatPercent} />
			</div>
			<div class="slider-info">
				<strong>Formatted Values:</strong>
				<p>Volume: {volumeValue}</p>
				<p>Brightness: {brightnessValue}%</p>
				<p>Completion: {percentValue}%</p>
			</div>
		</div>
	</Paper>

	<Paper title="States">
		<div class="form-grid">
			<div class="slider-section">
				<Slider label="Required Slider" required bind:value={requiredValue} />
				<Slider label="Disabled Slider" disabled bind:value={disabledValue} />
				<Slider
					label="Error State"
					showError
					errorText="Value must be at least 50"
					bind:value={errorValue}
				/>
			</div>
			<div class="slider-info">
				<strong>State Values:</strong>
				<p>Required: {requiredValue}</p>
				<p>Disabled: {disabledValue}</p>
				<p>Error: {errorValue}</p>
			</div>
		</div>
	</Paper>

	<Paper title="Practical Examples">
		<div class="examples-section">
			<h3>Price Range Filter</h3>
			<div class="price-range">
				<Slider
					label="Min Price"
					bind:value={priceMin}
					min={0}
					max={1000}
					step={10}
					formatValue={formatCurrency}
				/>
				<Slider
					label="Max Price"
					bind:value={priceMax}
					min={0}
					max={1000}
					step={10}
					formatValue={formatCurrency}
				/>
			</div>
			<p class="example-description">
				Price range: {formatCurrency(priceMin)} - {formatCurrency(priceMax)}
			</p>

			<h3>Quality Settings</h3>
			<Slider
				label="Quality Level"
				bind:value={quality}
				min={1}
				max={5}
				step={1}
				formatValue={formatQuality}
			/>

			<h3>Design Controls</h3>
			<div class="design-controls">
				<Slider
					label="Opacity"
					bind:value={opacity}
					min={0}
					max={100}
					formatValue={formatPercent}
				/>
				<Slider
					label="Font Size"
					bind:value={fontSize}
					min={10}
					max={32}
					step={1}
					formatValue={formatPixels}
				/>
			</div>
			<div class="preview-box" style="opacity: {opacity / 100}; font-size: {fontSize}px;">
				Preview Text
			</div>
		</div>
	</Paper>

	<Paper title="Features">
		<div class="feature-list">
			<ul>
				<li><strong>Range control:</strong> Configurable min, max, and step values</li>
				<li>
					<strong>Value display:</strong> Optional inline value display with custom formatting
				</li>
				<li><strong>Theme support:</strong> Accent color adapts to light/dark mode</li>
				<li><strong>Accessibility:</strong> Keyboard navigation with arrow keys</li>
				<li><strong>Visual feedback:</strong> Filled track shows current position</li>
				<li><strong>Error states:</strong> Support for validation error display</li>
				<li><strong>Disabled states:</strong> Properly styled disabled state</li>
				<li><strong>Event handling:</strong> onchange and oninput callbacks</li>
				<li><strong>Custom styling:</strong> Support for custom CSS classes</li>
				<li><strong>Form integration:</strong> Works with FormGroup for labels and tooltips</li>
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

	.form-grid {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.slider-section {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.slider-info {
		padding: 1rem;
		background-color: rgba(var(--ui-primary-rgbc), 0.05);
		border-radius: 0.375rem;
		border: 1px solid var(--border-color);
	}

	.slider-info strong {
		color: var(--text-color);
		font-weight: 600;
	}

	.slider-info p {
		margin: 0.25rem 0 0 0;
		color: var(--text-muted);
	}

	.examples-section h3 {
		color: var(--text-color);
		font-size: 1.125rem;
		font-weight: 600;
		margin: 1.5rem 0 1rem 0;
		padding-bottom: 0.5rem;
		border-bottom: 1px solid var(--border-color);
	}

	.examples-section h3:first-of-type {
		margin-top: 0;
	}

	.price-range {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.design-controls {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.example-description {
		margin: 0.5rem 0;
		color: var(--text-muted);
		font-size: 0.875rem;
	}

	.preview-box {
		padding: 1rem;
		background-color: var(--accent-color);
		color: white;
		border-radius: 0.375rem;
		text-align: center;
		font-weight: 500;
		transition:
			opacity 0.15s ease,
			font-size 0.15s ease;
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

	:global(.dark) .slider-info {
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

		.price-range {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: 1.5rem;
		}

		.design-controls {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: 1.5rem;
		}
	}
</style>
