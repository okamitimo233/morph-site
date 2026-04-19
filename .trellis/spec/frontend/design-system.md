# Design System Guidelines

> High-quality frontend interface design principles for creating distinctive, production-grade interfaces that avoid generic AI aesthetics.

---

## Design Direction

Before implementing any UI, commit to a BOLD aesthetic direction:

- **Purpose**: What problem does this interface solve? Who uses it?
- **Tone**: Pick an extreme: brutally minimal, maximalist chaos, retro-futuristic, organic/natural, luxury/refined, playful/toy-like, editorial/magazine, brutalist/raw, art deco/geometric, soft/pastel, industrial/utilitarian, etc.
- **Constraints**: Technical requirements (framework, performance, accessibility)
- **Differentiation**: What makes this UNFORGETTABLE? What's the one thing someone will remember?

**CRITICAL**: Choose a clear conceptual direction and execute it with precision. Bold maximalism and refined minimalism both work. The key is intentionality, not intensity.

---

## Typography

### Principles

Always apply these:

- Use a **modular type scale** with fluid sizing (`clamp`) for headings on marketing/content pages
- Use **fixed `rem` scales** for app UIs and dashboards (no major design system uses fluid type in product UI)
- Use **fewer sizes with more contrast**. A 5-step scale with at least a 1.25 ratio between steps creates clearer hierarchy
- **Line-height scales inversely** with line length. Narrow columns want tighter leading
- For light text on dark backgrounds, **ADD 0.05-0.1** to your normal line-height
- Cap line length at **~65-75ch**

### Font Selection Procedure

**Step 1**: Write down 3 concrete words for the brand voice (e.g., "warm and mechanical and opinionated"). NOT "modern" or "elegant".

**Step 2**: List the 3 fonts you would normally reach for. They are most likely reflex defaults.

**Step 3**: Browse a font catalog with the 3 brand words in mind. Sources: Google Fonts, Pangram Pangram, Future Fonts, Adobe Fonts. Look for something that fits the brand as a _physical object_.

**Step 4**: Cross-check the result. If your final pick lines up with your reflex pattern, go back to Step 3.

### Rules

| DO                                   | DON'T                                           |
| ------------------------------------ | ----------------------------------------------- |
| Modular type scale with fluid sizing | Use overused fonts like Inter, Roboto           |
| Vary font weights for hierarchy      | Use monospace as shorthand for "tech"           |
| Pair distinctive display + body font | Use only one font family                        |
| At least 1.25 ratio between steps    | Flat hierarchy with sizes too close             |
| 65-75ch max line length for body     | Large icons with rounded corners above headings |

---

## Color & Theme

### Principles

- **Use OKLCH, not HSL**. OKLCH is perceptually uniform: equal steps in lightness _look_ equal
- As you move toward white or black, **REDUCE chroma** — high chroma at extreme lightness looks garish
- **Tint your neutrals** toward your brand hue. Even a chroma of 0.005-0.01 is perceptible
- The **60-30-10 rule** is about visual _weight_, not pixel count. 60% neutral / surface, 30% secondary text and borders, 10% accent

### Theme Selection

Theme (light vs dark) should be DERIVED from audience and viewing context:

| Use Case                              | Theme |
| ------------------------------------- | ----- |
| Perp DEX during fast trading          | Dark  |
| Hospital portal for anxious patients  | Light |
| Children's reading app                | Light |
| Vintage motorcycle forum (garage use) | Dark  |
| Observability dashboard (dark office) | Dark  |
| Wedding planning (Sunday morning)     | Light |
| Music player (headphone listening)    | Dark  |
| Food magazine (coffee break)          | Light |

### Rules

| DO                                   | DON'T                                           |
| ------------------------------------ | ----------------------------------------------- |
| Use OKLCH, `color-mix`, `light-dark` | Gray text on colored backgrounds                |
| Tint neutrals toward brand hue       | Pure black (#000) or pure white (#fff)          |
| 60-30-10 visual weight distribution  | AI palette: cyan-on-dark, purple-blue gradients |
| Derive theme from use context        | Gradient text for impact                        |
|                                      | Default to dark mode with glowing accents       |

---

## Layout & Space

### Principles

- Use a **4pt spacing scale** with semantic token names (`--space-sm`, `--space-md`)
- Scale: 4, 8, 12, 16, 24, 32, 48, 64, 96
- Use **`gap`** instead of margins for sibling spacing
- **Vary spacing for hierarchy**. A heading with extra space above it reads as more important
- Self-adjusting grid: `grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))`
- **Container queries** for components, **viewport queries** for page layout

### Rules

| DO                                    | DON'T                       |
| ------------------------------------- | --------------------------- |
| Create visual rhythm through spacing  | Wrap everything in cards    |
| Fluid spacing with `clamp()`          | Nest cards inside cards     |
| Asymmetry and unexpected compositions | Identical card grids        |
| Left-aligned text with asymmetry      | Hero metric layout template |
| 65-75ch max body text width           | Center everything           |
|                                       | Same spacing everywhere     |

---

## Visual Details

### Absolute Bans

These CSS patterns are NEVER acceptable:

**BAN 1: Side-stripe borders**

- PATTERN: `border-left:` or `border-right:` with width greater than 1px
- FORBIDDEN: `border-left: 3px solid red`, `border-left: 4px solid var(--color-warning)`
- REWRITE: Use full borders, background tints, leading numbers/icons, or no visual indicator

**BAN 2: Gradient text**

- PATTERN: `background-clip: text` combined with a gradient background
- REWRITE: Use a single solid color for text. Use weight or size for emphasis

### Rules

| DO                              | DON'T                                      |
| ------------------------------- | ------------------------------------------ |
| Intentional decorative elements | Side-stripe borders (>1px) on cards/alerts |
|                                 | Gradient text                              |
|                                 | Glassmorphism everywhere                   |
|                                 | Sparklines as decoration                   |
|                                 | Rounded rectangles with generic shadows    |
|                                 | Modals when alternatives exist             |

---

## Motion

Focus on high-impact moments: one well-orchestrated page load with staggered reveals creates more delight than scattered micro-interactions.

### Principles

- Use motion to convey state changes: entrances, exits, feedback
- Use **exponential easing** (ease-out-quart/quint/expo) for natural deceleration
- For height animations, use **grid-template-rows** transitions instead of animating height directly

### Rules

| DO                            | DON'T                                                      |
| ----------------------------- | ---------------------------------------------------------- |
| Convey state changes          | Animate layout properties (width, height, padding, margin) |
| Exponential easing            | Bounce or elastic easing                                   |
| Transform and opacity only    |                                                            |
| Grid-template-rows for height |                                                            |

---

## Interaction

### Principles

- Make interactions feel fast. Use **optimistic UI**: update immediately, sync later
- Use **progressive disclosure**. Start simple, reveal sophistication through interaction
- Design **empty states** that teach the interface, not just say "nothing here"

### Rules

| DO                               | DON'T                       |
| -------------------------------- | --------------------------- |
| Progressive disclosure           | Repeat the same information |
| Empty states that teach          | Make every button primary   |
| Intentional interactive surfaces |                             |

---

## Responsive

### Principles

- Use **container queries (@container)** for component-level responsiveness
- **Adapt** the interface for different contexts, not just shrink it

### Rules

| DO                               | DON'T                                 |
| -------------------------------- | ------------------------------------- |
| Container queries for components | Hide critical functionality on mobile |
| Adapt, don't amputate            |                                       |

---

## The AI Slop Test

**Critical quality check**: If you showed this interface to someone and said "AI made this," would they believe you immediately?

A distinctive interface should make someone ask "how was this made?" not "which AI made this?"

Review the DON'T guidelines above. They are the fingerprints of AI-generated work.

---

## Quick Reference

| Category   | Key Principle                            |
| ---------- | ---------------------------------------- |
| Typography | Modular scale, 1.25 ratio, 65-75ch max   |
| Color      | OKLCH, tint neutrals, 60-30-10 weight    |
| Space      | 4pt scale, `gap`, vary for hierarchy     |
| Motion     | Transform/opacity, exponential easing    |
| Bans       | No side-stripe borders, no gradient text |

---

## Code Examples

Design token templates following these principles:

| Example          | File                                                       | Use Case                 |
| ---------------- | ---------------------------------------------------------- | ------------------------ |
| Typography scale | `examples/skills/impeccable/typography-scale.css.template` | Fluid modular type scale |
| Color tokens     | `examples/skills/impeccable/color-tokens.css.template`     | OKLCH theme tokens       |
| Spacing scale    | `examples/skills/impeccable/spacing-scale.css.template`    | 4pt spacing system       |

**Usage**: Copy `.template` file → Remove `.template` suffix → Adapt to your design tokens

**Key principles**: Modular typography, OKLCH colors, 4pt spacing, absolute bans on side-stripes and gradient text

---

**Language**: All documentation must be written in **English**.
