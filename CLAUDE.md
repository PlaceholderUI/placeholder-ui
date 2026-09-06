# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Package Manager

This project uses **pnpm** (not npm). All commands below use `pnpm run`.
`npm install` will fail with a cryptic error.

## Development Commands

- `pnpm run dev` — Start dev server with showcase app (default http://localhost:5173)
- `pnpm run check` — Type check with svelte-check (run before committing)
- `pnpm run build` — Full build: `vite build && pnpm run prepack`
- `pnpm run format` — Format code with prettier
- `pnpm add <package>` — Install a new dependency

## Architecture Overview

Svelte 5 component library built with SvelteKit for packaging. Two codebases live side-by-side:

- `src/lib/` — The library itself (published to npm as `dist/`)
- `src/routes/` — Showcase/demo app for development (not published)

### Library Structure (`src/lib/`)

All public exports go through `src/lib/index.ts`:

- Named component exports: `export { default as Button } from './ui/Button.svelte'`
- Type exports: `export type { ButtonProps } from './ui/Button.svelte'`
- Re-exports: `export * from './icon/index.js'`

Component folders: `ui/`, `form/`, `display/`, `layout/`, `editors/`, `cards/`, `icon/`, `models/`, `util/`

### Showcase App (`src/routes/`)

Each component has a demo page at `src/routes/components/<name>/+page.svelte`.

**When adding a new showcase page**, you must also add it to the `navigationData` array in `src/routes/+layout.svelte`. The sidenav sections are: Utilities, Editors, Form Components, UI Components, Display Components, Layout Components, Specialized. Forgetting this means the page is unreachable in the UI.

If adding a variant to an existing component (e.g., TipTapBubble alongside TipTap), put it on the same showcase page — no new sidenav entry needed.

### Component Patterns

- Svelte 5 runes throughout: `$state`, `$derived`, `$bindable()`, `$props()`
- Each component exports a `Props` interface with JSDoc comments
- Content slots use the `Snippet` type
- Bindable values use `$bindable()` (e.g., `value = $bindable('')`)
- Component variants are TypeScript union types (e.g., `ButtonVariant`)

### Theme System

- `src/lib/theme.svelte.ts` — Runes-based state for light/dark theme + viewport
- Themes: `"system"` | `"light"` | `"dark"`, persisted to localStorage
- CSS classes `.light` / `.dark` applied to document root
- Theme-aware component styles use `:global(.dark) .my-class { ... }`

### Branding / Design Tokens

- All brand colours resolve to semantic `--ui-*` custom properties defined in `src/lib/app.css`:
  `--ui-primary` (dark), `--ui-accent` (light), `--ui-tertiary` (light support), each with
  `-rgb`, `-rgbc`, `-dark` (and `-light`/`-contrast` where relevant), plus `--ui-font-family`,
  `--ui-link-color`, `--ui-link-hover-color`.
- **Never hardcode brand colours or fonts in components.** Use the tokens. Surface tokens
  (`--page-bg`, `--paper-body-bg`, `--text-color`, `--border-color`, `--input-bg`, ...) stay as-is.
- `src/lib/uiTheme.svelte.ts` — `ThemeConfig`, `applyTheme()`, `themeToCss()`, `setLogo()`,
  `brandState`. Consumers brand the library with one config object. `ThemeConfig.dark` holds
  optional overrides for dark mode; `applyTheme` injects a `<style>` with `:root` / `:root.dark`
  rules (not inline styles), so light/dark values switch with the existing `.dark` class.
- Variant names are semantic: `primary` / `accent` / `tertiary` (+ `-outline`, `-subtle`).
  When adding a variant, add it under the semantic name only.
- The library ships no logo and no font file. `Logo.svelte` falls back to a placeholder SVG.
- Company-specific presets live outside the package (the `private/` folder is git-ignored).

### Styling

- Bootstrap CSS for base styles
- Component-scoped `<style>` blocks
- Dark mode via `:global(.dark)` parent selector pattern
- Global styles and design tokens in `src/lib/app.css`

### Icon System

- `src/lib/icon/` contains 150+ SVG files imported as raw strings via Vite `?raw`
- Exported as camelCase: `iconBold`, `iconChevronDown`, `iconUser`, etc.
- Rendered via `<Icon svg={iconName} size="20" />`

### Editor Components

- **TipTap** (`src/lib/editors/tiptap/`) — Rich text editor with fixed toolbar and bubble menu variants. Custom extensions in `extensions/`. Reusable toolbar buttons in `toolbar/`.
- **CodeMirror** (`src/lib/editors/CodeMirror.svelte`) — Code editor supporting JS, HTML, CSS, JSON, TypeScript, Markdown.

### Formatting

Prettier config (`.prettierrc`): tabs, single quotes, no trailing commas, 100 char width, svelte plugin.
