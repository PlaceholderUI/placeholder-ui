<script lang="ts">
	import { Table, Toaster, Paper, Button, toast } from '$lib/index.js';
	import type { Column } from '$lib/index.js';

	interface PropRow {
		api: string;
		type: string;
		description: string;
	}

	const propsColumns: Column<PropRow>[] = [
		{ key: 'api', label: 'Api' },
		{ key: 'type', label: 'Type' },
		{ key: 'description', label: 'Description' },
	];

	const propsRows: PropRow[] = [
		{ api: '<Toaster />', type: 'Component', description: 'Renders the toast container. Place once in your root layout. Wraps svelte-sonner with theme support.' },
		{ api: 'toast(message)', type: '(string) => void', description: 'Show a default toast notification' },
		{ api: 'toast.success(message)', type: '(string) => void', description: 'Show a success toast' },
		{ api: 'toast.error(message)', type: '(string) => void', description: 'Show an error toast' },
		{ api: 'toast.info(message)', type: '(string) => void', description: 'Show an info toast' },
		{ api: 'toast.warning(message)', type: '(string) => void', description: 'Show a warning toast' },
		{ api: 'toast.loading(message)', type: '(string) => id', description: 'Show a loading toast, returns ID for dismissal' },
		{ api: 'toast.promise(promise, opts)', type: '(Promise, object) => void', description: 'Track a promise with loading/success/error states' },
		{ api: 'toast.dismiss(id?)', type: '(id?) => void', description: 'Dismiss a specific toast or all toasts' },
	];
</script>

<h1>Toaster</h1>
<p>Toast notifications provide brief, non-intrusive feedback messages. The Toaster component renders the toast container, and the <code>toast</code> utility triggers notifications.</p>

<Toaster />

<div class="vstack">
	<Paper title="Setup">
		<p style="margin: 0; font-size: 0.875rem;">
			Place the <code>&lt;Toaster /&gt;</code> component in your root layout (typically <code>+layout.svelte</code>).
			It only needs to be rendered once. Then import <code>toast</code> from the library wherever you need to trigger notifications.
		</p>
	</Paper>

	<Paper title="Toast Types">
		<div class="demo-row">
			<Button variant="secondary" onclick={() => toast.success('Operation completed successfully!')}>Success</Button>
			<Button variant="danger" onclick={() => toast.error('Something went wrong. Please try again.')}>Error</Button>
			<Button variant="primary-outline" onclick={() => toast.info('Here is some useful information.')}>Info</Button>
			<Button variant="muted" onclick={() => toast.warning('Proceed with caution.')}>Warning</Button>
		</div>
	</Paper>

	<Paper title="Default Toast">
		<div class="demo-row">
			<Button variant="secondary" onclick={() => toast('This is a default toast message.')}>Default Toast</Button>
		</div>
	</Paper>

	<Paper title="Loading Toast">
		<div class="demo-row">
			<Button variant="primary-outline" onclick={() => {
				const id = toast.loading('Processing...');
				setTimeout(() => {
					toast.dismiss(id);
					toast.success('Processing complete!');
				}, 2000);
			}}>Show Loading Toast</Button>
		</div>
	</Paper>

	<Paper title="Promise Toast">
		<div class="demo-row">
			<Button variant="secondary" onclick={() => {
				const promise = new Promise((resolve) => setTimeout(resolve, 2000));
				toast.promise(promise, {
					loading: 'Saving data...',
					success: 'Data saved successfully!',
					error: 'Failed to save data.'
				});
			}}>Promise Toast</Button>
		</div>
	</Paper>

	<Paper title="Props">
		<Table columns={propsColumns} rows={propsRows} striped hover={false} />
	</Paper>
</div>

<style>
	h1 { margin-bottom: 0.5rem; }
	p { color: var(--pui-color-text-secondary); margin-bottom: 1.5rem; }
	.demo-row { display: flex; flex-wrap: wrap; gap: 0.75rem; align-items: center; }</style>
