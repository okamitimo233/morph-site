---
name: heroui-react
description: 'HeroUI v3 React component library (Tailwind CSS v4 + React Aria). Use when building UIs with HeroUI. Keywords: HeroUI, Hero UI, heroui, @heroui/react.'
---

# HeroUI v3 Quick Reference

> **CRITICAL**: This is HeroUI v3 ONLY. No Provider needed. Use compound components.

## v3 vs v2

| Feature  | v3 Pattern                      |
| -------- | ------------------------------- |
| Provider | **No Provider needed**          |
| API      | Compound: `<Card><Card.Header>` |
| Events   | Use `onPress`, not `onClick`    |
| Styling  | Tailwind v4 + `@heroui/styles`  |

## Semantic Variants

| Variant     | Purpose                     |
| ----------- | --------------------------- |
| `primary`   | Main action (1 per context) |
| `secondary` | Alternative actions         |
| `tertiary`  | Dismissive (cancel, skip)   |
| `danger`    | Destructive actions         |
| `ghost`     | Low-emphasis actions        |

## Component Patterns

```tsx
// Button
<Button variant="primary" onPress={handler}>Save</Button>

// Card (compound)
<Card>
  <Card.Header>
    <Card.Title>Title</Card.Title>
  </Card.Header>
  <Card.Content>Content</Card.Content>
</Card>

// Modal
<Modal open={open} onOpenChange={setOpen}>
  <Modal.Header><Modal.Title>Title</Modal.Title></Modal.Header>
  <Modal.Content>...</Modal.Content>
  <Modal.Footer>
    <Button variant="tertiary">Cancel</Button>
    <Button variant="primary">Confirm</Button>
  </Modal.Footer>
</Modal>
```

## Theming (oklch)

```css
:root {
  --accent: oklch(0.62 0.195 253.83);
  --accent-foreground: var(--snow);
}

/* Dark mode */
<html class="dark" data-theme="dark"></html>
```

## Fetch Docs

```bash
node scripts/list_components.mjs
node scripts/get_component_docs.mjs Button
node scripts/get_styles.mjs Button
```

## Rules

- Use `onPress`, not `onClick`
- No `HeroUIProvider` needed
- Import Tailwind before HeroUI styles in CSS
- Tailwind CSS v4 is MANDATORY
