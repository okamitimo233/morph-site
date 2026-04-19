# HeroUI React Components

> HeroUI v3 component library guide for building accessible, customizable UI components with Tailwind CSS v4 and React Aria.

---

## CRITICAL: v3 Only - Ignore v2 Knowledge

**This guide is for HeroUI v3 ONLY.** Do NOT apply v2 patterns:

| Feature       | v2 (DO NOT USE)                   | v3 (USE THIS)                     |
| ------------- | --------------------------------- | --------------------------------- |
| Provider      | `<HeroUIProvider>` required       | **No Provider needed**            |
| Animations    | `framer-motion` package           | CSS-based, no extra deps          |
| Component API | Flat props: `<Card title="x">`    | Compound: `<Card><Card.Header>`   |
| Styling       | Tailwind v3 + `@heroui/theme`     | Tailwind v4 + `@heroui/styles`    |
| Packages      | `@heroui/system`, `@heroui/theme` | `@heroui/react`, `@heroui/styles` |

```tsx
// DO NOT DO THIS - v2 pattern
import { HeroUIProvider } from '@heroui/react'
import { motion } from 'framer-motion'
;<HeroUIProvider>
  <Card title="Product" description="A great product" />
</HeroUIProvider>
```

```tsx
// DO THIS - v3 pattern (no provider, compound components)
import { Card } from '@heroui/react'
;<Card>
  <Card.Header>
    <Card.Title>Product</Card.Title>
    <Card.Description>A great product</Card.Description>
  </Card.Header>
</Card>
```

---

## Installation

```bash
pnpm add @heroui/styles @heroui/react tailwind-variants tailwindcss @tailwindcss/postcss postcss
```

### CSS Setup

```css
/* globals.css - Order matters! */
@import 'tailwindcss'; /* Must be first */
@import '@heroui/styles'; /* Must be after Tailwind */
```

### Layout Setup (Astro)

```tsx
// No Provider needed in HeroUI v3!
import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
```

---

## Core Principles

- **Semantic variants** (`primary`, `secondary`, `tertiary`) over visual descriptions
- **Composition over configuration** (compound components)
- **CSS variable-based theming** with `oklch` color space
- **BEM naming convention** for predictable styling

---

## Semantic Variants

HeroUI uses semantic naming to communicate functional intent:

| Variant     | Purpose                           | Usage          |
| ----------- | --------------------------------- | -------------- |
| `primary`   | Main action to move forward       | 1 per context  |
| `secondary` | Alternative actions               | Multiple       |
| `tertiary`  | Dismissive actions (cancel, skip) | Sparingly      |
| `danger`    | Destructive actions               | When needed    |
| `ghost`     | Low-emphasis actions              | Minimal weight |
| `outline`   | Secondary actions                 | Bordered style |

**Don't use raw colors** - semantic variants adapt to themes and accessibility.

---

## Component Patterns

### Button

```tsx
import { Button } from "@heroui/react";

// Primary action
<Button variant="primary" onPress={handleSave}>
  Save Changes
</Button>

// Secondary action
<Button variant="secondary" onPress={handleCancel}>
  Cancel
</Button>

// Destructive action
<Button variant="danger" onPress={handleDelete}>
  Delete
</Button>

// Ghost (low emphasis)
<Button variant="ghost" onPress={handleInfo}>
  Learn More
</Button>
```

### Card

```tsx
import { Card } from '@heroui/react'
;<Card>
  <Card.Header>
    <Card.Title>Card Title</Card.Title>
    <Card.Description>Card description text</Card.Description>
  </Card.Header>
  <Card.Content>
    <p>Main content goes here</p>
  </Card.Content>
  <Card.Footer>
    <Button variant="primary">Action</Button>
  </Card.Footer>
</Card>
```

### Modal

```tsx
import { Modal } from '@heroui/react'

function ModalExample() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button variant="primary" onPress={() => setOpen(true)}>
        Open Modal
      </Button>

      <Modal open={open} onOpenChange={setOpen}>
        <Modal.Header>
          <Modal.Title>Confirm Action</Modal.Title>
        </Modal.Header>
        <Modal.Content>
          <p>Are you sure you want to proceed?</p>
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
    </>
  )
}
```

### Form

```tsx
import { Form, TextField } from '@heroui/react'
;<Form onSubmit={handleSubmit}>
  <Form.Item name="email" label="Email">
    <TextField type="email" placeholder="your@email.com" />
  </Form.Item>
  <Form.Item name="password" label="Password">
    <TextField type="password" />
  </Form.Item>
  <Button variant="primary" type="submit">
    Sign In
  </Button>
</Form>
```

---

## Theming

HeroUI v3 uses CSS variables with `oklch` color space:

```css
:root {
  --accent: oklch(0.6204 0.195 253.83);
  --accent-foreground: var(--snow);
  --background: oklch(0.9702 0 0);
  --foreground: var(--eclipse);
}
```

### Color Naming Convention

| Variable              | Purpose              |
| --------------------- | -------------------- |
| `--accent`            | Background color     |
| `--accent-foreground` | Text color on accent |
| `--background`        | Page background      |
| `--foreground`        | Primary text color   |

### Theme Switching

```html
<!-- Dark mode -->
<html class="dark" data-theme="dark"></html>

<!-- Light mode -->
<html class="light" data-theme="light"></html>
```

---

## Event Handling

Use `onPress` instead of `onClick` for better accessibility:

```tsx
// DO THIS
<Button variant="primary" onPress={handleClick}>
  Click Me
</Button>

// DON'T DO THIS
<Button variant="primary" onClick={handleClick}>
  Click Me
</Button>
```

---

## Accessibility

HeroUI is built on React Aria Components, providing:

- Keyboard navigation
- Screen reader support
- Focus management
- ARIA attributes

### Focus Ring

Focus styles are handled automatically. Ensure your CSS doesn't override:

```css
/* Don't override these */
:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
```

---

## Critical Setup Requirements

1. **Tailwind CSS v4 is MANDATORY** - HeroUI v3 will NOT work with Tailwind CSS v3
2. **Use Compound Components** - Components use compound structure
3. **Use onPress, not onClick** - For better accessibility
4. **Import Order Matters** - Always import Tailwind CSS before HeroUI styles

---

## Fetching Documentation

For component details, examples, props, and implementation patterns:

```bash
# List all available components
node .agents/skills/heroui-react/scripts/list_components.mjs

# Get component documentation (MDX)
node .agents/skills/heroui-react/scripts/get_component_docs.mjs Button
node .agents/skills/heroui-react/scripts/get_component_docs.mjs Button Card TextField

# Get component source code
node .agents/skills/heroui-react/scripts/get_source.mjs Button

# Get component CSS styles (BEM classes)
node .agents/skills/heroui-react/scripts/get_styles.mjs Button

# Get theme variables
node .agents/skills/heroui-react/scripts/get_theme.mjs
```

### Direct MDX URLs

- Component docs: `https://heroui.com/docs/react/components/{component-name}.mdx`
- Getting started: `https://heroui.com/docs/react/getting-started/{topic}.mdx`

**Important:** Always fetch component docs before implementing.

---

## Quick Reference

| Task           | Code                                         |
| -------------- | -------------------------------------------- |
| Primary button | `<Button variant="primary">`                 |
| Destructive    | `<Button variant="danger">`                  |
| Card structure | `<Card><Card.Header><Card.Title>`            |
| Modal          | `<Modal open={open} onOpenChange={setOpen}>` |
| Event handler  | `onPress={handler}` (not onClick)            |
| Theme dark     | `<html class="dark" data-theme="dark">`      |

---

## Code Examples

All component patterns in this guide are available as copy-paste templates:

| Example                 | File                                                        | Use Case                        |
| ----------------------- | ----------------------------------------------------------- | ------------------------------- |
| Button variants         | `examples/skills/heroui-react/button-variants.tsx.template` | Primary/secondary/ghost buttons |
| Card compound component | `examples/skills/heroui-react/card-pattern.tsx.template`    | Product cards, content cards    |
| Modal dialog            | `examples/skills/heroui-react/modal-pattern.tsx.template`   | Confirmation dialogs            |
| Form with TextField     | `examples/skills/heroui-react/form-pattern.tsx.template`    | Login/signup forms              |

**Usage**: Copy `.template` file → Remove `.template` suffix → Adapt to your needs

**Critical**: These examples use v3 patterns (no Provider, compound components, CSS animations)

---

**Language**: All documentation must be written in **English**.
