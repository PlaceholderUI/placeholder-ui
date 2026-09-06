<script lang="ts">
	import Paper from '$lib/display/Paper.svelte';
	import Button from '$lib/ui/Button.svelte';
	import Badge from '$lib/ui/Badge.svelte';
	import Logo from '$lib/ui/Logo.svelte';
	import { themeState, setTheme, applyTheme, resetTheme, type ThemeConfig } from '$lib/index.js';

	const presets: Record<string, ThemeConfig> = {
		Forest: {
			colors: { primary: '#14532d', accent: '#bef264', tertiary: '#a7f3d0' },
			fontFamily: "Georgia, 'Times New Roman', serif"
		},
		Plum: {
			colors: { primary: '#3b0764', accent: '#f0abfc', tertiary: '#fbcfe8' }
		},
		Ember: {
			colors: { primary: '#7c2d12', accent: '#fdba74', tertiary: '#fde68a' },
			fontFamily: "'Courier New', monospace"
		},
		Slate: {
			colors: { primary: '#1e293b', accent: '#fbbf24', tertiary: '#7dd3fc' },
			// Different accent and links while dark mode is active
			dark: { colors: { accent: '#fde68a', tertiary: '#bae6fd', link: '#fde68a' } }
		}
	};

	let activePreset = $state<string | undefined>(undefined);

	function usePreset(name: string) {
		resetTheme();
		applyTheme(presets[name]);
		activePreset = name;
	}

	function useDefault() {
		resetTheme();
		activePreset = undefined;
	}
</script>

<div class="page-header">
	<h1>Theme State</h1>
	<p>Reactive theme management with light, dark, and system modes.</p>
</div>

<div class="vstack">
	<Paper title="Current Theme">
		<div class="demo-section">
			<p class="description">
				The <code>themeState</code> object provides reactive access to the current theme and dark mode
				state.
			</p>

			<div class="state-display">
				<div class="state-item">
					<span class="state-label">Current Theme:</span>
					<Badge
						variant={themeState.theme === 'dark'
							? 'primary'
							: themeState.theme === 'light'
								? 'accent'
								: 'secondary'}
					>
						{themeState.theme}
					</Badge>
				</div>
				<div class="state-item">
					<span class="state-label">Is Dark Mode:</span>
					<Badge variant={themeState.isDarkMode ? 'primary' : 'accent'}>
						{themeState.isDarkMode ? 'Yes' : 'No'}
					</Badge>
				</div>
			</div>

			<div class="button-row">
				<Button variant="secondary" onclick={() => setTheme('light')}>Light</Button>
				<Button variant="secondary" onclick={() => setTheme('dark')}>Dark</Button>
				<Button variant="secondary" onclick={() => setTheme('system')}>System</Button>
			</div>
		</div>

		<div class="code-section">
			<strong>Usage:</strong>
			<pre class="code-block">{`import { themeState, setTheme, getTheme } from '$lib/index.js';

// Reactive state (updates automatically)
themeState.theme      // 'light' | 'dark' | 'system'
themeState.isDarkMode // boolean

// Set theme
setTheme('dark');
setTheme('light');
setTheme('system');

// Get current theme (non-reactive)
const theme = getTheme();`}</pre>
		</div>
	</Paper>

	<Paper title="Branding">
		<div class="demo-section">
			<p class="description">
				Every component is styled through <code>--ui-*</code> tokens. Describe your brand once as a
				<code>ThemeConfig</code> and call <code>applyTheme()</code>; darker and lighter shades are
				derived for you. Add a <code>dark</code> block to override any value while dark mode is active
				(the Slate preset does this for its accent and links). Try a preset, then toggle the theme:
			</p>

			<div class="button-row">
				<Button variant={activePreset === undefined ? 'primary' : 'secondary'} onclick={useDefault}>
					Default
				</Button>
				{#each Object.keys(presets) as name}
					<Button
						variant={activePreset === name ? 'primary' : 'secondary'}
						onclick={() => usePreset(name)}
					>
						{name}
					</Button>
				{/each}
			</div>

			<div class="brand-preview">
				<Logo href="#" />
				<Button variant="primary">Primary</Button>
				<Button variant="accent">Accent</Button>
				<Button variant="tertiary">Tertiary</Button>
				<Button variant="primary-outline">Outline</Button>
				<Badge variant="accent">Badge</Badge>
				<a href="#branding">A link</a>
			</div>
		</div>

		<div class="code-section">
			<strong>Usage:</strong>
			<pre
				class="code-block">{`import { applyTheme, themeToCss } from '@placeholderco/placeholder-ui';
import logo from './logo.svg?raw';
import darkLogo from './logo-dark.svg?raw';

const theme = {
  colors: {
    primary: '#1e3a5f',   // dark brand colour
    accent: '#93c5fd',    // light brand colour
    tertiary: '#a5f3fc'   // supporting colour
  },
  fontFamily: "'Inter', system-ui, sans-serif",
  logo,
  dark: {                   // optional overrides while html.dark is active
    colors: { accent: '#bfdbfe', link: '#bfdbfe' },
    logo: darkLogo
  }
};

applyTheme(theme);          // at runtime: injects a style element with :root and :root.dark rules
themeToCss(theme);          // ":root { --ui-primary: ... }" for app.html (no flash)`}</pre>
		</div>
	</Paper>

	<Paper title="Theme Persistence">
		<div class="demo-section">
			<p class="description">
				The theme is automatically persisted to <code>localStorage</code> and restored on page load.
			</p>

			<div class="info-box">
				<p>
					When set to <strong>system</strong>, the theme follows the user's OS preference using
					<code>prefers-color-scheme</code>.
				</p>
				<p>
					The <code>.light</code> or <code>.dark</code> class is applied to the document root element.
				</p>
			</div>
		</div>

		<div class="code-section">
			<strong>CSS Usage:</strong>
			<pre class="code-block">{`/* Light mode styles */
.my-component {
  background: white;
  color: black;
}

/* Dark mode styles */
:global(.dark) .my-component {
  background: black;
  color: white;
}

/* Or use CSS variables */
.my-component {
  background: var(--paper-body-bg);
  color: var(--text-color);
}`}</pre>
		</div>
	</Paper>

	<Paper title="API Reference">
		<div class="demo-section">
			<table class="props-table">
				<thead>
					<tr>
						<th>Export</th>
						<th>Type</th>
						<th>Description</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td><code>themeState.theme</code></td>
						<td><code>'light' | 'dark' | 'system'</code></td>
						<td>Current theme setting (reactive)</td>
					</tr>
					<tr>
						<td><code>themeState.isDarkMode</code></td>
						<td><code>boolean</code></td>
						<td>Whether dark mode is active (reactive)</td>
					</tr>
					<tr>
						<td><code>setTheme(theme)</code></td>
						<td><code>(theme: Theme) => void</code></td>
						<td>Set the current theme</td>
					</tr>
					<tr>
						<td><code>getTheme()</code></td>
						<td><code>() => Theme</code></td>
						<td>Get current theme (non-reactive)</td>
					</tr>
					<tr>
						<td><code>loadTheme()</code></td>
						<td><code>() => void</code></td>
						<td>Load theme from localStorage</td>
					</tr>
					<tr>
						<td><code>applyTheme(config)</code></td>
						<td><code>(config: ThemeConfig) => void</code></td>
						<td>Set brand colours, font and logo at runtime</td>
					</tr>
					<tr>
						<td><code>themeToCss(config)</code></td>
						<td><code>(config: ThemeConfig) => string</code></td>
						<td>Same config as a CSS rule, for SSR / app.html</td>
					</tr>
					<tr>
						<td><code>resetTheme()</code></td>
						<td><code>() => void</code></td>
						<td>Remove applied brand overrides and logo</td>
					</tr>
					<tr>
						<td><code>setLogo(svg, darkSvg?)</code></td>
						<td><code>(svg?: string, darkSvg?: string) => void</code></td>
						<td
							>Register the SVG used by <code>&lt;Logo /&gt;</code>, optionally a different one for
							dark mode</td
						>
					</tr>
				</tbody>
			</table>
		</div>
	</Paper>
</div>

<style>
	.page-header {
		margin-bottom: 2rem;
	}

	.page-header h1 {
		margin: 0 0 0.5rem;
		font-size: 2rem;
		font-weight: 700;
		color: var(--text-color);
	}

	.page-header p {
		margin: 0;
		color: var(--text-muted);
		font-size: 1.125rem;
	}

	.vstack {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.demo-section {
		margin-bottom: 1.5rem;
	}

	.description {
		margin: 0 0 1rem;
		color: var(--text-color);
	}

	.state-display {
		display: flex;
		flex-wrap: wrap;
		gap: 1.5rem;
		margin-bottom: 1rem;
		padding: 1rem;
		background: rgba(var(--ui-primary-rgbc), 0.05);
		border-radius: 0.5rem;
	}

	:global(.dark) .state-display {
		background: rgba(var(--ui-accent-rgbc), 0.05);
	}

	.state-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.state-label {
		font-weight: 500;
		color: var(--text-color);
	}

	.button-row {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.brand-preview {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 0.75rem;
		margin-top: 1rem;
		padding: 1rem;
		border: 1px solid var(--border-color);
		border-radius: 0.5rem;
		background: var(--paper-body-bg);
	}

	.code-section {
		margin-top: 1.5rem;
		padding-top: 1.5rem;
		border-top: 1px solid var(--border-color);
	}

	.code-section strong {
		display: block;
		margin-bottom: 0.5rem;
		color: var(--text-color);
	}

	.code-block {
		background: rgba(var(--ui-primary-rgbc), 0.05);
		padding: 1rem;
		border-radius: 0.5rem;
		overflow-x: auto;
		font-size: 0.875rem;
		line-height: 1.5;
		margin: 0;
	}

	:global(.dark) .code-block {
		background: rgba(0, 0, 0, 0.3);
	}

	.info-box {
		padding: 1rem;
		background: rgba(var(--ui-primary-rgbc), 0.05);
		border-radius: 0.5rem;
		border-left: 3px solid var(--ui-accent);
	}

	:global(.dark) .info-box {
		background: rgba(var(--ui-accent-rgbc), 0.05);
		border-left-color: var(--ui-primary);
	}

	.info-box p {
		margin: 0.5rem 0;
		color: var(--text-color);
	}

	.info-box p:first-child {
		margin-top: 0;
	}

	.info-box p:last-child {
		margin-bottom: 0;
	}

	.props-table {
		width: 100%;
		border-collapse: collapse;
	}

	.props-table th,
	.props-table td {
		padding: 0.75rem;
		text-align: left;
		border-bottom: 1px solid var(--border-color);
	}

	.props-table th {
		font-weight: 600;
		color: var(--text-color);
		background: rgba(var(--ui-primary-rgbc), 0.03);
	}

	:global(.dark) .props-table th {
		background: rgba(var(--ui-accent-rgbc), 0.05);
	}

	.props-table td {
		color: var(--text-color);
	}

	.props-table code {
		background: rgba(var(--ui-primary-rgbc), 0.1);
		padding: 0.125rem 0.375rem;
		border-radius: 0.25rem;
		font-size: 0.875rem;
	}

	:global(.dark) .props-table code {
		background: rgba(var(--ui-accent-rgbc), 0.15);
	}
</style>
