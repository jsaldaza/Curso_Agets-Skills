# AGENTS.md

This repository is a general software development template with an AI agent workflow.

## Purpose

This document defines the operating model for the repository. It explains how the conceptual agent layer, execution layer, and safety controls fit together.

## Source of Truth

- `AGENTS.md` → official operating model
- `AI_WORKFLOW.md` → explanatory guide
- `SYSTEM_OVERVIEW.md` → high-level summary
- `.agents/*.md` → conceptual agent definitions
- `.agents/AGENT_MAPPING.md` → conceptual vs execution mapping
- `.codex/agents/*.toml` → runtime execution configuration

If there is any conflict:
1. `AGENTS.md` wins
2. then `.agents/*.md`
3. then `.codex/agents/*.toml`

## Core Principle

Never start with code.

Always start with understanding, planning, and validation strategy.

## Official Workflow

For every new feature or significant change, follow this order:

1. `planner`
   - Clarify the request
   - Identify missing requirements
   - Break the work into clear steps
   - Detect risks and ambiguities

2. `qa-strategy`
   - Define validation coverage before implementation
   - Cover happy path, edge cases, and failure cases
   - Identify what should be automated and what needs manual review

3. `dev`
   - Implement the feature following the approved plan
   - Make minimal, safe changes
   - Avoid unnecessary complexity

4. `qa-functional` / `qa-api`
   - Validate the feature from the most relevant external perspective
   - Use the specialized validation path that matches the project

5. `reviewer`
   - Review code quality
   - Detect bugs, edge cases, and maintainability issues
   - Do not modify code

6. `qa-regression`
   - Validate impacted areas
   - Ensure existing functionality still works
   - Identify missing coverage

Optional gates:

- `meta` → checks readiness and maturity before advancing
- `security` → checks for security risks and unsafe patterns

## Agent Responsibilities

### planner
Use this agent during discovery.
Its job is to clarify vague ideas, identify missing information, and prepare a structured implementation direction.

### qa-strategy
Use this agent before coding.
Its job is to define validation coverage, edge cases, and risk areas.

### dev
Use this agent to implement the feature.
It should follow the plan and keep the changes focused and safe.

### qa-functional
Use this agent when the project has user-facing behavior that should be validated externally.
It should validate user flows, system behavior, or interface interactions when applicable.

### qa-api
Use this agent when the project exposes APIs, contracts, or service-level behavior.
It should check endpoints, payloads, responses, and failure cases when relevant.

### reviewer
Use this agent for code review.
It should only analyze and report issues, not edit files.

### qa-regression
Use this agent after changes are made.
It should verify that nothing else broke and that critical flows remain stable.

### meta
Use this agent to judge whether the work is mature enough to advance.
It can block progression when important gaps remain.

### security
Use this agent to analyze security risks and unsafe patterns.
It should not modify code.

## Rules

- Do not skip planning.
- Do not skip validation strategy.
- Do not mix multiple responsibilities in one step.
- Do not start implementation before the problem is understood.
- Do not let one agent do everything.
- Do not ignore edge cases.
- Do not treat validation as optional.
- Do not merge changes without review when quality matters.
- Do not force a QA-only mental model onto projects that do not need it.

## Working Style

- Prefer small, focused changes.
- Prefer explicit prompts over vague instructions.
- Prefer step-by-step progress over large jumps.
- Validate each stage before moving to the next one.

## Goal

Build software with clarity, traceability, safety, and minimal rework.
