/**
 * Carousel Component
 *
 * A reusable, accessible carousel component with:
 * - Auto-play with pause on hover
 * - Manual navigation (prev/next buttons)
 * - Touch/swipe support
 * - Dot indicators
 * - Infinite loop
 * - GSAP-powered smooth animations
 *
 * @see .trellis/spec/frontend/gsap-animation.md - GSAP animation guidelines
 * @see .trellis/spec/frontend/react-pitfalls.md - React patterns
 */

import {
  type ReactElement,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import gsap from 'gsap';

interface CarouselProps {
  /** Number of slides */
  slideCount: number;
  /** Auto-play interval in milliseconds (0 to disable) */
  autoPlayInterval?: number;
  /** Enable infinite loop */
  loop?: boolean;
  /** Show navigation arrows */
  showArrows?: boolean;
  /** Show dot indicators */
  showDots?: boolean;
  /** Additional CSS class */
  className?: string;
  /** Gap between slides in pixels */
  gap?: number;
  /** Animation duration in seconds */
  animationDuration?: number;
  /** Children (slides) */
  children: ReactNode;
}

/**
 * Carousel Navigation Button
 */
function NavButton({
  direction,
  onClick,
  disabled,
  label,
}: {
  direction: 'prev' | 'next';
  onClick: () => void;
  disabled?: boolean;
  label: string;
}): ReactElement {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`
        absolute top-1/2 -translate-y-1/2 z-10
        w-10 h-10 md:w-12 md:h-12
        flex items-center justify-center
        rounded-full
        bg-surface/90 dark:bg-surface/80
        backdrop-blur-sm
        border border-border
        text-foreground-secondary
        shadow-md
        transition-all duration-200
        hover:bg-background-elevated hover:text-foreground hover:shadow-lg
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary
        disabled:opacity-40 disabled:cursor-not-allowed
        ${direction === 'prev' ? 'left-4 md:left-6' : 'right-4 md:right-6'}
      `}
    >
      {direction === 'prev' ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      )}
    </button>
  );
}

/**
 * Carousel Dot Indicator
 */
function DotIndicator({
  index,
  isActive,
  onClick,
}: {
  index: number;
  isActive: boolean;
  onClick: () => void;
}): ReactElement {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Go to slide ${index + 1}`}
      aria-current={isActive ? 'true' : undefined}
      className={`
        w-2.5 h-2.5 rounded-full
        transition-all duration-300
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary
        ${
          isActive
            ? 'bg-primary w-8'
            : 'bg-foreground-muted/40 hover:bg-foreground-muted/60'
        }
      `}
    />
  );
}

/**
 * Carousel Component
 *
 * Provides a smooth, accessible carousel experience with GSAP animations.
 * Accepts children as slides, making it easy to use with Astro.
 */
export default function Carousel({
  slideCount,
  children,
  autoPlayInterval = 5000,
  loop = true,
  showArrows = true,
  showDots = true,
  className = '',
  gap = 16,
  animationDuration = 0.5,
}: CarouselProps): ReactElement {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const isDraggingRef = useRef(false);
  const gsapContextRef = useRef<gsap.Context | null>(null);

  // Check for reduced motion preference
  const prefersReducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Initialize GSAP context for cleanup
  useEffect(() => {
    if (!containerRef.current) return;

    gsapContextRef.current = gsap.context(() => {
      // All GSAP animations will be tracked here
    }, containerRef);

    return () => {
      gsapContextRef.current?.revert();
    };
  }, []);

  // Navigate to specific slide
  const goToSlide = useCallback(
    (index: number) => {
      if (!slidesRef.current || slideCount === 0) return;

      let targetIndex = index;

      // Handle loop
      if (loop) {
        if (index < 0) {
          targetIndex = slideCount - 1;
        } else if (index >= slideCount) {
          targetIndex = 0;
        }
      } else {
        targetIndex = Math.max(0, Math.min(index, slideCount - 1));
      }

      // Animate slide transition
      const slideWidth = slidesRef.current.offsetWidth + gap;
      const offset = -targetIndex * slideWidth;

      // Kill any existing animation on the slides element
      gsap.killTweensOf(slidesRef.current);

      if (prefersReducedMotion) {
        gsap.set(slidesRef.current, { x: offset });
      } else {
        gsap.to(slidesRef.current, {
          x: offset,
          duration: animationDuration,
          ease: 'power3.out',
        });
      }

      setCurrentIndex(targetIndex);
    },
    [slideCount, loop, gap, animationDuration, prefersReducedMotion]
  );

  // Next slide
  const nextSlide = useCallback(() => {
    goToSlide(currentIndex + 1);
  }, [currentIndex, goToSlide]);

  // Previous slide
  const prevSlide = useCallback(() => {
    goToSlide(currentIndex - 1);
  }, [currentIndex, goToSlide]);

  // Auto-play functionality
  useEffect(() => {
    if (autoPlayInterval <= 0 || slideCount <= 1 || isPaused) {
      return;
    }

    autoPlayRef.current = setInterval(() => {
      nextSlide();
    }, autoPlayInterval);

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [autoPlayInterval, slideCount, isPaused, nextSlide]);

  // Pause auto-play on hover
  const handleMouseEnter = useCallback(() => {
    setIsPaused(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsPaused(false);
  }, []);

  // Touch handlers for swipe support
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
    isDraggingRef.current = true;
    setIsPaused(true);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current || !isDraggingRef.current) return;

    const deltaX = touchStartRef.current.x - e.touches[0].clientX;
    const deltaY = touchStartRef.current.y - e.touches[0].clientY;

    // If vertical scroll is more dominant, don't interfere
    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      return;
    }

    // Prevent page scroll while swiping horizontally
    e.preventDefault();
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStartRef.current || !isDraggingRef.current) return;

      const deltaX = touchStartRef.current.x - e.changedTouches[0].clientX;
      const threshold = 50; // Minimum swipe distance

      if (Math.abs(deltaX) > threshold) {
        if (deltaX > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }

      touchStartRef.current = null;
      isDraggingRef.current = false;
      setIsPaused(false);
    },
    [nextSlide, prevSlide]
  );

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          prevSlide();
          break;
        case 'ArrowRight':
          e.preventDefault();
          nextSlide();
          break;
      }
    },
    [prevSlide, nextSlide]
  );

  // Empty state
  if (slideCount === 0) {
    return (
      <div className={`text-center py-12 text-foreground-tertiary ${className}`}>
        No items to display
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
      onKeyDown={handleKeyDown}
      role="region"
      aria-roledescription="carousel"
      aria-label="Image carousel"
    >
      {/* Slides Container */}
      <div
        className="overflow-hidden rounded-2xl"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          ref={slidesRef}
          className="flex"
          style={{ gap: `${gap}px` }}
        >
          {children}
        </div>
      </div>

      {/* Navigation Arrows */}
      {showArrows && slideCount > 1 && (
        <>
          <NavButton
            direction="prev"
            onClick={prevSlide}
            disabled={!loop && currentIndex === 0}
            label="Previous slide"
          />
          <NavButton
            direction="next"
            onClick={nextSlide}
            disabled={!loop && currentIndex === slideCount - 1}
            label="Next slide"
          />
        </>
      )}

      {/* Dot Indicators */}
      {showDots && slideCount > 1 && (
        <div
          className="flex items-center justify-center gap-2 mt-6"
          role="tablist"
          aria-label="Carousel navigation"
        >
          {Array.from({ length: slideCount }).map((_, index) => (
            <DotIndicator
              key={index}
              index={index}
              isActive={index === currentIndex}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      )}

      {/* Screen reader announcements */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Slide {currentIndex + 1} of {slideCount}
      </div>
    </div>
  );
}
