# Astro + React Development Guidelines

Universal development guidelines for Astro-based web applications.

---

## Layer Responsibilities

Based on Trellis spec system design:

| Layer             | Responsibility           | Content                                                               |
| ----------------- | ------------------------ | --------------------------------------------------------------------- |
| **shared/**       | Cross-layer standards    | Authoritative standards for TypeScript, code quality, timestamps, git |
| **frontend/**     | Frontend-specific        | Astro + React patterns, extending shared standards                    |
| **big-question/** | Deep-dive investigations | Complex issues with thorough analysis                                 |
| **guides/**       | Thinking guides          | Methodologies for problem-solving and decision-making                 |

---

## Structure

### [Shared](./shared/index.md) - Cross-layer Standards

> **Authoritative** for cross-cutting concerns. Other layers reference, not duplicate.

- [Code Quality](./shared/code-quality.md) - No `!` assertions, no `any`, naming conventions
- [TypeScript](./shared/typescript.md) - Explicit return types, `import type`, generics
- [Timestamp](./shared/timestamp.md) - Unix milliseconds throughout the stack
- [Git Conventions](./shared/git-conventions.md) - Commit format, branch naming

### [Frontend](./frontend/index.md) - Frontend-Specific Guidelines

> **Extends** shared standards with Astro + React specifics.

- [Astro Integration](./frontend/astro-integration.md) - React integration, client directives
- [Islands Architecture](./frontend/islands-architecture.md) - Hydration patterns
- [React Pitfalls](./frontend/react-pitfalls.md) - Common React mistakes
- [Type Safety](./frontend/type-safety.md) - Astro-specific type patterns
- [Quality Guidelines](./frontend/quality.md) - Frontend-specific quality rules
- [Components](./frontend/components.md) - Semantic HTML, empty states, scrollbars
- [State Management](./frontend/state-management.md) - Context, state patterns
- [And more...](./frontend/index.md)

### [Big Questions](./big-question/index.md) - Deep-dive Investigations

> Complex issues that required thorough analysis.

- [React useState Function](./big-question/react-usestate-function.md) - Function execution issue
- [CSS Flex Centering](./big-question/css-flex-centering.md) - Visual vs mathematical centering
- [Timestamp Precision](./big-question/timestamp-precision.md) - Seconds vs milliseconds mismatch

### [Guides](./guides/index.md) - Thinking Guides

> Methodologies for approaching complex decisions.

- [Pre-Implementation Checklist](./guides/pre-implementation-checklist.md)
- [Code Reuse Thinking Guide](./guides/code-reuse-thinking-guide.md)
- [Bug Root Cause Thinking Guide](./guides/bug-root-cause-thinking-guide.md)
- [Semantic Change Checklist](./guides/semantic-change-checklist.md)

---

## Document Relationships

```
shared/ (Authoritative Standards)
    ↑
    │ references
    │
frontend/ (Frontend-Specific Extensions)
    │
    │ links to
    ↓
big-question/ (Investigations reference specs as "correct" way)


All layers ← guides/ (Thinking tools apply across all)
```

---

## Tech Stack

- **Framework**: Astro 6.x with React 19 integration
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 4.x
- **Animation**: GSAP 3.x
- **Build**: Vite (via Astro)
- **Linter**: ESLint + typescript-eslint

---

## Usage

### Reading Guidelines

1. Start with `shared/` for base standards
2. Then read `frontend/` for Astro/React specifics
3. Reference `big-question/` when debugging complex issues
4. Use `guides/` for thinking methodology

### Adding New Guidelines

1. **Cross-layer concern?** → `shared/`
2. **Frontend-specific?** → `frontend/`
3. **Complex investigation?** → `big-question/`
4. **Thinking methodology?** → `guides/`

### Avoiding Duplication

- Check `shared/` before defining standards in other layers
- Use links to reference existing content instead of duplicating
- Each document should have a single, clear purpose

---

## Quick Reference

| Question                         | Where to Look                                                                        |
| -------------------------------- | ------------------------------------------------------------------------------------ |
| How to format commits?           | [shared/git-conventions.md](./shared/git-conventions.md)                             |
| How to handle timestamps?        | [shared/timestamp.md](./shared/timestamp.md)                                         |
| How to use client directives?    | [frontend/astro-integration.md](./frontend/astro-integration.md)                     |
| Why is my React state resetting? | [big-question/react-usestate-function.md](./big-question/react-usestate-function.md) |
| What to check before coding?     | [guides/pre-implementation-checklist.md](./guides/pre-implementation-checklist.md)   |
