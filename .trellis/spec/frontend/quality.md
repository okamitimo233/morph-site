# Code Quality Guidelines

> Performance and code quality standards.

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
# 1. Type check
pnpm exec tsc --noEmit

# 2. Lint (Biome)
pnpm lint

# 3. Build
pnpm build

# 4. Manual testing
# Test the feature you changed
```

**Checklist**:

- [ ] `pnpm exec tsc --noEmit` - No type errors
- [ ] `pnpm lint` - 0 errors, 0 warnings
- [ ] `pnpm build` - Build succeeds
- [ ] Manual testing passes
- [ ] No console errors in browser DevTools

---

## Forbidden Patterns

| Pattern                             | Reason             | Fix                                 |
| ----------------------------------- | ------------------ | ----------------------------------- |
| Non-null assertions (`!`)           | Type unsafe        | Use local variable after null check |
| `any` type                          | Loses type safety  | Use proper types or `unknown`       |
| Unused imports/variables            | Dead code          | Remove or prefix with `_`           |
| Lexical declarations in bare `case` | Lint error         | Wrap case body in `{}`              |
| Duplicate constant definitions      | Maintenance burden | Use shared constants                |

---

## Non-null Assertion Fix

```typescript
// Bad - non-null assertion
if (result.success && result.data) {
  doSomething(result.data!);
}

// Good - use local variable
if (result.success && result.data) {
  const data = result.data; // TypeScript knows this is defined
  doSomething(data);
}
```

---

## Switch Case with Lexical Declarations

When declaring variables (with `const`/`let`) inside a `case` block, you MUST wrap the block in braces `{}`:

```typescript
// Bad - Lint error: "Unexpected lexical declaration in case block"
switch (value) {
  case 'today':
    const date = new Date(); // Error!
    break;
}

// Good - wrap in braces
switch (value) {
  case 'today': {
    const date = new Date(); // OK
    break;
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

## Clean Up Unused Imports

After refactoring, always check for and remove unused imports:

```typescript
// Bad - unused imports
import { useState, useEffect, useCallback } from 'react';
// ... code that only uses useState

// Good - only import what you use
import { useState } from 'react';
```

**Tip**: Run `pnpm lint` before committing to catch unused imports.

---

## Avoid Duplicate Definitions

Before defining constants, mappings, or configuration values, **search the codebase first**:

```bash
# Search for existing definitions
grep -r "ALLOWED_TYPES\|allowedTypes" src/
grep -r "extension.*mime" src/
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
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <HeavyComponent />
    </Suspense>
  );
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
import { useState, useEffect } from 'react';
import { useDebouncedCallback } from 'use-debounce';

function SearchInput() {
  const [query, setQuery] = useState('');

  const debouncedSearch = useDebouncedCallback((value: string) => {
    performSearch(value);
  }, 300);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    debouncedSearch(e.target.value);
  };

  return <input onChange={handleChange} value={query} />;
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
const animatedRef = useRef<HTMLDivElement>(null);

// Bad - explains obvious WHAT
// Create a ref
const ref = useRef(null);
```

---

## Error Handling

### API Calls

```typescript
// Good - handle errors explicitly
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Failed to fetch data:', error);
    return { success: false, error: 'Failed to fetch data' };
  }
}
```

### Type Guards

```typescript
// Good - type guard for error handling
function isApiError(error: unknown): error is { message: string; code: number } {
  return typeof error === 'object' && error !== null && 'message' in error && 'code' in error;
}

try {
  // ...
} catch (error) {
  if (isApiError(error)) {
    console.error(`API Error ${error.code}: ${error.message}`);
  } else {
    console.error('Unknown error:', error);
  }
}
```

---

## Quick Reference

| Rule                                    | Why                         |
| --------------------------------------- | --------------------------- |
| No `!` (non-null assertion)             | Hides potential null issues |
| No `any`                                | Loses type safety           |
| Wrap `case` with `const`/`let` in `{}`  | Linter requirement          |
| Use `_` prefix for intentionally unused | Linter won't complain       |
| Search before defining constants        | Avoid duplication           |
| Max 300 lines per component             | Maintainability             |
| Run lint + build before commit          | Catch issues early          |
| Minimize client-side hydration          | Performance                 |

---

**Language**: All documentation must be written in **English**.
