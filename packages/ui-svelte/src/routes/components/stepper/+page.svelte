<script lang="ts">
	import { Stepper, Paper, Button, iconUser, iconSettings, iconCheck } from '$lib/index.js';

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
</script>

<h1>Stepper</h1>
<p>Stepper displays progress through a sequence of steps, guiding users through a multi-step process.</p>

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
	<table class="props-table">
		<thead>
			<tr>
				<th>Prop</th>
				<th>Type</th>
				<th>Default</th>
				<th>Description</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>active</code></td>
				<td><code>number</code></td>
				<td><code>0</code></td>
				<td>Bindable active step index (0-based)</td>
			</tr>
			<tr>
				<td><code>steps</code></td>
				<td><code>StepItem[]</code></td>
				<td><code>[]</code></td>
				<td>Array of step items with label, description, icon</td>
			</tr>
			<tr>
				<td><code>orientation</code></td>
				<td><code>'horizontal' | 'vertical'</code></td>
				<td><code>'horizontal'</code></td>
				<td>Layout orientation of the stepper</td>
			</tr>
			<tr>
				<td><code>size</code></td>
				<td><code>'xs' | 'sm' | 'md' | 'lg' | 'xl'</code></td>
				<td><code>'md'</code></td>
				<td>Size of step indicators</td>
			</tr>
			<tr>
				<td><code>color</code></td>
				<td><code>'primary' | 'secondary' | 'accent' | 'success'</code></td>
				<td><code>'primary'</code></td>
				<td>Color theme for active/completed steps</td>
			</tr>
			<tr>
				<td><code>allowStepClick</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Allow clicking any step to navigate to it</td>
			</tr>
			<tr>
				<td><code>stepContent</code></td>
				<td><code>Snippet&lt;[number, StepItem]&gt;</code></td>
				<td><code>undefined</code></td>
				<td>Custom content for each step</td>
			</tr>
			<tr>
				<td><code>children</code></td>
				<td><code>Snippet</code></td>
				<td><code>undefined</code></td>
				<td>Content displayed below the stepper</td>
			</tr>
		</tbody>
	</table>
</Paper>

<style>
	h1 { margin-bottom: 0.5rem; }
	p { color: var(--pui-color-text-secondary); margin-bottom: 1.5rem; }
	.demo-row { display: flex; flex-wrap: wrap; gap: 0.75rem; align-items: center; }
	.value-display { font-size: 0.875rem; color: var(--pui-color-text-muted); font-family: monospace; margin-top: 0.5rem; }
	.props-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
	.props-table th, .props-table td { text-align: left; padding: 0.75rem; border-bottom: 1px solid var(--pui-color-border); }
	.props-table th { font-weight: 600; background: var(--pui-color-bg-secondary); }
	.props-table code { background: var(--pui-color-bg-tertiary); padding: 0.125rem 0.375rem; border-radius: 4px; font-size: 0.8125rem; }
</style>
