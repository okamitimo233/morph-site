# Frontend Code Quality Guidelines

> Performance and code quality standards for Astro + React applications.
>
> **Cross-layer quality standards** (no `!` assertions, no `any`, lint before commit) are defined in [shared/code-quality.md](../shared/code-quality.md).

---

## Package Manager

**Use pnpm** for this project:

```bash
# Good
pnpm install
pnpm lint
pnpm build

# Avoid mixing package managers
npm install  # Don't
yarn install # Don't
```

---

## Before Every Commit

Run these checks before committing:

```bash
# 1. Format check
pnpm format:check

# 2. Type check (Astro + TypeScript)
pnpm typecheck

# 3. Lint (ESLint)
pnpm lint

# 4. Build
pnpm build

# 5. Manual testing
# Test the feature you changed
```

**Checklist**:

- [ ] `pnpm format:check` - Code is properly formatted
- [ ] `pnpm typecheck` - No type errors
- [ ] `pnpm lint` - 0 errors, 0 warnings
- [ ] `pnpm build` - Build succeeds
- [ ] Manual testing passes
- [ ] No console errors in browser DevTools

---

## Switch Case with Lexical Declarations

When declaring variables (with `const`/`let`) inside a `case` block, you MUST wrap the block in braces `{}`:

```typescript
// Bad - Lint error: "Unexpected lexical declaration in case block"
switch (value) {
  case 'today':
    const date = new Date() // Error!
    break
}

// Good - wrap in braces
switch (value) {
  case 'today': {
    const date = new Date() // OK
    break
  }
}
```

---

## Exhaustive Switch Check

Use `_exhaustive` pattern for exhaustive switch checks. The `_` prefix tells linter this variable is intentionally unused:

```typescript
type Status = "open" | "closed" | "pending";

function getIcon(status: Status) {
  switch (status) {
    case "open":
      return <OpenIcon />;
    case "closed":
      return <ClosedIcon />;
    case "pending":
      return <PendingIcon />;
    default: {
      // TypeScript will error if a case is missing
      const _exhaustive: never = status;
      return null;
    }
  }
}
```

---

## Performance Guidelines

### Minimize Hydration

```astro
<!-- Bad - hydrates entire page unnecessarily -->
<InteractiveComponent client:load />

<!-- Good - hydrate only when needed -->
<InteractiveComponent client:idle />
<InteractiveComponent client:visible />
```

### Lazy Loading React Components

```tsx
// Lazy load heavy components
import { lazy, Suspense } from 'react'

const HeavyComponent = lazy(() => import('./HeavyComponent'))

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <HeavyComponent />
    </Suspense>
  )
}
```

### Image Optimization

```astro
---
import { Image } from 'astro:assets';
import heroImage from '../assets/hero.png';
---

<!-- Good - Astro optimizes images automatically -->
<Image src={heroImage} alt="Hero" />

<!-- Also good - use width/height for remote images -->
<img src="https://example.com/image.jpg" width="800" height="600" alt="..." />
```

### Debounce Expensive Operations

```tsx
// Debounce search input
import { useState, useEffect } from 'react'
import { useDebouncedCallback } from 'use-debounce'

function SearchInput() {
  const [query, setQuery] = useState('')

  const debouncedSearch = useDebouncedCallback((value: string) => {
    performSearch(value)
  }, 300)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    debouncedSearch(e.target.value)
  }

  return <input onChange={handleChange} value={query} />
}
```

---

## Code Organization

### File Length

- **Astro pages**: Max ~200 lines. Extract to components.
- **React components**: Max ~300 lines. Split if larger.
- **Hooks**: Max ~150 lines. Extract helper functions.
- **CSS files**: Max ~500 lines. Split by component.

### Function Length

- Keep functions under 50 lines when possible
- Extract helper functions for complex logic
- Use descriptive names for extracted functions

### Comments

```typescript
// Good - explains WHY, not WHAT
// Use useMemo to prevent GSAP from re-initializing on every render
const animatedRef = useRef<HTMLDivElement>(null)

// Bad - explains obvious WHAT
// Create a ref
const ref = useRef(null)
```

---

## Error Handling

### API Calls

```typescript
// Good - handle errors explicitly
async function fetchData() {
  try {
    const response = await fetch('/api/data')
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    console.error('Failed to fetch data:', error)
    return { success: false, error: 'Failed to fetch data' }
  }
}
```

### Type Guards

```typescript
// Good - type guard for error handling
function isApiError(error: unknown): error is { message: string; code: number } {
  return typeof error === 'object' && error !== null && 'message' in error && 'code' in error
}

try {
  // ...
} catch (error) {
  if (isApiError(error)) {
    console.error(`API Error ${error.code}: ${error.message}`)
  } else {
    console.error('Unknown error:', error)
  }
}
```

---

## Quick Reference

| Rule                                    | Why                        |
| --------------------------------------- | -------------------------- |
| Use `pnpm`                              | Consistent package manager |
| Format with Prettier                    | Consistent code style      |
| Wrap `case` with `const`/`let` in `{}`  | Linter requirement         |
| Use `_` prefix for intentionally unused | Linter won't complain      |
| Max 300 lines per component             | Maintainability            |
| Run lint + build before commit          | Catch issues early         |
| Minimize client-side hydration          | Performance                |

---

## Related Documents

| Document                                                                              | Purpose                                       |
| ------------------------------------------------------------------------------------- | --------------------------------------------- |
| [shared/code-quality.md](../shared/code-quality.md)                                   | Cross-layer quality standards (authoritative) |
| [shared/typescript.md](../shared/typescript.md)                                       | TypeScript best practices                     |
| [guides/bug-root-cause-thinking-guide.md](../guides/bug-root-cause-thinking-guide.md) | Bug analysis methodology                      |

---

**Language**: All documentation must be written in **English**.
