<script lang="ts">
	import Paper from '$lib/display/Paper.svelte';
	import Pagination from '$lib/ui/Pagination.svelte';
	import Button from '$lib/ui/Button.svelte';
	import Textbox from '$lib/form/Textbox.svelte';
	import Select from '$lib/form/Select.svelte';
	import { iconRefresh, iconSearch } from '$lib/icon/index.js';

	// Pagination state variables
	let basicPage = $state(1);
	let smallPage = $state(1);
	let largePage = $state(1);
	let customPage = $state(5);
	let dataTablePage = $state(1);
	let searchResultsPage = $state(1);

	// Configuration options
	let totalPagesConfig = $state('20');
	let maxButtonsConfig = $state('8');
	let configPage = $state('1');

	// Items per page options
	let itemsPerPage = $state('10');
	const itemsPerPageOptions = [
		{ value: '5', label: '5 per page' },
		{ value: '10', label: '10 per page' },
		{ value: '25', label: '25 per page' },
		{ value: '50', label: '50 per page' },
		{ value: '100', label: '100 per page' }
	];

	// Demo data
	let actionLog = $state<string[]>([]);

	function addToLog(message: string) {
		actionLog = [`${new Date().toLocaleTimeString()}: ${message}`, ...actionLog.slice(0, 9)];
	}

	function clearLog() {
		actionLog = [];
	}

	// Mock data for demonstration
	const mockUsers = Array.from({ length: 247 }, (_, i) => ({
		id: i + 1,
		name: `User ${i + 1}`,
		email: `user${i + 1}@example.com`,
		status: ['Active', 'Inactive', 'Pending'][i % 3],
		department: ['Engineering', 'Marketing', 'Sales', 'Support', 'HR'][i % 5],
		joinDate: new Date(2020 + (i % 4), i % 12, (i % 28) + 1).toLocaleDateString()
	}));

	const mockProducts = Array.from({ length: 156 }, (_, i) => ({
		id: i + 1,
		name: `Product ${i + 1}`,
		category: ['Electronics', 'Clothing', 'Books', 'Home', 'Sports'][i % 5],
		price: Math.floor(Math.random() * 500) + 10,
		stock: Math.floor(Math.random() * 100),
		rating: (Math.random() * 2 + 3).toFixed(1)
	}));

	// Computed values for pagination
	let totalUserPages = $derived(Math.ceil(mockUsers.length / Number(itemsPerPage)));
	let currentUsers = $derived(
		mockUsers.slice(
			(dataTablePage - 1) * Number(itemsPerPage),
			dataTablePage * Number(itemsPerPage)
		)
	);

	let totalProductPages = $derived(Math.ceil(mockProducts.length / 12));
	let currentProducts = $derived(
		mockProducts.slice((searchResultsPage - 1) * 12, searchResultsPage * 12)
	);

	// Event handlers
	function handlePageChange(context: string, newPage: number) {
		addToLog(`${context}: Changed to page ${newPage}`);
	}

	function handleBasicPageChange(newPage: number) {
		basicPage = newPage;
		handlePageChange('Basic Pagination', newPage);
	}

	function handleSmallPageChange(newPage: number) {
		smallPage = newPage;
		handlePageChange('Small Dataset', newPage);
	}

	function handleLargePageChange(newPage: number) {
		largePage = newPage;
		handlePageChange('Large Dataset', newPage);
	}

	function handleCustomPageChange(newPage: number) {
		customPage = newPage;
		handlePageChange('Custom Configuration', newPage);
	}

	function handleDataTablePageChange(newPage: number) {
		dataTablePage = newPage;
		handlePageChange('Data Table', newPage);
	}

	function handleSearchPageChange(newPage: number) {
		searchResultsPage = newPage;
		handlePageChange('Search Results', newPage);
	}

	function handleItemsPerPageChange() {
		dataTablePage = 1; // Reset to first page when changing items per page
		addToLog(`Items per page changed to ${itemsPerPage}`);
	}

	function jumpToPage(targetPage: string) {
		const page = parseInt(targetPage);
		if (page >= 1 && page <= totalUserPages) {
			dataTablePage = page;
			handlePageChange('Data Table (Jump)', page);
		}
	}

	function resetPagination() {
		basicPage = 1;
		smallPage = 1;
		largePage = 1;
		customPage = 1;
		dataTablePage = 1;
		searchResultsPage = 1;
		configPage = '1';
		addToLog('All pagination reset to page 1');
	}

	// Jump to page input
	let jumpPageInput = $state('');
</script>

<div class="page-header">
	<h1>Pagination</h1>
	<p>
		Navigation component for splitting large datasets across multiple pages with ellipsis and smart
		page button management.
	</p>
</div>

<div class="vstack">
	<Paper title="Basic Usage">
		<div class="form-grid">
			<div class="pagination-section">
				<h4>Simple Pagination</h4>
				<div class="pagination-examples">
					<div class="pagination-demo">
						<span class="demo-label">Small dataset (5 pages)</span>
						<Pagination
							bind:selectedPage={smallPage}
							totalPages={5}
							onPageChange={handleSmallPageChange}
						/>
						<span class="current-info">Current: Page {smallPage} of 5</span>
					</div>

					<div class="pagination-demo">
						<span class="demo-label">Medium dataset (15 pages)</span>
						<Pagination
							bind:selectedPage={basicPage}
							totalPages={15}
							onPageChange={handleBasicPageChange}
						/>
						<span class="current-info">Current: Page {basicPage} of 15</span>
					</div>

					<div class="pagination-demo">
						<span class="demo-label">Large dataset (100 pages)</span>
						<Pagination
							bind:selectedPage={largePage}
							totalPages={100}
							onPageChange={handleLargePageChange}
						/>
						<span class="current-info">Current: Page {largePage} of 100</span>
					</div>
				</div>
			</div>
			<div class="pagination-info">
				<strong>Pagination Features:</strong>
				<ul>
					<li>Automatic ellipsis for large datasets</li>
					<li>Smart page button management</li>
					<li>Previous/next navigation</li>
					<li>Selected state highlighting</li>
					<li>Disabled states for boundaries</li>
				</ul>
				<p class="note">Click any page number or use the arrow buttons to navigate.</p>
			</div>
		</div>
	</Paper>

	<Paper title="Configuration Options">
		<div class="config-section">
			<h4>Customizable Settings</h4>
			<div class="config-demo">
				<div class="config-controls">
					<div class="config-group">
						<label for="total-pages">Total Pages:</label>
						<Textbox bind:value={totalPagesConfig} />
					</div>
					<div class="config-group">
						<label for="max-buttons">Max Page Buttons:</label>
						<Textbox bind:value={maxButtonsConfig} />
					</div>
					<div class="config-group">
						<label for="start-page">Starting Page:</label>
						<Textbox bind:value={configPage} />
					</div>
				</div>

				<div class="config-result">
					<div class="result-display">
						<Pagination
							selectedPage={Number(configPage)}
							totalPages={Number(totalPagesConfig)}
							maxPageButtons={Number(maxButtonsConfig)}
							onPageChange={(page) => handlePageChange('Configuration Demo', page)}
						/>
					</div>
					<div class="config-info">
						<p>
							<strong>Configuration:</strong>
							{totalPagesConfig} total pages, max {maxButtonsConfig} buttons
						</p>
						<p><strong>Current:</strong> Page {configPage} of {totalPagesConfig}</p>
					</div>
				</div>
			</div>
		</div>
	</Paper>

	<Paper title="Data Table Integration">
		<div class="data-section">
			<h4>User Management Table</h4>
			<div class="table-controls">
				<div class="table-info">
					<span><strong>{mockUsers.length}</strong> total users</span>
					<Select
						bind:value={itemsPerPage}
						options={itemsPerPageOptions}
						onchange={handleItemsPerPageChange}
					/>
				</div>
				<div class="jump-controls">
					<Textbox bind:value={jumpPageInput} placeholder="Page #" />
					<Button
						variant="secondary"
						onclick={() => jumpToPage(jumpPageInput)}
						disabled={!jumpPageInput}
					>
						Jump
					</Button>
				</div>
			</div>

			<div class="data-table">
				<table>
					<thead>
						<tr>
							<th>ID</th>
							<th>Name</th>
							<th>Email</th>
							<th>Department</th>
							<th>Status</th>
							<th>Join Date</th>
						</tr>
					</thead>
					<tbody>
						{#each currentUsers as user}
							<tr>
								<td>#{user.id}</td>
								<td>{user.name}</td>
								<td>{user.email}</td>
								<td>{user.department}</td>
								<td>
									<span class="status {user.status.toLowerCase()}">
										{user.status}
									</span>
								</td>
								<td>{user.joinDate}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			<div class="table-pagination">
				<div class="pagination-info-display">
					<span>
						Showing {(dataTablePage - 1) * Number(itemsPerPage) + 1}-{Math.min(
							dataTablePage * Number(itemsPerPage),
							mockUsers.length
						)}
						of {mockUsers.length} users
					</span>
				</div>
				<Pagination
					bind:selectedPage={dataTablePage}
					totalPages={totalUserPages}
					onPageChange={handleDataTablePageChange}
					maxPageButtons={10}
				/>
			</div>
		</div>
	</Paper>

	<Paper title="Search Results">
		<div class="search-section">
			<h4>Product Catalog</h4>
			<div class="search-header">
				<div class="search-info">
					<span><strong>{mockProducts.length}</strong> products found</span>
				</div>
				<div class="search-controls">
					<Button variant="secondary-subtle" svg={iconRefresh}>Refresh</Button>
					<Button variant="secondary-subtle" svg={iconSearch}>Advanced Search</Button>
				</div>
			</div>

			<div class="products-grid">
				{#each currentProducts as product}
					<div class="product-card">
						<div class="product-header">
							<h5>{product.name}</h5>
							<span class="product-price">${product.price}</span>
						</div>
						<div class="product-details">
							<span class="product-category">{product.category}</span>
							<span class="product-stock">Stock: {product.stock}</span>
							<span class="product-rating">★ {product.rating}</span>
						</div>
					</div>
				{/each}
			</div>

			<div class="search-pagination">
				<div class="pagination-info-display">
					<span>
						Page {searchResultsPage} of {totalProductPages}
						({(searchResultsPage - 1) * 12 + 1}-{Math.min(
							searchResultsPage * 12,
							mockProducts.length
						)} of {mockProducts.length} products)
					</span>
				</div>
				<Pagination
					bind:selectedPage={searchResultsPage}
					totalPages={totalProductPages}
					onPageChange={handleSearchPageChange}
				/>
			</div>
		</div>
	</Paper>

	<Paper title="Interactive Demo">
		<div class="interactive-section">
			<h4>Pagination States</h4>
			<div class="demo-controls">
				<div class="control-buttons">
					<Button onclick={resetPagination}>Reset All Pages</Button>
					<Button variant="secondary" onclick={clearLog}>Clear Activity Log</Button>
				</div>
				<div class="current-states">
					<strong>Current Page States:</strong>
					<div class="states-grid">
						<span>Basic: {basicPage}/15</span>
						<span>Small: {smallPage}/5</span>
						<span>Large: {largePage}/100</span>
						<span>Custom: {customPage}/{totalPagesConfig}</span>
						<span>Table: {dataTablePage}/{totalUserPages}</span>
						<span>Search: {searchResultsPage}/{totalProductPages}</span>
					</div>
				</div>
			</div>
		</div>
	</Paper>

	<Paper title="Activity Log">
		<div class="log-section">
			<div class="log-header">
				<h4>Pagination Activity</h4>
				<Button variant="secondary-subtle" onclick={clearLog}>Clear Log</Button>
			</div>
			<div class="action-log">
				{#each actionLog as entry}
					<p class="log-entry">{entry}</p>
				{/each}
				{#if actionLog.length === 0}
					<p class="no-actions">
						No pagination activity yet. Try navigating through the examples above!
					</p>
				{/if}
			</div>
		</div>
	</Paper>

	<Paper title="Features">
		<div class="feature-list">
			<ul>
				<li>
					<strong>Smart ellipsis:</strong> Automatically shows "..." when there are too many pages
				</li>
				<li><strong>Configurable buttons:</strong> Set maximum number of page buttons displayed</li>
				<li><strong>Navigation controls:</strong> Previous/next arrows with disabled states</li>
				<li><strong>Selected state:</strong> Clear visual indication of current page</li>
				<li><strong>Boundary handling:</strong> Always shows first and last pages</li>
				<li><strong>Adaptive layout:</strong> Adjusts button placement based on current page</li>
				<li><strong>Event callbacks:</strong> onPageChange callback for external handling</li>
				<li><strong>Bindable state:</strong> Two-way binding with selectedPage prop</li>
				<li><strong>Theme integration:</strong> Full light/dark mode support</li>
				<li><strong>Accessibility:</strong> Proper ARIA attributes and keyboard navigation</li>
				<li><strong>Responsive design:</strong> Works across all screen sizes</li>
				<li><strong>Performance optimized:</strong> Efficient page calculation algorithm</li>
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

	.pagination-section h4,
	.config-section h4,
	.data-section h4,
	.search-section h4,
	.interactive-section h4,
	.log-section h4 {
		color: var(--text-color);
		font-size: 1.125rem;
		font-weight: 600;
		margin: 0 0 1rem 0;
	}

	.pagination-examples {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.pagination-demo {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		padding: 1rem;
		border: 1px solid var(--border-color);
		border-radius: 0.375rem;
	}

	.demo-label {
		font-weight: 600;
		color: var(--text-color);
		font-size: 0.875rem;
	}

	.current-info {
		font-size: 0.875rem;
		color: var(--text-muted);
		font-family: monospace;
	}

	.pagination-info {
		padding: 1rem;
		background-color: rgba(var(--ui-primary-rgbc), 0.05);
		border-radius: 0.375rem;
		border: 1px solid var(--border-color);
	}

	.pagination-info strong {
		color: var(--text-color);
		font-weight: 600;
		display: block;
		margin-bottom: 0.5rem;
	}

	.pagination-info ul {
		margin: 0.5rem 0;
		padding-left: 1.5rem;
		color: var(--text-color);
	}

	.pagination-info li {
		margin-bottom: 0.25rem;
		font-size: 0.875rem;
	}

	.config-demo {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.config-controls {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.config-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		min-width: 120px;
	}

	.config-group label {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-color);
	}

	.config-result {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 1rem;
		border: 1px solid var(--border-color);
		border-radius: 0.375rem;
		background-color: rgba(var(--ui-primary-rgbc), 0.02);
	}

	.result-display {
		display: flex;
		justify-content: center;
	}

	.config-info {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.config-info p {
		margin: 0;
		font-size: 0.875rem;
		color: var(--text-muted);
	}

	.table-controls {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.table-info {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.table-info span {
		color: var(--text-color);
		font-size: 0.875rem;
	}

	.jump-controls {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.data-table {
		border-radius: 0.375rem;
		border: 1px solid var(--border-color);
		overflow: hidden;
		margin-bottom: 1rem;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		background-color: var(--paper-body-bg);
	}

	th,
	td {
		padding: 0.75rem;
		text-align: left;
		border-bottom: 1px solid var(--border-color);
	}

	th {
		background-color: rgba(var(--ui-primary-rgbc), 0.05);
		font-weight: 600;
		color: var(--text-color);
		font-size: 0.875rem;
	}

	td {
		color: var(--text-color);
		font-size: 0.875rem;
	}

	.status {
		padding: 0.25rem 0.5rem;
		border-radius: 0.25rem;
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
	}

	.status.active {
		background-color: var(--success-bg-subtle);
		color: var(--success-text);
	}

	.status.pending {
		background-color: rgba(var(--ui-tertiary-rgbc), 0.2);
		color: var(--ui-tertiary);
	}

	.status.inactive {
		background-color: var(--danger-bg-subtle);
		color: var(--danger-text);
	}

	.table-pagination {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.pagination-info-display {
		font-size: 0.875rem;
		color: var(--text-muted);
	}

	.search-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.search-info span {
		color: var(--text-color);
		font-size: 0.875rem;
	}

	.search-controls {
		display: flex;
		gap: 0.5rem;
	}

	.products-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	.product-card {
		padding: 1rem;
		border: 1px solid var(--border-color);
		border-radius: 0.375rem;
		background-color: var(--paper-body-bg);
	}

	.product-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 0.5rem;
	}

	.product-header h5 {
		color: var(--text-color);
		font-weight: 600;
		margin: 0;
		font-size: 0.875rem;
	}

	.product-price {
		color: var(--ui-primary);
		font-weight: 700;
		font-size: 0.875rem;
	}

	.product-details {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.product-category,
	.product-stock,
	.product-rating {
		font-size: 0.75rem;
		color: var(--text-muted);
	}

	.product-rating {
		color: var(--ui-tertiary);
	}

	.search-pagination {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.demo-controls {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.control-buttons {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.current-states {
		padding: 1rem;
		background-color: rgba(var(--ui-primary-rgbc), 0.05);
		border-radius: 0.375rem;
		border: 1px solid var(--border-color);
	}

	.current-states strong {
		color: var(--text-color);
		font-weight: 600;
		display: block;
		margin-bottom: 0.5rem;
	}

	.states-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
		gap: 0.5rem;
	}

	.states-grid span {
		font-size: 0.875rem;
		color: var(--text-color);
		font-family: monospace;
	}

	.log-section {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.log-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.action-log {
		padding: 1rem;
		background-color: rgba(var(--ui-primary-rgbc), 0.05);
		border-radius: 0.375rem;
		border: 1px solid var(--border-color);
		min-height: 100px;
		max-height: 200px;
		overflow-y: auto;
	}

	.log-entry {
		font-family: 'Courier New', monospace;
		font-size: 0.875rem;
		color: var(--text-color);
		margin: 0.25rem 0;
		padding: 0.25rem 0.5rem;
		background-color: rgba(var(--ui-primary-rgbc), 0.1);
		border-radius: 0.25rem;
	}

	.no-actions {
		color: var(--text-muted);
		font-style: italic;
		margin: 0;
		text-align: center;
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

	:global(.dark) .pagination-info,
	:global(.dark) .config-result,
	:global(.dark) .current-states,
	:global(.dark) .action-log {
		background-color: rgba(var(--ui-accent-rgbc), 0.05);
	}

	:global(.dark) .feature-list strong {
		color: var(--ui-accent);
	}

	:global(.dark) .log-entry {
		background-color: rgba(var(--ui-accent-rgbc), 0.1);
	}

	:global(.dark) th {
		background-color: rgba(var(--ui-accent-rgbc), 0.05);
	}

	:global(.dark) .product-price {
		color: var(--ui-accent);
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
