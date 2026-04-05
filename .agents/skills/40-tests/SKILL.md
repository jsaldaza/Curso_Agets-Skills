---
name: tests
description: Creates a testing approach and writes/updates tests (unit/integration/e2e) using the project's stack. Use when adding or changing behavior.
---

# Testing Strategy + Implementation

## First: choose the right level
- Unit: pure logic, fastest
- Integration: DB/API boundaries
- E2E: user flows (small & stable)

## Must do
- Cover the "happy path" + one key negative case
- Avoid brittle selectors (for UI)
- Prefer deterministic waits/timeouts

## Output must include
- Test plan (bullets)
- What was automated vs left manual (and why)
- Any risk of flakiness + mitigation
