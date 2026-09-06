<script lang="ts">
	import Paper from '$lib/display/Paper.svelte';
	import Select from '$lib/form/Select.svelte';
	import type { ComboBoxItem, ComboBoxGroup } from '$lib/models/ComboBoxItem.js';
	import UserDisplay from './UserDisplay.svelte';

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
	let basicCountry = $state('');
	let preSelectedPriority = $state('medium');
	let requiredStatus = $state('');
	let disabledChoice = $state('active');
	let errorChoice = $state('');
	let searchableCountry = $state('');
	let groupedCategory = $state('');

	// Form example state
	let userCountry = $state('');
	let taskPriority = $state('medium');
	let projectStatus = $state('active');
	let skillCategory = $state('');

	// Raw value examples
	let rawCountryValue = $state<ComboBoxItem | undefined>(undefined);
	let rawPriorityValue = $state<ComboBoxItem | undefined>(undefined);

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

	let selectedUser = $state('');

	// --- Reactive options demo state ---

	// 1. Dependent dropdowns: country -> region
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

	let dependentCountry = $state('');
	let dependentRegion = $state('');
	let regionOptions = $derived(regionsByCountry[dependentCountry] ?? []);

	$effect(() => {
		// Clear the region when the country changes and the current region is no longer valid
		if (dependentRegion && !regionOptions.some((r) => r.value === dependentRegion)) {
			dependentRegion = '';
		}
	});

	// 2. Runtime mutation: replace the options array on demand
	let mutableOptions = $state<ComboBoxItem[]>([
		{ label: 'Apple', value: 'apple' },
		{ label: 'Banana', value: 'banana' },
		{ label: 'Cherry', value: 'cherry' }
	]);
	let mutableValue = $state('');

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

	$effect(() => {
		// Clear selection when the current value is no longer in the option list
		if (mutableValue && !mutableOptions.some((o) => o.value === mutableValue)) {
			mutableValue = '';
		}
	});

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
	let groupedValue = $state('');

	function toggleGroups() {
		showTechGroups = !showTechGroups;
	}

	// 4. Reference-stable identity test: re-render with a new ref but same contents
	let referenceTick = $state(0);
	let stableContents: ComboBoxItem[] = [
		{ label: 'Red', value: 'red' },
		{ label: 'Green', value: 'green' },
		{ label: 'Blue', value: 'blue' }
	];
	let unstableOptions = $derived(referenceTick >= 0 ? [...stableContents] : stableContents);
	let stableValue = $state('green');

	function handleCountryChange(value: string | undefined) {
		console.log('Country changed:', value);
	}

	function handleRawCountryChange(item: ComboBoxItem | undefined) {
		console.log('Raw country value:', item);
		rawCountryValue = item;
	}

	function handlePriorityChange(value: string | undefined) {
		console.log('Priority changed:', value);
	}

	function handleRawPriorityChange(item: ComboBoxItem | undefined) {
		console.log('Raw priority value:', item);
		rawPriorityValue = item;
	}
</script>

<div class="page-header">
	<h1>Select</h1>
	<p>Advanced dropdown component with search, grouping, and dynamic loading capabilities.</p>
</div>

<div class="vstack">
	<Paper title="Basic Usage">
		<div class="form-grid">
			<div class="select-section">
				<Select
					label="Choose Country"
					options={countryOptions}
					placeholder="Select a country..."
					bind:value={basicCountry}
				/>
				<Select
					label="Priority (Pre-selected)"
					options={priorityOptions}
					bind:value={preSelectedPriority}
				/>
			</div>
			<div class="select-info">
				<strong>Current Values:</strong>
				<p>Country: {basicCountry || 'None selected'}</p>
				<p>Priority: {preSelectedPriority}</p>
			</div>
		</div>
	</Paper>

	<Paper title="States">
		<div class="form-grid">
			<div class="select-section">
				<Select
					label="Required Status"
					options={statusOptions}
					placeholder="Please select a status..."
					required={true}
					bind:value={requiredStatus}
				/>
				<Select
					label="Disabled Select"
					options={statusOptions}
					disabled={true}
					bind:value={disabledChoice}
				/>
				<Select
					label="Select with Error"
					options={statusOptions}
					placeholder="This has an error..."
					showError={true}
					errorText="Please select a valid option"
					bind:value={errorChoice}
				/>
			</div>
			<div class="select-info">
				<strong>State Values:</strong>
				<p>Required: {requiredStatus || 'None selected'}</p>
				<p>Disabled: {disabledChoice}</p>
				<p>Error: {errorChoice || 'None selected'}</p>
			</div>
		</div>
	</Paper>

	<Paper title="Searchable Select">
		<div class="form-grid">
			<div class="select-section">
				<Select
					label="Country with Search"
					options={largeOptionsList}
					placeholder="Type to search countries..."
					allowSearch={true}
					bind:value={searchableCountry}
				/>
			</div>
			<div class="select-info">
				<strong>Search Features:</strong>
				<p>Selected: {searchableCountry || 'None selected'}</p>
				<p class="note">
					Start typing to filter the options. This example includes {largeOptionsList.length} countries.
				</p>
			</div>
		</div>
	</Paper>

	<Paper title="Grouped Options">
		<div class="form-grid">
			<div class="select-section">
				<Select
					label="Skill Category"
					groupedOptions={categoryGroups}
					placeholder="Select your expertise..."
					bind:value={groupedCategory}
				/>
			</div>
			<div class="select-info">
				<strong>Grouped Selection:</strong>
				<p>Category: {groupedCategory || 'None selected'}</p>
				<p class="note">Options are organized into logical groups for better navigation.</p>
			</div>
		</div>
	</Paper>

	<Paper title="Event Handlers & Raw Values">
		<div class="form-grid">
			<div class="select-section">
				<Select
					label="Country with Events"
					options={countryOptions}
					placeholder="Select country..."
					bind:value={basicCountry}
					onchange={handleCountryChange}
					onchangeRaw={handleRawCountryChange}
				/>
				<Select
					label="Priority with Events"
					options={priorityOptions}
					bind:value={preSelectedPriority}
					onchange={handlePriorityChange}
					onchangeRaw={handleRawPriorityChange}
				/>
			</div>
			<div class="select-info">
				<strong>Event Data:</strong>
				<p>
					Raw Country: {rawCountryValue
						? `${rawCountryValue.label} (${rawCountryValue.value})`
						: 'None'}
				</p>
				<p>
					Raw Priority: {rawPriorityValue
						? `${rawPriorityValue.label} (${rawPriorityValue.value})`
						: 'None'}
				</p>
				<p class="note">Check console for detailed event logs.</p>
			</div>
		</div>
	</Paper>

	<Paper title="Custom Display Components">
		<div class="form-grid">
			<div class="select-section">
				<Select
					label="Assign User"
					options={userOptions}
					placeholder="Select a user..."
					bind:value={selectedUser}
					allowSearch={true}
				/>
			</div>
			<div class="select-info">
				<strong>Custom Display Features:</strong>
				<p>Selected User: {selectedUser || 'None selected'}</p>
				<div class="feature-notes">
					<p class="note">This example demonstrates:</p>
					<ul class="feature-mini-list">
						<li>Custom component for dropdown items</li>
						<li>Custom display when item is selected</li>
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
				<Select
					label="Country"
					options={countryOptions}
					placeholder="Pick a country..."
					bind:value={dependentCountry}
				/>
				<Select
					label="Region"
					options={regionOptions}
					placeholder={dependentCountry
						? regionOptions.length
							? 'Pick a region...'
							: 'No regions for this country'
						: 'Select a country first'}
					disabled={!regionOptions.length}
					bind:value={dependentRegion}
				/>
			</div>
			<div class="select-info">
				<strong>Dependent Selection:</strong>
				<p>Country: {dependentCountry || 'None'}</p>
				<p>Region: {dependentRegion || 'None'}</p>
				<p class="note">
					Region options update reactively when country changes. Regions are defined for US, CA, UK,
					and DE — pick others to see the empty/disabled state.
				</p>
			</div>
		</div>
	</Paper>

	<Paper title="Reactive Options — Runtime Mutation">
		<div class="form-grid">
			<div class="select-section">
				<Select
					label="Mutable Options"
					options={mutableOptions}
					placeholder="Pick something..."
					allowSearch={true}
					bind:value={mutableValue}
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
				<p>Selected: {mutableValue || 'None'}</p>
				<p>Options count: {mutableOptions.length}</p>
				<p class="note">
					Try: open the dropdown, type a filter, then click a swap button — the active filter should
					re-apply to the new options. Selecting a value and then swapping clears the binding
					(Select auto-clears <code>value</code> when the current selection isn't in the new options and
					no async data source is configured, so form submits don't carry stale keys).
				</p>
			</div>
		</div>
	</Paper>

	<Paper title="Reactive Options — Grouped Swap">
		<div class="form-grid">
			<div class="select-section">
				<Select
					label="Grouped (swappable)"
					groupedOptions={activeGroups}
					placeholder="Pick anything..."
					bind:value={groupedValue}
				/>
				<div class="button-row">
					<button class="btn-secondary" onclick={toggleGroups}>Toggle Tech / Animals</button>
				</div>
			</div>
			<div class="select-info">
				<strong>Grouped Swap:</strong>
				<p>Selected: {groupedValue || 'None'}</p>
				<p>Current set: {showTechGroups ? 'Tech' : 'Animals'}</p>
				<p class="note">
					Tests that <code>groupedOptions</code> prop changes are picked up after mount.
				</p>
			</div>
		</div>
	</Paper>

	<Paper title="Reactive Options — Reference Stability">
		<div class="form-grid">
			<div class="select-section">
				<Select
					label="Same contents, new array each tick"
					options={unstableOptions}
					bind:value={stableValue}
				/>
				<div class="button-row">
					<button class="btn-secondary" onclick={() => (referenceTick += 1)}>
						Re-render (tick {referenceTick})
					</button>
				</div>
			</div>
			<div class="select-info">
				<strong>Reference Test:</strong>
				<p>Selected: {stableValue || 'None'}</p>
				<p class="note">
					Each tick passes a brand-new array reference with the same contents. The current ref guard
					does <em>not</em> deep-compare, so this will re-convert on every tick — confirm the dropdown
					doesn't lose state or flicker. Open the dropdown and click the button to verify.
				</p>
			</div>
		</div>
	</Paper>

	<Paper title="Form Example">
		<div class="form-section">
			<h3>User Profile Setup</h3>
			<div class="select-section">
				<Select
					label="Country"
					options={countryOptions}
					placeholder="Select your country..."
					bind:value={userCountry}
					required={true}
				/>
				<Select
					label="Task Priority Preference"
					options={priorityOptions}
					bind:value={taskPriority}
					required={true}
				/>
				<Select label="Project Status" options={statusOptions} bind:value={projectStatus} />
				<Select
					label="Primary Skill"
					groupedOptions={categoryGroups}
					placeholder="Choose your main expertise..."
					bind:value={skillCategory}
					allowSearch={true}
					required={true}
				/>
			</div>
			<div class="form-summary">
				<strong>Profile Summary:</strong>
				<ul>
					<li>Country: {userCountry || 'Not selected'}</li>
					<li>Task Priority: <span class="priority-{taskPriority}">{taskPriority}</span></li>
					<li>Project Status: <span class="status-{projectStatus}">{projectStatus}</span></li>
					<li>Primary Skill: {skillCategory || 'Not selected'}</li>
				</ul>
				<div class="summary-actions">
					<button class="btn-primary" disabled={!userCountry || !taskPriority || !skillCategory}>
						Save Profile
					</button>
				</div>
			</div>
		</div>
	</Paper>

	<Paper title="Features">
		<div class="feature-list">
			<ul>
				<li><strong>Single selection:</strong> Choose one option from the dropdown</li>
				<li><strong>Search functionality:</strong> Type to filter options in large lists</li>
				<li><strong>Grouped options:</strong> Organize options into logical categories</li>
				<li><strong>Loading states:</strong> Built-in loader for async operations</li>
				<li><strong>Clear functionality:</strong> Easy way to clear the selection</li>
				<li><strong>Required field support:</strong> Visual indicator for required selects</li>
				<li><strong>Error states:</strong> Display error messages and styling</li>
				<li><strong>Disabled states:</strong> Support for disabled selects</li>
				<li><strong>Event handling:</strong> onchange and onchangeRaw callbacks</li>
				<li><strong>Raw value access:</strong> Access to full item object, not just value</li>
				<li><strong>Keyboard navigation:</strong> Full keyboard support with arrow keys</li>
				<li><strong>Dynamic loading:</strong> Support for async data fetching</li>
				<li><strong>Custom placeholders:</strong> Configurable placeholder text</li>
				<li>
					<strong>Custom display components:</strong> Use custom components for rich item display
				</li>
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

	.priority-low {
		color: #10b981;
	}
	.priority-medium {
		color: #f59e0b;
	}
	.priority-high {
		color: #f97316;
	}
	.priority-critical {
		color: #dc2626;
	}

	.status-active {
		color: #10b981;
	}
	.status-inactive {
		color: #6b7280;
	}
	.status-pending {
		color: #f59e0b;
	}
	.status-archived {
		color: #9ca3af;
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
