# Devin task guide for llm-skills

This repository works best when tasks are framed as explicit bench-maintenance or workflow-evolution jobs.

## Good Devin task shapes

- Add a new skill or specialist lane and wire it through all public surfaces.
- Update routing doctrine without changing unrelated roles.
- Add mirror files for another agent runtime while keeping behavior aligned.
- Expand evaluation assets or workflow templates with concrete examples.

## Required success criteria

A task is not done unless it includes:
- the primary file change
- required mirror or doc updates
- validation with the existing repo scripts
- a clear summary of what changed and why

## Validation commands

```bash
./scripts/bootstrap-copilot.sh <tmpdir>
./scripts/verify-copilot-agents.sh <tmpdir>/agents
./scripts/verify-copilot-skills.sh <tmpdir>/skills
git --no-pager diff --check
```
