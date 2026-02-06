<script lang="ts">
	import { Alert, Paper, Button } from '$lib/index.js';

	let showDismissible = $state(true);

	function resetDismissible() {
		showDismissible = false;
		setTimeout(() => (showDismissible = true), 100);
	}
</script>

<h1>Alert</h1>
<p>Alerts display important messages to the user with contextual styling based on severity.</p>

<Paper title="Variants">
	<div class="alert-stack">
		<Alert variant="default">
			This is a default alert providing general information.
		</Alert>
		<Alert variant="info">
			This is an info alert highlighting useful details.
		</Alert>
		<Alert variant="success">
			This is a success alert confirming a completed action.
		</Alert>
		<Alert variant="warning">
			This is a warning alert indicating potential issues.
		</Alert>
		<Alert variant="danger">
			This is a danger alert signaling an error or critical issue.
		</Alert>
	</div>
</Paper>

<Paper title="With Title">
	<div class="alert-stack">
		<Alert variant="info" title="Information">
			Your account settings have been updated. Changes will take effect within 24 hours.
		</Alert>
		<Alert variant="success" title="Payment Successful">
			Your payment of $49.99 has been processed. A receipt has been sent to your email.
		</Alert>
		<Alert variant="warning" title="Storage Almost Full">
			You are using 90% of your storage quota. Consider upgrading your plan.
		</Alert>
		<Alert variant="danger" title="Connection Lost">
			Unable to reach the server. Please check your internet connection and try again.
		</Alert>
	</div>
</Paper>

<Paper title="Dismissible">
	{#if showDismissible}
		<Alert variant="info" title="Dismissible Alert" dismissible ondismiss={() => (showDismissible = false)}>
			Click the X button to dismiss this alert. It will be removed from the page.
		</Alert>
	{:else}
		<div style="display: flex; flex-direction: column; gap: 0.5rem; align-items: flex-start;">
			<span class="value-display">Alert was dismissed.</span>
			<Button size="sm" variant="secondary" onclick={resetDismissible}>Show Again</Button>
		</div>
	{/if}
	<div class="value-display">visible: {showDismissible}</div>
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
				<td><code>variant</code></td>
				<td><code>'default' | 'info' | 'success' | 'warning' | 'danger'</code></td>
				<td><code>'default'</code></td>
				<td>Visual style variant determining color and icon</td>
			</tr>
			<tr>
				<td><code>title</code></td>
				<td><code>string</code></td>
				<td><code>undefined</code></td>
				<td>Bold title text above the message</td>
			</tr>
			<tr>
				<td><code>dismissible</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Show dismiss button</td>
			</tr>
			<tr>
				<td><code>ondismiss</code></td>
				<td><code>() => void</code></td>
				<td><code>undefined</code></td>
				<td>Callback when alert is dismissed</td>
			</tr>
			<tr>
				<td><code>children</code></td>
				<td><code>Snippet</code></td>
				<td><code>undefined</code></td>
				<td>Alert message content</td>
			</tr>
			<tr>
				<td><code>class</code></td>
				<td><code>string</code></td>
				<td><code>''</code></td>
				<td>Additional CSS classes</td>
			</tr>
		</tbody>
	</table>
</Paper>

<style>
	h1 { margin-bottom: 0.5rem; }
	p { color: var(--pui-color-text-secondary); margin-bottom: 1.5rem; }
	.value-display { font-size: 0.875rem; color: var(--pui-color-text-muted); font-family: monospace; margin-top: 0.5rem; }
	.props-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
	.props-table th, .props-table td { text-align: left; padding: 0.75rem; border-bottom: 1px solid var(--pui-color-border); }
	.props-table th { font-weight: 600; background: var(--pui-color-bg-secondary); }
	.props-table code { background: var(--pui-color-bg-tertiary); padding: 0.125rem 0.375rem; border-radius: 4px; font-size: 0.8125rem; }

	.alert-stack {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}
</style>
