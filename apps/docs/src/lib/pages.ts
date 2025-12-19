export interface PageInfo {
	label: string;
	href: string;
	description: string;
	keywords: string[];
	category: 'getting-started' | 'components' | 'form' | 'layout';
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
		label: 'Installation',
		href: '/docs/installation',
		description: 'Install and set up Placeholder UI in your Svelte project',
		keywords: ['install', 'setup', 'npm', 'pnpm', 'yarn', 'package', 'config', 'configuration'],
		category: 'getting-started'
	},
	{
		label: 'Theming',
		href: '/docs/theming',
		description: 'Customize colors, fonts, and styles with CSS variables',
		keywords: ['theme', 'style', 'css', 'variables', 'colors', 'dark', 'light', 'mode', 'customize'],
		category: 'getting-started'
	},

	// Components
	{
		label: 'Button',
		href: '/docs/components/button',
		description: 'Clickable button component with multiple variants and sizes',
		keywords: ['button', 'click', 'action', 'submit', 'primary', 'secondary', 'variant'],
		category: 'components'
	},
	{
		label: 'Badge',
		href: '/docs/components/badge',
		description: 'Small status indicator or label component',
		keywords: ['badge', 'tag', 'label', 'status', 'indicator', 'pill', 'chip'],
		category: 'components'
	},
	{
		label: 'Alert',
		href: '/docs/components/alert',
		description: 'Display important messages and notifications inline',
		keywords: ['alert', 'message', 'notification', 'warning', 'error', 'success', 'info', 'banner'],
		category: 'components'
	},
	{
		label: 'Avatar',
		href: '/docs/components/avatar',
		description: 'Display user profile images or initials',
		keywords: ['avatar', 'user', 'profile', 'image', 'picture', 'initials', 'photo'],
		category: 'components'
	},
	{
		label: 'Dialog',
		href: '/docs/components/dialog',
		description: 'Modal dialog for confirmations and focused interactions',
		keywords: ['dialog', 'modal', 'popup', 'confirm', 'overlay', 'window', 'prompt'],
		category: 'components'
	},
	{
		label: 'Drawer',
		href: '/docs/components/drawer',
		description: 'Slide-out panel from screen edge',
		keywords: ['drawer', 'sidebar', 'panel', 'slide', 'navigation', 'menu', 'offcanvas'],
		category: 'components'
	},
	{
		label: 'Tabs',
		href: '/docs/components/tabs',
		description: 'Organize content into switchable tabbed sections',
		keywords: ['tabs', 'tab', 'navigation', 'switch', 'panel', 'sections'],
		category: 'components'
	},
	{
		label: 'Table',
		href: '/docs/components/table',
		description: 'Display tabular data with sorting and selection',
		keywords: ['table', 'data', 'grid', 'rows', 'columns', 'sort', 'list'],
		category: 'components'
	},
	{
		label: 'Tooltip',
		href: '/docs/components/tooltip',
		description: 'Show contextual information on hover',
		keywords: ['tooltip', 'hover', 'hint', 'help', 'info', 'popover', 'title'],
		category: 'components'
	},
	{
		label: 'Popover',
		href: '/docs/components/popover',
		description: 'Floating content triggered by click or hover',
		keywords: ['popover', 'popup', 'dropdown', 'floating', 'overlay', 'menu'],
		category: 'components'
	},
	{
		label: 'Loader',
		href: '/docs/components/loader',
		description: 'Loading spinner and progress indicators',
		keywords: ['loader', 'loading', 'spinner', 'progress', 'wait', 'async'],
		category: 'components'
	},
	{
		label: 'Progress',
		href: '/docs/components/progress',
		description: 'Visual progress bar for completion status',
		keywords: ['progress', 'bar', 'loading', 'percentage', 'completion', 'status'],
		category: 'components'
	},
	{
		label: 'Skeleton',
		href: '/docs/components/skeleton',
		description: 'Placeholder loading state for content',
		keywords: ['skeleton', 'loading', 'placeholder', 'shimmer', 'pulse', 'content'],
		category: 'components'
	},
	{
		label: 'Accordion',
		href: '/docs/components/accordion',
		description: 'Collapsible content sections',
		keywords: ['accordion', 'collapse', 'expand', 'toggle', 'faq', 'sections'],
		category: 'components'
	},
	{
		label: 'Breadcrumbs',
		href: '/docs/components/breadcrumbs',
		description: 'Navigation path indicator',
		keywords: ['breadcrumbs', 'navigation', 'path', 'trail', 'hierarchy', 'location'],
		category: 'components'
	},
	{
		label: 'Stepper',
		href: '/docs/components/stepper',
		description: 'Multi-step process indicator',
		keywords: ['stepper', 'steps', 'wizard', 'progress', 'multi-step', 'workflow'],
		category: 'components'
	},
	{
		label: 'Timeline',
		href: '/docs/components/timeline',
		description: 'Display events in chronological order',
		keywords: ['timeline', 'history', 'events', 'chronological', 'activity', 'feed'],
		category: 'components'
	},
	{
		label: 'Pagination',
		href: '/docs/components/pagination',
		description: 'Navigate through paginated content',
		keywords: ['pagination', 'pages', 'navigate', 'paging', 'next', 'previous'],
		category: 'components'
	},

	// Form Components
	{
		label: 'Textbox',
		href: '/docs/components/textbox',
		description: 'Single-line text input field',
		keywords: ['textbox', 'input', 'text', 'field', 'form', 'string', 'entry'],
		category: 'form'
	},
	{
		label: 'PasswordInput',
		href: '/docs/components/password-input',
		description: 'Secure password input with visibility toggle',
		keywords: ['password', 'input', 'secure', 'hidden', 'login', 'auth', 'secret'],
		category: 'form'
	},
	{
		label: 'TextArea',
		href: '/docs/components/textarea',
		description: 'Multi-line text input for longer content',
		keywords: ['textarea', 'multiline', 'text', 'input', 'paragraph', 'description'],
		category: 'form'
	},
	{
		label: 'Select',
		href: '/docs/components/select',
		description: 'Dropdown selection from a list of options',
		keywords: ['select', 'dropdown', 'option', 'choice', 'picker', 'menu', 'combobox'],
		category: 'form'
	},
	{
		label: 'Checkbox',
		href: '/docs/components/checkbox',
		description: 'Toggle boolean value with a checkmark',
		keywords: ['checkbox', 'check', 'toggle', 'boolean', 'tick', 'select'],
		category: 'form'
	},
	{
		label: 'Switch',
		href: '/docs/components/switch',
		description: 'Toggle switch for on/off states',
		keywords: ['switch', 'toggle', 'boolean', 'on', 'off', 'flip'],
		category: 'form'
	},
	{
		label: 'RadioGroup',
		href: '/docs/components/radio-group',
		description: 'Select one option from a group',
		keywords: ['radio', 'group', 'select', 'option', 'choice', 'single'],
		category: 'form'
	},
	{
		label: 'Slider',
		href: '/docs/components/slider',
		description: 'Select a value from a range by dragging',
		keywords: ['slider', 'range', 'drag', 'value', 'number', 'input'],
		category: 'form'
	},
	{
		label: 'Rating',
		href: '/docs/components/rating',
		description: 'Star rating input component',
		keywords: ['rating', 'stars', 'score', 'review', 'feedback', 'rank'],
		category: 'form'
	},
	{
		label: 'DatePicker',
		href: '/docs/components/datepicker',
		description: 'Select dates from a calendar interface',
		keywords: ['date', 'picker', 'calendar', 'day', 'month', 'year', 'schedule'],
		category: 'form'
	},
	{
		label: 'FileInput',
		href: '/docs/components/file-input',
		description: 'Upload files with drag and drop support',
		keywords: ['file', 'upload', 'input', 'drag', 'drop', 'attachment', 'document'],
		category: 'form'
	},
	{
		label: 'Chips',
		href: '/docs/components/chips',
		description: 'Input and display tags or chips',
		keywords: ['chips', 'tags', 'input', 'multi', 'labels', 'tokens'],
		category: 'form'
	},

	// Layout Components
	{
		label: 'AppShell',
		href: '/docs/components/appshell',
		description: 'Application layout with header, sidebar, and content areas',
		keywords: ['appshell', 'layout', 'shell', 'structure', 'app', 'scaffold'],
		category: 'layout'
	},
	{
		label: 'Navbar',
		href: '/docs/components/navbar',
		description: 'Top navigation bar with links and actions',
		keywords: ['navbar', 'navigation', 'header', 'menu', 'top', 'bar'],
		category: 'layout'
	},
	{
		label: 'Paper',
		href: '/docs/components/paper',
		description: 'Elevated surface container with shadow',
		keywords: ['paper', 'card', 'surface', 'container', 'box', 'panel', 'elevation'],
		category: 'layout'
	}
];

// Helper to get pages by category
export function getPagesByCategory(category: PageInfo['category']): PageInfo[] {
	return pages.filter((page) => page.category === category);
}

// Helper to search pages
export function searchPages(query: string): PageInfo[] {
	if (!query.trim()) return [];

	const lowerQuery = query.toLowerCase();

	return pages.filter((page) => {
		// Check label
		if (page.label.toLowerCase().includes(lowerQuery)) return true;
		// Check description
		if (page.description.toLowerCase().includes(lowerQuery)) return true;
		// Check keywords
		if (page.keywords.some((kw) => kw.toLowerCase().includes(lowerQuery))) return true;
		return false;
	});
}
