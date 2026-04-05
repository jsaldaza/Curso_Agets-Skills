# Agent Mapping (Conceptual vs Execution)

## Purpose

This file maps the human-readable agent layer to the execution layer.

The repository is designed for general software development projects, not only QA-centric projects.

The workflow is:
- understand the request
- plan the work
- implement safely
- validate behavior
- review quality
- check regression risk
- enforce security guardrails

---

## Source of Truth

- Behavioral definitions → `.agents/*.md`
- Execution configuration → `.codex/agents/*.toml`

If there is any conflict:
1. `AGENTS.md` wins
2. then `.agents/*.md`
3. then `.codex/agents/*.toml`

---

## Mapping Table

| Conceptual Role (.agents) | Execution Role (.codex) | Description |
|---------------------------|-------------------------|-------------|
| planner                   | planner                 | Clarifies requirements and prepares direction |
| workflow                  | workflow                | Orchestrates stage transitions and handoffs |
| dev                       | builder                 | Implements approved changes |
| qa-strategy               | qa                      | Coordinates validation coverage |
| qa-functional             | qa                      | Validates user-facing or flow-based behavior |
| qa-api                    | qa                      | Validates API or service-level behavior |
| qa-regression             | qa                      | Checks for unintended breakage |
| reviewer                  | reviewer                | Performs critical quality review |
| meta                      | meta                    | Checks maturity and readiness |
| security                  | security                | Detects security risk and unsafe patterns |

---

## Validation Model

The conceptual layer splits validation into specialized perspectives:

- qa-strategy
- qa-functional
- qa-api
- qa-regression

In the execution layer, these may be coordinated through a single `qa` agent.

That is intentional:
- Conceptual layer → more granular reasoning
- Execution layer → simpler orchestration

---

## Naming Rules

- `dev` (conceptual) = `builder` (execution)
- `qa-*` (conceptual) = `qa` (execution aggregate)
- `workflow` (conceptual) = `workflow` (execution)
- `meta` (conceptual) = `meta` (execution)

---

## Design Principle

This system uses:
- granular thinking in the conceptual layer
- simpler execution in the runtime layer
- quality as a required part of the lifecycle, not the identity of the whole template

---

## Update This File When

Update this mapping if:
- a new agent is introduced
- an execution agent is renamed
- responsibilities change
- validation is split or merged

---

## Core Rule

> Every conceptual role must have a clear execution interpretation.
