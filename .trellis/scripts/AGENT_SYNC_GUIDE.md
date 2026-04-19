# Agent Prompts Synchronization Guide

> This document explains how agent prompts are synchronized to ensure Ralph Loop compatibility.

---

## Overview

The Ralph Loop system controls the check agent's stopping behavior. It requires check agent to output specific **completion markers** before allowing the agent to stop.

The markers are generated from `check.jsonl` in each task directory:

```json
{ "file": "...", "reason": "CodeQualityCheck" }
```

becomes:

```
CODEQUALITYCHECK_FINISH
```

---

## Problem Solved

Previously, jsonl files used **mixed Chinese and English** reason fields, causing inconsistent marker names:

- `"检查代码质量规范遵循情况"` → `检查代码质量规范遵循情况_FINISH` (Chinese in markers)
- Inconsistent naming made it hard for agents to predict the exact marker format

---

## Solution

### 1. Normalized Reason Fields

All reason fields in jsonl files now use **consistent English identifiers**:

| Old (Mixed)                        | New (English)               |
| ---------------------------------- | --------------------------- |
| `"检查代码质量规范遵循情况"`       | `CodeQualityCheck`          |
| `"检查前端质量规范遵循情况"`       | `FrontendQualityCheck`      |
| `"检查 Git 提交规范遵循情况"`      | `GitConventionsCheck`       |
| `"代码质量规范，需添加格式化要求"` | `CodeQualityWithFormatting` |
| `"TypeScript 最佳实践"`            | `TypeScriptBestPractices`   |

### 2. Updated Agent Prompts

All agent prompts now have:

**check.md:**

- Clear explanation of Ralph Loop mechanism
- Accurate examples matching jsonl format
- Explicit requirement to output markers AFTER running checks

**implement.md:**

- Added verification requirements section
- Must run lint/typecheck and show outputs
- Cannot skip verification

**debug.md:**

- Added verification requirements section
- Must show actual command outputs
- Must fix any new issues introduced

---

## How It Works

### check.jsonl Example

```json
{"file": ".claude/commands/trellis/finish-work.md", "reason": "FinishWorkChecklist"}
{"file": ".claude/commands/trellis/check.md", "reason": "CodeQualitySpec"}
{"file": ".trellis/spec/shared/code-quality.md", "reason": "CodeQualityCheck"}
{"file": ".trellis/spec/frontend/quality.md", "reason": "FrontendQualityCheck"}
{"file": ".trellis/spec/shared/git-conventions.md", "reason": "GitConventionsCheck"}
```

### Generated Markers

```
FINISHWORKCHECKLIST_FINISH
CODEQUALITYSPEC_FINISH
CODEQUALITYCHECK_FINISH
FRONTENDQUALITYCHECK_FINISH
GITCONVENTIONSCHECK_FINISH
```

### Check Agent Output Example

```markdown
## Self-Check Complete

### Files Checked

- src/components/Feature.tsx
- src/hooks/useFeature.ts

### Issues Found and Fixed

1. `src/components/Feature.tsx:45` - Removed non-null assertion
2. `src/hooks/useFeature.ts:12` - Added explicit return type

### Verification Results

- Prettier Format: Passed PRETTIER_FORMAT_FINISH
- Lint: 0 errors LINT_FINISH
- TypeCheck: 0 errors TYPECHECK_FINISH

### Summary

Checked 2 files, found 2 issues, all fixed.

FINISHWORKCHECKLIST_FINISH
CODEQUALITYSPEC_FINISH
CODEQUALITYCHECK_FINISH
FRONTENDQUALITYCHECK_FINISH
GITCONVENTIONSCHECK_FINISH
```

---

## Synchronization Script

**Location:** `.trellis/scripts/sync_agents.py`

**What it does:**

1. Updates all jsonl files to use English identifiers
2. Updates agent prompt files with correct examples
3. Maintains consistency across the project

**When to run:**

- After creating new tasks
- When adding new spec files to jsonl
- When updating agent prompts

**How to run:**

```bash
python3 .trellis/scripts/sync_agents.py
```

---

## Naming Convention

### Reason Field Format

Use **PascalCase** with descriptive names:

✅ Good:

- `CodeQualityCheck`
- `TypeScriptBestPractices`
- `FrontendQualityWithFormatting`

❌ Avoid:

- `code quality check` (spaces, lowercase)
- `code-quality-check` (hyphens)
- `代码质量检查` (Chinese)
- `check code quality` (sentence)

### Marker Generation Rule

```
reason = "CodeQualityCheck"
       ↓
marker = "CODEQUALITYCHECK_FINISH"
```

Rule: `reason.upper().replace(' ', '_') + '_FINISH'`

---

## Verification Checklist

When updating agent prompts or jsonl files:

- [ ] All reason fields use English PascalCase
- [ ] Agent prompts have accurate marker examples
- [ ] Check agent outputs markers after running checks (not before)
- [ ] Implement and debug agents show actual command outputs
- [ ] `sync_agents.py` script runs without errors

---

## Troubleshooting

### Check Agent Won't Stop

**Cause:** Missing completion markers in output

**Fix:**

1. Check `check.jsonl` for required markers
2. Ensure check agent ran all checks and showed outputs
3. Verify markers are present in final output

### Marker Format Mismatch

**Cause:** Reason field changed without updating agent prompt

**Fix:**

1. Run `python3 .trellis/scripts/sync_agents.py`
2. Verify agent prompt examples match jsonl
3. Test with a check agent run

### Mixed Chinese/English Markers

**Cause:** Old jsonl files with Chinese reasons

**Fix:**

1. Run `python3 .trellis/scripts/sync_agents.py`
2. Manually review updated files
3. Commit changes

---

## Related Files

| File                               | Purpose                         |
| ---------------------------------- | ------------------------------- |
| `.claude/hooks/ralph-loop.py`      | Ralph Loop implementation       |
| `.claude/agents/check.md`          | Check agent prompt              |
| `.claude/agents/implement.md`      | Implement agent prompt          |
| `.claude/agents/debug.md`          | Debug agent prompt              |
| `.trellis/scripts/sync_agents.py`  | Synchronization script          |
| `.trellis/tasks/*/check.jsonl`     | Task-specific check context     |
| `.trellis/tasks/*/implement.jsonl` | Task-specific implement context |

---

## Future Improvements

- [ ] Auto-run sync_agents.py in task.py init-context
- [ ] Add validation to reject non-English reasons
- [ ] Generate marker preview in task.py add-context
- [ ] Add pre-commit hook to verify jsonl consistency

---

**Last Updated:** 2026-04-19
