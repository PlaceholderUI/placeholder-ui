<script lang="ts">
	import Alert from '$lib/display/alert/Alert.svelte';
	import Paper from '$lib/display/Paper.svelte';
	import Button from '$lib/ui/Button.svelte';
	import Badge from '$lib/ui/Badge.svelte';

	let showAlert = $state(true);
	let showDismissibleAlert = $state(true);
	let alertCount = $state(0);

	function toggleAlert() {
		showAlert = !showAlert;
	}

	function dismissAlert() {
		showDismissibleAlert = false;
	}

	function incrementAlert() {
		alertCount++;
	}
</script>

<div class="page-header">
	<h1>Alert</h1>
	<p>Display important messages with different severity levels and optional icons.</p>
</div>

<div class="vstack">
	<Paper title="Basic Alert">
		<Alert>
			This is a basic alert with the default styling. Use alerts to display important information to users.
		</Alert>
	</Paper>

	<Paper title="Alert Variants">
		<div class="vstack">
			<Alert variant="default">
				<strong>Default Alert:</strong> Standard informational message with a subtle appearance.
			</Alert>
			
			<Alert variant="warning">
				<strong>Warning Alert:</strong> Use this variant to highlight potential issues or important notices.
			</Alert>
			
			<Alert variant="danger">
				<strong>Danger Alert:</strong> Critical alerts for errors, failures, or destructive actions.
			</Alert>
		</div>
	</Paper>

	<Paper title="Alerts with Titles">
		<div class="vstack">
			<Alert title="Information" variant="default">
				This alert has a title to provide more context about the message.
			</Alert>
			
			<Alert title="Important Notice" variant="warning">
				Titles help organize alert content and make it easier to scan.
			</Alert>
			
			<Alert title="Critical Error" variant="danger">
				This error requires immediate attention from the user.
			</Alert>
		</div>
	</Paper>

	<Paper title="Rich Content">
		<Alert title="Feature Update" variant="default">
			<p>We've released a new version with exciting features:</p>
			<ul>
				<li>Improved performance</li>
				<li>Better accessibility</li>
				<li>New component variants</li>
			</ul>
			<p>Learn more in our <a href="/docs" class="alert-link">documentation</a>.</p>
		</Alert>
	</Paper>

	<Paper title="Interactive Examples">
		<div class="vstack">
			<div class="row">
				<Button onclick={toggleAlert} variant="secondary">
					{showAlert ? 'Hide' : 'Show'} Alert
				</Button>
				<Button onclick={incrementAlert} variant="accent">
					Trigger Alert ({alertCount})
				</Button>
			</div>

			{#if showAlert}
				<Alert variant="default">
					This alert can be toggled on and off. Click the button above to control its visibility.
				</Alert>
			{/if}

			{#if alertCount > 0}
				<Alert title="Button Clicked" variant="warning">
					You've clicked the trigger button <Badge variant="secondary">{alertCount}</Badge> time{alertCount !== 1 ? 's' : ''}.
				</Alert>
			{/if}

			{#if showDismissibleAlert}
				<Alert title="Dismissible Alert" variant="default">
					This alert simulates a dismissible behavior.
					<div class="mt-2">
						<Button onclick={dismissAlert} variant="secondary">
							Dismiss
						</Button>
					</div>
				</Alert>
			{/if}
		</div>
	</Paper>

	<Paper title="Custom Styling">
		<Alert class="custom-alert" title="Custom Styled Alert">
			You can apply custom classes to alerts for additional styling. This alert has a custom border radius and shadow.
		</Alert>
	</Paper>

	<Paper title="Usage Guidelines">
		<div class="guidelines">
			<Alert variant="default">
				<strong>Best Practices:</strong>
				<ul>
					<li>Use alerts sparingly to maintain their impact</li>
					<li>Choose the appropriate variant for the message severity</li>
					<li>Keep alert text concise and actionable</li>
					<li>Consider placement within the user's workflow</li>
				</ul>
			</Alert>
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
		margin: 0 0 0.5rem;
		color: var(--text-color);
	}
	.page-header p {
		color: var(--text-muted);
		margin: 0;
	}

	.vstack {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	
	.row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.guidelines ul {
		margin: 0.5rem 0 0;
		padding-left: 1.5rem;
	}

	.guidelines li {
		margin: 0.25rem 0;
	}

	.mt-2 {
		margin-top: 0.5rem;
	}

	:global(.custom-alert) {
		border-radius: 0.5rem;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	:global(.alert-link) {
		color: var(--ui-accent-dark);
		text-decoration: underline;
	}

	:global(.dark .alert-link) {
		color: var(--ui-accent);
	}
</style>