# Change checklist

Use this whenever you add, remove, split, or substantially redefine a skill, agent, example, or workflow pattern in this repository.

## 1. Scope check

- Is this a genuinely new decision surface?
- Does an existing agent or skill already cover it well enough?
- Can the overlap be explained in one or two rules?

If not, do not add it yet.

## 2. Asset update checklist

### If you changed agents

- Update `.github/agents/*.agent.md`
- Update `README.md`
- Update routing matrix
- Update overlap rules if boundaries changed
- Update `templates/fleet-phase-prompts.md` if workflows changed
- Add or update examples/recipes if usage changed materially
- Run `./scripts/install-copilot-agents.sh`
- Run `./scripts/verify-copilot-agents.sh`

### If you changed skills

- Update `skills/<name>/SKILL.md`
- Update `skills/manifest.txt` if published set changed
- Update `README.md`
- Run `./scripts/install-copilot-skills.sh`
- Run `./scripts/verify-copilot-skills.sh`

### If you changed guide docs

- Update the relevant `guide/*.md` files
- Keep README pointers accurate
- Keep examples aligned with the actual bench
- Run `git diff --check`

## 3. Quality questions

Before considering a change good, ask:

- Is routing clearer than before?
- Is overlap smaller or at least better explained?
- Does this reduce ambiguity rather than add more words?
- Would a new user choose the right agent more often after this change?
- Did we improve truthfulness, specificity, or usability?

## 4. Red flags

Stop and rethink if any are true:

- The new agent sounds like a renamed old agent.
- The new doc repeats README without adding decision value.
- The new workflow requires too many agents by default.
- The new prompt template is broad enough to fit almost anything.
- The change adds ceremony but not clarity.

## 5. Final validation

A good change should leave the repository in a state where:

- the bench is understandable
- the guide is discoverable
- the examples still match reality
- the install/verify scripts still pass
- the docs do not contradict each other
