# Pruning guide

Use this when the bench starts feeling crowded, redundant, or hard to route.

The goal is not to keep every role ever added.
The goal is to keep the smallest set of roles that improves decision quality.

## 1. When to prune

Prune when you see any of these patterns:

- two agents often produce the same findings
- users regularly choose the wrong adjacent agent
- overlap rules are getting longer instead of clearer
- one role exists mostly for symmetry, not utility
- a specialist no longer has a distinct decision surface

## 2. First question: is this a routing problem or a bench problem?

Before deleting anything, ask:

- is the role actually weak?
- or is the prompt weak?
- or is the routing guidance weak?

Fix prompts and routing first if the role still answers a distinct question well.
Prune only when the role itself is no longer earning its place.

## 3. Signals an agent should be merged or deleted

Strong prune signals:
- its outputs are usually better from another role
- its verdict rarely changes the final decision
- its examples sound like renamed versions of another agent
- its eval cases are hard to distinguish from a neighboring role
- it creates ceremony without improving clarity

## 4. Safe pruning process

1. Name the overlap explicitly.
2. Identify the stronger surviving role.
3. Move any uniquely valuable guidance into the surviving role or guide docs.
4. Update README, overlap rules, templates, examples, and eval cases.
5. Remove the weak role only after the new routing is clearer than before.

## 5. Merge patterns

### Merge if one role is mostly a subset

If one agent is mostly a narrower or weaker version of another, merge it.

### Keep separate if verdicts differ

If two agents ask different questions and can honestly disagree, keep them separate.

Examples:
- security vs reliability should stay separate
- designer vs accessibility should stay separate
- builder vs contract tester should stay separate when consumer breakage matters

## 6. Questions to ask before deleting a role

- What real question becomes harder to answer if this role disappears?
- Which surviving agent will own that question?
- Will routing become simpler for a new user?
- Do examples and eval cases still make sense after the change?

If you cannot answer those cleanly, do not prune yet.

## 7. Practical rule

A smaller bench is better only if it makes routing easier and outputs stronger.

Deleting useful distinction is not simplification.
It is quality loss.
