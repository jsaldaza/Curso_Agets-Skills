# START HERE

Use this runbook to get productive in this repository in ~10–15 minutes.

---

## 0) What this repo is

This template combines:

- an AI agent workflow model (`AGENTS.md`, `.agents/`, `.codex/agents/`)
- a real educational web app (`apps/course-site`)
- a CLI example (`src/`)
- active validation and safety controls (`tests/`, `scripts/`, `.github/workflows/`)

If you only do one thing first: read `AGENTS.md`.

If you want a neutral baseline (without the course/demo implementation), use `TEMPLATE_CLEANUP.md`.

---

## 1) Initial setup

1. Install dependencies
2. Run validation
3. Start the course site

Expected checkpoints:

- `npm run validate` finishes with all active tests passing.
- `npm run dev` serves the app at `http://localhost:3000`.

---

## 2) Know what is validated today

Active automated suite:

- `tests/unit/*.test.js`
- `tests/course/*.test.js`
- `tests/test_skills_idempotence.py` (CI gate)

Legacy specs are intentionally isolated in `tests/legacy/` and are not part of default checks.
See `tests/legacy/README.md`.

---

## 3) Customize before building features

Update your project profile in:

- `.agents/skills/00-project-profile/SKILL.md`

At minimum, adapt:

- identity
- stack
- commands
- constraints
- definition of done

This profile is the base context used by the workflow skills.

---

## 4) Run one full workflow cycle

For a non-trivial change, follow this sequence:

1. `planner`
2. `qa-strategy`
3. `dev`
4. `qa-functional` or `qa-api`
5. `reviewer`
6. `qa-regression`

Optional gates:

- `meta`
- `security`

Rule: do not skip planning or validation strategy.

---

## 5) Suggested first prompt

Use planner to refine:
"I want to implement <feature>. Please clarify scope, assumptions, risks, and step-by-step plan."

Then continue stage by stage.

---

## 6) Daily working checklist

- Small, focused changes
- Validate after each meaningful change (`npm run validate`)
- Keep docs aligned when architecture/workflow changes
- Avoid unrelated refactors in the same change

---

## 7) Common pitfalls

- Starting directly with code
- Treating legacy tests as active coverage
- Updating conceptual docs without runtime config updates
- Merging without regression validation

---

## 8) Useful references

- `AGENTS.md` (source of truth)
- `AI_WORKFLOW.md` (step-by-step usage)
- `SYSTEM_OVERVIEW.md` (mental model)
- `REPO_ARCHITECTURE.md` (layer map)
- `.agents/AGENT_MAPPING.md` (conceptual/runtime mapping)
- `SECURITY.md` (guardrails)

---

## 9) Done criteria for onboarding

You are ready to contribute when:

- you can explain the agent sequence in your own words,
- `npm run validate` is green locally,
- you can run one feature proposal through planner → qa-strategy,
- you know where active vs legacy tests live.
