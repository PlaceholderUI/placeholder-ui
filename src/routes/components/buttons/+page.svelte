<script lang="ts">
	import Paper from '$lib/display/Paper.svelte';
	import Button from '$lib/ui/Button.svelte';
	import { iconTrash } from '$lib/icon/index.js';
</script>

<div class="page-header">
	<h1>Buttons</h1>
	<p>Interactive button components with various styles and states.</p>
</div>

<div class="vstack">
	<Paper title="Basic Buttons">
		<div class="flex flex-col gap-4">
			<div class="flex gap-2">
				<Button variant="primary">Primary</Button>
				<Button variant="primary" loading>Primary (Loading)</Button>
				<Button variant="primary-outline">Primary (outline)</Button>
				<Button variant="primary-subtle">Primary (subtle)</Button>
			</div>
			<div class="flex gap-2">
				<Button variant="accent">Accent</Button>
				<Button variant="accent-outline">Accent (outline)</Button>
				<Button variant="accent-subtle">Accent (subtle)</Button>
			</div>
			<div class="flex gap-2">
				<Button variant="auto-subtle">Auto (subtle)</Button>
				<Button variant="white">White</Button>
				<Button variant="secondary">Secondary</Button>
				<Button variant="secondary-subtle">Secondary (subtle)</Button>
				<Button variant="secondary-selected">Secondary (selected)</Button>
			</div>
			<div class="flex gap-2">
				<Button variant="danger" svg={iconTrash}>Danger</Button>
				<Button variant="danger" svg={iconTrash} loading={true}>Danger (Loading)</Button>
			</div>
		</div>
	</Paper>

	<Paper title="Button States">
		<div class="flex gap-2">
			<Button variant="primary">Normal</Button>
			<Button variant="primary" loading>Loading</Button>
			<Button variant="primary" disabled>Disabled</Button>
		</div>
	</Paper>

	<Paper title="Button as Link">
		<div class="flex gap-2">
			<Button variant="primary" href="/components/badges">Navigate to Badges</Button>
			<Button variant="accent-outline" href="https://svelte.dev" target="_blank"
				>External Link</Button
			>
		</div>
	</Paper>

	<Paper title="Button Sizes">
		<div class="flex flex-col gap-4">
			<div class="flex gap-2 items-center">
				<Button variant="primary" size="xs">Extra Small</Button>
				<Button variant="primary" size="sm">Small</Button>
				<Button variant="primary" size="md">Medium (Default)</Button>
				<Button variant="primary" size="lg">Large</Button>
				<Button variant="primary" size="xl">Extra Large</Button>
			</div>
			<div class="flex gap-2 items-center">
				<Button variant="accent" size="xs" svg={iconTrash}>XS with Icon</Button>
				<Button variant="accent" size="sm" svg={iconTrash}>SM with Icon</Button>
				<Button variant="accent" size="md" svg={iconTrash}>MD with Icon</Button>
				<Button variant="accent" size="lg" svg={iconTrash}>LG with Icon</Button>
				<Button variant="accent" size="xl" svg={iconTrash}>XL with Icon</Button>
			</div>
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

	.flex {
		display: flex;
		flex-wrap: wrap;
	}

	.flex-col {
		flex-direction: column;
	}

	.gap-2 {
		gap: 0.5rem;
	}

	.gap-4 {
		gap: 1rem;
	}

	.items-center {
		align-items: center;
	}
</style>
