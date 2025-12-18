# Placeholder UI

A modern, customizable Svelte 5 UI component library with comprehensive theming support via CSS variables.

## Features

- **70+ Components** - Buttons, forms, dialogs, tables, and more
- **CSS Variable Theming** - Fully customizable via CSS custom properties
- **Dark Mode** - Built-in light/dark theme support
- **Svelte 5** - Built with modern Svelte 5 runes
- **TypeScript** - Full TypeScript support
- **Accessible** - Built with accessibility in mind
- **Lightweight** - No Bootstrap, minimal CSS footprint

## Installation

```bash
npm install @placeholderco/placeholder-ui
```

## Quick Start

```svelte
<script>
  import { AppShell, Button, Paper } from '@placeholderco/placeholder-ui';
</script>

<AppShell>
  <Paper>
    <h1>Hello World</h1>
    <Button variant="primary">Click Me</Button>
  </Paper>
</AppShell>
```

The `AppShell` component automatically imports all required styles.

## Components

### UI Components
- `Button` - Buttons with multiple variants and sizes
- `ActionIcon` - Icon buttons
- `Badge` - Status badges
- `Dialog` - Modal dialogs
- `Drawer` - Slide-out panels
- `Dropdown` - Dropdown menus
- `Loader` - Loading spinners
- `Pagination` - Page navigation
- `Popover` - Floating content
- `Table` - Data tables
- `Tabs` - Tab navigation
- `Tooltip` - Hover tooltips
- `Toaster` - Toast notifications

### Form Components
- `Textbox` - Text input
- `TextArea` - Multi-line text input
- `Number` - Numeric input
- `Select` / `SelectMulti` - Dropdowns
- `Checkbox` - Checkboxes
- `RadioGroup` - Radio buttons
- `Switch` - Toggle switches
- `DatePicker` / `TimePicker` / `DateTimePicker` - Date/time selection
- `Autocomplete` - Autocomplete input
- `Chips` - Tag input

### Display Components
- `Paper` - Card/panel container
- `Alert` - Alert messages
- `Avatar` - User avatars
- `LinkCollection` - Link lists

### Layout Components
- `AppShell` - Application wrapper
- `Navbar` - Navigation bar
- `Sidenav` - Side navigation

### Editors (separate package)

For code and rich text editors, install the editors package:

```bash
npm install @placeholderco/placeholder-ui-editors
```

```svelte
<script>
  import { CodeMirror } from '@placeholderco/placeholder-ui-editors';
</script>

<CodeMirror bind:value={code} language="javascript" />
```

## Theming

The library uses CSS variables for theming. Override variables after importing styles:

```css
:root {
  /* Brand colors */
  --cui-color-primary: #1a365d;
  --cui-color-secondary: #48bb78;
  --cui-color-accent: #4fd1c5;

  /* Typography */
  --cui-font-family-sans: 'Inter', sans-serif;

  /* Spacing, radius, shadows, etc. */
  --cui-radius-md: 8px;
}
```

### Dark Mode

Dark mode is activated by adding the `.dark` class to the document:

```javascript
document.documentElement.classList.add('dark');
```

Or use the built-in theme utilities:

```javascript
import { setTheme } from '@placeholderco/placeholder-ui';

setTheme('dark'); // 'light', 'dark', or 'system'
```

## CSS Variable Reference

### Primitives (tokens.css)
- `--cui-color-*` - Color palette
- `--cui-font-size-*` - Typography sizes
- `--cui-spacing-*` - Spacing scale
- `--cui-radius-*` - Border radius
- `--cui-shadow-*` - Box shadows

### Semantic (semantic.css)
- `--cui-bg-*` - Background colors
- `--cui-text-*` - Text colors
- `--cui-border-*` - Border colors

### Components (components.css)
- `--cui-btn-*` - Button styles
- `--cui-input-*` - Input styles
- `--cui-paper-*` - Paper styles
- And more per component...

## Icons

The library includes 145 SVG icons based on Tabler Icons:

```svelte
<script>
  import { Icon, iconCheck, iconX } from '@placeholderco/placeholder-ui';
</script>

<Icon svg={iconCheck} size="24px" />
```

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Type check
npm run check

# Build
npm run build

# Run tests
npm run test
```

## License

MIT License - see [LICENSE](LICENSE) for details.

Icons derived from [Tabler Icons](https://tabler-icons.io/) (MIT License).
