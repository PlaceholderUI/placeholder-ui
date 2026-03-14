# Placeholder UI

A modern, accessible Svelte 5 component library with comprehensive theming support.

## Packages

| Package | Description |
|---------|-------------|
| [`@placeholderco/placeholder-ui`](./packages/ui-svelte) | Core component library |
| [`@placeholderco/placeholder-ui-editors`](./packages/editors) | Code editors (CodeMirror, TipTap) |
| [`docs`](./apps/docs) | Documentation site |

## Quick Start

### Installation

```bash
npm install @placeholderco/placeholder-ui
```

For code editors:

```bash
npm install @placeholderco/placeholder-ui-editors
```

### Setup

Import the styles in your root layout:

```svelte
<!-- +layout.svelte -->
<script>
  import '@placeholderco/placeholder-ui/styles';
</script>
```

### Usage

```svelte
<script>
  import { Button, Textbox, Dialog } from '@placeholderco/placeholder-ui';
</script>

<Button variant="primary">Click me</Button>
```

## Development

This is a monorepo using pnpm workspaces.

### Prerequisites

- Node.js >= 20
- pnpm >= 8

### Setup

```bash
# Install dependencies
pnpm install

# Start the component library dev server
pnpm dev

# Start the docs site
pnpm dev:docs
```

### Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start component library dev server |
| `pnpm dev:editors` | Start editors package dev server |
| `pnpm dev:docs` | Start documentation site |
| `pnpm build` | Build the component library |
| `pnpm build:editors` | Build the editors package |
| `pnpm build:all` | Build all packages |
| `pnpm build:docs` | Build library and docs site |
| `pnpm check` | Type check all packages |
| `pnpm test` | Run tests |
| `pnpm format` | Format code with Prettier |

## Project Structure

```
placeholder-ui/
├── packages/
│   ├── ui-svelte/          # @placeholderco/placeholder-ui
│   │   ├── src/lib/        # Components, icons, utilities
│   │   └── src/routes/     # Component showcase (dev)
│   └── editors/            # @placeholderco/placeholder-ui-editors
│       └── src/lib/        # CodeMirror, TipTap components
├── apps/
│   └── docs/               # Documentation website
├── package.json            # Root workspace config
└── pnpm-workspace.yaml     # Workspace definition
```

## License

MIT
