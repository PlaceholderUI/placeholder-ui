<script lang="ts">
	import {
		Table, Icon, Paper,
		iconCheck, iconPlus, iconTrash, iconEdit, iconSearch, iconUser, iconSettings, iconHome,
		iconStar, iconHeart, iconBell, iconMail, iconCalendar, iconFolder, iconFile,
		iconLock, iconDownload, iconUpload, iconRefresh, iconX, iconCopy, iconEye, iconFilter,
		iconFlag, iconKey
	} from '$lib/index.js';
	import type { Column } from '$lib/index.js';

	const iconList = [
		{ name: 'iconCheck', svg: iconCheck },
		{ name: 'iconPlus', svg: iconPlus },
		{ name: 'iconTrash', svg: iconTrash },
		{ name: 'iconEdit', svg: iconEdit },
		{ name: 'iconSearch', svg: iconSearch },
		{ name: 'iconUser', svg: iconUser },
		{ name: 'iconSettings', svg: iconSettings },
		{ name: 'iconHome', svg: iconHome },
		{ name: 'iconStar', svg: iconStar },
		{ name: 'iconHeart', svg: iconHeart },
		{ name: 'iconBell', svg: iconBell },
		{ name: 'iconMail', svg: iconMail },
		{ name: 'iconCalendar', svg: iconCalendar },
		{ name: 'iconFolder', svg: iconFolder },
		{ name: 'iconFile', svg: iconFile },
		{ name: 'iconLock', svg: iconLock },
		{ name: 'iconDownload', svg: iconDownload },
		{ name: 'iconUpload', svg: iconUpload },
		{ name: 'iconRefresh', svg: iconRefresh },
		{ name: 'iconX', svg: iconX },
		{ name: 'iconCopy', svg: iconCopy },
		{ name: 'iconEye', svg: iconEye },
		{ name: 'iconFilter', svg: iconFilter },
		{ name: 'iconFlag', svg: iconFlag },
		{ name: 'iconKey', svg: iconKey }
	];

	let selectedSize = $state('24px');
	let selectedStroke = $state('currentColor');

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
		{ prop: 'svg', type: 'string', default: 'required', description: 'Raw SVG string (from icon imports)' },
		{ prop: 'stroke', type: 'string', default: '\'currentColor\'', description: 'Stroke color for the icon' },
		{ prop: 'fill', type: 'string', default: '\'none\'', description: 'Fill color for the icon' },
		{ prop: 'size', type: 'string', default: '\'\'', description: 'Width and height (e.g. \'24px\', \'1.5rem\')' },
		{ prop: 'flip', type: 'boolean', default: 'false', description: 'Horizontally flip the icon' },
		{ prop: 'class', type: 'string', default: '\'\'', description: 'Additional CSS classes' },
	];
</script>

<h1>Icons</h1>
<p>The library includes a collection of Tabler icons exported as SVG strings, rendered via the Icon component.</p>

<div class="vstack">
	<Paper title="Usage">
		<div class="demo-row">
			<Icon svg={iconCheck} size="24px" />
			<Icon svg={iconStar} size="24px" />
			<Icon svg={iconHeart} size="24px" />
			<Icon svg={iconUser} size="24px" />
			<Icon svg={iconSettings} size="24px" />
		</div>
		<div class="value-display">
			{`import { Icon, iconCheck } from '$lib/index.js';`}
			<br />
			{`<Icon svg={iconCheck} size="24px" />`}
		</div>
	</Paper>

	<Paper title="Sizes">
		<div class="demo-row">
			<div class="icon-size-demo">
				<Icon svg={iconStar} size="16px" />
				<span class="size-label">16px</span>
			</div>
			<div class="icon-size-demo">
				<Icon svg={iconStar} size="20px" />
				<span class="size-label">20px</span>
			</div>
			<div class="icon-size-demo">
				<Icon svg={iconStar} size="24px" />
				<span class="size-label">24px</span>
			</div>
			<div class="icon-size-demo">
				<Icon svg={iconStar} size="32px" />
				<span class="size-label">32px</span>
			</div>
			<div class="icon-size-demo">
				<Icon svg={iconStar} size="48px" />
				<span class="size-label">48px</span>
			</div>
		</div>
	</Paper>

	<Paper title="Colors">
		<div class="demo-row">
			<Icon svg={iconHeart} size="28px" stroke="var(--pui-color-danger)" />
			<Icon svg={iconCheck} size="28px" stroke="var(--pui-color-success)" />
			<Icon svg={iconStar} size="28px" stroke="var(--pui-color-warning)" />
			<Icon svg={iconBell} size="28px" stroke="var(--pui-color-info)" />
			<Icon svg={iconSettings} size="28px" stroke="var(--pui-color-primary)" />
		</div>
		<div class="value-display">Use the <code>stroke</code> prop to change icon color</div>
	</Paper>

	<Paper title="Available Icons">
		<p style="margin-bottom: 1rem; font-size: 0.875rem;">A selection of commonly used icons. All icons are imported from <code>'$lib/index.js'</code>.</p>
		<div class="icon-grid">
			{#each iconList as icon}
				<div class="icon-cell">
					<Icon svg={icon.svg} size="24px" />
					<span class="icon-name">{icon.name}</span>
				</div>
			{/each}
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
	.value-display { font-size: 0.875rem; color: var(--pui-color-text-muted); font-family: monospace; margin-top: 0.5rem; }.icon-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
		gap: 0.5rem;
	}

	.icon-cell {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.375rem;
		padding: 0.75rem 0.25rem;
		border: 1px solid var(--pui-color-border);
		border-radius: 0.375rem;
		transition: background-color 0.15s;
	}

	.icon-cell:hover {
		background: var(--pui-bg-hover);
	}

	.icon-name {
		font-size: 0.625rem;
		font-family: monospace;
		color: var(--pui-text-muted);
		text-align: center;
		word-break: break-all;
	}

	.icon-size-demo {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
	}

	.size-label {
		font-size: 0.75rem;
		color: var(--pui-text-muted);
		font-family: monospace;
	}
</style>
