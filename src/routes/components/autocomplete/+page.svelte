<script lang="ts">
	import Paper from '$lib/display/Paper.svelte';
	import Autocomplete from '$lib/form/Autocomplete.svelte';
	import type { ComboBoxGroup, ComboBoxItem } from '$lib/models/ComboBoxItem.js';
	import type { NotifyModel } from '$lib/models/NotifyModel.js';
	import { MessageTypes } from '$lib/models/NotifyModel.js';
	import { iconSearch, iconUser, iconUserGroup } from '$lib/icon/index.js';

	// Sample data for different examples
	const countries: ComboBoxItem[] = [
		{ label: 'United States', value: 'us' },
		{ label: 'United Kingdom', value: 'uk' },
		{ label: 'Canada', value: 'ca' },
		{ label: 'Australia', value: 'au' },
		{ label: 'Germany', value: 'de' },
		{ label: 'France', value: 'fr' },
		{ label: 'Japan', value: 'jp' },
		{ label: 'Brazil', value: 'br' },
		{ label: 'India', value: 'in' },
		{ label: 'China', value: 'cn' },
		{ label: 'Mexico', value: 'mx' },
		{ label: 'Spain', value: 'es' },
		{ label: 'Italy', value: 'it' },
		{ label: 'Netherlands', value: 'nl' },
		{ label: 'Sweden', value: 'se' },
		{ label: 'Norway', value: 'no' },
		{ label: 'Denmark', value: 'dk' },
		{ label: 'Finland', value: 'fi' }
	];

	const cities: ComboBoxItem[] = [
		{ label: 'New York', value: 'ny' },
		{ label: 'Los Angeles', value: 'la' },
		{ label: 'Chicago', value: 'chi' },
		{ label: 'Houston', value: 'hou' },
		{ label: 'London', value: 'lon' },
		{ label: 'Paris', value: 'par' },
		{ label: 'Berlin', value: 'ber' },
		{ label: 'Tokyo', value: 'tok' },
		{ label: 'Sydney', value: 'syd' },
		{ label: 'Toronto', value: 'tor' },
		{ label: 'Amsterdam', value: 'ams' },
		{ label: 'Barcelona', value: 'bar' },
		{ label: 'Rome', value: 'rom' },
		{ label: 'Madrid', value: 'mad' },
		{ label: 'Stockholm', value: 'sto' }
	];

	const technologies: ComboBoxItem[] = [
		{ label: 'JavaScript', value: 'js' },
		{ label: 'TypeScript', value: 'ts' },
		{ label: 'Python', value: 'py' },
		{ label: 'Java', value: 'java' },
		{ label: 'C#', value: 'cs' },
		{ label: 'Go', value: 'go' },
		{ label: 'Rust', value: 'rust' },
		{ label: 'PHP', value: 'php' },
		{ label: 'Ruby', value: 'ruby' },
		{ label: 'Swift', value: 'swift' },
		{ label: 'Kotlin', value: 'kotlin' },
		{ label: 'C++', value: 'cpp' },
		{ label: 'React', value: 'react' },
		{ label: 'Vue.js', value: 'vue' },
		{ label: 'Angular', value: 'angular' },
		{ label: 'Svelte', value: 'svelte' },
		{ label: 'Node.js', value: 'node' },
		{ label: 'Django', value: 'django' },
		{ label: 'Spring Boot', value: 'spring' },
		{ label: 'Laravel', value: 'laravel' }
	];

	const companies: ComboBoxItem[] = [
		{ label: 'Microsoft', value: 'msft' },
		{ label: 'Google', value: 'goog' },
		{ label: 'Apple', value: 'aapl' },
		{ label: 'Amazon', value: 'amzn' },
		{ label: 'Meta', value: 'meta' },
		{ label: 'Netflix', value: 'nflx' },
		{ label: 'Tesla', value: 'tsla' },
		{ label: 'NVIDIA', value: 'nvda' },
		{ label: 'Adobe', value: 'adbe' },
		{ label: 'Salesforce', value: 'crm' },
		{ label: 'Oracle', value: 'orcl' },
		{ label: 'SAP', value: 'sap' },
		{ label: 'IBM', value: 'ibm' },
		{ label: 'Intel', value: 'intc' },
		{ label: 'Cisco', value: 'csco' }
	];

	// Grouped options example
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
		},
		{
			label: 'Languages',
			showGroupName: true,
			items: [
				{ label: 'TypeScript', value: 'ts' },
				{ label: 'Python', value: 'py' },
				{ label: 'Go', value: 'go' },
				{ label: 'Rust', value: 'rust' }
			]
		}
	];

	// State variables
	let basicSearch = '';
	let countrySearch = '';
	let citySearch = '';
	let techSearch = '';
	let companySearch = '';
	let requiredSearch = '';
	let customSearch = '';
	let disabledSearch = 'Locked value';
	let errorSearch = '';
	let groupedSearch = '';
	let tooltipSearch = '';

	// Form example state
	let userCountry = '';
	let userCity = '';
	let primaryTech = '';
	let dreamCompany = '';

	// rawValue tracking
	let selectedRawValue: ComboBoxItem | undefined = undefined;
	let groupedRawValue: ComboBoxItem | undefined = undefined;

	// Event handling examples
	let selectedItem: ComboBoxItem | undefined = undefined;
	let enterPressedValue = '';
	let changeLog: string[] = [];

	// Add-new-value example
	let tags: ComboBoxItem[] = [
		{ label: 'Frontend', value: 'frontend' },
		{ label: 'Backend', value: 'backend' },
		{ label: 'DevOps', value: 'devops' }
	];
	let tagSearch = '';
	let addedTags: string[] = [];

	function handleTagAdded(value: string) {
		if (!tags.some((t) => t.value.toLowerCase() === value.toLowerCase())) {
			tags = [...tags, { label: value, value }];
		}
		addedTags = [value, ...addedTags];
	}

	function handleCountryChange(value: string) {
		console.log('Country search changed:', value);
		addToChangeLog(`Country: "${value}"`);
	}

	function handleCountrySelection(item: ComboBoxItem) {
		console.log('Country selected:', item);
		selectedItem = item;
		addToChangeLog(`Selected: ${item.label} (${item.value})`);
	}

	function handleEnterPressed(value: string) {
		console.log('Enter pressed with value:', value);
		enterPressedValue = value;
		addToChangeLog(`Enter pressed: "${value}"`);
	}

	function addToChangeLog(message: string) {
		changeLog = [message, ...changeLog.slice(0, 4)]; // Keep last 5 entries
	}

	// Simulate async search function
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
			}, 500); // Simulate network delay
		});
	}
</script>

<div class="page-header">
	<h1>Autocomplete</h1>
	<p>Smart text input with real-time search suggestions and keyboard navigation.</p>
</div>

<div class="vstack">
	<Paper title="Basic Usage">
		<div class="form-grid">
			<div class="autocomplete-section">
				<Autocomplete
					label="Basic Search"
					placeholder="Type to search..."
					bind:value={basicSearch}
					options={countries}
				/>
				<Autocomplete
					label="Country Search"
					placeholder="Search countries..."
					leftIconSvg={iconSearch}
					bind:value={countrySearch}
					options={countries}
				/>
			</div>
			<div class="autocomplete-info">
				<strong>Current Values:</strong>
				<p>Basic Search: "{basicSearch}"</p>
				<p>Country Search: "{countrySearch}"</p>
				<p class="note">Start typing to see filtered suggestions appear below the input.</p>
			</div>
		</div>
	</Paper>

	<Paper title="Different Data Sets">
		<div class="form-grid">
			<div class="autocomplete-section">
				<Autocomplete
					label="Cities"
					placeholder="Search cities..."
					bind:value={citySearch}
					options={cities}
				/>
				<Autocomplete
					label="Technologies"
					placeholder="Search tech stack..."
					bind:value={techSearch}
					options={technologies}
				/>
				<Autocomplete
					label="Companies"
					placeholder="Search companies..."
					leftIconSvg={iconUserGroup}
					bind:value={companySearch}
					options={companies}
				/>
			</div>
			<div class="autocomplete-info">
				<strong>Search Results:</strong>
				<p>City: "{citySearch}"</p>
				<p>Technology: "{techSearch}"</p>
				<p>Company: "{companySearch}"</p>
			</div>
		</div>
	</Paper>

	<Paper title="Grouped Options">
		<div class="form-grid">
			<div class="autocomplete-section">
				<Autocomplete
					label="Technology Stack"
					placeholder="Search by category..."
					bind:value={groupedSearch}
					bind:rawValue={groupedRawValue}
					groupedOptions={groupedTechOptions}
				/>
			</div>
			<div class="autocomplete-info">
				<strong>Grouped Search:</strong>
				<p>Value: "{groupedSearch}"</p>
				<p>
					Raw Value: {groupedRawValue
						? `${groupedRawValue.label} (${groupedRawValue.value})`
						: 'None'}
				</p>
				<p class="note">Options are organized into Frontend, Backend, and Languages groups.</p>
			</div>
		</div>
	</Paper>

	<Paper title="States & Options">
		<div class="form-grid">
			<div class="autocomplete-section">
				<Autocomplete
					label="Required Field"
					placeholder="This field is required..."
					required={true}
					bind:value={requiredSearch}
					options={countries}
				/>
				<Autocomplete
					label="Disabled"
					disabled={true}
					bind:value={disabledSearch}
					options={countries}
				/>
				<Autocomplete
					label="Error State"
					placeholder="This field has an error..."
					showError={true}
					errorText="Please select a valid option"
					bind:value={errorSearch}
					options={countries}
				/>
				<Autocomplete
					label="With Tooltip"
					placeholder="Hover the label for info..."
					tooltipText="Start typing to search and select from available options"
					bind:value={tooltipSearch}
					options={technologies}
				/>
				<Autocomplete
					label="Custom Placeholder"
					placeholder="Find your perfect match..."
					bind:value={customSearch}
					options={technologies}
					hideNoResults={true}
				/>
			</div>
			<div class="autocomplete-info">
				<strong>State Values:</strong>
				<p>Required: "{requiredSearch}"</p>
				<p>Disabled: "{disabledSearch}"</p>
				<p>Error: "{errorSearch}"</p>
				<p>Tooltip: "{tooltipSearch}"</p>
				<p>Custom: "{customSearch}"</p>
				<p class="note">
					Demonstrates required, disabled, error, tooltip, and hidden "no results" states.
				</p>
			</div>
		</div>
	</Paper>

	<Paper title="Event Handling & rawValue">
		<div class="form-grid">
			<div class="autocomplete-section">
				<Autocomplete
					label="Country with Events"
					placeholder="Search and select a country..."
					bind:value={countrySearch}
					bind:rawValue={selectedRawValue}
					options={countries}
					onchange={handleCountryChange}
					onSelect={handleCountrySelection}
					enterPressed={handleEnterPressed}
				/>
			</div>
			<div class="autocomplete-info">
				<strong>Event Data:</strong>
				<p>
					Selected Item: {selectedItem ? `${selectedItem.label} (${selectedItem.value})` : 'None'}
				</p>
				<p>
					Raw Value (bindable): {selectedRawValue
						? `${selectedRawValue.label} (${selectedRawValue.value})`
						: 'None'}
				</p>
				<p>Last Enter Press: "{enterPressedValue}"</p>
				<strong>Change Log:</strong>
				{#each changeLog as entry, i (i)}
					<p class="log-entry">{entry}</p>
				{/each}
				<p class="note">Check console for detailed event logs.</p>
			</div>
		</div>
	</Paper>

	<Paper title="Add New Value">
		<div class="form-grid">
			<div class="autocomplete-section">
				<Autocomplete
					label="Tags"
					placeholder="Search or add a tag..."
					bind:value={tagSearch}
					options={tags}
					allowAdd={true}
					onItemAdded={handleTagAdded}
				/>
			</div>
			<div class="autocomplete-info">
				<strong>Add New Value:</strong>
				<p>Current value: "{tagSearch}"</p>
				<p>Available tags: {tags.map((t) => t.label).join(', ')}</p>
				<strong>Added Tags:</strong>
				{#each addedTags as tag, i (i)}
					<p class="log-entry">{tag}</p>
				{/each}
				<p class="note">
					Type a value that doesn't match any option to see an "Add" suggestion at the bottom of the
					list. Selecting it fires <code>onItemAdded</code>.
				</p>
			</div>
		</div>
	</Paper>

	<Paper title="Async Search">
		<div class="form-grid">
			<div class="autocomplete-section">
				<Autocomplete
					label="Async Technology Search"
					placeholder="Search technologies (with delay)..."
					bind:value={techSearch}
					searchFunction={simulateAsyncSearch}
					loadingText="Searching technologies..."
				/>
			</div>
			<div class="autocomplete-info">
				<strong>Async Search:</strong>
				<p>Query: "{techSearch}"</p>
				<p class="note">
					This example simulates a 500ms network delay when searching. Try typing "React" or
					"JavaScript".
				</p>
			</div>
		</div>
	</Paper>

	<Paper title="Form Example">
		<div class="form-section">
			<h3>User Profile Setup</h3>
			<div class="autocomplete-section">
				<Autocomplete
					label="Country"
					placeholder="Search your country..."
					leftIconSvg={iconUser}
					bind:value={userCountry}
					options={countries}
					required={true}
				/>
				<Autocomplete
					label="City"
					placeholder="Search your city..."
					bind:value={userCity}
					options={cities}
					required={true}
				/>
				<Autocomplete
					label="Primary Technology"
					placeholder="What's your main tech skill?"
					bind:value={primaryTech}
					options={technologies}
					required={true}
				/>
				<Autocomplete
					label="Dream Company"
					placeholder="Where would you like to work?"
					leftIconSvg={iconUserGroup}
					bind:value={dreamCompany}
					options={companies}
				/>
			</div>
			<div class="form-summary">
				<strong>Profile Summary:</strong>
				<ul>
					<li>Country: {userCountry || 'Not specified'}</li>
					<li>City: {userCity || 'Not specified'}</li>
					<li>Primary Tech: {primaryTech || 'Not specified'}</li>
					<li>Dream Company: {dreamCompany || 'Not specified'}</li>
				</ul>
				<div class="summary-actions">
					<button class="btn-primary" disabled={!userCountry || !userCity || !primaryTech}>
						Save Profile
					</button>
				</div>
			</div>
		</div>
	</Paper>

	<Paper title="Features">
		<div class="feature-list">
			<ul>
				<li><strong>Real-time filtering:</strong> Instant search results as you type</li>
				<li><strong>Keyboard navigation:</strong> Arrow keys, Enter, and Escape support</li>
				<li><strong>Click to select:</strong> Mouse selection from dropdown list</li>
				<li><strong>Custom icons:</strong> Add icons to enhance visual context</li>
				<li><strong>Loading states:</strong> Built-in spinner for async operations</li>
				<li>
					<strong>Event handling:</strong> onChange, onSelect, onchangeRaw, and enterPressed callbacks
				</li>
				<li><strong>Async search:</strong> Support for remote data fetching</li>
				<li><strong>Grouped options:</strong> Organize options into labeled groups</li>
				<li>
					<strong>Add new values:</strong> allowAdd suggests adding the typed value, with an onItemAdded
					callback
				</li>
				<li>
					<strong>rawValue binding:</strong> Bindable access to the full selected ComboBoxItem
				</li>
				<li><strong>Flexible data:</strong> Works with any array of ComboBoxItem objects</li>
				<li><strong>Auto-focus:</strong> Focus management and text selection</li>
				<li><strong>Dialog support:</strong> autofocusDialog for dialog integration</li>
				<li><strong>Custom placeholders:</strong> Configurable placeholder text</li>
				<li><strong>No results handling:</strong> Option to hide "no results" messages</li>
				<li><strong>Disabled state:</strong> Full support for disabling the input</li>
				<li><strong>Error states:</strong> showError and errorText for form validation</li>
				<li><strong>Tooltips:</strong> tooltipText, tooltipContent, and tooltipLocation</li>
				<li><strong>Required field support:</strong> Form validation integration</li>
				<li>
					<strong>Retrieve label:</strong> retrieveLabelFunction for pre-populated async values
				</li>
				<li><strong>Accessibility:</strong> ARIA compliant with screen reader support</li>
				<li><strong>Prevent auto-fill:</strong> Prevents browser autocomplete interference</li>
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

	:global(.dark) .autocomplete-info,
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
