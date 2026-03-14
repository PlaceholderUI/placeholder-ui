type Theme = "system" | "light" | "dark";

// ============================================
// Theme State
// ============================================

// Svelte 5 runes for reactive state
let theme = $state<Theme>("system");
let isDarkMode = $derived.by(() => {
    if (theme === "system")
        return isSystemDarkMode();

    return theme === "dark";
});

// Initialize theme on module load
if (typeof window !== 'undefined') {
    loadTheme();
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
    get current() {
        return theme;
    },
    get isDarkMode() {
        return isDarkMode;
    }
};

export function loadTheme() {
    if (typeof window === 'undefined') return;

    const themeString = localStorage.getItem('theme') || 'system';

    if (themeString == 'light') setTheme('light');
    else if (themeString == 'dark') setTheme('dark');
    else setTheme('system');
}

export function setTheme(newTheme: Theme) {
    if (typeof window === 'undefined') return;

    const classList = document.documentElement.classList;

    classList.remove('light', 'dark');

    let appliedTheme = newTheme;
    if (newTheme === 'system') {
        appliedTheme = isSystemDarkMode() ? 'dark' : 'light';
    }

    if (appliedTheme === 'dark') {
        classList.add('dark');
    } else {
        classList.add('light');
    }

    theme = newTheme;
    localStorage.setItem('theme', newTheme);
}

function isSystemDarkMode(): boolean {
    if (typeof window === 'undefined') return false;
    return (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
}