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

/** Brand colours. Accepts `#rgb`, `#rrggbb` or `rgb(r, g, b)` strings. */
export interface ThemeColors {
	/** Dark brand colour. Used for solid buttons, headings and active states. */
	primary: string;
	/** Darker shade of `primary` for pressed states. Derived from `primary` when omitted. */
	primaryDark?: string;
	/** Text colour on top of `primary`. Defaults to white. */
	primaryContrast?: string;

	/** Light brand colour. Used for highlights, hovers and as the dark-mode accent. */
	accent: string;
	/** Darker shade of `accent`, used for hover text on light surfaces. Derived when omitted. */
	accentDark?: string;
	/** Text colour on top of `accent`. Defaults to `primary`. */
	accentContrast?: string;

	/** Light supporting colour. Defaults to `accent` when omitted. */
	tertiary?: string;
	/** Darker shade of `tertiary`, used for links and subtle text. Derived when omitted. */
	tertiaryDark?: string;
	/** Lighter shade of `tertiary`, used for pressed states on light buttons. Derived when omitted. */
	tertiaryLight?: string;

	/** Link colour. Defaults to `tertiaryDark`. */
	link?: string;
	/** Link hover colour. Defaults to `accentDark`. */
	linkHover?: string;
}

/**
 * Settings that can be given per colour mode. Used as the base (light) config and,
 * with every field optional, as the `dark` override block.
 */
export interface ThemeModeConfig {
	/** Brand colours. In the `dark` block any subset may be given; shades are derived per colour. */
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
	/** Brand colours for light mode (and dark mode unless overridden in `dark`). */
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
	/** Logo for the active colour mode: the dark logo when set and dark mode is on, else the light one. */
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
// Colour helpers
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

/** Mix a colour towards black (`amount` 0..1). */
function darken(rgb: Rgb, amount: number): Rgb {
	return rgb.map((c) => c * (1 - amount)) as Rgb;
}

/** Mix a colour towards white (`amount` 0..1). */
function lighten(rgb: Rgb, amount: number): Rgb {
	return rgb.map((c) => c + (255 - c) * amount) as Rgb;
}

// ============================================
// Config -> CSS variables
// ============================================

/**
 * Build the `--ui-*` custom property map for one colour mode. Only the groups whose
 * base colour is present are emitted, so a partial `dark` block overrides just what
 * it names. Unknown colour formats are passed through unchanged (their `-rgb`
 * variants are skipped).
 */
export function themeToVariables(config: ThemeModeConfig): Record<string, string> {
	const vars: Record<string, string> = {};
	const c = config.colors;

	if (c) {
		if (c.primary) {
			const primary = parseColor(c.primary);
			setColor(vars, 'primary', c.primary, primary);
			vars['--ui-primary-dark'] =
				c.primaryDark ?? (primary ? toHex(darken(primary, 0.35)) : c.primary);
			vars['--ui-primary-contrast'] = c.primaryContrast ?? '#ffffff';
		} else {
			if (c.primaryDark) vars['--ui-primary-dark'] = c.primaryDark;
			if (c.primaryContrast) vars['--ui-primary-contrast'] = c.primaryContrast;
		}

		if (c.accent) {
			const accent = parseColor(c.accent);
			setColor(vars, 'accent', c.accent, accent);
			vars['--ui-accent-dark'] = c.accentDark ?? (accent ? toHex(darken(accent, 0.5)) : c.accent);
			vars['--ui-accent-contrast'] = c.accentContrast ?? 'var(--ui-primary)';
		} else {
			if (c.accentDark) vars['--ui-accent-dark'] = c.accentDark;
			if (c.accentContrast) vars['--ui-accent-contrast'] = c.accentContrast;
		}

		const tertiarySource = c.tertiary ?? c.accent;
		if (tertiarySource) {
			const tertiary = parseColor(tertiarySource);
			setColor(vars, 'tertiary', tertiarySource, tertiary);
			setTertiaryDark(
				vars,
				c.tertiaryDark ?? (tertiary ? toHex(darken(tertiary, 0.45)) : tertiarySource)
			);
			vars['--ui-tertiary-light'] =
				c.tertiaryLight ?? (tertiary ? toHex(lighten(tertiary, 0.5)) : tertiarySource);
		} else {
			if (c.tertiaryDark) setTertiaryDark(vars, c.tertiaryDark);
			if (c.tertiaryLight) vars['--ui-tertiary-light'] = c.tertiaryLight;
		}

		if (c.link) vars['--ui-link-color'] = c.link;
		if (c.linkHover) vars['--ui-link-hover-color'] = c.linkHover;
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

function setTertiaryDark(vars: Record<string, string>, value: string) {
	const rgb = parseColor(value);
	if (rgb) {
		vars['--ui-tertiary-dark-rgbc'] = rgb.join(', ');
		vars['--ui-tertiary-dark'] = 'rgb(var(--ui-tertiary-dark-rgbc))';
	} else {
		vars['--ui-tertiary-dark'] = value;
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
