# Claude Code instructions for llm-skills

Start with `AGENTS.md` for the shared repository contract.

## Claude-specific map

- Claude agent mirrors live in `claude/agents/`.
- GitHub Copilot source agents live in `.github/agents/`.
- Skills live in `skills/*/SKILL.md`.

## Expectations

- Keep specialist roles narrow, explicit, and evidence-driven.
- Preserve the router-only behavior of `The Orchestrator` and `The Platform Administrator`.
- When a bench change affects public usage, update `README.md`, `CHANGELOG.md`, and `VERSION`.
- Prefer editing the smallest set of files that keeps the bench coherent across Copilot, Codex, and Claude mirrors.

## Validation

```bash
./scripts/bootstrap-copilot.sh <tmpdir>
./scripts/verify-copilot-agents.sh <tmpdir>/agents
./scripts/verify-copilot-skills.sh <tmpdir>/skills
git --no-pager diff --check
```
