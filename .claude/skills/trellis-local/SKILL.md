# trellis-local

> Local customizations and extensions to the Trellis workflow framework.

---

## Base Version

- **Trellis Base**: Initial setup (2026-04-19)
- **Initialized**: 2026-04-19

---

## Purpose

This skill tracks all local modifications to the Trellis workflow, including:

- Custom commands (`.claude/commands/trellis/`)
- Spec customizations (`.trellis/spec/`)
- Workflow extensions

This ensures that updates to the base Trellis framework can be merged without losing local customizations.

---

## Commands Modified

| Command          | Change                              | Date       |
| ---------------- | ----------------------------------- | ---------- |
| `finish-work.md` | Added formatting check step         | 2026-04-19 |
| `commit.md`      | Added format check to prerequisites | 2026-04-19 |

---

## Specs Customized

| Spec File                | Change                                    | Date       |
| ------------------------ | ----------------------------------------- | ---------- |
| `shared/code-quality.md` | Added Prettier formatting section         | 2026-04-19 |
| `shared/index.md`        | Added format check to Before Every Commit | 2026-04-19 |
| `frontend/quality.md`    | Added formatting to Before Every Commit   | 2026-04-19 |

---

## Local Configuration Files

| File                      | Purpose                                 |
| ------------------------- | --------------------------------------- |
| `.prettierrc.json`        | Prettier configuration (Standard style) |
| `.prettierignore`         | Prettier ignore patterns                |
| `.editorconfig`           | Editor consistency settings             |
| `.vscode/settings.json`   | VS Code workspace settings              |
| `.vscode/extensions.json` | Recommended VS Code extensions          |

---

## Scripts Added

| Script                                   | Purpose                                   |
| ---------------------------------------- | ----------------------------------------- |
| `.trellis/scripts/sync_agents.py`        | Synchronize agent prompts and jsonl files |
| `.trellis/scripts/verify_ralph_loop.py`  | Verify Ralph Loop configuration           |
| `.trellis/scripts/AGENT_SYNC_GUIDE.md`   | Agent synchronization guide               |
| `.trellis/scripts/AGENT_SYNC_SUMMARY.md` | Summary of synchronization changes        |

---

## Changelog

### 2026-04-19

**Added:**

- Prettier configuration with Standard style (no semicolons, single quotes)
- EditorConfig for cross-editor consistency
- VS Code workspace settings and recommended extensions
- Format scripts to `package.json`: `format` and `format:check`
- Prettier to devDependencies
- Agent prompt synchronization script (`.trellis/scripts/sync_agents.py`)

**Removed:**

- `src/services/noop-image-service.ts` - No longer needed (using Astro default)
- Custom image service configuration from `astro.config.mjs`

**Updated:**

- `typescript-language-server` moved from dependencies to devDependencies
- Trellis spec files to include formatting requirements
- **Agent Prompts** - Unified English identifiers for completion markers:
  - `.claude/agents/check.md` - Updated completion marker examples
  - `.claude/agents/implement.md` - Added explicit verification requirements
  - `.claude/agents/debug.md` - Added explicit verification requirements
- **Task Context Files** - Normalized reason fields to English:
  - All `check.jsonl`, `implement.jsonl`, `debug.jsonl` files now use consistent English identifiers
  - Examples: `CodeQualityCheck`, `FrontendQualityCheck`, `GitConventionsCheck`

---

## Sync Notes

When updating the base Trellis framework:

1. Check if `finish-work.md` has new sections - merge with formatting check
2. Check if `commit.md` prerequisites changed - merge with format check
3. Check if `code-quality.md` has new sections - merge with formatting section
4. Review `shared/index.md` checklist - preserve format check item
5. **Check agent prompts** - Ensure completion markers use English identifiers:
   - Run `.trellis/scripts/sync_agents.py` to sync jsonl files
   - Verify `.claude/agents/check.md` completion marker examples match
   - Ensure implement and debug agents have verification requirements

---

## Related Documents

| Document                                  | Purpose                  |
| ----------------------------------------- | ------------------------ |
| `.trellis/workflow.md`                    | Main workflow definition |
| `.trellis/spec/shared/code-quality.md`    | Code quality standards   |
| `.claude/commands/trellis/finish-work.md` | Pre-commit checklist     |
