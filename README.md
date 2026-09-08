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
		tertiary: '#a5f3fc' // supporting colour: links use its dark shade
	},
	fontFamily: "'Inter', system-ui, sans-serif",
	logo // raw SVG, rendered by <Logo />
});
```

Darker and lighter shades are derived automatically. Set `primaryDark`,
`accentDark`, `tertiaryDark`, `tertiaryLight`, `link`, `linkHover` and the
`*Contrast` text colours explicitly when you want full control.

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
	--ui-primary-dark: #12253d;
	--ui-accent-rgb: 147 197 253;
	--ui-accent-rgbc: 147, 197, 253;
	--ui-accent: rgb(var(--ui-accent-rgb));
	--ui-accent-dark: #1d4ed8;
	--ui-tertiary: #a5f3fc;
	--ui-tertiary-dark: #0e7490;
	--ui-font-family: 'Inter', system-ui, sans-serif;
}
```

The full token list, with comments on each role, is at the top of
[src/lib/app.css](src/lib/app.css).

### Colour roles

Keep these relationships when choosing colours, because components assume them:

| Token           | Role                                                         |
| --------------- | ------------------------------------------------------------ |
| `--ui-primary`  | Dark. Solid buttons, active states, headings. White text.    |
| `--ui-accent`   | Light. Hovers, highlights, the accent in dark mode.          |
| `--ui-tertiary` | Light. Supporting fills; its `-dark` shade is used for links |

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
