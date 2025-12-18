# Contributing

Thank you for your interest in contributing to this UI library! This document provides guidelines for contributing.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/placeholder-ui.git`
3. Install dependencies: `npm install`
4. Start the development server: `npm run dev`

## Development Workflow

### Running the Development Server

```bash
npm run dev
```

This starts a local server with the component showcase.

### Type Checking

```bash
npm run check
```

### Building

```bash
npm run build
```

## Testing

This library uses [Vitest](https://vitest.dev/) for unit testing.

```bash
npm run test
```

## Making Changes

### Adding a New Component

1. Create the component in the appropriate folder:
   - `src/lib/ui/` - Core UI components
   - `src/lib/form/` - Form controls
   - `src/lib/display/` - Display components
   - `src/lib/layout/` - Layout components

2. Export the component from `src/lib/index.ts`

3. Use CSS variables from the design system for styling

4. Add TypeScript types for all props

5. Add unit tests in a corresponding `.test.ts` file

### CSS Variables

This library uses a comprehensive CSS variable system. When styling components:

- Use variables from `src/lib/styles/tokens.css` for primitives
- Use variables from `src/lib/styles/semantic.css` for semantic values
- Add component-specific variables to `src/lib/styles/components.css`
- Support dark mode by adding overrides in `src/lib/styles/dark.css`

### Code Style

- Use TypeScript for all code
- Follow the existing code patterns
- Use Svelte 5 runes (`$state`, `$derived`, `$props`)
- Keep components focused and single-purpose

## Submitting Changes

1. Create a new branch: `git checkout -b feature/your-feature-name`
2. Make your changes
3. Run type checking: `npm run check`
4. Run tests: `npm run test`
5. Commit your changes with a descriptive message
6. Push to your fork
7. Open a Pull Request

### Pull Request Guidelines

- Provide a clear description of the changes
- Reference any related issues
- Ensure all checks pass
- Keep PRs focused on a single change
- Please fill out the Pull Request Template completely

## Reporting Issues

When reporting issues, please include:

- A clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Browser/environment information
- Code samples if applicable

## Questions?

Feel free to open an issue for any questions about contributing.
