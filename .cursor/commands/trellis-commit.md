# Commit Code

Execute atomic commits after finish-work verification.

**Timing**: After `/trellis:finish-work` passes, before `/trellis:record-session`

---

## Prerequisites Check

```bash
# Verify clean state
pnpm lint && pnpm typecheck
git status
```

- [ ] Lint passes?
- [ ] TypeCheck passes?
- [ ] Changes exist to commit?

If any fails, stop and fix first.

---

## Step 1: Analyze Changes

```bash
git status --short
git diff --name-only
```

Categorize files by logical unit:

| Category       | Files                            | Examples                           |
| -------------- | -------------------------------- | ---------------------------------- |
| **Foundation** | tokens, styles, types, constants | `tokens.css`, `types.ts`           |
| **Utils**      | utilities, hooks, helpers        | `utils.ts`, `useTheme.ts`          |
| **Data**       | mock data, schemas, migrations   | `mock.ts`, `schema.sql`            |
| **UI**         | base components                  | `Button.astro`, `Card.astro`       |
| **Islands**    | interactive React components     | `Carousel.tsx`, `ThemeToggle.tsx`  |
| **Features**   | feature-specific components      | `Hero.astro`, `ArticleList.astro`  |
| **Shared**     | shared components                | `SocialLinks.astro`                |
| **Layout**     | layout files                     | `Layout.astro`                     |
| **Pages**      | page files                       | `index.astro`, `about.astro`       |
| **Config**     | config, dependencies             | `package.json`, `eslint.config.js` |

---

## Step 2: Generate Commit Plan

### Ordering Principle

**Foundation → Components → Integration → Infrastructure**

```
1. Styles/Tokens    (foundation)
2. Utils/Hooks      (foundation)
3. Data/Types       (foundation)
4. UI components    (building blocks)
5. Island components (building blocks)
6. Feature components (building blocks)
7. Shared components (building blocks)
8. Layout updates   (integration)
9. Pages            (integration)
10. Config/Deps     (infrastructure)
```

### Commit Message Format

Follow `.trellis/spec/shared/git-conventions.md`:

```
type(scope): description

[optional body with bullet points]
```

**Types**: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`

**Scopes**: Module or area name (e.g., `styles`, `ui`, `auth`, `db`)

### Grouping Rules

1. **Same category** files can be in one commit
2. **Related changes** should be in one commit (e.g., component + its styles)
3. **Max 10 files per commit** - if more, split by sub-category
4. **Config/deps commits last** - infrastructure changes at the end

---

## Step 3: Show Preview

Display commit plan in table format:

```
## Commit Plan (N commits)

| # | Type | Scope | Files | Message |
|---|------|-------|-------|---------|
| 1 | feat | styles | 2 | feat(styles): add design tokens with OKLCH |
| 2 | feat | lib | 2 | feat(lib): add utility functions and theme hook |
| 3 | feat | ui | 6 | feat(ui): add base UI components |
| ... | ... | ... | ... | ... |

Total: N files, M commits
```

---

## Step 4: User Confirmation

Ask user:

> Execute N commits? [Y/n/e=edit/s=single]

| Option | Action                              |
| ------ | ----------------------------------- |
| `Y`    | Execute all commits as planned      |
| `n`    | Cancel, do not commit               |
| `e`    | Edit commit plan (provide guidance) |
| `s`    | Combine all into single commit      |

---

## Step 5: Execute Commits

For each commit in order:

```bash
git add <files>
git commit -m "<message>"
```

Track progress:

```
[1/N] feat(styles): add design tokens... ✓
[2/N] feat(lib): add utility functions... ✓
...
[N/N] chore(deps): update dependencies ✓

Done! N commits created.
```

---

## Post-Commit

After commits complete:

1. Show summary:

   ```
   git log --oneline -N
   git status
   ```

2. Remind next step:
   > Next: Run `/trellis:record-session` to record this work

---

## Special Cases

### Case: Only 1-2 Files Changed

Skip atomic commits, use single commit:

```bash
git add <files>
git commit -m "<message>"
```

### Case: User Wants Single Commit

Combine all with comprehensive message:

```bash
git add -A
git commit -m "feat(scope): implement feature name

- Added X
- Updated Y
- Fixed Z"
```

### Case: No Changes

Report and exit:

> No changes to commit. Working tree clean.

---

## Reference

- Commit conventions: `.trellis/spec/shared/git-conventions.md`
- Atomic commit strategy: `.trellis/spec/shared/git-conventions.md#atomic-commit-strategy`

---

## Command Flow

```
/trellis:commit
      ↓
[Prerequisites Check]
      ↓
[Analyze Changes] → Categorize files
      ↓
[Generate Commit Plan] → Apply ordering principle
      ↓
[Show Preview] → Display table
      ↓
[User Confirmation] → Y/n/e/s
      ↓
[Execute Commits] → git add + commit
      ↓
[Show Summary] → git log
      ↓
Next: /trellis:record-session
```
