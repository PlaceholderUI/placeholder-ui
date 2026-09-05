<script lang="ts">
	import Paper from '$lib/display/Paper.svelte';
	import Badge from '$lib/ui/Badge.svelte';
</script>

<div class="page-header">
	<h1>Badges</h1>
	<p>Small status and labeling components with various styles and interactions.</p>
</div>

<div class="vstack">
	<Paper title="Basic Badges">
		<div class="badge-row">
			<Badge>Text only</Badge>
			<Badge onclick={() => console.log('Badge clicked')}>Clickable</Badge>
			<Badge variant="secondary" href="/components/buttons">Link badge</Badge>
			<Badge ondelete={() => console.log('Badge deleted')}>With delete</Badge>
		</div>
	</Paper>

	<Paper title="Variants">
		<div class="badge-grid">
			<div class="variant-group">
				<h4>Primary</h4>
				<div class="badge-row">
					<Badge variant="primary">Default</Badge>
					<Badge variant="primary-outline">Outline</Badge>
					<Badge variant="primary-subtle">Subtle</Badge>
				</div>
			</div>

			<div class="variant-group">
				<h4>Accent</h4>
				<div class="badge-row">
					<Badge variant="accent">Default</Badge>
					<Badge variant="accent-outline">Outline</Badge>
					<Badge variant="accent-subtle">Subtle</Badge>
				</div>
			</div>

			<div class="variant-group">
				<h4>Other Colors</h4>
				<div class="badge-row">
					<Badge variant="white">White</Badge>
					<Badge variant="secondary">Secondary</Badge>
					<Badge variant="shaded">Shaded</Badge>
					<Badge variant="danger">Danger</Badge>
					<Badge variant="tertiary">Tertiary</Badge>
				</div>
			</div>
		</div>
	</Paper>

	<Paper title="Sizes">
		<div class="badge-row">
			<Badge size="sm">Small</Badge>
			<Badge size="md">Medium</Badge>
			<Badge size="lg">Large</Badge>
		</div>
		<div class="badge-row" style="margin-top: 0.75rem;">
			<Badge size="sm" variant="accent" ondelete={() => console.log('deleted')}>Small</Badge>
			<Badge size="md" variant="accent" ondelete={() => console.log('deleted')}>Medium</Badge>
			<Badge size="lg" variant="accent" ondelete={() => console.log('deleted')}>Large</Badge>
		</div>
	</Paper>

	<Paper title="Shapes">
		<div class="badge-row">
			<Badge>Default shape</Badge>
			<Badge shape="pill">Pill shape</Badge>
			<Badge shape="pill" variant="accent">Pill accent</Badge>
			<Badge shape="pill" variant="primary-outline">Pill outline</Badge>
			<Badge shape="pill" href="#" size="sm" variant="secondary">Secondary small</Badge>
			<Badge shape="pill" href="#" size="lg" variant="shaded">Secondary small</Badge>
		</div>
	</Paper>

	<Paper title="Interactive Badges">
		<div class="badge-row">
			<Badge
				variant="primary"
				onclick={() => alert('Badge clicked!')}
				ondelete={() => alert('Badge deleted!')}
			>
				Click & Delete
			</Badge>
			<Badge variant="accent" onclick={() => console.log('Accent clicked')}>
				Clickable only
			</Badge>
			<Badge variant="danger" ondelete={() => console.log('Danger deleted')}>Deletable only</Badge>
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

	.badge-row {
		display: flex;
		gap: 0.75rem;
		flex-wrap: wrap;
		align-items: center;
	}

	.badge-grid {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.variant-group h4 {
		margin: 0 0 0.75rem 0;
		font-size: 1rem;
		font-weight: 600;
		color: var(--text-color);
	}

	@media (min-width: 768px) {
		.badge-grid {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
			gap: 2rem;
		}
	}
</style>
