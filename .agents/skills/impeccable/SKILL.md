---
name: impeccable
description: Create distinctive, production-grade frontend interfaces. Call with 'craft' for shape-then-build, 'teach' for design context setup, or 'extract' to pull reusable components.
---

# Impeccable Design Quick Reference

## Design Direction

Before implementing, define:

- **Purpose**: Who uses this? What problem does it solve?
- **Tone**: Pick an extreme (minimal, maximalist, retro-futuristic, luxury, playful, brutalist, etc.)
- **Differentiation**: What makes this UNFORGETTABLE?

## Typography

- Modular scale with **1.25 ratio** minimum
- Fluid `clamp()` for headings, fixed `rem` for app UI
- **65-75ch** max line length for body
- Line-height +0.05 for light-on-dark

## Color (OKLCH)

- Use **OKLCH**, not HSL (perceptually uniform)
- **Tint neutrals** toward brand hue
- **60-30-10** visual weight: 60% surface, 30% text/borders, 10% accent
- Reduce chroma at extreme lightness

## Space (4pt Scale)

```
4, 8, 12, 16, 24, 32, 48, 64, 96
```

- Use `gap` instead of margins
- Vary spacing for hierarchy
- `grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))`

## Absolute Bans

| BAN                      | Pattern                            |
| ------------------------ | ---------------------------------- |
| Side-stripe borders      | `border-left: 3px solid`           |
| Gradient text            | `background-clip: text` + gradient |
| Glassmorphism everywhere | Blur/glow as default               |

## Motion

- Use **transform/opacity** only
- **Exponential easing** (ease-out-quart/expo)
- No bounce/elastic easing

## The AI Slop Test

If you said "AI made this," would they believe you immediately? If yes, that's the problem.

## Commands

| Command               | Purpose                    |
| --------------------- | -------------------------- |
| `/impeccable craft`   | Shape-then-build interface |
| `/impeccable teach`   | Setup design context       |
| `/impeccable extract` | Pull reusable components   |
