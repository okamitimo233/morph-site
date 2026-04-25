# HeroUI React Components

> HeroUI v3 component library patterns for Astro + React projects.

---

## Core Principles

| Principle               | Description                                                   |
| ----------------------- | ------------------------------------------------------------- |
| **No Provider needed**  | v3 does not require `HeroUIProvider`                          |
| **Compound components** | Use `<Card><Card.Header><Card.Title>` structure               |
| **Semantic variants**   | Use `primary`, `secondary`, `danger` over visual descriptions |
| **Use `onPress`**       | Prefer `onPress` over `onClick` for accessibility             |

---

## Semantic Variants

| Variant     | Purpose                           | Usage          |
| ----------- | --------------------------------- | -------------- |
| `primary`   | Main action to move forward       | 1 per context  |
| `secondary` | Alternative actions               | Multiple       |
| `tertiary`  | Dismissive actions (cancel, skip) | Sparingly      |
| `danger`    | Destructive actions               | When needed    |
| `ghost`     | Low-emphasis actions              | Minimal weight |

---

## Component Patterns

### Button

```tsx
import { Button } from '@heroui/react'

<Button variant="primary" onPress={handleSave}>Save</Button>
<Button variant="secondary" onPress={handleCancel}>Cancel</Button>
<Button variant="danger" onPress={handleDelete}>Delete</Button>
```

### Card (Compound)

```tsx
import { Card, Button } from '@heroui/react'

;<Card>
  <Card.Header>
    <Card.Title>Title</Card.Title>
    <Card.Description>Description</Card.Description>
  </Card.Header>
  <Card.Content>
    <p>Content</p>
  </Card.Content>
  <Card.Footer>
    <Button variant="primary">Action</Button>
  </Card.Footer>
</Card>
```

### Modal

```tsx
import { Modal, Button } from '@heroui/react'

;<Modal open={open} onOpenChange={setOpen}>
  <Modal.Header>
    <Modal.Title>Confirm</Modal.Title>
  </Modal.Header>
  <Modal.Content>
    <p>Are you sure?</p>
  </Modal.Content>
  <Modal.Footer>
    <Button variant="tertiary" onPress={() => setOpen(false)}>
      Cancel
    </Button>
    <Button variant="primary" onPress={handleConfirm}>
      Confirm
    </Button>
  </Modal.Footer>
</Modal>
```

---

## Event Handling

```tsx
// ✅ DO: Use onPress for accessibility
<Button variant="primary" onPress={handleClick}>Click Me</Button>

// ❌ DON'T: Use onClick
<Button variant="primary" onClick={handleClick}>Click Me</Button>
```

---

## Theming

HeroUI uses CSS variables with `oklch` color space:

```css
:root {
  --accent: oklch(0.6204 0.195 253.83);
  --accent-foreground: var(--snow);
  --background: oklch(0.9702 0 0);
  --foreground: var(--eclipse);
}
```

Theme switching via HTML class:

```html
<html class="dark" data-theme="dark"></html>
<html class="light" data-theme="light"></html>
```

---

## Critical Requirements

1. **Tailwind CSS v4 is MANDATORY** - v3 will not work
2. **Import order matters** - Tailwind CSS before HeroUI styles
3. **Use compound component structure** - Not flat props

---

## Reference

For complete component documentation, use the `@heroui-react` skill:

```bash
node .agents/skills/heroui-react/scripts/get_component_docs.mjs Button
```

Or visit [heroui.com/docs](https://heroui.com/docs/).

---

**Language**: All documentation must be written in **English**.
