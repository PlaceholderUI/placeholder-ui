<script lang="ts">
	import { Table, Alert, Paper, Button } from '$lib/index.js';
	import type { Column } from '$lib/index.js';

	let showDismissible = $state(true);

	function resetDismissible() {
		showDismissible = false;
		setTimeout(() => (showDismissible = true), 100);
	}

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
		{ prop: 'variant', type: '\'default\' | \'info\' | \'success\' | \'warning\' | \'danger\'', default: '\'default\'', description: 'Visual style variant determining color and icon' },
		{ prop: 'title', type: 'string', default: 'undefined', description: 'Bold title text above the message' },
		{ prop: 'dismissible', type: 'boolean', default: 'false', description: 'Show dismiss button' },
		{ prop: 'ondismiss', type: '() => void', default: 'undefined', description: 'Callback when alert is dismissed' },
		{ prop: 'children', type: 'Snippet', default: 'undefined', description: 'Alert message content' },
		{ prop: 'class', type: 'string', default: '\'\'', description: 'Additional CSS classes' },
	];
</script>

<h1>Alert</h1>
<p>Alerts display important messages to the user with contextual styling based on severity.</p>

<div class="vstack">
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
		<Table columns={propsColumns} rows={propsRows} striped hover={false} />
	</Paper>
</div>

<style>
	h1 { margin-bottom: 0.5rem; }
	p { color: var(--pui-color-text-secondary); margin-bottom: 1.5rem; }
	.value-display { font-size: 0.875rem; color: var(--pui-color-text-muted); font-family: monospace; margin-top: 0.5rem; }.alert-stack {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}
</style>
