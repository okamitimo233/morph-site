/**
 * Theme Toggle Component
 *
 * A simple toggle button for switching between light and dark themes.
 * Uses GSAP for smooth icon transition animation (rotation + scale).
 *
 * @see .trellis/spec/frontend/gsap-animation.md - GSAP animation guidelines
 * @see .trellis/spec/frontend/islands-architecture.md - Hydration strategies
 * @see .trellis/spec/frontend/react-pitfalls.md - React patterns
 */

import { type ReactElement, useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { cn } from '@/lib/utils'
import { useTheme } from '@/hooks/useTheme'

interface ThemeToggleProps {
  /** Additional CSS classes */
  className?: string
}

/**
 * Sun Icon SVG
 */
function SunIcon(): ReactElement {
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
  )
}

/**
 * Moon Icon SVG
 */
function MoonIcon(): ReactElement {
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
  )
}

/**
 * Theme Toggle Component
 *
 * Provides a toggle button to switch between light and dark themes.
 * Features smooth icon transition using GSAP (rotation + scale).
 */
export default function ThemeToggle({ className }: ThemeToggleProps): ReactElement {
  const { resolvedTheme, toggleTheme } = useTheme()
  const containerRef = useRef<HTMLButtonElement>(null)
  const sunIconRef = useRef<HTMLSpanElement>(null)
  const moonIconRef = useRef<HTMLSpanElement>(null)
  const gsapContextRef = useRef<gsap.Context | null>(null)

  // Track current icon state locally for immediate animation
  const [iconState, setIconState] = useState<'sun' | 'moon'>(
    resolvedTheme === 'dark' ? 'moon' : 'sun'
  )

  // Sync icon state with resolved theme on mount
  useEffect(() => {
    setIconState(resolvedTheme === 'dark' ? 'moon' : 'sun')
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Set initial visibility
  useEffect(() => {
    if (iconState === 'sun') {
      gsap.set(sunIconRef.current, { opacity: 1, scale: 1, rotation: 0 })
      gsap.set(moonIconRef.current, { opacity: 0, scale: 0.5, rotation: -90 })
    } else {
      gsap.set(sunIconRef.current, { opacity: 0, scale: 0.5, rotation: 90 })
      gsap.set(moonIconRef.current, { opacity: 1, scale: 1, rotation: 0 })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Handle theme toggle with animation
  const handleToggle = (): void => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const newIconState = iconState === 'sun' ? 'moon' : 'sun'
    setIconState(newIconState)

    if (prefersReducedMotion) {
      // Skip animation, set directly
      if (newIconState === 'moon') {
        gsap.set(sunIconRef.current, { opacity: 0, scale: 0.5 })
        gsap.set(moonIconRef.current, { opacity: 1, scale: 1 })
      } else {
        gsap.set(sunIconRef.current, { opacity: 1, scale: 1 })
        gsap.set(moonIconRef.current, { opacity: 0, scale: 0.5 })
      }
    } else {
      // Animate transition
      gsapContextRef.current?.revert()
      gsapContextRef.current = gsap.context(() => {
        if (newIconState === 'moon') {
          // Sun -> Moon
          gsap.to(sunIconRef.current, {
            opacity: 0,
            scale: 0.5,
            rotation: 90,
            duration: 0.15,
            ease: 'power2.in',
          })
          gsap.fromTo(
            moonIconRef.current,
            { opacity: 0, scale: 0.5, rotation: -90 },
            {
              opacity: 1,
              scale: 1,
              rotation: 0,
              duration: 0.15,
              delay: 0.15,
              ease: 'power2.out',
            }
          )
        } else {
          // Moon -> Sun
          gsap.to(moonIconRef.current, {
            opacity: 0,
            scale: 0.5,
            rotation: -90,
            duration: 0.15,
            ease: 'power2.in',
          })
          gsap.fromTo(
            sunIconRef.current,
            { opacity: 0, scale: 0.5, rotation: 90 },
            {
              opacity: 1,
              scale: 1,
              rotation: 0,
              duration: 0.15,
              delay: 0.15,
              ease: 'power2.out',
            }
          )
        }
      }, containerRef)
    }

    // Trigger theme toggle
    toggleTheme()
  }

  return (
    <button
      ref={containerRef}
      type="button"
      onClick={handleToggle}
      className={cn(
        'relative flex items-center justify-center w-10 h-10 rounded-lg',
        'text-foreground-secondary hover:text-foreground',
        'bg-transparent hover:bg-hover',
        'transition-colors duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        className
      )}
      aria-label={`Switch to ${iconState === 'moon' ? 'light' : 'dark'} theme`}
    >
      <span
        ref={sunIconRef}
        className="absolute theme-icon-sun"
        style={{ transformOrigin: 'center' }}
      >
        <SunIcon />
      </span>
      <span
        ref={moonIconRef}
        className="absolute theme-icon-moon"
        style={{ transformOrigin: 'center' }}
      >
        <MoonIcon />
      </span>
    </button>
  )
}
