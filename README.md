# PlaceholderUI

A Svelte 5 component library that you re-brand with a single config object.
Forms, overlays, layout, data display, a TipTap rich-text editor and a
CodeMirror code editor, all styled through one set of `--ui-*` CSS tokens.

- Svelte 5 runes, TypeScript, typed props on every component
- Light / dark / system theme with persistence
- Neutral default palette; swap in your own colours, font and logo in one call
- 150+ icons exported as raw SVG strings

## Install

```bash
pnpm add @placeholderco/placeholder-ui
```

Peer dependency: `svelte ^5`.

## Quick start

Wrap your app in `AppShell` (it loads the base stylesheet), then use components:

```svelte
<script lang="ts">
	import { AppShell, Navbar, Button } from '@placeholderco/placeholder-ui';
</script>

<AppShell>
	<Navbar appNav={{ href: '/', text: 'My App' }} />
	<Button variant="primary">Save</Button>
</AppShell>
```

Or skip `AppShell` and import the token stylesheet yourself:

```ts
import '@placeholderco/placeholder-ui/app.css';
```

## Branding

Everything colour- and font-related resolves to `--ui-*` custom properties, so
there are two ways to brand the library.

### 1. A config object (recommended)

```ts
// src/routes/+layout.svelte (or any startup code)
import { applyTheme } from '@placeholderco/placeholder-ui';
import logo from '$lib/logo.svg?raw';

applyTheme({
	colors: {
		primary: '#1e3a5f', // dark brand colour: solid buttons, headings
		accent: '#93c5fd', // light brand colour: highlights, dark-mode accent
		tertiary: '#a5f3fc' // supporting color: links use its readable text color
	},
	fontFamily: "'Inter', system-ui, sans-serif",
	logo // raw SVG, rendered by <Logo />
});
```

Each brand color has independent `*HoverColor` and `*PressedColor` settings:
`primaryHoverColor`, `accentHoverColor`, `tertiaryHoverColor`,
`primaryPressedColor`, `accentPressedColor` and `tertiaryPressedColor`.
They are shared by solid, outline and subtle controls; subtle variants use
translucent hover fills where appropriate.

All three colors have the same two text roles:

| Setting | Used for |
| --- | --- |
| `primaryTextColor`, `accentTextColor`, `tertiaryTextColor` | Colored text and outline borders on page/paper surfaces. |
| `primaryContrastColor`, `accentContrastColor`, `tertiaryContrastColor` | Text and icons on the matching solid fill, including hover and pressed fills. |

For example, `primaryTextColor` styles a primary outline button at rest, while
`primaryContrastColor` styles the label on a filled primary button.
`focusColor`, `link` and `linkHover` control keyboard focus rings and links
independently. Changing a hover color does not change these other roles.

All role overrides are optional. By default, primary hover uses the accent text
color, accent hover uses tertiary, and tertiary hover uses accent. Primary pressed
is darkened from its base color. Primary text defaults to primary; accent and
tertiary text colors are darkened from their base colors. Accent and tertiary
pressed colors are lightened from tertiary (or accent when tertiary is omitted).
Primary contrast defaults to white; accent and tertiary contrast default to primary.

For existing configs, replace `primaryDark` with `primaryPressedColor`,
`accentDark` with `accentTextColor`, and `tertiaryDark` with `tertiaryTextColor`.
Replace `tertiaryLight` with both `accentPressedColor` and `tertiaryPressedColor`
to preserve both sets of pressed states. Set the hover colors separately when
customizing interactions. Rename `primaryContrast` and `accentContrast` to
`primaryContrastColor` and `accentContrastColor`. Their CSS tokens also gain the
`-color` suffix. CSS overrides use the corresponding kebab-case names,
such as `--ui-primary-hover-color` and `--ui-tertiary-text-color`.

### Light and dark values

Everything in the config is the light-mode value and also applies in dark mode.
To change any of it while dark mode is active, add a `dark` block with the same
shape. Only what you name is overridden; shades are derived per colour.

```ts
applyTheme({
	colors: { primary: '#1e293b', accent: '#fbbf24', tertiary: '#7dd3fc' },
	logo,
	dark: {
		colors: { accent: '#fde68a', link: '#fde68a' },
		fontFamily: "'Inter', system-ui, sans-serif", // optional
		logo: darkLogo // optional
	}
});
```

`applyTheme` injects one `<style>` element with a `:root` rule and a
`:root.dark` rule, so values switch with the existing `.dark` class.

To avoid a flash of the default palette on first paint, render the same config
as CSS on the server:

```ts
import { themeToCss } from '@placeholderco/placeholder-ui';
const css = themeToCss(myTheme); // ":root { ... }\n:root.dark { ... }"
```

and place it in a `<style>` tag in `app.html` or your root layout head.

### 2. Plain CSS

Override the tokens in any stylesheet loaded after the library:

```css
:root {
	--ui-primary-rgb: 30 58 95;
	--ui-primary-rgbc: 30, 58, 95;
	--ui-primary: rgb(var(--ui-primary-rgb));
	--ui-primary-hover-color: #1d4ed8;
	--ui-primary-pressed-color: #12253d;
	--ui-primary-text-color: #1e3a5f;
	--ui-primary-contrast-color: #ffffff;
	--ui-accent-rgb: 147 197 253;
	--ui-accent-rgbc: 147, 197, 253;
	--ui-accent: rgb(var(--ui-accent-rgb));
	--ui-accent-hover-color: #a5f3fc;
	--ui-accent-pressed-color: #cffafe;
	--ui-accent-text-color: #1d4ed8;
	--ui-accent-contrast-color: #1e3a5f;
	--ui-tertiary: #a5f3fc;
	--ui-tertiary-hover-color: #93c5fd;
	--ui-tertiary-pressed-color: #cffafe;
	--ui-tertiary-text-color: #0e7490;
	--ui-tertiary-contrast-color: #1e3a5f;
	--ui-focus-color: #1d4ed8;
	--ui-font-family: 'Inter', system-ui, sans-serif;
}
```

The full token list, with comments on each role, is at the top of
[src/lib/app.css](src/lib/app.css).

### Color roles

Keep these relationships when choosing colours, because components assume them:

| Token           | Role                                                         |
| --------------- | ------------------------------------------------------------ |
| `--ui-primary`  | Dark by default. Solid buttons and active backgrounds.    |
| `--ui-accent`   | Light. Hovers, highlights, the accent in dark mode.          |
| `--ui-tertiary` | Light. Supporting fills; its text color is used for links |

### Fonts

The library never bundles a font. Set `--ui-font-family` (or `fontFamily` in
the config) and load the font yourself with `@font-face` or a `<link>`.

### Logo

`<Logo />` renders, in order of preference: its `svg` prop, the logo registered
via `applyTheme({ logo })` / `setLogo()`, or a generic placeholder. Use
`fill="currentColor"` in your SVG so it follows the theme, or register a separate
dark-mode logo with `dark.logo` / `setLogo(light, dark)`.

## Variants

Button, Badge, ActionIcon, Dropdown, Accordion and ProgressBar share colour
variants named after the tokens: `primary`, `accent`, `tertiary`, plus
`-outline` and `-subtle` forms, and the neutral `secondary`, `white`, `danger`
and `auto-*` variants.

The additional coloured buttons use `tertiary`, `tertiary-outline` and
`tertiary-subtle`, configured through `colors.tertiary` and the existing
`--ui-tertiary*` tokens. The `secondary`, `secondary-subtle` and
`secondary-selected` variants retain their original neutral styles; existing
apps do not need to rename them. Existing tertiary colours and button styles
are preserved, with outline support added to the family.

## Theme (light / dark)

```ts
import { themeState, setTheme } from '@placeholderco/placeholder-ui';

setTheme('dark'); // 'light' | 'dark' | 'system'
themeState.isDarkMode; // reactive boolean
```

The `.light` / `.dark` class is applied to `<html>`. In your own components use
`:global(.dark) .my-class { ... }` or the surface tokens (`--page-bg`,
`--paper-body-bg`, `--text-color`, `--border-color`, ...).

## Development

```bash
pnpm install
pnpm run dev      # showcase app at http://localhost:5173
pnpm run check    # svelte-check
pnpm run build    # library + showcase
pnpm run format
```

`src/lib` is the published library; `src/routes` is the showcase. Every
component has a demo page under `src/routes/components/<name>`.

## License

[MIT](LICENSE)
