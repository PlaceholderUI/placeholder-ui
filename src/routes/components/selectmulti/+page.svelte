<script lang="ts">
	import Paper from '$lib/display/Paper.svelte';
	import SelectMulti from '$lib/form/SelectMulti.svelte';
	import type { ComboBoxItem, ComboBoxGroup } from '$lib/models/ComboBoxItem.js';
	import { MessageTypes, type NotifyModel } from '$lib/models/NotifyModel.js';
	import UserDisplay from '../select/UserDisplay.svelte';

	// Basic options
	const countryOptions: ComboBoxItem[] = [
		{ label: 'United States', value: 'us' },
		{ label: 'Canada', value: 'ca' },
		{ label: 'United Kingdom', value: 'uk' },
		{ label: 'Germany', value: 'de' },
		{ label: 'France', value: 'fr' },
		{ label: 'Japan', value: 'jp' },
		{ label: 'Australia', value: 'au' }
	];

	const priorityOptions: ComboBoxItem[] = [
		{ label: 'Low', value: 'low' },
		{ label: 'Medium', value: 'medium' },
		{ label: 'High', value: 'high' },
		{ label: 'Critical', value: 'critical' }
	];

	const statusOptions: ComboBoxItem[] = [
		{ label: 'Active', value: 'active' },
		{ label: 'Inactive', value: 'inactive' },
		{ label: 'Pending', value: 'pending' },
		{ label: 'Archived', value: 'archived' }
	];

	// Grouped options
	const categoryGroups: ComboBoxGroup[] = [
		{
			label: 'Technology',
			items: [
				{ label: 'Frontend Development', value: 'frontend' },
				{ label: 'Backend Development', value: 'backend' },
				{ label: 'Mobile Development', value: 'mobile' },
				{ label: 'DevOps', value: 'devops' }
			]
		},
		{
			label: 'Design',
			items: [
				{ label: 'UI/UX Design', value: 'uiux' },
				{ label: 'Graphic Design', value: 'graphic' },
				{ label: 'Web Design', value: 'webdesign' }
			]
		},
		{
			label: 'Business',
			items: [
				{ label: 'Marketing', value: 'marketing' },
				{ label: 'Sales', value: 'sales' },
				{ label: 'Project Management', value: 'pm' }
			]
		}
	];

	// Large options list for search demo
	const largeOptionsList: ComboBoxItem[] = [
		...countryOptions,
		{ label: 'Brazil', value: 'br' },
		{ label: 'Argentina', value: 'ar' },
		{ label: 'Mexico', value: 'mx' },
		{ label: 'Spain', value: 'es' },
		{ label: 'Italy', value: 'it' },
		{ label: 'Netherlands', value: 'nl' },
		{ label: 'Belgium', value: 'be' },
		{ label: 'Sweden', value: 'se' },
		{ label: 'Norway', value: 'no' },
		{ label: 'Denmark', value: 'dk' },
		{ label: 'Finland', value: 'fi' },
		{ label: 'Poland', value: 'pl' },
		{ label: 'Czech Republic', value: 'cz' },
		{ label: 'Austria', value: 'at' },
		{ label: 'Switzerland', value: 'ch' },
		{ label: 'South Korea', value: 'kr' },
		{ label: 'China', value: 'cn' },
		{ label: 'India', value: 'in' },
		{ label: 'Singapore', value: 'sg' },
		{ label: 'New Zealand', value: 'nz' }
	];

	// State variables
	let basicCountries = $state<string[]>([]);
	let preSelectedPriorities = $state<string[]>(['medium', 'high']);
	let requiredStatuses = $state<string[]>([]);
	let disabledChoices = $state<string[]>(['active', 'pending']);
	let errorChoices = $state<string[]>([]);
	let searchableCountries = $state<string[]>([]);
	let groupedCategories = $state<string[]>([]);

	// Form example state
	let userCountries = $state<string[]>([]);
	let taskPriorities = $state<string[]>(['medium']);
	let projectStatuses = $state<string[]>(['active']);
	let skillCategories = $state<string[]>([]);

	// Raw value examples
	let rawCountryValues = $state<ComboBoxItem[]>([]);
	let rawPriorityValues = $state<ComboBoxItem[]>([]);

	// Initial rawValues examples — preset the selection with full item objects
	let presetValues = $state<string[]>([]);
	let presetRawValues = $state<ComboBoxItem[]>([
		{ label: 'Japan', value: 'jp' },
		{ label: 'Australia', value: 'au' }
	]);

	let asyncSearchValues = $state<string[]>([]);
	let asyncSearchRawValues = $state<ComboBoxItem[]>([
		{ label: 'Sweden', value: 'se' },
		{ label: 'Norway', value: 'no' }
	]);

	function simulateCountrySearch(query: string): Promise<NotifyModel<ComboBoxItem[]>> {
		return new Promise((resolve) => {
			setTimeout(() => {
				const filtered = largeOptionsList.filter((country) =>
					country.label.toLowerCase().includes(query.toLowerCase())
				);
				resolve({
					type: MessageTypes.success,
					message: 'Search completed',
					isSuccess: true,
					object: filtered
				});
			}, 500);
		});
	}

	// Custom display component examples
	const userOptions: any[] = [
		{
			label: 'John Doe',
			value: 'john',
			email: 'john.doe@example.com',
			avatar: 'https://i.pravatar.cc/150?u=john',
			status: 'online',
			component: UserDisplay,
			selectedComponent: UserDisplay,
			selectedComponentProps: { size: 'medium', showStatus: true }
		},
		{
			label: 'Jane Smith',
			value: 'jane',
			email: 'jane.smith@example.com',
			avatar: 'https://i.pravatar.cc/150?u=jane',
			status: 'busy',
			component: UserDisplay,
			selectedComponent: UserDisplay,
			selectedComponentProps: { size: 'medium', showStatus: true }
		},
		{
			label: 'Bob Johnson',
			value: 'bob',
			email: 'bob.johnson@example.com',
			avatar: 'https://i.pravatar.cc/150?u=bob',
			status: 'away',
			component: UserDisplay,
			selectedComponent: UserDisplay,
			selectedComponentProps: { size: 'medium', showStatus: true }
		},
		{
			label: 'Alice Williams',
			value: 'alice',
			email: 'alice.williams@example.com',
			avatar: 'https://i.pravatar.cc/150?u=alice',
			status: 'offline',
			component: UserDisplay,
			selectedComponent: UserDisplay,
			selectedComponentProps: { size: 'medium', showStatus: true }
		},
		{
			label: 'Charlie Brown',
			value: 'charlie',
			email: 'charlie.brown@example.com',
			avatar: 'https://i.pravatar.cc/150?u=charlie',
			status: 'online',
			component: UserDisplay,
			selectedComponent: UserDisplay,
			selectedComponentProps: { size: 'medium', showStatus: true }
		}
	];

	let selectedUsers = $state<string[]>([]);

	// --- Reactive options demo state ---

	// 1. Dependent dropdowns: country -> regions (multi)
	const regionsByCountry: Record<string, ComboBoxItem[]> = {
		us: [
			{ label: 'California', value: 'ca' },
			{ label: 'New York', value: 'ny' },
			{ label: 'Texas', value: 'tx' },
			{ label: 'Florida', value: 'fl' }
		],
		ca: [
			{ label: 'Ontario', value: 'on' },
			{ label: 'Quebec', value: 'qc' },
			{ label: 'British Columbia', value: 'bc' },
			{ label: 'Alberta', value: 'ab' }
		],
		uk: [
			{ label: 'England', value: 'eng' },
			{ label: 'Scotland', value: 'sct' },
			{ label: 'Wales', value: 'wls' },
			{ label: 'Northern Ireland', value: 'nir' }
		],
		de: [
			{ label: 'Bavaria', value: 'by' },
			{ label: 'Berlin', value: 'be' },
			{ label: 'Hamburg', value: 'hh' },
			{ label: 'Saxony', value: 'sn' }
		]
	};

	let dependentCountries = $state<string[]>([]);
	let dependentRegions = $state<string[]>([]);
	let regionOptions = $derived(
		dependentCountries.flatMap((country) =>
			(regionsByCountry[country] ?? []).map((r) => ({ ...r, value: `${country}:${r.value}` }))
		)
	);

	// 2. Runtime mutation: replace the options array on demand
	let mutableOptions = $state<ComboBoxItem[]>([
		{ label: 'Apple', value: 'apple' },
		{ label: 'Banana', value: 'banana' },
		{ label: 'Cherry', value: 'cherry' }
	]);
	let mutableValues = $state<string[]>([]);

	function swapToVegetables() {
		mutableOptions = [
			{ label: 'Carrot', value: 'carrot' },
			{ label: 'Broccoli', value: 'broccoli' },
			{ label: 'Spinach', value: 'spinach' },
			{ label: 'Potato', value: 'potato' }
		];
	}

	function swapToFruits() {
		mutableOptions = [
			{ label: 'Apple', value: 'apple' },
			{ label: 'Banana', value: 'banana' },
			{ label: 'Cherry', value: 'cherry' },
			{ label: 'Mango', value: 'mango' },
			{ label: 'Pineapple', value: 'pineapple' }
		];
	}

	function appendOption() {
		mutableOptions = [
			...mutableOptions,
			{ label: `Item ${mutableOptions.length + 1}`, value: `item-${crypto.randomUUID()}` }
		];
	}

	function clearOptions() {
		mutableOptions = [];
	}

	// 3. Grouped options that can be swapped at runtime
	const techGroups: ComboBoxGroup[] = [
		{
			label: 'Languages',
			items: [
				{ label: 'TypeScript', value: 'ts' },
				{ label: 'Rust', value: 'rs' },
				{ label: 'Go', value: 'go' }
			]
		},
		{
			label: 'Frameworks',
			items: [
				{ label: 'Svelte', value: 'svelte' },
				{ label: 'React', value: 'react' },
				{ label: 'Vue', value: 'vue' }
			]
		}
	];

	const animalGroups: ComboBoxGroup[] = [
		{
			label: 'Mammals',
			items: [
				{ label: 'Dog', value: 'dog' },
				{ label: 'Cat', value: 'cat' },
				{ label: 'Horse', value: 'horse' }
			]
		},
		{
			label: 'Birds',
			items: [
				{ label: 'Eagle', value: 'eagle' },
				{ label: 'Sparrow', value: 'sparrow' },
				{ label: 'Owl', value: 'owl' }
			]
		}
	];

	let showTechGroups = $state(true);
	let activeGroups = $derived(showTechGroups ? techGroups : animalGroups);
	let groupedValues = $state<string[]>([]);

	function toggleGroups() {
		showTechGroups = !showTechGroups;
	}

	// 4. Reference-stable identity test
	let referenceTick = $state(0);
	let stableContents: ComboBoxItem[] = [
		{ label: 'Red', value: 'red' },
		{ label: 'Green', value: 'green' },
		{ label: 'Blue', value: 'blue' }
	];
	let unstableOptions = $derived(referenceTick >= 0 ? [...stableContents] : stableContents);
	let stableValues = $state<string[]>(['green']);

	function handleCountryChange(values: string[]) {
		console.log('Countries changed:', values);
	}

	function handleRawCountryChange(items: ComboBoxItem[]) {
		console.log('Raw countries value:', items);
		rawCountryValues = items;
	}

	function handlePriorityChange(values: string[]) {
		console.log('Priorities changed:', values);
	}

	function handleRawPriorityChange(items: ComboBoxItem[]) {
		console.log('Raw priorities value:', items);
		rawPriorityValues = items;
	}
</script>

<div class="page-header">
	<h1>SelectMulti</h1>
	<p>Multi-select dropdown component with search, grouping, and dynamic loading capabilities.</p>
</div>

<div class="vstack">
	<Paper title="Basic Usage">
		<div class="form-grid">
			<div class="select-section">
				<SelectMulti
					label="Choose Countries"
					options={countryOptions}
					placeholder="Select countries..."
					bind:values={basicCountries}
				/>
				<SelectMulti
					label="Priorities (Pre-selected)"
					options={priorityOptions}
					bind:values={preSelectedPriorities}
				/>
			</div>
			<div class="select-info">
				<strong>Current Values:</strong>
				<p>Countries: {basicCountries.length ? basicCountries.join(', ') : 'None selected'}</p>
				<p>Priorities: {preSelectedPriorities.join(', ')}</p>
			</div>
		</div>
	</Paper>

	<Paper title="States">
		<div class="form-grid">
			<div class="select-section">
				<SelectMulti
					label="Required Statuses"
					options={statusOptions}
					placeholder="Please select statuses..."
					required={true}
					bind:values={requiredStatuses}
				/>
				<SelectMulti
					label="Disabled SelectMulti"
					options={statusOptions}
					disabled={true}
					bind:values={disabledChoices}
				/>
				<SelectMulti
					label="SelectMulti with Error"
					options={statusOptions}
					placeholder="This has an error..."
					showError={true}
					errorText="Please select at least one option"
					bind:values={errorChoices}
				/>
			</div>
			<div class="select-info">
				<strong>State Values:</strong>
				<p>Required: {requiredStatuses.length ? requiredStatuses.join(', ') : 'None selected'}</p>
				<p>Disabled: {disabledChoices.join(', ')}</p>
				<p>Error: {errorChoices.length ? errorChoices.join(', ') : 'None selected'}</p>
			</div>
		</div>
	</Paper>

	<Paper title="Searchable SelectMulti">
		<div class="form-grid">
			<div class="select-section">
				<SelectMulti
					label="Countries with Search"
					options={largeOptionsList}
					placeholder="Type to search countries..."
					allowSearch={true}
					bind:values={searchableCountries}
				/>
			</div>
			<div class="select-info">
				<strong>Search Features:</strong>
				<p>Selected: {searchableCountries.length ? searchableCountries.join(', ') : 'None'}</p>
				<p class="note">
					Start typing to filter the options. This example includes {largeOptionsList.length} countries.
				</p>
			</div>
		</div>
	</Paper>

	<Paper title="Grouped Options">
		<div class="form-grid">
			<div class="select-section">
				<SelectMulti
					label="Skill Categories"
					groupedOptions={categoryGroups}
					placeholder="Select your expertise..."
					bind:values={groupedCategories}
				/>
			</div>
			<div class="select-info">
				<strong>Grouped Selection:</strong>
				<p>Categories: {groupedCategories.length ? groupedCategories.join(', ') : 'None'}</p>
				<p class="note">Options are organized into logical groups for better navigation.</p>
			</div>
		</div>
	</Paper>

	<Paper title="Event Handlers & Raw Values">
		<div class="form-grid">
			<div class="select-section">
				<SelectMulti
					label="Countries with Events"
					options={countryOptions}
					placeholder="Select countries..."
					bind:values={basicCountries}
					onchange={handleCountryChange}
					onchangeRaw={handleRawCountryChange}
				/>
				<SelectMulti
					label="Priorities with Events"
					options={priorityOptions}
					bind:values={preSelectedPriorities}
					onchange={handlePriorityChange}
					onchangeRaw={handleRawPriorityChange}
				/>
			</div>
			<div class="select-info">
				<strong>Event Data:</strong>
				<p>
					Raw Countries: {rawCountryValues.length
						? rawCountryValues.map((x) => `${x.label} (${x.value})`).join(', ')
						: 'None'}
				</p>
				<p>
					Raw Priorities: {rawPriorityValues.length
						? rawPriorityValues.map((x) => `${x.label} (${x.value})`).join(', ')
						: 'None'}
				</p>
				<p class="note">Check console for detailed event logs.</p>
			</div>
		</div>
	</Paper>

	<Paper title="Initial Raw Values">
		<div class="form-grid">
			<div class="select-section">
				<SelectMulti
					label="Preset via rawValues only"
					options={countryOptions}
					bind:values={presetValues}
					bind:rawValues={presetRawValues}
				/>
				<SelectMulti
					label="Async search with preset selection"
					placeholder="Type to search countries..."
					searchFunction={simulateCountrySearch}
					bind:values={asyncSearchValues}
					bind:rawValues={asyncSearchRawValues}
				/>
			</div>
			<div class="select-info">
				<strong>Initial Raw Values:</strong>
				<p>Adopted values: {presetValues.length ? presetValues.join(', ') : 'None'}</p>
				<p>
					Async selection: {asyncSearchRawValues.length
						? asyncSearchRawValues.map((x) => `${x.label} (${x.value})`).join(', ')
						: 'None'}
				</p>
				<p class="note">
					Both selects were given an initial <code>rawValues</code> array instead of
					<code>values</code>. The first adopts the values from the passed items; the second shows
					the provided labels immediately even though its options load via async search — no
					<code>retrieveLabelFunction</code> round-trip needed.
				</p>
			</div>
		</div>
	</Paper>

	<Paper title="Custom Display Components">
		<div class="form-grid">
			<div class="select-section">
				<SelectMulti
					label="Assign Users"
					options={userOptions}
					placeholder="Select users..."
					bind:values={selectedUsers}
					allowSearch={true}
				/>
			</div>
			<div class="select-info">
				<strong>Custom Display Features:</strong>
				<p>Selected Users: {selectedUsers.length ? selectedUsers.join(', ') : 'None'}</p>
				<div class="feature-notes">
					<p class="note">This example demonstrates:</p>
					<ul class="feature-mini-list">
						<li>Custom component for dropdown items</li>
						<li>Custom display when items are selected</li>
						<li>Avatar, email, and status indicators</li>
						<li>Rich visual presentation</li>
					</ul>
				</div>
			</div>
		</div>
	</Paper>

	<Paper title="Reactive Options — Dependent Dropdowns">
		<div class="form-grid">
			<div class="select-section">
				<SelectMulti
					label="Countries"
					options={countryOptions}
					placeholder="Pick countries..."
					bind:values={dependentCountries}
				/>
				<SelectMulti
					label="Regions"
					options={regionOptions}
					placeholder={dependentCountries.length
						? regionOptions.length
							? 'Pick regions...'
							: 'No regions for the selected countries'
						: 'Select countries first'}
					disabled={!regionOptions.length}
					bind:values={dependentRegions}
				/>
			</div>
			<div class="select-info">
				<strong>Dependent Selection:</strong>
				<p>
					Countries: {dependentCountries.length ? dependentCountries.join(', ') : 'None'}
				</p>
				<p>
					Regions: {dependentRegions.length ? dependentRegions.join(', ') : 'None'}
				</p>
				<p class="note">
					Region options aggregate from all selected countries (US, CA, UK, DE have regions
					defined; others don't). Deselecting a country drops its regions from the value
					automatically thanks to SelectMulti's static-options stale-value cleanup — no parent-side
					$effect needed.
				</p>
			</div>
		</div>
	</Paper>

	<Paper title="Reactive Options — Runtime Mutation">
		<div class="form-grid">
			<div class="select-section">
				<SelectMulti
					label="Mutable Options"
					options={mutableOptions}
					placeholder="Pick anything..."
					allowSearch={true}
					bind:values={mutableValues}
				/>
				<div class="button-row">
					<button class="btn-secondary" onclick={swapToFruits}>Swap to Fruits</button>
					<button class="btn-secondary" onclick={swapToVegetables}>Swap to Vegetables</button>
					<button class="btn-secondary" onclick={appendOption}>Append Option</button>
					<button class="btn-secondary" onclick={clearOptions}>Clear All</button>
				</div>
			</div>
			<div class="select-info">
				<strong>Runtime Mutation:</strong>
				<p>Selected: {mutableValues.length ? mutableValues.join(', ') : 'None'}</p>
				<p>Options count: {mutableOptions.length}</p>
				<p class="note">
					Try: open the dropdown, type a filter, then click a swap button — the active filter
					should re-apply to the new options. Select fruits and then swap to vegetables — the stale
					values drop automatically so form submits don't carry them.
				</p>
			</div>
		</div>
	</Paper>

	<Paper title="Reactive Options — Grouped Swap">
		<div class="form-grid">
			<div class="select-section">
				<SelectMulti
					label="Grouped (swappable)"
					groupedOptions={activeGroups}
					placeholder="Pick anything..."
					bind:values={groupedValues}
				/>
				<div class="button-row">
					<button class="btn-secondary" onclick={toggleGroups}>Toggle Tech / Animals</button>
				</div>
			</div>
			<div class="select-info">
				<strong>Grouped Swap:</strong>
				<p>Selected: {groupedValues.length ? groupedValues.join(', ') : 'None'}</p>
				<p>Current set: {showTechGroups ? 'Tech' : 'Animals'}</p>
				<p class="note">Tests that <code>groupedOptions</code> prop changes are picked up after mount.</p>
			</div>
		</div>
	</Paper>

	<Paper title="Reactive Options — Reference Stability">
		<div class="form-grid">
			<div class="select-section">
				<SelectMulti
					label="Same contents, new array each tick"
					options={unstableOptions}
					bind:values={stableValues}
				/>
				<div class="button-row">
					<button class="btn-secondary" onclick={() => (referenceTick += 1)}>
						Re-render (tick {referenceTick})
					</button>
				</div>
			</div>
			<div class="select-info">
				<strong>Reference Test:</strong>
				<p>Selected: {stableValues.length ? stableValues.join(', ') : 'None'}</p>
				<p class="note">
					Each tick passes a brand-new array reference with the same contents. The ref guard does
					<em>not</em> deep-compare, so this will re-convert on every tick — confirm the dropdown
					doesn't lose state or flicker.
				</p>
			</div>
		</div>
	</Paper>

	<Paper title="Form Example">
		<div class="form-section">
			<h3>User Profile Setup</h3>
			<div class="select-section">
				<SelectMulti
					label="Countries"
					options={countryOptions}
					placeholder="Select your countries..."
					bind:values={userCountries}
					required={true}
				/>
				<SelectMulti
					label="Task Priority Preferences"
					options={priorityOptions}
					bind:values={taskPriorities}
					required={true}
				/>
				<SelectMulti
					label="Project Statuses"
					options={statusOptions}
					bind:values={projectStatuses}
				/>
				<SelectMulti
					label="Skills"
					groupedOptions={categoryGroups}
					placeholder="Choose your areas of expertise..."
					bind:values={skillCategories}
					allowSearch={true}
					required={true}
				/>
			</div>
			<div class="form-summary">
				<strong>Profile Summary:</strong>
				<ul>
					<li>Countries: {userCountries.length ? userCountries.join(', ') : 'Not selected'}</li>
					<li>Task Priorities: {taskPriorities.join(', ')}</li>
					<li>Project Statuses: {projectStatuses.join(', ')}</li>
					<li>Skills: {skillCategories.length ? skillCategories.join(', ') : 'Not selected'}</li>
				</ul>
				<div class="summary-actions">
					<button
						class="btn-primary"
						disabled={!userCountries.length || !taskPriorities.length || !skillCategories.length}
					>
						Save Profile
					</button>
				</div>
			</div>
		</div>
	</Paper>

	<Paper title="Features">
		<div class="feature-list">
			<ul>
				<li><strong>Multi selection:</strong> Choose multiple options from the dropdown</li>
				<li><strong>Search functionality:</strong> Type to filter options in large lists</li>
				<li><strong>Grouped options:</strong> Organize options into logical categories</li>
				<li><strong>Loading states:</strong> Built-in loader for async operations</li>
				<li><strong>Clear functionality:</strong> Easy way to clear all selections</li>
				<li><strong>Required field support:</strong> Visual indicator for required selects</li>
				<li><strong>Error states:</strong> Display error messages and styling</li>
				<li><strong>Disabled states:</strong> Support for disabled selects</li>
				<li><strong>Event handling:</strong> onchange and onchangeRaw callbacks</li>
				<li><strong>Raw value access:</strong> Access to full item objects, not just values</li>
				<li><strong>Initial raw values:</strong> Pass rawValues up front to preset selections with known labels</li>
				<li><strong>Keyboard navigation:</strong> Full keyboard support with arrow keys</li>
				<li><strong>Dynamic loading:</strong> Support for async data fetching</li>
				<li><strong>Custom placeholders:</strong> Configurable placeholder text</li>
				<li><strong>Custom display components:</strong> Use custom components for rich item display</li>
				<li><strong>Reactive options:</strong> Options/groupedOptions prop changes flow through at runtime</li>
				<li><strong>Stale-value protection:</strong> Static option swaps drop values no longer in the list</li>
				<li><strong>Accessibility:</strong> ARIA compliant with screen reader support</li>
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

	.select-section {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.select-info {
		padding: 1rem;
		background-color: rgba(var(--ui-primary-rgbc), 0.05);
		border-radius: 0.375rem;
		border: 1px solid var(--border-color);
	}

	.select-info strong {
		color: var(--text-color);
		font-weight: 600;
	}

	.select-info p {
		margin: 0.25rem 0 0 0;
		color: var(--text-muted);
	}

	.form-section h3 {
		color: var(--text-color);
		font-size: 1.25rem;
		font-weight: 600;
		margin: 0 0 1.5rem 0;
	}

	.form-summary {
		margin-top: 2rem;
		padding: 1.5rem;
		background-color: rgba(var(--ui-primary-rgbc), 0.05);
		border-radius: 0.375rem;
		border: 1px solid var(--border-color);
	}

	.form-summary strong {
		color: var(--text-color);
		font-weight: 600;
		display: block;
		margin-bottom: 0.75rem;
	}

	.form-summary ul {
		margin: 0 0 1rem 0;
		padding-left: 1.5rem;
		color: var(--text-color);
	}

	.form-summary li {
		margin-bottom: 0.5rem;
	}

	.summary-actions {
		border-top: 1px solid var(--border-color);
		padding-top: 1rem;
	}

	.btn-primary {
		background-color: var(--ui-primary);
		color: white;
		border: none;
		padding: 0.75rem 1.5rem;
		border-radius: 0.375rem;
		font-weight: 500;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.btn-primary:hover:not(:disabled) {
		opacity: 0.9;
	}

	.btn-primary:disabled {
		background-color: #6b7280;
		cursor: not-allowed;
	}

	.button-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-top: 0.5rem;
	}

	.btn-secondary {
		background-color: transparent;
		color: var(--text-color);
		border: 1px solid var(--border-color);
		padding: 0.5rem 0.75rem;
		border-radius: 0.375rem;
		font-size: 0.875rem;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.btn-secondary:hover {
		background-color: rgba(var(--ui-primary-rgbc), 0.05);
	}

	:global(.dark) .btn-secondary:hover {
		background-color: rgba(var(--ui-accent-rgbc), 0.05);
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

	.feature-notes {
		margin-top: 1rem;
	}

	.feature-mini-list {
		margin: 0.5rem 0 0 1.5rem;
		padding-left: 0;
		list-style: disc;
		font-size: 0.875rem;
		color: var(--text-muted);
	}

	.feature-mini-list li {
		margin-bottom: 0.25rem;
	}

	:global(.dark) .select-info,
	:global(.dark) .form-summary {
		background-color: rgba(var(--ui-accent-rgbc), 0.05);
	}

	:global(.dark) .feature-list strong {
		color: var(--ui-accent);
	}

	:global(.dark) .btn-primary {
		background-color: var(--ui-accent);
		color: var(--ui-primary);
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
