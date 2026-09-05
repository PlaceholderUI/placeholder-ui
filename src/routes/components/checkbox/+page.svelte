<script lang="ts">
	import Paper from '$lib/display/Paper.svelte';
	import Checkbox from '$lib/form/Checkbox.svelte';

	let basicChecked = false;
	let requiredChecked = false;
	let preChecked = true;
	let errorChecked = false;
	let disabledUnchecked = false;
	let disabledChecked = true;

	let agreementChecked = false;
	let newsletterChecked = false;
	let notificationsChecked = true;

	function handleBasicChange(checked: boolean) {
		console.log('Basic checkbox changed:', checked);
	}

	function handleAgreementChange(checked: boolean) {
		console.log('Agreement checkbox changed:', checked);
	}
</script>

<div class="page-header">
	<h1>Checkbox</h1>
	<p>Checkbox component for binary choices with custom styling and animations.</p>
</div>

<div class="vstack">
	<Paper title="Basic Usage">
		<div class="form-grid">
			<div class="checkbox-group">
				<Checkbox label="Basic checkbox" bind:checked={basicChecked} />
				<Checkbox label="Pre-checked checkbox" bind:checked={preChecked} />
				<Checkbox label="Checkbox without label" bind:checked={basicChecked} />
			</div>
			<div class="checkbox-info">
				<strong>Current Values:</strong>
				<p>Basic: {basicChecked}</p>
				<p>Pre-checked: {preChecked}</p>
			</div>
		</div>
	</Paper>

	<Paper title="States">
		<div class="form-grid">
			<div class="checkbox-group">
				<Checkbox label="Required checkbox" required={true} bind:checked={requiredChecked} />
				<Checkbox label="Disabled (unchecked)" disabled={true} bind:checked={disabledUnchecked} />
				<Checkbox label="Disabled (checked)" disabled={true} bind:checked={disabledChecked} />
				<Checkbox
					label="Checkbox with error"
					showError={true}
					errorText="This field has an error"
					bind:checked={errorChecked}
				/>
			</div>
			<div class="checkbox-info">
				<strong>State Values:</strong>
				<p>Required: {requiredChecked}</p>
				<p>Error: {errorChecked}</p>
				<p>Disabled (unchecked): {disabledUnchecked}</p>
				<p>Disabled (checked): {disabledChecked}</p>
			</div>
		</div>
	</Paper>

	<Paper title="With Event Handlers">
		<div class="form-grid">
			<div class="checkbox-group">
				<Checkbox
					label="Checkbox with change handler"
					bind:checked={basicChecked}
					onchange={handleBasicChange}
				/>
				<Checkbox
					label="Agreement checkbox"
					bind:checked={agreementChecked}
					onchange={handleAgreementChange}
				/>
			</div>
			<div class="checkbox-info">
				<p>These checkboxes log changes to the console.</p>
				<p>Open your browser's developer tools to see the output.</p>
			</div>
		</div>
	</Paper>

	<Paper title="Form Examples">
		<div class="form-section">
			<h3>User Preferences</h3>
			<div class="checkbox-group">
				<Checkbox
					label="I agree to the terms and conditions"
					required={true}
					bind:checked={agreementChecked}
				/>
				<Checkbox
					tooltipText="Tooltip"
					label="Subscribe to newsletter"
					bind:checked={newsletterChecked}
				/>
				<Checkbox label="Enable push notifications" bind:checked={notificationsChecked} />
			</div>
			<div class="form-summary">
				<strong>Summary:</strong>
				<ul>
					<li>Agreement: {agreementChecked ? '✓ Accepted' : '✗ Not accepted'}</li>
					<li>Newsletter: {newsletterChecked ? '✓ Subscribed' : '✗ Not subscribed'}</li>
					<li>Notifications: {notificationsChecked ? '✓ Enabled' : '✗ Disabled'}</li>
				</ul>
			</div>
		</div>
	</Paper>

	<Paper title="Custom Styling">
		<div class="form-grid">
			<div class="checkbox-group">
				<Checkbox label="Checkbox with custom class" class="filled" bind:checked={basicChecked} />
				<p class="note">The 'filled' class creates a filled checkbox style when checked.</p>
			</div>
		</div>
	</Paper>

	<Paper title="Features">
		<div class="feature-list">
			<ul>
				<li><strong>Animated checkmark:</strong> Smooth animation when checking/unchecking</li>
				<li>
					<strong>Theme support:</strong> Colors adapt to light/dark mode (primary/accent)
				</li>
				<li><strong>Custom styling:</strong> Support for custom CSS classes</li>
				<li><strong>Required field support:</strong> Visual indicator for required checkboxes</li>
				<li><strong>Error states:</strong> Display error messages and styling</li>
				<li><strong>Disabled states:</strong> Support for disabled checkboxes</li>
				<li><strong>Event handling:</strong> onChange callback for custom logic</li>
				<li><strong>Accessibility:</strong> Proper labeling and keyboard navigation</li>
				<li><strong>Flexible labeling:</strong> Optional labels and custom IDs</li>
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

	.checkbox-group {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.checkbox-info {
		padding: 1rem;
		background-color: rgba(var(--ui-primary-rgbc), 0.05);
		border-radius: 0.375rem;
		border: 1px solid var(--border-color);
	}

	.checkbox-info strong {
		color: var(--text-color);
		font-weight: 600;
	}

	.checkbox-info p {
		margin: 0.25rem 0 0 0;
		color: var(--text-muted);
	}

	.form-section h3 {
		color: var(--text-color);
		font-size: 1.25rem;
		font-weight: 600;
		margin: 0 0 1rem 0;
	}

	.form-summary {
		margin-top: 1.5rem;
		padding: 1rem;
		background-color: rgba(var(--ui-primary-rgbc), 0.05);
		border-radius: 0.375rem;
		border: 1px solid var(--border-color);
	}

	.form-summary strong {
		color: var(--text-color);
		font-weight: 600;
		display: block;
		margin-bottom: 0.5rem;
	}

	.form-summary ul {
		margin: 0;
		padding-left: 1.5rem;
		color: var(--text-color);
	}

	.form-summary li {
		margin-bottom: 0.25rem;
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

	.note {
		font-size: 0.875rem;
		color: var(--text-muted);
		font-style: italic;
		margin: 0;
	}

	:global(.dark) .checkbox-info,
	:global(.dark) .form-summary {
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
