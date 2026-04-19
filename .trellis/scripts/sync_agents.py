#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Sync agent prompts and jsonl files to ensure Ralph Loop compatibility.

This script:
1. Updates check.jsonl to use consistent English identifiers
2. Updates implement.jsonl to use consistent English identifiers
3. Updates agent prompt files to ensure correct completion markers
"""

import json
import os
import re
from pathlib import Path

# Reason field translations (Chinese -> English)
REASON_TRANSLATIONS = {
    # Common reasons
    "代码质量规范": "CodeQuality",
    "检查代码质量规范遵循情况": "CodeQualityCheck",
    "代码质量规范遵循": "CodeQuality",
    "前端质量规范": "FrontendQuality",
    "检查前端质量规范遵循情况": "FrontendQualityCheck",
    "前端质量规范遵循": "FrontendQuality",
    "Git 提交规范": "GitConventions",
    "检查 Git 提交规范遵循情况": "GitConventionsCheck",
    "Git 规范遵循": "GitConventions",

    # Spec-related
    "TypeScript 最佳实践": "TypeScriptBestPractices",
    "TypeScript 规范": "TypeScriptSpec",
    "代码质量规范，需添加格式化要求": "CodeQualityWithFormatting",
    "前端质量规范，需添加格式化检查": "FrontendQualityWithFormatting",
    "Astro 集成规范，了解图片服务配置": "AstroIntegration",

    # Workflow
    "Project workflow and conventions": "WorkflowGuide",
    "Backend development guide": "BackendGuide",
    "Frontend development guide": "FrontendGuide",

    # Commands
    "Finish work checklist": "FinishWorkChecklist",
    "Code quality check spec": "CodeQualitySpec",
}

def normalize_reason(reason: str) -> str:
    """Normalize reason to consistent English identifier."""
    # Check if already in translation table
    if reason in REASON_TRANSLATIONS:
        return REASON_TRANSLATIONS[reason]

    # If contains Chinese, try to find best match
    if re.search(r'[\u4e00-\u9fff]', reason):
        for ch_pattern, eng_value in REASON_TRANSLATIONS.items():
            if ch_pattern in reason:
                return eng_value

    # If no match, convert to PascalCase
    # Remove special characters
    cleaned = re.sub(r'[^a-zA-Z0-9\s]', '', reason)
    # Convert to PascalCase
    words = cleaned.split()
    return ''.join(word.capitalize() for word in words if word)

def update_jsonl_file(file_path: Path) -> bool:
    """Update a jsonl file with normalized reasons."""
    if not file_path.exists():
        return False

    lines = []
    changed = False

    with open(file_path, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if not line:
                continue

            try:
                entry = json.loads(line)
                old_reason = entry.get('reason', '')
                new_reason = normalize_reason(old_reason)

                if old_reason != new_reason:
                    entry['reason'] = new_reason
                    changed = True

                lines.append(json.dumps(entry, ensure_ascii=False))
            except json.JSONDecodeError:
                # Keep invalid lines as-is
                lines.append(line)

    if changed:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write('\n'.join(lines) + '\n')

    return changed

def update_agent_prompts(agents_dir: Path):
    """Update agent prompt files with correct completion marker examples."""

    # Update check.md
    check_md = agents_dir / 'check.md'
    if check_md.exists():
        content = check_md.read_text(encoding='utf-8')

        # Update the completion markers section
        new_markers_section = '''## Completion Markers (Ralph Loop)

**CRITICAL**: You are in a loop controlled by the Ralph Loop system.
The loop will NOT stop until you output ALL required completion markers.

Completion markers are generated from `check.jsonl` in the task directory.
Each entry's `reason` field becomes a marker: `{REASON}_FINISH`

For example, if check.jsonl contains:

```json
{"file": "...", "reason": "TypeScriptSpec"}
{"file": "...", "reason": "CodeQualityCheck"}
{"file": "...", "reason": "GitConventions"}
```

You MUST output these markers when each check passes:

- `TYPESCRIPTSPEC_FINISH` - After TypeScript spec check passes
- `CODEQUALITYCHECK_FINISH` - After code quality check passes
- `GITCONVENTIONS_FINISH` - After Git conventions check passes

If check.jsonl doesn't exist or has no reasons, output: `ALL_CHECKS_FINISH`

**The loop will block you from stopping until all markers are present in your output.**'''

        # Find and replace the completion markers section
        pattern = r'## Completion Markers \(Ralph Loop\).*?(?=\n---|\n## |$)'
        content = re.sub(pattern, new_markers_section, content, flags=re.DOTALL)

        check_md.write_text(content, encoding='utf-8')
        print(f"Updated: {check_md}")

def main():
    """Main function."""
    repo_root = Path(__file__).parent.parent

    # Update jsonl files in task directories
    tasks_dir = repo_root / '.trellis' / 'tasks'
    if tasks_dir.exists():
        for task_dir in tasks_dir.iterdir():
            if task_dir.is_dir():
                for jsonl_file in ['check.jsonl', 'implement.jsonl', 'debug.jsonl', 'research.jsonl']:
                    jsonl_path = task_dir / jsonl_file
                    if update_jsonl_file(jsonl_path):
                        print(f"Updated: {jsonl_path}")

    # Update agent prompts
    agents_dir = repo_root / '.claude' / 'agents'
    if agents_dir.exists():
        update_agent_prompts(agents_dir)

    print("\n✅ Sync complete!")
    print("\nNext steps:")
    print("1. Review updated files")
    print("2. Test with a check agent run")
    print("3. Verify Ralph Loop detection works correctly")

if __name__ == '__main__':
    main()
