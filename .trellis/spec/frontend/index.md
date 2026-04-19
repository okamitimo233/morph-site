# Astro + React Frontend Development Guidelines

> Universal frontend development guidelines for Astro applications with React + TypeScript.

## Tech Stack

- **Framework**: Astro 6.x
- **UI**: React 19
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 4.x
- **Animation**: GSAP 3.x
- **Build**: Vite (via Astro)
- **Linter**: ESLint + typescript-eslint

---

## Documentation Files

| File                                                 | Description                                     | Priority      |
| ---------------------------------------------------- | ----------------------------------------------- | ------------- | ----------------------------------------- |
| [astro-integration.md](./astro-integration.md)       | Astro + React integration, client directives    | **Must Read** |
| [islands-architecture.md](./islands-architecture.md) | Islands architecture, hydration patterns        | **Must Read** |
| [astro-routing.md](./astro-routing.md)               | File-based routing, dynamic routes, endpoints   | **Must Read** |
| [react-pitfalls.md](./react-pitfalls.md)             | Critical React patterns and common mistakes     | **Must Read** |
| [tailwind-css.md](./tailwind-css.md)                 | Tailwind CSS 4 configuration and patterns       | **Must Read** |
| [design-system.md](./design-system.md)               | High-quality UI design principles               | Reference     | [Examples](./examples/skills/impeccable/) |
| [gsap-animation.md](./gsap-animation.md)             | GSAP integration and animation patterns         | Reference     |
| [heroui-components.md](./heroui-components.md)       | HeroUI v3 component library patterns            | Reference     |
| [state-management.md](./state-management.md)         | Context, state patterns, data fetching          | Reference     |
| [components.md](./components.md)                     | Semantic HTML, empty states, scrollbar patterns | Reference     |
| [hooks.md](./hooks.md)                               | Query and mutation hook patterns                | Reference     |
| [type-safety.md](./type-safety.md)                   | Types, import paths, module constants           | Reference     |
| [directory-structure.md](./directory-structure.md)   | Project structure conventions                   | Reference     |
| [css-design.md](./css-design.md)                     | CSS organization and design tokens              | Reference     |
| [quality.md](./quality.md)                           | Code quality and performance standards          | Reference     |

---

## Quick Navigation by Task

### Before Starting Development

| Task                        | Document                                             |
| --------------------------- | ---------------------------------------------------- |
| Understand Astro + React    | [astro-integration.md](./astro-integration.md)       |
| Know when to hydrate        | [islands-architecture.md](./islands-architecture.md) |
| Set up routing              | [astro-routing.md](./astro-routing.md)               |
| Avoid common React mistakes | [react-pitfalls.md](./react-pitfalls.md)             |

### During Development

| Task                  | Document                                       | Examples                                                    |
| --------------------- | ---------------------------------------------- | ----------------------------------------------------------- |
| Style with Tailwind   | [tailwind-css.md](./tailwind-css.md)           | -                                                           |
| Add animations        | [gsap-animation.md](./gsap-animation.md)       | [GSAP Examples](./examples/skills/gsap/)                    |
| Use HeroUI components | [heroui-components.md](./heroui-components.md) | [HeroUI Examples](./examples/skills/heroui-react/)          |
| Manage state          | [state-management.md](./state-management.md)   | -                                                           |
| Build UI components   | [components.md](./components.md)               | -                                                           |
| Ensure type safety    | [type-safety.md](./type-safety.md)             | [TS Examples](./examples/skills/typescript-advanced-types/) |

### Before Committing

| Task                    | Document                         |
| ----------------------- | -------------------------------- |
| Check code quality      | [quality.md](./quality.md)       |
| Verify CSS organization | [css-design.md](./css-design.md) |

---

## Core Rules Summary

| Rule                                                         | Reference                                            |
| ------------------------------------------------------------ | ---------------------------------------------------- |
| **Minimize client-side JavaScript**                          | [islands-architecture.md](./islands-architecture.md) |
| **Use correct client:\* directive**                          | [astro-integration.md](./astro-integration.md)       |
| **Server-rendered HTML must match client**                   | [astro-integration.md](./astro-integration.md)       |
| **Wrap functions with `() =>` when storing in useState**     | [react-pitfalls.md](./react-pitfalls.md)             |
| **Use `useMemo` for objects/Date passed to hooks**           | [react-pitfalls.md](./react-pitfalls.md)             |
| **Distinguish initial load vs refetch**                      | [react-pitfalls.md](./react-pitfalls.md)             |
| **No non-null assertions `!`**                               | [quality.md](./quality.md)                           |
| **Use `scrollbar-gutter: stable` for scrollable containers** | [components.md](./components.md)                     |

---

## Architecture Overview

```
+----------------------------------------------------------+
|                    Astro Pages                           |
|  +--------------+  +--------------+  +-----------------+  |
|  |   .astro     |  |   Layouts    |  |   Components    |  |
|  |   Pages      |  |   (.astro)   |  |   (.astro)      |  |
|  +------+-------+  +--------------+  +-----------------+  |
+---------|-------------------------------------------------+
          | client:* directive
          v
+----------------------------------------------------------+
|                    React Islands                         |
|  +--------------+  +--------------+  +-----------------+  |
|  |   .tsx       |  |   Context    |  |   Hooks &       |  |
|  |   Components |  |   Providers  |  |   State         |  |
|  +--------------+  +--------------+  +-----------------+  |
+----------------------------------------------------------+
          |
          v
+----------------------------------------------------------+
|                    External Services                     |
|  +--------------+  +--------------+  +-----------------+  |
|  |   REST APIs  |  |   CMS        |  |   Databases     |  |
|  +--------------+  +--------------+  +-----------------+  |
+----------------------------------------------------------+
```

---

## Getting Started

1. **Read the Must-Read documents** - Especially Astro integration and Islands architecture
2. **Set up your project structure** - Follow [directory-structure.md](./directory-structure.md)
3. **Configure TypeScript** - See [type-safety.md](./type-safety.md)
4. **Implement routes and pages** - Use patterns from [astro-routing.md](./astro-routing.md)
5. **Build components** - Follow [components.md](./components.md) and [react-pitfalls.md](./react-pitfalls.md)

---

## Relationship to Other Layers

| Layer           | Purpose                  | Relationship                                          |
| --------------- | ------------------------ | ----------------------------------------------------- |
| `shared/`       | Cross-layer standards    | Frontend specs **reference** these for base standards |
| `big-question/` | Deep-dive investigations | May reference frontend patterns or inform new ones    |
| `guides/`       | Thinking guides          | Apply thinking patterns when implementing frontend    |

**Key principle**: Frontend specs extend shared standards with frontend-specific content. Always check `shared/` for base standards first.

---

**Language**: All documentation is written in **English**.
