# Design System (Impeccable) Examples

This directory contains design system patterns following the Impeccable skill guidelines.

## Files

| File                            | Description            |
| ------------------------------- | ---------------------- |
| `typography-scale.css.template` | Fluid typography scale |
| `color-tokens.css.template`     | OKLCH color tokens     |
| `spacing-scale.css.template`    | 4pt spacing scale      |

## Design Principles

### Typography

- Use modular scale with 1.25 ratio minimum
- Fluid sizing with `clamp()` for headings
- Fixed `rem` for app UI
- 65-75ch max line length

### Color

- Use OKLCH for perceptual uniformity
- Tint neutrals toward brand hue
- 60-30-10 visual weight rule
- Derive theme from use context

### Space

- 4pt scale: 4, 8, 12, 16, 24, 32, 48, 64, 96
- Use `gap` instead of margins
- Vary spacing for hierarchy

## Absolute Bans

Never use:

- Side-stripe borders (`border-left: 3px solid`)
- Gradient text (`background-clip: text` with gradient)
- Glassmorphism everywhere
- Sparklines as decoration
