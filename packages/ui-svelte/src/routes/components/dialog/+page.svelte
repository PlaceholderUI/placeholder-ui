<script lang="ts">
	import { Table, Dialog, Button, Paper, Textbox } from '$lib/index.js';
	import type { Column } from '$lib/index.js';

	let basicOpen = $state(false);
	let sizedOpen = $state(false);
	let footerOpen = $state(false);
	let noPaperOpen = $state(false);
	let noCloseOpen = $state(false);
	let currentSize = $state<'sm' | 'md' | 'lg' | 'xl' | 'full'>('md');

	let formName = $state('');
	let formEmail = $state('');

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
		{ prop: 'show', type: 'boolean', default: 'false', description: 'Bindable visibility state' },
		{ prop: 'title', type: 'string', default: 'undefined', description: 'Dialog title text' },
		{ prop: 'size', type: '\'sm\' | \'md\' | \'lg\' | \'xl\' | \'full\'', default: '\'md\'', description: 'Dialog width size' },
		{ prop: 'allowImplicitClose', type: 'boolean', default: 'true', description: 'Allow closing via backdrop/X' },
		{ prop: 'noPaper', type: 'boolean', default: 'false', description: 'Remove Paper wrapper' },
		{ prop: 'preventOverflow', type: 'boolean', default: 'false', description: 'Enable scrollable content' },
		{ prop: 'footer', type: 'Snippet', default: 'undefined', description: 'Footer slot for buttons' },
		{ prop: 'children', type: 'Snippet', default: 'undefined', description: 'Main content slot' },
	];
</script>

<h1>Dialog</h1>
<p>Modal dialog for displaying content that requires user attention or interaction.</p>

<div class="vstack">
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
				<Button variant="muted" onclick={() => (footerOpen = false)}>Cancel</Button>
				<Button variant="primary" onclick={() => (footerOpen = false)}>Confirm</Button>
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
				<Button variant="muted" onclick={() => (noPaperOpen = false)}>Cancel</Button>
				<Button variant="primary" onclick={() => (noPaperOpen = false)}>Submit</Button>
			{/snippet}
		</Dialog>
	</Paper>

	<Paper title="Prevent Implicit Close">
		<Button onclick={() => (noCloseOpen = true)}>Open (No Backdrop Close)</Button>
		<Dialog bind:show={noCloseOpen} title="Important!" allowImplicitClose={false}>
			<p>This dialog cannot be closed by clicking outside.</p>
			<p>You must use the button below.</p>
			{#snippet footer()}
				<Button variant="primary" onclick={() => (noCloseOpen = false)}>Close</Button>
			{/snippet}
		</Dialog>
	</Paper>

	<Paper title="Props">
		<Table columns={propsColumns} rows={propsRows} striped hover={false} />
	</Paper>
</div>

<style>
	h1 {
		margin-bottom: 0.5rem;
	}

	p {
		color: var(--pui-color-text-secondary);
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
	}</style>
