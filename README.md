# UI Svelte

A modern, accessible Svelte 5 component library with comprehensive theming support.

## Packages

| Package | Description |
|---------|-------------|
| [`@anthropic-public/ui-svelte`](./packages/ui-svelte) | Core component library |
| [`docs`](./apps/docs) | Documentation site |

## Quick Start

### Installation

```bash
npm install @anthropic-public/ui-svelte
```

### Setup

Import the styles in your root layout:

```svelte
<!-- +layout.svelte -->
<script>
  import '@anthropic-public/ui-svelte/styles';
</script>
```

### Usage

```svelte
<script>
  import { Button, Textbox, Dialog } from '@anthropic-public/ui-svelte';
</script>

<Button variant="midnight">Click me</Button>
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
| `pnpm dev:docs` | Start documentation site |
| `pnpm build` | Build the component library |
| `pnpm build:docs` | Build library and docs site |
| `pnpm check` | Type check all packages |
| `pnpm test` | Run tests |
| `pnpm format` | Format code with Prettier |

## Project Structure

```
ui-svelte/
├── packages/
│   └── ui-svelte/          # @anthropic-public/ui-svelte
│       ├── src/lib/        # Components, icons, utilities
│       └── src/routes/     # Component showcase (dev)
├── apps/
│   └── docs/               # Documentation website
├── package.json            # Root workspace config
└── pnpm-workspace.yaml     # Workspace definition
```

## License

MIT
