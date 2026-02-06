<script lang="ts">
	import {
		ThemeSwitcher,
		Paper,
		themeState,
		viewportState,
		breakpoints,
	} from "$lib/index.js";
</script>

<h1>Theme</h1>
<p>
	The theme system provides dark/light mode support, responsive breakpoints,
	and a three-tier CSS variable architecture.
</p>

<Paper title="Theme Switcher">
	<p style="margin-bottom: 0.75rem;">
		Click the toggle below to switch between light, dark, and system themes.
	</p>
	<div class="demo-row">
		<ThemeSwitcher />
	</div>
	<div class="value-display">
		Current theme: "{themeState.current}" | Resolved: {themeState.isDarkMode
			? "dark"
			: "light"}
	</div>
</Paper>

<Paper title="Theme API">
	<pre
		class="code-block">{`import { themeState, setTheme, getTheme, loadTheme } from '$lib/index.js';

// Read current theme
themeState.current   // 'light' | 'dark' | 'system'
themeState.isDarkMode // true | false (resolved value)

// Set theme
setTheme('dark');    // 'light' | 'dark' | 'system'

// Get theme (non-reactive)
getTheme();          // returns current theme string

// Load theme from localStorage (called on app init)
loadTheme();`}</pre>
</Paper>

<Paper title="Viewport / Responsive State">
	<p style="margin-bottom: 0.75rem;">
		The theme module exports reactive viewport state for responsive layouts.
	</p>
	<div class="info-grid">
		<div class="info-item">
			<span class="info-label">Window Width</span>
			<span class="info-value">{viewportState.width}px</span>
		</div>
		<div class="info-item">
			<span class="info-label">Window Height</span>
			<span class="info-value">{viewportState.height}px</span>
		</div>
		<div class="info-item">
			<span class="info-label">isMobile (&lt;768)</span>
			<span class="info-value">{viewportState.isMobile}</span>
		</div>
		<div class="info-item">
			<span class="info-label">isTablet (768-1023)</span>
			<span class="info-value">{viewportState.isTablet}</span>
		</div>
		<div class="info-item">
			<span class="info-label">isDesktop (1024+)</span>
			<span class="info-value">{viewportState.isDesktop}</span>
		</div>
	</div>
	<pre
		class="code-block"
		style="margin-top: 1rem;">{`import { viewportState, breakpoints } from '$lib/index.js';

// Built-in breakpoints
viewportState.isMobile    // < 768px
viewportState.isTablet    // 768px - 1023px
viewportState.isDesktop   // >= 1024px
viewportState.isSmall     // < 640px
viewportState.isLarge     // >= 1024px
viewportState.isExtraLarge // >= 1280px
viewportState.isUltrawide // >= 2100px

// Custom breakpoints
viewportState.isBelow(900) // true if window < 900px
viewportState.isAbove(1440) // true if window >= 1440px

// Breakpoint values
breakpoints.sm    // 640
breakpoints.md    // 768
breakpoints.lg    // 1024
breakpoints.xl    // 1280
breakpoints.xxl   // 1536
breakpoints.ultrawide // 2100`}</pre>
</Paper>

<Paper title="CSS Variables - Three-Tier Token System">
	<p style="margin-bottom: 0.75rem;">
		All theming is done via CSS custom properties following a three-tier
		architecture. Variables use the <code>--pui-</code> prefix.
	</p>

	<h3 style="margin-bottom: 0.5rem;">1. Primitives (tokens.css)</h3>
	<p style="font-size: 0.875rem; margin-bottom: 0.5rem;">
		Raw design values -- colors, spacing, typography, shadows.
	</p>
	<pre class="code-block">{`--pui-color-primary: #1a1a2e;
--pui-color-secondary: #a8d8a8;
--pui-font-size-sm: 0.875rem;
--pui-spacing-4: 1rem;
--pui-radius-md: 0.5rem;
--pui-shadow-sm: 0 1px 2px rgba(0,0,0,0.05);`}</pre>

	<h3 style="margin: 1.5rem 0 0.5rem;">2. Semantic (semantic.css)</h3>
	<p style="font-size: 0.875rem; margin-bottom: 0.5rem;">
		Contextual tokens that reference primitives, giving them semantic
		meaning.
	</p>
	<pre class="code-block">{`--pui-text-primary: var(--pui-color-gray-900);
--pui-text-muted: var(--pui-color-gray-500);
--pui-bg-hover: var(--pui-color-gray-100);
--pui-border-default: var(--pui-color-gray-200);`}</pre>

	<h3 style="margin: 1.5rem 0 0.5rem;">3. Component (components.css)</h3>
	<p style="font-size: 0.875rem; margin-bottom: 0.5rem;">
		Component-specific tokens for fine-grained control.
	</p>
	<pre class="code-block">{`--pui-paper-body-bg: var(--pui-color-white);
--pui-paper-title-bg: var(--pui-color-gray-50);
--pui-input-bg: var(--pui-color-white);
--pui-input-border: var(--pui-border-default);`}</pre>
</Paper>

<Paper title="Dark Mode">
	<p style="margin-bottom: 0.75rem;">
		Dark mode is activated by adding the <code>.dark</code> class to the
		document root element. The <code>setTheme()</code> function handles this
		automatically. Dark mode overrides are defined in <code>dark.css</code> and
		re-map semantic tokens to darker values.
	</p>
	<pre class="code-block">{`:root.dark {
  --pui-text-primary: var(--pui-color-gray-100);
  --pui-bg-hover: var(--pui-color-dark-300);
  --pui-border-default: var(--pui-color-dark-border);
  --pui-paper-body-bg: var(--pui-color-dark-100);
}`}</pre>
</Paper>

<Paper title="Breakpoints">
	<table class="props-table">
		<thead>
			<tr>
				<th>Name</th>
				<th>Value</th>
				<th>Description</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>sm</code></td>
				<td><code>{breakpoints.sm}px</code></td>
				<td>Small devices (phones)</td>
			</tr>
			<tr>
				<td><code>md</code></td>
				<td><code>{breakpoints.md}px</code></td>
				<td>Medium devices (tablets)</td>
			</tr>
			<tr>
				<td><code>lg</code></td>
				<td><code>{breakpoints.lg}px</code></td>
				<td>Large devices (desktops)</td>
			</tr>
			<tr>
				<td><code>xl</code></td>
				<td><code>{breakpoints.xl}px</code></td>
				<td>Extra large devices</td>
			</tr>
			<tr>
				<td><code>xxl</code></td>
				<td><code>{breakpoints.xxl}px</code></td>
				<td>Wide screens</td>
			</tr>
			<tr>
				<td><code>ultrawide</code></td>
				<td><code>{breakpoints.ultrawide}px</code></td>
				<td>Ultra-wide monitors</td>
			</tr>
		</tbody>
	</table>
</Paper>

<style>
	h1 {
		margin-bottom: 0.5rem;
	}
	p {
		color: var(--pui-color-text-secondary);
		margin-bottom: 1.5rem;
	}
	.demo-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		align-items: center;
	}
	.value-display {
		font-size: 0.875rem;
		color: var(--pui-color-text-muted);
		font-family: monospace;
		margin-top: 0.5rem;
	}
	.props-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.875rem;
	}
	.props-table th,
	.props-table td {
		text-align: left;
		padding: 0.75rem;
		border-bottom: 1px solid var(--pui-color-border);
	}
	.props-table th {
		font-weight: 600;
		background: var(--pui-color-bg-secondary);
	}
	.props-table code {
		background: var(--pui-color-bg-tertiary);
		padding: 0.125rem 0.375rem;
		border-radius: 4px;
		font-size: 0.8125rem;
	}

	.code-block {
		background: var(--pui-color-bg-tertiary, #f5f5f5);
		border: 1px solid var(--pui-color-border);
		border-radius: 0.375rem;
		padding: 1rem;
		font-size: 0.8125rem;
		font-family: monospace;
		overflow-x: auto;
		white-space: pre;
		margin: 0;
		color: var(--pui-text-primary);
	}

	.info-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 0.75rem;
	}

	.info-item {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		padding: 0.75rem;
		border: 1px solid var(--pui-color-border);
		border-radius: 0.375rem;
	}

	.info-label {
		font-size: 0.75rem;
		color: var(--pui-text-muted);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.info-value {
		font-size: 1rem;
		font-weight: 600;
		font-family: monospace;
		color: var(--pui-text-primary);
	}
</style>
