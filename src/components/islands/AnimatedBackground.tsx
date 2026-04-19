/**
 * Animated Background Component
 *
 * A Canvas-based animated background with subtle particles and gradient flow.
 * Performance-optimized with reduced motion support.
 *
 * @see .trellis/spec/frontend/gsap-animation.md - GSAP animation guidelines
 * @see .trellis/spec/frontend/react-pitfalls.md - React patterns
 */

import { type ReactElement, useCallback, useEffect, useRef } from 'react'
import gsap from 'gsap'

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
  hue: number
}

interface AnimatedBackgroundProps {
  /** Additional CSS classes */
  className?: string
  /** Particle count (default: 50) */
  particleCount?: number
  /** Enable gradient animation */
  enableGradient?: boolean
  /** Enable particles */
  enableParticles?: boolean
}

// OKLCH color parameters for smooth interpolation
interface ColorState {
  // Background RGB (0-255)
  bgR: number
  bgG: number
  bgB: number
  // Gradient 1: OKLCH (L, C, H, Alpha)
  g1L: number
  g1C: number
  g1H: number
  g1A: number
  // Gradient 2: OKLCH (L, C, H, Alpha)
  g2L: number
  g2C: number
  g2H: number
  g2A: number
  // Particle lightness
  particleL: number
}

// Light theme color values
const LIGHT_STATE: ColorState = {
  bgR: 250,
  bgG: 250,
  bgB: 250,
  g1L: 0.85,
  g1C: 0.04,
  g1H: 265,
  g1A: 0.2,
  g2L: 0.9,
  g2C: 0.03,
  g2H: 295,
  g2A: 0.15,
  particleL: 0.4,
}

// Dark theme color values
const DARK_STATE: ColorState = {
  bgR: 26,
  bgG: 26,
  bgB: 31,
  g1L: 0.35,
  g1C: 0.03,
  g1H: 265,
  g1A: 0.15,
  g2L: 0.3,
  g2C: 0.04,
  g2H: 295,
  g2A: 0.12,
  particleL: 0.7,
}

/**
 * Get current theme (light or dark)
 */
function isDarkTheme(): boolean {
  if (typeof window === 'undefined') return false

  return (
    document.documentElement.getAttribute('data-theme') === 'dark' ||
    (document.documentElement.getAttribute('data-theme') !== 'light' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)
  )
}

/**
 * Create OKLCH color string from parameters
 */
function oklch(l: number, c: number, h: number, a: number): string {
  return `oklch(${l.toFixed(2)} ${c.toFixed(2)} ${h.toFixed(0)} / ${a.toFixed(2)})`
}

/**
 * Animated Background Component
 *
 * Creates a subtle, elegant animated background with:
 * - Floating particles with gentle movement
 * - Gradient color flow
 * - Mouse interaction (subtle parallax)
 * - Respects prefers-reduced-motion
 */
export default function AnimatedBackground({
  className = '',
  particleCount = 50,
  enableGradient = true,
  enableParticles = true,
}: AnimatedBackgroundProps): ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | null>(null)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const gradientOffsetRef = useRef(0)

  // Animated color state for smooth theme transitions
  const colorStateRef = useRef<ColorState>(isDarkTheme() ? { ...DARK_STATE } : { ...LIGHT_STATE })

  // Check for reduced motion preference
  const prefersReducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Initialize particles
  const initParticles = useCallback(
    (width: number, height: number): void => {
      const particles: Particle[] = []

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 2 + 1,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: (Math.random() - 0.5) * 0.3,
          opacity: Math.random() * 0.3 + 0.1,
          hue: Math.random() > 0.5 ? 265 : 295,
        })
      }

      particlesRef.current = particles
    },
    [particleCount]
  )

  // Draw gradient background with animated colors
  const drawGradient = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number): void => {
      const offset = gradientOffsetRef.current
      const state = colorStateRef.current

      // Create flowing gradient blobs
      const gradient1 = ctx.createRadialGradient(
        width * 0.3 + Math.sin(offset) * width * 0.1,
        height * 0.3 + Math.cos(offset) * height * 0.05,
        0,
        width * 0.3,
        height * 0.3,
        width * 0.6
      )

      const gradient2 = ctx.createRadialGradient(
        width * 0.7 + Math.cos(offset * 0.7) * width * 0.08,
        height * 0.6 + Math.sin(offset * 0.7) * height * 0.08,
        0,
        width * 0.7,
        height * 0.6,
        width * 0.5
      )

      // Use animated color values
      gradient1.addColorStop(0, oklch(state.g1L, state.g1C, state.g1H, state.g1A))
      gradient1.addColorStop(1, 'transparent')

      gradient2.addColorStop(0, oklch(state.g2L, state.g2C, state.g2H, state.g2A))
      gradient2.addColorStop(1, 'transparent')

      // Clear and draw
      ctx.clearRect(0, 0, width, height)

      // Animated background color
      const bgColor = `rgb(${Math.round(state.bgR)}, ${Math.round(state.bgG)}, ${Math.round(state.bgB)})`
      ctx.fillStyle = bgColor
      ctx.fillRect(0, 0, width, height)

      ctx.fillStyle = gradient1
      ctx.fillRect(0, 0, width, height)

      ctx.fillStyle = gradient2
      ctx.fillRect(0, 0, width, height)
    },
    []
  )

  // Draw particles with animated lightness
  const drawParticles = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number): void => {
      const particles = particlesRef.current
      const mouseX = mouseRef.current.x
      const mouseY = mouseRef.current.y
      const lightness = colorStateRef.current.particleL

      particles.forEach((particle) => {
        // Update position
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Subtle mouse interaction
        const dx = mouseX - particle.x
        const dy = mouseY - particle.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < 150) {
          const force = (150 - dist) / 150
          particle.x -= (dx / dist) * force * 0.5
          particle.y -= (dy / dist) * force * 0.5
        }

        // Wrap around edges
        if (particle.x < 0) particle.x = width
        if (particle.x > width) particle.x = 0
        if (particle.y < 0) particle.y = height
        if (particle.y > height) particle.y = 0

        // Draw particle with animated lightness
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = `oklch(${lightness.toFixed(2)} 0.1 ${particle.hue} / ${particle.opacity})`
        ctx.fill()
      })
    },
    []
  )

  // Animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')

    if (!canvas || !ctx) return

    const width = canvas.width
    const height = canvas.height

    // Update gradient offset
    if (enableGradient && !prefersReducedMotion) {
      gradientOffsetRef.current += 0.005
    }

    // Draw background and effects
    if (enableGradient) {
      drawGradient(ctx, width, height)
    }

    if (enableParticles && !prefersReducedMotion) {
      drawParticles(ctx, width, height)
    }

    // Continue animation
    animationRef.current = requestAnimationFrame(animate)
  }, [enableGradient, enableParticles, prefersReducedMotion, drawGradient, drawParticles])

  // Handle resize
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current
    const container = containerRef.current

    if (!canvas || !container) return

    const { width, height } = container.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1

    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`

    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.scale(dpr, dpr)
    }

    // Re-initialize particles for new size
    initParticles(width, height)
  }, [initParticles])

  // Handle mouse move
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (prefersReducedMotion) return

      const canvas = canvasRef.current
      if (!canvas) return

      const rect = canvas.getBoundingClientRect()
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
    },
    [prefersReducedMotion]
  )

  // Setup canvas and animation
  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current

    if (!canvas || !container) return

    // Initial setup
    handleResize()

    // Start animation (if not reduced motion)
    if (!prefersReducedMotion) {
      animationRef.current = requestAnimationFrame(animate)
    } else {
      // Just draw static gradient
      const ctx = canvas.getContext('2d')
      if (ctx) {
        const { width, height } = container.getBoundingClientRect()
        drawGradient(ctx, width, height)
      }
    }

    // Event listeners
    window.addEventListener('resize', handleResize)
    container.addEventListener('mousemove', handleMouseMove)

    return () => {
      // Cleanup animation frame
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }

      // Remove event listeners
      window.removeEventListener('resize', handleResize)
      container.removeEventListener('mousemove', handleMouseMove)
    }
  }, [handleResize, handleMouseMove, animate, prefersReducedMotion, drawGradient])

  // Handle theme changes with smooth color transition
  useEffect(() => {
    if (prefersReducedMotion) {
      // For reduced motion, set colors directly without animation
      const targetState = isDarkTheme() ? DARK_STATE : LIGHT_STATE
      Object.assign(colorStateRef.current, targetState)
      return
    }

    const observer = new MutationObserver(() => {
      const targetState = isDarkTheme() ? DARK_STATE : LIGHT_STATE

      // Animate all color values to target
      gsap.to(colorStateRef.current, {
        bgR: targetState.bgR,
        bgG: targetState.bgG,
        bgB: targetState.bgB,
        g1L: targetState.g1L,
        g1C: targetState.g1C,
        g1H: targetState.g1H,
        g1A: targetState.g1A,
        g2L: targetState.g2L,
        g2C: targetState.g2C,
        g2H: targetState.g2H,
        g2A: targetState.g2A,
        particleL: targetState.particleL,
        duration: 0.3,
        ease: 'power2.out',
      })
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })

    return () => observer.disconnect()
  }, [prefersReducedMotion])

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ touchAction: 'none' }}
      />
    </div>
  )
}
