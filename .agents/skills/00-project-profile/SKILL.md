---
name: project-profile
description: Collects and maintains a lightweight project profile (stack, commands, constraints) used as shared context for all other skills.
---

# Project Profile
> This is the ONLY place you customize per project. Keep it short.

## Identity
- Project name: AI Dev QA Blueprint — Course Site
- Repo type: Monorepo (template + course site + scripts)
- Domain: Developer Education / AI Engineering methodology

## Tech Stack
- Backend: Node.js static server (`apps/course-site/server.js`) — no framework
- Frontend: Vanilla HTML/CSS/JS (no build step), `apps/course-site/public/`
- Content: JSON files in `apps/course-site/content/` (ES + EN)
- Validation/Automation: Node `--test` runner + `assert/strict` (no Jest dependency)
- CI/CD: GitHub Actions (`.github/workflows/agent-safety.yml`), scripts in `scripts/`

## Commands (source of truth)
- Install: `npm install`
- Dev server: `node apps/course-site/server.js` (serves on port 3000)
- Unit tests: `npm test`
- Python skill idempotency check: `python tests/test_skills_idempotence.py`
- Pre-checks: `bash scripts/pre-checks.sh`
- Post-report: `bash scripts/post-report.sh`

## Key paths
- Course app root: `apps/course-site/public/`
- i18n: `apps/course-site/public/lang.js`
- Progress: `apps/course-site/public/progress.js`
- Content: `apps/course-site/content/*.json` (ES) + `*.en.json` (EN)
- Agents definitions: `.agents/*.agent.md`
- Skills: `.agents/skills/*/SKILL.md`
- Runtime config: `.codex/agents/*.toml`
- Tests (active): `tests/course/` + `tests/unit/`
- Tests (legacy/unrunnable): `tests/legacy/` (TypeScript specs — no app target)

## Constraints
- Never do without asking: deleting content JSON, breaking i18n keys, force-pushing, dropping test coverage
- Allowed to change freely: `apps/course-site/public/` (UI/styles/scripts), `content/*.json` (content enrichment), `tests/course/` (coverage additions)
- Secrets policy: never print/copy tokens, never commit .env

## Definition of Done (DoD)
- ✅ `npm test` → 0 failures
- ✅ i18n keys symmetric (ES + EN)
- ✅ No new elements added to HTML without a test assertion
- ✅ Minimal docs updated (README/CHANGELOG as needed)
- ✅ Rollback path identified before merging large changes
