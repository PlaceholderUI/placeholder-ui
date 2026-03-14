<script lang="ts">
	import { Table, Stepper, Paper, Button, iconUser, iconSettings, iconCheck } from '$lib/index.js';
	import type { Column } from '$lib/index.js';

	let activeStep = $state(1);

	const basicSteps = [
		{ label: 'Account' },
		{ label: 'Profile' },
		{ label: 'Review' },
		{ label: 'Complete' }
	];

	let verticalStep = $state(0);

	const descSteps = [
		{ label: 'Create Account', description: 'Set up your username and password' },
		{ label: 'Personal Info', description: 'Fill in your personal details' },
		{ label: 'Verification', description: 'Verify your email address' },
		{ label: 'Done', description: 'Account setup is complete' }
	];

	let descStep = $state(0);

	const iconSteps = [
		{ label: 'Account', icon: iconUser },
		{ label: 'Settings', icon: iconSettings },
		{ label: 'Confirm', icon: iconCheck }
	];

	let iconStep = $state(0);

	let clickableStep = $state(0);

	interface PropRow {
		prop: string;
		type: string;
		default: string;
		description: string;
	}

	const propsColumns: Column<PropRow>[] = [
		{ key: 'prop', label: 'Prop' },
		{ key: 'type', label: 'Type' },
		{ key: 'default', label: 'Default' },
		{ key: 'description', label: 'Description' },
	];

	const propsRows: PropRow[] = [
		{ prop: 'active', type: 'number', default: '0', description: 'Bindable active step index (0-based)' },
		{ prop: 'steps', type: 'StepItem[]', default: '[]', description: 'Array of step items with label, description, icon' },
		{ prop: 'orientation', type: '\'horizontal\' | \'vertical\'', default: '\'horizontal\'', description: 'Layout orientation of the stepper' },
		{ prop: 'size', type: '\'xs\' | \'sm\' | \'md\' | \'lg\' | \'xl\'', default: '\'md\'', description: 'Size of step indicators' },
		{ prop: 'color', type: '\'primary\' | \'secondary\' | \'accent\' | \'success\'', default: '\'primary\'', description: 'Color theme for active/completed steps' },
		{ prop: 'allowStepClick', type: 'boolean', default: 'false', description: 'Allow clicking any step to navigate to it' },
		{ prop: 'stepContent', type: 'Snippet<[number, StepItem]>', default: 'undefined', description: 'Custom content for each step' },
		{ prop: 'children', type: 'Snippet', default: 'undefined', description: 'Content displayed below the stepper' },
	];
</script>

<h1>Stepper</h1>
<p>Stepper displays progress through a sequence of steps, guiding users through a multi-step process.</p>

<div class="vstack">
	<Paper title="Basic Usage">
		<Stepper steps={basicSteps} bind:active={activeStep} />
		<div class="value-display">active: {activeStep}</div>
		<div class="demo-row" style="margin-top: 1rem;">
			<Button variant="secondary" onclick={() => (activeStep = Math.max(0, activeStep - 1))} disabled={activeStep === 0}>Previous</Button>
			<Button onclick={() => (activeStep = Math.min(basicSteps.length - 1, activeStep + 1))} disabled={activeStep === basicSteps.length - 1}>Next</Button>
		</div>
	</Paper>

	<Paper title="Vertical">
		<Stepper steps={basicSteps} bind:active={verticalStep} orientation="vertical" />
		<div class="value-display">active: {verticalStep}</div>
		<div class="demo-row" style="margin-top: 1rem;">
			<Button variant="secondary" onclick={() => (verticalStep = Math.max(0, verticalStep - 1))} disabled={verticalStep === 0}>Previous</Button>
			<Button onclick={() => (verticalStep = Math.min(basicSteps.length - 1, verticalStep + 1))} disabled={verticalStep === basicSteps.length - 1}>Next</Button>
		</div>
	</Paper>

	<Paper title="With Descriptions">
		<Stepper steps={descSteps} bind:active={descStep} />
		<div class="value-display">active: {descStep}</div>
		<div class="demo-row" style="margin-top: 1rem;">
			<Button variant="secondary" onclick={() => (descStep = Math.max(0, descStep - 1))} disabled={descStep === 0}>Previous</Button>
			<Button onclick={() => (descStep = Math.min(descSteps.length - 1, descStep + 1))} disabled={descStep === descSteps.length - 1}>Next</Button>
		</div>
	</Paper>

	<Paper title="Allow Step Click">
		<Stepper steps={basicSteps} bind:active={clickableStep} allowStepClick />
		<div class="value-display">active: {clickableStep} (click any step to navigate)</div>
	</Paper>

	<Paper title="Props">
		<Table columns={propsColumns} rows={propsRows} striped hover={false} />
	</Paper>
</div>

<style>
	h1 { margin-bottom: 0.5rem; }
	p { color: var(--pui-color-text-secondary); margin-bottom: 1.5rem; }
	.demo-row { display: flex; flex-wrap: wrap; gap: 0.75rem; align-items: center; }
	.value-display { font-size: 0.875rem; color: var(--pui-color-text-muted); font-family: monospace; margin-top: 0.5rem; }</style>
