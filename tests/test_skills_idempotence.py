from pathlib import Path


def required_paths(root: Path):
    return sorted(
        [
            root / ".agents" / "AGENT_MAPPING.md",
            root / ".agents" / "planner.agent.md",
            root / ".agents" / "dev.agent.md",
            root / ".agents" / "qa-strategy.agent.md",
            root / ".agents" / "qa-functional.agent.md",
            root / ".agents" / "qa-api.agent.md",
            root / ".agents" / "qa-regression.agent.md",
            root / ".agents" / "reviewer.agent.md",
            root / ".agents" / "meta.agent.md",
            root / ".agents" / "skills" / "00-project-profile" / "SKILL.md",
            root / ".agents" / "skills" / "10-plan-first" / "SKILL.md",
            root / ".agents" / "skills" / "20-safe-changes" / "SKILL.md",
            root / ".agents" / "skills" / "30-code-review" / "SKILL.md",
            root / ".agents" / "skills" / "40-tests" / "SKILL.md",
            root / ".codex" / "agents" / "builder.toml",
            root / ".codex" / "agents" / "workflow.toml",
            root / ".codex" / "agents" / "planner.toml",
            root / ".codex" / "agents" / "qa.toml",
            root / ".codex" / "agents" / "reviewer.toml",
            root / ".codex" / "agents" / "meta.toml",
            root / ".codex" / "agents" / "security.toml",
            root / ".vscode" / "settings.json",
            root / "scripts" / "pre-checks.sh",
            root / "scripts" / "post-report.sh",
            root / ".github" / "workflows" / "agent-safety.yml",
            root / "AGENTS.md",
            root / "README.md",
            root / "SECURITY.md",
            root / "AI_WORKFLOW.md",
            root / "SYSTEM_OVERVIEW.md",
        ]
    )


def test_required_files_exist():
    root = Path(__file__).resolve().parents[1]
    missing = [str(p) for p in required_paths(root) if not p.exists()]
    assert not missing, f"Missing required files: {missing}"


def test_manifest_is_stable():
    root = Path(__file__).resolve().parents[1]
    first = [str(p.relative_to(root)) for p in required_paths(root)]
    second = [str(p.relative_to(root)) for p in required_paths(root)]
    assert first == second, "Manifest changed between runs"
