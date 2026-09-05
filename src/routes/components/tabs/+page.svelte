<script lang="ts">
	import Paper from '$lib/display/Paper.svelte';
	import Tabs from '$lib/ui/Tabs.svelte';
	import Button from '$lib/ui/Button.svelte';
	import Textbox from '$lib/form/Textbox.svelte';
	import TextArea from '$lib/form/TextArea.svelte';
	import Checkbox from '$lib/form/Checkbox.svelte';
	import type { ComboBoxItem } from '$lib/models/ComboBoxItem.js';
	import { iconPlus } from '$lib/icon/index.js';

	// Tab state variables
	let basicTab = $state('overview');
	let navigationTab = $state('home');
	let settingsTab = $state('account');
	let dashboardTab = $state('analytics');
	let profileTab = $state('personal');
	let contentTab = $state('articles');

	// Demo data
	let actionLog = $state<string[]>([]);

	function addToLog(message: string) {
		actionLog = [`${new Date().toLocaleTimeString()}: ${message}`, ...actionLog.slice(0, 9)];
	}

	function clearLog() {
		actionLog = [];
	}

	// Tab options for different use cases
	const basicTabs: ComboBoxItem[] = [
		{ value: 'overview', label: 'Overview' },
		{ value: 'details', label: 'Details' },
		{ value: 'settings', label: 'Settings' },
		{ value: 'help', label: 'Help' }
	];

	const navigationTabs: ComboBoxItem[] = [
		{ value: 'home', label: 'Home' },
		{ value: 'products', label: 'Products' },
		{ value: 'services', label: 'Services' },
		{ value: 'about', label: 'About Us' },
		{ value: 'contact', label: 'Contact' }
	];

	const settingsTabs: ComboBoxItem[] = [
		{ value: 'account', label: 'Account' },
		{ value: 'security', label: 'Security' },
		{ value: 'notifications', label: 'Notifications' },
		{ value: 'privacy', label: 'Privacy' },
		{ value: 'billing', label: 'Billing' }
	];

	const dashboardTabs: ComboBoxItem[] = [
		{ value: 'analytics', label: 'Analytics' },
		{ value: 'reports', label: 'Reports' },
		{ value: 'users', label: 'Users' },
		{ value: 'performance', label: 'Performance' }
	];

	const profileTabs: ComboBoxItem[] = [
		{ value: 'personal', label: 'Personal Info' },
		{ value: 'preferences', label: 'Preferences' },
		{ value: 'activity', label: 'Activity' }
	];

	const contentTabs: ComboBoxItem[] = [
		{ value: 'articles', label: 'Articles' },
		{ value: 'videos', label: 'Videos' },
		{ value: 'podcasts', label: 'Podcasts' },
		{ value: 'downloads', label: 'Downloads' },
		{ value: 'favorites', label: 'Favorites' }
	];

	// Event handlers
	function handleTabChange(context: string, newTab: any) {
		addToLog(`${context}: Changed to "${newTab}" tab`);
	}

	// Mock form data for demonstration
	let userProfile = $state({
		firstName: 'John',
		lastName: 'Doe',
		email: 'john.doe@example.com',
		bio: 'Full-stack developer with 5+ years of experience.',
		notifications: true,
		theme: 'system'
	});

	const themeOptions: ComboBoxItem[] = [
		{ value: 'light', label: 'Light' },
		{ value: 'dark', label: 'Dark' },
		{ value: 'system', label: 'System' }
	];

	// Mock data for content tabs
	const mockContent = {
		articles: [
			{
				title: 'Getting Started with Svelte 5',
				author: 'Jane Smith',
				date: '2024-01-15',
				views: 1250
			},
			{
				title: 'Advanced Component Patterns',
				author: 'Mike Johnson',
				date: '2024-01-12',
				views: 892
			},
			{
				title: 'State Management Best Practices',
				author: 'Sarah Wilson',
				date: '2024-01-10',
				views: 1456
			}
		],
		videos: [
			{ title: 'Svelte 5 Runes Explained', duration: '15:32', views: 3420 },
			{ title: 'Building Reactive UIs', duration: '22:18', views: 2890 },
			{ title: 'Component Testing Strategies', duration: '18:45', views: 1670 }
		],
		podcasts: [
			{ title: 'The Future of Frontend Development', duration: '45:20', plays: 890 },
			{ title: 'Interview with Rich Harris', duration: '38:15', plays: 1240 },
			{ title: 'Web Performance Optimization', duration: '32:10', plays: 670 }
		]
	};

	function resetTabs() {
		basicTab = 'overview';
		navigationTab = 'home';
		settingsTab = 'account';
		dashboardTab = 'analytics';
		profileTab = 'personal';
		contentTab = 'articles';
		addToLog('All tabs reset to default values');
	}
</script>

<div class="page-header">
	<h1>Tabs</h1>
	<p>Tab navigation component with smooth animations and automatic underline positioning.</p>
</div>

<div class="vstack">
	<Paper title="Basic Usage">
		<div class="form-grid">
			<div class="tabs-section">
				<h4>Simple Tab Navigation</h4>
				<div class="tabs-demo">
					<Tabs tabOptions={basicTabs} bind:activeTab={basicTab} />
					<div class="tab-content">
						{#if basicTab === 'overview'}
							<h5>Overview</h5>
							<p>
								Welcome to the overview section. This tab shows general information about your
								project.
							</p>
							<p>Current status: Active | Last updated: Today</p>
						{:else if basicTab === 'details'}
							<h5>Details</h5>
							<p>Detailed information and specifications are displayed here.</p>
							<ul>
								<li>Created: January 2024</li>
								<li>Version: 1.2.3</li>
								<li>Status: Production Ready</li>
							</ul>
						{:else if basicTab === 'settings'}
							<h5>Settings</h5>
							<p>Configure your preferences and options.</p>
							<div class="setting-item">
								<Checkbox bind:checked={userProfile.notifications} label="Enable notifications" />
							</div>
						{:else if basicTab === 'help'}
							<h5>Help & Support</h5>
							<p>Find answers to common questions and get support.</p>
							<Button variant="secondary">Contact Support</Button>
						{/if}
					</div>
				</div>
			</div>
			<div class="tabs-info">
				<strong>Tab Features:</strong>
				<ul>
					<li>Smooth animated underline</li>
					<li>Automatic positioning</li>
					<li>Theme-aware styling</li>
					<li>Keyboard accessible</li>
					<li>Two-way data binding</li>
				</ul>
				<p class="note">Current tab: <strong>{basicTab}</strong></p>
			</div>
		</div>
	</Paper>

	<div>
		<Tabs tabOptions={navigationTabs} bind:activeTab={navigationTab} solidBg />
		<div>
			{#if navigationTab === 'home'}
				<h5>🏠 Home</h5>
				<p>Welcome to our homepage. Discover what we offer and get started.</p>
			{:else if navigationTab === 'products'}
				<h5>📦 Products</h5>
				<p>Browse our complete product catalog and find what you need.</p>
			{:else if navigationTab === 'services'}
				<h5>🔧 Services</h5>
				<p>Professional services tailored to your business requirements.</p>
			{:else if navigationTab === 'about'}
				<h5>ℹ️ About Us</h5>
				<p>Learn about our company, mission, and the team behind our success.</p>
			{:else if navigationTab === 'contact'}
				<h5>📞 Contact</h5>
				<p>Get in touch with our team for support or inquiries.</p>
			{/if}
		</div>
	</div>

	<Paper title="Navigation Tabs">
		<div class="navigation-section">
			<h4>Website Navigation</h4>
			<div class="nav-demo">
				<Tabs tabOptions={navigationTabs} bind:activeTab={navigationTab} solidBg />
				<div class="nav-content">
					{#if navigationTab === 'home'}
						<h5>🏠 Home</h5>
						<p>Welcome to our homepage. Discover what we offer and get started.</p>
					{:else if navigationTab === 'products'}
						<h5>📦 Products</h5>
						<p>Browse our complete product catalog and find what you need.</p>
					{:else if navigationTab === 'services'}
						<h5>🔧 Services</h5>
						<p>Professional services tailored to your business requirements.</p>
					{:else if navigationTab === 'about'}
						<h5>ℹ️ About Us</h5>
						<p>Learn about our company, mission, and the team behind our success.</p>
					{:else if navigationTab === 'contact'}
						<h5>📞 Contact</h5>
						<p>Get in touch with our team for support or inquiries.</p>
					{/if}
				</div>
			</div>
		</div>
	</Paper>

	<Paper title="Settings Panel">
		<div class="settings-section">
			<h4>User Settings</h4>
			<div class="settings-demo">
				<Tabs tabOptions={settingsTabs} bind:activeTab={settingsTab} />
				<div class="settings-content">
					{#if settingsTab === 'account'}
						<h5>Account Settings</h5>
						<div class="form-fields">
							<div class="field-row">
								<Textbox label="First Name" bind:value={userProfile.firstName} />
								<Textbox label="Last Name" bind:value={userProfile.lastName} />
							</div>
							<Textbox label="Email" bind:value={userProfile.email} />
							<TextArea label="Bio" bind:value={userProfile.bio} />
						</div>
					{:else if settingsTab === 'security'}
						<h5>Security Settings</h5>
						<p>Manage your password, two-factor authentication, and security preferences.</p>
						<div class="security-options">
							<Button variant="secondary">Change Password</Button>
							<Button variant="secondary">Enable 2FA</Button>
							<Button variant="secondary">Security Log</Button>
						</div>
					{:else if settingsTab === 'notifications'}
						<h5>Notification Preferences</h5>
						<div class="notification-settings">
							<Checkbox bind:checked={userProfile.notifications} label="Email notifications" />
							<Checkbox checked={true} label="Push notifications" />
							<Checkbox checked={false} label="SMS notifications" />
						</div>
					{:else if settingsTab === 'privacy'}
						<h5>Privacy Settings</h5>
						<p>Control your privacy and data sharing preferences.</p>
						<div class="privacy-options">
							<Checkbox checked={true} label="Profile visibility" />
							<Checkbox checked={false} label="Activity tracking" />
							<Checkbox checked={true} label="Analytics cookies" />
						</div>
					{:else if settingsTab === 'billing'}
						<h5>Billing & Subscription</h5>
						<p>Manage your subscription, payment methods, and billing history.</p>
						<div class="billing-info">
							<p><strong>Current Plan:</strong> Professional</p>
							<p><strong>Next Billing:</strong> February 15, 2024</p>
							<Button variant="accent">Upgrade Plan</Button>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</Paper>

	<Paper title="Dashboard Tabs">
		<div class="dashboard-section">
			<h4>Analytics Dashboard</h4>
			<div class="dashboard-demo">
				<Tabs tabOptions={dashboardTabs} bind:activeTab={dashboardTab} />
				<div class="dashboard-content">
					{#if dashboardTab === 'analytics'}
						<h5>📊 Analytics Overview</h5>
						<div class="metrics-grid">
							<div class="metric-card">
								<span class="metric-value">12,345</span>
								<span class="metric-label">Page Views</span>
							</div>
							<div class="metric-card">
								<span class="metric-value">1,234</span>
								<span class="metric-label">Unique Visitors</span>
							</div>
							<div class="metric-card">
								<span class="metric-value">45.6%</span>
								<span class="metric-label">Bounce Rate</span>
							</div>
							<div class="metric-card">
								<span class="metric-value">2:34</span>
								<span class="metric-label">Avg. Session</span>
							</div>
						</div>
					{:else if dashboardTab === 'reports'}
						<h5>📈 Reports</h5>
						<p>Generate and view detailed reports for your business metrics.</p>
						<div class="report-actions">
							<Button variant="primary">Generate Report</Button>
							<Button variant="secondary">Export Data</Button>
							<Button variant="secondary">Schedule Report</Button>
						</div>
					{:else if dashboardTab === 'users'}
						<h5>👥 User Management</h5>
						<p>Manage user accounts, permissions, and access levels.</p>
						<div class="user-stats">
							<p><strong>Total Users:</strong> 156</p>
							<p><strong>Active Today:</strong> 89</p>
							<p><strong>New This Week:</strong> 12</p>
						</div>
					{:else if dashboardTab === 'performance'}
						<h5>⚡ Performance Metrics</h5>
						<p>Monitor system performance and optimization opportunities.</p>
						<div class="performance-indicators">
							<div class="indicator">
								<span class="status-good">●</span> Server Response: 120ms
							</div>
							<div class="indicator">
								<span class="status-warning">●</span> Memory Usage: 78%
							</div>
							<div class="indicator">
								<span class="status-good">●</span> Uptime: 99.9%
							</div>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</Paper>

	<Paper title="Content Management">
		<div class="content-section">
			<h4>Content Library</h4>
			<div class="content-demo">
				<Tabs tabOptions={contentTabs} bind:activeTab={contentTab} />
				<div class="content-display">
					{#if contentTab === 'articles'}
						<h5>📄 Articles</h5>
						<div class="content-list">
							{#each mockContent.articles as article}
								<div class="content-item">
									<h6>{article.title}</h6>
									<p>By {article.author} • {article.date} • {article.views} views</p>
								</div>
							{/each}
						</div>
					{:else if contentTab === 'videos'}
						<h5>🎥 Videos</h5>
						<div class="content-list">
							{#each mockContent.videos as video}
								<div class="content-item">
									<h6>{video.title}</h6>
									<p>{video.duration} • {video.views} views</p>
								</div>
							{/each}
						</div>
					{:else if contentTab === 'podcasts'}
						<h5>🎧 Podcasts</h5>
						<div class="content-list">
							{#each mockContent.podcasts as podcast}
								<div class="content-item">
									<h6>{podcast.title}</h6>
									<p>{podcast.duration} • {podcast.plays} plays</p>
								</div>
							{/each}
						</div>
					{:else if contentTab === 'downloads'}
						<h5>⬇️ Downloads</h5>
						<p>Manage your downloaded content and files.</p>
						<Button variant="tertiary" svg={iconPlus}>Add Download</Button>
					{:else if contentTab === 'favorites'}
						<h5>⭐ Favorites</h5>
						<p>Your bookmarked and favorite content items.</p>
						<p class="muted">No favorites yet. Start exploring content to add favorites!</p>
					{/if}
				</div>
			</div>
		</div>
	</Paper>

	<Paper title="Interactive Controls">
		<div class="controls-section">
			<h4>Tab Management</h4>
			<div class="controls-demo">
				<div class="control-buttons">
					<Button onclick={resetTabs}>Reset All Tabs</Button>
					<Button variant="secondary" onclick={clearLog}>Clear Activity Log</Button>
				</div>
				<div class="current-states">
					<strong>Current Tab States:</strong>
					<div class="states-grid">
						<span>Basic: {basicTab}</span>
						<span>Navigation: {navigationTab}</span>
						<span>Settings: {settingsTab}</span>
						<span>Dashboard: {dashboardTab}</span>
						<span>Content: {contentTab}</span>
					</div>
				</div>
			</div>
		</div>
	</Paper>

	<Paper title="Activity Log">
		<div class="log-section">
			<div class="log-header">
				<h4>Tab Navigation Activity</h4>
				<Button variant="secondary-subtle" onclick={clearLog}>Clear Log</Button>
			</div>
			<div class="action-log">
				{#each actionLog as entry}
					<p class="log-entry">{entry}</p>
				{/each}
				{#if actionLog.length === 0}
					<p class="no-actions">
						No tab navigation activity yet. Try switching between tabs above!
					</p>
				{/if}
			</div>
		</div>
	</Paper>

	<Paper title="Features">
		<div class="feature-list">
			<ul>
				<li>
					<strong>Smooth animations:</strong> Animated underline that smoothly transitions between tabs
				</li>
				<li>
					<strong>Auto positioning:</strong> Underline automatically calculates position and width
				</li>
				<li><strong>Theme integration:</strong> Full support for light and dark modes</li>
				<li>
					<strong>Flexible options:</strong> Accepts ComboBoxItem array for easy configuration
				</li>
				<li><strong>Two-way binding:</strong> Reactive value binding with external state</li>
				<li><strong>Responsive design:</strong> Adapts to different tab widths and content</li>
				<li><strong>Hover effects:</strong> Interactive hover states for better UX</li>
				<li><strong>Keyboard accessible:</strong> Full keyboard navigation support</li>
				<li><strong>Custom content:</strong> Flexible content areas for each tab</li>
				<li><strong>Event handling:</strong> Easy integration with external event handlers</li>
				<li><strong>Performance optimized:</strong> Efficient DOM updates and calculations</li>
				<li><strong>Cross-browser compatible:</strong> Works across all modern browsers</li>
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

	.tabs-section h4,
	.navigation-section h4,
	.settings-section h4,
	.dashboard-section h4,
	.content-section h4,
	.controls-section h4,
	.log-section h4 {
		color: var(--text-color);
		font-size: 1.125rem;
		font-weight: 600;
		margin: 0 0 1rem 0;
	}

	.tabs-demo,
	.nav-demo,
	.settings-demo,
	.dashboard-demo,
	.content-demo {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.tab-content,
	.nav-content,
	.settings-content,
	.dashboard-content,
	.content-display {
		padding: 1.5rem;
		border: 1px solid var(--border-color);
		border-radius: 0.375rem;
		background-color: var(--paper-body-bg);
		min-height: 200px;
	}

	.tab-content h5,
	.nav-content h5,
	.settings-content h5,
	.dashboard-content h5,
	.content-display h5 {
		color: var(--text-color);
		font-weight: 600;
		margin: 0 0 1rem 0;
		font-size: 1.125rem;
	}

	.tab-content p,
	.nav-content p,
	.settings-content p,
	.dashboard-content p,
	.content-display p {
		color: var(--text-color);
		margin: 0 0 1rem 0;
		line-height: 1.6;
	}

	.tabs-info {
		padding: 1rem;
		background-color: rgba(var(--ui-primary-rgbc), 0.05);
		border-radius: 0.375rem;
		border: 1px solid var(--border-color);
	}

	.tabs-info strong {
		color: var(--text-color);
		font-weight: 600;
		display: block;
		margin-bottom: 0.5rem;
	}

	.tabs-info ul {
		margin: 0.5rem 0;
		padding-left: 1.5rem;
		color: var(--text-color);
	}

	.tabs-info li {
		margin-bottom: 0.25rem;
		font-size: 0.875rem;
	}

	.form-fields {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.field-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}

	.setting-item {
		padding: 0.5rem 0;
	}

	.security-options,
	.report-actions {
		display: flex;
		gap: 1rem;
		margin-top: 1rem;
		flex-wrap: wrap;
	}

	.notification-settings,
	.privacy-options {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin-top: 1rem;
	}

	.billing-info {
		margin-top: 1rem;
		padding: 1rem;
		background-color: rgba(var(--ui-primary-rgbc), 0.05);
		border-radius: 0.375rem;
		border: 1px solid var(--border-color);
	}

	.billing-info p {
		margin: 0.25rem 0;
		color: var(--text-color);
		font-size: 0.875rem;
	}

	.metrics-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		gap: 1rem;
		margin-top: 1rem;
	}

	.metric-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 1rem;
		background-color: rgba(var(--ui-primary-rgbc), 0.05);
		border-radius: 0.375rem;
		border: 1px solid var(--border-color);
	}

	.metric-value {
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--ui-primary);
	}

	.metric-label {
		font-size: 0.875rem;
		color: var(--text-muted);
		margin-top: 0.25rem;
	}

	.user-stats {
		margin-top: 1rem;
		padding: 1rem;
		background-color: rgba(var(--ui-primary-rgbc), 0.05);
		border-radius: 0.375rem;
		border: 1px solid var(--border-color);
	}

	.user-stats p {
		margin: 0.5rem 0;
		color: var(--text-color);
		font-size: 0.875rem;
	}

	.performance-indicators {
		margin-top: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.indicator {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--text-color);
		font-size: 0.875rem;
	}

	.status-good {
		color: var(--success-text);
	}

	.status-warning {
		color: #f59e0b;
	}

	.content-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-top: 1rem;
	}

	.content-item {
		padding: 1rem;
		background-color: rgba(var(--ui-primary-rgbc), 0.05);
		border-radius: 0.375rem;
		border: 1px solid var(--border-color);
	}

	.content-item h6 {
		color: var(--text-color);
		font-weight: 600;
		margin: 0 0 0.5rem 0;
		font-size: 1rem;
	}

	.content-item p {
		color: var(--text-muted);
		font-size: 0.875rem;
		margin: 0;
	}

	.muted {
		color: var(--text-muted) !important;
		font-style: italic;
	}

	.controls-demo {
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
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
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

	:global(.dark) .tabs-info,
	.tabs-info,
	:global(.dark) .billing-info,
	.billing-info,
	:global(.dark) .metric-card,
	.metric-card,
	:global(.dark) .user-stats,
	.user-stats,
	:global(.dark) .content-item,
	.content-item,
	:global(.dark) .current-states,
	.current-states,
	:global(.dark) .action-log {
		background-color: rgba(var(--ui-accent-rgbc), 0.05);
	}

	:global(.dark) .feature-list strong {
		color: var(--ui-accent);
	}

	:global(.dark) .log-entry {
		background-color: rgba(var(--ui-accent-rgbc), 0.1);
	}

	:global(.dark) .metric-value {
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

	@media (max-width: 640px) {
		.field-row {
			grid-template-columns: 1fr;
		}

		.metrics-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}
</style>
