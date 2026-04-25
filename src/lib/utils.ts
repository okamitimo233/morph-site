/**
 * Utility Functions
 *
 * Common utility functions used throughout the application.
 *
 * @see .trellis/spec/frontend/type-safety.md - Type safety guidelines
 */

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combine class names with Tailwind CSS conflict resolution.
 *
 * Uses `clsx` for conditional class joining and `tailwind-merge`
 * for intelligently merging Tailwind CSS classes without conflicts.
 *
 * @example
 * cn('px-4 py-2', 'p-3') // Returns 'p-3' (p-3 overrides px-4 py-2)
 * cn('text-red-500', isPrimary && 'text-blue-500') // Conditional classes
 * cn(['text-sm', 'font-medium']) // Array support
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/**
 * Format a date to a human-readable string.
 *
 * @param date - Date to format
 * @param options - Intl.DateTimeFormat options
 * @returns Formatted date string
 */
export function formatDate(
  date: Date | string,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('zh-CN', options)
}
