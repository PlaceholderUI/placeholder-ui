export interface PageInfo {
	label: string;
	href: string;
	description: string;
	keywords: string[];
	category: 'getting-started' | 'components' | 'form' | 'display' | 'layout';
}

export const pages: PageInfo[] = [
	// Getting Started
	{
		label: 'Introduction',
		href: '/',
		description: 'Get started with Placeholder UI, a modern Svelte 5 component library',
		keywords: ['intro', 'start', 'begin', 'overview', 'about', 'welcome'],
		category: 'getting-started'
	},
	{
		label: 'Theme',
		href: '/utilities/theme',
		description: 'Customize colors, fonts, and styles with CSS variables',
		keywords: ['theme', 'style', 'css', 'variables', 'colors', 'dark', 'light', 'mode', 'customize'],
		category: 'getting-started'
	},

	// UI Components
	{
		label: 'Button',
		href: '/components/button',
		description: 'Clickable button component with multiple variants and sizes',
		keywords: ['button', 'click', 'action', 'submit', 'primary', 'secondary', 'variant'],
		category: 'components'
	},
	{
		label: 'Action Icon',
		href: '/components/action-icon',
		description: 'Icon-only button for compact actions',
		keywords: ['action', 'icon', 'button', 'compact', 'toolbar'],
		category: 'components'
	},
	{
		label: 'Badge',
		href: '/components/badge',
		description: 'Small status indicator or label component',
		keywords: ['badge', 'tag', 'label', 'status', 'indicator', 'pill', 'chip'],
		category: 'components'
	},
	{
		label: 'Loader',
		href: '/components/loader',
		description: 'Loading spinner and progress indicators',
		keywords: ['loader', 'loading', 'spinner', 'progress', 'wait', 'async'],
		category: 'components'
	},
	{
		label: 'Progress',
		href: '/components/progress',
		description: 'Visual progress bar for completion status',
		keywords: ['progress', 'bar', 'loading', 'percentage', 'completion', 'status'],
		category: 'components'
	},
	{
		label: 'Ring Progress',
		href: '/components/ring-progress',
		description: 'Circular progress indicator',
		keywords: ['ring', 'progress', 'circular', 'donut', 'percentage'],
		category: 'components'
	},
	{
		label: 'Skeleton',
		href: '/components/skeleton',
		description: 'Placeholder loading state for content',
		keywords: ['skeleton', 'loading', 'placeholder', 'shimmer', 'pulse', 'content'],
		category: 'components'
	},
	{
		label: 'Loading Overlay',
		href: '/components/loading-overlay',
		description: 'Full overlay with loading indicator',
		keywords: ['loading', 'overlay', 'spinner', 'blocking', 'wait'],
		category: 'components'
	},
	{
		label: 'Dialog',
		href: '/components/dialog',
		description: 'Modal dialog for confirmations and focused interactions',
		keywords: ['dialog', 'modal', 'popup', 'confirm', 'overlay', 'window', 'prompt'],
		category: 'components'
	},
	{
		label: 'Drawer',
		href: '/components/drawer',
		description: 'Slide-out panel from screen edge',
		keywords: ['drawer', 'sidebar', 'panel', 'slide', 'navigation', 'menu', 'offcanvas'],
		category: 'components'
	},
	{
		label: 'Dropdown',
		href: '/components/dropdown',
		description: 'Dropdown menu with selectable items',
		keywords: ['dropdown', 'menu', 'select', 'action', 'context'],
		category: 'components'
	},
	{
		label: 'Popover',
		href: '/components/popover',
		description: 'Floating content triggered by click or hover',
		keywords: ['popover', 'popup', 'dropdown', 'floating', 'overlay', 'menu'],
		category: 'components'
	},
	{
		label: 'Tooltip',
		href: '/components/tooltip',
		description: 'Show contextual information on hover',
		keywords: ['tooltip', 'hover', 'hint', 'help', 'info', 'popover', 'title'],
		category: 'components'
	},
	{
		label: 'Tabs',
		href: '/components/tabs',
		description: 'Organize content into switchable tabbed sections',
		keywords: ['tabs', 'tab', 'navigation', 'switch', 'panel', 'sections'],
		category: 'components'
	},
	{
		label: 'Accordion',
		href: '/components/accordion',
		description: 'Collapsible content sections',
		keywords: ['accordion', 'collapse', 'expand', 'toggle', 'faq', 'sections'],
		category: 'components'
	},
	{
		label: 'Table',
		href: '/components/table',
		description: 'Display tabular data with sorting and selection',
		keywords: ['table', 'data', 'grid', 'rows', 'columns', 'sort', 'list'],
		category: 'components'
	},
	{
		label: 'Pagination',
		href: '/components/pagination',
		description: 'Navigate through paginated content',
		keywords: ['pagination', 'pages', 'navigate', 'paging', 'next', 'previous'],
		category: 'components'
	},
	{
		label: 'Breadcrumbs',
		href: '/components/breadcrumbs',
		description: 'Navigation path indicator',
		keywords: ['breadcrumbs', 'navigation', 'path', 'trail', 'hierarchy', 'location'],
		category: 'components'
	},
	{
		label: 'Stepper',
		href: '/components/stepper',
		description: 'Multi-step process indicator',
		keywords: ['stepper', 'steps', 'wizard', 'progress', 'multi-step', 'workflow'],
		category: 'components'
	},
	{
		label: 'Timeline',
		href: '/components/timeline',
		description: 'Display events in chronological order',
		keywords: ['timeline', 'history', 'events', 'chronological', 'activity', 'feed'],
		category: 'components'
	},
	{
		label: 'Dropzone',
		href: '/components/dropzone',
		description: 'Drag and drop file upload area',
		keywords: ['dropzone', 'drag', 'drop', 'upload', 'file', 'area'],
		category: 'components'
	},
	{
		label: 'Toaster',
		href: '/components/toaster',
		description: 'Toast notification system',
		keywords: ['toaster', 'toast', 'notification', 'snackbar', 'message', 'alert'],
		category: 'components'
	},
	{
		label: 'Link',
		href: '/components/link',
		description: 'Styled anchor link component',
		keywords: ['link', 'anchor', 'href', 'navigation', 'url'],
		category: 'components'
	},
	{
		label: 'Icons',
		href: '/components/icons',
		description: 'Built-in icon set',
		keywords: ['icons', 'svg', 'symbol', 'graphic', 'glyph'],
		category: 'components'
	},

	// Form Components
	{
		label: 'Textbox',
		href: '/components/textbox',
		description: 'Single-line text input field',
		keywords: ['textbox', 'input', 'text', 'field', 'form', 'string', 'entry'],
		category: 'form'
	},
	{
		label: 'Password Input',
		href: '/components/password-input',
		description: 'Secure password input with visibility toggle',
		keywords: ['password', 'input', 'secure', 'hidden', 'login', 'auth', 'secret'],
		category: 'form'
	},
	{
		label: 'Number',
		href: '/components/number',
		description: 'Numeric input with increment/decrement controls',
		keywords: ['number', 'input', 'numeric', 'integer', 'decimal', 'count'],
		category: 'form'
	},
	{
		label: 'TextArea',
		href: '/components/textarea',
		description: 'Multi-line text input for longer content',
		keywords: ['textarea', 'multiline', 'text', 'input', 'paragraph', 'description'],
		category: 'form'
	},
	{
		label: 'Select',
		href: '/components/select',
		description: 'Dropdown selection from a list of options',
		keywords: ['select', 'dropdown', 'option', 'choice', 'picker', 'menu', 'combobox'],
		category: 'form'
	},
	{
		label: 'Select Multi',
		href: '/components/select-multi',
		description: 'Multi-select dropdown for choosing multiple options',
		keywords: ['select', 'multi', 'multiple', 'dropdown', 'tags', 'choices'],
		category: 'form'
	},
	{
		label: 'Autocomplete',
		href: '/components/autocomplete',
		description: 'Text input with autocomplete suggestions',
		keywords: ['autocomplete', 'typeahead', 'suggest', 'search', 'input'],
		category: 'form'
	},
	{
		label: 'ComboBox',
		href: '/components/combobox',
		description: 'Searchable select with custom items',
		keywords: ['combobox', 'search', 'select', 'filter', 'combo'],
		category: 'form'
	},
	{
		label: 'ComboBox Multi',
		href: '/components/combobox-multi',
		description: 'Searchable multi-select with custom items',
		keywords: ['combobox', 'multi', 'search', 'select', 'filter', 'tags'],
		category: 'form'
	},
	{
		label: 'Checkbox',
		href: '/components/checkbox',
		description: 'Toggle boolean value with a checkmark',
		keywords: ['checkbox', 'check', 'toggle', 'boolean', 'tick', 'select'],
		category: 'form'
	},
	{
		label: 'Radio Group',
		href: '/components/radio-group',
		description: 'Select one option from a group',
		keywords: ['radio', 'group', 'select', 'option', 'choice', 'single'],
		category: 'form'
	},
	{
		label: 'Switch',
		href: '/components/switch',
		description: 'Toggle switch for on/off states',
		keywords: ['switch', 'toggle', 'boolean', 'on', 'off', 'flip'],
		category: 'form'
	},
	{
		label: 'Segmented Control',
		href: '/components/segmented-control',
		description: 'Segmented button group for single selection',
		keywords: ['segmented', 'control', 'button', 'group', 'toggle', 'tabs'],
		category: 'form'
	},
	{
		label: 'Slider',
		href: '/components/slider',
		description: 'Select a value from a range by dragging',
		keywords: ['slider', 'range', 'drag', 'value', 'number', 'input'],
		category: 'form'
	},
	{
		label: 'Rating',
		href: '/components/rating',
		description: 'Star rating input component',
		keywords: ['rating', 'stars', 'score', 'review', 'feedback', 'rank'],
		category: 'form'
	},
	{
		label: 'Chips',
		href: '/components/chips',
		description: 'Input and display tags or chips',
		keywords: ['chips', 'tags', 'input', 'multi', 'labels', 'tokens'],
		category: 'form'
	},
	{
		label: 'File Input',
		href: '/components/file-input',
		description: 'Upload files with drag and drop support',
		keywords: ['file', 'upload', 'input', 'drag', 'drop', 'attachment', 'document'],
		category: 'form'
	},
	{
		label: 'Date Picker',
		href: '/components/datepicker',
		description: 'Select dates from a calendar interface',
		keywords: ['date', 'picker', 'calendar', 'day', 'month', 'year', 'schedule'],
		category: 'form'
	},
	{
		label: 'Time Picker',
		href: '/components/timepicker',
		description: 'Select time values',
		keywords: ['time', 'picker', 'hour', 'minute', 'clock'],
		category: 'form'
	},
	{
		label: 'DateTime Picker',
		href: '/components/datetimepicker',
		description: 'Combined date and time picker',
		keywords: ['datetime', 'date', 'time', 'picker', 'calendar', 'clock'],
		category: 'form'
	},
	{
		label: 'CRON Builder',
		href: '/components/cronbuilder',
		description: 'Visual cron expression builder',
		keywords: ['cron', 'schedule', 'builder', 'expression', 'recurring'],
		category: 'form'
	},
	{
		label: 'Form Group',
		href: '/components/form-group',
		description: 'Group form inputs with labels and validation',
		keywords: ['form', 'group', 'label', 'validation', 'field', 'wrapper'],
		category: 'form'
	},

	// Display Components
	{
		label: 'Paper',
		href: '/components/paper',
		description: 'Elevated surface container with shadow',
		keywords: ['paper', 'card', 'surface', 'container', 'box', 'panel', 'elevation'],
		category: 'display'
	},
	{
		label: 'Avatar',
		href: '/components/avatar',
		description: 'Display user profile images or initials',
		keywords: ['avatar', 'user', 'profile', 'image', 'picture', 'initials', 'photo'],
		category: 'display'
	},
	{
		label: 'Alert',
		href: '/components/alert',
		description: 'Display important messages and notifications inline',
		keywords: ['alert', 'message', 'notification', 'warning', 'error', 'success', 'info', 'banner'],
		category: 'display'
	},
	{
		label: 'Link Collection',
		href: '/components/link-collection',
		description: 'Grouped collection of links',
		keywords: ['link', 'collection', 'list', 'group', 'navigation'],
		category: 'display'
	},

	// Layout Components
	{
		label: 'Navbar',
		href: '/components/navbar',
		description: 'Top navigation bar with links and actions',
		keywords: ['navbar', 'navigation', 'header', 'menu', 'top', 'bar'],
		category: 'layout'
	},
	{
		label: 'Sidenav',
		href: '/components/sidenav',
		description: 'Side navigation with collapsible sections',
		keywords: ['sidenav', 'sidebar', 'navigation', 'menu', 'side'],
		category: 'layout'
	}
];

export function getPagesByCategory(category: PageInfo['category']): PageInfo[] {
	return pages.filter((page) => page.category === category);
}

export function searchPages(query: string): PageInfo[] {
	if (!query.trim()) return [];

	const lowerQuery = query.toLowerCase();

	return pages.filter((page) => {
		if (page.label.toLowerCase().includes(lowerQuery)) return true;
		if (page.description.toLowerCase().includes(lowerQuery)) return true;
		if (page.keywords.some((kw) => kw.toLowerCase().includes(lowerQuery))) return true;
		return false;
	});
}
