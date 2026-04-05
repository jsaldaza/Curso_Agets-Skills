# AI Workflow Playbook

This guide explains how to use the AI agent system in this repository.

For the official rules and source of truth, always refer to `AGENTS.md`.

---

## Golden Rule

Never start with code.
Always start with understanding and planning.

---

## Standard Workflow

### 1. Discovery (Planner)

Start here for any new feature or idea.

Example:

Use planner to refine:
"Describe your idea here"

Expected outcome:
- Clarifying questions
- Feature breakdown
- Risks and missing requirements
- Suggested next step

---

### 2. Validation Strategy

Define validation coverage before implementation.

Example:

Use qa-strategy based on the previous plan

Expected outcome:
- Validation scenarios
- Edge cases
- Failure cases
- Risk areas

---

### 3. Development

Implement the feature based on the approved plan.

Example:

Use dev to implement the approved change

---

### 4. Specialized Validation

Use the validation agent that best matches the project.

- `qa-functional` for user-facing or flow-based behavior
- `qa-api` for API or service-level behavior

---

### 5. Review

Validate quality, risks, and edge cases.

Example:

Use reviewer to analyze this implementation

---

### 6. Regression

Ensure nothing else broke after changes.

Example:

Use qa-regression to validate impacted areas

---

## Recommended Flow

planner → qa-strategy → dev → qa-functional / qa-api → reviewer → qa-regression

Optional gates:
- meta
- security

---

## Common Mistakes

- Starting directly with code
- Skipping validation strategy
- Mixing responsibilities in one prompt
- Not validating edge cases
- Letting one agent do everything
- Forcing QA-specific patterns into projects that do not need them

---

## Tips

- Be explicit about which agent to use
- Keep prompts focused on one responsibility per step
- Iterate step by step
- Validate outputs before moving forward
- If something is unclear, go back to planner

---

## Recommended First Prompt

Use planner to refine:
"Describe your idea here"

---

## Mental Model

Think of agents as a team:

- planner → discovery and scoping
- qa-strategy → validation planning
- dev → implementation
- qa-functional / qa-api → specialized validation
- reviewer → code and architecture review
- qa-regression → stability check
- meta → readiness gate
- security → risk review

---

## Goal

Build features with clarity, safety, and minimal rework.
