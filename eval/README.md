# Eval harness

Use this directory to pressure-test whether the llm-skills bench is actually producing strong outputs.

This is a lightweight manual harness.
It is intentionally simple.

## What this is for

Use it to answer:
- did the right agent get chosen?
- was the answer specific and actionable?
- did the fleet stay small and non-redundant?
- did synthesis end in one real decision?

## How to use it

1. Pick a case from `eval/cases.md`.
2. Run the prompt with the named agent or fleet.
3. Score the answer with `guide/evaluation-rubric.md`.
4. Compare it to the golden shape in `examples/`.
5. If the answer is weak, improve the prompt, routing, or docs.

## What success looks like

A good result:
- uses the correct lens
- names the trigger and impact
- gives a concrete next move
- avoids duplicated commentary across agents
- ends with a hard verdict when the role calls for one

## What failure looks like

A weak result:
- picks the wrong agent
- uses a bloated fleet
- gives generic advice
- repeats points instead of synthesizing them
- sounds smart but is hard to act on
