# Repository purpose

This repository is a public library of reusable GitHub Copilot skills, custom agents, and workflow scaffolding. Keep changes aligned with that purpose. Prefer reusable prompts, routing logic, validation scripts, and documentation over repo-specific hacks.

# Working style

- Preserve the existing "specialist, not general helper" voice.
- Prefer small, focused assets over giant meta-prompts.
- Keep orchestrators lightweight. Routers should route, not redo specialist analysis.
- Do not imply unsupported runtime behavior such as hard-binding a skill to an agent or secretly forcing fleet internals.

# Skills

- Each skill lives in its own `skills/<name>/` directory and must include `SKILL.md`.
- When adding or removing a published skill, always update `skills/manifest.txt`.
- When adding or removing a published skill, always update `README.md`.
- Keep skill structure consistent with the existing set: frontmatter, anchor phrases or framing, domain examples, interrogations or process, output format.

# Agents

- Custom agents live in `.github/agents/` and should have one clear job.
- Specialist agents should do the analysis. Orchestrator-style agents should only route, scope, and synthesize completed specialist work when explicitly asked.
- Keep agent prompts concise, role-based, and operational.
- Execution and testing agents should feel direct, first-principles, and action-oriented rather than review-shaped or vague.

# Validation

- After editing skills, run the skills install and verify scripts.
- After editing agents, run the agents install and verify scripts.
- Prefer validating against a temporary target directory when possible.

# Documentation

- Keep README accurate whenever repository structure or usage changes.
- If you add a new workflow pattern, include a copy-paste-ready example.
