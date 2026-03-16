# Cross-tool orchestration starters

This directory provides lightweight starter assets for orchestration-oriented tools that expect in-repo workflow definitions.

## CrewAI

- `orchestration/crewai/agents.yaml` maps the specialist bench into reusable agent roles.
- `orchestration/crewai/tasks.yaml` shows basic routing, review, and release flows.

## LangChain / LangGraph

- `orchestration/langchain/agent-map.yaml` is a declarative graph starter showing role names, responsibilities, and common handoffs.

These are starter assets, not the canonical source of truth. When the bench changes, update the source surfaces first:
- `skills/`
- `.github/agents/`
- `codex/agents/`
- `claude/agents/`
