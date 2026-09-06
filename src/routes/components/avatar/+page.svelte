<script lang="ts">
	import Avatar from '$lib/display/Avatar.svelte';
	import Paper from '$lib/display/Paper.svelte';
	import Button from '$lib/ui/Button.svelte';
	import Badge from '$lib/ui/Badge.svelte';
	import { iconUser, iconUserGroup, iconPhoto, iconUserPlus } from '$lib/icon/index.js';

	let clickCount = $state(0);
	let selectedAvatar = $state('');
	let imageError = $state(false);
	let customSize = $state(3);

	function handleAvatarClick(name: string) {
		clickCount++;
		selectedAvatar = name;
	}

	function resetDemo() {
		clickCount = 0;
		selectedAvatar = '';
		imageError = false;
	}

	function triggerImageError() {
		imageError = true;
	}

	// Sample user data
	const users = [
		{ name: 'Alice Johnson', initials: 'AJ', color: '#FF6B6B' },
		{ name: 'Bob Smith', initials: 'BS', color: '#4ECDC4' },
		{ name: 'Carol Davis', initials: 'CD', color: '#45B7D1' },
		{ name: 'David Wilson', initials: 'DW', color: '#96CEB4' },
		{ name: 'Eve Brown', initials: 'EB', color: '#FECA57' }
	];
</script>

<div class="page-header">
	<h1>Avatar</h1>
	<p>Display user profile pictures, initials, or fallback icons with various shapes and sizes.</p>
</div>

<div class="vstack">
	<Paper title="Basic Avatars">
		<div class="row">
			<Avatar src="/favicon.png" alt="Sample Avatar" />
			<Avatar src="" initials="AB" backgroundColor="#FF6B6B" />
			<Avatar src="" fallBackSvg={iconUser} backgroundColor="#4ECDC4" />
			<Avatar src="" initials="?" backgroundColor="#ccc" />
		</div>
		<p class="description">
			Basic usage showing image, initials, fallback icon, and default fallback.
		</p>
	</Paper>

	<Paper title="Avatar Shapes">
		<div class="examples-grid">
			<div class="shape-example">
				<h4>Circle (default)</h4>
				<div class="row">
					<Avatar src="/favicon.png" alt="Circle" shape="circle" />
					<Avatar src="" initials="CR" backgroundColor="#FF6B6B" shape="circle" />
					<Avatar src="" fallBackSvg={iconUser} backgroundColor="#4ECDC4" shape="circle" />
				</div>
			</div>

			<div class="shape-example">
				<h4>Rounded</h4>
				<div class="row">
					<Avatar src="/favicon.png" alt="Rounded" shape="rounded" />
					<Avatar src="" initials="RD" backgroundColor="#45B7D1" shape="rounded" />
					<Avatar src="" fallBackSvg={iconUserGroup} backgroundColor="#96CEB4" shape="rounded" />
				</div>
			</div>

			<div class="shape-example">
				<h4>Square</h4>
				<div class="row">
					<Avatar src="/favicon.png" alt="Square" shape="square" />
					<Avatar src="" initials="SQ" backgroundColor="#FECA57" shape="square" />
					<Avatar src="" fallBackSvg={iconPhoto} backgroundColor="#FF9FF3" shape="square" />
				</div>
			</div>
		</div>
	</Paper>

	<Paper title="Avatar Sizes">
		<div class="size-examples">
			<div class="size-row">
				<span class="size-label">Small (1.5rem)</span>
				<Avatar src="/favicon.png" alt="Small" size={1.5} />
				<Avatar src="" initials="SM" backgroundColor="#FF6B6B" size={1.5} />
				<Avatar src="" fallBackSvg={iconUser} backgroundColor="#4ECDC4" size={1.5} />
			</div>

			<div class="size-row">
				<span class="size-label">Medium (2.5rem)</span>
				<Avatar src="/favicon.png" alt="Medium" size={2.5} />
				<Avatar src="" initials="MD" backgroundColor="#45B7D1" size={2.5} />
				<Avatar src="" fallBackSvg={iconUser} backgroundColor="#96CEB4" size={2.5} />
			</div>

			<div class="size-row">
				<span class="size-label">Large (4rem)</span>
				<Avatar src="/favicon.png" alt="Large" size={4} />
				<Avatar src="" initials="LG" backgroundColor="#FECA57" size={4} />
				<Avatar src="" fallBackSvg={iconUser} backgroundColor="#FF9FF3" size={4} />
			</div>

			<div class="size-row">
				<span class="size-label">Custom ({customSize}rem)</span>
				<Avatar src="/favicon.png" alt="Custom" size={customSize} />
				<Avatar src="" initials="CS" backgroundColor="#A8E6CF" size={customSize} />
				<Avatar src="" fallBackSvg={iconUser} backgroundColor="#FFB3BA" size={customSize} />
			</div>
		</div>

		<div class="size-control">
			<label for="size-slider">Adjust custom size:</label>
			<input type="range" id="size-slider" min="1" max="6" step="0.5" bind:value={customSize} />
			<span>{customSize}rem</span>
		</div>
	</Paper>

	<Paper title="Interactive Avatars">
		<div class="vstack">
			<div class="interactive-section">
				<h4>Clickable Avatars</h4>
				<div class="row">
					{#each users as user}
						<Avatar
							src=""
							initials={user.initials}
							backgroundColor={user.color}
							onClick={() => handleAvatarClick(user.name)}
						/>
					{/each}
				</div>
				<div class="interaction-info">
					{#if selectedAvatar}
						<p>
							Last clicked: <strong>{selectedAvatar}</strong>
							<Badge variant="secondary">{clickCount} clicks</Badge>
						</p>
					{:else}
						<p>Click any avatar above to see interaction</p>
					{/if}
				</div>
			</div>

			<div class="interactive-section">
				<h4>Linked Avatars</h4>
				<div class="row">
					<Avatar src="/favicon.png" alt="Profile" href="#profile" />
					<Avatar src="" initials="LK" backgroundColor="#4ECDC4" href="#settings" />
					<Avatar src="" fallBackSvg={iconUserPlus} backgroundColor="#FF6B6B" href="#add-user" />
				</div>
				<p class="description">These avatars are wrapped in links (href prop)</p>
			</div>

			<div class="controls">
				<Button onclick={resetDemo} variant="secondary">Reset Demo</Button>
			</div>
		</div>
	</Paper>

	<Paper title="Fallback Behavior">
		<div class="vstack">
			<h4>Image Loading States</h4>
			<div class="fallback-examples">
				<div class="fallback-item">
					<Avatar
						src={imageError ? 'https://invalid-url.com/broken.jpg' : '/favicon.png'}
						alt="Fallback demo"
						initials="FB"
						backgroundColor="#FF6B6B"
					/>
					<p>Image with initials fallback</p>
				</div>

				<div class="fallback-item">
					<Avatar
						src={imageError ? 'https://invalid-url.com/broken.jpg' : '/favicon.png'}
						alt="Fallback demo"
						fallBackSvg={iconUser}
						backgroundColor="#4ECDC4"
					/>
					<p>Image with icon fallback</p>
				</div>

				<div class="fallback-item">
					<Avatar
						src={imageError ? 'https://invalid-url.com/broken.jpg' : '/favicon.png'}
						alt="Fallback demo"
						backgroundColor="#45B7D1"
					/>
					<p>Image with default fallback</p>
				</div>
			</div>

			<Button onclick={triggerImageError} variant="danger">
				{imageError ? 'Images broken (showing fallbacks)' : 'Trigger Image Error'}
			</Button>
		</div>
	</Paper>

	<Paper title="Team Display Example">
		<div class="team-section">
			<h4>Development Team</h4>
			<div class="team-grid">
				{#each users as user, index}
					<div class="team-member">
						<Avatar
							src=""
							initials={user.initials}
							backgroundColor={user.color}
							size={3}
							onClick={() => handleAvatarClick(user.name)}
						/>
						<div class="member-info">
							<strong>{user.name}</strong>
							<span class="role">Team Member</span>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</Paper>

	<Paper title="Usage Guidelines">
		<div class="guidelines">
			<h4>Best Practices</h4>
			<ul>
				<li><strong>Provide meaningful alt text:</strong> For accessibility when using images</li>
				<li>
					<strong>Use appropriate fallbacks:</strong> Initials for named users, icons for generic users
				</li>
				<li>
					<strong>Consistent sizing:</strong> Use the same size for avatars in the same context
				</li>
				<li>
					<strong>Color accessibility:</strong> Ensure sufficient contrast for initials and backgrounds
				</li>
				<li><strong>Loading states:</strong> Always provide fallbacks for failed image loads</li>
				<li>
					<strong>Interactive feedback:</strong> Use hover states and cursors for clickable avatars
				</li>
			</ul>

			<h4>Common Use Cases</h4>
			<ul>
				<li>User profile displays</li>
				<li>Comment sections and user lists</li>
				<li>Team member galleries</li>
				<li>Navigation and header user indicators</li>
				<li>Contact lists and messaging interfaces</li>
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

	.row {
		display: flex;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.description {
		color: var(--text-muted);
		font-size: 0.875rem;
		margin-top: 1rem;
		margin-bottom: 0;
	}

	.examples-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1.5rem;
	}

	.shape-example h4 {
		margin: 0 0 0.75rem;
		color: var(--text-color);
		font-size: 1rem;
	}

	.size-examples {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.size-row {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.size-label {
		min-width: 120px;
		font-size: 0.875rem;
		color: var(--text-muted);
	}

	.size-control {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-top: 1rem;
		padding: 1rem;
		background: rgba(var(--ui-accent-rgbc), 0.05);
		border-radius: 0.25rem;
		border: 1px solid rgba(var(--ui-accent-rgbc), 0.2);
	}

	.size-control label {
		font-size: 0.875rem;
		color: var(--text-color);
	}

	.size-control input {
		flex: 1;
		max-width: 200px;
	}

	.size-control span {
		font-size: 0.875rem;
		color: var(--text-muted);
		min-width: 60px;
	}

	.interactive-section {
		margin-bottom: 1.5rem;
	}

	.interactive-section h4 {
		margin: 0 0 0.75rem;
		color: var(--text-color);
	}

	.interaction-info {
		margin-top: 1rem;
		padding: 0.75rem;
		background: rgba(var(--ui-accent-rgbc), 0.05);
		border-radius: 0.25rem;
		border: 1px solid rgba(var(--ui-accent-rgbc), 0.2);
	}

	.interaction-info p {
		margin: 0;
		color: var(--text-color);
	}

	.controls {
		margin-top: 1rem;
	}

	.fallback-examples {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.fallback-item {
		text-align: center;
	}

	.fallback-item p {
		margin: 0.5rem 0 0;
		font-size: 0.875rem;
		color: var(--text-muted);
	}

	.team-section h4 {
		margin: 0 0 1rem;
		color: var(--text-color);
	}

	.team-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1rem;
	}

	.team-member {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem;
		background: var(--paper-body-bg);
		border: 1px solid var(--paper-title-border);
		border-radius: 0.25rem;
		transition: all 0.2s ease;
	}

	.team-member:hover {
		background: rgba(var(--ui-accent-rgbc), 0.05);
		border-color: rgba(var(--ui-accent-rgbc), 0.3);
	}

	.member-info {
		display: flex;
		flex-direction: column;
	}

	.member-info strong {
		color: var(--text-color);
		font-size: 0.875rem;
	}

	.member-info .role {
		color: var(--text-muted);
		font-size: 0.75rem;
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

	/* Dark mode adjustments */
	:global(.dark) .team-member {
		background: rgb(25, 26, 28);
		border-color: #374151;
	}

	:global(.dark) .team-member:hover {
		background: rgba(var(--ui-primary-rgbc), 0.05);
		border-color: rgba(var(--ui-primary-rgbc), 0.3);
	}

	:global(.dark) .size-control {
		background: rgba(var(--ui-primary-rgbc), 0.05);
		border-color: rgba(var(--ui-primary-rgbc), 0.2);
	}

	:global(.dark) .interaction-info {
		background: rgba(var(--ui-primary-rgbc), 0.05);
		border-color: rgba(var(--ui-primary-rgbc), 0.2);
	}
</style>
