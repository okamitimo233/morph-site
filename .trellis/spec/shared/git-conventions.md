# Git Conventions

> Git commit message format and branch naming conventions.

---

## Commit Message Format

```
type(scope): description

[optional body]

[optional footer]
```

### Types

| Type       | Description                                             |
| ---------- | ------------------------------------------------------- |
| `feat`     | New feature                                             |
| `fix`      | Bug fix                                                 |
| `docs`     | Documentation only                                      |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `test`     | Adding or updating tests                                |
| `chore`    | Build process, dependencies, or tooling                 |
| `style`    | Formatting, missing semicolons, etc.                    |
| `perf`     | Performance improvement                                 |

### Scopes

Scope should identify the affected area:

| Scope      | Description      |
| ---------- | ---------------- |
| `db`       | Database changes |
| `ipc`      | IPC handlers     |
| `ui`       | User interface   |
| `auth`     | Authentication   |
| `project`  | Project module   |
| `settings` | Settings module  |

### Examples

```bash
# Feature
feat(project): add project archive functionality

# Bug fix
fix(db): resolve migration timing issue

# Refactor
refactor(ipc): extract common validation logic

# Documentation
docs: update API documentation

# Chore
chore: upgrade electron to v28
```

---

## Branch Naming

```
type/description
```

### Examples

```bash
# Feature branches
feat/project-archive
feat/dark-mode-support

# Bug fix branches
fix/login-crash
fix/db-migration-order

# Refactor branches
refactor/ipc-structure
refactor/type-definitions
```

---

## Commit Best Practices

### Keep Commits Atomic

Each commit should represent one logical change:

```bash
# GOOD - Separate commits
git commit -m "feat(project): add archive button to UI"
git commit -m "feat(project): implement archive procedure"
git commit -m "test(project): add archive procedure tests"

# BAD - Mixed changes
git commit -m "add archive feature and fix some bugs"
```

### Write Clear Descriptions

```bash
# GOOD - Clear description
feat(auth): add OAuth2 login with Google

# BAD - Vague
feat: update auth
```

### Use Body for Context

```bash
git commit -m "fix(db): handle null timestamps in migration

Previous migration assumed all records had timestamps.
This caused failures when upgrading from v1.0.

Fixes #123"
```

---

## Atomic Commit Strategy

When implementing a large feature, organize commits by **logical unit**, not by time.

### Commit Ordering Principle

**Dependency order**: Foundation → Components → Integration

```
1. Design tokens / styles     (foundation)
2. Utilities / hooks          (foundation)
3. Data / types               (foundation)
4. UI components              (building blocks)
5. Feature components         (building blocks)
6. Layout updates             (integration)
7. Pages                      (integration)
8. Config / dependencies      (infrastructure)
```

### Example: Blog Homepage Feature (14 commits)

| Order | Commit | Type | Logical Unit |
|-------|--------|------|--------------|
| 1 | `feat(styles): add design tokens...` | feat | Foundation - tokens |
| 2 | `feat(styles): add global styles...` | feat | Foundation - styles |
| 3 | `feat(lib): add utility functions...` | feat | Foundation - utils |
| 4 | `feat(data): add mock data...` | feat | Foundation - data |
| 5 | `feat(ui): add base UI components` | feat | Building blocks - UI |
| 6 | `feat(islands): add interactive...` | feat | Building blocks - islands |
| 7 | `feat(home): add homepage components` | feat | Building blocks - home |
| 8 | `feat(shared): add SocialLinks...` | feat | Building blocks - shared |
| 9 | `feat(layout): update Layout...` | feat | Integration - layout |
| 10 | `feat(pages): implement homepage...` | feat | Integration - pages |
| 11 | `feat(pages): add articles/about/projects` | feat | Integration - pages |
| 12-14 | `chore(deps/lint/task)...` | chore | Infrastructure |

### Atomic Commit Rules

1. **One logical change per commit**
   - Each commit should be independently reviewable
   - Each commit should leave the code in a working state

2. **Group related files**
   - `feat(ui): add base UI components` - all UI components together
   - `feat(islands): add interactive components` - all islands together

3. **Separate concerns**
   - Styles → Utils → Components → Pages
   - Don't mix style changes with feature logic

4. **Infrastructure last**
   - `chore(deps)`, `chore(lint)`, `chore(task)` at the end
   - These don't affect functionality

### Benefits

- **Easy code review**: Each commit tells a clear story
- **Easy rollback**: Can revert specific logical units
- **Clear history**: `git log` shows feature evolution
- **Bisect-friendly**: Easier to find when bugs were introduced

---

## Pre-Commit Checklist

Before committing:

- [ ] Code compiles (`pnpm typecheck`)
- [ ] Linting passes (`pnpm lint`)
- [ ] Tests pass (`pnpm test`)
- [ ] Commit message follows format
- [ ] Changes are atomic

---

## Pull Request Guidelines

### Title Format

Same as commit message:

```
type(scope): description
```

### Description Template

```markdown
## Summary

Brief description of changes.

## Changes

- Added X
- Fixed Y
- Refactored Z

## Testing

- [ ] Unit tests added/updated
- [ ] Manual testing done

## Screenshots

(if applicable)
```

---

## Summary

| Convention     | Format                     | Example                       |
| -------------- | -------------------------- | ----------------------------- |
| Commit message | `type(scope): description` | `feat(auth): add login`       |
| Branch name    | `type/description`         | `feat/oauth-login`            |
| Commit body    | Optional context           | Multi-line explanation        |
| PR title       | Same as commit             | `feat(auth): add OAuth login` |
