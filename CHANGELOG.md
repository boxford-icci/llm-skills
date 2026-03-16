# Changelog

## Current build-out

This repository was expanded from a skill library into a fuller Copilot operating system with specialist agents, routing guidance, examples, and evaluation support.

### Added skills

- `skills/ux-designer/`
- `skills/ui-designer/`

### Added provider-specific shipping lanes

- `skills/cloudflare-ship/`
- `skills/apple-ship/`
- `skills/aws-ship/`
- `skills/google-cloud-ship/`
- `skills/azure-ship/`
- `skills/supabase-ship/`
- `skills/vercel-ship/`
- `.github/agents/cloudflare-ship.agent.md`
- `.github/agents/apple-ship.agent.md`
- `.github/agents/aws-ship.agent.md`
- `.github/agents/google-cloud-ship.agent.md`
- `.github/agents/azure-ship.agent.md`
- `.github/agents/supabase-ship.agent.md`
- `.github/agents/vercel-ship.agent.md`

### Added custom agents

- `orchestrator.agent.md`
- `enforcer.agent.md`
- `architect.agent.md`
- `product-mind.agent.md`
- `builder.agent.md`
- `investigator.agent.md`
- `designer.agent.md`
- `product-design-review.agent.md`
- `executor.agent.md`
- `debugger.agent.md`
- `tester.agent.md`
- `breaker.agent.md`
- `security.agent.md`
- `performance.agent.md`
- `reliability.agent.md`
- `migration.agent.md`
- `contract-tester.agent.md`
- `accessibility.agent.md`

### Added installation and verification tooling

- `scripts/install-copilot-agents.sh`
- `scripts/verify-copilot-agents.sh`
- `scripts/bootstrap-copilot.sh`

### Added routing and workflow support

- `.github/copilot-instructions.md`
- `.github/instructions/skills.instructions.md`
- `.github/instructions/agents.instructions.md`
- `templates/fleet-phase-prompts.md`
- `recipes/feature-workflow.md`
- `recipes/incident-workflow.md`
- `recipes/platform-change-workflow.md`

### Added guide set

- `guide/operating-model.md`
- `guide/quick-reference.md`
- `guide/change-checklist.md`
- `guide/prompt-patterns.md`
- `guide/agent-contracts.md`
- `guide/glossary.md`
- `guide/troubleshooting.md`
- `guide/evaluation-rubric.md`
- `guide/pruning-guide.md`
- `guide/release-checklist.md`
- `guide/self-audit.md`

### Added examples and goldens

- `examples/orchestrator-transcript.md`
- `examples/fleet-review-transcript.md`
- `examples/executor-transcript.md`
- `examples/security-review-transcript.md`
- `examples/migration-transcript.md`

### Added operational maturity support

- `VERSION`
- bumped to `0.6.0` for expanded provider-specific shipping and cross-tool setup support

### Added evaluation harness

- `eval/README.md`
- `eval/cases.md`

### Added cross-tool setup

- `AGENTS.md`
- `CLAUDE.md`
- `.cursor/rules/llm-skills.mdc`
- `.clinerules/01-llm-skills.md`
- `DEVIN_TASKS.md`
- `orchestration/crewai/agents.yaml`
- `orchestration/crewai/tasks.yaml`
- `orchestration/langchain/agent-map.yaml`
- `orchestration/README.md`

### Behavioral shift

The repo now supports:
- routing with a lightweight orchestrator
- execution, debugging, testing, security, reliability, migration, contract, design, and accessibility specialists
- evaluation of answer quality with reusable cases and rubrics
- one-command installation and verification for Copilot assets
