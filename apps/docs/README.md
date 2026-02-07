# Placeholder UI Documentation Site

Documentation and showcase for the Placeholder UI component library.

## Development

```bash
# From the monorepo root
pnpm install

# Build the library first (required)
pnpm build

# Start documentation site
pnpm dev:docs

# Build for production
pnpm build:docs

# Preview production build
cd apps/docs && pnpm preview
```

## Project Structure

```
apps/docs/
├── src/
│   ├── routes/
│   │   ├── +layout.svelte    # Main layout with navigation
│   │   ├── +page.svelte      # Homepage
│   │   └── docs/
│   │       ├── installation/ # Getting started
│   │       ├── theming/      # Theme customization
│   │       └── components/   # Component documentation
│   └── app.css               # Global styles
└── svelte.config.js
```
