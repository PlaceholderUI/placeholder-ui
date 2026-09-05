<script lang="ts">
	import Paper from '$lib/display/Paper.svelte';
	import AutocompleteMulti from '$lib/form/AutocompleteMulti.svelte';
	import type { ComboBoxGroup, ComboBoxItem } from '$lib/models/ComboBoxItem.js';
	import type { NotifyModel } from '$lib/models/NotifyModel.js';
	import { MessageTypes } from '$lib/models/NotifyModel.js';
	import { iconSearch } from '$lib/icon/index.js';

	const technologies: ComboBoxItem[] = [
		{ label: 'JavaScript', value: 'js' },
		{ label: 'TypeScript', value: 'ts' },
		{ label: 'Python', value: 'py' },
		{ label: 'Go', value: 'go' },
		{ label: 'Rust', value: 'rust' },
		{ label: 'React', value: 'react' },
		{ label: 'Vue.js', value: 'vue' },
		{ label: 'Angular', value: 'angular' },
		{ label: 'Svelte', value: 'svelte' },
		{ label: 'Node.js', value: 'node' }
	];

	const groupedTechOptions: ComboBoxGroup[] = [
		{
			label: 'Frontend',
			showGroupName: true,
			items: [
				{ label: 'React', value: 'react' },
				{ label: 'Vue.js', value: 'vue' },
				{ label: 'Angular', value: 'angular' },
				{ label: 'Svelte', value: 'svelte' }
			]
		},
		{
			label: 'Backend',
			showGroupName: true,
			items: [
				{ label: 'Node.js', value: 'node' },
				{ label: 'Django', value: 'django' },
				{ label: 'Spring Boot', value: 'spring' },
				{ label: 'Laravel', value: 'laravel' }
			]
		}
	];

	// State
	let basicValues: string[] = ['ts'];
	let basicRaw: ComboBoxItem[] = [];
	let groupedValues: string[] = [];
	let asyncValues: string[] = [];

	// Add-new-value example
	let tags: ComboBoxItem[] = [
		{ label: 'Frontend', value: 'frontend' },
		{ label: 'Backend', value: 'backend' },
		{ label: 'DevOps', value: 'devops' }
	];
	let tagValues: string[] = [];
	let addedTags: string[] = [];

	function handleTagAdded(value: string) {
		if (!tags.some((t) => t.value.toLowerCase() === value.toLowerCase())) {
			tags = [...tags, { label: value, value }];
		}
		addedTags = [value, ...addedTags];
	}

	function simulateAsyncSearch(query: string): Promise<NotifyModel<ComboBoxItem[]>> {
		return new Promise((resolve) => {
			setTimeout(() => {
				const filtered = technologies.filter((tech) =>
					tech.label.toLowerCase().includes(query.toLowerCase())
				);
				resolve({
					type: MessageTypes.success,
					message: 'Search completed',
					isSuccess: true,
					isError: false,
					object: filtered
				});
			}, 500);
		});
	}
</script>

<div class="page-header">
	<h1>AutocompleteMulti</h1>
	<p>Multi-select text input with search suggestions, chips, and keyboard navigation.</p>
</div>

<div class="vstack">
	<Paper title="Basic Usage">
		<div class="form-grid">
			<div class="autocomplete-section">
				<AutocompleteMulti
					label="Technologies"
					placeholder="Search technologies..."
					leftIconSvg={iconSearch}
					bind:values={basicValues}
					bind:rawValues={basicRaw}
					options={technologies}
				/>
			</div>
			<div class="autocomplete-info">
				<strong>Selected:</strong>
				<p>Values: {basicValues.length ? basicValues.join(', ') : 'None'}</p>
				<p>Raw: {basicRaw.map((r) => r.label).join(', ') || 'None'}</p>
				<p class="note">
					Type to filter, click or press Enter to toggle. Backspace on an empty input removes the
					last chip.
				</p>
			</div>
		</div>
	</Paper>

	<Paper title="Grouped Options">
		<div class="form-grid">
			<div class="autocomplete-section">
				<AutocompleteMulti
					label="Tech Stack"
					placeholder="Search by category..."
					bind:values={groupedValues}
					groupedOptions={groupedTechOptions}
					allowAdd={false}
				/>
			</div>
			<div class="autocomplete-info">
				<strong>Selected:</strong>
				<p>{groupedValues.length ? groupedValues.join(', ') : 'None'}</p>
				<p class="note">
					Options organized into Frontend and Backend groups. Setting <code>allowAdd</code> to
					<code>false</code> restricts selection to the provided options.
				</p>
			</div>
		</div>
	</Paper>

	<Paper title="Add New Values">
		<div class="form-grid">
			<div class="autocomplete-section">
				<AutocompleteMulti
					label="Tags"
					placeholder="Search or add tags..."
					bind:values={tagValues}
					options={tags}
					onItemAdded={handleTagAdded}
				/>
			</div>
			<div class="autocomplete-info">
				<strong>Selected tags:</strong>
				<p>{tagValues.length ? tagValues.join(', ') : 'None'}</p>
				<strong>Added tags:</strong>
				{#each addedTags as tag, i (i)}
					<p class="log-entry">{tag}</p>
				{/each}
				<p class="note">
					Adding is on by default — type any value with no match to see the "Add" suggestion.
					Selecting it adds it as a chip and fires <code>onItemAdded</code>.
				</p>
			</div>
		</div>
	</Paper>

	<Paper title="Async Search">
		<div class="form-grid">
			<div class="autocomplete-section">
				<AutocompleteMulti
					label="Async Technology Search"
					placeholder="Search technologies (with delay)..."
					bind:values={asyncValues}
					searchFunction={simulateAsyncSearch}
					loadingText="Searching technologies..."
				/>
			</div>
			<div class="autocomplete-info">
				<strong>Selected:</strong>
				<p>{asyncValues.length ? asyncValues.join(', ') : 'None'}</p>
				<p class="note">Simulates a 500ms network delay. Try typing "React" or "Java".</p>
			</div>
		</div>
	</Paper>

	<Paper title="Features">
		<div class="feature-list">
			<ul>
				<li><strong>Multi-select:</strong> Selected items render as removable chips</li>
				<li><strong>Real-time filtering:</strong> Suggestions update as you type</li>
				<li>
					<strong>Keyboard navigation:</strong> Arrow keys, Enter, Escape, Backspace-to-remove
				</li>
				<li>
					<strong>Add new values:</strong> typed text can always become a chip by default (onItemAdded);
					set allowAdd to false to restrict to options
				</li>
				<li><strong>Grouped options:</strong> Organize options into labeled groups</li>
				<li><strong>Async search:</strong> searchFunction, fetchFunction, retrieveLabelFunction</li>
				<li><strong>Bindable:</strong> values (string[]) and rawValues (ComboBoxItem[])</li>
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

	.form-grid {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.autocomplete-section {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.autocomplete-info {
		padding: 1rem;
		background-color: rgba(var(--ui-primary-rgbc), 0.05);
		border-radius: 0.375rem;
		border: 1px solid var(--border-color);
	}

	.autocomplete-info strong {
		color: var(--text-color);
		font-weight: 600;
		display: block;
		margin-bottom: 0.5rem;
	}

	.autocomplete-info p {
		margin: 0.25rem 0;
		color: var(--text-muted);
	}

	.log-entry {
		font-family: 'Courier New', monospace;
		font-size: 0.875rem;
		background-color: rgba(var(--ui-primary-rgbc), 0.1);
		padding: 0.25rem 0.5rem;
		border-radius: 0.25rem;
		margin: 0.25rem 0;
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

	.note {
		font-size: 0.875rem;
		color: var(--text-muted);
		font-style: italic;
	}

	:global(.dark) .autocomplete-info {
		background-color: rgba(var(--ui-accent-rgbc), 0.05);
	}

	:global(.dark) .feature-list strong {
		color: var(--ui-accent);
	}

	:global(.dark) .log-entry {
		background-color: rgba(var(--ui-accent-rgbc), 0.1);
	}

	@media (min-width: 768px) {
		.form-grid {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: 1.5rem;
			align-items: start;
		}
	}
</style>
