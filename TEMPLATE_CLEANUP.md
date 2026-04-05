# Template Cleanup Guide

Use this guide to convert the repository from **reference implementation mode** (course app + demos + E2E tooling) to a **clean project template baseline**.

---

## Safety model

The cleanup script is safe by default:

- default mode = **dry-run** (no files are changed)
- apply mode = explicit `--apply`

---

## Commands

From repository root:

- Dry-run (recommended first):
  - `npm run template:cleanup:dry`

- Apply cleanup:
  - `npm run template:cleanup`

---

## What gets removed in apply mode

The script removes reference/demo assets such as:

- `apps/course-site/`
- `src/cli.js`, `src/expenseService.js`
- `data/expenses.json`
- `tests/course/`, `tests/e2e/`, `tests/legacy/`
- sample unit tests under `tests/unit/` (`filter`, `storage`, `progress`)
- reporting artifacts (`allure-*`, `playwright-report`, `test-results`)
- `playwright.config.js`

It also resets `package.json` scripts to generic placeholders and removes Playwright/Allure dev dependencies.

---

## Recommended workflow

1. Run dry-run and review target list.
2. Commit current state before cleanup.
3. Run apply mode.
4. Replace placeholder scripts with your real project commands.
5. Update:
   - `.agents/skills/00-project-profile/SKILL.md`
   - `README.md`
   - `START_HERE.md`

---

## Notes

- This cleanup is designed to preserve the agent workflow framework (`AGENTS.md`, `.agents/`, `.codex/`, security controls, and governance docs).
- If you want to keep any demo area, create a branch and adjust `scripts/template-cleanup.js` before running `--apply`.
