# UI Svelte Documentation Site

Documentation and showcase for the UI Svelte component library.

## Development

```bash
# Install dependencies
npm install

# Build the library first (required)
cd ../open-source-library
npm install
npm run build
cd ../docs-site

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment to Vercel

### Option 1: After publishing library to npm

1. Publish `@anthropic-public/ui-svelte` to npm
2. Update `package.json` to use the published version instead of `file:../open-source-library`
3. Connect the docs-site directory to Vercel
4. Deploy

### Option 2: Monorepo deployment

1. Set the root directory to the parent folder containing both `open-source-library` and `docs-site`
2. Configure the build command to build both:
   ```
   cd open-source-library && npm install && npm run build && cd ../docs-site && npm install && npm run build
   ```
3. Set the output directory to `docs-site/.svelte-kit/output`

## Project Structure

```
docs-site/
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
