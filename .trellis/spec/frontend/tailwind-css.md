# Tailwind CSS Guidelines

> Tailwind CSS 4 configuration, patterns, and best practices for Astro projects.

---

## Tailwind CSS 4 Setup

### Installation

```bash
pnpm add tailwindcss @tailwindcss/vite
```

### Configuration

Tailwind CSS 4 uses CSS-first configuration. No `tailwind.config.js` needed!

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
```

### Global CSS

```css
/* src/styles/global.css */
@import "tailwindcss";

/* Custom theme with @theme directive */
@theme {
  --color-primary: #3b82f6;
  --color-secondary: #6366f1;
  --font-sans: "Inter", system-ui, sans-serif;
}

/* Custom base styles */
@layer base {
  html {
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
  }
}

/* Custom components */
@layer components {
  .btn {
    @apply px-4 py-2 rounded-md font-medium transition-colors;
  }

  .btn-primary {
    @apply btn bg-primary text-white hover:bg-primary/90;
  }
}
```

---

## The @theme Directive

Define design tokens using `@theme`:

```css
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

  /* These become: bg-primary, text-muted-foreground, etc. */

  /* Spacing (extends defaults) */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;

  /* These become: p-md, m-xs, gap-lg, etc. */

  /* Border Radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;

  /* Typography */
  --font-sans: "Inter", system-ui, sans-serif;
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

---

## Dark Mode

### Using dark: Prefix

```tsx
function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700">
      {children}
    </div>
  );
}
```

### CSS Variables for Dark Mode

```css
@theme {
  --color-background: #ffffff;
  --color-foreground: #0a0a0a;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-background: #0a0a0a;
    --color-foreground: #fafafa;
  }
}

/* Or with class-based toggle */
.dark {
  --color-background: #0a0a0a;
  --color-foreground: #fafafa;
}
```

```tsx
// Usage with CSS variables
<div className="bg-background text-foreground">
  Content adapts to theme
</div>
```

---

## Common Patterns

### Layout Components

```tsx
// Container
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  {/* Content */}
</div>

// Flex centered
<div className="flex items-center justify-center min-h-screen">
  {/* Content */}
</div>

// Grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Cards */}
</div>
```

### Typography

```tsx
// Headings
<h1 className="text-4xl font-bold tracking-tight">Title</h1>
<h2 className="text-3xl font-semibold">Subtitle</h2>
<h3 className="text-2xl font-medium">Section</h3>

// Body text
<p className="text-base text-muted-foreground leading-relaxed">
  Paragraph text
</p>

// Links
<a className="text-primary hover:underline">Link</a>
```

### Buttons

```tsx
// Primary button
<button className="px-4 py-2 bg-primary text-white rounded-md font-medium hover:bg-primary/90 transition-colors">
  Primary
</button>

// Secondary button
<button className="px-4 py-2 bg-muted text-foreground rounded-md font-medium hover:bg-muted/80 transition-colors">
  Secondary
</button>

// Outline button
<button className="px-4 py-2 border border-border rounded-md font-medium hover:bg-muted transition-colors">
  Outline
</button>
```

### Cards

```tsx
function Card({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-lg border border-border bg-background p-6 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
```

### Forms

```tsx
function Input({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <input
        className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
        {...props}
      />
    </div>
  );
}
```

---

## Responsive Design

### Breakpoints

Tailwind CSS 4 uses these default breakpoints:

| Prefix | Min-width | CSS               |
| ------ | --------- | ----------------- |
| `sm`   | 640px     | `@media (min-width: 640px)` |
| `md`   | 768px     | `@media (min-width: 768px)` |
| `lg`   | 1024px    | `@media (min-width: 1024px)` |
| `xl`   | 1280px    | `@media (min-width: 1280px)` |
| `2xl`  | 1536px    | `@media (min-width: 1536px)` |

### Mobile-First Approach

```tsx
// Mobile: stack, Tablet+: side by side
<div className="flex flex-col md:flex-row gap-4">
  <div className="w-full md:w-1/2">Left</div>
  <div className="w-full md:w-1/2">Right</div>
</div>

// Mobile: smaller text, Desktop: larger
<h1 className="text-2xl md:text-4xl font-bold">
  Responsive Title
</h1>

// Mobile: hidden, Desktop: visible
<nav className="hidden md:flex">
  Desktop Navigation
</nav>
```

---

## Animations

### Built-in Animations

```tsx
// Fade in
<div className="animate-fade-in">Fading in</div>

// Slide up
<div className="animate-slide-up">Sliding up</div>

// Custom animation from @theme
<div className="animate-bounce">Bouncing</div>
```

### Hover and Focus States

```tsx
// Hover
<button className="bg-primary hover:bg-primary/90">
  Hover me
</button>

// Focus
<input className="focus:ring-2 focus:ring-primary focus:outline-none" />

// Active
<button className="active:scale-95">
  Press me
</button>
```

### Transitions

```tsx
// Color transition
<div className="transition-colors duration-200 hover:bg-muted">
  Smooth color change
</div>

// Transform transition
<div className="transition-transform duration-300 hover:scale-105">
  Smooth scale
</div>

// All properties
<div className="transition-all duration-300 hover:shadow-lg">
  Multiple changes
</div>
```

---

## Custom Components with @layer

Define reusable component classes:

```css
/* src/styles/global.css */
@layer components {
  /* Button variants */
  .btn {
    @apply px-4 py-2 rounded-md font-medium transition-colors inline-flex items-center justify-center;
  }

  .btn-primary {
    @apply btn bg-primary text-white hover:bg-primary/90;
  }

  .btn-secondary {
    @apply btn bg-muted text-foreground hover:bg-muted/80;
  }

  .btn-outline {
    @apply btn border border-border hover:bg-muted;
  }

  .btn-ghost {
    @apply btn hover:bg-muted;
  }

  /* Card */
  .card {
    @apply rounded-lg border border-border bg-background p-6 shadow-sm;
  }

  /* Input */
  .input {
    @apply w-full px-3 py-2 border border-border rounded-md bg-background;
    @apply focus:outline-none focus:ring-2 focus:ring-primary;
  }
}
```

---

## Best Practices

### 1. Avoid Premature Abstraction

```tsx
// Good: Use utilities directly for one-off styles
<div className="p-4 bg-blue-100 rounded-lg">
  One-time styled element
</div>

// Create component class only when reused 3+ times
```

### 2. Extract Components, Not Classes

```tsx
// Good: Extract React component
function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-background p-6">
      {children}
    </div>
  );
}

// Avoid: Over-extracting CSS classes
```

### 3. Use Semantic HTML

```tsx
// Good
<article className="card">
  <h2 className="text-xl font-bold">Title</h2>
  <p className="text-muted-foreground">Description</p>
</article>

// Avoid
<div className="card">
  <div className="text-xl font-bold">Title</div>
  <div className="text-muted-foreground">Description</div>
</div>
```

### 4. Keep Utility Order Consistent

```tsx
// Suggested order:
// 1. Layout (display, position, flex, grid)
// 2. Spacing (margin, padding)
// 3. Size (width, height)
// 4. Typography (font, text)
// 5. Visual (background, border, shadow)
// 6. States (hover, focus, dark)

<div className="flex items-center justify-between p-4 w-full text-lg font-medium bg-white border rounded-lg shadow-sm hover:shadow-md dark:bg-gray-800">
  Consistent order
</div>
```

---

## Quick Reference

| Category        | Examples                                           |
| --------------- | -------------------------------------------------- |
| Layout          | `flex`, `grid`, `block`, `hidden`                  |
| Spacing         | `p-4`, `m-2`, `gap-6`, `space-y-4`                 |
| Size            | `w-full`, `h-screen`, `max-w-7xl`                  |
| Typography      | `text-lg`, `font-bold`, `text-center`              |
| Colors          | `bg-white`, `text-gray-900`, `border-gray-200`     |
| Effects         | `shadow-md`, `rounded-lg`, `opacity-50`            |
| Transitions     | `transition-colors`, `duration-200`, `ease-in-out` |
| Responsive      | `md:flex`, `lg:grid-cols-3`, `sm:text-xl`          |
| State           | `hover:`, `focus:`, `active:`, `dark:`             |

---

**Language**: All documentation must be written in **English**.
