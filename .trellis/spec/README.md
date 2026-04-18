# Astro + React Development Guidelines

Universal development guidelines for Astro-based web applications.

## Structure

### [Frontend](./frontend/index.md)

Astro + React + TypeScript frontend development patterns:

- [Directory Structure](./frontend/directory-structure.md)
- [Astro Integration](./frontend/astro-integration.md)
- [Astro Routing](./frontend/astro-routing.md)
- [Islands Architecture](./frontend/islands-architecture.md)
- [Components](./frontend/components.md)
- [State Management](./frontend/state-management.md)
- [Hooks](./frontend/hooks.md)
- [Tailwind CSS](./frontend/tailwind-css.md)
- [GSAP Animation](./frontend/gsap-animation.md)
- [CSS Design](./frontend/css-design.md)
- [Type Safety](./frontend/type-safety.md)
- [React Pitfalls](./frontend/react-pitfalls.md)
- [Quality Guidelines](./frontend/quality.md)

### [Shared](./shared/index.md)

Cross-cutting concerns:

- [TypeScript Conventions](./shared/typescript.md)
- [Code Quality](./shared/code-quality.md)
- [Git Conventions](./shared/git-conventions.md)
- [Timestamp Handling](./shared/timestamp.md)

### [Guides](./guides/index.md)

Development thinking guides:

- [Pre-Implementation Checklist](./guides/pre-implementation-checklist.md)
- [Code Reuse Thinking Guide](./guides/code-reuse-thinking-guide.md)
- [Bug Root Cause Thinking Guide](./guides/bug-root-cause-thinking-guide.md)
- [Semantic Change Checklist](./guides/semantic-change-checklist.md)

### [Big Questions / Pitfalls](./big-question/index.md)

Common issues and solutions:

- [React useState Function](./big-question/react-usestate-function.md)
- [CSS Flex Centering](./big-question/css-flex-centering.md)
- [Timestamp Precision](./big-question/timestamp-precision.md)

## Tech Stack

- **Framework**: Astro 6.x with React 19 integration
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 4.x
- **Animation**: GSAP 3.x
- **Build**: Vite (via Astro)
- **Linter**: Biome

## Usage

These guidelines can be used as:

1. **New Project Template** - Copy the entire structure for new Astro projects
2. **Reference Documentation** - Consult specific guides when implementing features
3. **Code Review Checklist** - Verify implementations against established patterns
4. **Onboarding Material** - Help new developers understand project conventions
