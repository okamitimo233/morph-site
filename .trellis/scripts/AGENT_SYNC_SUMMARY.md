# Agent Prompts Synchronization - Summary

## ✅ Completed

All agent prompts and jsonl files have been synchronized to ensure Ralph Loop compatibility.

---

## Changes Made

### 1. JSONL Files Updated

**Files:** All `check.jsonl`, `implement.jsonl`, `debug.jsonl` in `.trellis/tasks/`

**Change:** Normalized reason fields to consistent English identifiers

**Examples:**

| Before (Mixed)                     | After (English)                 |
| ---------------------------------- | ------------------------------- |
| `"检查代码质量规范遵循情况"`       | `CodeQualityCheck`              |
| `"前端质量规范，需添加格式化检查"` | `FrontendQualityWithFormatting` |
| `"Git 提交规范"`                   | `GitConventions`                |

**Why:** Ralph Loop generates completion markers from reason fields:

```
reason = "CodeQualityCheck"
      ↓
marker = "CODEQUALITYCHECK_FINISH"
```

Using consistent English identifiers ensures predictable marker names.

---

### 2. Agent Prompts Updated

#### check.md

**Added:**

- Clear Ralph Loop mechanism explanation
- Accurate completion marker examples matching jsonl format
- Explicit requirement to output markers AFTER running checks

**Example section:**

```markdown
## Completion Markers (Ralph Loop)

For example, if check.jsonl contains:

{"file": "...", "reason": "CodeQualityCheck"}
{"file": "...", "reason": "GitConventions"}

You MUST output:

- CODEQUALITYCHECK_FINISH
- GITCONVENTIONS_FINISH
```

#### implement.md

**Added:**

- Explicit verification requirements section
- Must run lint/typecheck and show outputs
- Cannot skip verification

**New section:**

```markdown
**IMPORTANT**: After implementing, you MUST:

1. Run `pnpm lint` or equivalent lint command
2. Run `pnpm typecheck` or equivalent type check command
3. Run `pnpm build` if applicable
4. Fix any errors found
5. Report the actual command outputs in your summary
```

#### debug.md

**Added:**

- Explicit verification requirements section
- Must show actual command outputs
- Must fix any new issues introduced

---

### 3. New Tools Created

#### sync_agents.py

**Location:** `.trellis/scripts/sync_agents.py`

**Purpose:** Automate synchronization of agent prompts and jsonl files

**What it does:**

- Updates all jsonl files to use English identifiers
- Updates agent prompt files with correct examples
- Maintains consistency across the project

**Usage:**

```bash
python3 .trellis/scripts/sync_agents.py
```

#### verify_ralph_loop.py

**Location:** `.trellis/scripts/verify_ralph_loop.py`

**Purpose:** Verify Ralph Loop configuration is correct

**What it checks:**

- All jsonl files use English identifiers
- Agent prompts have accurate examples
- Markers can be generated correctly

**Usage:**

```bash
python3 .trellis/scripts/verify_ralph_loop.py
```

---

### 4. Documentation Created

#### AGENT_SYNC_GUIDE.md

**Location:** `.trellis/scripts/AGENT_SYNC_GUIDE.md`

**Content:**

- Complete explanation of Ralph Loop mechanism
- Naming convention for reason fields
- Troubleshooting guide
- Verification checklist

---

## How Ralph Loop Works

### 1. Check Agent Starts

Check agent is called with context from `check.jsonl`.

### 2. Hook Reads Required Markers

`ralph-loop.py` reads `check.jsonl` and generates completion markers:

```python
markers = get_completion_markers(repo_root, task_dir)
# Returns: ["CODEQUALITYCHECK_FINISH", "GITCONVENTIONS_FINISH", ...]
```

### 3. Check Agent Runs Checks

Check agent must:

1. Run lint and show output
2. Run typecheck and show output
3. Check all spec requirements
4. Output completion markers for each passed check

### 4. Ralph Loop Validates

When check agent tries to stop:

```python
all_complete, missing = check_completion(agent_output, markers)

if all_complete:
    allow_stop()  # All markers found
else:
    block_stop()  # Missing markers, continue loop
```

### 5. Loop Continues Until Complete

If markers are missing, Ralph Loop blocks the stop and check agent must continue.

---

## Verification Results

### Configuration Check

```
✅ All jsonl files use English identifiers
✅ All agent prompts have accurate examples
✅ All markers can be generated correctly
```

### Quality Check

```
✅ pnpm lint: 0 errors
✅ pnpm typecheck: 0 errors, 0 warnings, 0 hints
```

### Ralph Loop Test

```
Completion markers for modernize-config task:
  - FINISHWORKCHECKLIST_FINISH
  - CODEQUALITYSPEC_FINISH
  - CODEQUALITYCHECK_FINISH
  - FRONTENDQUALITYCHECK_FINISH
  - GITCONVENTIONSCHECK_FINISH
```

---

## Workflow for Future Tasks

### When Creating New Tasks

```bash
# 1. Create task
python3 .trellis/scripts/task.py create "My Feature" --slug my-feature

# 2. Initialize context (creates jsonl with English reasons)
python3 .trellis/scripts/task.py init-context <task-dir> <type>

# 3. Add context entries (use English PascalCase for reason)
python3 .trellis/scripts/task.py add-context <task-dir> implement ".trellis/spec/..." "CodeQualityGuide"
python3 .trellis/scripts/task.py add-context <task-dir> check ".trellis/spec/..." "CodeQualityCheck"
```

### When Updating Specs

```bash
# 1. Update spec files
# 2. Update jsonl context
python3 .trellis/scripts/task.py add-context <task-dir> check ".trellis/spec/new-guide.md" "NewGuideCheck"

# 3. Sync agent prompts if needed
python3 .trellis/scripts/sync_agents.py

# 4. Verify configuration
python3 .trellis/scripts/verify_ralph_loop.py
```

---

## Best Practices

### DO ✅

- Use English PascalCase for reason fields
- Update agent prompts when adding new check types
- Run verify_ralph_loop.py after changes
- Show actual command outputs in agent reports
- Output completion markers AFTER running checks

### DON'T ❌

- Use Chinese or mixed languages in reason fields
- Skip verification in implement/debug agents
- Output completion markers without running checks
- Forget to update trellis-local skill when modifying prompts

---

## Related Documents

| Document                                | Purpose                        |
| --------------------------------------- | ------------------------------ |
| `.trellis/scripts/AGENT_SYNC_GUIDE.md`  | Complete synchronization guide |
| `.agents/skills/trellis-local/SKILL.md` | Local customization tracking   |
| `.claude/hooks/ralph-loop.py`           | Ralph Loop implementation      |
| `.claude/agents/check.md`               | Check agent prompt             |
| `.trellis/scripts/sync_agents.py`       | Synchronization script         |
| `.trellis/scripts/verify_ralph_loop.py` | Verification script            |

---

## Next Steps

1. **Test with actual check agent run** - Verify markers are output correctly
2. **Update trellis-local skill** - Record all modifications (already done)
3. **Commit changes** - After human testing and approval
4. **Monitor Ralph Loop** - Ensure check agents complete successfully

---

**Date:** 2026-04-19
**Status:** ✅ Complete and Verified
