# Type Safety Guidelines

> Type safety and module constants for Astro + React projects.
>
> **TypeScript best practices** (explicit return types, `import type`, generics, etc.) are defined in [shared/typescript.md](../shared/typescript.md).

---

## TypeScript Configuration

### Recommended tsconfig.json

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@layouts/*": ["src/layouts/*"],
      "@features/*": ["src/features/*"],
      "@lib/*": ["src/lib/*"],
      "@styles/*": ["src/styles/*"]
    },
    "jsx": "react-jsx",
    "jsxImportSource": "react"
  }
}
```

---

## Import Types from Central Location

Always import types from a central types location:

```typescript
// Good
import type { User } from '@lib/types/user'
import type { Post } from '@lib/types/content'

// Bad - don't redefine
interface User {
  id: string
  name: string
}
```

---

## Zod Schema for Enum Values

When you need to iterate over enum values (e.g., for dropdowns, filters), use Zod schemas:

```typescript
// src/lib/types/content.ts
import { z } from 'zod'

// Zod schemas
export const postStatusSchema = z.enum(['draft', 'published', 'archived'])
export const postCategorySchema = z.enum(['tech', 'design', 'business'])

// TypeScript types derived from schemas
export type PostStatus = z.infer<typeof postStatusSchema>
export type PostCategory = z.infer<typeof postCategorySchema>

// Entity types
export interface Post {
  id: string
  title: string
  content: string
  status: PostStatus
  category: PostCategory
  createdAt: number
  updatedAt: number
}
```

### Using Schema Options

```tsx
import { postStatusSchema } from '@lib/types/content'

// Get all valid status values
const STATUS_OPTIONS = postStatusSchema.options // ['draft', 'published', 'archived']

// Use in dropdowns
;<select>
  {postStatusSchema.options.map((status) => (
    <option key={status} value={status}>
      {status}
    </option>
  ))}
</select>
```

---

## Module-Level UI Constants

When multiple components within a module need the same display labels:

```typescript
// src/features/blog/constants.ts
import type { PostStatus, PostCategory } from '@lib/types/content'
import { postStatusSchema } from '@lib/types/content'

/**
 * Status display labels
 */
export const STATUS_LABELS: Record<PostStatus, string> = {
  draft: 'Draft',
  published: 'Published',
  archived: 'Archived',
}

/**
 * Status options for dropdowns - derived from Zod schema
 */
export const STATUS_OPTIONS: { value: PostStatus; label: string }[] = postStatusSchema.options.map(
  (value) => ({
    value,
    label: STATUS_LABELS[value],
  })
)
```

---

## Import Path Conventions

### Astro Imports

```astro
---
// Using path aliases in Astro frontmatter
import BaseLayout from '@layouts/BaseLayout.astro';
import Card from '@components/ui/Card.astro';
import InteractiveForm from '@components/islands/Form';
import { formatDate } from '@lib/utils';
---
```

### React Component Imports

```tsx
// Using path aliases in React components
import { useAuth } from '@features/auth/hooks'
import { Button } from '@components/ui/Button'
import { API_URL } from '@lib/constants'
import type { User } from '@lib/types/user'
```

---

## Astro-Specific Types

### Props Types for Astro Components

```typescript
// src/components/ui/Card.astro
---
interface Props {
  title: string;
  description?: string;
  href?: string;
}

const { title, description, href } = Astro.props;
---

<div class="card">
  {href ? <a href={href}><h2>{title}</h2></a> : <h2>{title}</h2>}
  {description && <p>{description}</p>}
</div>
```

### Props Types for React Components

```tsx
// src/components/islands/SearchForm.tsx
interface SearchFormProps {
  placeholder?: string
  onSearch?: (query: string) => void
  defaultValue?: string
}

export default function SearchForm({
  placeholder = 'Search...',
  onSearch,
  defaultValue = '',
}: SearchFormProps) {
  // ...
}
```

---

## Content Collection Types

Astro generates types for content collections automatically:

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content'

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    tags: z.array(z.string()).default([]),
  }),
})

export const collections = { blog }
```

### Using Content Collection Types

```astro
---
// src/pages/blog/[...slug].astro
import { getCollection, type CollectionEntry } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

interface Props {
  post: CollectionEntry<'blog'>;
}

const { post } = Astro.props;
const { Content } = await render(post);
---

<article>
  <h1>{post.data.title}</h1>
  <Content />
</article>
```

---

## Generic Type Patterns

### Hook with Generic Return Type

```typescript
interface UseFetchResult<T> {
  data: T | null
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export function useFetch<T>(url: string): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const refetch = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await fetch(url)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'))
    } finally {
      setIsLoading(false)
    }
  }, [url])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { data, isLoading, error, refetch }
}

// Usage
const { data: users, isLoading } = useFetch<User[]>('/api/users')
```

---

## Quick Reference

| Question                     | Answer                                                  |
| ---------------------------- | ------------------------------------------------------- |
| Where do shared types go?    | `src/lib/types/`                                        |
| How to import with aliases?  | `import type { X } from '@lib/types/x'`                 |
| How to type Astro props?     | `interface Props { ... }` in frontmatter                |
| How to type content?         | Use Zod schema in `content/config.ts`                   |
| How to avoid `!` assertions? | See [shared/code-quality.md](../shared/code-quality.md) |

---

## Advanced Type Patterns

For complex type-safe patterns (conditional types, mapped types, template literal types, discriminated unions), see the TypeScript Advanced Types examples:

| Example                           | File                                                                        | Use Case                 |
| --------------------------------- | --------------------------------------------------------------------------- | ------------------------ |
| Typed event emitter               | `examples/skills/typescript-advanced-types/typed-event-emitter.ts.template` | Type-safe pub/sub system |
| Deep utility types                | `examples/skills/typescript-advanced-types/deep-utils.ts.template`          | Deep Readonly/Partial    |
| Type-safe API client              | `examples/skills/typescript-advanced-types/api-client.ts.template`          | Endpoints with types     |
| Discriminated union state machine | `examples/skills/typescript-advanced-types/discriminated-union.ts.template` | State machines           |

**Usage**: Copy `.template` file → Remove `.template` suffix → Adapt to your domain

**Key concepts**: Conditional types, mapped types, template literal types, `infer` keyword

---

## Related Documents

| Document                                            | Purpose                                   |
| --------------------------------------------------- | ----------------------------------------- |
| [shared/typescript.md](../shared/typescript.md)     | TypeScript best practices (authoritative) |
| [shared/code-quality.md](../shared/code-quality.md) | Code quality standards                    |
| [shared/timestamp.md](../shared/timestamp.md)       | Timestamp format specification            |

---

**Language**: All documentation must be written in **English**.
