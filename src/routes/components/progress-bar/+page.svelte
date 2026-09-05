<script lang="ts">
	import Paper from '$lib/display/Paper.svelte';
	import ProgressBar from '$lib/ui/ProgressBar.svelte';
	import Slider from '$lib/form/Slider.svelte';
	import Checkbox from '$lib/form/Checkbox.svelte';

	let dynamicValue = $state(65);
	let showRounded = $state(true);
	let showAnimated = $state(true);
</script>

<div class="page-header">
	<h1>Progress Bar</h1>
	<p>Visual indicator for completion status, supporting single-color and multi-segment modes.</p>
</div>

<div class="vstack">
	<Paper title="Basic Usage">
		<div class="bar-stack">
			<ProgressBar value={0} label="0%" />
			<ProgressBar value={25} label="25%" />
			<ProgressBar value={50} label="50%" />
			<ProgressBar value={75} label="75%" />
			<ProgressBar value={100} label="100%" />
		</div>
	</Paper>

	<Paper title="Variants">
		<div class="bar-stack">
			<div class="variant-row">
				<span class="variant-label">Primary</span>
				<ProgressBar value={70} variant="primary" label="70%" />
			</div>
			<div class="variant-row">
				<span class="variant-label">Accent</span>
				<ProgressBar value={70} variant="accent" label="70%" />
			</div>
			<div class="variant-row">
				<span class="variant-label">Tertiary</span>
				<ProgressBar value={70} variant="tertiary" label="70%" />
			</div>
			<div class="variant-row">
				<span class="variant-label">Danger</span>
				<ProgressBar value={70} variant="danger" label="70%" />
			</div>
			<div class="variant-row">
				<span class="variant-label">Secondary</span>
				<ProgressBar value={70} variant="secondary" label="70%" />
			</div>
		</div>
	</Paper>

	<Paper title="Sizes">
		<div class="bar-stack">
			<div class="variant-row">
				<span class="variant-label">Small</span>
				<ProgressBar value={60} size="sm" />
			</div>
			<div class="variant-row">
				<span class="variant-label">Medium</span>
				<ProgressBar value={60} label="60%" />
			</div>
			<div class="variant-row">
				<span class="variant-label">Large</span>
				<ProgressBar value={60} size="lg" label="60%" />
			</div>
		</div>
	</Paper>

	<Paper title="With Labels">
		<div class="bar-stack">
			<ProgressBar value={42} label="42%" />
			<ProgressBar value={88} variant="accent" label="88% Complete" />
			<ProgressBar value={15} variant="danger" label="15% — Critical" size="lg" />
		</div>
	</Paper>

	<Paper title="Multi-Segment">
		<div class="bar-stack">
			<h4>Disk Usage</h4>
			<ProgressBar
				size="lg"
				segments={[
					{ value: 35, variant: 'primary', label: 'System 35%' },
					{ value: 25, variant: 'accent', label: 'Apps 25%' },
					{ value: 15, variant: 'tertiary', label: 'Media 15%' }
				]}
			/>

			<h4>Budget Allocation</h4>
			<ProgressBar
				size="lg"
				segments={[
					{ value: 40, variant: 'accent', label: 'Salaries' },
					{ value: 35, variant: 'tertiary', label: 'R&D' },
					{ value: 15, variant: 'primary', label: 'Ops' },
					{ value: 10, variant: 'danger', label: 'Other' }
				]}
			/>

			<h4>Task Progress</h4>
			<ProgressBar
				segments={[
					{ value: 50, variant: 'accent', label: 'Done' },
					{ value: 20, variant: 'tertiary', label: 'Review' },
					{ value: 10, variant: 'secondary', label: 'WIP' }
				]}
			/>
		</div>
	</Paper>

	<Paper title="Interactive">
		<div class="bar-stack">
			<Slider bind:value={dynamicValue} label="Progress" min={0} max={100} step={1} />
			<ProgressBar value={dynamicValue} label="{dynamicValue}%" />
			<ProgressBar value={dynamicValue} variant="accent" size="lg" label="{dynamicValue}%" />
		</div>
	</Paper>

	<Paper title="Options">
		<div class="options-row">
			<Checkbox bind:checked={showRounded} label="Rounded" />
			<Checkbox bind:checked={showAnimated} label="Animated" />
		</div>
		<div class="bar-stack">
			<ProgressBar value={65} label="65%" rounded={showRounded} animated={showAnimated} />
			<ProgressBar
				rounded={showRounded}
				animated={showAnimated}
				size="lg"
				segments={[
					{ value: 30, variant: 'primary', label: '30%' },
					{ value: 25, variant: 'accent', label: '25%' },
					{ value: 20, variant: 'tertiary', label: '20%' }
				]}
			/>
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

	.bar-stack {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.bar-stack h4 {
		margin: 0.5rem 0 0 0;
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--text-color);
	}

	.bar-stack h4:first-child {
		margin-top: 0;
	}

	.variant-row {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.variant-label {
		min-width: 80px;
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--text-muted);
	}

	.options-row {
		display: flex;
		gap: 1.5rem;
		margin-bottom: 1rem;
	}
</style>
