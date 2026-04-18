# Common Pitfalls

> Documented pitfalls from building web applications with React, TypeScript, and Tailwind CSS.

## Severity Levels

| Level | Description                                   |
| ----- | --------------------------------------------- |
| P0    | App crashes or fails to build                 |
| P1    | Feature completely broken, data loss possible |
| P2    | Degraded experience, workaround exists        |

---

## By Category

### React

| Document                                                   | Severity | Summary                                     |
| ---------------------------------------------------------- | -------- | ------------------------------------------- |
| [react-usestate-function.md](./react-usestate-function.md) | P2       | Storing functions in useState executes them |

### CSS/Layout

| Document                                         | Severity | Summary                                          |
| ------------------------------------------------ | -------- | ------------------------------------------------ |
| [css-flex-centering.md](./css-flex-centering.md) | P2       | Visual vs mathematical centering in flex layouts |

### Data Handling

| Document                                             | Severity | Summary                                                |
| ---------------------------------------------------- | -------- | ------------------------------------------------------ |
| [timestamp-precision.md](./timestamp-precision.md)   | P1       | Timestamp precision mismatch (seconds vs milliseconds) |

---

## Quick Debugging Checklist

### React State Issues

1. Storing functions in useState? -> See [react-usestate-function.md](./react-usestate-function.md)
2. Check for stale closures in event handlers
3. Verify dependency arrays in useEffect

### CSS Layout Issues

1. Flex centering not perfect? -> See [css-flex-centering.md](./css-flex-centering.md)
2. Check for conflicting Tailwind classes
3. Use browser DevTools to inspect computed styles

### Data Handling Issues

1. Timestamp comparisons failing? -> See [timestamp-precision.md](./timestamp-precision.md)
2. Check for timezone issues with Date objects
3. Verify API responses match expected types

---

## Technology Stack Coverage

These pitfalls were discovered while building with:

- **Astro 6.x** for static site generation
- **React 19** for interactive components
- **TypeScript** throughout
- **Tailwind CSS 4** for styling
- **GSAP** for animations

Most issues apply to similar stacks.
