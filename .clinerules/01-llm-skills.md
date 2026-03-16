# Cline rules for llm-skills

Use `AGENTS.md` as the shared operating contract for this repository.

Project-specific rules:
- Skills belong in `skills/*/SKILL.md`.
- Copilot agents belong in `.github/agents/*.agent.md`.
- Claude mirrors belong in `claude/agents/*.md`.
- Codex mirrors belong in `codex/agents/*.md`.
- Keep routers as routers. Do not let `The Orchestrator` or `The Platform Administrator` become reviewers.
- When changing the public bench, update `README.md`, `CHANGELOG.md`, `VERSION`, and validation docs as needed.
- Validate with the existing bootstrap and verify scripts before considering the work done.
