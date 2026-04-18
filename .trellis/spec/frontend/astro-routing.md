# Astro Routing

> File-based routing, dynamic routes, and API endpoints in Astro.

---

## File-Based Routing

Astro uses file-based routing. Files in `src/pages/` become routes.

### Static Routes

| File Path                   | URL                    |
| --------------------------- | ---------------------- |
| `src/pages/index.astro`     | `/`                    |
| `src/pages/about.astro`     | `/about`               |
| `src/pages/blog/index.astro`| `/blog`                |
| `src/pages/blog/post.astro` | `/blog/post`           |

### Example Page

```astro
---
// src/pages/about.astro
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="About">
  <h1>About Us</h1>
  <p>This is the about page.</p>
</BaseLayout>
```

---

## Dynamic Routes

### Single Parameter

```astro
---
// src/pages/blog/[slug].astro
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map((post) => ({
    params: { slug: post.slug },
  }));
}

const { slug } = Astro.params;
---

<h1>Blog Post: {slug}</h1>
```

### Multiple Parameters

```astro
---
// src/pages/blog/[year]/[month]/[slug].astro
export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map((post) => ({
    params: {
      year: post.data.pubDate.getFullYear().toString(),
      month: (post.data.pubDate.getMonth() + 1).toString().padStart(2, '0'),
      slug: post.slug,
    },
  }));
}

const { year, month, slug } = Astro.params;
---

<h1>{year}/{month}/{slug}</h1>
```

### Rest Parameters (Catch-all)

```astro
---
// src/pages/docs/[...path].astro
export async function getStaticPaths() {
  return [
    { params: { path: 'getting-started' } },
    { params: { path: 'getting-started/installation' } },
    { params: { path: 'api/reference' } },
  ];
}

const { path } = Astro.params;
---

<h1>Docs: {path}</h1>
```

---

## Pagination

Use `paginate` function for paginated routes:

```astro
---
// src/pages/blog/[page].astro
import { getCollection } from 'astro:content';

export async function getStaticPaths({ paginate }) {
  const posts = await getCollection('blog');
  return paginate(posts, { pageSize: 10 });
}

const { page } = Astro.props;
---

<h1>Blog - Page {page.currentPage}</h1>

<ul>
  {page.data.map((post) => (
    <li>
      <a href={`/blog/${post.slug}`}>{post.data.title}</a>
    </li>
  ))}
</ul>

{page.url.prev && <a href={page.url.prev}>Previous</a>}
{page.url.next && <a href={page.url.next}>Next</a>}
```

---

## API Endpoints

Astro can serve API endpoints:

### GET Endpoint

```typescript
// src/pages/api/users.ts
import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const users = await fetchUsers();

  return new Response(JSON.stringify(users), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
```

### POST Endpoint

```typescript
// src/pages/api/contact.ts
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  const data = await request.json();

  // Validate input
  if (!data.email || !data.message) {
    return new Response(JSON.stringify({ error: 'Missing fields' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Process contact form
  await sendEmail(data);

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
```

### Multiple Methods

```typescript
// src/pages/api/posts/[id].ts
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ params }) => {
  const post = await getPost(params.id);
  return new Response(JSON.stringify(post));
};

export const PUT: APIRoute = async ({ params, request }) => {
  const data = await request.json();
  const post = await updatePost(params.id, data);
  return new Response(JSON.stringify(post));
};

export const DELETE: APIRoute = async ({ params }) => {
  await deletePost(params.id);
  return new Response(null, { status: 204 });
};
```

---

## Redirects

### Static Redirects

```javascript
// astro.config.mjs
export default defineConfig({
  redirects: {
    '/old-blog': '/blog',
    '/old-blog/:slug': '/blog/:slug',
  },
});
```

### Dynamic Redirects

```astro
---
// src/pages/redirect.astro
return Astro.redirect('/new-location');
---
```

---

## Route Organization

### Recommended Structure

```
src/pages/
├── index.astro              # Home page
├── about.astro              # Static page
├── contact.astro            # Contact page
│
├── blog/
│   ├── index.astro          # Blog list
│   ├── [page].astro         # Paginated list
│   └── [slug].astro         # Blog post
│
├── docs/
│   └── [...path].astro      # Documentation pages
│
├── api/
│   ├── contact.ts           # Contact form endpoint
│   ├── users.ts             # Users API
│   └── posts/
│       └── [id].ts          # Single post endpoint
│
└── 404.astro                # Not found page
```

---

## Page Props and Data

### Passing Props Between Pages

```astro
---
// src/pages/blog/[slug].astro
import BaseLayout from '../../layouts/BaseLayout.astro';
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await render(post);
---

<BaseLayout title={post.data.title}>
  <article>
    <h1>{post.data.title}</h1>
    <time datetime={post.data.pubDate.toISOString()}>
      {post.data.pubDate.toLocaleDateString()}
    </time>
    <Content />
  </article>
</BaseLayout>
```

---

## Navigation

### Link Component

```astro
---
// Use standard <a> tags for navigation
---

<nav>
  <a href="/">Home</a>
  <a href="/about">About</a>
  <a href="/blog">Blog</a>
</nav>
```

### Active Link Styling

```astro
---
const currentPath = Astro.url.pathname;
---

<nav>
  <a href="/" class:list={[{ active: currentPath === '/' }]}>Home</a>
  <a href="/about" class:list={[{ active: currentPath === '/about' }]}>About</a>
</nav>

<style>
  .active {
    font-weight: bold;
    color: var(--color-primary);
  }
</style>
```

---

## 404 Page

```astro
---
// src/pages/404.astro
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="Not Found">
  <div class="text-center py-20">
    <h1 class="text-6xl font-bold mb-4">404</h1>
    <p class="text-xl mb-8">Page not found</p>
    <a href="/" class="text-primary hover:underline">
      Go back home
    </a>
  </div>
</BaseLayout>
```

---

## Quick Reference

| Feature             | Syntax                              | Example                          |
| ------------------- | ----------------------------------- | -------------------------------- |
| Static route        | `filename.astro`                    | `about.astro` → `/about`         |
| Dynamic route       | `[param].astro`                     | `[slug].astro` → `/blog/hello`   |
| Catch-all route     | `[...param].astro`                  | `[...path].astro` → `/docs/a/b`  |
| Pagination          | `paginate(data, options)`           | `paginate(posts, { pageSize: 10 })` |
| API endpoint        | `export const GET/POST` in `.ts`    | `api/users.ts` → `/api/users`    |
| Redirect            | `Astro.redirect(url)`               | `return Astro.redirect('/new')`  |

---

**Language**: All documentation must be written in **English**.
