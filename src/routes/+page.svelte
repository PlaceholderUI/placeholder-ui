<script lang="ts">
	import Paper from '$lib/display/Paper.svelte';
	import Button from '$lib/ui/Button.svelte';
	import Badge from '$lib/ui/Badge.svelte';
	import Logo from '$lib/ui/Logo.svelte';
	import { themeState, setTheme, applyTheme, resetTheme, type ThemeConfig } from '$lib/index.js';

	const colorRoles = ['primary', 'accent', 'tertiary'] as const;

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
		},
		'Text roles': {
			colors: {
				primary: '#1e3a5f',
				primaryHoverColor: '#334155',
				primaryTextColor: '#9f1239',
				primaryContrastColor: '#fef08a',
				accent: '#93c5fd',
				accentTextColor: '#075985',
				accentContrastColor: '#4c1d95',
				tertiary: '#a5f3fc',
				tertiaryTextColor: '#115e59',
				tertiaryContrastColor: '#831843'
			},
			dark: {
				colors: {
					primaryTextColor: '#fda4af',
					accentTextColor: '#7dd3fc',
					tertiaryTextColor: '#5eead4'
				}
			}
		},
		'Custom hovers': {
			colors: {
				primary: '#1e3a5f',
				accent: '#93c5fd',
				tertiary: '#a5f3fc',
				primaryHoverColor: '#7c3aed',
				accentHoverColor: '#fde68a',
				tertiaryHoverColor: '#fbcfe8'
			},
			dark: {
				colors: {
					primaryHoverColor: '#6d28d9',
					accentHoverColor: '#fcd34d',
					tertiaryHoverColor: '#f9a8d4'
				}
			}
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
			<p class="description">
				The Custom hovers preset demonstrates separate hover colors for primary, accent and tertiary
				controls, with dark-mode overrides. Pressed states, readable text, links and keyboard focus
				remain controlled by their own color settings.
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
				<Button variant="tertiary-outline">Tertiary outline</Button>
				<Button variant="tertiary-subtle">Tertiary subtle</Button>
				<Button variant="primary-outline">Outline</Button>
				<Badge variant="accent">Badge</Badge>
				<a href="#branding">A link</a>
			</div>

			<p class="description text-role-description">
				Each color has two text roles: <code>TextColor</code> styles colored text and outline
				borders on a page or paper surface; <code>ContrastColor</code> styles text and icons on that color's
				solid fill, including its hover and pressed fills. Try the Text roles preset to change them independently.
			</p>
			<div class="text-role-preview">
				{#each colorRoles as role}
					<div class="text-role-row" data-color-role={role}>
						<div class="text-role-sample">
							<code>{role}TextColor</code>
							<span style:color={`var(--ui-${role}-text-color)`}>Text on paper</span>
							<Button variant={`${role}-outline`}>Outline</Button>
						</div>
						<div class="text-role-sample">
							<code>{role}ContrastColor</code>
							<Button variant={role}>Text on {role} fill</Button>
							<Badge variant={role}>Badge on {role} fill</Badge>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<div class="code-section">
			<strong>Usage:</strong>
			<p class="description">
				The complete configuration below shows every brand color and global theme variable. Hover,
				pressed, text, focus and contrast colors are independent and optional. Use <code
					>variables</code
				>
				for surfaces, inputs and layout. The <code>dark</code> block accepts the same options, all optional.
				Load any custom font separately.
			</p>
			<pre
				class="code-block">{`import { applyTheme, themeToCss, type ThemeConfig } from '@placeholderco/placeholder-ui';
import logo from './logo.svg?raw';
import darkLogo from './logo-dark.svg?raw';

const theme = {
  colors: {
    primary: '#1e3a5f',                     // --ui-primary: solid fills
    primaryHoverColor: '#1d4ed8',           // --ui-primary-hover-color
    primaryPressedColor: '#12253d',         // --ui-primary-pressed-color
    primaryTextColor: '#1e3a5f',            // --ui-primary-text-color: on page/paper
    primaryContrastColor: '#ffffff',       // --ui-primary-contrast-color: on primary fills

    accent: '#93c5fd',                      // --ui-accent: solid fills
    accentHoverColor: '#a5f3fc',            // --ui-accent-hover-color
    accentPressedColor: '#cffafe',          // --ui-accent-pressed-color
    accentTextColor: '#1d4ed8',             // --ui-accent-text-color: on page/paper
    accentContrastColor: '#1e3a5f',         // --ui-accent-contrast-color: on accent fills

    tertiary: '#a5f3fc',                    // --ui-tertiary: solid fills
    tertiaryHoverColor: '#93c5fd',          // --ui-tertiary-hover-color
    tertiaryPressedColor: '#cffafe',        // --ui-tertiary-pressed-color
    tertiaryTextColor: '#0e7490',           // --ui-tertiary-text-color: on page/paper
    tertiaryContrastColor: '#1e3a5f',       // --ui-tertiary-contrast-color: on tertiary fills

    focusColor: '#1d4ed8',              // --ui-focus-color: keyboard focus rings
    link: 'var(--ui-tertiary-text-color)',   // --ui-link-color
    linkHover: 'var(--ui-accent-text-color)' // --ui-link-hover-color
  },

  // RGB channels are generated automatically from the base colors above:
  // --ui-primary-rgb, --ui-primary-rgbc
  // --ui-accent-rgb, --ui-accent-rgbc
  // --ui-tertiary-rgb, --ui-tertiary-rgbc
  // Use -rgb with rgb(var(...)); use -rgbc with rgba(var(...), alpha).
  fontFamily: "'Inter', system-ui, sans-serif", // --ui-font-family
  logo, // raw SVG; use currentColor to follow the theme

  variables: {
    // Surfaces and text
    '--off-white': 'rgb(221, 221, 221)',
    '--page-bg': '#f1f3f5',
    '--text-color': '#000000',
    '--border-color': 'rgb(226, 232, 240)',

    // Adaptive accent
    '--accent-color-rgb': 'var(--ui-primary-rgbc)',
    '--accent-color': 'rgb(var(--accent-color-rgb))',
    '--accent-text-color-rgb': '221, 221, 221',
    '--accent-text-color': 'rgb(221, 221, 221)',

    // Paper
    '--paper-title-bg': 'rgb(252, 252, 252)',
    '--paper-title-border': 'rgb(229, 231, 235)',
    '--paper-body-bg': 'rgb(255, 255, 255)',

    // Danger states
    '--danger-bg': '#e03131',
    '--danger-bg-hover': '#c92a2a',
    '--danger-text': '#ff5e5e',
    '--danger-bg-subtle': 'rgba(250, 82, 82, 0.12)',

    // Inputs
    '--input-bg': '#ffffff',
    '--input-bg-color': '#ffffff',
    '--placeholder-color': 'rgb(161 161 170)',
    '--label-color': '#6c757d',

    // Layout (use 68px for the site Navbar variant)
    '--header-height': '46px',
    '--page-content-height': 'calc(100vh - var(--header-height))',

    // Scrollbars
    '--scrollbar-track': '#ffffff',
    '--scrollbar-thumb': 'var(--ui-primary)'
  },

  dark: { // optional overrides while html.dark is active
    colors: {
      accent: '#bfdbfe',
      accentHoverColor: '#dbeafe',
      focusColor: '#bfdbfe',
      link: '#bfdbfe'
    },
    fontFamily: "'Inter', system-ui, sans-serif",
    logo: darkLogo,
    // Include dark values for the light-mode surface overrides above.
    variables: {
      '--page-bg': 'rgb(36, 37, 40)',
      '--text-color': 'rgb(221, 221, 221)',
      '--border-color': 'rgb(55, 58, 64)',
      '--accent-color-rgb': 'var(--ui-accent-rgbc)',
      '--accent-text-color-rgb': '221, 221, 221',
      '--accent-text-color': '#000000',
      '--paper-title-bg': 'rgb(18, 18, 18)',
      '--paper-title-border': 'rgb(46, 46, 46)',
      '--paper-body-bg': 'rgb(25, 26, 28)',
      '--danger-text': '#ffa8a8',
      '--danger-bg-subtle': 'rgba(250, 82, 82, 0.2)',
      '--input-bg': 'rgb(33, 37, 41)',
      '--input-bg-color': 'rgb(33, 37, 41)',
      '--placeholder-color': 'rgb(115 115 115)',
      '--label-color': 'rgb(141, 144, 149)',
      '--scrollbar-track': '#111111'
    }
  }
} satisfies ThemeConfig;

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
						<td>Set brand colors, font and logo at runtime</td>
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

	.text-role-description {
		margin-top: 1.5rem;
	}

	.text-role-preview {
		border: 1px solid var(--border-color);
		border-radius: 0.5rem;
	}

	.text-role-row {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 18rem), 1fr));
		gap: 1.5rem;
		padding: 1rem;
	}

	.text-role-row + .text-role-row {
		border-top: 1px solid var(--border-color);
	}

	.text-role-sample {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.75rem;
	}

	.text-role-sample code {
		flex-basis: 100%;
		font-size: 0.875rem;
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
