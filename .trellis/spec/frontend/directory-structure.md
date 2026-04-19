# Directory Structure

> Project structure conventions for Astro + React applications.

---

## Recommended Directory Structure

```
src/
├── pages/                     # Astro file-based routing
│   ├── index.astro            # Home page
│   ├── about.astro            # Static page
│   ├── blog/
│   │   ├── index.astro        # Blog list
│   │   └── [...slug].astro    # Dynamic blog post
│   └── 404.astro              # Error page
│
├── layouts/                   # Page layouts (.astro)
│   ├── BaseLayout.astro       # Base HTML structure
│   ├── BlogLayout.astro       # Blog post layout
│   └── components/
│       ├── Header.astro       # Header component
│       └── Footer.astro       # Footer component
│
├── components/                # Shared components
│   ├── ui/                    # Base UI components (Astro or React)
│   │   ├── Button.astro
│   │   ├── Card.astro
│   │   └── Input.tsx          # React component (needs client:*)
│   │
│   └── islands/               # React interactive components
│       ├── Search.tsx         # client:idle
│       ├── Counter.tsx        # client:visible
│       └── Form.tsx           # client:load
│
├── features/                  # Feature-based modules
│   └── auth/
│       ├── components/
│       ├── hooks/
│       ├── context/
│       └── index.ts
│
├── content/                   # Astro content collections
│   ├── config.ts              # Content collection schema
│   └── blog/
│       └── post-1.md
│
├── styles/                    # Global styles
│   ├── global.css             # Global CSS + Tailwind
│   └── tokens.css             # Design tokens
│
├── lib/                       # Utility functions
│   ├── utils.ts
│   └── constants.ts
│
├── hooks/                     # Global React hooks
│   └── useScrollPosition.ts
│
└── env.d.ts                   # Astro type declarations

public/                        # Static assets (served as-is)
├── favicon.svg
├── fonts/
└── images/

astro.config.mjs               # Astro configuration
tailwind.config.ts             # Tailwind configuration (if using file)
tsconfig.json                  # TypeScript configuration
```

---

## Module Structure

Each feature module follows a consistent internal structure:

```
features/
├── {feature}/
│   ├── components/     # UI components specific to this module
│   │   ├── FeatureList.tsx
│   │   ├── FeatureItem.tsx
│   │   └── FeatureDialog.tsx
│   │
│   ├── hooks/          # Custom hooks for this module
│   │   ├── index.ts    # Re-exports
│   │   ├── useFeature.ts
│   │   └── useFeatureMutation.ts
│   │
│   ├── context/        # React context (if needed)
│   │   └── FeatureContext.tsx
│   │
│   ├── constants.ts    # Module-specific constants
│   ├── types.ts        # Module-specific types
│   └── index.ts        # Public exports
```

---

## Astro vs React Components

### When to use `.astro` vs `.tsx`

| Type                   | Extension | Reason                                    |
| ---------------------- | --------- | ----------------------------------------- |
| Static components      | `.astro`  | No client-side JavaScript needed          |
| Layout wrappers        | `.astro`  | Server-rendered, SEO-friendly             |
| SEO-critical content   | `.astro`  | Fully rendered at build/request time      |
| Interactive components | `.tsx`    | Needs state, event handlers, or lifecycle |
| Forms with validation  | `.tsx`    | Client-side interactivity required        |
| Animations (GSAP)      | `.tsx`    | Requires DOM access and JavaScript        |

### Component Placement

```
components/
├── ui/                    # Astro components (default)
│   ├── Card.astro         # Static card
│   └── Badge.astro        # Static badge
│
└── islands/               # React components (interactive)
    ├── SearchForm.tsx     # Interactive search
    └── AnimatedHero.tsx   # GSAP animation
```

---

## CSS Organization

Astro supports multiple styling approaches:

```
src/styles/
├── global.css             # Entry point (Tailwind imports)
├── tokens.css             # CSS custom properties
└── components/            # Component-scoped styles (if needed)
    └── hero.css
```

**With Tailwind CSS 4:**

```css
/* src/styles/global.css */
@import 'tailwindcss';

/* Custom CSS after Tailwind */
@layer components {
  .card {
    @apply rounded-lg p-4 bg-white shadow-md;
  }
}
```

**Import in Astro:**

```astro
---
// src/layouts/BaseLayout.astro
import '../styles/global.css';
---
```

---

## Feature vs Module

| Type        | Purpose                                | Examples                       |
| ----------- | -------------------------------------- | ------------------------------ |
| **Feature** | Cross-cutting concerns, infrastructure | `auth`, `search`, `navigation` |
| **Module**  | Domain-specific functionality          | `products`, `blog`, `gallery`  |

**Features** live in `features/`:

- Used across multiple pages/modules
- Provide contexts, hooks for app-wide functionality
- Examples: authentication, theming, search

**Modules** are typically content-driven:

- Self-contained domain logic
- May use features but not other modules
- Examples: blog posts, product catalog

---

## Import Conventions

### From Within a Module

```typescript
// Inside features/auth/components/LoginForm.tsx
import { useAuth } from '../hooks'
import { AUTH_CONSTANTS } from '../constants'
import type { User } from '../types'
```

### From Outside a Module

```typescript
// Inside components/islands/Header.tsx
import { useAuth } from '../../features/auth/hooks'
// Or if re-exported from module index:
import { useAuth } from '../../features/auth'
```

### Astro Page Imports

```astro
---
// Import React components
import Hero from '../components/islands/Hero.tsx';
import Card from '../components/ui/Card.astro';

// Import layouts
import BaseLayout from '../layouts/BaseLayout.astro';
---
```

---

## File Naming Conventions

| Type             | Convention                       | Example                          |
| ---------------- | -------------------------------- | -------------------------------- |
| Astro pages      | kebab-case                       | `about.astro`, `blog-post.astro` |
| Astro components | PascalCase                       | `Card.astro`, `NavBar.astro`     |
| React components | PascalCase                       | `SearchForm.tsx`, `Counter.tsx`  |
| Hooks            | camelCase with `use` prefix      | `useAuth.ts`, `useScroll.ts`     |
| Contexts         | PascalCase with `Context` suffix | `AuthContext.tsx`                |
| Constants        | SCREAMING_SNAKE_CASE (values)    | `constants.ts` with `API_URL`    |
| Types            | PascalCase                       | `types.ts` with `User`           |
| Utilities        | camelCase                        | `formatDate.ts`, `parseQuery.ts` |
| CSS              | kebab-case                       | `hero.css`, `nav-bar.css`        |

---

## Content Collections

Use Astro's content collections for structured content:

```
src/content/
├── config.ts              # Collection schema
├── blog/
│   ├── post-1.md
│   └── post-2.md
└── products/
    ├── product-1.md
    └── product-2.md
```

**Schema definition:**

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content'

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    updatedDate: z.date().optional(),
    heroImage: z.string().optional(),
  }),
})

export const collections = { blog }
```

---

## Quick Reference

| Question                            | Answer                                   |
| ----------------------------------- | ---------------------------------------- |
| Where do static components go?      | `src/components/ui/` (Astro)             |
| Where do interactive components go? | `src/components/islands/` (React)        |
| Where do page layouts go?           | `src/layouts/`                           |
| Where do global styles go?          | `src/styles/global.css`                  |
| Where do hooks go?                  | In `hooks/` folder of relevant feature   |
| Where do global hooks go?           | `src/hooks/`                             |
| Where does content go?              | `src/content/` (use content collections) |

---

**Language**: All documentation must be written in **English**.
