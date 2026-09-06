type Theme = 'system' | 'light' | 'dark';

/** True in the browser, false during SSR / prerendering. */
const browser = typeof window !== 'undefined' && typeof document !== 'undefined';

// ============================================
// Theme State
// ============================================

// Svelte 5 runes for reactive state
let theme = $state<Theme>('system');
let systemDarkMode = $state(browser && isSystemDarkMode());
let isDarkMode = $derived.by(() => {
	if (theme === 'system') return systemDarkMode;

	return theme === 'dark';
});

// Initialize theme on module load (browser only - SSR has no localStorage/document)
if (browser) loadTheme();

// Track OS theme changes so "system" stays in sync (runs once on module load)
if (browser && window.matchMedia) {
	window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
		systemDarkMode = e.matches;

		if (theme === 'system') applyThemeClass(e.matches ? 'dark' : 'light');
	});
}

// ============================================
// Viewport / Responsive State
// ============================================

// Default breakpoints (can be customized)
export const breakpoints = {
	sm: 640,
	md: 768,
	lg: 1024,
	xl: 1280,
	xxl: 1536,
	ultrawide: 2100
} as const;

// Viewport dimensions
let windowWidth = $state(typeof window !== 'undefined' ? window.innerWidth : 1024);
let windowHeight = $state(typeof window !== 'undefined' ? window.innerHeight : 768);

// Derived breakpoint booleans
let isMobile = $derived(windowWidth < breakpoints.md);
let isTablet = $derived(windowWidth >= breakpoints.md && windowWidth < breakpoints.lg);
let isDesktop = $derived(windowWidth >= breakpoints.lg);
let isSmall = $derived(windowWidth < breakpoints.sm);
let isMedium = $derived(windowWidth >= breakpoints.md);
let isLarge = $derived(windowWidth >= breakpoints.lg);
let isExtraLarge = $derived(windowWidth >= breakpoints.xl);
let isUltrawide = $derived(windowWidth >= breakpoints.ultrawide);

// Set up resize listener (runs once on module load)
if (typeof window !== 'undefined') {
	window.addEventListener('resize', () => {
		windowWidth = window.innerWidth;
		windowHeight = window.innerHeight;
	});
}

// Export reactive viewport state object
export const viewportState = {
	get width() {
		return windowWidth;
	},
	get height() {
		return windowHeight;
	},
	// Boolean helpers
	get isMobile() {
		return isMobile;
	},
	get isTablet() {
		return isTablet;
	},
	get isDesktop() {
		return isDesktop;
	},
	get isSmall() {
		return isSmall;
	},
	get isMedium() {
		return isMedium;
	},
	get isLarge() {
		return isLarge;
	},
	get isExtraLarge() {
		return isExtraLarge;
	},
	get isUltrawide() {
		return isUltrawide;
	},
	// Utility function for custom breakpoints
	isBelow(breakpoint: number) {
		return windowWidth < breakpoint;
	},
	isAbove(breakpoint: number) {
		return windowWidth >= breakpoint;
	}
};

// Export getter for the theme state
export function getTheme(): Theme {
	return theme;
}

// Export reactive state object for components
export const themeState = {
	get theme() {
		return theme;
	},
	get isDarkMode() {
		return isDarkMode;
	}
};

export function loadTheme() {
	if (!browser) return;

	const themeString = localStorage.getItem('theme') || 'system';

	if (themeString == 'light') setTheme('light');
	else if (themeString == 'dark') setTheme('dark');
	else setTheme('system');
}

export function setTheme(newTheme: Theme) {
	let appliedTheme: 'light' | 'dark';
	if (newTheme === 'system') {
		systemDarkMode = isSystemDarkMode();
		appliedTheme = systemDarkMode ? 'dark' : 'light';
	} else {
		appliedTheme = newTheme;
	}

	theme = newTheme;

	// State is updated on the server too, but the DOM and storage only exist in the browser
	if (!browser) return;

	applyThemeClass(appliedTheme);
	localStorage.setItem('theme', newTheme);
}

function applyThemeClass(appliedTheme: 'light' | 'dark') {
	if (!browser) return;

	const classList = document.documentElement.classList;

	classList.remove('light', 'dark');
	classList.add(appliedTheme);
}

function isSystemDarkMode(): boolean {
	if (!browser || !window.matchMedia) return false;

	return window.matchMedia('(prefers-color-scheme: dark)').matches;
}
