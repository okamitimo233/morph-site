/**
 * Animated Background Component
 *
 * A Canvas-based animated background with subtle particles and gradient flow.
 * Performance-optimized with reduced motion support.
 *
 * @see .trellis/spec/frontend/gsap-animation.md - GSAP animation guidelines
 * @see .trellis/spec/frontend/react-pitfalls.md - React patterns
 */

import { type ReactElement, useCallback, useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  hue: number;
}

interface AnimatedBackgroundProps {
  /** Additional CSS classes */
  className?: string;
  /** Particle count (default: 50) */
  particleCount?: number;
  /** Enable gradient animation */
  enableGradient?: boolean;
  /** Enable particles */
  enableParticles?: boolean;
}

/**
 * Get theme-aware colors from CSS variables.
 */
function getThemeColors(): {
  primaryHue: number;
  secondaryHue: number;
  background: string;
} {
  if (typeof window === 'undefined') {
    return { primaryHue: 265, secondaryHue: 295, background: '#fafafa' };
  }

  const isDark =
    document.documentElement.getAttribute('data-theme') === 'dark' ||
    (document.documentElement.getAttribute('data-theme') !== 'light' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);

  // Extract hue from primary color (OKLCH format)
  // Primary hue: 265, Secondary hue: 295
  return {
    primaryHue: 265,
    secondaryHue: 295,
    background: isDark ? '#1a1a1f' : '#fafafa',
  };
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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const gradientOffsetRef = useRef(0);

  // Check for reduced motion preference
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Initialize particles
  const initParticles = useCallback(
    (width: number, height: number): void => {
      const particles: Particle[] = [];
      const colors = getThemeColors();

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 2 + 1,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: (Math.random() - 0.5) * 0.3,
          opacity: Math.random() * 0.3 + 0.1,
          hue: Math.random() > 0.5 ? colors.primaryHue : colors.secondaryHue,
        });
      }

      particlesRef.current = particles;
    },
    [particleCount]
  );

  // Draw gradient background
  const drawGradient = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number): void => {
      const colors = getThemeColors();
      const offset = gradientOffsetRef.current;

      // Create flowing gradient blobs
      const gradient1 = ctx.createRadialGradient(
        width * 0.3 + Math.sin(offset) * width * 0.1,
        height * 0.3 + Math.cos(offset) * height * 0.05,
        0,
        width * 0.3,
        height * 0.3,
        width * 0.6
      );

      const gradient2 = ctx.createRadialGradient(
        width * 0.7 + Math.cos(offset * 0.7) * width * 0.08,
        height * 0.6 + Math.sin(offset * 0.7) * height * 0.08,
        0,
        width * 0.7,
        height * 0.6,
        width * 0.5
      );

      // Theme-aware gradient colors (very subtle)
      const isDark =
        document.documentElement.getAttribute('data-theme') === 'dark' ||
        (document.documentElement.getAttribute('data-theme') !== 'light' &&
          window.matchMedia('(prefers-color-scheme: dark)').matches);

      if (isDark) {
        gradient1.addColorStop(0, 'oklch(0.35 0.03 265 / 0.15)');
        gradient1.addColorStop(1, 'transparent');

        gradient2.addColorStop(0, 'oklch(0.30 0.04 295 / 0.12)');
        gradient2.addColorStop(1, 'transparent');
      } else {
        gradient1.addColorStop(0, 'oklch(0.85 0.04 265 / 0.2)');
        gradient1.addColorStop(1, 'transparent');

        gradient2.addColorStop(0, 'oklch(0.90 0.03 295 / 0.15)');
        gradient2.addColorStop(1, 'transparent');
      }

      // Clear and draw
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = colors.background;
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = gradient1;
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = gradient2;
      ctx.fillRect(0, 0, width, height);
    },
    []
  );

  // Draw particles
  const drawParticles = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number): void => {
      const particles = particlesRef.current;
      const mouseX = mouseRef.current.x;
      const mouseY = mouseRef.current.y;

      particles.forEach((particle) => {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Subtle mouse interaction
        const dx = mouseX - particle.x;
        const dy = mouseY - particle.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 150) {
          const force = (150 - dist) / 150;
          particle.x -= (dx / dist) * force * 0.5;
          particle.y -= (dy / dist) * force * 0.5;
        }

        // Wrap around edges
        if (particle.x < 0) particle.x = width;
        if (particle.x > width) particle.x = 0;
        if (particle.y < 0) particle.y = height;
        if (particle.y > height) particle.y = 0;

        // Draw particle
        const isDark =
          document.documentElement.getAttribute('data-theme') === 'dark' ||
          (document.documentElement.getAttribute('data-theme') !== 'light' &&
            window.matchMedia('(prefers-color-scheme: dark)').matches);

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);

        // Use OKLCH color format
        const lightness = isDark ? 0.7 : 0.4;
        ctx.fillStyle = `oklch(${lightness} 0.1 ${particle.hue} / ${particle.opacity})`;
        ctx.fill();
      });
    },
    []
  );

  // Animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (!canvas || !ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Update gradient offset
    if (enableGradient && !prefersReducedMotion) {
      gradientOffsetRef.current += 0.005;
    }

    // Draw background and effects
    if (enableGradient) {
      drawGradient(ctx, width, height);
    }

    if (enableParticles && !prefersReducedMotion) {
      drawParticles(ctx, width, height);
    }

    // Continue animation
    animationRef.current = requestAnimationFrame(animate);
  }, [enableGradient, enableParticles, prefersReducedMotion, drawGradient, drawParticles]
  );

  // Handle resize
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;

    if (!canvas || !container) return;

    const { width, height } = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
    }

    // Re-initialize particles for new size
    initParticles(width, height);
  }, [initParticles]);

  // Handle mouse move with gsap.quickTo for smooth updates
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }, [prefersReducedMotion]);

  // Setup canvas and animation
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;

    if (!canvas || !container) return;

    // Initial setup
    handleResize();

    // Start animation (if not reduced motion)
    if (!prefersReducedMotion) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      // Just draw static gradient
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const { width, height } = container.getBoundingClientRect();
        drawGradient(ctx, width, height);
      }
    }

    // Event listeners
    window.addEventListener('resize', handleResize);
    container.addEventListener('mousemove', handleMouseMove);

    return () => {
      // Cleanup animation frame
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      // Remove event listeners
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleResize, handleMouseMove, animate, prefersReducedMotion, drawGradient]);

  // Handle theme changes
  useEffect(() => {
    if (prefersReducedMotion) return;

    const observer = new MutationObserver(() => {
      // Redraw on theme change
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      const container = containerRef.current;

      if (canvas && ctx && container) {
        const { width, height } = container.getBoundingClientRect();
        drawGradient(ctx, width, height);
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => observer.disconnect();
  }, [prefersReducedMotion, drawGradient]);

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
  );
}
