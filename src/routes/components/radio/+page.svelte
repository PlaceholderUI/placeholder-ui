<script lang="ts">
	import Paper from '$lib/display/Paper.svelte';
	import RadioGroup from '$lib/form/RadioGroup.svelte';
	import type { ComboBoxItem } from '$lib/models/ComboBoxItem.js';

	// Basic options
	const colorOptions: ComboBoxItem[] = [
		{ label: 'Red', value: 'red' },
		{ label: 'Blue', value: 'blue' },
		{ label: 'Green', value: 'green' }
	];

	const sizeOptions: ComboBoxItem[] = [
		{ label: 'Small', value: 'sm' },
		{ label: 'Medium', value: 'md' },
		{ label: 'Large', value: 'lg' },
		{ label: 'Extra Large', value: 'xl' }
	];

	const yesNoOptions: ComboBoxItem[] = [
		{ label: 'Yes', value: 'yes' },
		{ label: 'No', value: 'no' }
	];

	// Form example options
	const priorityOptions: ComboBoxItem[] = [
		{ label: 'Low', value: 'low' },
		{ label: 'Medium', value: 'medium' },
		{ label: 'High', value: 'high' },
		{ label: 'Critical', value: 'critical' }
	];

	const paymentOptions: ComboBoxItem[] = [
		{ label: 'Credit Card', value: 'credit' },
		{ label: 'PayPal', value: 'paypal' },
		{ label: 'Bank Transfer', value: 'bank' },
		{ label: 'Cash on Delivery', value: 'cod' }
	];

	const notificationOptions: ComboBoxItem[] = [
		{ label: 'Email only', value: 'email' },
		{ label: 'SMS only', value: 'sms' },
		{ label: 'Email and SMS', value: 'both' },
		{ label: 'No notifications', value: 'none' }
	];

	// State variables
	let basicColor = '';
	let basicSize = 'md';
	let requiredChoice = '';
	let disabledChoice = 'blue';
	let errorChoice = '';
	let booleanChoice: string | undefined = undefined;

	// Form example state
	let taskPriority = 'medium';
	let paymentMethod = '';
	let notificationPreference = 'email';

	function handleColorChange(value: string | undefined) {
		console.log('Color changed:', value);
	}

	function handlePriorityChange(value: string | undefined) {
		console.log('Priority changed:', value);
	}
</script>

<div class="page-header">
	<h1>RadioGroup</h1>
	<p>Radio button component for single-choice selections with custom styling and animations.</p>
</div>

<div class="vstack">
	<Paper title="Basic Usage">
		<div class="form-grid">
			<div class="radio-section">
				<RadioGroup label="Choose Color" options={colorOptions} bind:value={basicColor} />
				<RadioGroup label="Choose Size" options={sizeOptions} bind:value={basicSize} />
			</div>
			<div class="radio-info">
				<strong>Current Values:</strong>
				<p>Color: {basicColor || 'None selected'}</p>
				<p>Size: {basicSize}</p>
			</div>
		</div>
	</Paper>

	<Paper title="States">
		<div class="form-grid">
			<div class="radio-section">
				<RadioGroup
					label="Required Choice"
					options={colorOptions}
					required={true}
					bind:value={requiredChoice}
				/>
				<RadioGroup
					label="Disabled RadioGroup"
					options={colorOptions}
					disabled={true}
					bind:value={disabledChoice}
				/>
				<RadioGroup
					label="RadioGroup with Error"
					options={colorOptions}
					showError={true}
					errorText="Please select an option"
					bind:value={errorChoice}
				/>
			</div>
			<div class="radio-info">
				<strong>State Values:</strong>
				<p>Required: {requiredChoice || 'None selected'}</p>
				<p>Disabled: {disabledChoice}</p>
				<p>Error: {errorChoice || 'None selected'}</p>
			</div>
		</div>
	</Paper>

	<Paper title="Boolean Values">
		<div class="form-grid">
			<div class="radio-section">
				<RadioGroup label="Do you agree?" options={yesNoOptions} bind:value={booleanChoice} />
			</div>
			<div class="radio-info">
				<strong>Boolean Value:</strong>
				<p>
					Agreement: {booleanChoice !== undefined
						? booleanChoice === 'true'
							? 'Yes (true)'
							: 'No (false)'
						: 'None selected'}
				</p>
				<p class="note">RadioGroups can work with boolean values too!</p>
			</div>
		</div>
	</Paper>

	<Paper title="With Event Handlers">
		<div class="form-grid">
			<div class="radio-section">
				<RadioGroup
					label="Color with Change Handler"
					options={colorOptions}
					bind:value={basicColor}
					onchange={handleColorChange}
				/>
				<RadioGroup
					label="Priority with Change Handler"
					options={priorityOptions}
					bind:value={taskPriority}
					onchange={handlePriorityChange}
				/>
			</div>
			<div class="radio-info">
				<p>These RadioGroups log changes to the console.</p>
				<p>Open your browser's developer tools to see the output.</p>
			</div>
		</div>
	</Paper>

	<Paper title="Form Example">
		<div class="form-section">
			<h3>Task Configuration</h3>
			<div class="radio-section">
				<RadioGroup
					label="Task Priority"
					options={priorityOptions}
					bind:value={taskPriority}
					required={true}
				/>
				<RadioGroup
					label="Payment Method"
					options={paymentOptions}
					bind:value={paymentMethod}
					required={true}
				/>
				<RadioGroup
					label="Notification Preferences"
					options={notificationOptions}
					bind:value={notificationPreference}
				/>
			</div>
			<div class="form-summary">
				<strong>Configuration Summary:</strong>
				<ul>
					<li>
						Priority: <span class="priority-{taskPriority}">{taskPriority || 'Not set'}</span>
					</li>
					<li>Payment: {paymentMethod || 'Not selected'}</li>
					<li>Notifications: {notificationPreference}</li>
				</ul>
				<div class="summary-actions">
					<button class="btn-primary" disabled={!taskPriority || !paymentMethod}>
						Save Configuration
					</button>
				</div>
			</div>
		</div>
	</Paper>

	<Paper title="Vertical Layout">
		<div class="form-grid">
			<div class="radio-section">
				<RadioGroup
					label="Vertical Options"
					options={priorityOptions}
					vertical
					bind:value={taskPriority}
				/>
				<RadioGroup
					label="Horizontal (default)"
					options={priorityOptions}
					bind:value={taskPriority}
				/>
			</div>
			<div class="radio-info">
				<strong>Vertical prop:</strong>
				<p>
					Use <code>vertical</code> to stack radio options in a column instead of the default horizontal
					row layout.
				</p>
			</div>
		</div>
	</Paper>

	<Paper title="Features">
		<div class="feature-list">
			<ul>
				<li><strong>Single selection:</strong> Only one option can be selected per group</li>
				<li><strong>Animated selection:</strong> Smooth animation when selecting options</li>
				<li><strong>Theme support:</strong> Colors adapt to light/dark mode (primary/accent)</li>
				<li><strong>Required field support:</strong> Visual indicator for required radio groups</li>
				<li><strong>Error states:</strong> Display error messages and styling</li>
				<li><strong>Disabled states:</strong> Support for disabled radio groups</li>
				<li><strong>Event handling:</strong> onChange callback for custom logic</li>
				<li>
					<strong>Flexible values:</strong> Support for string, number, boolean, and object values
				</li>
				<li><strong>Vertical layout:</strong> Option to display radio buttons in a column</li>
				<li><strong>Accessibility:</strong> Proper labeling and keyboard navigation</li>
				<li><strong>Form integration:</strong> Works seamlessly with form validation</li>
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

	.radio-section {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.radio-info {
		padding: 1rem;
		background-color: rgba(var(--ui-primary-rgbc), 0.05);
		border-radius: 0.375rem;
		border: 1px solid var(--border-color);
	}

	.radio-info strong {
		color: var(--text-color);
		font-weight: 600;
	}

	.radio-info p {
		margin: 0.25rem 0 0 0;
		color: var(--text-muted);
	}

	.form-section h3 {
		color: var(--text-color);
		font-size: 1.25rem;
		font-weight: 600;
		margin: 0 0 1.5rem 0;
	}

	.form-summary {
		margin-top: 2rem;
		padding: 1.5rem;
		background-color: rgba(var(--ui-primary-rgbc), 0.05);
		border-radius: 0.375rem;
		border: 1px solid var(--border-color);
	}

	.form-summary strong {
		color: var(--text-color);
		font-weight: 600;
		display: block;
		margin-bottom: 0.75rem;
	}

	.form-summary ul {
		margin: 0 0 1rem 0;
		padding-left: 1.5rem;
		color: var(--text-color);
	}

	.form-summary li {
		margin-bottom: 0.5rem;
	}

	.priority-low {
		color: #10b981;
	}
	.priority-medium {
		color: #f59e0b;
	}
	.priority-high {
		color: #f97316;
	}
	.priority-critical {
		color: #dc2626;
	}

	.summary-actions {
		border-top: 1px solid var(--border-color);
		padding-top: 1rem;
	}

	.btn-primary {
		background-color: var(--ui-primary);
		color: white;
		border: none;
		padding: 0.75rem 1.5rem;
		border-radius: 0.375rem;
		font-weight: 500;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.btn-primary:hover:not(:disabled) {
		opacity: 0.9;
	}

	.btn-primary:disabled {
		background-color: #6b7280;
		cursor: not-allowed;
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
	}

	:global(.dark) .radio-info,
	:global(.dark) .form-summary {
		background-color: rgba(var(--ui-accent-rgbc), 0.05);
	}

	:global(.dark) .feature-list strong {
		color: var(--ui-accent);
	}

	:global(.dark) .btn-primary {
		background-color: var(--ui-accent);
		color: var(--ui-primary);
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
