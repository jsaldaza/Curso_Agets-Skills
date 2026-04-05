---
name: plan-first
description: Produces a safe step-by-step plan before edits: scope, files, risks, and verification commands. Use for any non-trivial change.
---

# Plan First Protocol

## Output format (must follow)
1) Goal restatement (1 line)
2) Assumptions (explicit)
3) Proposed plan (max 7 steps)
4) Files to touch (with reason)
5) Risk list (top 3)
6) Verification checklist (commands from Project Profile)

## Guardrails
- Prefer smallest change that works.
- If missing commands, ask to fill Project Profile skill.
- No mass refactors without explicit user approval.
