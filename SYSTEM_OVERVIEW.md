# AI Development System Overview

## Purpose

This repository is a structured system for building software with specialized AI agents.

It is not tied to a specific technology, framework, or project type.

It supports:
- web applications
- APIs
- scripts
- automation
- internal tools
- platform components
- mixed systems

---

## Core Idea

Work is divided into specialized roles to improve:
- clarity
- quality
- safety
- scalability

No single agent does everything.

---

## Architecture

### 1. Conceptual Layer (Source of Truth)

Defines behavior and responsibilities:

- `AGENTS.md` → official operating model
- `AI_WORKFLOW.md` → workflow explanation
- `.agents/*.md` → conceptual agent definitions
- `.agents/skills/*` → reusable rules
- `.agents/AGENT_MAPPING.md` → mapping between conceptual and execution layers

---

### 2. Execution Layer

Defines how agents run:

- `.codex/agents/*.toml`

---

### 3. Control Layer

Defines safety and enforcement:

- `SECURITY.md`
- `scripts/pre-checks.sh`
- `.github/workflows/agent-safety.yml`

---

### 4. Validation Layer

Ensures correctness and stability:

- `tests/*`

---

## Workflow

planner → qa-strategy → dev → qa-functional / qa-api → reviewer → qa-regression

Optional gates:
- meta
- security

---

## Agent Roles (Simplified)

- planner → clarifies and structures work
- dev (builder) → implements changes
- qa-strategy → defines validation coverage
- qa-functional / qa-api → specialized validation
- reviewer → analyzes quality and risks
- qa-regression → checks for unintended breakage
- meta → readiness gate
- security → risk review

---

## Key Principles

- Plan before building
- Validate before trusting
- Review before progressing
- Protect existing behavior
- Keep changes minimal and safe
- Stay domain-agnostic

---

## What This System Is Not

- Not tied to a framework or language
- Not a QA-only workflow
- Not a fully automated pipeline
- Not a replacement for product thinking

---

## Mental Model

Think in phases:

1. Understand
2. Plan
3. Build
4. Validate
5. Review
6. Protect (regression)
7. Decide (meta)

---

## Core Rule

> Clarity → Implementation → Validation → Review → Safety → Completion

---

## Goal

Provide a reliable, scalable, and safe way to build software using AI agents without losing control of quality or architecture.
