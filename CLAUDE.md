# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Tech Stack**: Astro 6.x + React 19 + TypeScript (strict mode) + Tailwind CSS 4.x + GSAP

**Architecture**: Islands architecture - React components hydrate only when needed via `client:*` directives.

**Package Manager**: pnpm@11.0.0

## Essential Commands

```bash
pnpm dev          # Start development server
pnpm build        # Build for production (runs `astro build`)
pnpm lint         # Run ESLint
pnpm lint:fix     # Run ESLint with auto-fix
pnpm typecheck    # Run Astro check + TypeScript (MUST pass before commit)
pnpm format       # Format code with Prettier
pnpm format:check # Check code formatting
```

## Path Aliases

Use these instead of relative imports:

- `@/*` → `src/*`
- `@components/*` → `src/components/*`
- `@layouts/*` → `src/layouts/*`
- `@styles/*` → `src/styles/*`
- `@lib/*` → `src/lib/*`

## Development Workflow

**This project uses Trellis workflow** - see `.trellis/workflow.md` for the complete process.

1. **Before starting**: Run `/trellis:start`
2. **Read guidelines**: `.trellis/spec/frontend/index.md` and `.trellis/spec/shared/index.md`
3. **Before commit**: Run `pnpm lint && pnpm typecheck` (or use `/trellis:finish-work`)
4. **After commit**: Run `/trellis:record-session`

## Project-Specific Details

### Image Service

Uses Astro's default Sharp-based image service for optimized images.

### Remote Images

`images.unsplash.com` is whitelisted in `astro.config.mjs` - add other domains as needed.

### Tailwind CSS 4.x

Uses `@tailwindcss/vite` plugin (not Astro's Tailwind integration). Config: `tailwind.config.ts`, CSS variables: `src/styles/tokens.css`.

## Important Notes

- **No test framework** - manual testing required before commits
- **Formatter**: Prettier with Standard style (no semicolons, single quotes)
- **Strict TypeScript** - `astro/tsconfigs/strict` is extended
- **Guidelines location**: Check `.trellis/spec/` for authoritative guidelines

## AI Agent Configuration

- `.claude/agents/` - Custom agent definitions
- `.claude/commands/trellis/` - Custom slash commands
- `.agents/skills/` - Skill documentation

**When in doubt, ask the user or check `.trellis/spec/` for guidelines.**
