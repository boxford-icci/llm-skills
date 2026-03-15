---
applyTo: ".github/agents/**/*.md,scripts/*agents.sh"
---

When editing custom agents in this repository:

- Keep specialist agents narrow and role-based.
- Keep orchestrator or dispatcher agents lightweight. They should route work, define execution order, and stop unless asked to synthesize completed outputs.
- Do not claim unsupported guarantees such as hard-pinning skills to agents or automatically forcing fleet behavior.
- If an agent bundles multiple skills, make the bundle coherent and stage-aware.
- Execution and testing specialists should be concrete, direct, and first-principles. They should produce action, not generic commentary.
- After agent changes, run `./scripts/install-copilot-agents.sh` and `./scripts/verify-copilot-agents.sh`.
