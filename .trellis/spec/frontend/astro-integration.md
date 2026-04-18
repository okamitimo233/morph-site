# Astro + React Integration

> How to integrate React with Astro, client directives, and hydration patterns.

---

## React Integration Setup

### Installation

```bash
pnpm add @astrojs/react react react-dom
```

### Astro Configuration

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
```

---

## Client Directives

Client directives determine when a React component becomes interactive (hydrated).

### Available Directives

| Directive       | When it Hydrates                                | Use Case                          |
| --------------- | ----------------------------------------------- | --------------------------------- |
| `client:load`   | Page load                                       | Immediately needed interactivity  |
| `client:idle`   | Browser idle (requestIdleCallback)              | Low-priority interactivity        |
| `client:visible`| Element enters viewport                         | Below-fold interactive content    |
| `client:media`  | Media query matches                             | Responsive interactivity          |
| `client:only`   | Skip server render, hydrate only                | Heavy JS, no SEO needed           |

### Usage Examples

```astro
---
import Counter from '../components/islands/Counter';
import SearchForm from '../components/islands/SearchForm';
import Analytics from '../components/islands/Analytics';
---

<!-- Hydrate immediately - critical interactivity -->
<SearchForm client:load />

<!-- Hydrate when visible - below-fold content -->
<Counter client:visible />

<!-- Hydrate when browser is idle - low priority -->
<Analytics client:idle />

<!-- Hydrate only on mobile -->
<MobileMenu client:media="(max-width: 768px)" />

<!-- Skip SSR - heavy library, no SEO benefit -->
<HeavyChart client:only="react" />
```

---

## Choosing the Right Directive

### Decision Tree

```
Is the component immediately interactive and critical?
├── Yes → client:load
└── No → Is it visible on initial page load?
         ├── Yes → Is it high priority?
         │        ├── Yes → client:load
         │        └── No → client:idle
         └── No → client:visible
```

### Guidelines

| Scenario                          | Directive        | Reason                              |
| --------------------------------- | ---------------- | ----------------------------------- |
| Navigation, forms above fold      | `client:load`    | User expects immediate interaction  |
| Search autocomplete               | `client:load`    | Critical for user flow              |
| Image carousel below fold         | `client:visible` | Don't hydrate until needed          |
| Newsletter signup in footer       | `client:visible` | Below fold, defer hydration         |
| Analytics, chat widgets           | `client:idle`    | Low priority, load when free        |
| Data visualization (no SEO)       | `client:only`    | Skip SSR for heavy libraries        |
| Mobile-specific menu              | `client:media`   | Only hydrate on matching devices    |

---

## Hydration Best Practices

### 1. Minimize Hydration

Only hydrate components that truly need interactivity:

```astro
---
<!-- Bad: Hydrating static content -->
<StaticText client:load />

<!-- Good: No hydration for static content -->
<StaticText />
---
```

### 2. Use Astro Components When Possible

Before reaching for React, consider if an Astro component works:

```astro
---
<!-- Bad: React for static display -->
<Card client:load title="Hello" />

<!-- Good: Astro for static content -->
<Card title="Hello" />
---
```

### 3. Avoid Hydration Mismatches

Server-rendered HTML must match client-rendered HTML:

```tsx
// Bad: Different output on server vs client
function Clock() {
  // Server renders one time, client renders different time
  return <span>{new Date().toLocaleTimeString()}</span>;
}

// Good: Use useEffect for client-only rendering
function Clock() {
  const [time, setTime] = useState('');

  useEffect(() => {
    setTime(new Date().toLocaleTimeString());
  }, []);

  return <span>{time || 'Loading...'}</span>;
}
```

### 4. Pass Props Correctly

Props are serialized to JSON for hydration:

```astro
---
// Good: Serializable props
<UserProfile
  client:load
  name="John"
  age={30}
  roles={['admin', 'user']}
/>

// Bad: Non-serializable props
<UserProfile
  client:load
  onClick={() => console.log('click')}  // Won't work!
/>
---
```

For callbacks, define them inside the React component:

```tsx
// UserProfile.tsx
export default function UserProfile({ name }: { name: string }) {
  const handleClick = () => {
    console.log('clicked');
  };

  return <button onClick={handleClick}>{name}</button>;
}
```

---

## React Component Patterns

### Component Structure

```tsx
// src/components/islands/Counter.tsx
import { useState } from 'react';

interface CounterProps {
  initialValue?: number;
}

export default function Counter({ initialValue = 0 }: CounterProps) {
  const [count, setCount] = useState(initialValue);

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={() => setCount((c) => c - 1)}
        className="px-4 py-2 bg-gray-200 rounded"
      >
        -
      </button>
      <span className="text-xl font-bold">{count}</span>
      <button
        onClick={() => setCount((c) => c + 1)}
        className="px-4 py-2 bg-gray-200 rounded"
      >
        +
      </button>
    </div>
  );
}
```

### Using Context

Wrap interactive components that share state:

```astro
---
import { ThemeProvider } from '../context/ThemeContext';
import Header from '../components/islands/Header';
import Footer from '../components/islands/Footer';
---

<ThemeProvider>
  <Header client:load />
  <!-- Page content -->
  <Footer client:idle />
</ThemeProvider>
```

---

## Shared State Between Islands

### Option 1: Context Provider

```astro
---
import { UserProvider } from '../context/UserContext';
import UserMenu from '../components/islands/UserMenu';
import UserProfile from '../components/islands/UserProfile';
---

<UserProvider>
  <UserMenu client:load />
  <UserProfile client:visible />
</UserProvider>
```

### Option 2: Browser Events

```tsx
// Island 1: Dispatch event
function SearchInput() {
  const handleSearch = (query: string) => {
    window.dispatchEvent(
      new CustomEvent('search', { detail: query })
    );
  };

  return <input onChange={(e) => handleSearch(e.target.value)} />;
}

// Island 2: Listen for event
function SearchResults() {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const handleSearch = (e: CustomEvent) => {
      // Fetch and set results
    };

    window.addEventListener('search', handleSearch as EventListener);
    return () => window.removeEventListener('search', handleSearch as EventListener);
  }, []);

  return <div>{/* results */}</div>;
}
```

---

## Performance Tips

### 1. Code Splitting

Astro automatically code-splits each island:

```astro
---
// Each island becomes its own chunk
import HeavyChart from '../components/islands/HeavyChart';
import LightWidget from '../components/islands/LightWidget';
---

<!-- HeavyChart only loads when visible -->
<HeavyChart client:visible />

<!-- LightWidget loads immediately -->
<LightWidget client:load />
```

### 2. Prefetching

Enable prefetching for faster navigation:

```javascript
// astro.config.mjs
export default defineConfig({
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
});
```

### 3. Use client:only for Heavy Libraries

```astro
---
// Skip SSR entirely for heavy visualization
import DataVisualization from '../components/islands/DataVisualization';
---

<!-- No server rendering, faster initial load -->
<DataVisualization client:only="react" />
```

---

## Quick Reference

| Directive        | Loads JS...                  | Use For                           |
| ---------------- | ---------------------------- | --------------------------------- |
| `client:load`    | Immediately                  | Critical interactive components   |
| `client:idle`    | When browser is idle         | Low-priority components           |
| `client:visible` | When scrolled into view      | Below-fold interactive content    |
| `client:media`   | When media query matches     | Conditional interactivity         |
| `client:only`    | Skip SSR                     | Heavy libraries, no SEO needed    |

---

**Language**: All documentation must be written in **English**.
