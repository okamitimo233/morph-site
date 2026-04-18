---
name: gsap
description: GSAP animation reference. Covers to(), from(), fromTo(), timelines, stagger, ScrollTrigger, and performance patterns.
---

# GSAP Quick Reference

## Tween Methods

| Method                    | Purpose                        |
| ------------------------- | ------------------------------ |
| `gsap.to(targets, vars)`  | Animate to `vars`              |
| `gsap.from(targets, vars)`| Animate from `vars`            |
| `gsap.fromTo(t, from, to)`| Explicit start/end             |
| `gsap.set(targets, vars)` | Apply immediately (duration 0) |

## Common vars

| Property   | Description                           |
| ---------- | ------------------------------------- |
| `duration` | Seconds (default 0.5)                 |
| `ease`     | `"power2.out"`, `"back.out(1.7)"`     |
| `stagger`  | `0.1` or `{ each: 0.1, from: "center" }` |
| `repeat`   | Number or `-1` for infinite           |
| `yoyo`     | Alternates with repeat                |

## Transform Aliases

| GSAP          | CSS                    |
| ------------- | ---------------------- |
| `x`, `y`      | translateX/Y (px)      |
| `xPercent`    | translateX (%)         |
| `scale`       | scale                  |
| `rotation`    | rotate (deg)           |
| `autoAlpha`   | opacity + visibility   |

## Timeline

```javascript
const tl = gsap.timeline({ defaults: { duration: 0.5 } });
tl.to(".a", { x: 100 })
  .to(".b", { y: 50 }, "-=0.3")  // Position parameter
  .addLabel("intro")
  .to(".c", { opacity: 1 }, "intro");
```

### Position Parameter

| Syntax    | Meaning                     |
| --------- | --------------------------- |
| `1`       | At 1s                       |
| `"+=0.5"` | 0.5s after end              |
| `"<"`     | Same start as previous      |
| `">"`     | After previous ends         |
| `"label"` | At label                    |

## Responsive

```javascript
gsap.matchMedia().add({
  isDesktop: "(min-width: 800px)",
  reduceMotion: "(prefers-reduced-motion: reduce)"
}, (ctx) => {
  const { isDesktop, reduceMotion } = ctx.conditions;
});
```

## High-Frequency Updates

```javascript
const xTo = gsap.quickTo(el, "x", { duration: 0.4 });
element.addEventListener("mousemove", (e) => xTo(e.clientX));
```

## React Pattern

```tsx
useEffect(() => {
  const ctx = gsap.context(() => {
    gsap.to(ref.current, { x: 100 });
  }, containerRef);
  return () => ctx.revert();
}, []);
```

## Rules

- Use camelCase properties
- Prefer `x/y/scale/rotation/opacity`
- Use `stagger` over many tweens
- Always cleanup with `gsap.context`
