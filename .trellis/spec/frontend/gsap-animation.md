# GSAP Animation Guidelines

> GSAP integration, animation patterns, and best practices for Astro + React projects.

---

## Core Tween Methods

| Method                        | Purpose                                  |
| ----------------------------- | ---------------------------------------- |
| `gsap.to(targets, vars)`      | Animate from current state to `vars`     |
| `gsap.from(targets, vars)`    | Animate from `vars` to current state     |
| `gsap.fromTo(targets, from, to)` | Explicit start and end states         |
| `gsap.set(targets, vars)`     | Apply immediately (duration: 0)          |

Always use **camelCase** property names (e.g., `backgroundColor`, `rotationX`).

---

## Common vars Properties

| Property          | Description                                                |
| ----------------- | ---------------------------------------------------------- |
| `duration`        | Seconds (default 0.5)                                      |
| `delay`           | Seconds before start                                       |
| `ease`            | Easing function (default `"power1.out"`)                   |
| `stagger`         | Number `0.1` or object `{ amount: 0.3, from: "center" }`   |
| `repeat`          | Number or `-1` for infinite                                |
| `yoyo`            | Alternates direction with repeat                           |
| `overwrite`       | `false` (default), `true`, or `"auto"`                     |
| `immediateRender` | Default `true` for from()/fromTo()                         |
| `onComplete`      | Callback when animation finishes                           |
| `onStart`         | Callback when animation starts                             |
| `onUpdate`        | Callback on each frame                                     |

### Easing Options

Built-in eases: `power1`–`power4`, `back`, `bounce`, `circ`, `elastic`, `expo`, `sine`. Each has `.in`, `.out`, `.inOut` variants.

```typescript
// Common easing patterns
gsap.to(element, { ease: "power2.out" });      // Standard ease-out
gsap.to(element, { ease: "back.out(1.7)" });   // Slight overshoot
gsap.to(element, { ease: "elastic.out(1, 0.3)" }); // Elastic bounce
gsap.to(element, { ease: "none" });            // Linear (for scrub)
```

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

## Transforms and CSS

Prefer GSAP's **transform aliases** over raw `transform` string:

| GSAP Property               | Equivalent              |
| --------------------------- | ----------------------- |
| `x`, `y`, `z`               | translateX/Y/Z (px)     |
| `xPercent`, `yPercent`      | translateX/Y in %       |
| `scale`, `scaleX`, `scaleY` | scale                   |
| `rotation`                  | rotate (deg)            |
| `rotationX`, `rotationY`    | 3D rotate               |
| `skewX`, `skewY`            | skew                    |
| `transformOrigin`           | transform-origin        |

### Special Properties

| Property        | Description                                             |
| --------------- | ------------------------------------------------------- |
| `autoAlpha`     | Prefer over `opacity`. At 0: also sets `visibility: hidden` |
| CSS variables   | `"--hue": 180`                                          |
| `clearProps`    | `"all"` or comma-separated; removes inline styles on complete |
| Relative values | `"+=20"`, `"-=10"`, `"*=2"`                             |

### Function-Based Values

```typescript
gsap.to(".item", {
  x: (i, target, targets) => i * 50,
  stagger: 0.1,
});
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

### Position Parameter

Third argument controls placement:

| Syntax           | Meaning                                    |
| ---------------- | ------------------------------------------ |
| `1`              | Absolute: at 1s                            |
| `"+=0.5"`        | Relative: 0.5s after end                   |
| `"-=0.2"`        | Relative: 0.2s before end                  |
| `"intro"`        | At label "intro"                           |
| `"intro+=0.3"`   | 0.3s after label "intro"                   |
| `"<"`            | Same start as previous                     |
| `">"`            | After previous ends                        |
| `"<0.2"`         | 0.2s after previous starts                 |

```typescript
const tl = gsap.timeline();
tl.to(".a", { x: 100 }, 0);
tl.to(".b", { y: 50 }, "<");    // same start as .a
tl.to(".c", { opacity: 0 }, "<0.2"); // 0.2s after .b starts
```

### Labels

```typescript
const tl = gsap.timeline();
tl.addLabel("intro", 0);
tl.to(".a", { x: 100 }, "intro");
tl.addLabel("outro", "+=0.5");
tl.play("outro");              // Jump to label
tl.tweenFromTo("intro", "outro"); // Play from intro to outro
```

### Timeline Options

| Option      | Description                             |
| ----------- | --------------------------------------- |
| `paused`    | `true` to create paused; call `.play()` |
| `repeat`    | Apply to whole timeline                 |
| `yoyo`      | Alternates direction with repeat        |
| `defaults`  | Vars merged into every child tween      |

### Playback Control

```typescript
tl.play();           // Play
tl.pause();          // Pause
tl.reverse();        // Reverse
tl.restart();        // Restart from beginning
tl.time(2);          // Jump to 2 seconds
tl.progress(0.5);    // Jump to 50%
tl.kill();           // Destroy timeline
```

### Nesting Timelines

```typescript
const master = gsap.timeline();
const child = gsap.timeline();
child.to(".a", { x: 100 }).to(".b", { y: 50 });
master.add(child, 0);
```

---

## gsap.matchMedia() (Responsive + Accessibility)

Runs setup only when a media query matches; auto-reverts when it stops matching.

```typescript
let mm = gsap.matchMedia();

mm.add(
  {
    isDesktop: "(min-width: 800px)",
    reduceMotion: "(prefers-reduced-motion: reduce)",
  },
  (context) => {
    const { isDesktop, reduceMotion } = context.conditions;
    gsap.to(".box", {
      rotation: isDesktop ? 360 : 180,
      duration: reduceMotion ? 0 : 2,
    });
  }
);
```

### When to Use

- Responsive animations (different behaviors for mobile/desktop)
- Respecting `prefers-reduced-motion` for accessibility
- Auto-cleanup when media query no longer matches

---

## gsap.quickTo() for Frequent Updates

For high-frequency updates (mouse tracking, drag), use `quickTo` for better performance:

```typescript
let xTo = gsap.quickTo("#id", "x", { duration: 0.4, ease: "power3" });
let yTo = gsap.quickTo("#id", "y", { duration: 0.4, ease: "power3" });

container.addEventListener("mousemove", (e) => {
  xTo(e.pageX);
  yTo(e.pageY);
});
```

### Benefits

- Reuses the same tween instance
- Much faster than creating new tweens on each event
- Ideal for mouse-following, parallax, drag effects

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

### MorphSVGPlugin

```tsx
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';

gsap.registerPlugin(MorphSVGPlugin);

// Path morphing animation
gsap.to('#shape-path', {
  morphSVG: 'M10 10 L90 10 L90 90 L10 90 Z', // Target path
  duration: 0.5,
  ease: 'power2.inOut',
});
```

#### MorphSVG Caveats

**Path Structure Must Match**: MorphSVG works best when source and target paths have similar structure.

| Scenario | Works? | Alternative |
|----------|--------|-------------|
| Single path → Single path | ✅ Yes | - |
| Multi-segment → Multi-segment (same count) | ✅ Yes | - |
| Multi-segment → Single path | ❌ No | Use two separate elements with opacity/crossfade |
| Circle/Rect → Path | ✅ Yes | MorphSVG auto-converts shapes |

**Best Practice for Icon Switching**:
```tsx
// AVOID: Morphing multi-segment sun to single-segment moon
const SUN_PATH = 'M12 2v2 M12 20v2 ...'; // Multiple segments
const MOON_PATH = 'M12 3a6 6 0 0 0 9 9...'; // Single segment
gsap.to('#icon', { morphSVG: MOON_PATH }); // Won't work correctly

// PREFER: Two separate icons with rotation/scale animation
function ThemeToggle() {
  const sunRef = useRef<HTMLSpanElement>(null);
  const moonRef = useRef<HTMLSpanElement>(null);

  const handleToggle = () => {
    gsap.to(sunRef.current, { opacity: 0, scale: 0.5, rotation: 90 });
    gsap.fromTo(moonRef.current,
      { opacity: 0, scale: 0.5, rotation: -90 },
      { opacity: 1, scale: 1, rotation: 0, delay: 0.15 }
    );
  };
}
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

## Canvas Animation with Theme Transitions

Canvas elements don't inherit CSS transitions. For smooth theme transitions on Canvas:

### Problem: Instant Color Switch

```tsx
// WRONG: Canvas instantly switches on theme change
const draw = () => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  ctx.fillStyle = isDark ? '#1a1a1f' : '#fafafa'; // Instant switch!
};
```

### Solution: Animate Color Values with GSAP

```tsx
// Color state with numeric values for interpolation
interface ColorState {
  bgR: number; bgG: number; bgB: number;  // Background RGB
  g1L: number; g1C: number; g1H: number;  // Gradient OKLCH
  particleL: number;                       // Particle lightness
}

const LIGHT_STATE: ColorState = { bgR: 250, bgG: 250, bgB: 250, ... };
const DARK_STATE: ColorState = { bgR: 26, bgG: 26, bgB: 31, ... };

// Store animated state
const colorStateRef = useRef<ColorState>({ ...LIGHT_STATE });

// Draw using animated values
const draw = () => {
  const state = colorStateRef.current;
  ctx.fillStyle = `rgb(${Math.round(state.bgR)}, ${Math.round(state.bgG)}, ${Math.round(state.bgB)})`;
};

// Animate on theme change
useEffect(() => {
  const observer = new MutationObserver(() => {
    const target = isDarkTheme() ? DARK_STATE : LIGHT_STATE;
    gsap.to(colorStateRef.current, {
      bgR: target.bgR,
      bgG: target.bgG,
      bgB: target.bgB,
      duration: 0.3,
      ease: 'power2.out',
    });
  });
  observer.observe(document.documentElement, { attributeFilter: ['data-theme'] });
}, []);
```

### Key Points

| Issue | Solution |
|-------|----------|
| Canvas has no CSS transition | Use GSAP to animate numeric color values |
| CSS variables are strings | Store numeric values separately |
| Need to redraw continuously | Animation loop reads interpolated values |

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
| Position parameter      | `tl.to(el, { x: 100 }, "<")`                      |
| Labels                  | `tl.addLabel("intro", 0); tl.to(el, {}, "intro")` |
| Responsive              | `gsap.matchMedia().add({ isDesktop: "..." }, fn)` |
| High-frequency          | `gsap.quickTo(el, "x", { duration: 0.4 })`        |

---

## Best Practices Summary

| DO                                        | DON'T                                    |
| ----------------------------------------- | ---------------------------------------- |
| Use camelCase property names              | Use `transform` string directly          |
| Prefer timelines over chaining with delay | Create tweens before DOM exists          |
| Use `autoAlpha` over `opacity`            | Animate `width`/`height` when transforms suffice |
| Add labels for readable sequencing        | Skip cleanup — always kill tweens        |
| Pass defaults into timeline constructor   | Use both `svgOrigin` and `transformOrigin` |
| Store tween/timeline for playback control | Overuse `will-change`                    |
| Use `gsap.quickTo()` for frequent updates | Create new tweens on every mousemove     |

---

**Language**: All documentation must be written in **English**.
