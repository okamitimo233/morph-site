# CSS & Design System

> CSS modularization, design tokens, and Tailwind CSS integration.

---

## CSS Organization with Tailwind CSS 4

### Entry Point

`src/styles/global.css` is the single CSS entrypoint imported by the base layout.

**Folder structure**:

```
src/styles/
├── global.css            # Entry point (Tailwind imports)
├── tokens.css            # :root tokens + .dark overrides (optional)
└── components/           # Component-scoped classes (if needed)
    ├── hero.css
    └── navigation.css
```

**Rules**:

- Tailwind CSS 4 uses CSS-first configuration (no `tailwind.config.js` required)
- When adding custom styles, prefer Tailwind utilities first
- Use custom CSS only when Tailwind doesn't cover the use case
- If a file grows beyond ~300-500 lines, split it

### Global.css Structure (Tailwind CSS 4)

```css
/* src/styles/global.css */

/* 1. Tailwind CSS import (required) */
@import "tailwindcss";

/* 2. Custom CSS variables (optional) */
@theme {
  --color-primary: #3b82f6;
  --color-secondary: #6366f1;
  --font-display: "Inter", system-ui, sans-serif;
}

/* 3. Base styles */
@layer base {
  html {
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
  }

  body {
    @apply bg-background text-foreground;
  }
}

/* 4. Custom component styles */
@layer components {
  .card {
    @apply rounded-lg p-4 bg-white shadow-md dark:bg-gray-800;
  }

  .btn {
    @apply px-4 py-2 rounded-md font-medium transition-colors;
  }

  .btn-primary {
    @apply btn bg-primary text-white hover:bg-primary/90;
  }
}

/* 5. Custom utilities */
@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}
```

---

## Design Tokens

### Using Tailwind's @theme Directive

Tailwind CSS 4 uses `@theme` for design tokens:

```css
/* src/styles/global.css */
@import "tailwindcss";

@theme {
  /* Colors */
  --color-background: #ffffff;
  --color-foreground: #0a0a0a;
  --color-primary: #3b82f6;
  --color-primary-foreground: #ffffff;
  --color-secondary: #6366f1;
  --color-muted: #f4f4f5;
  --color-muted-foreground: #71717a;
  --color-border: #e4e4e7;
  --color-destructive: #ef4444;

  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;

  /* Border radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-full: 9999px;

  /* Typography */
  --font-sans: "Inter", system-ui, -apple-system, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;

  /* Animations */
  --animate-fade-in: fade-in 0.3s ease-out;
  --animate-slide-up: slide-up 0.3s ease-out;
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide-up {
  from { transform: translateY(10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
```

### Using Tokens in Components

```tsx
// React component using Tailwind classes
function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg p-md bg-white shadow-md dark:bg-gray-800">
      {children}
    </div>
  );
}
```

---

## CSS Class Naming Convention (BEM)

For complex components that need custom CSS (not just Tailwind utilities), use **BEM naming convention**:

### BEM Structure

```
.block                    /* Independent component */
.block__element           /* Internal element */
.block__element--modifier /* Element variant */
```

### Naming Rules

| Type               | Format              | Example                           |
| ------------------ | ------------------- | --------------------------------- |
| Block (container)  | `component-name`    | `.sidebar-dropdown`               |
| Element (child)    | `block__element`    | `.sidebar-dropdown__menu`         |
| Modifier (variant) | `element--modifier` | `.sidebar-dropdown__item--danger` |

### When to Use BEM vs Tailwind

| Scenario                          | Recommended              |
| --------------------------------- | ------------------------ |
| Simple components, one-off styles | Tailwind utility classes |
| Complex components, reusable      | BEM + CSS file           |
| Dynamic state toggling in JS      | BEM modifier classes     |
| Animation keyframes               | Custom CSS file          |
| Component library (shadcn/ui)     | Use built-in variants    |

---

## Dark Mode

### Using Tailwind's dark Mode

```tsx
// Component with dark mode support
function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
      {children}
    </div>
  );
}
```

### CSS Variables for Dark Mode

```css
/* In global.css */
@theme {
  --color-background: #ffffff;
  --color-foreground: #0a0a0a;
}

/* Dark mode overrides */
@media (prefers-color-scheme: dark) {
  :root {
    --color-background: #0a0a0a;
    --color-foreground: #fafafa;
  }
}

/* Or with class-based dark mode */
.dark {
  --color-background: #0a0a0a;
  --color-foreground: #fafafa;
}
```

---

## Base Styles

### Typography

```css
/* In global.css @layer base */
@layer base {
  html {
    font-family: var(--font-sans);
    font-size: 16px;
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
  }

  h1, h2, h3, h4, h5, h6 {
    @apply font-semibold leading-tight;
  }

  h1 { @apply text-4xl; }
  h2 { @apply text-3xl; }
  h3 { @apply text-2xl; }
  h4 { @apply text-xl; }
}
```

### Focus States

```css
/* Consistent focus ring */
@layer base {
  :focus-visible {
    @apply outline-2 outline-offset-2 outline-primary;
  }

  :focus:not(:focus-visible) {
    @apply outline-none;
  }
}
```

### Scrollbars (Notion-style)

```css
/* Hide scrollbars by default, show on hover */
@layer utilities {
  .scrollbar-thin {
    scrollbar-width: thin;
  }

  .scrollbar-hide {
    scrollbar-width: none;
  }

  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
}

/* Custom scrollbar styling */
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  @apply bg-gray-300 dark:bg-gray-700 rounded;
}

.scrollable:hover::-webkit-scrollbar-thumb {
  @apply bg-gray-400 dark:bg-gray-600;
}
```

---

## Astro Component Styles

Astro components support scoped styles:

```astro
---
// Card.astro
---

<div class="card">
  <slot />
</div>

<style>
  /* Scoped to this component only */
  .card {
    @apply rounded-lg p-4 bg-white shadow-md;
  }
</style>
```

### Global Styles in Astro

```astro
<style is:global>
  /* Global styles */
  @import '../styles/global.css';
</style>
```

---

## Quick Reference

| Question                       | Answer                                    |
| ------------------------------ | ----------------------------------------- |
| Where to define colors?        | `@theme` directive in global.css          |
| Where to put component styles? | Tailwind utilities first, then `styles/`  |
| How to name CSS classes?       | BEM: `.block__element--modifier`          |
| When to use Tailwind vs BEM?   | Simple = Tailwind, Complex/Reusable = BEM |
| How to support dark mode?      | `dark:` prefix or CSS variables           |
| How to scope styles in Astro?  | Use `<style>` in `.astro` files           |

---

**Language**: All documentation must be written in **English**.
