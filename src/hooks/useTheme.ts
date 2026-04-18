/**
 * Theme Management Hook
 *
 * Provides theme state management with support for light, dark, and system preferences.
 * Persists theme choice to localStorage and listens to system preference changes.
 *
 * @see .trellis/spec/frontend/react-pitfalls.md - React patterns
 */

import { useCallback, useEffect, useState } from 'react';

/**
 * Available theme options.
 */
export type Theme = 'light' | 'dark' | 'system';

/**
 * Resolved theme (actual applied theme).
 */
export type ResolvedTheme = 'light' | 'dark';

/**
 * Theme state returned by useTheme hook.
 */
interface ThemeState {
  /** Current theme preference */
  theme: Theme;
  /** Resolved theme (actual applied theme) */
  resolvedTheme: ResolvedTheme;
  /** Set theme preference */
  setTheme: (theme: Theme) => void;
  /** Toggle between light and dark */
  toggleTheme: () => void;
}

const THEME_STORAGE_KEY = 'theme';

/**
 * Get the system color scheme preference.
 */
function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') {
    return 'light';
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Resolve the actual theme based on preference.
 */
function resolveTheme(theme: Theme): ResolvedTheme {
  if (theme === 'system') {
    return getSystemTheme();
  }
  return theme;
}

/**
 * Apply theme to the document.
 */
function applyTheme(resolvedTheme: ResolvedTheme): void {
  const root = document.documentElement;

  if (resolvedTheme === 'dark') {
    root.setAttribute('data-theme', 'dark');
  } else {
    root.setAttribute('data-theme', 'light');
  }
}

/**
 * Hook for managing theme state.
 *
 * @example
 * ```tsx
 * function ThemeToggle() {
 *   const { theme, setTheme, toggleTheme } = useTheme();
 *
 *   return (
 *     <button onClick={toggleTheme}>
 *       Current: {theme}
 *     </button>
 *   );
 * }
 * ```
 */
export function useTheme(): ThemeState {
  // Initialize theme from localStorage or default to 'system'
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') {
      return 'system';
    }

    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      return stored;
    }
    return 'system';
  });

  // Track resolved theme
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => resolveTheme(theme));

  // Set theme and persist to localStorage
  const setTheme = useCallback((newTheme: Theme): void => {
    setThemeState(newTheme);
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);

    const resolved = resolveTheme(newTheme);
    setResolvedTheme(resolved);
    applyTheme(resolved);
  }, []);

  // Toggle between light and dark
  const toggleTheme = useCallback((): void => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  }, [resolvedTheme, setTheme]);

  // Listen for system theme changes
  useEffect(() => {
    if (theme !== 'system') {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (): void => {
      const resolved = getSystemTheme();
      setResolvedTheme(resolved);
      applyTheme(resolved);
    };

    // Modern browsers
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [theme]);

  // Apply initial theme on mount
  useEffect(() => {
    applyTheme(resolvedTheme);
  }, [resolvedTheme]);

  return {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
  };
}
