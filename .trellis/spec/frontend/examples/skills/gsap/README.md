# GSAP Animation Examples

This directory contains GSAP animation patterns for React components in Astro projects.

## Files

| File                         | Description                    |
| ---------------------------- | ------------------------------ |
| `entrance-animation.tsx.template` | Fade-in entrance animation |
| `stagger-list.tsx.template`  | Staggered list animation       |
| `timeline-hero.tsx.template` | Timeline-based hero animation  |
| `scroll-reveal.tsx.template` | ScrollTrigger reveal animation |
| `hover-button.tsx.template`  | Hover state animation          |
| `mouse-follow.tsx.template`  | Mouse following with quickTo   |

## Usage

1. Copy the `.template` file to your components directory
2. Remove the `.template` suffix
3. Adapt the animation to your needs
4. Ensure the component has a `client:*` directive in Astro

## Key Patterns

### Always use gsap.context()

```tsx
useEffect(() => {
  const ctx = gsap.context(() => {
    // All animations here
  }, containerRef);

  return () => ctx.revert(); // Cleanup
}, []);
```

### Prefer transform properties

- Use `x`, `y`, `scale`, `rotation`, `opacity`
- Avoid `left`, `top`, `width`, `height`

### Use stagger for lists

```tsx
gsap.to(".item", {
  y: 0,
  opacity: 1,
  stagger: 0.1, // 0.1s between each item
});
```
