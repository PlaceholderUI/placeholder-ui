<script lang="ts">
	import {
		Button,
		Paper,
		Badge,
		Progress,
		Skeleton,
		Avatar,
		Alert,
		ThemeSwitcher
	} from '$lib/index.js';
</script>

<div class="intro">
	<h1>Placeholder UI</h1>
	<p class="tagline">
		A modern, accessible component library for Svelte 5 with dark mode support,
		CSS variables theming, and 60+ ready-to-use components.
	</p>

	<div class="badges">
		<Badge variant="primary">Svelte 5</Badge>
		<Badge variant="secondary">TypeScript</Badge>
		<Badge variant="accent">Accessible</Badge>
	</div>

	<div class="actions">
		<Button variant="primary" href="/components/button">Get Started</Button>
		<Button variant="primary-outline" href="https://github.com/PlaceholderUI/placeholder-ui">GitHub</Button>
	</div>
</div>

<section class="features">
	<h2>Features</h2>
	<div class="feature-grid">
		<div class="feature-card">
			<h3>Svelte 5 Ready</h3>
			<p>Built from the ground up with Svelte 5 runes, snippets, and modern patterns.</p>
		</div>
		<div class="feature-card">
			<h3>Dark Mode</h3>
			<p>First-class dark mode support with automatic system preference detection.</p>
		</div>
		<div class="feature-card">
			<h3>Accessible</h3>
			<p>ARIA attributes and keyboard navigation built into every component.</p>
		</div>
		<div class="feature-card">
			<h3>Customizable</h3>
			<p>CSS variables theming system for easy customization without CSS-in-JS.</p>
		</div>
		<div class="feature-card">
			<h3>TypeScript</h3>
			<p>Full TypeScript support with exported types for all components.</p>
		</div>
		<div class="feature-card">
			<h3>Tree-shakeable</h3>
			<p>Import only what you need. Each component is individually exported.</p>
		</div>
	</div>
</section>

<section class="preview-section">
	<h2>Component Preview</h2>

	<Paper class="preview-card">
		<h3>Buttons</h3>
		<div class="button-row">
			<Button variant="primary">Primary</Button>
			<Button variant="secondary">Secondary</Button>
			<Button variant="muted">Muted</Button>
			<Button variant="danger">Danger</Button>
		</div>
	</Paper>

	<Paper class="preview-card">
		<h3>Progress & Loading</h3>
		<Progress value={65} color="primary" label="Progress" showValue />
		<div style="margin-top: 1rem;">
			<Skeleton width="100%" height="1rem" />
			<div style="margin-top: 0.5rem; display: flex; gap: 1rem;">
				<Skeleton width="60%" height="1rem" />
				<Skeleton circle width="2rem" height="2rem" />
			</div>
		</div>
	</Paper>

	<Paper class="preview-card">
		<h3>Alerts</h3>
		<Alert variant="default" title="Information">
			This is a default alert message.
		</Alert>
		<div style="margin-top: 0.5rem;">
			<Alert variant="warning" title="Warning">
				Please review your settings.
			</Alert>
		</div>
	</Paper>

	<Paper class="preview-card">
		<h3>Avatars & Badges</h3>
		<div style="display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;">
			<Avatar src="https://i.pravatar.cc/150?img=1" alt="User" size={48} />
			<Avatar src="https://i.pravatar.cc/150?img=2" alt="User" size={48} />
			<Badge variant="primary">Default</Badge>
			<Badge variant="secondary">Success</Badge>
			<Badge variant="danger">Error</Badge>
			<Badge variant="accent">Info</Badge>
		</div>
	</Paper>
</section>

<Paper class="quick-start">
	<h2>Quick Start</h2>
	<pre><code>npm install @placeholderco/placeholder-ui</code></pre>

	<h3>Import Styles</h3>
	<pre><code>{`// In your +layout.svelte or app.css
import '@placeholderco/placeholder-ui/styles';`}</code></pre>

	<h3>Use Components</h3>
	<pre><code>{`<script>
  import { Button, Textbox, Dialog } from '@placeholderco/placeholder-ui';
${"</scr" + "ipt>"}
<Button variant="primary">Click me</Button>`}</code></pre>
</Paper>

<Paper class="theme-section">
	<h2>Theme</h2>
	<p>Toggle between light and dark mode:</p>
	<ThemeSwitcher />
</Paper>

<style>
	.intro {
		text-align: center;
		padding: var(--pui-spacing-8, 2rem) 0;
	}

	h1 {
		font-size: 2.5rem;
		margin-bottom: var(--pui-spacing-2, 0.5rem);
		color: var(--pui-color-text-primary);
	}

	.tagline {
		font-size: var(--pui-font-size-lg, 1.125rem);
		color: var(--pui-color-text-secondary);
		max-width: 600px;
		margin: 0 auto var(--pui-spacing-6, 1.5rem);
		line-height: 1.6;
	}

	.badges {
		display: flex;
		gap: var(--pui-spacing-2, 0.5rem);
		justify-content: center;
		margin-bottom: var(--pui-spacing-6, 1.5rem);
	}

	.actions {
		display: flex;
		gap: var(--pui-spacing-3, 0.75rem);
		justify-content: center;
		flex-wrap: wrap;
	}

	.features {
		padding: var(--pui-spacing-8, 2rem) 0;
	}

	.features h2 {
		text-align: center;
		margin-bottom: var(--pui-spacing-8, 2rem);
	}

	.feature-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: var(--pui-spacing-6, 1.5rem);
	}

	.feature-card {
		padding: var(--pui-spacing-6, 1.5rem);
		background: var(--pui-color-gray-50);
		border-radius: var(--pui-radius-lg, 0.75rem);
		border: 1px solid var(--pui-color-gray-200);
	}

	:global(.dark) .feature-card {
		background: var(--pui-color-dark-200);
		border-color: var(--pui-color-dark-border);
	}

	.feature-card h3 {
		font-size: 1.1rem;
		margin-bottom: var(--pui-spacing-2, 0.5rem);
	}

	.feature-card p {
		color: var(--pui-color-text-secondary);
		margin: 0;
		line-height: 1.5;
	}

	.preview-section {
		padding: var(--pui-spacing-8, 2rem) 0;
	}

	.preview-section h2 {
		text-align: center;
		margin-bottom: var(--pui-spacing-8, 2rem);
	}

	:global(.preview-card) {
		margin-bottom: var(--pui-spacing-6, 1.5rem);
	}

	:global(.preview-card) h3 {
		font-size: 1rem;
		margin-bottom: var(--pui-spacing-3, 0.75rem);
	}

	.button-row {
		display: flex;
		gap: var(--pui-spacing-3, 0.75rem);
		flex-wrap: wrap;
	}

	h2 {
		font-size: 1.5rem;
		margin-bottom: var(--pui-spacing-4, 1rem);
		color: var(--pui-color-text-primary);
	}

	:global(.quick-start) {
		margin-top: var(--pui-spacing-6, 1.5rem);
	}

	:global(.quick-start) h3 {
		font-size: 1rem;
		margin-top: var(--pui-spacing-4, 1rem);
		margin-bottom: var(--pui-spacing-2, 0.5rem);
	}

	pre {
		background: var(--pui-color-bg-tertiary, #f5f5f5);
		padding: var(--pui-spacing-3, 0.75rem);
		border-radius: var(--pui-radius-md, 0.5rem);
		overflow-x: auto;
		font-size: 0.875rem;
	}

	code {
		font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
	}

	:global(.theme-section) {
		margin-top: var(--pui-spacing-6, 1.5rem);
	}

	:global(.dark) pre {
		background: var(--pui-color-bg-secondary, #1a1a1a);
	}
</style>
