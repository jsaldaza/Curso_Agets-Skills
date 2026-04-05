# Legacy tests (reference only)

This folder contains historical specs kept as **reference material**.

## Current status

- These specs are **not part of the active validation suite**.
- `npm test` only executes:
  - `tests/unit/*.test.js`
  - `tests/course/*.test.js`
- CI executes:
  - `npm run validate` (active Node suite)
  - `python tests/test_skills_idempotence.py`

## Why these tests are isolated

The files in this folder target a different application architecture than this template (e.g., Next.js route handlers under `@/app/api/...` and Playwright flows for routes such as `/login` and `/contact`).

The current template ships a static educational site (`apps/course-site`) plus a Node CLI example (`src/`), so these specs are intentionally excluded from required checks.

## Migration path (optional)

If you adopt a stack compatible with these specs:

1. Add and configure the corresponding test tooling (Vitest/Playwright).
2. Adapt imports and routes to your actual app structure.
3. Move migrated specs into active test scopes.
4. Update `package.json` and CI to run them.

Until then, treat this folder as archival guidance, not enforceable coverage.
