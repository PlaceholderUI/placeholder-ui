<script lang="ts">
	import Paper from '$lib/display/Paper.svelte';
	import StringArrayBuilder from '$lib/form/StringArrayBuilder.svelte';

	// Demo 1: Empty initial state
	let basicItems: string[] = $state([]);

	// Demo 2: Pre-populated tags
	let tagItems: string[] = $state(['typescript', 'svelte', 'vite']);

	// Demo 3: With change callback
	let allowList: string[] = $state(['admin@example.com']);
	let lastChange = $state('');

	function handleAllowListChange(items: string[]) {
		lastChange = `${items.length} item(s) — ${items.join(', ') || 'empty'}`;
	}
</script>

<div class="page-header">
	<h1>StringArray Builder</h1>
	<p>
		Visually build flat string arrays. Same UX as ComboBox Builder, but a single value column and no
		selected state.
	</p>
</div>

<div class="vstack">
	<Paper title="Basic Usage">
		<div class="demo-grid">
			<div class="builder-section">
				<StringArrayBuilder label="Build Values" bind:items={basicItems} />
			</div>
			<div class="preview-section">
				<h4>Generated Output</h4>
				{#if basicItems.length > 0}
					<pre class="code-preview">{JSON.stringify(basicItems, null, 2)}</pre>
				{:else}
					<p class="empty-state">Add values using the builder to see the output</p>
				{/if}
			</div>
		</div>
	</Paper>

	<Paper title="Pre-populated with Custom Placeholder">
		<div class="demo-grid">
			<div class="builder-section">
				<StringArrayBuilder label="Tags" bind:items={tagItems} placeholder="Enter a tag..." />
			</div>
			<div class="preview-section">
				<h4>Tags</h4>
				<div class="tag-list">
					{#each tagItems as tag}
						<span class="tag">{tag}</span>
					{/each}
				</div>
			</div>
		</div>
	</Paper>

	<Paper title="With Change Callback">
		<div class="demo-grid">
			<div class="builder-section">
				<StringArrayBuilder
					label="Allow List"
					bind:items={allowList}
					placeholder="email@example.com"
					onchange={handleAllowListChange}
				/>
			</div>
			<div class="preview-section">
				<h4>Last change</h4>
				<p class="selected-value">{lastChange || '(no changes yet)'}</p>
			</div>
		</div>
	</Paper>

	<Paper title="Features">
		<div class="feature-list">
			<ul>
				<li><strong>Add values:</strong> Type and press Enter or click the + button</li>
				<li><strong>Remove values:</strong> Click the trash icon</li>
				<li><strong>Inline editing:</strong> Edit values directly in the table</li>
				<li><strong>Duplicate detection:</strong> Prevents adding the same value twice</li>
				<li><strong>Two-way binding:</strong> Use bind:items for reactive updates</li>
				<li><strong>Change callback:</strong> onchange event fires when items change</li>
				<li><strong>Custom placeholder:</strong> Configure via the placeholder prop</li>
			</ul>
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

	.demo-grid {
		display: grid;
		gap: 2rem;
	}

	.builder-section {
		min-width: 0;
	}

	.preview-section {
		padding: 1rem;
		background-color: rgba(var(--ui-primary-rgbc), 0.03);
		border-radius: 0.375rem;
		border: 1px solid var(--border-color);
	}

	.preview-section h4 {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-color);
		margin: 0 0 0.75rem 0;
	}

	.code-preview {
		background-color: var(--input-bg-color);
		border: 1px solid var(--border-color);
		border-radius: 0.25rem;
		padding: 0.75rem;
		font-size: 0.75rem;
		overflow-x: auto;
		margin: 0;
		color: var(--text-color);
	}

	.empty-state {
		color: var(--text-muted);
		font-style: italic;
		margin: 0;
	}

	.selected-value {
		margin: 0;
		font-size: 0.875rem;
		color: var(--text-muted);
	}

	.tag-list {
		display: flex;
		flex-wrap: wrap;
		gap: 0.375rem;
	}

	.tag {
		padding: 0.25rem 0.625rem;
		border-radius: 999px;
		background-color: var(--input-bg-color);
		border: 1px solid var(--border-color);
		font-size: 0.8125rem;
		color: var(--text-color);
	}

	.feature-list ul {
		margin: 0;
		padding-left: 1.5rem;
		color: var(--text-color);
	}

	.feature-list li {
		margin-bottom: 0.5rem;
		line-height: 1.5;
	}

	.feature-list strong {
		color: var(--ui-primary);
		font-weight: 600;
	}

	:global(.dark) .preview-section {
		background-color: rgba(var(--ui-accent-rgbc), 0.03);
	}

	:global(.dark) .feature-list strong {
		color: var(--ui-accent);
	}

	@media (min-width: 768px) {
		.demo-grid {
			grid-template-columns: 1fr 1fr;
		}
	}
</style>
