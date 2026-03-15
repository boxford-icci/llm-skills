# Troubleshooting

Use this when the llm-skills system starts feeling fuzzy, redundant, noisy, or hard to route.

## Problem: the prompt is too vague

Symptoms:
- generic feedback
- lots of hedging
- weak findings
- wrong agent chosen

Fix:
- ask one concrete question
- name the risk surface
- ask for a hard verdict
- specify whether you want routing, review, execution, or synthesis

Weak:
```text
Review this.
```

Better:
```text
Use The Security Engineer to identify real exploit paths in this admin API change and end with a fix-before-exposure / safe-enough verdict.
```

## Problem: too many agents are saying the same thing

Symptoms:
- duplicated findings
- inflated confidence from repetition
- long noisy outputs

Fix:
- reduce to the smallest useful fleet
- give each agent a distinct question
- remove redundant generalists

## Problem: the wrong agent was chosen

Symptoms:
- useful commentary, wrong lens
- concern mismatch
- missing the actual decision you needed

Fix:
- restate the core question
- use the routing matrix
- use the overlap rules
- if unsure, use The Orchestrator first

## Problem: synthesis is weak

Symptoms:
- just repeats each agent
- no final decision
- conflicts left unresolved

Fix:
- merge overlapping findings
- identify the true blockers
- distinguish must-fix from optional
- end with one decision

## Problem: the system is getting bloated

Symptoms:
- too many similar agents
- docs repeating each other
- hard to explain differences

Fix:
- use the change checklist
- require a distinct decision surface before adding agents
- prune or merge fuzzy roles
- update overlap rules when boundaries shift

## Problem: docs have drifted

Symptoms:
- README says one thing, prompts say another
- examples no longer match the bench
- tree view is out of date

Fix:
- update README
- update guide docs
- update templates
- update examples/recipes
- run the install/verify scripts and `git diff --check`

## Problem: an agent output is technically correct but not actionable

Symptoms:
- abstract commentary
- no trigger sequence
- no fix or next move

Fix:
- enforce the output contract
- ask for exact trigger, impact, and fix
- require a hard verdict where relevant

## Default recovery move

If you are unsure what to do next:
1. read `guide/quick-reference.md`
2. read `guide/agent-contracts.md`
3. use `The Orchestrator` with a concrete risk-framed prompt
