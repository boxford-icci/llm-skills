# Glossary

Use this for the shared language behind the llm-skills system.

## Bench

The full set of skills, agents, prompts, recipes, examples, and guide docs working together.

## Specialist

A narrow agent with one clear decision surface.

## Orchestrator-first

The pattern of starting with `The Orchestrator` when you are unsure whether one specialist is enough or a fleet is needed.

## Fleet

A deliberately chosen set of specialists, each answering a different question.

A fleet is useful when concerns genuinely differ.
A fleet is noise when everyone is answering the same question.

## Smallest useful fleet

The fewest specialists needed to answer the real question without redundancy.

## Decision surface

The actual class of judgment an agent is meant to make.

Examples:
- ship risk
- rollout safety
- consumer compatibility
- accessibility
- root cause

## Output contract

The minimum information a good answer from an agent must contain.

## Hard verdict

A non-hedged ending decision such as:
- ship it
- fix then ship
- rethink
- safe to roll
- unsafe transition

## Deletion bias

The preference for removing steps, layers, or abstractions before adding more.

## First principles

Reasoning from real constraints, failure modes, and invariants instead of pattern imitation.

## Overlap rule

A rule that distinguishes when two adjacent agents should be used differently.

## Synthesis

The step where multiple specialist outputs are merged into one decision.

Good synthesis resolves overlap and conflict.
Bad synthesis just repeats each agent.

## Drift

The state where agents, README, templates, examples, and guide docs stop matching each other.

## Ceremony

Extra process or wording that makes the system feel heavier without increasing clarity or decision quality.
