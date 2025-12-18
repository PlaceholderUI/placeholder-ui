<script lang="ts">
	import { Button, Paper, Badge, ThemeSwitcher } from '$lib/index.js';
</script>

<div class="intro">
	<h1>UI Svelte Component Library</h1>
	<p class="tagline">A modern, accessible Svelte 5 component library built with runes</p>

	<div class="badges">
		<Badge variant="midnight">Svelte 5</Badge>
		<Badge variant="pistachio">TypeScript</Badge>
		<Badge variant="turquoise">Accessible</Badge>
	</div>

	<div class="actions">
		<Button variant="midnight" href="/components/button">Get Started</Button>
		<Button variant="midnight-outline" href="https://github.com/anthropics/ui-svelte">GitHub</Button>
	</div>
</div>

<Paper class="feature-section">
	<h2>Features</h2>
	<div class="features">
		<div class="feature">
			<h3>Svelte 5 Runes</h3>
			<p>Built with the latest Svelte 5 runes for reactive state management ($state, $derived, $props).</p>
		</div>
		<div class="feature">
			<h3>TypeScript First</h3>
			<p>Full TypeScript support with strict mode and comprehensive type definitions.</p>
		</div>
		<div class="feature">
			<h3>CSS Variables</h3>
			<p>Customizable theming via CSS custom properties with built-in dark mode support.</p>
		</div>
		<div class="feature">
			<h3>Accessible</h3>
			<p>ARIA-compliant components with keyboard navigation and screen reader support.</p>
		</div>
	</div>
</Paper>

<Paper class="quick-start">
	<h2>Quick Start</h2>
	<pre><code>npm install @anthropic-public/ui-svelte</code></pre>

	<h3>Import Styles</h3>
	<pre><code>{`// In your +layout.svelte or app.css
import '@anthropic-public/ui-svelte/styles';`}</code></pre>

	<h3>Use Components</h3>
	<pre><code>{`<script>
  import { Button, Textbox, Dialog } from '@anthropic-public/ui-svelte';
</script>

<Button variant="midnight">Click me</Button>`}</code></pre>
</Paper>

<Paper class="theme-section">
	<h2>Theme</h2>
	<p>Toggle between light and dark mode:</p>
	<ThemeSwitcher />
</Paper>

<style>
	.intro {
		text-align: center;
		padding: var(--cui-spacing-8, 2rem) 0;
	}

	h1 {
		font-size: 2.5rem;
		margin-bottom: var(--cui-spacing-2, 0.5rem);
		color: var(--cui-color-text-primary);
	}

	.tagline {
		font-size: 1.25rem;
		color: var(--cui-color-text-secondary);
		margin-bottom: var(--cui-spacing-4, 1rem);
	}

	.badges {
		display: flex;
		gap: var(--cui-spacing-2, 0.5rem);
		justify-content: center;
		margin-bottom: var(--cui-spacing-6, 1.5rem);
	}

	.actions {
		display: flex;
		gap: var(--cui-spacing-3, 0.75rem);
		justify-content: center;
	}

	.feature-section {
		margin-top: var(--cui-spacing-8, 2rem);
	}

	h2 {
		font-size: 1.5rem;
		margin-bottom: var(--cui-spacing-4, 1rem);
		color: var(--cui-color-text-primary);
	}

	.features {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: var(--cui-spacing-4, 1rem);
	}

	.feature h3 {
		font-size: 1.1rem;
		margin-bottom: var(--cui-spacing-2, 0.5rem);
		color: var(--cui-color-text-primary);
	}

	.feature p {
		color: var(--cui-color-text-secondary);
		line-height: 1.5;
	}

	.quick-start {
		margin-top: var(--cui-spacing-6, 1.5rem);
	}

	.quick-start h3 {
		font-size: 1rem;
		margin-top: var(--cui-spacing-4, 1rem);
		margin-bottom: var(--cui-spacing-2, 0.5rem);
	}

	pre {
		background: var(--cui-color-bg-tertiary, #f5f5f5);
		padding: var(--cui-spacing-3, 0.75rem);
		border-radius: var(--cui-radius-md, 0.5rem);
		overflow-x: auto;
		font-size: 0.875rem;
	}

	code {
		font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
	}

	.theme-section {
		margin-top: var(--cui-spacing-6, 1.5rem);
	}

	:global(.dark) pre {
		background: var(--cui-color-bg-secondary, #1a1a1a);
	}
</style>
