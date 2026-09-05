<script lang="ts">
	import Paper from '$lib/display/Paper.svelte';
	import Number from '$lib/form/Number.svelte';

	let basicValue: number | undefined = undefined;
	let minMaxValue: number | undefined = 50;
	let stepValue: number | undefined = 0;
	let requiredValue: number | undefined = undefined;
	let disabledValue: number | undefined = 123;
	let errorValue: number | undefined = undefined;
</script>

<div class="page-header">
	<h1>Number</h1>
	<p>Numeric input component with validation and constraints.</p>
</div>

<div class="vstack">
	<Paper title="Basic Usage">
		<div class="form-grid">
			<Number label="Basic number input" placeholder="Enter a number..." bind:value={basicValue} />
			<p>Value: {basicValue ?? 'undefined'}</p>
		</div>
	</Paper>

	<Paper title="Constraints">
		<div class="form-grid">
			<Number
				label="Min/Max (10-100)"
				min={10}
				max={100}
				placeholder="Between 10 and 100"
				bind:value={minMaxValue}
			/>
			<Number
				label="Step increment (0.5)"
				step={0.5}
				placeholder="Increments of 0.5"
				bind:value={stepValue}
			/>
		</div>
	</Paper>

	<Paper title="States">
		<div class="form-grid">
			<Number
				label="Required field"
				required={true}
				placeholder="This field is required"
				bind:value={requiredValue}
			/>
			<Number label="Disabled" disabled bind:value={disabledValue} />
			<Number
				label="With error"
				showError
				errorText="Please enter a valid number"
				placeholder="Error state"
				bind:value={errorValue}
			/>
		</div>
	</Paper>

	<Paper title="Events">
		<div class="form-grid">
			<Number
				label="With change handler"
				placeholder="Watch console for changes"
				onchange={(e) => console.log('Number changed:', e)}
				oninput={(e) => console.log('Number input:', e)}
			/>
			<Number
				label="Enter key handler"
				placeholder="Press Enter to log value"
				onenter={(value) => console.log('Enter pressed with value:', value)}
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

	.form-grid {
		display: flex;
		flex-direction: column;
		gap: 1rem;
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
