<script lang="ts">
	import { Table, Button, Paper, Loader, iconPlus, iconCheck, iconArrowRight } from '$lib/index.js';
	import type { Column } from '$lib/index.js';

	let loading = $state(false);

	function simulateLoading() {
		loading = true;
		setTimeout(() => (loading = false), 2000);
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
		{ prop: 'variant', type: 'ButtonVariant', default: '\'primary\'', description: 'Visual style variant' },
		{ prop: 'size', type: '\'xs\' | \'sm\' | \'md\' | \'lg\' | \'xl\'', default: '\'md\'', description: 'Button size' },
		{ prop: 'href', type: 'string', default: 'undefined', description: 'Renders as anchor tag when set' },
		{ prop: 'loading', type: 'boolean', default: 'false', description: 'Shows loading spinner' },
		{ prop: 'disabled', type: 'boolean', default: 'false', description: 'Disables the button' },
		{ prop: 'svg', type: 'string', default: 'undefined', description: 'Left icon SVG string' },
		{ prop: 'rightSvg', type: 'string', default: 'undefined', description: 'Right icon SVG string' },
		{ prop: 'onclick', type: '(event: MouseEvent) => void', default: 'undefined', description: 'Click event handler' },
	];
</script>

<h1>Button</h1>
<p>Buttons trigger actions when clicked. They come in multiple variants and sizes.</p>

<div class="vstack">
	<Paper title="Variants">
		<p>The library uses a color + style modifier pattern for button variants.</p>
		<div class="button-grid">
			<Button variant="primary">Primary</Button>
			<Button variant="primary-outline">Primary Outline</Button>
			<Button variant="primary-subtle">Primary Subtle</Button>
		</div>
		<div class="button-grid">
			<Button variant="secondary">Secondary</Button>
			<Button variant="secondary-outline">Secondary Outline</Button>
			<Button variant="secondary-subtle">Secondary Subtle</Button>
		</div>
		<div class="button-grid">
			<Button variant="muted">Muted</Button>
			<Button variant="muted-subtle">Muted Subtle</Button>
			<Button variant="muted-selected">Muted Selected</Button>
		</div>
		<div class="button-grid">
			<Button variant="danger">Danger</Button>
			<Button variant="danger-subtle">Danger Subtle</Button>
			<Button variant="white">White</Button>
		</div>
	</Paper>

	<Paper title="Sizes">
		<div class="button-row">
			<Button size="xs">Extra Small</Button>
			<Button size="sm">Small</Button>
			<Button size="md">Medium</Button>
			<Button size="lg">Large</Button>
			<Button size="xl">Extra Large</Button>
		</div>
	</Paper>

	<Paper title="With Icons">
		<div class="button-row">
			<Button svg={iconPlus}>Add Item</Button>
			<Button svg={iconCheck} variant="secondary">Confirm</Button>
			<Button rightSvg={iconArrowRight} variant="primary-outline">Next</Button>
		</div>
	</Paper>

	<Paper title="Loading State">
		<div class="button-row">
			<Button {loading} onclick={simulateLoading}>
				{loading ? 'Loading...' : 'Click to Load'}
			</Button>
			<Button loading variant="secondary">Always Loading</Button>
		</div>
	</Paper>

	<Paper title="Disabled">
		<div class="button-row">
			<Button disabled>Disabled</Button>
			<Button disabled variant="secondary">Disabled Secondary</Button>
			<Button disabled variant="danger">Disabled Danger</Button>
		</div>
	</Paper>

	<Paper title="As Link">
		<div class="button-row">
			<Button href="/">Internal Link</Button>
			<Button href="https://svelte.dev" target="_blank" variant="primary-outline">
				External Link
			</Button>
		</div>
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

	.button-grid {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		margin-bottom: 1rem;
	}

	.button-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		align-items: center;
	}</style>
