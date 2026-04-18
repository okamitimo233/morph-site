# HeroUI React Examples

This directory contains HeroUI v3 component patterns for React in Astro projects.

## Files

| File                      | Description                    |
| ------------------------- | ------------------------------ |
| `button-variants.tsx.template` | Button variant patterns   |
| `card-pattern.tsx.template`    | Card compound component    |
| `modal-pattern.tsx.template`   | Modal dialog pattern       |
| `form-pattern.tsx.template`    | Form with TextField        |

## Critical: v3 Only

These examples use HeroUI v3 patterns:

| Feature       | v3 Pattern                           |
| ------------- | ------------------------------------ |
| Provider      | **No Provider needed**               |
| Animations    | CSS-based (no framer-motion)         |
| Component API | Compound: `<Card><Card.Header>`      |
| Events        | Use `onPress`, not `onClick`         |

## Setup

```css
/* globals.css */
@import "tailwindcss";
@import "@heroui/styles";
```

## Usage

1. Copy the `.template` file to your components directory
2. Remove the `.template` suffix
3. Ensure `@heroui/react` and `@heroui/styles` are installed
4. Use with `client:*` directive in Astro pages
