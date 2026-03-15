# Changelog

## Current build-out

This repository was expanded from a skill library into a fuller Copilot operating system with specialist agents, routing guidance, examples, and evaluation support.

### Added skills

- `skills/ux-designer/`
- `skills/ui-designer/`

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

### Added evaluation harness

- `eval/README.md`
- `eval/cases.md`

### Behavioral shift

The repo now supports:
- routing with a lightweight orchestrator
- execution, debugging, testing, security, reliability, migration, contract, design, and accessibility specialists
- evaluation of answer quality with reusable cases and rubrics
- one-command installation and verification for Copilot assets
