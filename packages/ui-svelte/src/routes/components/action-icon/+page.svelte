<script lang="ts">
	import {
		Table, ActionIcon,
		Paper,
		Button,
		iconSearch,
		iconPlus,
		iconTrash,
		iconEdit,
		iconCheck,
		iconSettings,
		iconUser,
		iconHeart,
		iconStar,
		iconBell
	} from '$lib/index.js';
	import type { Column } from '$lib/index.js';

	let clickCount = $state(0);
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
		{ prop: 'svg', type: 'string', default: 'required', description: 'SVG icon string' },
		{ prop: 'variant', type: 'ButtonVariant', default: '\'auto-subtle\'', description: 'Visual style variant' },
		{ prop: 'size', type: 'string', default: '\'20px\'', description: 'Icon size' },
		{ prop: 'tooltip', type: 'string', default: 'undefined', description: 'Tooltip text shown on hover' },
		{ prop: 'href', type: 'string', default: 'undefined', description: 'Renders as anchor tag when set' },
		{ prop: 'loading', type: 'boolean', default: 'false', description: 'Shows loading spinner' },
		{ prop: 'disabled', type: 'boolean', default: 'false', description: 'Disables the button' },
		{ prop: 'inputButton', type: 'boolean', default: 'false', description: 'Style as input addon button' },
		{ prop: 'onclick', type: '(event: MouseEvent) => void', default: 'undefined', description: 'Click event handler' },
	];
</script>

<h1>ActionIcon</h1>
<p>Icon-only button for compact actions. Wraps a single SVG icon in a clickable button.</p>

<div class="vstack">
	<Paper title="Basic Usage">
		<div class="demo-row">
			<ActionIcon svg={iconSearch} onclick={() => clickCount++} />
			<ActionIcon svg={iconPlus} onclick={() => clickCount++} />
			<ActionIcon svg={iconEdit} onclick={() => clickCount++} />
			<ActionIcon svg={iconTrash} onclick={() => clickCount++} />
			<ActionIcon svg={iconSettings} onclick={() => clickCount++} />
			<ActionIcon svg={iconUser} onclick={() => clickCount++} />
			<ActionIcon svg={iconHeart} onclick={() => clickCount++} />
			<ActionIcon svg={iconStar} onclick={() => clickCount++} />
			<ActionIcon svg={iconBell} onclick={() => clickCount++} />
			<ActionIcon svg={iconCheck} onclick={() => clickCount++} />
		</div>
		<div class="value-display">Click count: {clickCount}</div>
	</Paper>

	<Paper title="Variants">
		<div class="demo-section">
			<div class="demo-row">
				<ActionIcon svg={iconHeart} variant="primary" />
				<ActionIcon svg={iconHeart} variant="primary-outline" />
				<ActionIcon svg={iconHeart} variant="primary-subtle" />
			</div>
		</div>
		<div class="demo-section">
			<div class="demo-row">
				<ActionIcon svg={iconStar} variant="secondary" />
				<ActionIcon svg={iconStar} variant="secondary-outline" />
				<ActionIcon svg={iconStar} variant="secondary-subtle" />
			</div>
		</div>
		<div class="demo-section">
			<div class="demo-row">
				<ActionIcon svg={iconTrash} variant="danger" />
				<ActionIcon svg={iconTrash} variant="danger-subtle" />
			</div>
		</div>
		<div class="demo-section">
			<div class="demo-row">
				<ActionIcon svg={iconSettings} variant="muted" />
				<ActionIcon svg={iconSettings} variant="muted-subtle" />
				<ActionIcon svg={iconSettings} variant="auto-subtle" />
				<ActionIcon svg={iconSettings} variant="auto-outline" />
			</div>
		</div>
	</Paper>

	<Paper title="With Tooltip">
		<div class="demo-row">
			<ActionIcon svg={iconSearch} tooltip="Search" />
			<ActionIcon svg={iconPlus} tooltip="Add new item" />
			<ActionIcon svg={iconEdit} tooltip="Edit" />
			<ActionIcon svg={iconTrash} tooltip="Delete" variant="danger" />
			<ActionIcon svg={iconSettings} tooltip="Settings" />
		</div>
	</Paper>

	<Paper title="Loading">
		<div class="demo-row">
			<ActionIcon svg={iconCheck} {loading} onclick={simulateLoading} tooltip="Click to load" />
			<ActionIcon svg={iconPlus} loading variant="primary" />
			<ActionIcon svg={iconStar} loading variant="secondary" />
		</div>
		<div class="value-display">Loading: {loading}</div>
	</Paper>

	<Paper title="Disabled">
		<div class="demo-row">
			<ActionIcon svg={iconSearch} disabled />
			<ActionIcon svg={iconPlus} disabled variant="primary" />
			<ActionIcon svg={iconTrash} disabled variant="danger" />
			<ActionIcon svg={iconSettings} disabled variant="secondary" />
		</div>
	</Paper>

	<Paper title="Custom Size">
		<div class="demo-row">
			<ActionIcon svg={iconHeart} size="16px" tooltip="16px" />
			<ActionIcon svg={iconHeart} size="20px" tooltip="20px (default)" />
			<ActionIcon svg={iconHeart} size="24px" tooltip="24px" />
			<ActionIcon svg={iconHeart} size="32px" tooltip="32px" />
		</div>
	</Paper>

	<Paper title="As Link">
		<div class="demo-row">
			<ActionIcon svg={iconSearch} href="/" tooltip="Internal link" />
			<ActionIcon svg={iconSettings} href="https://svelte.dev" target="_blank" tooltip="External link" />
		</div>
	</Paper>

	<Paper title="Props">
		<Table columns={propsColumns} rows={propsRows} striped hover={false} />
	</Paper>
</div>

<style>
	h1 { margin-bottom: 0.5rem; }
	p { color: var(--pui-color-text-secondary); margin-bottom: 1.5rem; }
	.demo-row { display: flex; flex-wrap: wrap; gap: 0.75rem; align-items: center; }
	.demo-section { margin-bottom: 1rem; }
	.value-display { font-size: 0.875rem; color: var(--pui-color-text-muted); font-family: monospace; margin-top: 0.5rem; }</style>
