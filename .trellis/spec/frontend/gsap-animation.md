# GSAP Animation Guidelines

> GSAP integration, animation patterns, and best practices for Astro + React projects.

---

## GSAP Setup

### Installation

```bash
pnpm add gsap
```

### Basic Usage in React

```tsx
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function AnimatedHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!containerRef.current || !titleRef.current) return;

    // Create animation
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      });
    }, containerRef);

    // Cleanup on unmount
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef}>
      <h1 ref={titleRef}>Animated Title</h1>
    </div>
  );
}
```

---

## GSAP Context

Always use `gsap.context()` for proper cleanup:

```tsx
useEffect(() => {
  const ctx = gsap.context(() => {
    // All GSAP animations go here
    gsap.to('.box', { x: 100 });
    gsap.from('.title', { opacity: 0 });
  }, containerRef);

  return () => ctx.revert(); // Cleanup all animations
}, []);
```

### Why Context?

- Automatically tracks all GSAP animations
- Easy cleanup with `ctx.revert()`
- Scopes animations to a container
- Prevents memory leaks

---

## Common Animation Patterns

### 1. Entrance Animations

```tsx
function FadeIn({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      gsap.from(ref.current, {
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return <div ref={ref}>{children}</div>;
}
```

### 2. Stagger Animations

```tsx
function AnimatedList({ items }: { items: string[] }) {
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!listRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('li', {
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1, // Each item animates 0.1s after the previous
        ease: 'power2.out',
      });
    }, listRef);

    return () => ctx.revert();
  }, []);

  return (
    <ul ref={listRef}>
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}
```

### 3. Scroll-Triggered Animations

```tsx
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function ScrollReveal({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      gsap.from(ref.current, {
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 80%', // When top of element reaches 80% from top
          toggleActions: 'play none none reverse',
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return <div ref={ref}>{children}</div>;
}
```

### 4. Hover Animations

```tsx
function HoverButton({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const button = ref.current;

    const onEnter = () => {
      gsap.to(button, {
        scale: 1.05,
        duration: 0.2,
        ease: 'power2.out',
      });
    };

    const onLeave = () => {
      gsap.to(button, {
        scale: 1,
        duration: 0.2,
        ease: 'power2.out',
      });
    };

    button.addEventListener('mouseenter', onEnter);
    button.addEventListener('mouseleave', onLeave);

    return () => {
      button.removeEventListener('mouseenter', onEnter);
      button.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return <button ref={ref}>{children}</button>;
}
```

---

## Timeline Animations

Use timelines for sequenced animations:

```tsx
function HeroAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.from('.hero-title', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      })
        .from('.hero-subtitle', {
          y: 30,
          opacity: 0,
          duration: 0.6,
        }, '-=0.4') // Start 0.4s before previous ends
        .from('.hero-button', {
          y: 20,
          opacity: 0,
          duration: 0.5,
        }, '-=0.3');
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef}>
      <h1 className="hero-title">Welcome</h1>
      <p className="hero-subtitle">Build amazing things</p>
      <button className="hero-button">Get Started</button>
    </div>
  );
}
```

---

## GSAP Plugins

### ScrollTrigger

```tsx
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Pin element during scroll
gsap.to('.pinned-section', {
  scrollTrigger: {
    trigger: '.pinned-section',
    pin: true,
    start: 'top top',
    end: '+=500',
  },
});

// Scrub animation with scroll
gsap.to('.progress-bar', {
  scrollTrigger: {
    trigger: '.content',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 1, // Smooth scrubbing
  },
  width: '100%',
});
```

### TextPlugin

```tsx
import { TextPlugin } from 'gsap/TextPlugin';

gsap.registerPlugin(TextPlugin);

// Typewriter effect
gsap.to('.typing-text', {
  duration: 2,
  text: 'This text types out character by character',
  ease: 'none',
});
```

---

## Performance Best Practices

### 1. Use will-change Sparingly

```tsx
// Good: Let GSAP handle optimization
gsap.to(element, { x: 100, duration: 1 });

// Avoid: Manual will-change
// element.style.willChange = 'transform';
```

### 2. Animate Transform and Opacity

```tsx
// Good: Use transform (GPU accelerated)
gsap.to(element, {
  x: 100,     // transform: translateX
  y: 50,      // transform: translateY
  scale: 1.1, // transform: scale
  rotation: 45, // transform: rotate
  opacity: 0.5,
});

// Avoid: Animate layout properties
gsap.to(element, {
  left: 100,  // Triggers reflow
  width: 200, // Triggers reflow
});
```

### 3. Use React-friendly Patterns

```tsx
// Good: Store GSAP instances in refs for control
function AnimatedComponent() {
  const ref = useRef<HTMLDivElement>(null);
  const animationRef = useRef<gsap.core.Tween>();

  useEffect(() => {
    animationRef.current = gsap.to(ref.current, {
      x: 100,
      paused: true, // Start paused
    });
  }, []);

  const play = () => animationRef.current?.play();
  const pause = () => animationRef.current?.pause();
  const reverse = () => animationRef.current?.reverse();

  return <div ref={ref}>...</div>;
}
```

---

## Integration with Astro

### Client-Side Only

GSAP requires client-side JavaScript, so it only works in hydrated components:

```astro
---
// GSAP animations only work with client:* directive
import AnimatedHero from '../components/islands/AnimatedHero';
---

<!-- This will have animations -->
<AnimatedHero client:visible />

<!-- This will NOT have animations (no hydration) -->
<AnimatedHero />
```

### SSR-Safe Pattern

```tsx
function AnimatedComponent() {
  const ref = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !ref.current) return;

    const ctx = gsap.context(() => {
      // Animations here
    }, ref);

    return () => ctx.revert();
  }, [isClient]);

  return <div ref={ref}>Content</div>;
}
```

---

## Common Easing Functions

| Ease            | Description              | Use Case              |
| --------------- | ------------------------ | --------------------- |
| `power1.out`    | Subtle ease-out          | Simple transitions    |
| `power2.out`    | Medium ease-out          | Entrance animations   |
| `power3.out`    | Strong ease-out          | Dramatic reveals      |
| `power4.out`    | Very strong ease-out     | Emphasis              |
| `back.out`      | Slight overshoot         | Playful animations    |
| `elastic.out`   | Elastic bounce           | Bouncy effects        |
| `bounce.out`    | Bounce                   | Playful feedback      |
| `none`          | Linear                   | Scrubbed animations   |

---

## Quick Reference

| Task                    | Code                                              |
| ----------------------- | ------------------------------------------------- |
| Basic animation         | `gsap.to(el, { x: 100, duration: 1 })`            |
| From animation          | `gsap.from(el, { opacity: 0 })`                   |
| Timeline                | `gsap.timeline().to(...).to(...)`                 |
| Stagger                 | `gsap.to('.item', { stagger: 0.1 })`              |
| ScrollTrigger           | `scrollTrigger: { trigger: el, start: 'top 80%' }` |
| Cleanup                 | `gsap.context(() => {...}, ref); return ctx.revert` |
| Pause/Play              | `tween.pause(); tween.play();`                    |

---

**Language**: All documentation must be written in **English**.
