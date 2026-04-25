# GSAP Animation Guidelines

> GSAP integration patterns and best practices for Astro + React projects.

---

## Core Principles

| Principle | Description |
|-----------|-------------|
| **Always use gsap.context()** | Ensures proper cleanup and prevents memory leaks |
| **Prefer transform properties** | Use `x`, `y`, `scale`, `rotation`, `opacity` over layout properties |
| **Client-side only** | GSAP requires `client:*` directive in Astro |

---

## Required Patterns

### gsap.context() Cleanup

```tsx
// ✅ DO: Always use context with cleanup
useEffect(() => {
  const ctx = gsap.context(() => {
    gsap.to(element, { x: 100 })
  }, containerRef)

  return () => ctx.revert()
}, [])
```

```tsx
// ❌ DON'T: Skip cleanup
useEffect(() => {
  gsap.to(element, { x: 100 })
  // Missing cleanup causes memory leaks
}, [])
```

### Transform vs Layout Properties

```tsx
// ✅ DO: Use transform (GPU accelerated)
gsap.to(element, { x: 100, y: 50, scale: 1.1, opacity: 0.5 })

// ❌ DON'T: Animate layout properties
gsap.to(element, { left: 100, width: 200 }) // Triggers reflow
```

---

## Astro Integration

GSAP only works in hydrated components:

```astro
<!-- ✅ Animations work with client:* directive -->
<AnimatedHero client:visible />

<!-- ❌ No animations (no hydration) -->
<AnimatedHero />
```

---

## Key GSAP Properties

| Property | Description |
|----------|-------------|
| `duration` | Seconds (default 0.5) |
| `ease` | Easing function (`power2.out`, `back.out`, etc.) |
| `stagger` | Delay between each target (`0.1` or object) |
| `repeat` | Number or `-1` for infinite |
| `yoyo` | Alternates direction with repeat |

### Transform Aliases

| GSAP Property | CSS Equivalent |
|---------------|----------------|
| `x`, `y`, `z` | translateX/Y/Z (px) |
| `xPercent`, `yPercent` | translateX/Y (%) |
| `scale`, `scaleX`, `scaleY` | scale |
| `rotation` | rotate (deg) |
| `autoAlpha` | opacity + visibility |

---

## Common Patterns

### Entrance Animation

```tsx
useEffect(() => {
  const ctx = gsap.context(() => {
    gsap.from(ref.current, {
      y: 30,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
    })
  }, ref)

  return () => ctx.revert()
}, [])
```

### Stagger List

```tsx
gsap.from('li', {
  y: 20,
  opacity: 0,
  stagger: 0.1, // 0.1s between each item
  ease: 'power2.out',
})
```

### ScrollTrigger

```tsx
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

gsap.from(ref.current, {
  scrollTrigger: {
    trigger: ref.current,
    start: 'top 80%',
    toggleActions: 'play none none reverse',
  },
  y: 50,
  opacity: 0,
})
```

---

## Performance Rules

| DO | DON'T |
|----|-------|
| Use `autoAlpha` over `opacity` | Animate `width`/`height` |
| Add labels for readable sequencing | Skip cleanup |
| Use `gsap.quickTo()` for mouse tracking | Create new tweens on every event |
| Pass `defaults` into timeline constructor | Overuse `will-change` |

---

## Reference

For complete API documentation, use the `@gsap` skill or visit [gsap.com/docs](https://gsap.com/docs/).

---

**Language**: All documentation must be written in **English**.
