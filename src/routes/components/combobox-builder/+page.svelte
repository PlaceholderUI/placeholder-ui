<script lang="ts">
	import Paper from '$lib/display/Paper.svelte';
	import ComboBoxItemBuilder from '$lib/form/ComboBoxItemBuilder.svelte';
	import Select from '$lib/form/Select.svelte';
	import SelectMulti from '$lib/form/SelectMulti.svelte';
	import type { ComboBoxItem } from '$lib/models/ComboBoxItem.js';

	// Demo 1: Basic usage with Select (single)
	let basicItems: ComboBoxItem[] = $state([]);
	let basicDefaults: string[] = $state([]);
	let basicSelectedValue = $state('');

	// Demo 2: Pre-populated with SelectMulti
	let multiItems: ComboBoxItem[] = $state([
		{ label: 'Frontend', value: 'frontend' },
		{ label: 'Backend', value: 'backend' },
		{ label: 'DevOps', value: 'devops' },
		{ label: 'Design', value: 'design' }
	]);
	let multiDefaults: string[] = $state(['frontend', 'backend']);
	let multiSelectedValues: string[] = $state(['frontend', 'backend']);

	// Demo 3: Status options for Select
	let statusItems: ComboBoxItem[] = $state([
		{ label: 'Draft', value: 'draft' },
		{ label: 'In Review', value: 'review' },
		{ label: 'Published', value: 'published' },
		{ label: 'Archived', value: 'archived' }
	]);
	let statusDefaults: string[] = $state(['draft']);
	let statusSelectedValue = $state('draft');

	// Demo 4: hideSelected — builder for ComboBoxItem[] without default-tracking
	let categoryItems: ComboBoxItem[] = $state([
		{ label: 'Engineering', value: 'eng' },
		{ label: 'Product', value: 'prod' },
		{ label: 'Design', value: 'design' }
	]);
	let categoryDefaults: string[] = $state([]);
	let categorySelectedValue = $state('');

	let categoryOptions = $derived(categoryItems.map((item) => ({ ...item })));

	// Computed options with selected state applied
	let basicOptions = $derived(
		basicItems.map((item) => ({
			...item,
			selected: basicDefaults.includes(item.value)
		}))
	);

	let multiOptions = $derived(
		multiItems.map((item) => ({
			...item,
			selected: multiDefaults.includes(item.value)
		}))
	);

	let statusOptions = $derived(
		statusItems.map((item) => ({
			...item,
			selected: statusDefaults.includes(item.value)
		}))
	);

	function handleMultiChange(items: ComboBoxItem[], defaults: string[]) {
		multiSelectedValues = defaults;
	}

	function handleStatusChange(items: ComboBoxItem[], defaults: string[]) {
		statusSelectedValue = defaults[0] ?? '';
	}
</script>

<div class="page-header">
	<h1>ComboBoxItem Builder</h1>
	<p>Visually build ComboBoxItem arrays for use with Select and SelectMulti components.</p>
</div>

<div class="vstack">
	<Paper title="Basic Usage (Single Select)">
		<div class="demo-grid">
			<div class="builder-section">
				<ComboBoxItemBuilder
					label="Build Options"
					bind:items={basicItems}
					bind:defaultValues={basicDefaults}
				/>
			</div>
			<div class="preview-section">
				<h4>Generated Output</h4>
				{#if basicItems.length > 0}
					<pre class="code-preview">{JSON.stringify(
							basicItems.map((item) => ({
								label: item.label,
								value: item.value,
								...(basicDefaults.includes(item.value) ? { selected: true } : {})
							})),
							null,
							2
						)}</pre>

					<h4>Test with Select</h4>
					<Select
						label="Preview"
						options={basicOptions}
						bind:value={basicSelectedValue}
						placeholder="Select an option..."
					/>
					<p class="selected-value">Selected: {basicSelectedValue || 'None'}</p>
				{:else}
					<p class="empty-state">Add items using the builder to see the output</p>
				{/if}
			</div>
		</div>
	</Paper>

	<Paper title="Multi-Select Example">
		<p class="section-description">
			Select multiple items as defaults for use with SelectMulti. Column headers are renamed via
			<code>labelHeader</code> and <code>valueHeader</code>; placeholders follow the headers unless
			overridden with <code>labelPlaceholder</code> / <code>valuePlaceholder</code>. Since keys
			differ from skill names here, <code>disableValueSync</code> stops the key field auto-copying the
			label.
		</p>
		<div class="demo-grid">
			<div class="builder-section">
				<ComboBoxItemBuilder
					label="Skills"
					bind:items={multiItems}
					bind:defaultValues={multiDefaults}
					onchange={handleMultiChange}
					labelHeader="Skill"
					valueHeader="Key"
					valuePlaceholder="skill_key"
					disableValueSync
				/>
			</div>
			<div class="preview-section">
				<h4>Live Preview (SelectMulti)</h4>
				<SelectMulti
					label="Select Skills"
					options={multiOptions}
					bind:values={multiSelectedValues}
				/>
				<p class="selected-value">
					Selected: {multiSelectedValues.length > 0 ? multiSelectedValues.join(', ') : 'None'}
				</p>

				<h4>Default Values</h4>
				<p class="default-info">
					{#if multiDefaults.length > 0}
						Defaults: <strong>{multiDefaults.join(', ')}</strong>
					{:else}
						No defaults selected
					{/if}
				</p>
			</div>
		</div>
	</Paper>

	<Paper title="Single Select with Pre-selected Default">
		<p class="section-description">
			For single Select, only the first checked item will be used as the default.
		</p>
		<div class="demo-grid">
			<div class="builder-section">
				<ComboBoxItemBuilder
					label="Status Options"
					bind:items={statusItems}
					bind:defaultValues={statusDefaults}
					onchange={handleStatusChange}
				/>
			</div>
			<div class="preview-section">
				<Select label="Document Status" options={statusOptions} bind:value={statusSelectedValue} />
				<p class="selected-value">Selected: {statusSelectedValue || 'None'}</p>

				<div class="tip">
					<strong>Tip:</strong> When using with Select (single), only the first selected item becomes
					the default value.
				</div>
			</div>
		</div>
	</Paper>

	<Paper title="Hide Selected Column">
		<p class="section-description">
			Pass <code>hideSelected</code> to omit the Selected checkbox column entirely. Useful when you only
			need to build the label/value pairs without tracking defaults.
		</p>
		<div class="demo-grid">
			<div class="builder-section">
				<ComboBoxItemBuilder
					label="Categories"
					bind:items={categoryItems}
					bind:defaultValues={categoryDefaults}
					hideSelected
				/>
			</div>
			<div class="preview-section">
				<h4>Generated Output</h4>
				<pre class="code-preview">{JSON.stringify(categoryItems, null, 2)}</pre>

				<h4>Test with Select</h4>
				<Select
					label="Category"
					options={categoryOptions}
					bind:value={categorySelectedValue}
					placeholder="Pick a category..."
				/>
				<p class="selected-value">Selected: {categorySelectedValue || 'None'}</p>
			</div>
		</div>
	</Paper>

	<Paper title="Features">
		<div class="feature-list">
			<ul>
				<li>
					<strong>Add items:</strong> Start typing in the empty bottom row — the item is added automatically
				</li>
				<li><strong>Remove items:</strong> Click the trash icon to remove any item</li>
				<li><strong>Select defaults:</strong> Use checkboxes to mark items as selected/default</li>
				<li><strong>Multiple selection:</strong> Check multiple items for SelectMulti use cases</li>
				<li><strong>Inline editing:</strong> Edit labels and values directly in the table</li>
				<li>
					<strong>Keyboard support:</strong> Press Enter in an item row to jump back to the empty row
				</li>
				<li>
					<strong>Two-way binding:</strong> Use bind:items and bind:defaultValues for reactive updates
				</li>
				<li>
					<strong>Change callback:</strong> onchange event fires when items or defaults change
				</li>
				<li>
					<strong>Custom column headers:</strong> Rename the Label and Value columns via
					<code>labelHeader</code>
					and <code>valueHeader</code>
				</li>
				<li>
					<strong>Custom placeholders:</strong> Configure labelPlaceholder and valuePlaceholder props
					(default to the column headers)
				</li>
				<li>
					<strong>Independent values:</strong> Set <code>disableValueSync</code> to stop the value field
					auto-copying the label
				</li>
				<li>
					<strong>Duplicate values:</strong> Set <code>allowDuplicateValues</code> to let multiple items
					share a value (labels stay unique; shared values share selected state)
				</li>
				<li>
					<strong>Hide selected column:</strong> Set <code>hideSelected</code> when default-value tracking
					isn't needed
				</li>
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

	.preview-section h4:not(:first-child) {
		margin-top: 1.5rem;
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
		margin: 0.75rem 0 0 0;
		font-size: 0.875rem;
		color: var(--text-muted);
	}

	.default-info {
		margin: 0;
		font-size: 0.875rem;
		color: var(--text-muted);
	}

	.default-info strong {
		color: var(--accent-color);
	}

	.section-description {
		color: var(--text-muted);
		margin: 0 0 1.5rem 0;
	}

	.section-description code,
	.feature-list code {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 0.8125rem;
		padding: 0.125rem 0.375rem;
		background-color: var(--input-bg-color);
		border: 1px solid var(--border-color);
		border-radius: 0.25rem;
		color: var(--text-color);
	}

	.tip {
		margin-top: 1rem;
		padding: 0.75rem;
		background-color: rgba(var(--ui-primary-rgbc), 0.05);
		border-radius: 0.25rem;
		font-size: 0.875rem;
		color: var(--text-muted);
	}

	.tip strong {
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

	:global(.dark) .tip {
		background-color: rgba(var(--ui-accent-rgbc), 0.05);
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
