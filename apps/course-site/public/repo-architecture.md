# Repository Architecture (Course View)

This page mirrors the full architecture blueprint used in the repository.

For complete details and governance context, open:
- `REPO_ARCHITECTURE.md` at repository root

## Layer model

1. Governance (root markdowns + policies)
2. Conceptual design (`.agents`)
3. Runtime execution (`.codex`)
4. Product implementation (`apps/course-site` + `src` sample)
5. Validation and safety (`tests`, `scripts`, workflows)

## Core principle

Clarity first, implementation second, validation third, release last.

## Why this matters

- Reduces role confusion
- Improves traceability
- Makes quality and security explicit
- Keeps educational content aligned with real engineering workflow
