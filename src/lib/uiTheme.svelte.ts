/**
 * Brand / theme configuration for PlaceholderUI.
 *
 * The library is styled entirely through `--ui-*` CSS custom properties (see
 * `app.css`). You can override those in your own stylesheet, or describe your
 * brand once as a {@link ThemeConfig} and let the library generate them:
 *
 * ```ts
 * import { applyTheme } from '@placeholderco/placeholder-ui';
 * import logo from './logo.svg?raw';
 *
 * applyTheme({
 *   colors: { primary: '#1e3a5f', accent: '#93c5fd', tertiary: '#a5f3fc' },
 *   fontFamily: "'Inter', system-ui, sans-serif",
 *   logo,
 *   // optional overrides used while the `.dark` class is on <html>
 *   dark: { colors: { accent: '#bfdbfe' } }
 * });
 * ```
 *
 * For server-side rendering (and to avoid a flash of the default palette) put
 * `themeToCss(config)` into a `<style>` tag in your `app.html` / root layout.
 */
import { themeState } from './theme.svelte.js';

/** Brand colors. Accepts `#rgb`, `#rrggbb` or `rgb(r, g, b)` strings. */
export interface ThemeColors {
	/** Primary fill color for solid controls and active backgrounds. */
	primary: string;
	/** Hover color for primary controls. Defaults to the accent text color. */
	primaryHoverColor?: string;
	/** Pressed color for primary controls. Darkened from `primary` when omitted. */
	primaryPressedColor?: string;
	/** Primary-colored text on page/paper surfaces and unfilled controls. Defaults to `primary`. */
	primaryTextColor?: string;
	/** Foreground on primary-filled controls, including hover/pressed fills. Defaults to white. */
	primaryContrastColor?: string;

	/** Accent fill color for solid controls and highlights. */
	accent: string;
	/** Hover color for accent controls. Defaults to `tertiary`. */
	accentHoverColor?: string;
	/** Pressed color for accent controls. Lightened from `tertiary` (or `accent`) when omitted. */
	accentPressedColor?: string;
	/** Accent-colored text on page/paper surfaces and unfilled controls. Darkened from `accent` by default. */
	accentTextColor?: string;
	/** Foreground on accent-filled controls, including hover/pressed fills. Defaults to `primary`. */
	accentContrastColor?: string;

	/** Tertiary fill color for solid controls. Defaults to `accent` when omitted. */
	tertiary?: string;
	/** Hover color for tertiary controls. Defaults to `accent`. */
	tertiaryHoverColor?: string;
	/** Pressed color for tertiary and white controls. Lightened from `tertiary` when omitted. */
	tertiaryPressedColor?: string;
	/** Tertiary-colored text on page/paper surfaces and unfilled controls. Darkened from `tertiary` by default. */
	tertiaryTextColor?: string;
	/** Foreground on tertiary-filled controls, including hover/pressed fills. Defaults to `primary`. */
	tertiaryContrastColor?: string;

	/** Keyboard focus ring color. Defaults to the accent text color. */
	focusColor?: string;
	/** Link color. Defaults to `tertiaryTextColor`. */
	link?: string;
	/** Link hover color. Defaults to `accentTextColor`. */
	linkHover?: string;
}

/**
 * Settings that can be given per color mode. Used as the base (light) config and,
 * with every field optional, as the `dark` override block.
 */
export interface ThemeModeConfig {
	/** Brand colors. In the `dark` block any subset may be given; shades are derived per color. */
	colors?: Partial<ThemeColors>;
	/**
	 * CSS `font-family` value applied to the whole UI, e.g. `"'Inter', system-ui, sans-serif"`.
	 * Loading the font itself (`@font-face` or a `<link>`) is up to the consuming app.
	 */
	fontFamily?: string;
	/** Raw SVG markup for the `Logo` component. Use `fill="currentColor"` so it follows the theme. */
	logo?: string;
	/**
	 * Any additional custom properties to set, e.g. `{ '--page-bg': '#fff' }`.
	 * Useful for the surface tokens that are not part of `ThemeColors`.
	 */
	variables?: Record<string, string>;
}

export interface ThemeConfig extends ThemeModeConfig {
	/** Brand colors for light mode (and dark mode unless overridden in `dark`). */
	colors?: ThemeColors;
	/**
	 * Overrides applied while dark mode is active (`.dark` on `<html>`). Anything not
	 * given here falls back to the light-mode value.
	 */
	dark?: ThemeModeConfig;
}

// ============================================
// Brand state (logo)
// ============================================

let lightLogo = $state<string | undefined>(undefined);
let darkLogo = $state<string | undefined>(undefined);

/** Reactive brand state consumed by components such as `Logo`. */
export const brandState = {
	/** Logo for the active color mode: the dark logo when set and dark mode is on, else the light one. */
	get logo() {
		return themeState.isDarkMode ? (darkLogo ?? lightLogo) : lightLogo;
	}
};

/**
 * Set (or clear) the logo used by the `Logo` component. Pass a second argument to
 * register a different logo for dark mode.
 */
export function setLogo(svg: string | undefined, darkSvg?: string) {
	lightLogo = svg;
	darkLogo = darkSvg;
}

// ============================================
// Color helpers
// ============================================

type Rgb = [number, number, number];

function parseColor(input: string): Rgb | undefined {
	const value = input.trim();

	const hex = value.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
	if (hex) {
		let h = hex[1];
		if (h.length === 3)
			h = h
				.split('')
				.map((c) => c + c)
				.join('');
		const n = parseInt(h, 16);
		return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
	}

	const rgb = value.match(/^rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)/i);
	if (rgb) return [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])];

	return undefined;
}

function toHex([r, g, b]: Rgb): string {
	return '#' + [r, g, b].map((c) => Math.round(clamp(c)).toString(16).padStart(2, '0')).join('');
}

function clamp(n: number) {
	return Math.min(255, Math.max(0, n));
}

/** Mix a color towards black (`amount` 0..1). */
function darken(rgb: Rgb, amount: number): Rgb {
	return rgb.map((c) => c * (1 - amount)) as Rgb;
}

/** Mix a color towards white (`amount` 0..1). */
function lighten(rgb: Rgb, amount: number): Rgb {
	return rgb.map((c) => c + (255 - c) * amount) as Rgb;
}

// ============================================
// Config -> CSS variables
// ============================================

/**
 * Build the `--ui-*` custom property map for one color mode. Only the groups whose
 * base color is present are emitted, so a partial `dark` block overrides just what
 * it names. Unknown color formats are passed through unchanged (their `-rgb`
 * variants are skipped).
 */
export function themeToVariables(config: ThemeModeConfig): Record<string, string> {
	const vars: Record<string, string> = {};
	const c = config.colors;

	if (c) {
		if (c.primary) {
			const primary = parseColor(c.primary);
			setColor(vars, 'primary', c.primary, primary);
			vars['--ui-primary-pressed-color'] = primary ? toHex(darken(primary, 0.35)) : c.primary;
			vars['--ui-primary-text-color'] = 'var(--ui-primary)';
			vars['--ui-primary-contrast-color'] = '#ffffff';
		}

		if (c.accent) {
			const accent = parseColor(c.accent);
			setColor(vars, 'accent', c.accent, accent);
			vars['--ui-accent-text-color'] = accent ? toHex(darken(accent, 0.5)) : c.accent;
			vars['--ui-accent-contrast-color'] = 'var(--ui-primary)';
		}

		const tertiarySource = c.tertiary ?? c.accent;
		if (tertiarySource) {
			const tertiary = parseColor(tertiarySource);
			setColor(vars, 'tertiary', tertiarySource, tertiary);
			vars['--ui-tertiary-text-color'] = tertiary ? toHex(darken(tertiary, 0.45)) : tertiarySource;
			vars['--ui-tertiary-contrast-color'] = 'var(--ui-primary)';
			const pressedColor = tertiary ? toHex(lighten(tertiary, 0.5)) : tertiarySource;
			vars['--ui-accent-pressed-color'] = pressedColor;
			vars['--ui-tertiary-pressed-color'] = pressedColor;
		}

		// Explicit role overrides work independently, including in partial dark-mode configs.
		// Hover defaults live in app.css so they follow the current palette without
		// coupling text, borders, links or focus rings to a custom hover color.
		const overrides = {
			primaryHoverColor: '--ui-primary-hover-color',
			primaryPressedColor: '--ui-primary-pressed-color',
			primaryTextColor: '--ui-primary-text-color',
			primaryContrastColor: '--ui-primary-contrast-color',
			accentHoverColor: '--ui-accent-hover-color',
			accentPressedColor: '--ui-accent-pressed-color',
			accentTextColor: '--ui-accent-text-color',
			accentContrastColor: '--ui-accent-contrast-color',
			tertiaryHoverColor: '--ui-tertiary-hover-color',
			tertiaryPressedColor: '--ui-tertiary-pressed-color',
			tertiaryTextColor: '--ui-tertiary-text-color',
			tertiaryContrastColor: '--ui-tertiary-contrast-color',
			focusColor: '--ui-focus-color',
			link: '--ui-link-color',
			linkHover: '--ui-link-hover-color'
		} as const;
		for (const key of Object.keys(overrides) as (keyof typeof overrides)[]) {
			if (c[key]) vars[overrides[key]] = c[key];
		}
	}

	if (config.fontFamily) vars['--ui-font-family'] = config.fontFamily;
	if (config.variables) Object.assign(vars, config.variables);

	return vars;
}

function setColor(vars: Record<string, string>, name: string, raw: string, rgb: Rgb | undefined) {
	if (rgb) {
		vars[`--ui-${name}-rgb`] = rgb.join(' ');
		vars[`--ui-${name}-rgbc`] = rgb.join(', ');
		vars[`--ui-${name}`] = `rgb(var(--ui-${name}-rgb))`;
	} else {
		vars[`--ui-${name}`] = raw;
	}
}

function toRule(selector: string, vars: Record<string, string>): string {
	const body = Object.entries(vars)
		.map(([k, v]) => `\t${k}: ${v};`)
		.join('\n');
	return `${selector} {\n${body}\n}`;
}

/** Selector for the dark-mode block: `.dark` sits on `<html>`, so root selectors get it appended. */
function darkSelector(selector: string): string {
	return /^(html|:root)/.test(selector) ? `${selector}.dark` : `.dark ${selector}`;
}

/**
 * Render a theme config as CSS: a light-mode rule on `selector` (default `:root`)
 * and, when `dark` overrides are given, a second rule scoped to the `.dark` class.
 * Put the result in a `<style>` tag in `app.html` so the brand is present before
 * JavaScript runs.
 */
export function themeToCss(config: ThemeConfig, selector = ':root'): string {
	const rules = [toRule(selector, themeToVariables(config))];

	if (config.dark) {
		const darkVars = themeToVariables(config.dark);
		if (Object.keys(darkVars).length) rules.push(toRule(darkSelector(selector), darkVars));
	}

	return rules.join('\n\n');
}

// ============================================
// Runtime application
// ============================================

const STYLE_ID = 'placeholderui-theme';

/**
 * Apply a theme config at runtime. Injects (or replaces) a `<style>` element in
 * `<head>` containing the light and dark rules, and registers the logo(s).
 * Safe to call during SSR (the style injection is skipped).
 */
export function applyTheme(config: ThemeConfig) {
	if (config.logo !== undefined || config.dark?.logo !== undefined) {
		setLogo(config.logo, config.dark?.logo);
	}

	if (typeof document === 'undefined') return;

	let style = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
	if (!style) {
		style = document.createElement('style');
		style.id = STYLE_ID;
		document.head.appendChild(style);
	}
	style.textContent = themeToCss(config);
}

/** Remove the theme rules injected by `applyTheme` and clear the logos. */
export function resetTheme() {
	setLogo(undefined);

	if (typeof document === 'undefined') return;
	document.getElementById(STYLE_ID)?.remove();
}
