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

## Deployment to Vercel

### Option 1: After publishing library to npm

1. Publish `@placeholderco/placeholder-ui` to npm
2. Update `package.json` to use the published version instead of `workspace:*`
3. Connect the docs directory to Vercel
4. Deploy

### Option 2: Monorepo deployment (recommended)

1. Set the root directory to the monorepo root
2. Configure the build command:
   ```
   pnpm install && pnpm build:docs
   ```
3. Set the output directory to `apps/docs/.svelte-kit/output`

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
├── svelte.config.js
└── vercel.json
```
