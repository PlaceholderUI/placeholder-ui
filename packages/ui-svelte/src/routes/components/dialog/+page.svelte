<script lang="ts">
	import { Dialog, Button, Paper, Textbox } from '$lib/index.js';

	let basicOpen = $state(false);
	let sizedOpen = $state(false);
	let footerOpen = $state(false);
	let noPaperOpen = $state(false);
	let noCloseOpen = $state(false);
	let currentSize = $state<'sm' | 'md' | 'lg' | 'xl' | 'full'>('md');

	let formName = $state('');
	let formEmail = $state('');
</script>

<h1>Dialog</h1>
<p>Modal dialog for displaying content that requires user attention or interaction.</p>

<Paper title="Basic Dialog">
	<Button onclick={() => (basicOpen = true)}>Open Dialog</Button>
	<Dialog bind:show={basicOpen} title="Basic Dialog">
		<p>This is a basic dialog with a title and close button.</p>
		<p>Click outside or the X to close.</p>
	</Dialog>
</Paper>

<Paper title="Dialog Sizes">
	<div class="button-row">
		<Button
			variant="secondary"
			onclick={() => {
				currentSize = 'sm';
				sizedOpen = true;
			}}>Small</Button
		>
		<Button
			variant="secondary"
			onclick={() => {
				currentSize = 'md';
				sizedOpen = true;
			}}>Medium</Button
		>
		<Button
			variant="secondary"
			onclick={() => {
				currentSize = 'lg';
				sizedOpen = true;
			}}>Large</Button
		>
		<Button
			variant="secondary"
			onclick={() => {
				currentSize = 'xl';
				sizedOpen = true;
			}}>Extra Large</Button
		>
	</div>
	<Dialog bind:show={sizedOpen} title="Sized Dialog" size={currentSize}>
		<p>This dialog is sized: <strong>{currentSize}</strong></p>
		<p>Available sizes: sm, md, lg, xl, full</p>
	</Dialog>
</Paper>

<Paper title="With Footer">
	<Button onclick={() => (footerOpen = true)}>Open with Footer</Button>
	<Dialog bind:show={footerOpen} title="Confirm Action">
		<p>Are you sure you want to proceed with this action?</p>
		<p>This cannot be undone.</p>
		{#snippet footer()}
			<Button variant="secondary" onclick={() => (footerOpen = false)}>Cancel</Button>
			<Button variant="midnight" onclick={() => (footerOpen = false)}>Confirm</Button>
		{/snippet}
	</Dialog>
</Paper>

<Paper title="With Form">
	<Button onclick={() => (noPaperOpen = true)}>Open Form Dialog</Button>
	<Dialog bind:show={noPaperOpen} title="Contact Form">
		<div class="form-content">
			<Textbox label="Name" bind:value={formName} placeholder="Your name" />
			<Textbox label="Email" bind:value={formEmail} placeholder="you@example.com" />
		</div>
		{#snippet footer()}
			<Button variant="secondary" onclick={() => (noPaperOpen = false)}>Cancel</Button>
			<Button variant="midnight" onclick={() => (noPaperOpen = false)}>Submit</Button>
		{/snippet}
	</Dialog>
</Paper>

<Paper title="Prevent Implicit Close">
	<Button onclick={() => (noCloseOpen = true)}>Open (No Backdrop Close)</Button>
	<Dialog bind:show={noCloseOpen} title="Important!" allowImplicitClose={false}>
		<p>This dialog cannot be closed by clicking outside.</p>
		<p>You must use the button below.</p>
		{#snippet footer()}
			<Button variant="midnight" onclick={() => (noCloseOpen = false)}>Close</Button>
		{/snippet}
	</Dialog>
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
				<td><code>show</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Bindable visibility state</td>
			</tr>
			<tr>
				<td><code>title</code></td>
				<td><code>string</code></td>
				<td><code>undefined</code></td>
				<td>Dialog title text</td>
			</tr>
			<tr>
				<td><code>size</code></td>
				<td><code>'sm' | 'md' | 'lg' | 'xl' | 'full'</code></td>
				<td><code>'md'</code></td>
				<td>Dialog width size</td>
			</tr>
			<tr>
				<td><code>allowImplicitClose</code></td>
				<td><code>boolean</code></td>
				<td><code>true</code></td>
				<td>Allow closing via backdrop/X</td>
			</tr>
			<tr>
				<td><code>noPaper</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Remove Paper wrapper</td>
			</tr>
			<tr>
				<td><code>preventOverflow</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Enable scrollable content</td>
			</tr>
			<tr>
				<td><code>footer</code></td>
				<td><code>Snippet</code></td>
				<td><code>undefined</code></td>
				<td>Footer slot for buttons</td>
			</tr>
			<tr>
				<td><code>children</code></td>
				<td><code>Snippet</code></td>
				<td><code>undefined</code></td>
				<td>Main content slot</td>
			</tr>
		</tbody>
	</table>
</Paper>

<style>
	h1 {
		margin-bottom: 0.5rem;
	}

	p {
		color: var(--cui-color-text-secondary);
		margin-bottom: 1.5rem;
	}

	.button-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
	}

	.form-content {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.props-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.875rem;
	}

	.props-table th,
	.props-table td {
		text-align: left;
		padding: 0.75rem;
		border-bottom: 1px solid var(--cui-color-border);
	}

	.props-table th {
		font-weight: 600;
		background: var(--cui-color-bg-secondary);
	}

	.props-table code {
		background: var(--cui-color-bg-tertiary);
		padding: 0.125rem 0.375rem;
		border-radius: 4px;
		font-size: 0.8125rem;
	}
</style>
