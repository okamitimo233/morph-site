# Islands Architecture

> Understanding Astro's Islands architecture and hydration patterns.
>
> **Client directives reference**: See [astro-integration.md](./astro-integration.md) for complete `client:*` directive documentation.

---

## What is Islands Architecture?

Islands architecture is a web design pattern where most of the page is static HTML, with "islands" of interactivity scattered throughout. Each island is an independently hydrated component.

### Traditional SPA vs Islands

```
Traditional SPA:
+--------------------------------------------------+
|                  JS Bundle (Hydrated)            |
|  +--------------------------------------------+  |
|  |              Entire Page                   |  |
|  |  Every component is interactive           |  |
|  |  Large JS payload                         |  |
|  |  Slow initial load                        |  |
|  +--------------------------------------------+  |
+--------------------------------------------------+

Islands Architecture:
+--------------------------------------------------+
|              Static HTML (No JS)                  |
|  +-----------+  +-----------+  +-----------+     |
|  |  Island   |  |  Static   |  |  Island   |     |
|  |  (Hydr.)  |  |  (No JS)  |  |  (Hydr.)  |     |
|  +-----------+  +-----------+  +-----------+     |
|                                                  |
|  Smaller JS bundles                              |
|  Faster initial load                             |
|  Hydrate only what's needed                      |
+--------------------------------------------------+
```

---

## Benefits of Islands

| Benefit                 | Description                                    |
| ----------------------- | ---------------------------------------------- |
| **Performance**         | Smaller JS bundles, faster TTI                 |
| **SEO**                 | Full HTML rendered on server                   |
| **Progressive Enhancement** | Works without JS, enhanced with JS        |
| **Cost Efficiency**     | Less client-side processing                    |

---

## How Astro Implements Islands

### Static by Default

All Astro components are static by default - no JavaScript is sent to the browser:

```astro
---
// This component produces ZERO client-side JavaScript
import Card from '../components/Card.astro';
---

<Card title="Hello">
  <p>This is static content.</p>
</Card>
```

### Interactive Islands

Add a `client:*` directive to hydrate a component:

```astro
---
import Counter from '../components/Counter.tsx';
---

<!-- This island hydrates when visible -->
<Counter client:visible />
```

> **For complete `client:*` directive reference**, see [astro-integration.md](./astro-integration.md).

---

## Designing Islands

### Principle: Minimize Hydration

**Before creating an island, ask:**

1. Does this need interactivity?
2. Can it be achieved with CSS?
3. Can it be achieved with Astro components?

### Example: Interactive vs Static

```astro
---
// Static: Just displays content - no JS needed
<Card title="Features">
  <ul>
    <li>Fast</li>
    <li>Lightweight</li>
  </ul>
</Card>

// Interactive: Responds to user input - needs hydration
<TodoList client:visible />
---
```

### Example: CSS-Only Interactivity

```astro
---
// Don't hydrate just for hover effects!
// Use CSS instead

<style>
  .card:hover {
    transform: scale(1.02);
    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
  }
</style>

<div class="card">
  Hover me!
</div>
---
```

---

## State Isolation

Each island has its own isolated state. There's no shared global state by default.

### Isolated State

```tsx
// Each Counter has its own count
function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

```astro
---
import Counter from './Counter.tsx';
---

<!-- Three separate counters, each with own state -->
<Counter client:load />  <!-- count: 0 -->
<Counter client:load />  <!-- count: 0 -->
<Counter client:load />  <!-- count: 0 -->
```

### Sharing State Between Islands

#### Option 1: Context Provider

```astro
---
import { ThemeProvider } from './ThemeContext';
import Header from './Header';
import Footer from './Footer';
---

<ThemeProvider>
  <Header client:load />
  <Footer client:idle />
</ThemeProvider>
```

#### Option 2: URL State

```tsx
// Both islands read/write URL params
function useQueryParam(key: string) {
  const [searchParams, setSearchParams] = useSearchParams();
  const value = searchParams.get(key);
  const setValue = (v: string) => {
    searchParams.set(key, v);
    setSearchParams(searchParams);
  };
  return [value, setValue];
}
```

#### Option 3: Browser Events

```tsx
// Island 1: Dispatch
window.dispatchEvent(new CustomEvent('theme-change', { detail: 'dark' }));

// Island 2: Listen
useEffect(() => {
  const handler = (e) => setTheme(e.detail);
  window.addEventListener('theme-change', handler);
  return () => window.removeEventListener('theme-change', handler);
}, []);
```

---

## Common Patterns

### 1. Layout with Islands

```astro
---
// src/layouts/BaseLayout.astro
import Header from '../components/islands/Header';
import Footer from '../components/ui/Footer.astro';
---

<header>
  <Header client:load />  <!-- Interactive navigation -->
</header>

<main>
  <slot />  <!-- Page content (static) -->
</main>

<footer>
  <Footer />  <!-- Static footer -->
</footer>
```

### 2. Progressive Enhancement

```tsx
// Works without JS, enhanced with JS
function SearchForm() {
  const [query, setQuery] = useState('');

  return (
    <form action="/search" method="GET">
      {/* Works without JS */}
      <input name="q" value={query} onChange={e => setQuery(e.target.value)} />

      {/* Enhanced with JS */}
      {query && <SearchSuggestions query={query} />}
    </form>
  );
}
```

### 3. Data Fetching Islands

```tsx
// Fetch data on client
function Comments({ postId }: { postId: string }) {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetch(`/api/posts/${postId}/comments`)
      .then(r => r.json())
      .then(setComments);
  }, [postId]);

  return (
    <ul>
      {comments.map(c => <li key={c.id}>{c.body}</li>)}
    </ul>
  );
}
```

---

## Performance Checklist

- [ ] Only hydrate components that need interactivity
- [ ] Use `client:visible` for below-fold content
- [ ] Use `client:idle` for low-priority features
- [ ] Prefer CSS for visual effects over JS
- [ ] Split large interactive components into smaller islands
- [ ] Use `client:only` for heavy libraries that can't SSR

---

## Quick Reference

| Directive        | Hydration Trigger            | Bundle Impact            |
| ---------------- | ---------------------------- | ------------------------ |
| `client:load`    | Page load                    | Immediately loads JS     |
| `client:idle`    | Browser idle                 | Deferred JS load         |
| `client:visible` | Enters viewport              | Lazy JS load             |
| `client:media`   | Media query match            | Conditional JS load      |
| `client:only`    | No SSR, immediate hydration  | No server rendering      |
| (no directive)   | Never                        | Zero JS                  |

> **Complete directive documentation**: [astro-integration.md](./astro-integration.md)

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [astro-integration.md](./astro-integration.md) | Client directives reference, React integration |
| [state-management.md](./state-management.md) | State patterns in Astro + React |
| [quality.md](./quality.md) | Performance guidelines |

---

**Language**: All documentation must be written in **English**.
