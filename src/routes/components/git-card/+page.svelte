<script lang="ts">
	import GitCard from '$lib/cards/GitCard.svelte';
	import Paper from '$lib/display/Paper.svelte';
	import Button from '$lib/ui/Button.svelte';
	import Badge from '$lib/ui/Badge.svelte';
	import type { GitEmployee } from '$lib/models/Employee.js';

	// Sample employee data
	let employees: GitEmployee[] = $state([
		{
			fullName: 'Sarah Johnson',
			emplid: 'EMP001',
			upn: 'sarah.johnson@company.com',
			jobTitle: 'Senior Software Engineer'
		},
		{
			fullName: 'Michael Chen',
			emplid: 'EMP002',
			upn: 'michael.chen@company.com',
			jobTitle: 'Product Manager'
		},
		{
			fullName: 'Emily Rodriguez',
			emplid: 'EMP003',
			upn: 'emily.rodriguez@company.com',
			jobTitle: 'UX Designer'
		},
		{
			fullName: 'David Thompson',
			emplid: 'EMP004',
			upn: 'david.thompson@company.com',
			jobTitle: 'DevOps Engineer'
		},
		{
			fullName: 'Jennifer Williams',
			emplid: 'EMP005',
			upn: 'jennifer.williams@company.com',
			jobTitle: 'Technical Lead'
		},
		{
			fullName: 'Robert Anderson',
			emplid: 'EMP006',
			upn: 'robert.anderson@company.com',
			jobTitle: 'Quality Assurance Manager'
		}
	]);

	// Sample images (using placeholder service)
	let avatarImages = $state([
		'https://images.unsplash.com/photo-1494790108755-2616b9e3c97c?w=96&h=96&fit=crop&crop=face',
		'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=face',
		'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&fit=crop&crop=face',
		'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop&crop=face',
		'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=96&h=96&fit=crop&crop=face',
		'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=96&h=96&fit=crop&crop=face'
	]);

	// Interactive state
	let selectedEmployee = $state(0);
	let customEmployee: GitEmployee = $state({
		fullName: 'Alex Smith',
		emplid: 'EMP999',
		upn: 'alex.smith@company.com',
		jobTitle: 'Frontend Developer'
	});

	function nextEmployee() {
		selectedEmployee = (selectedEmployee + 1) % employees.length;
	}

	function previousEmployee() {
		selectedEmployee = selectedEmployee > 0 ? selectedEmployee - 1 : employees.length - 1;
	}

	function addEmployee() {
		const newEmployee: GitEmployee = {
			fullName: `New Employee ${employees.length + 1}`,
			emplid: `EMP${String(employees.length + 1).padStart(3, '0')}`,
			upn: `employee${employees.length + 1}@company.com`,
			jobTitle: 'Software Developer'
		};
		employees = [...employees, newEmployee];
		avatarImages = [
			...avatarImages,
			`https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=96&h=96&fit=crop&crop=face`
		];
	}

	function removeEmployee() {
		if (employees.length > 1) {
			employees = employees.slice(0, -1);
			avatarImages = avatarImages.slice(0, -1);
			if (selectedEmployee >= employees.length) {
				selectedEmployee = employees.length - 1;
			}
		}
	}
</script>

<div class="page-header">
	<h1>Git Card</h1>
	<p>
		Display employee information in a clean, professional card format with integrated communication
		actions.
	</p>
</div>

<div class="vstack">
	<Paper title="Basic Git Card">
		<div class="card-demo">
			<GitCard
				git={employees[0]}
				imgSrc={avatarImages[0]}
				profileHref={(e) => `https://people.example.com/${e.emplid}`}
				chatHref={(e) => `MSTeams:/l/chat/0/0?users=${e.upn}`}
			/>
		</div>
		<p class="description">
			Simple Git Card displaying employee information with name, job title, and quick action buttons
			for communication. The email action is always shown (<code>mailto:</code> by default). Pass
			<code>profileHref</code>
			and
			<code>chatHref</code> functions to add links to your people directory and chat tool; without them
			those actions are hidden.
		</p>
	</Paper>

	<Paper title="Different Employee Types">
		<div class="cards-grid">
			{#each employees.slice(0, 4) as employee, index}
				<div class="card-wrapper">
					<GitCard git={employee} imgSrc={avatarImages[index]} />
					<div class="role-badge">
						<Badge variant="accent">
							{employee.jobTitle.split(' ')[0]}
						</Badge>
					</div>
				</div>
			{/each}
		</div>
		<p class="description">
			Git Cards work well for different types of employees and roles, maintaining consistent
			styling.
		</p>
	</Paper>

	<Paper title="Long Job Titles">
		<div class="cards-grid">
			<GitCard
				git={{
					fullName: 'Alexandra Montgomery',
					emplid: 'EMP007',
					upn: 'alexandra.montgomery@company.com',
					jobTitle: 'Senior Principal Software Engineering Manager'
				}}
				imgSrc="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=96&h=96&fit=crop&crop=face"
			/>
			<GitCard
				git={{
					fullName: 'Christopher Williams',
					emplid: 'EMP008',
					upn: 'christopher.williams@company.com',
					jobTitle: 'Lead Technical Product Marketing Specialist'
				}}
				imgSrc="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=96&h=96&fit=crop&crop=face"
			/>
		</div>
		<p class="description">
			Long job titles are automatically truncated with ellipsis to maintain card layout consistency.
		</p>
	</Paper>

	<Paper title="Interactive Employee Browser">
		<div class="interactive-section">
			<div class="browser-controls">
				<Button onclick={previousEmployee} variant="secondary">← Previous</Button>
				<div class="employee-info">
					<span class="employee-counter">
						{selectedEmployee + 1} of {employees.length}
					</span>
					<Badge variant="primary">{employees[selectedEmployee].emplid}</Badge>
				</div>
				<Button onclick={nextEmployee} variant="secondary">Next →</Button>
			</div>

			<div class="selected-card">
				<GitCard git={employees[selectedEmployee]} imgSrc={avatarImages[selectedEmployee]} />
			</div>

			<div class="management-controls">
				<Button onclick={addEmployee} variant="accent">Add Employee</Button>
				<Button onclick={removeEmployee} variant="danger">Remove Last</Button>
			</div>

			<div class="stats">
				<div class="stat">
					<span class="stat-label">Total Employees:</span>
					<Badge variant="tertiary">{employees.length}</Badge>
				</div>
			</div>
		</div>
	</Paper>

	<Paper title="Custom Employee Data">
		<div class="custom-section">
			<div class="form-section">
				<h4>Edit Employee Information</h4>
				<div class="form-group">
					<label for="fullName">Full Name:</label>
					<input
						id="fullName"
						type="text"
						bind:value={customEmployee.fullName}
						class="form-input"
					/>
				</div>
				<div class="form-group">
					<label for="jobTitle">Job Title:</label>
					<input
						id="jobTitle"
						type="text"
						bind:value={customEmployee.jobTitle}
						class="form-input"
					/>
				</div>
				<div class="form-group">
					<label for="upn">Email (UPN):</label>
					<input id="upn" type="email" bind:value={customEmployee.upn} class="form-input" />
				</div>
				<div class="form-group">
					<label for="emplid">Employee ID:</label>
					<input id="emplid" type="text" bind:value={customEmployee.emplid} class="form-input" />
				</div>
			</div>

			<div class="preview-section">
				<h4>Live Preview</h4>
				<GitCard
					git={customEmployee}
					imgSrc="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=96&h=96&fit=crop&crop=face"
				/>
			</div>
		</div>
	</Paper>

	<Paper title="Team Directory">
		<div class="directory-section">
			<h4>Development Team</h4>
			<div class="team-grid">
				{#each employees as employee, index}
					<div class="team-member">
						<GitCard git={employee} imgSrc={avatarImages[index]} />
						<div class="member-actions">
							<div class="department-badge">
								<Badge
									variant={index % 3 === 0 ? 'accent' : index % 3 === 1 ? 'primary' : 'tertiary'}
								>
									{employee.jobTitle.includes('Manager')
										? 'Management'
										: employee.jobTitle.includes('Engineer')
											? 'Engineering'
											: employee.jobTitle.includes('Designer')
												? 'Design'
												: 'Product'}
								</Badge>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</Paper>

	<Paper title="Communication Actions">
		<div class="actions-demo">
			<div class="action-card">
				<GitCard git={employees[1]} imgSrc={avatarImages[1]} />
				<div class="action-explanation">
					<h4>Available Actions</h4>
					<ul class="action-list">
						<li><strong>Teams Chat:</strong> Opens Microsoft Teams chat with the employee</li>
						<li><strong>Email:</strong> Opens default email client to compose message</li>
						<li><strong>Profile:</strong> Opens employee profile in company directory</li>
					</ul>
				</div>
			</div>
		</div>
	</Paper>

	<Paper title="Usage Guidelines">
		<div class="guidelines">
			<h4>When to Use Git Cards</h4>
			<ul>
				<li><strong>Employee directories:</strong> Display team members with contact options</li>
				<li><strong>Organization charts:</strong> Show reporting relationships and roles</li>
				<li><strong>Project teams:</strong> List project participants with quick communication</li>
				<li><strong>Contact lists:</strong> Provide professional contact information</li>
			</ul>

			<h4>Props Reference</h4>
			<ul>
				<li><code>git</code> - GitEmployee object with fullName, emplid, upn, and jobTitle</li>
				<li><code>imgSrc</code> - URL string for the employee's profile image</li>
			</ul>

			<h4>GitEmployee Interface</h4>
			<ul>
				<li><code>fullName</code> - Employee's complete name</li>
				<li><code>emplid</code> - Unique employee identifier</li>
				<li><code>upn</code> - User Principal Name (email address)</li>
				<li><code>jobTitle</code> - Employee's role or position</li>
			</ul>

			<h4>Best Practices</h4>
			<ul>
				<li><strong>Consistent images:</strong> Use square profile images (96x96px recommended)</li>
				<li>
					<strong>Professional information:</strong> Ensure job titles and contact info are current
				</li>
				<li>
					<strong>Grid layouts:</strong> Use consistent spacing when displaying multiple cards
				</li>
				<li><strong>Accessibility:</strong> Provide alt text for profile images</li>
				<li><strong>Responsive design:</strong> Cards work best in flexible grid layouts</li>
			</ul>

			<h4>Integration</h4>
			<ul>
				<li><strong>Microsoft Teams:</strong> Direct integration with Teams chat functionality</li>
				<li><strong>Email clients:</strong> Opens default email application with recipient</li>
				<li><strong>Directory systems:</strong> Links to company employee directory</li>
				<li><strong>Data sources:</strong> Works with Active Directory or HR systems</li>
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
		margin: 0 0 0.5rem;
		color: var(--text-color);
	}
	.page-header p {
		color: var(--text-muted);
		margin: 0;
	}

	.vstack {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.description {
		color: var(--text-muted);
		font-size: 0.875rem;
		margin-top: 1rem;
		margin-bottom: 0;
	}

	.card-demo {
		display: flex;
		justify-content: center;
		margin-bottom: 1rem;
	}

	.cards-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(375px, 1fr));
		gap: 1.5rem;
		margin-bottom: 1rem;
	}

	.card-wrapper {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}

	.role-badge {
		margin-top: 0.5rem;
	}

	.interactive-section {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.browser-controls {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.employee-info {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.employee-counter {
		font-size: 0.875rem;
		color: var(--text-muted);
	}

	.selected-card {
		display: flex;
		justify-content: center;
	}

	.management-controls {
		display: flex;
		justify-content: center;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.stats {
		display: flex;
		justify-content: center;
	}

	.stat {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.stat-label {
		font-size: 0.875rem;
		color: var(--text-muted);
	}

	.custom-section {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem;
		align-items: start;
	}

	.form-section h4,
	.preview-section h4 {
		margin: 0 0 1rem;
		color: var(--text-color);
		font-size: 1rem;
	}

	.form-group {
		margin-bottom: 1rem;
	}

	.form-group label {
		display: block;
		margin-bottom: 0.25rem;
		font-size: 0.875rem;
		color: var(--text-color);
		font-weight: 500;
	}

	.form-input {
		width: 100%;
		padding: 0.5rem 0.75rem;
		border: 1px solid var(--border-color);
		border-radius: 0.25rem;
		background: var(--input-bg-color);
		color: var(--text-color);
		font-size: 0.875rem;
	}

	.form-input:focus {
		outline: none;
		border-color: var(--ui-accent);
		box-shadow: 0 0 0 2px rgba(var(--ui-accent-rgbc), 0.2);
	}

	.preview-section {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.directory-section h4 {
		margin: 0 0 1rem;
		color: var(--text-color);
		font-size: 1rem;
	}

	.team-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(375px, 1fr));
		gap: 1.5rem;
	}

	.team-member {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}

	.department-badge {
		margin-top: 0.5rem;
	}

	.actions-demo {
		display: flex;
		justify-content: center;
	}

	.action-card {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 2rem;
		align-items: start;
	}

	.action-explanation h4 {
		margin: 0 0 0.75rem;
		color: var(--text-color);
		font-size: 1rem;
	}

	.action-list {
		margin: 0;
		padding-left: 1.5rem;
	}

	.action-list li {
		margin: 0.5rem 0;
		line-height: 1.5;
	}

	.guidelines ul {
		margin: 0.5rem 0 1rem;
		padding-left: 1.5rem;
	}

	.guidelines li {
		margin: 0.5rem 0;
		line-height: 1.5;
	}

	.guidelines h4 {
		margin: 0 0 0.5rem;
		color: var(--text-color);
	}

	.guidelines h4:not(:first-child) {
		margin-top: 1.5rem;
	}

	.guidelines code {
		background: rgba(var(--ui-accent-rgbc), 0.1);
		padding: 0.125rem 0.25rem;
		border-radius: 0.25rem;
		font-family: monospace;
		font-size: 0.875rem;
		color: var(--ui-accent-dark);
	}

	/* Dark mode adjustments */
	:global(.dark) .form-input {
		background: rgb(25, 26, 28);
		border-color: #374151;
		color: var(--text-color);
	}

	:global(.dark) .form-input:focus {
		border-color: var(--ui-primary);
		box-shadow: 0 0 0 2px rgba(var(--ui-primary-rgbc), 0.2);
	}

	:global(.dark) .guidelines code {
		background: rgba(var(--ui-primary-rgbc), 0.2);
		color: var(--ui-primary);
	}

	/* Responsive design */
	@media (max-width: 768px) {
		.cards-grid {
			grid-template-columns: 1fr;
			justify-items: center;
		}

		.team-grid {
			grid-template-columns: 1fr;
			justify-items: center;
		}

		.custom-section {
			grid-template-columns: 1fr;
			gap: 1.5rem;
		}

		.action-card {
			grid-template-columns: 1fr;
			gap: 1.5rem;
			text-align: center;
		}

		.browser-controls {
			flex-direction: column;
			align-items: center;
		}

		.management-controls {
			flex-direction: column;
			align-items: center;
		}
	}

	@media (max-width: 480px) {
		.cards-grid {
			grid-template-columns: 1fr;
		}

		.team-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
