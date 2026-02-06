<script lang="ts">
	import { Toaster, Paper, Button, toast } from '$lib/index.js';
</script>

<h1>Toaster</h1>
<p>Toast notifications provide brief, non-intrusive feedback messages. The Toaster component renders the toast container, and the <code>toast</code> utility triggers notifications.</p>

<Toaster />

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
	<table class="props-table">
		<thead>
			<tr>
				<th>API</th>
				<th>Type</th>
				<th>Description</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>&lt;Toaster /&gt;</code></td>
				<td>Component</td>
				<td>Renders the toast container. Place once in your root layout. Wraps svelte-sonner with theme support.</td>
			</tr>
			<tr>
				<td><code>toast(message)</code></td>
				<td><code>(string) => void</code></td>
				<td>Show a default toast notification</td>
			</tr>
			<tr>
				<td><code>toast.success(message)</code></td>
				<td><code>(string) => void</code></td>
				<td>Show a success toast</td>
			</tr>
			<tr>
				<td><code>toast.error(message)</code></td>
				<td><code>(string) => void</code></td>
				<td>Show an error toast</td>
			</tr>
			<tr>
				<td><code>toast.info(message)</code></td>
				<td><code>(string) => void</code></td>
				<td>Show an info toast</td>
			</tr>
			<tr>
				<td><code>toast.warning(message)</code></td>
				<td><code>(string) => void</code></td>
				<td>Show a warning toast</td>
			</tr>
			<tr>
				<td><code>toast.loading(message)</code></td>
				<td><code>(string) => id</code></td>
				<td>Show a loading toast, returns ID for dismissal</td>
			</tr>
			<tr>
				<td><code>toast.promise(promise, opts)</code></td>
				<td><code>(Promise, object) => void</code></td>
				<td>Track a promise with loading/success/error states</td>
			</tr>
			<tr>
				<td><code>toast.dismiss(id?)</code></td>
				<td><code>(id?) => void</code></td>
				<td>Dismiss a specific toast or all toasts</td>
			</tr>
		</tbody>
	</table>
</Paper>

<style>
	h1 { margin-bottom: 0.5rem; }
	p { color: var(--pui-color-text-secondary); margin-bottom: 1.5rem; }
	.demo-row { display: flex; flex-wrap: wrap; gap: 0.75rem; align-items: center; }
	.props-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
	.props-table th, .props-table td { text-align: left; padding: 0.75rem; border-bottom: 1px solid var(--pui-color-border); }
	.props-table th { font-weight: 600; background: var(--pui-color-bg-secondary); }
	.props-table code { background: var(--pui-color-bg-tertiary); padding: 0.125rem 0.375rem; border-radius: 4px; font-size: 0.8125rem; }
</style>
