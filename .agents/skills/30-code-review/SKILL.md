---
name: code-review
description: Performs a structured code review: correctness, security, maintainability, tests, and edge cases. Use before merge/PR.
---

# Code Review Checklist (Universal)

## 1) Correctness
- Logic matches requirement
- Edge cases handled
- Error handling is intentional

## 2) Security
- No secrets in logs
- Input validation
- Least privilege assumptions

## 3) Maintainability
- Clear naming
- Single responsibility
- No duplication

## 4) Tests
- New/changed behavior covered
- Flaky risks identified

## Output
- Must provide: (a) Must-fix items, (b) Nice-to-have, (c) Questions
