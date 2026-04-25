# Thinking Flows for Astro + React Projects

> **Purpose**: Systematic thinking guides to catch issues before they become bugs.
>
> **Core Philosophy**: 30 minutes of thinking saves 3 hours of debugging.

---

## Why Thinking Flows?

**Most bugs and tech debt come from "didn't think of that"**, not from lack of skill:

- Didn't think about what happens at layer boundaries -> cross-layer bugs
- Didn't think about code patterns repeating -> duplicated code everywhere
- Didn't think about edge cases -> runtime errors
- Didn't think about future maintainers -> unreadable code

These guides help you **ask the right questions before coding**.

---

## Available Thinking Guides

| Guide                                                             | Purpose                                                      | When to Use                                          |
| ----------------------------------------------------------------- | ------------------------------------------------------------ | ---------------------------------------------------- |
| [Pre-Implementation Checklist](./pre-implementation-checklist.md) | Verify readiness before coding                               | Before starting any feature implementation           |
| [Bug Root Cause Analysis](./bug-root-cause-thinking-guide.md)     | Analyze bugs to understand preventability                    | After fixing any non-trivial bug                     |
| [Code Reuse Thinking](./code-reuse-thinking-guide.md)             | Identify patterns and reduce duplication                     | When you notice repeated code patterns               |
| [Semantic Change Checklist](./semantic-change-checklist.md)       | Ensure all code is updated when changing data interpretation | When changing how the system interprets a field/type |

---

## Quick Reference: When to Use Which Guide

### Before Writing Code

Use [Pre-Implementation Checklist](./pre-implementation-checklist.md) when:

- [ ] About to add a constant or config value
- [ ] About to implement new logic
- [ ] About to define a type
- [ ] About to create a component
- [ ] Feels like you've seen similar code before

### After Fixing Bugs

Use [Bug Root Cause Analysis](./bug-root-cause-thinking-guide.md) when:

- [ ] Just fixed a bug that took >30 minutes to debug
- [ ] Bug involved unexpected library behavior
- [ ] Bug involved assumptions about function behavior
- [ ] Similar bugs have occurred before

### Code Organization

Use [Code Reuse Thinking Guide](./code-reuse-thinking-guide.md) when:

- [ ] You're writing similar code to something that exists
- [ ] You see the same pattern repeated 3+ times
- [ ] You're adding a new field to multiple places
- [ ] **You're creating a new utility/helper function** (search first!)

### Semantic Changes

Use [Semantic Change Checklist](./semantic-change-checklist.md) when:

- [ ] Changing what a field value **means** (not just adding new values)
- [ ] Changing timestamp units (seconds vs milliseconds)
- [ ] Removing or redefining enum values
- [ ] Changing how null/undefined/default is interpreted

---

## The Pre-Modification Rule (CRITICAL)

> **Before changing ANY value, ALWAYS search first!**

```bash
# Search for the value you're about to change
rg "value_to_change" --type ts

# Check how many files define this value
rg "CONFIG_NAME" --type ts -c
```

This single habit prevents most "forgot to update X" bugs.

---

## Astro-Specific Architecture

In Astro + React projects, these are the typical layers:

```
Astro Pages (.astro files)
        |
        v
Layout Components (.astro)
        |
        v
React Islands (client:* directive)
        |
        v
React Components (interactive UI)
        |
        v
External APIs / Services
```

Each boundary is a potential source of issues due to:

- **Hydration mismatches** - Server-rendered HTML must match client
- **Client directive selection** - Choose correct `client:*` for each component
- **State isolation** - Each island has its own state
- **Bundle size** - Only hydrate what needs interactivity

---

## Core Principles

1. **Search Before Write** - Always search for existing patterns before creating new ones
2. **Think Before Code** - 5 minutes of checklist saves 50 minutes of debugging
3. **Document Assumptions** - Make implicit assumptions explicit
4. **Minimize Hydration** - Only hydrate components that need interactivity
5. **Learn From Bugs** - Add lessons to these guides after fixing non-trivial bugs

---

## Contributing

Found a new "didn't think of that" moment? Add it:

1. If it's a **general thinking pattern** -> Add to existing guide or create new one
2. If it caused a bug -> Add to "Lessons Learned" section in the relevant guide
3. If it's **project-specific** -> Create a separate project-specific guide

---

## Relationship to Other Layers

| Layer           | Purpose                      | Relationship                                         |
| --------------- | ---------------------------- | ---------------------------------------------------- |
| `shared/`       | Cross-layer standards        | Guides help you **apply** these standards correctly  |
| `frontend/`     | Frontend-specific guidelines | Guides inform **how** to implement frontend patterns |
| `big-question/` | Deep-dive investigations     | May **inform** new thinking guides                   |

**Key principle**: Guides are **thinking tools**, not specifications. They help you ask the right questions, but the answers come from the spec documents.

---

## Pre-Development Checklist

Before starting any non-trivial implementation:

- [ ] Read [pre-implementation-checklist.md](./pre-implementation-checklist.md)
- [ ] Search for existing patterns before creating new ones
- [ ] Identify potential cross-layer impacts

## Quality Check

After completing a feature:

- [ ] Apply [semantic-change-checklist.md](./semantic-change-checklist.md) if data semantics changed
- [ ] Run [bug-root-cause-thinking-guide.md](./bug-root-cause-thinking-guide.md) for any bugs fixed

---

**Language**: All documentation should be written in **English**.
