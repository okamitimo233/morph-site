#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Verify Ralph Loop completion markers are correctly configured.

This script checks:
1. All jsonl files use English identifiers
2. Agent prompts have accurate examples
3. Markers can be generated correctly
"""

import json
import re
from pathlib import Path

def check_jsonl_reasons(file_path: Path) -> list[str]:
    """Check if jsonl file has non-English or inconsistent reasons."""
    issues = []

    if not file_path.exists():
        return [f"File not found: {file_path}"]

    with open(file_path, 'r', encoding='utf-8') as f:
        for line_num, line in enumerate(f, 1):
            line = line.strip()
            if not line:
                continue

            try:
                entry = json.loads(line)
                reason = entry.get('reason', '')

                # Check for Chinese characters
                if re.search(r'[\u4e00-\u9fff]', reason):
                    issues.append(f"Line {line_num}: Chinese characters in reason: '{reason}'")

                # Check for spaces (should be PascalCase)
                if ' ' in reason:
                    issues.append(f"Line {line_num}: Spaces in reason (use PascalCase): '{reason}'")

                # Check for lowercase start
                if reason and reason[0].islower():
                    issues.append(f"Line {line_num}: Reason starts with lowercase: '{reason}'")

            except json.JSONDecodeError as e:
                issues.append(f"Line {line_num}: Invalid JSON: {e}")

    return issues

def check_agent_prompt(file_path: Path, expected_pattern: str) -> list[str]:
    """Check if agent prompt has expected pattern."""
    issues = []

    if not file_path.exists():
        return [f"File not found: {file_path}"]

    content = file_path.read_text(encoding='utf-8')

    if expected_pattern not in content:
        issues.append(f"Missing pattern: '{expected_pattern[:50]}...'")

    return issues

def generate_marker_preview(jsonl_path: Path) -> str:
    """Generate a preview of completion markers."""
    markers = []

    if not jsonl_path.exists():
        return "File not found"

    with open(jsonl_path, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if not line:
                continue

            try:
                entry = json.loads(line)
                reason = entry.get('reason', '')
                if reason:
                    marker = f"{reason.upper().replace(' ', '_')}_FINISH"
                    if marker not in markers:
                        markers.append(marker)
            except json.JSONDecodeError:
                continue

    if not markers:
        return "No markers found"

    return '\n'.join(f"  - {marker}" for marker in markers)

def main():
    """Main verification function."""
    repo_root = Path(__file__).parent.parent
    tasks_dir = repo_root / '.trellis' / 'tasks'
    agents_dir = repo_root / '.claude' / 'agents'

    print("=" * 60)
    print("Ralph Loop Configuration Verification")
    print("=" * 60)
    print()

    all_issues = []

    # Check jsonl files
    print("1. Checking JSONL files...")
    if tasks_dir.exists():
        for task_dir in tasks_dir.iterdir():
            if task_dir.is_dir():
                for jsonl_file in ['check.jsonl', 'implement.jsonl', 'debug.jsonl']:
                    jsonl_path = task_dir / jsonl_file
                    if jsonl_path.exists():
                        issues = check_jsonl_reasons(jsonl_path)
                        if issues:
                            all_issues.extend([f"{jsonl_path.relative_to(repo_root)}: {issue}" for issue in issues])
                            print(f"  ❌ {jsonl_path.relative_to(repo_root)}")
                            for issue in issues:
                                print(f"     - {issue}")
                        else:
                            print(f"  ✅ {jsonl_path.relative_to(repo_root)}")
    print()

    # Check agent prompts
    print("2. Checking agent prompts...")
    checks = [
        ('check.md', 'reason": "CodeQualityCheck"'),
        ('implement.md', 'Run `pnpm lint`'),
        ('debug.md', 'Run `pnpm lint`'),
    ]

    for agent_file, pattern in checks:
        agent_path = agents_dir / agent_file
        if agent_path.exists():
            issues = check_agent_prompt(agent_path, pattern)
            if issues:
                all_issues.extend([f"{agent_file}: {issue}" for issue in issues])
                print(f"  ❌ {agent_file}")
                for issue in issues:
                    print(f"     - {issue}")
            else:
                print(f"  ✅ {agent_file}")
    print()

    # Show marker previews
    print("3. Completion marker previews...")
    if tasks_dir.exists():
        for task_dir in sorted(tasks_dir.iterdir()):
            if task_dir.is_dir():
                check_jsonl = task_dir / 'check.jsonl'
                if check_jsonl.exists():
                    print(f"\n  {task_dir.name}:")
                    print(generate_marker_preview(check_jsonl))
    print()

    # Summary
    print("=" * 60)
    if all_issues:
        print("❌ ISSUES FOUND:")
        for issue in all_issues:
            print(f"  - {issue}")
        print("\nRun: python3 .trellis/scripts/sync_agents.py")
    else:
        print("✅ All checks passed!")
        print("\nRalph Loop is correctly configured.")
    print("=" * 60)

    return len(all_issues)

if __name__ == '__main__':
    exit(main())
