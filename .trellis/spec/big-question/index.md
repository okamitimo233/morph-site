# Big Questions / Deep-dive Investigations

> **Purpose**: Document deep-dive technical investigations and complex issues that require thorough analysis.

---

## What Goes Here?

This layer contains **deep-dive technical investigations** - issues that required significant investigation to understand and solve. These are not simple bugs, but complex problems with:

- Non-obvious root causes
- Multiple contributing factors
- Important lessons for future development

### Not a "Bug List"

This is **not** a simple bug tracker. Each document here represents:

1. **A problem worth understanding deeply** - not just fixing
2. **Investigation process** - how we discovered the root cause
3. **Key insights** - what we learned
4. **Prevention strategies** - how to avoid similar issues

---

## Document Format

Each investigation follows this structure:

```markdown
# Investigation: [Title]

> **Category**: Deep-dive Technical Investigation
> **Severity**: P0/P1/P2
> **Discovered**: [context]

## Problem Statement

What happened?

## Root Cause Analysis

Why did it happen?

## Solution

How was it fixed?

## Key Insights

What did we learn?

## Prevention

How to avoid similar issues?

## Related Specifications

Links to normative specs.
```

---

## Available Investigations

| Document                                                   | Severity | Summary                                    |
| ---------------------------------------------------------- | -------- | ------------------------------------------ |
| [react-usestate-function.md](./react-usestate-function.md) | P2       | React useState executes function arguments |
| [css-flex-centering.md](./css-flex-centering.md)           | P2       | Visual vs mathematical centering in flex   |
| [timestamp-precision.md](./timestamp-precision.md)         | P1       | Timestamp precision mismatch (s vs ms)     |

---

## Relationship to Other Layers

| Layer       | Purpose                      | Relationship                                           |
| ----------- | ---------------------------- | ------------------------------------------------------ |
| `shared/`   | Cross-layer standards        | Investigation may reference these as the "correct" way |
| `frontend/` | Frontend-specific guidelines | Investigations may lead to new guidelines here         |
| `guides/`   | Thinking guides              | Investigations may inform new thinking patterns        |

### Flow

```
Problem discovered
      ↓
Investigation (big-question/)
      ↓
Solution implemented
      ↓
Standards updated (shared/, frontend/)
      ↓
Prevention guides created (guides/)
```

---

## Quick Debugging Checklist

### React State Issues

1. Storing functions in useState? → See [react-usestate-function.md](./react-usestate-function.md)
2. Check for stale closures in event handlers
3. Verify dependency arrays in useEffect

### CSS Layout Issues

1. Flex centering not perfect? → See [css-flex-centering.md](./css-flex-centering.md)
2. Check for conflicting Tailwind classes
3. Use browser DevTools to inspect computed styles

### Data Handling Issues

1. Timestamp comparisons failing? → See [timestamp-precision.md](./timestamp-precision.md)
2. Check for timezone issues with Date objects
3. Verify API responses match expected types

---

## Technology Stack Coverage

These investigations were discovered while building with:

- **Astro 6.x** for static site generation
- **React 19** for interactive components
- **TypeScript** throughout
- **Tailwind CSS 4** for styling
- **GSAP** for animations

Most issues apply to similar stacks.

---

**Language**: All documentation must be written in **English**.
