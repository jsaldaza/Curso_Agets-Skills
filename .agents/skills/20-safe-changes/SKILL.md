---
name: safe-changes
description: Applies changes safely: branch strategy, small diffs, checkpoints, and rollback plan. Use whenever editing code.
---

# Safe Changes Playbook

## Workflow
- Create a branch: `feat/{{short_desc}}` (or follow repo convention)
- Make changes in small commits (1 intent per commit)
- After each commit: run lint + unit tests
- Before finishing: run full verification checklist

## Required outputs
- What changed + why
- How to verify (exact commands)
- Rollback notes (what to revert if it breaks)

## Anti-patterns
- Editing many unrelated files at once
- "Fixing" style across the whole repo while doing feature work
