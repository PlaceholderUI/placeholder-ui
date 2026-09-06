<script lang="ts">
	import Paper from '$lib/display/Paper.svelte';
	import { Icon } from '$lib/icon/index.js';
	import * as icons from '$lib/icon/index.js';
	import Button from '$lib/ui/Button.svelte';

	// New icons added in latest update
	const newIcons = new Set([
		'iconArchive',
		'iconArrowDown',
		'iconArrowLeft',
		'iconArrowRight',
		'iconArrowUp',
		'iconAt',
		'iconBell',
		'iconBookmark',
		'iconCalendar',
		'iconCamera',
		'iconChartBar',
		'iconChartLine',
		'iconChartPie',
		'iconCheckbox',
		'iconChecklist',
		'iconCircleCheck',
		'iconCircleX',
		'iconClock',
		'iconCreditCard',
		'iconDots',
		'iconDotsVertical',
		'iconExternalLink',
		'iconEye',
		'iconEyeOff',
		'iconFilter',
		'iconFingerprint',
		'iconFlag',
		'iconHeart',
		'iconHome',
		'iconKey',
		'iconListCheck',
		'iconLogin',
		'iconLogout',
		'iconMapPin',
		'iconMaximize',
		'iconMicrophone',
		'iconMinimize',
		'iconNote',
		'iconPlayerPause',
		'iconPrinter',
		'iconQrcode',
		'iconSend',
		'iconSettings',
		'iconShare',
		'iconShoppingCart',
		'iconSortAscending',
		'iconSortDescending',
		'iconStar',
		'iconTag',
		'iconTrendingDown',
		'iconTrendingUp',
		'iconUpload',
		'iconVolume',
		'iconVolumeOff',
		'iconWorld',
		'iconZoomIn',
		'iconZoomOut'
	]);

	const iconList = Object.entries(icons)
		.filter(([key]) => key.startsWith('icon') && key !== 'Icon')
		.map(([key, value]) => ({
			name: key
				.replace('icon', '')
				.replace(/([A-Z])/g, '-$1')
				.toLowerCase()
				.slice(1),
			key,
			svg: value as string,
			isNew: newIcons.has(key)
		}))
		.sort((a, b) => a.name.localeCompare(b.name));

	let searchQuery = $state('');
	let copiedIcon = $state('');
	let showNewOnly = $state(false);

	const filteredIcons = $derived(
		iconList.filter((icon) => {
			const matchesSearch = !searchQuery || icon.name.includes(searchQuery.toLowerCase());
			const matchesNew = !showNewOnly || icon.isNew;
			return matchesSearch && matchesNew;
		})
	);

	const newIconCount = iconList.filter((i) => i.isNew).length;

	function copyIconName(iconKey: string) {
		navigator.clipboard.writeText(iconKey);
		copiedIcon = iconKey;
		setTimeout(() => (copiedIcon = ''), 2000);
	}
</script>

<div class="page-header">
	<h1>Icons</h1>
	<p>A collection of SVG icons available in the component library.</p>
</div>

<div class="vstack">
	<Paper title="Icon Component Usage">
		<div class="example-grid">
			<div class="example">
				<h4>Basic Icon</h4>
				<Icon svg={icons.iconUser} />
				<pre><code>{`<Icon svg={iconUser} />`}</code></pre>
			</div>

			<div class="example">
				<h4>Colored Icon</h4>
				<Icon svg={icons.iconUser} stroke="#22c55e" />
				<pre><code>{`<Icon svg={iconUser} stroke="#22c55e" />`}</code></pre>
			</div>

			<div class="example">
				<h4>Filled Icon</h4>
				<Icon svg={icons.iconUser} fill="#3b82f6" stroke="#3b82f6" />
				<pre><code>{`<Icon svg={iconUser} fill="#3b82f6" stroke="#3b82f6" />`}</code></pre>
			</div>

			<div class="example">
				<h4>Flipped Icon</h4>
				<Icon svg={icons.iconChevronRight} flip={true} />
				<pre><code>{`<Icon svg={iconChevronRight} flip={true} />`}</code></pre>
			</div>

			<div class="example">
				<h4>With Button</h4>
				<Button variant="primary" svg={icons.iconTrash}>Delete</Button>
				<pre><code>{`<Button variant="primary" svg={iconTrash}>Delete</Button>`}</code></pre>
			</div>
		</div>
	</Paper>

	<Paper title="Available Icons">
		<div class="search-container">
			<input
				type="text"
				placeholder="Search icons..."
				bind:value={searchQuery}
				class="search-input"
			/>
			<button
				class="new-filter-btn"
				class:active={showNewOnly}
				onclick={() => (showNewOnly = !showNewOnly)}
			>
				New ({newIconCount})
			</button>
			<span class="icon-count">{filteredIcons.length} icons</span>
		</div>

		<div class="icons-grid">
			{#each filteredIcons as icon (icon.key)}
				<button
					class="icon-card"
					class:copied={copiedIcon === icon.key}
					onclick={() => copyIconName(icon.key)}
					title="Click to copy import name"
				>
					{#if icon.isNew}
						<span class="new-badge">NEW</span>
					{/if}
					<Icon svg={icon.svg} size="24px" />
					<span class="icon-name">{icon.name}</span>
					<span class="icon-key">{icon.key}</span>
					{#if copiedIcon === icon.key}
						<span class="copied-badge">Copied!</span>
					{/if}
				</button>
			{/each}
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

	.example-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(175px, 1fr));
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.example {
		text-align: center;
	}

	.example h4 {
		margin: 0 0 1rem 0;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-muted);
	}

	.example pre {
		margin-top: 1rem;
		padding: 0.5rem;
		background: var(--bg-subtle);
		border-radius: 4px;
		font-size: 0.75rem;
		overflow-x: auto;
	}

	.example code {
		font-family: 'Consolas', 'Monaco', monospace;
	}

	.search-container {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	.search-input {
		flex: 1;
		padding: 0.5rem 1rem;
		border: 1px solid var(--border-color);
		border-radius: 6px;
		background: var(--bg-color);
		color: var(--text-color);
		font-size: 0.875rem;
	}

	.search-input:focus {
		outline: none;
		border-color: var(--accent-color);
	}

	.icon-count {
		color: var(--text-muted);
		font-size: 0.875rem;
	}

	.icons-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
		gap: 0.75rem;
	}

	.icon-card {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 1rem 0.5rem;
		background: var(--bg-color);
		border: 1px solid var(--border-color);
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s;
	}

	.icon-card:hover {
		background: var(--bg-subtle);
		border-color: var(--accent-color);
		transform: translateY(-2px);
	}

	.icon-card.copied {
		background: var(--success-bg, #10b98114);
		border-color: var(--success-color, #10b981);
	}

	.icon-name {
		margin-top: 0.5rem;
		font-size: 0.75rem;
		color: var(--text-color);
		word-break: break-word;
	}

	.icon-key {
		margin-top: 0.25rem;
		font-size: 0.625rem;
		color: var(--text-muted);
		font-family: 'Consolas', 'Monaco', monospace;
	}

	.copied-badge {
		position: absolute;
		top: 0.25rem;
		right: 0.25rem;
		padding: 0.125rem 0.375rem;
		background: var(--success-color, #10b981);
		color: white;
		font-size: 0.625rem;
		font-weight: 600;
		border-radius: 4px;
	}

	.new-badge {
		position: absolute;
		top: 0.25rem;
		left: 0.25rem;
		padding: 0.125rem 0.375rem;
		background: linear-gradient(135deg, #8b5cf6, #ec4899);
		color: white;
		font-size: 0.5rem;
		font-weight: 700;
		border-radius: 4px;
		letter-spacing: 0.5px;
	}

	.new-filter-btn {
		padding: 0.5rem 1rem;
		border: 1px solid var(--border-color);
		border-radius: 6px;
		background: var(--bg-color);
		color: var(--text-color);
		font-size: 0.875rem;
		cursor: pointer;
		transition: all 0.2s;
	}

	.new-filter-btn:hover {
		background: var(--bg-subtle);
		border-color: var(--accent-color);
	}

	.new-filter-btn.active {
		background: linear-gradient(135deg, #8b5cf6, #ec4899);
		border-color: transparent;
		color: white;
	}
</style>
