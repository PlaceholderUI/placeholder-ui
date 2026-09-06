<script lang="ts">
	import Paper from '$lib/display/Paper.svelte';
	import Textbox from '$lib/form/Textbox.svelte';
	import ActionIcon from '$lib/ui/ActionIcon.svelte';
	import { iconSearch, iconPlus } from '$lib/icon/index.js';

	let basicValue = '';
	let passwordValue = '';
	let withIconValue = '';
	let disabledValue = 'Cannot edit this';
	let requiredValue = '';
	let errorValue = '';
</script>

<div class="page-header">
	<h1>Textbox</h1>
	<p>Text input component with various configurations and states.</p>
</div>

<div class="vstack">
	<Paper title="Basic Usage">
		<div class="form-grid">
			<Textbox label="Basic textbox" placeholder="Enter some text..." bind:value={basicValue} />
			<p>Value: {basicValue}</p>
		</div>
	</Paper>

	<Paper title="Tooltips">
		<div class="form-grid">
			<Textbox
				label="Simple Tooltip"
				tooltipText="Enter your full name here"
				placeholder="Enter some text..."
				bind:value={basicValue}
			/>
			<Textbox label="Rich Tooltip" placeholder="Enter some text..." bind:value={basicValue}>
				{#snippet tooltipContent()}
					<strong>Tip:</strong> Use <em>rich content</em> like links or formatted text.
				{/snippet}
			</Textbox>
		</div>
	</Paper>

	<Paper title="Input Types">
		<div style="display: flex; gap: 1rem">
			<form method="post" class="flex-grow-1">
				<div class="vstack">
					<Textbox label="Text input" placeholder="Regular text" bind:value={basicValue} />
					<Textbox
						type="password"
						label="Password"
						placeholder="Enter password"
						bind:value={passwordValue}
					/>
					<button type="submit">Submit</button>
				</div>
			</form>
			<form method="post" class="flex-grow-1">
				<div class="vstack">
					<Textbox label="Text input" placeholder="Regular text" bind:value={basicValue} />
					<Textbox
						type="password"
						autocomplete="one-time-code"
						label="Prevent Browser Password Save"
						placeholder="Enter password"
						bind:value={passwordValue}
					/>
					<button type="submit">Submit</button>
				</div>
			</form>
		</div>
	</Paper>

	<Paper title="With Icons">
		<div class="form-grid">
			<Textbox
				label="Search"
				placeholder="Search..."
				leftIconSvg={iconSearch}
				bind:value={withIconValue}
			/>
			<div class="flex">
				<Textbox label="With Button">
					{#snippet right()}
						<ActionIcon svg={iconPlus} inputButton variant="primary" />
					{/snippet}
				</Textbox>
			</div>
		</div>
	</Paper>

	<Paper title="States">
		<div class="form-grid">
			<Textbox
				label="Required field"
				required={true}
				placeholder="This field is required"
				bind:value={requiredValue}
			/>
			<Textbox label="Disabled" disabled bind:value={disabledValue} />
			<Textbox
				label="With error"
				showError
				errorText="This field has an error"
				placeholder="Error state"
				bind:value={errorValue}
			/>
		</div>
	</Paper>

	<Paper title="No Label">
		<div class="form-grid">
			<Textbox placeholder="No label textbox" />
			<div class="flex">
				<Textbox placeholder="With button, no label">
					{#snippet right()}
						<ActionIcon svg={iconPlus} inputButton variant="accent" />
					{/snippet}
				</Textbox>
			</div>
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

	.flex {
		display: flex;
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
