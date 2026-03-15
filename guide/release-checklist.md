# Release checklist

Use this before publishing or recommending an updated llm-skills bundle.

The goal is not to ship more files.
The goal is to ship a coherent bench.

## 1. Scope sanity

- Is the change real, not cosmetic churn?
- Does it improve routing, output quality, or maintainability?
- Did we avoid adding redundant roles or docs?

## 2. Asset alignment

Before release, make sure these still agree:

- `README.md`
- `CHANGELOG.md`
- `VERSION`
- `.github/agents/*.agent.md`
- `guide/*.md`
- `eval/*`
- `examples/*`
- `recipes/*`
- `templates/fleet-phase-prompts.md`
- `skills/manifest.txt`

## 3. Validation commands

Run these from the repository root:

```bash
git --no-pager diff --check
./scripts/bootstrap-copilot.sh "$(mktemp -d)"
```

If you want the explicit flow instead of the wrapper:

```bash
./scripts/install-copilot-agents.sh
./scripts/verify-copilot-agents.sh
./scripts/install-copilot-skills.sh
./scripts/verify-copilot-skills.sh
```

## 4. Guide and eval sanity

- Did we add or update eval cases if behavior changed materially?
- Do the examples still reflect the actual bench?
- Does the evaluation rubric still match the output quality bar?
- If the bench changed, do the overlap rules and pruning guide still make sense?

## 5. Release bar

Do not call the bundle ready if any are true:

- README pointers are stale
- examples no longer match the current bench
- eval cases miss the new risk surface
- bootstrap or verify scripts fail
- version stamp was not updated for a meaningful release

## 6. Final publish question

If a user installs this version today, will they get a clearer, more trustworthy system than the last version?

If not, do more work before release.
