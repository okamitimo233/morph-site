/**
 * Theme Toggle Component
 *
 * A dropdown component for switching between light, dark, and system themes.
 * Requires client-side hydration for interactivity.
 *
 * @see .trellis/spec/frontend/islands-architecture.md - Hydration strategies
 * @see .trellis/spec/frontend/react-pitfalls.md - React patterns
 */

import { type ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { type Theme, useTheme } from '@/hooks/useTheme';

interface ThemeToggleProps {
  /** Additional CSS classes */
  className?: string;
}

/**
 * Theme icon component.
 */
function ThemeIcon({ theme }: { theme: Theme | 'resolved' }): ReactElement {
  if (theme === 'dark') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
      </svg>
    );
  }

  if (theme === 'light') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2" />
        <path d="M12 20v2" />
        <path d="m4.93 4.93 1.41 1.41" />
        <path d="m17.66 17.66 1.41 1.41" />
        <path d="M2 12h2" />
        <path d="M20 12h2" />
        <path d="m6.34 17.66-1.41 1.41" />
        <path d="m19.07 4.93-1.41 1.41" />
      </svg>
    );
  }

  // System theme icon
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="20" height="14" x="2" y="3" rx="2" />
      <line x1="8" x2="16" y1="21" y2="21" />
      <line x1="12" x2="12" y1="17" y2="21" />
    </svg>
  );
}

/**
 * Theme option item for the dropdown.
 */
interface ThemeOption {
  value: Theme;
  label: string;
  description: string;
}

const themeOptions: ThemeOption[] = [
  { value: 'light', label: 'Light', description: 'Light theme' },
  { value: 'dark', label: 'Dark', description: 'Dark theme' },
  { value: 'system', label: 'System', description: 'Follow system preference' },
];

/**
 * Theme Toggle Component
 *
 * Provides a dropdown menu to select between light, dark, and system themes.
 */
export default function ThemeToggle({ className }: ThemeToggleProps): ReactElement {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Handle click outside to close dropdown
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!isOpen) return;

      if (event.key === 'Escape') {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    },
    [isOpen]
  );

  // Add event listeners
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleClickOutside, handleKeyDown]);

  // Handle theme selection
  const handleSelectTheme = useCallback(
    (newTheme: Theme) => {
      setTheme(newTheme);
      setIsOpen(false);
      buttonRef.current?.focus();
    },
    [setTheme]
  );

  // Handle button click
  const handleButtonClick = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return (
    <div ref={dropdownRef} className={cn('relative', className)}>
      {/* Toggle Button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={handleButtonClick}
        className={cn(
          'flex items-center justify-center w-10 h-10 rounded-lg',
          'text-foreground-secondary hover:text-foreground',
          'bg-transparent hover:bg-hover',
          'transition-colors duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background'
        )}
        aria-label={`Current theme: ${theme}. Click to change theme.`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <ThemeIcon theme={resolvedTheme} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          role="listbox"
          aria-label="Theme options"
          className={cn(
            'absolute right-0 top-full mt-2 z-50',
            'min-w-[160px] py-1',
            'bg-surface rounded-lg shadow-lg border border-border',
            'animate-scale-in origin-top-right'
          )}
        >
          {themeOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={theme === option.value}
              onClick={() => handleSelectTheme(option.value)}
              className={cn(
                'flex items-center gap-3 w-full px-4 py-2 text-left',
                'text-foreground-secondary hover:text-foreground hover:bg-hover',
                'transition-colors duration-100',
                theme === option.value && 'text-foreground bg-selected'
              )}
            >
              <ThemeIcon theme={option.value} />
              <span className="text-sm font-medium">{option.label}</span>
              {theme === option.value && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ml-auto text-primary"
                  aria-hidden="true"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
