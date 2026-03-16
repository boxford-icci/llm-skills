# LLM Skills — Cross-Tool Agent Instructions

This repository is a reusable bench of skills, specialist agents, and workflow templates.

## Source of truth

- Skills live in `skills/*/SKILL.md`.
- GitHub Copilot agent definitions live in `.github/agents/*.agent.md`.
- Codex-oriented agent mirrors live in `codex/agents/*.md`.
- Claude-oriented agent mirrors live in `claude/agents/*.md`.
- Reusable prompts live in `templates/` and `recipes/`.

## Working rules

- Keep roles sharp and opinionated. Do not collapse the bench into one giant meta-prompt.
- Treat `The Orchestrator` and `The Platform Administrator` as routers, not reviewers or implementers.
- Prefer the smallest useful specialist lineup.
- Update adjacent documentation when the public bench changes.
- Preserve naming, tone, and formatting patterns already used by nearby files.

## When editing the bench

If you add or change a skill or agent, check the matching surfaces:

- skill file in `skills/`
- GitHub Copilot agent in `.github/agents/` when applicable
- Codex mirror in `codex/agents/` when applicable
- Claude mirror in `claude/agents/` when applicable
- `README.md`
- `CHANGELOG.md`
- `VERSION` for meaningful bundle changes
- session `plan.md` when doing substantive repo work

## Validation

Run the existing repo checks after changes:

```bash
./scripts/bootstrap-copilot.sh <tmpdir>
./scripts/verify-copilot-agents.sh <tmpdir>/agents
./scripts/verify-copilot-skills.sh <tmpdir>/skills
git --no-pager diff --check
```

## Safety rules

- Do not invent hidden runtime bindings between skills and agents.
- Do not silently widen scope.
- Do not commit secrets or local-only credentials.
- Prefer precise edits over broad rewrites.
