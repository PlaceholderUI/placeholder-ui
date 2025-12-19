<script lang="ts">
	import {
		Button,
		Badge,
		Progress,
		Skeleton,
		Avatar,
		Alert,
		Paper,
	} from "@placeholderco/placeholder-ui";
</script>

<Paper>
	<div class="hero">
		<Badge variant="pistachio">Svelte 5</Badge>
		<h1>Placeholder UI</h1>
		<p class="hero-subtitle">
			A modern, accessible component library for Svelte 5 with dark mode
			support, CSS variables theming, and 60+ ready-to-use components.
		</p>
		<div class="hero-actions">
			<Button variant="midnight" href="/docs/installation"
				>Get Started</Button
			>
			<Button
				variant="secondary"
				href="https://github.com/placeholderco/placeholder-ui"
				target="_blank"
			>
				GitHub
			</Button>
		</div>
	</div>
</Paper>

<section class="features">
	<h2>Features</h2>
	<div class="feature-grid">
		<div class="feature-card">
			<h3>Svelte 5 Ready</h3>
			<p>
				Built from the ground up with Svelte 5 runes, snippets, and
				modern patterns.
			</p>
		</div>
		<div class="feature-card">
			<h3>Dark Mode</h3>
			<p>
				First-class dark mode support with automatic system preference
				detection.
			</p>
		</div>
		<div class="feature-card">
			<h3>Accessible</h3>
			<p>
				ARIA attributes and keyboard navigation built into every
				component.
			</p>
		</div>
		<div class="feature-card">
			<h3>Customizable</h3>
			<p>
				CSS variables theming system for easy customization without
				CSS-in-JS.
			</p>
		</div>
		<div class="feature-card">
			<h3>TypeScript</h3>
			<p>
				Full TypeScript support with exported types for all components.
			</p>
		</div>
		<div class="feature-card">
			<h3>Tree-shakeable</h3>
			<p>
				Import only what you need. Each component is individually
				exported.
			</p>
		</div>
	</div>
</section>

<section class="preview-section">
	<h2>Component Preview</h2>

	<div class="preview-card">
		<h3>Buttons</h3>
		<div class="preview-box">
			<div class="button-row">
				<Button variant="midnight">Primary</Button>
				<Button variant="pistachio">Secondary</Button>
				<Button variant="secondary">Outline</Button>
				<Button variant="danger">Danger</Button>
			</div>
		</div>
	</div>

	<div class="preview-card">
		<h3>Progress & Loading</h3>
		<div class="preview-box">
			<Progress value={65} color="primary" label="Progress" showValue />
			<div style="margin-top: 1rem;">
				<Skeleton width="100%" height="1rem" />
				<div style="margin-top: 0.5rem; display: flex; gap: 1rem;">
					<Skeleton width="60%" height="1rem" />
					<Skeleton circle width="2rem" height="2rem" />
				</div>
			</div>
		</div>
	</div>

	<div class="preview-card">
		<h3>Alerts</h3>
		<div class="preview-box">
			<Alert variant="default" title="Information">
				This is a default alert message.
			</Alert>
			<div style="margin-top: 0.5rem;">
				<Alert variant="warning" title="Warning">
					Please review your settings.
				</Alert>
			</div>
		</div>
	</div>

	<div class="preview-card">
		<h3>Avatars & Badges</h3>
		<div class="preview-box">
			<div
				style="display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;"
			>
				<Avatar
					src="https://i.pravatar.cc/150?img=1"
					alt="User"
					size={48}
				/>
				<Avatar
					src="https://i.pravatar.cc/150?img=2"
					alt="User"
					size={48}
				/>
				<Badge variant="midnight">Default</Badge>
				<Badge variant="pistachio">Success</Badge>
				<Badge variant="danger">Error</Badge>
				<Badge variant="turquoise">Info</Badge>
			</div>
		</div>
	</div>
</section>

<section class="install-section">
	<h2>Quick Install</h2>
	<pre>
		<code>
			npm install @placeholderco/placeholder-ui
		</code>
	</pre>
	<pre>
		<code>
			&lt;script&gt;
  import &#123; Button, Alert &#125; from '@placeholderco/placeholder-ui';
&lt;/script&gt;

&lt;Button variant="midnight"&gt;Click me&lt;/Button&gt;
&lt;Alert title="Hello"&gt;Welcome to Placeholder UI!&lt;/Alert&gt;
		</code>
	</pre>
</section>

<style>
	.hero {
		text-align: center;
		padding: var(--pui-spacing-12) 0;
	}

	.hero h1 {
		font-size: var(--pui-font-size-4xl);
		margin: var(--pui-spacing-4) 0;
		background: linear-gradient(
			135deg,
			var(--pui-color-primary),
			var(--pui-color-accent)
		);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	:global(.dark) .hero h1 {
		background: linear-gradient(
			135deg,
			var(--pui-color-secondary),
			var(--pui-color-accent)
		);
		-webkit-background-clip: text;
		background-clip: text;
	}

	.hero-subtitle {
		font-size: var(--pui-font-size-lg);
		color: var(--pui-color-gray-600);
		max-width: 600px;
		margin: 0 auto var(--pui-spacing-6);
		line-height: var(--pui-line-height-relaxed);
	}

	:global(.dark) .hero-subtitle {
		color: var(--pui-color-gray-400);
	}

	.hero-actions {
		display: flex;
		gap: var(--pui-spacing-3);
		justify-content: center;
		flex-wrap: wrap;
	}

	.features {
		padding: var(--pui-spacing-12) 0;
	}

	.features h2 {
		text-align: center;
		margin-bottom: var(--pui-spacing-8);
	}

	.feature-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: var(--pui-spacing-6);
	}

	.feature-card {
		padding: var(--pui-spacing-6);
		background: var(--pui-color-gray-50);
		border-radius: var(--pui-radius-lg);
		border: 1px solid var(--pui-color-gray-200);
	}

	:global(.dark) .feature-card {
		background: var(--pui-color-dark-200);
		border-color: var(--pui-color-dark-border);
	}

	.feature-card h3 {
		font-size: var(--pui-font-size-md);
		margin-bottom: var(--pui-spacing-2);
	}

	.feature-card p {
		color: var(--pui-color-gray-600);
		margin: 0;
		font-size: var(--pui-font-size-sm);
	}

	:global(.dark) .feature-card p {
		color: var(--pui-color-gray-400);
	}

	.preview-section {
		padding: var(--pui-spacing-12) 0;
	}

	.preview-section h2 {
		text-align: center;
		margin-bottom: var(--pui-spacing-8);
	}

	.preview-card {
		margin-bottom: var(--pui-spacing-6);
	}

	.preview-card h3 {
		font-size: var(--pui-font-size-md);
		margin-bottom: var(--pui-spacing-3);
	}

	.button-row {
		display: flex;
		gap: var(--pui-spacing-3);
		flex-wrap: wrap;
	}
</style>
